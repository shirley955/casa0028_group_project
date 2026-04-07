import { useNavigate } from 'react-router-dom'
import './EventDetailModal.css'
import {
  getEventDateLabel,
  getEventLocation,
  getEventShortDescription,
} from '../utils/eventUtils'

export default function EventDetailModal({ data, onClose }) {
  const navigate = useNavigate()

  if (!data) return null

  const location = getEventLocation(data)

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="content-card event-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="event-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="event-modal-header">
          <span className="event-modal-tag">{data.event_category || 'Event'}</span>
          <h2>{data.title}</h2>
          <p className="text-muted">{getEventShortDescription(data, 240)}</p>
        </div>

        <div className="event-modal-grid">
          <div className="event-modal-stat">
            <p className="event-modal-stat-label">Time</p>
            <p className="event-modal-stat-value">{getEventDateLabel(data)}</p>
          </div>

          <div className="event-modal-stat">
            <p className="event-modal-stat-label">Format</p>
            <p className="event-modal-stat-value">{data.event_type || 'In-person / TBD'}</p>
          </div>

          <div className="event-modal-stat">
            <p className="event-modal-stat-label">Venue</p>
            <p className="event-modal-stat-value">{location.name}</p>
          </div>

          <div className="event-modal-stat">
            <p className="event-modal-stat-label">Extra details</p>
            <p className="event-modal-stat-value">{location.subtitle || data.price || 'More information available on the detail page.'}</p>
          </div>
        </div>

        <div className="event-modal-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onClose()
              navigate(`/events/${data.event_id}`, {
                state: { from: 'event', event: data },
              })
            }}
          >
            View full details
          </button>

          {location.placeId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                onClose()
                navigate(`/places/${location.placeId}`, {
                  state: { from: 'event', event: data },
                })
              }}
            >
              View venue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
