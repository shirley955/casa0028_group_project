import { useState } from "react";

export default function EventRegisterForm({ event, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    console.log("REGISTER:", {
      event_id: event.event_id,
      ...form,
    });

    alert("Successfully registered!");

    onClose();
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <button style={closeBtn} onClick={onClose}>✕</button>

        <h2>Join Event</h2>
        <p>{event.title}</p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Your name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            placeholder="Your email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  width: "400px",
  margin: "120px auto",
  padding: "24px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  cursor: "pointer",
};