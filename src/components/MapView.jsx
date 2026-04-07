import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView({
  mode,
  events,
  places,
  setSelected,
  mapCenter,
  userLocation,
  setVisibleItems,
  hoveredId   // ⭐ 新增
}) {
  const [viewState, setViewState] = useState({
    longitude: mapCenter[0],
    latitude: mapCenter[1],
    zoom: 12.5,
  });

  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: mapCenter,
      duration: 1200,
      zoom: 13,
    });
  }, [mapCenter]);

  /* ⭐ data */
  const data = mode === "event" ? (events || []) : (places || []);

  const getCoords = (d) => {
    let lng, lat;

    if (mode === "event") {
      if (!d.coords) return null;

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
      lng = d.longitude;
      lat = d.latitude;
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

  const updateVisibleItems = () => {
    if (!mapRef.current || !setVisibleItems) return;

    const map = mapRef.current.getMap();
    const bounds = map.getBounds();

    const inView = data.filter((d) => {
      const coords = getCoords(d);
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
    if (!mapRef.current) return;
    updateVisibleItems();
  }, [mode, data]);

  // ⭐ 修复地图缩小（核心）
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    requestAnimationFrame(() => {
      map.resize();
    });
  }, [data, mode]);

  const geojson = useMemo(() => {
    const features = data
      .map((d) => {
        const coords = getCoords(d);
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
                ? d.event_category || "event"
                : d.card_type || "place",
            raw: JSON.stringify(d),
          },
        };
      })
      .filter(Boolean);

    return {
      type: "FeatureCollection",
      features,
    };
  }, [data, mode]);

  const haloLayer = useMemo(
    () => ({
      id: "points-halo",
      type: "circle",
      paint: {
        "circle-radius": hoveredId
          ? [
              "case",
              ["==", ["get", "id"], hoveredId],
              30,   // ⭐ 光晕大小（可以调）
              0,
            ]
          : 0,

        "circle-color": "#ffcc00",

        "circle-opacity": 0.3,
        "circle-blur": 1.5,
      },
    }),
    [hoveredId]
  );

  // ⭐ 高亮逻辑（只改这里）
  const circleLayer = useMemo(
    () => ({
      id: "points-layer",
      type: "circle",
      paint: {
        "circle-radius": hoveredId
          ? [
              "case",
              ["==", ["get", "id"], hoveredId],
              26,   // ⭐ 更大（之前10不够）
              [
                "interpolate",
                ["linear"],
                ["zoom"],
                8, 3,
                12, 4,
                16, 6,
              ],
            ]
          : [
              "interpolate",
              ["linear"],
              ["zoom"],
              8, 3,
              12, 4,
              16, 6,
            ],

        // ⭐ hover 改亮色（关键）
        "circle-color": hoveredId
          ? [
              "case",
              ["==", ["get", "id"], hoveredId],
              "#ffcc00",   // ⭐ 高亮黄（非常明显）
              mode === "event" ? "#b3263d" : "#0c4a2f",
            ]
          : (mode === "event" ? "#b3263d" : "#0c4a2f"),

        // ⭐ 外圈更粗
        "circle-stroke-width": hoveredId
          ? [
              "case",
              ["==", ["get", "id"], hoveredId],
              3,
              0.5,
            ]
          : 0.5,

        "circle-stroke-color": "#ffffff",

        // ⭐ 光晕（核心提升感知）
        "circle-blur": hoveredId
          ? [
              "case",
              ["==", ["get", "id"], hoveredId],
              0.3,
              0,
            ]
          : 0,
      },
    }),
    [mode, hoveredId]
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

  return (
    <div className="map">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onMoveEnd={() => updateVisibleItems()}
        onLoad={() => {
          updateVisibleItems();

          const map = mapRef.current?.getMap();
          if (map) {
            requestAnimationFrame(() => {
              map.resize();
            });
          }
        }}
        onClick={handleMapClick}
        interactiveLayerIds={["points-layer"]}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        <Source id="points-source" type="geojson" data={geojson}>
          {/* ⭐ 光晕层（必须在前面） */}
          <Layer {...haloLayer} />

          {/* 原来的点 */}
          <Layer {...circleLayer} />
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
                "circle-radius": 8,
                "circle-color": "#3B82F6",
                "circle-stroke-width": 3,
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
              <p className="map-popup-tag">{popupInfo.subtitle}</p>
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
    </div>
  );
}