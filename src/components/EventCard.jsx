import './EventCard.css'
import {
  getEventDateLabel,
  getEventDisplayType,
  getEventImage,
} from '../utils/eventUtils'

export default function EventCard({ data, onClick, onHover }) {
  if (!data || data.event_id === undefined || data.event_id === null) return null

  const postcode =
    data.postcode ||
    'Postcode unavailable'

  const category =
    getEventDisplayType(data) ||
    data.event_category ||
    data.event_type ||
    'Event'

  const title = data.title || 'Untitled event'

  return (
    <article
      className="content-card event-card"
      onClick={() => onClick?.(data)}
      onMouseEnter={() => onHover?.(data.event_id)}
      onMouseLeave={() => onHover?.(null)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && onClick) {
          event.preventDefault()
          onClick(data)
        }
      }}
    >
      <div className="event-card-image-wrap">
        <img
          className="event-card-image"
          src={getEventImage(data)}
          alt={title}
        />
        <span className="event-card-date">
          {getEventDateLabel(data)}
        </span>
      </div>

      <div className="event-card-body">
        <p className="event-card-category">{category}</p>

        <h3 className="event-card-title">{title}</h3>

        <p className="event-card-postcode">{postcode}</p>

        <button
          type="button"
          className="btn-primary"
          onClick={(event) => {
            event.stopPropagation()
            onClick?.(data)
          }}
        >
          View Details
        </button>
      </div>
    </article>
  )
}