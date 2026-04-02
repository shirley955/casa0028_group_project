// 地图容器（Leaflet）
// 渲染地图 + markers
// 被 Explore.jsx 使用


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

  const data = mode === "event" ? (events || []) : (places || []);

  const geojson = useMemo(() => {
    const features = data
      .map((d) => {
        let lng, lat;

        if (mode === "event") {
          // 🔥 event: coords 是 string → parse
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
          // 🔥 place: 直接用 lat/lng
          lng = d.longitude;
          lat = d.latitude;
        }

        // 🔥 防止坏数据
        if (
          typeof lng !== "number" ||
          typeof lat !== "number" ||
          Number.isNaN(lng) ||
          Number.isNaN(lat)
        ) {
          return null;
        }

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

  const circleLayer = useMemo(
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
          16, 6,
        ],
        "circle-color": mode === "event" ? "#b3263d" : "#0c4a2f",
        "circle-stroke-width": 0.5,
        "circle-stroke-color": "#ffffff",
      },
    }),
    [mode]
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
        onClick={handleMapClick}
        interactiveLayerIds={["points-layer"]}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        <Source id="points-source" type="geojson" data={geojson}>
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