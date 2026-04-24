import { useEffect, useMemo, useState, useRef } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MapLegend.css";

export default function MapView({
  mode,
  events,
  places,
  setSelected,
  mapCenter,
  userLocation,
  setVisibleItems,
  hoveredId,
  mapReady,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  const [viewState, setViewState] = useState({
    longitude: mapCenter[0],
    latitude: mapCenter[1],
    zoom: 13,
  });

  const [popupInfo, setPopupInfo] = useState(null);

  const data = mode === "event" ? (events || []) : (places || []);

  useEffect(() => {
    if (!containerRef.current || !mapRef.current) return;

    const map = mapRef.current.getMap();

    const observer = new ResizeObserver(() => {
      map.resize();
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: mapCenter,
      duration: 1200,
      zoom: 13,
    });
  }, [mapCenter]);

  const getCoords = (d, currentMode = mode) => {
    let lng;
    let lat;

    if (currentMode === "event") {
      if (!d?.coords) return null;

      if (typeof d.coords === "string") {
        try {
          const parsed = JSON.parse(d.coords);
          lng = parsed[0];
          lat = parsed[1];
        } catch {
          return null;
        }
      } else if (Array.isArray(d.coords)) {
        lng = d.coords[0];
        lat = d.coords[1];
      } else {
        return null;
      }
    } else {
      lng = d?.longitude;
      lat = d?.latitude;
    }

    if (
      typeof lng !== "number" ||
      typeof lat !== "number" ||
      Number.isNaN(lng) ||
      Number.isNaN(lat)
    ) {
      return null;
    }

    return [lng, lat];
  };

  const isRenderableItem = (d, currentMode = mode) => {
    const coords = getCoords(d, currentMode);
    if (!coords) return false;

    if (currentMode === "event") {
      return (
        d?.event_id !== null &&
        d?.event_id !== undefined &&
        Boolean(d?.title) &&
        (Boolean(d?.postcode) || Boolean(d?.location_text) || Boolean(d?.venue))
      );
    }

    return (
      d?.place_id !== null &&
      d?.place_id !== undefined &&
      Boolean(d?.card_name)
    );
  };

  const updateVisibleItems = () => {
    if (!mapRef.current || !setVisibleItems) return;

    const map = mapRef.current.getMap();
    const bounds = map.getBounds();

    const inView = data.filter((d) => {
      if (!isRenderableItem(d, mode)) return false;

      const coords = getCoords(d, mode);
      if (!coords) return false;

      const [lng, lat] = coords;

      return (
        lng >= bounds.getWest() &&
        lng <= bounds.getEast() &&
        lat >= bounds.getSouth() &&
        lat <= bounds.getNorth()
      );
    });

    setVisibleItems(inView);
  };

  useEffect(() => {
    setPopupInfo(null);

    // Clear visible cards from the previous mode before recalculating the map view.
    if (setVisibleItems) {
      setVisibleItems([]);
    }

    if (!mapRef.current) return;
    updateVisibleItems();
  }, [mode, events, places]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    requestAnimationFrame(() => {
      map.resize();
    });
  }, [mode, events, places]);

  const baseItems = useMemo(() => {
    return data.filter((d) => {
      if (!isRenderableItem(d, mode)) return false;
      const id = mode === "event" ? d.event_id : d.place_id;
      return hoveredId === null || hoveredId === undefined || id !== hoveredId;
    });
  }, [data, mode, hoveredId]);

  const hoveredItem = useMemo(() => {
    if (hoveredId === null || hoveredId === undefined) return null;

    return (
      data.find((d) => {
        if (!isRenderableItem(d, mode)) return false;
        const id = mode === "event" ? d.event_id : d.place_id;
        return id === hoveredId;
      }) || null
    );
  }, [data, mode, hoveredId]);

  const baseGeojson = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: baseItems
        .map((d) => {
          const coords = getCoords(d, mode);
          if (!coords) return null;

          const [lng, lat] = coords;

          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            properties: {
              id: mode === "event" ? d.event_id : d.place_id,
              title:
                mode === "event"
                  ? d.title || "Untitled event"
                  : d.card_name || "Unnamed place",
              subtitle:
                mode === "event"
                  ? d.event_category || d.event_type || "event"
                  : d.card_type || "place",
              raw: JSON.stringify(d),
            },
          };
        })
        .filter(Boolean),
    };
  }, [baseItems, mode]);

  const hoveredGeojson = useMemo(() => {
    if (!hoveredItem) {
      return {
        type: "FeatureCollection",
        features: [],
      };
    }

    const coords = getCoords(hoveredItem, mode);
    if (!coords) {
      return {
        type: "FeatureCollection",
        features: [],
      };
    }

    const [lng, lat] = coords;

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          properties: {
            id: mode === "event" ? hoveredItem.event_id : hoveredItem.place_id,
            title:
              mode === "event"
                ? hoveredItem.title || "Untitled event"
                : hoveredItem.card_name || "Unnamed place",
            subtitle:
              mode === "event"
                ? hoveredItem.event_category || hoveredItem.event_type || "event"
                : hoveredItem.card_type || "place",
            raw: JSON.stringify(hoveredItem),
          },
        },
      ],
    };
  }, [hoveredItem, mode]);

  const baseCircleLayer = useMemo(
    () => ({
      id: "points-layer",
      type: "circle",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8, 3,
          12, 4,
          16, 5,
        ],
        "circle-color": mode === "event" ? "#b3263d" : "#0c4a2f",
        "circle-stroke-width": 0.8,
        "circle-stroke-color": "#ffffff",
      },
    }),
    [mode]
  );

  const hoveredHaloLayer = useMemo(
    () => ({
      id: "hovered-halo-layer",
      type: "circle",
      paint: {
        "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8, 18,
        12, 22,
        16, 26,
      ],
      "circle-color": "#e49000",

      "circle-opacity": 0.45,

      "circle-blur": 2.3,
      },
    }),
    []
  );

  const hoveredPointLayer = useMemo(
    () => ({
      id: "hovered-point-layer",
      type: "circle",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8, 4.5,
          12, 5.5,
          16, 6.5,
        ],
        "circle-color": "#e49000",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    }),
    []
  );

  const handleMapClick = (event) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const raw = feature.properties?.raw;
    if (!raw) return;

    const parsed = JSON.parse(raw);

    setPopupInfo({
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
      title: feature.properties.title,
      subtitle: feature.properties.subtitle,
      raw: parsed,
    });
  };

  const formatType = (str) => {
    if (!str) return "";

    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };


  return (
    <div className="map" ref={containerRef}>
      {mapReady && (
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onMoveEnd={updateVisibleItems}
          onLoad={() => {
            updateVisibleItems();

            const map = mapRef.current?.getMap();
            if (!map) return;

            setTimeout(() => {
              map.resize();
            }, 50);
          }}
          onClick={handleMapClick}
          interactiveLayerIds={["points-layer", "hovered-point-layer"]}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://tiles.stadiamaps.com/styles/alidade_smooth.json"
        >
          <Source id="points-source" type="geojson" data={baseGeojson}>
            <Layer {...baseCircleLayer} />
          </Source>

          <Source id="hovered-point-source" type="geojson" data={hoveredGeojson}>
            <Layer {...hoveredHaloLayer} />
            <Layer {...hoveredPointLayer} />
          </Source>

          {userLocation && (
            <Source
              id="user-location"
              type="geojson"
              data={{
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: userLocation,
                    },
                  },
                ],
              }}
            >
              <Layer
                id="user-point"
                type="circle"
                paint={{
                  "circle-radius": 7,
                  "circle-color": "#3B82F6",
                  "circle-stroke-width": 2.5,
                  "circle-stroke-color": "#ffffff",
                }}
              />
            </Source>
          )}

          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setPopupInfo(null)}
              offset={12}
            >
              <div className="map-popup">
                <p className="map-popup-tag">
                  {mode === "place"
                    ? popupInfo.subtitle
                        ?.toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : popupInfo.subtitle}
                </p>
                <h4>{popupInfo.title}</h4>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(popupInfo.raw);
                    setPopupInfo(null);
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          )}
        </Map>
      )}

      <div className="map-legend">
        <div className="legend-item">
          <span
            className={`legend-dot ${
              mode === "event" ? "legend-event" : "legend-place"
            }`}
          />
          <span>{mode === "event" ? "Event" : "Place"}</span>
          location
        </div>

        <div className="legend-item">
          <span className="legend-dot legend-hover" />
          <span>Selected card</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot legend-user" />
          <span>Your location</span>
        </div>
      </div>
    </div>
  );
}
