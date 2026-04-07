import { useMemo, useState } from 'react'
import './AdminPanel.css'
import ReviewQueue from './ReviewQueue'
import { events } from '../data/events_full'
import { places } from '../data/places_full'
import {
  formatPlaceOptionLabel,
  getEventDateLabel,
  getEventDisplayType,
  getMappedPlace,
  getEventLocation,
} from '../utils/eventUtils'

const initialPendingSubmissions = [
  {
    id: 'submission-1',
    title: 'Neighbourhood Soup Night',
    type: 'Community Meal',
    date: '2026-04-18 · 18:30',
    submittedBy: 'Resident organiser',
    venueHint: 'Hackney shared kitchen',
    description: 'A low-cost evening meal for nearby residents, with extra portions reserved for food support referrals.',
    selectedPlaceId: 'osm_way_935453493',
  },
  {
    id: 'submission-2',
    title: 'After-school family cooking session',
    type: 'Workshop',
    date: '2026-04-22 · 16:00',
    submittedBy: 'Local parent group',
    venueHint: 'Needs an accessible venue in Southwark',
    description: 'A practical cooking class for parents and children, designed around affordable ingredients and shared meals.',
    selectedPlaceId: 'osm_way_59063097',
  },
  {
    id: 'submission-3',
    title: 'Weekend pantry volunteering shift',
    type: 'Volunteer',
    date: '2026-04-27 · 10:00',
    submittedBy: 'Community pantry team',
    venueHint: 'Bow / Poplar area',
    description: 'Volunteers help sort ingredients, assemble meal packs, and welcome residents collecting support food parcels.',
    selectedPlaceId: '',
  },
]

function buildInitialMappingQueue() {
  return events
    .filter((event) => !getMappedPlace(event))
    .slice(0, 4)
    .map((event) => ({
      id: `mapping-${event.event_id}`,
      eventId: event.event_id,
      title: event.title,
      type: getEventDisplayType(event),
      date: getEventDateLabel(event),
      locationHint: getEventLocation(event).name,
      selectedPlaceId: '',
    }))
}

export default function AdminPanel() {
  const [pendingSubmissions, setPendingSubmissions] = useState(initialPendingSubmissions)
  const [mappingQueue, setMappingQueue] = useState(buildInitialMappingQueue)
  const [activityLog, setActivityLog] = useState([
    {
      id: 'log-1',
      title: 'Venue linking keeps the spatial story coherent',
      body: 'This dashboard focuses on moderation and venue mapping so that events do not appear as isolated listings without place context.',
      tag: 'Governance layer',
    },
    {
      id: 'log-2',
      title: 'Prototype moderation is intentionally lightweight',
      body: 'The aim here is to demonstrate review logic, data quality checks, and venue assignment without building a full backend system.',
      tag: 'Prototype note',
    },
  ])

  const placeOptions = useMemo(() => places.slice(0, 80), [])

  const summary = useMemo(() => {
    const linkedPendingCount = pendingSubmissions.filter((item) => item.selectedPlaceId).length
    return {
      pending: pendingSubmissions.length,
      mapping: mappingQueue.length,
      linkedPending: linkedPendingCount,
      venues: places.length,
    }
  }, [pendingSubmissions, mappingQueue, placeOptions])

  function pushLog(title, body, tag) {
    setActivityLog((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
        title,
        body,
        tag,
      },
      ...prev,
    ])
  }

  function handleSubmissionPlaceChange(id, value) {
    setPendingSubmissions((prev) => prev.map((item) => (item.id === id ? { ...item, selectedPlaceId: value } : item)))
  }

  function handleApproveSubmission(id) {
    const item = pendingSubmissions.find((entry) => entry.id === id)
    if (!item) return
    setPendingSubmissions((prev) => prev.filter((entry) => entry.id !== id))
    pushLog(
      `Approved: ${item.title}`,
      `The event is now ready to move into the public-facing event list${item.selectedPlaceId ? ' with a linked venue.' : '.'}`,
      'Approved',
    )
  }

  function handleRejectSubmission(id) {
    const item = pendingSubmissions.find((entry) => entry.id === id)
    if (!item) return
    setPendingSubmissions((prev) => prev.filter((entry) => entry.id !== id))
    pushLog(`Rejected: ${item.title}`, 'The submission was removed from the moderation queue for this prototype.', 'Rejected')
  }

  function handleSaveSubmissionLink(id) {
    const item = pendingSubmissions.find((entry) => entry.id === id)
    if (!item) return
    if (!item.selectedPlaceId) {
      pushLog(`Missing venue link for ${item.title}`, 'Select a venue before saving the mapping.', 'Action needed')
      return
    }
    const place = places.find((entry) => String(entry.place_id) === String(item.selectedPlaceId))
    pushLog(
      `Saved venue link for ${item.title}`,
      `${item.title} is now linked to ${place?.card_name || 'a selected venue'} in the moderation flow.`,
      'Venue link',
    )
  }

  function handleMappingPlaceChange(id, value) {
    setMappingQueue((prev) => prev.map((item) => (item.id === id ? { ...item, selectedPlaceId: value } : item)))
  }

  function handleResolveMapping(id) {
    const item = mappingQueue.find((entry) => entry.id === id)
    if (!item) return
    if (!item.selectedPlaceId) {
      pushLog(`No place selected for ${item.title}`, 'Choose a venue from the dropdown before resolving the mapping issue.', 'Action needed')
      return
    }
    const place = places.find((entry) => String(entry.place_id) === String(item.selectedPlaceId))
    setMappingQueue((prev) => prev.filter((entry) => entry.id !== id))
    pushLog(
      `Mapped event to venue: ${item.title}`,
      `${item.title} now points to ${place?.card_name || 'the selected venue'}, so users can move from the event listing into venue context.`,
      'Mapping resolved',
    )
  }

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div className="page-section">
          <p className="admin-eyebrow">Admin dashboard</p>
          <h1>Moderate new submissions and keep events connected to real venues.</h1>
          <p>
            This lightweight admin layer adds a governance view to GatherHub. It shows which events still need review,
            which items still need a place link, and how moderation decisions affect what becomes visible on the
            public-facing platform.
          </p>
        </div>

        <aside className="content-card admin-hero-card">
          <div>
            <p className="admin-section-label">Why this page matters</p>
            <h3>Beyond display, the platform also needs moderation.</h3>
          </div>

          <ul className="admin-highlight-list">
            <li>Check pending event submissions before they reach the public event feed.</li>
            <li>Assign or repair venue links when an event is missing spatial context.</li>
            <li>Keep a lightweight record of moderation actions taken inside the prototype.</li>
          </ul>
        </aside>
      </section>

      <section className="admin-summary-grid">
        <article className="content-card admin-summary-card">
          <p className="admin-section-label">Pending submissions</p>
          <h2>{summary.pending}</h2>
          <p>Items still waiting for moderation.</p>
        </article>

        <article className="content-card admin-summary-card">
          <p className="admin-section-label">Mapping issues</p>
          <h2>{summary.mapping}</h2>
          <p>Events that still need a venue assignment.</p>
        </article>

        <article className="content-card admin-summary-card">
          <p className="admin-section-label">Linked pending items</p>
          <h2>{summary.linkedPending}</h2>
          <p>Submissions already connected to a place.</p>
        </article>

        <article className="content-card admin-summary-card">
          <p className="admin-section-label">Venue options</p>
          <h2>{summary.venues}</h2>
          <p>Available places surfaced for admin linking.</p>
        </article>
      </section>

      <section className="admin-panel-grid">
        <div className="admin-panel-stack">
          <section className="page-section admin-block">
            <p className="admin-section-label">Moderation queue</p>
            <h2>Pending submissions</h2>
            <p>
              Review new community-led events, confirm the venue, and decide whether each submission should progress to
              the public-facing event page.
            </p>

            <ReviewQueue
              items={pendingSubmissions}
              places={placeOptions}
              onApprove={handleApproveSubmission}
              onReject={handleRejectSubmission}
              onPlaceChange={handleSubmissionPlaceChange}
              onLink={handleSaveSubmissionLink}
            />
          </section>

          <section className="page-section admin-block">
            <p className="admin-section-label">Spatial quality control</p>
            <h2>Venue mapping queue</h2>
            <p>
              These events are currently missing a clean link back to one of the venue records in GatherHub. Resolve
              the connection here so the event and place pages remain connected.
            </p>

            <div className="admin-mapping-list">
              {mappingQueue.length ? mappingQueue.map((item) => (
                <article key={item.id} className="content-card admin-mapping-card">
                  <div>
                    <h3>{item.title}</h3>
                    <p className="text-muted">{item.locationHint}</p>
                  </div>

                  <div className="admin-mapping-meta">
                    <span><strong>Type:</strong> {item.type}</span>
                    <span><strong>Date:</strong> {item.date}</span>
                    <span><strong>Event ID:</strong> {item.eventId}</span>
                  </div>

                  <div className="admin-mapping-actions">
                    <select value={item.selectedPlaceId || ''} onChange={(event) => handleMappingPlaceChange(item.id, event.target.value)}>
                      <option value="">Select a place</option>
                      {placeOptions.map((place) => (
                        <option key={place.place_id} value={place.place_id}>
                          {formatPlaceOptionLabel(place)}
                        </option>
                      ))}
                    </select>

                    <button type="button" className="btn-primary" onClick={() => handleResolveMapping(item.id)}>
                      Resolve mapping
                    </button>
                  </div>
                </article>
              )) : (
                <div className="admin-empty-state content-card">
                  <h4>All current mapping issues are resolved</h4>
                  <p>The featured events are now connected back to venue records in the prototype.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="admin-panel-stack">
          <section className="page-section admin-block">
            <p className="admin-section-label">Recent actions</p>
            <h2>Moderation log</h2>
            <p>
              A simple action feed makes it easier to explain how this prototype manages visibility, quality, and venue
              linkage without building a full admin backend.
            </p>

            <div className="admin-log-list">
              {activityLog.map((item) => (
                <article key={item.id} className="content-card admin-log-item">
                  <span>{item.tag}</span>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}
