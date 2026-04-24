import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useMemo, useState, useEffect, useRef } from 'react'
import { places } from '../data/places_full'
import { events } from '../data/events_full'
import { mapping } from '../data/mapping'
import SubmitEventForm from './SubmitEventForm'
import PlaceEditForm from './PlaceEditForm'
import './DetailPages.css'

export default function PlaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [showEditForm, setShowEditForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)

  // Refs let each optional form scroll into view after it opens.
  const editFormRef = useRef(null)
  const eventFormRef = useRef(null)

  const place =
    location.state?.place ||
    places.find((item) => String(item.place_id) === String(id))

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [id])

  useEffect(() => {
    if (location.state?.action === 'host') {
      setShowEventForm(true)
    }
  }, [location])

  useEffect(() => {
    if (showEditForm && editFormRef.current) {
      editFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [showEditForm])

  useEffect(() => {
    if (showEventForm && eventFormRef.current) {
      eventFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [showEventForm])

  const relatedEvents = useMemo(
    () =>
      mapping
        .filter((row) => String(row.place_id) === String(id))
        .map((row) =>
          events.find((event) => String(event.event_id) === String(row.event_id))
        )
        .filter(Boolean),
    [id]
  )

  if (!place) {
    return (
      <div className="detail-page">
        <button className="detail-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="content-card detail-card">
          <h2>Place not found</h2>
        </div>
      </div>
    )
  }

  const title =
    place.card_name ||
    place.card_type?.replace(/_/g, ' ') ||
    'Community space'

  return (
    <div className="detail-page">
      <button className="detail-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <section className="content-card detail-card">
        <p className="detail-eyebrow">Venue detail</p>

        <div className="detail-hero-layout">
          <div className="detail-hero-main">
            <h1 className="detail-title">{title}</h1>

            <div className="detail-image">
              {place.media?.[0]?.url ? (
                <img src={place.media[0].url} alt={title} />
              ) : (
                <div className="placeholder">Image coming soon</div>
              )}
            </div>
          </div>

          <div className="detail-side-panel">
            <div className="detail-grid">
              <div className="detail-grid-item">
                <strong>Type</strong>
                <span>{place.card_type || 'Unknown'}</span>
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
                <strong>Food share</strong>
                <span>{place.meta?.food_share_level || 'Unknown'}</span>
              </div>

              <div className="detail-grid-item">
                <strong>Capacity</strong>
                <span>{place.capacity || 'Unknown'}</span>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="btn-primary"
                onClick={() => setShowEventForm((v) => !v)}
              >
                Host event
              </button>

              <button
                className="btn-secondary"
                onClick={() => setShowEditForm((v) => !v)}
              >
                Improve Place Details
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="content-card detail-card">
        <div className="detail-section-head">
          <h2>Facilities</h2>
          <p className="detail-section-copy">
            Equipment and amenities available at this venue.
          </p>
        </div>

        {place.facilities?.length ? (
          <div className="chips">
            {place.facilities.map((f, i) => (
              <span key={i} className="chip">{f}</span>
            ))}
          </div>
        ) : (
          <p>No facilities listed yet.</p>
        )}
      </section>

      <section className="content-card detail-card">
        <div className="detail-section-head">
          <h2>Availability</h2>
          <p className="detail-section-copy">
            Current booking availability or time slots.
          </p>
        </div>

        {place.availability?.length ? (
          <div className="availability-list">
            {place.availability.map((slot, i) => (
              <div key={i} className="availability-item">{slot}</div>
            ))}
          </div>
        ) : (
          <p>No availability info yet.</p>
        )}
      </section>

      <section className="content-card detail-card detail-stack">
        <div className="detail-section-head">
          <h2>Events at this place</h2>
          <p className="detail-section-copy">
            Activities currently linked to this venue.
          </p>
        </div>

        {relatedEvents.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          relatedEvents.map((event) => (
            <div className="detail-list-item" key={event.event_id}>
              <h3>{event.title}</h3>
              <p>{event.start_time || 'TBC'}</p>

              <button
                className="btn-primary"
                onClick={() =>
                  navigate(`/events/${event.event_id}`, {
                    state: { from: 'place' },
                  })
                }
              >
                View event
              </button>
            </div>
          ))
        )}
      </section>

      {showEditForm && (
        <section ref={editFormRef} className="content-card detail-card">
          <PlaceEditForm
            place={place}
            onClose={() => setShowEditForm(false)}
          />
        </section>
      )}

      {showEventForm && (
        <section ref={eventFormRef} className="content-card detail-card">
          <h2>Host an event at this venue</h2>

          <SubmitEventForm
            placeId={place.place_id}
            onCancel={() => setShowEventForm(false)}
            onAddEvent={() => setShowEventForm(false)}
          />
        </section>
      )}
    </div>
  )
}
