// 活动页面
// 展示 events + 提交 event

import { useState } from 'react'
import EventCard from '../components/EventCard.jsx'
import SubmitEventForm from '../components/SubmitEventForm.jsx'
import './Events.css'

export default function Events() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Mastering Seasonal Fermentation',
      category: 'Workshop',
      date: 'MAR 12',
      description:
        'Learn the ancient art of pickling and fermentation with chef Elena. All materials provided.',
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      buttonText: 'Join Event',
    },
    {
      id: 2,
      title: 'Weekend Food Distribution',
      category: 'Volunteer',
      date: 'MAR 15',
      description:
        'Help us pack and distribute grocery bags to local families in need this Saturday.',
      image:
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
      buttonText: 'Volunteer Now',
    },
    {
      id: 3,
      title: 'Spring Community Potluck',
      category: 'Food Drive',
      date: 'MAR 20',
      description:
        'Bring a dish to share and meet your neighbors. Music and beverages provided by GatherHub.',
      image:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      buttonText: 'View Details',
    },
  ])

  const [activeFilter, setActiveFilter] = useState('All Events')

  function handleAddEvent(newEvent) {
    setEvents((prevEvents) => [newEvent, ...prevEvents])
  }

  const filteredEvents = events.filter((event) => {
    if (activeFilter === 'All Events') return true
    if (activeFilter === 'Workshops') return event.category === 'Workshop'
    if (activeFilter === 'Food Drives') return event.category === 'Food Drive'
    return true
  })

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <main className="events-page">
      <section className="events-hero">
        <div className="events-hero-text">
          <p className="events-eyebrow">Community First</p>
          <h1 className="events-title">
            Nourishing Our Neighborhood Through Shared Events.
          </h1>
          <p className="events-subtitle">
            Join a movement of local kitchens and volunteers dedicated to food
            security. From workshops to community dinners, find your place at
            the table.
          </p>

          <div className="events-hero-actions">
            <button
              className="btn-primary"
              type="button"
              onClick={() => scrollToSection('events-list')}
            >
              Explore All Events
            </button>

            <button
              className="btn-secondary"
              type="button"
              onClick={() => scrollToSection('submit-event')}
            >
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
            <strong>1.2k+</strong>
            <span>Meals shared this month through local workshops</span>
          </div>
        </div>
      </section>

      <section id="events-list" className="events-list-section page-section">
        <div className="events-section-header">
          <div>
            <h2>Upcoming Gatherings</h2>

            <div className="events-filter-row">
              <button
                type="button"
                className={`events-chip ${
                  activeFilter === 'All Events' ? 'events-chip-active' : ''
                }`}
                onClick={() => setActiveFilter('All Events')}
              >
                All Events
              </button>

              <button
                type="button"
                className={`events-chip ${
                  activeFilter === 'Workshops' ? 'events-chip-active' : ''
                }`}
                onClick={() => setActiveFilter('Workshops')}
              >
                Workshops
              </button>

              <button
                type="button"
                className={`events-chip ${
                  activeFilter === 'Food Drives' ? 'events-chip-active' : ''
                }`}
                onClick={() => setActiveFilter('Food Drives')}
              >
                Food Drives
              </button>
            </div>
          </div>
        </div>

        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="events-callout page-section">
        <div className="events-callout-text">
          <h2>Can’t find what you’re looking for?</h2>
          <p>
            Organize your own community event or kitchen takeover. We provide
            the tools and platform to help you get started.
          </p>

          <div className="events-callout-actions">
            <button
              className="btn-secondary"
              type="button"
              onClick={() => scrollToSection('submit-event')}
            >
              Publish Event
            </button>

            <button
              className="btn-primary"
              type="button"
              onClick={() =>
                alert('Host guide feature can be added in the next step.')
              }
            >
              View Host Guide
            </button>
          </div>
        </div>
      </section>

      <section id="submit-event" className="events-submit-section">
        <div className="events-submit-header">
          <h2>Submit New Event</h2>
          <p className="text-muted">
            Share a workshop, meal, or volunteer opportunity with the community.
          </p>
        </div>

        <SubmitEventForm onAddEvent={handleAddEvent} />
      </section>
    </main>
  )
}