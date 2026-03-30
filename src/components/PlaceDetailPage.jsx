// Images、Full description、Facilities、Calendar / slots、Booking form、Host event

// 最全的信息页面，
// 可以在这个页面提交booking信息，或跳转官方的booking页面、跳转参加活动等等

import { useParams, useNavigate } from "react-router-dom"

// ⭐ 先写死数据（之后再统一）
const mockPlaces = [
  {
    id: 1,
    name: "Community Hall A",
    capacity: 30,
    area: "Hackney",
    description: "Flexible community space",
    events: [
      { id: 1, title: "Chinese Food Night" }
    ]
  },
  {
    id: 2,
    name: "Church Kitchen",
    capacity: 50,
    area: "Tower Hamlets",
    description: "Well-equipped kitchen",
    events: [
      { id: 2, title: "Halal Cooking Workshop" }
    ]
  }
]

export default function PlaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  console.log("URL id:", id)  // ⭐调试用

  const place = mockPlaces.find(p => p.id === Number(id))

  // ⭐关键：防止空白
  if (!place) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Place not found</h2>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    )
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h1>{place.name}</h1>

      <p><strong>Capacity:</strong> {place.capacity}</p>
      <p><strong>Area:</strong> {place.area}</p>

      <p>{place.description}</p>

      <h2>Upcoming Events</h2>
      {place.events.map(e => (
        <p key={e.id}>• {e.title}</p>
      ))}

      <hr />

      <h2>Book this space</h2>
      <button>Request Booking</button>
    </div>
  )
}