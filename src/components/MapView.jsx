// 地图容器（Leaflet）
// 渲染地图 + markers
// 被 Explore.jsx 使用

import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

export default function MapView({ places, onSelectPlace }) {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [-0.05, 51.52],
      zoom: 11
    })

    mapRef.current = map

    places.forEach(place => {

      const popup = new maplibregl.Popup({
        closeOnClick: true
      }).setHTML(`
        <div>
          <h3>${place.name}</h3>
          <p>Capacity: ${place.capacity}</p>
          <button id="btn-${place.id}">
            View details
          </button>
        </div>
      `)

      const marker = new maplibregl.Marker()
        .setLngLat([place.coords[1], place.coords[0]])
        .setPopup(popup)
        .addTo(map)

      // ⭐关键：popup打开时绑定按钮事件
      popup.on("open", () => {
        const btn = document.getElementById(`btn-${place.id}`)
        if (btn) {
          btn.onclick = () => {
            onSelectPlace(place)
          }
        }
      })

    })

  }, [places, onSelectPlace])

  return (
    <div
      ref={mapContainer}
      style={{
        height: "600px",
        width: "100%",
        margin: "20px 0"
      }}
    />
  )
}