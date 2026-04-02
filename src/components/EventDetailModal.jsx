// 活动详情弹窗
// 被 EventCard.jsx 使用

// 跟place联动，This event is hosted at: → [Place name]（可点击）类似的。
// 用户流的优化很重要


import { useNavigate } from "react-router-dom";

export default function EventDetailModal({ data, onClose }) {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2>{data.title}</h2>

        <p>{data.description || "No description available."}</p>

        <p>
          <strong>Time:</strong> {data.start_time || "TBC"}
        </p>

        <p>
          <strong>Category:</strong> {data.event_category || "event"}
        </p>

        <p>
          <strong>Venue:</strong> {data.location_text || data.venue || "Unknown"}
        </p>

        <button
          onClick={() => {
            onClose();
            navigate(`/events/${data.event_id}`, {
                state: { from: "event" }
            });
          }}
        >
          View full details
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  width: "420px",
  maxHeight: "80vh",
  overflowY: "auto",
  margin: "100px auto",
  padding: "24px",
  borderRadius: "12px",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  cursor: "pointer",
};