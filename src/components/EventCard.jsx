import './EventCard.css'
import {
  getEventDateLabel,
  getEventDisplayType,
  getEventImage,
  getEventLocation,
  getEventShortDescription,
} from '../utils/eventUtils'

export default function EventCard({ data, onClick }) {
  if (!data) return null

  const location = getEventLocation(data)

  return (
    <article
      className="content-card event-card"
      onClick={() => onClick?.(data)}
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
        <img className="event-card-image" src={getEventImage(data)} alt={data.title} />
        <span className="event-card-date">{getEventDateLabel(data)}</span>
      </div>

      <div className="event-card-body">
        <p className="event-card-category">{getEventDisplayType(data)}</p>

        <h3>{data.title}</h3>

        <p className="text-muted event-card-description">{getEventShortDescription(data)}</p>

        <p className="event-card-location">
          <strong>Hosted at:</strong> {location.name}
        </p>

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
