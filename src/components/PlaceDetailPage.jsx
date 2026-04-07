import { useNavigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { places } from '../data/places_full'
import { events } from '../data/events_full'
import { mapping } from '../data/mapping'
import SubmitEventForm from './SubmitEventForm'
import PlaceEditForm from './PlaceEditForm'
import './DetailPages.css'

export default function PlaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showEditForm, setShowEditForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)

  const place = places.find((item) => String(item.place_id) === String(id))

  const relatedEvents = useMemo(
    () =>
      mapping
        .filter((row) => String(row.place_id) === String(id))
        .map((row) => events.find((event) => String(event.event_id) === String(row.event_id)))
        .filter(Boolean),
    [id],
  )

  if (!place) {
    return (
      <div className="detail-page">
        <button className="detail-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="content-card detail-card">
          <h2>Place not found</h2>
          <p>This place record could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <button className="detail-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <section className="content-card detail-card">
        <p className="detail-eyebrow">Venue detail</p>
        <h1 className="detail-title">{place.card_name}</h1>
        <div className="detail-grid">
          <div className="detail-grid-item">
            <strong>Type</strong>
            <span>{place.card_type}</span>
          </div>
          <div className="detail-grid-item">
            <strong>Postcode</strong>
            <span>{place.meta?.card_postcode || 'Unavailable'}</span>
          </div>
          <div className="detail-grid-item">
            <strong>Access</strong>
            <span>{place.meta?.publicness_level || 'Unknown'}</span>
          </div>
          <div className="detail-grid-item">
            <strong>Food share level</strong>
            <span>{place.meta?.food_share_level || 'Unknown'}</span>
          </div>
        </div>

        <div className="detail-actions" style={{ marginTop: '24px' }}>
          <button className="btn-primary" type="button" onClick={() => setShowEditForm((value) => !value)}>
            Improve this place
          </button>
          <button className="btn-secondary" type="button" onClick={() => setShowEventForm((value) => !value)}>
            Add event here
          </button>
        </div>
      </section>

      <section className="content-card detail-card detail-stack">
        <h2>Events linked to this place</h2>
        {relatedEvents.length === 0 ? (
          <p>No mapped events yet.</p>
        ) : (
          relatedEvents.map((event) => (
            <div className="detail-list-item" key={event.event_id}>
              <h3>{event.title}</h3>
              <p>{event.start_time || 'TBC'}</p>
              <button className="btn-primary" type="button" onClick={() => navigate(`/events/${event.event_id}`, { state: { from: 'place', event } })}>
                View event
              </button>
            </div>
          ))
        )}
      </section>

      {showEditForm && (
        <section className="content-card detail-card">
          <PlaceEditForm place={place} onClose={() => setShowEditForm(false)} />
        </section>
      )}

      {showEventForm && (
        <section className="content-card detail-card">
          <h2>Host an event at this venue</h2>
          <SubmitEventForm placeId={place.place_id} onCancel={() => setShowEventForm(false)} onAddEvent={() => setShowEventForm(false)} />
        </section>
      )}
    </div>
  )
}
