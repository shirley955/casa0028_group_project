import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { events } from '../data/events_full'
import { getEventDateLabel, getEventLocation, getEventShortDescription } from '../utils/eventUtils'
import './DetailPages.css'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const eventFromState = location.state?.event
  const event =
    eventFromState ||
    events.find((item) => String(item.event_id) === String(id))

  const [form, setForm] = useState({
    name: '',
    email: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)

  if (!event) {
    return (
      <div className="detail-page">
        <button className="detail-back" onClick={() => navigate('/events')}>
          ← Back to events
        </button>
        <div className="content-card detail-card">
          <h2>Event not found</h2>
          <p>The record may have been removed or is only available in the session where it was created.</p>
        </div>
      </div>
    )
  }

  const eventLocation = getEventLocation(event)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="detail-page">
      <button className="detail-back" onClick={() => navigate('/events')}>
        ← Back to events
      </button>

      <section className="content-card detail-card">
        <p className="detail-eyebrow">Event detail</p>
        <h1 className="detail-title">{event.title}</h1>
        <p className="text-muted">{getEventShortDescription(event, 420)}</p>

        <div className="detail-grid">
          <div className="detail-grid-item">
            <strong>Time</strong>
            <span>{getEventDateLabel(event)}</span>
          </div>
          <div className="detail-grid-item">
            <strong>Category</strong>
            <span>{event.event_category || 'Community event'}</span>
          </div>
          <div className="detail-grid-item">
            <strong>Venue</strong>
            <span>{eventLocation.name}</span>
          </div>
          <div className="detail-grid-item">
            <strong>Extra info</strong>
            <span>{eventLocation.subtitle || event.price || 'Details to be confirmed'}</span>
          </div>
        </div>

        <div className="detail-actions" style={{ marginTop: '24px' }}>
          {eventLocation.placeId && (
            <button className="btn-primary" type="button" onClick={() => navigate(`/places/${eventLocation.placeId}`)}>
              View venue details
            </button>
          )}
          {event.url && (
            <a className="btn-secondary" href={event.url} target="_blank" rel="noreferrer">
              Original listing
            </a>
          )}
        </div>
      </section>

      <section className="content-card detail-card">
        <h2>Join this event</h2>
        {submitted ? (
          <p>Thanks — your interest has been recorded for the prototype flow.</p>
        ) : (
          <form className="detail-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <textarea
              placeholder="Any notes or access requirements"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <div className="detail-actions">
              <button className="btn-primary" type="submit">
                Register interest
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
