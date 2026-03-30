// 探索页面，包含map等组建，作为主要使用功能界面。用到地点位置与地点信息等数据
// 主页面（地图 + 筛选 + place列表）
// 是整个项目核心
import MapFilters from "../components/MapFilters"
import MapView from "../components/MapView"
import PlaceCard from "../components/PlaceCard"
import PlaceDetailModal from "../components/PlaceDetailModal"
import { useState } from "react"

// 🔥 假数据
const mockPlaces = [
  {
    id: 1,
    name: "Community Hall A",
    capacity: 30,
    area: "Hackney",
    coords: [51.545, -0.055], // 原格式
    events: [
      { id: 1, title: "Chinese Food Night" }
    ]
  }
]

export default function Explore() {
  const [selectedPlace, setSelectedPlace] = useState(null)

  return (
    <>
      <h1>Explore Spaces</h1>

      <MapFilters />

      <MapView onSelectPlace={setSelectedPlace} places={mockPlaces} />

      <h2>Available Spaces</h2>

      {mockPlaces.map(place => (
        <PlaceCard
          key={place.id}
          place={place}
          onClick={() => setSelectedPlace(place)}
        />
      ))}

      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </>
  )
}