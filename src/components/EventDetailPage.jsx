import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { events } from "../data/events_full";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;

  const event = events.find(
    (e) => String(e.event_id) === String(id)
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!event) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Event not found</h2>
        <button
          onClick={() => {
            navigate("/", { state: { mode: "event" } });
          }}
        >
          Back
        </button>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log("REGISTER:", {
      event_id: event.event_id,
      ...form,
    });

    setSubmitted(true);
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "auto" }}>
      
      {/* 🔥 只改这里 */}
      <button
        onClick={() => {
          if (from === "event") {
            navigate("/", { state: { mode: "event" } });
          } else {
            navigate("/");
          }
        }}
      >
        ← Back
      </button>

      <h1 style={{ marginTop: "10px" }}>{event.title}</h1>

      <p style={{ marginTop: "10px" }}>
        {event.description || "No description available."}
      </p>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Time:</strong> {event.start_time || "TBC"}</p>
        <p><strong>Category:</strong> {event.event_category || "event"}</p>
        <p><strong>Type:</strong> {event.event_type || "unknown"}</p>
        <p>
          <strong>Venue:</strong>{" "}
          {event.location_text || event.venue || "Unknown"}
        </p>
        <p><strong>Price:</strong> {event.price || "unknown"}</p>
      </div>

      {event.url && (
        <p style={{ marginTop: "10px" }}>
          <a href={event.url} target="_blank" rel="noreferrer">
            View original event ↗
          </a>
        </p>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h2>Join this event</h2>

      {submitted ? (
        <p style={{ color: "green" }}>
          ✅ You’ve successfully registered!
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <textarea
              placeholder="Any notes (optional)"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <button type="submit">
            Register
          </button>
        </form>
      )}
    </div>
  );
}