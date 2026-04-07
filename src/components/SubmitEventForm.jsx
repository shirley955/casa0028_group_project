import { useMemo, useState } from 'react'
import './SubmitEventForm.css'
import { places } from '../data/places_full'
import { formatPlaceOptionLabel } from '../utils/eventUtils'

export default function SubmitEventForm({ onAddEvent, placeId, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Workshop',
    description: '',
    date: '',
    time: '',
    maxGuests: '',
    place_id: placeId || '',
  })

  const selectedPlace = useMemo(
    () => places.find((place) => String(place.place_id) === String(formData.place_id)),
    [formData.place_id],
  )

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function resetForm() {
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

  function handleSubmit(event) {
    event.preventDefault()

    if (!formData.title || !formData.description || !formData.date || !formData.place_id) {
      alert('Please complete the title, location, description, and date fields.')
      return
    }

    const selectedLocation = places.find((place) => String(place.place_id) === String(formData.place_id))

    const newEvent = {
      event_id: Date.now(),
      title: formData.title,
      event_category: formData.type,
      event_type: 'community-submission',
      start_time: [formData.date, formData.time].filter(Boolean).join(' · ') || formData.date,
      description: formData.description,
      place_id: formData.place_id,
      location_text: selectedLocation?.card_name || 'Community venue',
      venue: selectedLocation?.card_name || 'Community venue',
      postcode: selectedLocation?.meta?.card_postcode || '',
      price: formData.maxGuests ? `Capacity ${formData.maxGuests}` : 'Free / community-led',
      source: 'community-submission',
      url: '',
    }

    onAddEvent?.(newEvent)
    alert('Event submitted successfully. In a full platform flow, this would enter moderation before publishing.')
    resetForm()
  }

  function handleCancel() {
    resetForm()
    onCancel?.()
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
            placeholder="Add a clear event title"
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

        {!placeId && (
          <div className="submit-event-field submit-event-field-full">
            <label className="submit-event-label">Location</label>
            <select
              className="submit-event-select"
              name="place_id"
              value={formData.place_id}
              onChange={handleChange}
            >
              <option value="">Select a place</option>
              {places.slice(0, 80).map((place) => (
                <option key={place.place_id} value={place.place_id}>
                  {formatPlaceOptionLabel(place)}
                </option>
              ))}
            </select>
            <p className="submit-event-helper">
              Choose a venue so the event can connect to the Explore map and the place detail page.
            </p>
          </div>
        )}

        {selectedPlace && (
          <div className="submit-event-place-summary submit-event-field-full">
            <strong>Selected venue:</strong> {selectedPlace.card_name}
            <span>
              {[selectedPlace.meta?.card_postcode, selectedPlace.space_subtype_v2?.replaceAll('_', ' ')].filter(Boolean).join(' · ') || 'Community space'}
            </span>
          </div>
        )}

        <div className="submit-event-field submit-event-field-full">
          <label className="submit-event-label">Description</label>
          <textarea
            className="submit-event-textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the activity, who it is for, and what attendees should expect."
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
          <label className="submit-event-label">Time</label>
          <input
            className="submit-event-input"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <div className="submit-event-field">
          <label className="submit-event-label">Max guests</label>
          <input
            className="submit-event-input"
            type="number"
            min="1"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="submit-event-actions">
        <button type="button" className="submit-event-cancel" onClick={handleCancel}>
          Cancel
        </button>

        <button type="submit" className="btn-primary">
          Publish Event
        </button>
      </div>
    </form>
  )
}
