// 地图筛选器（area / feature / availability）
// 控制地图和列表的数据过滤
// 被 Explore.jsx 使用
// 可能可以显示用户位置，或输入邮编跳转位置。使用fly to功能。

export default function MapFilters() {
  return (
    <div style={{ margin: "10px 0" }}>
      <input placeholder="Search..." />
      <button>Filter</button>
    </div>
  )
}