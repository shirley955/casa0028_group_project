// 地图容器（Leaflet）
// 渲染地图 + markers
// 被 Explore.jsx 使用

export default function MapView({ places, onSelectPlace }) {
  return (
    <div style={{
      height: "300px",
      background: "#eee",
      margin: "20px 0",
      padding: "10px"
    }}>
      <p>🗺️ Map Placeholder</p>

      {places.map(p => (
        <button
          key={p.id}
          onClick={() => onSelectPlace(p)}
          style={{ margin: "5px" }}
        >
          📍 {p.name}
        </button>
      ))}
    </div>
  )
}