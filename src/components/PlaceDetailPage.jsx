// Images、Full description、Facilities、Calendar / slots、Booking form、Host event

// 最全的信息页面，
// 可以在这个页面提交booking信息，或跳转官方的booking页面、跳转参加活动等等

// 加一个可以添加place detail的提交form。。。可以upload照片之类的

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { places } from "../data/places_full";
import { events } from "../data/events_full";
import { mapping } from "../data/mapping";

export default function PlaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showEditForm, setShowEditForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  const place = places.find((p) => p.place_id === id);

  // 👉 找这个place对应的events
  const relatedEvents = mapping
    .filter((m) => m.place_id === id)
    .map((m) => events.find((e) => e.event_id === m.event_id))
    .filter(Boolean);

  if (!place) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Place not found</h2>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "auto" }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h1>{place.card_name}</h1>

      <p><strong>Type:</strong> {place.card_type}</p>
      <p><strong>Location:</strong> {place.latitude}, {place.longitude}</p>

      {place.meta && (
        <>
          <p><strong>Access:</strong> {place.meta.publicness_level}</p>
          <p><strong>Food:</strong> {place.meta.food_share_level}</p>
        </>
      )}

      {/* 🔥 活动列表 */}
      <h2>Events at this place</h2>
      {relatedEvents.length === 0 && <p>No events yet</p>}
      {relatedEvents.map((e) => (
        <div key={e.event_id} style={{ marginBottom: "10px" }}>
          <strong>{e.title}</strong>
          <p>{e.start_time}</p>
        </div>
      ))}

      <hr />

      {/* 🔥 操作按钮 */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setShowEditForm(true)}>
          Improve this place
        </button>

        <button onClick={() => setShowEventForm(true)}>
          Add event here
        </button>
      </div>

      {/* 🔥 表单 */}
      {showEditForm && (
        <PlaceEditForm onClose={() => setShowEditForm(false)} place={place} />
      )}

      {showEventForm && (
        <EventSubmitForm
          onClose={() => setShowEventForm(false)}
          placeId={place.place_id}
        />
      )}
    </div>
  );
}