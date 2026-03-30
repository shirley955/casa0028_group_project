// 探索页面，包含map等组建，作为主要使用功能界面。用到地点位置与地点信息等数据
// 主页面（地图 + 筛选 + place列表）
// 是整个项目核心
import MapView from "../components/MapView"
import MapFilters from "../components/MapFilters"
import PlaceCard from "../components/PlaceCard"

function Explore() {
  return (
    <>
      <MapFilters />
      <MapView />
      <PlaceCard />
    </>
  )
}
