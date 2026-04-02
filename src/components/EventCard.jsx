// 活动卡片
// 被 Events.jsx 使用

// 依旧显示筛选后结果。
import './EventCard.css'

export default function EventCard({ event }) {
  function handleClick() {
    alert(`You selected: ${event.title}`)
  }

  return (
    <article className="content-card event-card">
      <div className="event-card-image-wrap">
        <img
          src={event.image}
          alt={event.title}
          className="event-card-image"
        />
        <span className="event-card-date">{event.date}</span>
      </div>

      <div className="event-card-body">
        <p className="event-card-category">{event.category}</p>
        <h3>{event.title}</h3>
        <p className="text-muted">{event.description}</p>
        <button className="btn-primary" type="button" onClick={handleClick}>
          {event.buttonText}
        </button>
      </div>
    </article>
  )
}