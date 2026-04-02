// 基础的地点信息，比如位置邮编，有什么设施、具体可用空间多大、照片、booking slote之类的。

//Name、Features、Availability、Upcoming events
// [ View full details ]

//因为有更具体的可booking页面，这个modal要提供不同层级的信息，稍微详细，但不是全部。

// 如果是place拥有者，可以开放在网站booking的权限，可以修改place的具体信息，可以看到申请者的具体信息。
// booking detail
// 基本信息、简短描述、可用性
// Map → Popup → Modal →（继续操作 or 深入页面）

// 和Upcoming events联动，
// 按钮：
// View full details
// Request / Book
// Host event here


import { useNavigate } from "react-router-dom";
import { events } from "../data/events_full";
import { mapping } from "../data/mapping";

import "./PlaceDetailModal.css";

export default function PlaceDetailModal({ data, onClose }) {
  const navigate = useNavigate();

  if (!data) return null;

  // 🔥 找关联 events
  const relatedEvents = mapping
    .filter((m) => String(m.place_id) === String(data.place_id))
    .map((m) =>
      events.find((e) => String(e.event_id) === String(m.event_id))
    )
    .filter(Boolean);

  return (
    <div className="modal-overlay">
      <div className="modal">

        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>{data.card_name || "Unnamed place"}</h2>

        <p><strong>Type:</strong> {data.card_type || "Unknown"}</p>
        <p><strong>Postcode:</strong> {data.meta?.card_postcode || "Unavailable"}</p>
        <p><strong>Access:</strong> {data.meta?.publicness_level || "Unknown"}</p>
        <p><strong>Food share:</strong> {data.meta?.food_share_level || "Unknown"}</p>

        {/* 🔥 events section */}
        <div className="modal-events">
          <h3>Events here</h3>

          {relatedEvents.length === 0 ? (
            <p className="no-events">No events yet</p>
          ) : (
            relatedEvents.map((e) => (
              <div key={e.event_id} className="event-item">
                <p className="event-title">{e.title}</p>
                <p className="event-time">{e.start_time || "TBC"}</p>

                <button
                  onClick={() => {
                    onClose();
                    navigate(`/events/${e.event_id}`, {
                      state: { from: "explore", mode: "event" },
                    });
                  }}
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>

        <button
          className="modal-main-btn"
          onClick={() => {
            onClose();
            navigate(`/places/${data.place_id}`);
          }}
        >
          View full details
        </button>

      </div>
    </div>
  );
}