// 提交 event 表单，填写供审核的信息。
// 被 Events.jsx 使用
import { useState } from 'react'
import './SubmitEventForm.css'

export default function SubmitEventForm({ onAddEvent }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Workshop',
    description: '',
    date: '',
    time: '',
    maxGuests: '',
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
      title: formData.title,
      category: formData.type,
      date: formData.date,
      description: formData.description,
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      buttonText: 'View Details',
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
            placeholder="e.g. Community Garden Harvest"
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

        <div className="submit-event-field submit-event-field-full">
          <label className="submit-event-label">Description</label>
          <textarea
            className="submit-event-textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event goals and what participants should bring..."
          />
        </div>

        <div className="submit-event-field">
          <label className="submit-event-label">Date</label>
          <input
            className="submit-event-input"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="submit-event-field">
          <label className="submit-event-label">Start Time</label>
          <input
            className="submit-event-input"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <div className="submit-event-field">
          <label className="submit-event-label">Max Guests</label>
          <input
            className="submit-event-input"
            type="number"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            placeholder="25"
          />
        </div>
      </div>

      <div className="submit-event-actions">
        <button
          type="button"
          className="submit-event-cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button type="submit" className="btn-primary">
          Publish Event
        </button>
      </div>
    </form>
  )
}