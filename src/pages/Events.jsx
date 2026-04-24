import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/EventCard'
import EventDetailModal from '../components/EventDetailModal'
import SubmitEventForm from '../components/SubmitEventForm'
import { events as realEvents } from '../data/events_full'
import { FEATURED_EVENT_IDS, getEventDisplayType } from '../utils/eventUtils'
import './Events.css'

function getCuratedEvents(events) {
  const submissions = events.filter((event) => event?.source === 'community-submission')
  const featured = FEATURED_EVENT_IDS
    .map((id) => events.find((event) => String(event.event_id) === String(id)))
    .filter(Boolean)

  const seen = new Set()
  return [...submissions, ...featured].filter((event) => {
    const key = String(event.event_id)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export default function Events() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState(realEvents || [])
  const curatedEvents = useMemo(() => getCuratedEvents(events), [events])
  const [activeFilter, setActiveFilter] = useState('All Events')

  function handleAddEvent(newEvent) {
    setEvents((prevEvents) => [newEvent, ...prevEvents])
  }

  const types = useMemo(
    () => ['All Events', ...new Set(curatedEvents.map((event) => getEventDisplayType(event)).filter(Boolean))],
    [curatedEvents],
  )

  const filteredEvents = curatedEvents.filter((event) => {
    if (activeFilter === 'All Events') return true
    return getEventDisplayType(event) === activeFilter
  })

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="events-page">
      <section className="events-hero">
        <div className="events-hero-text">
          <p className="events-eyebrow">Community First</p>

          <h1 className="events-title">Nourishing Our Neighborhood Through Shared Events.</h1>

          <p className="events-subtitle">
            Explore food-related events across the city, with venue links where available to help you understand the spaces behind them.
          </p>

          <div className="events-hero-actions">
            <button className="btn-primary" type="button" onClick={() => scrollToSection('events-list')}>
              Explore All Events
            </button>

            <button className="btn-secondary" type="button" onClick={() => setShowForm(true)}>
              Submit Event
            </button>
          </div>
        </div>

        <div className="events-hero-image-card content-card">
          <img
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"
            alt="Community kitchen"
            className="events-hero-image"
          />

          <div className="events-impact-badge">
            <strong>9</strong>
            <span>featured food and community events connected to venues in this final prototype page</span>
          </div>
        </div>
      </section>

      <section id="events-list" className="events-list-section page-section">
        <div className="events-section-header">
          <div>
            <h2>Upcoming Gatherings</h2>
            <p className="events-section-copy">
              A curated selection of cooking classes, supper clubs, and community meals that better match the food-sharing purpose of GatherHub.
            </p>

            <div className="events-filter-row">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`events-chip ${activeFilter === type ? 'events-chip-active' : ''}`}
                  onClick={() => setActiveFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="events-grid">
          {filteredEvents.slice(0, 9).map((event) => (
            <EventCard key={event.event_id} data={event} onClick={setSelectedEvent} />
          ))}
        </div>
      </section>

      <section className="events-callout page-section">
        <div className="events-callout-text">
          <h2>Can’t find what you’re looking for?</h2>
          <p>
            Publish a new workshop, meal, or volunteer-led gathering. In this prototype, the submission form links each new event to a venue so the event can later appear alongside spaces in the wider GatherHub flow.
          </p>

          <div className="events-callout-actions">
            <button className="btn-secondary" type="button" onClick={() => setShowForm(true)}>
              Publish Event
            </button>

            <button className="btn-primary" type="button" onClick={() => navigate('/', { state: { mode: 'place' } })}>
              Explore Venues
            </button>
          </div>
        </div>
      </section>

      {selectedEvent && <EventDetailModal data={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-shell content-card">
            <button className="modal-shell-close" type="button" onClick={() => setShowForm(false)}>
              ✕
            </button>
            <SubmitEventForm
              onAddEvent={(event) => {
                handleAddEvent(event)
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </main>
  )
}
