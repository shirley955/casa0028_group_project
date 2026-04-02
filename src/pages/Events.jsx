// 活动页面
// 展示 events + 提交 event

import { useState } from 'react'
import EventCard from '../components/EventCard.jsx'
import SubmitEventForm from '../components/SubmitEventForm.jsx'
import { events as realEvents } from '../data/events_full'
import './Events.css'

export default function Events() {
  const [showForm, setShowForm] = useState(false)

  // 🔥 用真实数据初始化
  const [events, setEvents] = useState(realEvents || [])

  const [activeFilter, setActiveFilter] = useState('All Events')

  function handleAddEvent(newEvent) {
    setEvents((prevEvents) => [newEvent, ...prevEvents])
  }

  // 🔥 自动生成 filter（基于真实数据）
  const types = [
    'All Events',
    ...new Set(events.map((e) => e.event_category).filter(Boolean)),
  ]

  // 🔥 filter逻辑（对齐 event_category）
  const filteredEvents = events.filter((event) => {
    if (activeFilter === 'All Events') return true
    return event.event_category === activeFilter
  })

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <main className="events-page">

      {/* HERO */}
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

            {/* 弹窗 */}
            <button
              className="btn-secondary"
              type="button"
              onClick={() => setShowForm(true)}
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

      {/* LIST */}
      <section id="events-list" className="events-list-section page-section">
        <div className="events-section-header">
          <div>
            <h2>Upcoming Gatherings</h2>

            {/* 动态 filter */}
            <div className="events-filter-row">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`events-chip ${
                    activeFilter === type ? 'events-chip-active' : ''
                  }`}
                  onClick={() => setActiveFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.event_id}
              data={event}
            />
          ))}
        </div>
      </section>

      {/* CALLOUT */}
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
              onClick={() => setShowForm(true)}
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

      {/* 保留但先不用 */}
      <section id="submit-event" className="events-submit-section">
        <div className="events-submit-header">
          <h2>Submit New Event</h2>

          <p className="text-muted">
            Share a workshop, meal, or volunteer opportunity with the community.
          </p>
        </div>

        <SubmitEventForm onAddEvent={handleAddEvent} />
      </section>

      {/* 弹窗 */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={() => setShowForm(false)}>✕</button>

            <SubmitEventForm
              onAddEvent={(e) => {
                handleAddEvent(e)
                setShowForm(false)
              }}
            />
          </div>
        </div>
      )}
    </main>
  )
}