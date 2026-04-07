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

  const relatedEvents = mapping
    .filter((m) => String(m.place_id) === String(data.place_id))
    .map((m) =>
      events.find((e) => String(e.event_id) === String(m.event_id))
    )
    .filter(Boolean);

  const title =
    data.card_name ||
    data.card_type?.replace(/_/g, " ") ||
    "Community space";

  return (
    <div className="modal-overlay">
      <div className="place-modal">

        <button className="modal-close" onClick={onClose}>✕</button>

        {/* HEADER */}
        <div className="place-modal-header">
          <p className="place-modal-tag">
            {data.card_type?.replace(/_/g, " ")}
          </p>
          <h2>{title}</h2>
        </div>

        {/* ⭐ IMAGE（新增核心） */}
        <div className="place-modal-image">
          {data.media?.[0]?.url ? (
            <img src={data.media[0].url} alt={title} />
          ) : (
            <div className="placeholder">Image coming soon</div>
          )}
        </div>

        {/* ⭐ QUICK INFO */}
        <div className="place-modal-grid">
          <div className="place-modal-block">
            <p className="label">Postcode</p>
            <p>{data.meta?.card_postcode || "Unavailable"}</p>
          </div>

          <div className="place-modal-block">
            <p className="label">Access</p>
            <p>{data.meta?.publicness_level || "Unknown"}</p>
          </div>

          <div className="place-modal-block">
            <p className="label">Capacity</p>
            <p>{data.capacity || "Unknown"}</p>
          </div>
        </div>

        {/* ⭐ FACILITIES（新增） */}
        <div className="place-modal-section">
          <h3>Facilities</h3>
          {data.facilities?.length ? (
            <div className="chips">
              {data.facilities.map((f, i) => (
                <span key={i} className="chip">{f}</span>
              ))}
            </div>
          ) : (
            <p className="muted">Not specified</p>
          )}
        </div>

        {/* ⭐ EVENTS */}
        <div className="place-modal-events">
          <h3>Events here</h3>

          {relatedEvents.length === 0 ? (
            <p className="no-events">No events yet</p>
          ) : (
            relatedEvents.slice(0, 2).map((e) => (
              <div key={e.event_id} className="event-item">
                <p className="event-title">{e.title}</p>
              </div>
            ))
          )}
        </div>

        {/* ⭐ CTA（关键） */}
        <div className="modal-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              onClose();
              navigate(`/places/${data.place_id}`);
            }}
          >
            View full details
          </button>

          <button
            className="btn-primary"
            onClick={() => {
              onClose();
              navigate(`/places/${data.place_id}`, {
                state: { action: "host" },
              });
            }}
          >
            Host event here
          </button>
        </div>

      </div>
    </div>
  );
}