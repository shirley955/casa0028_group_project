// 提交 event 表单，填写供审核的信息。
// 被 Events.jsx 使用
import { useState } from 'react'
import './SubmitEventForm.css'
import { places } from '../data/places_full'

export default function SubmitEventForm({ onAddEvent, placeId }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Workshop',
    description: '',
    date: '',
    time: '',
    maxGuests: '',
    place_id: placeId || '', // ✅ 默认带入
  })

  function handleChange(e) {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.date) {
      alert('Please complete the required fields.')
      return
    }

    const newEvent = {
      id: Date.now(),
      event_id: Date.now(), // ✅ 和你原数据结构兼容
      title: formData.title,
      event_category: formData.type,
      start_time: formData.date,
      description: formData.description,
      place_id: formData.place_id, // ✅ 关键
    }

    onAddEvent(newEvent)

    alert('Event submitted successfully!')

    setFormData({
      title: '',
      type: 'Workshop',
      description: '',
      date: '',
      time: '',
      maxGuests: '',
      place_id: placeId || '',
    })
  }

  function handleCancel() {
    setFormData({
      title: '',
      type: 'Workshop',
      description: '',
      date: '',
      time: '',
      maxGuests: '',
      place_id: placeId || '',
    })
  }

  return (
    <form className="content-card submit-event-form" onSubmit={handleSubmit}>
      <div className="submit-event-grid">

        <div className="submit-event-field">
          <label className="submit-event-label">Event Title</label>
          <input
            className="submit-event-input"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="submit-event-field">
          <label className="submit-event-label">Event Type</label>
          <select
            className="submit-event-select"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option>Workshop</option>
            <option>Food Drive</option>
            <option>Community Meal</option>
            <option>Volunteer</option>
          </select>
        </div>

        {/* ✅ 只有没有传 placeId 才允许选 */}
        {!placeId && (
          <div className="submit-event-field">
            <label className="submit-event-label">Location</label>
            <select
              className="submit-event-select"
              name="place_id"
              value={formData.place_id}
              onChange={handleChange}
            >
              <option value="">Select a place</option>

              {places.map((p) => (
                <option key={p.place_id} value={p.place_id}>
                  {p.card_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="submit-event-field submit-event-field-full">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="submit-event-field">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="submit-event-field">
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="submit-event-actions">
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>

        <button type="submit" className="btn-primary">
          Publish Event
        </button>
      </div>
    </form>
  )
}