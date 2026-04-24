import { useMemo, useState } from 'react'
import './AdminPanel.css'
import ReviewQueue from './ReviewQueue'
import { events } from '../data/events_full'
import { mapping } from '../data/mapping'
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
    venueStatus: 'has-venue',
  },
  {
    id: 'submission-2',
    title: 'After-school family cooking session',
    type: 'Workshop',
    date: '2026-04-22 · 16:00',
    submittedBy: 'Local parent group',
    venueHint: 'Needs an accessible venue in Southwark',
    description: 'A practical cooking class for parents and children, designed around affordable ingredients and shared meals.',
    selectedPlaceId: '',
    venueStatus: 'needs-venue',
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
    venueStatus: 'needs-venue',
  },
]

const governanceChecklist = [
  'Who can use this space, and under what conditions?',
  'Are community-led activities prioritised over commercial uses?',
  'Who is responsible for maintenance, safety, and care?',
  'Can this become a recurring relationship rather than a one-off booking?',
  'What contribution does the activity make back to the shared resource?',
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
  const submissionsWithVenue = useMemo(
    () => pendingSubmissions.filter((item) => item.venueStatus === 'has-venue'),
    [pendingSubmissions],
  )
  const submissionsNeedingVenue = useMemo(
    () => pendingSubmissions.filter((item) => item.venueStatus === 'needs-venue'),
    [pendingSubmissions],
  )

  const summary = useMemo(() => {
    return {
      resources: places.length,
      communityLinks: mapping.length,
      proposedVenue: submissionsWithVenue.length,
      needsVenue: submissionsNeedingVenue.length + mappingQueue.length,
    }
  }, [submissionsWithVenue, submissionsNeedingVenue, mappingQueue])

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
          <p className="admin-eyebrow">Commons governance dashboard</p>
          <h1>Review shared food spaces as resources, relationships, and rules.</h1>
          <p>
            This lightweight admin layer reframes GatherHub as more than a matching platform. It shows which resources
            are visible, which event-place relationships need review, and where stronger governance would be needed for
            shared use over time.
          </p>
        </div>

        <aside className="content-card admin-hero-card">
          <div>
            <p className="admin-section-label">Why this page matters</p>
            <h3>A commons needs more than public access.</h3>
          </div>

          <ul className="admin-highlight-list">
            <li>Identify the shared resource: kitchens, halls, venues, and the data that describes them.</li>
            <li>Review the community relationship between organisers, venue holders, and participants.</li>
            <li>Surface governance gaps around access rules, care, priority, and responsibility.</li>
          </ul>
        </aside>
      </section>

      <section className="admin-summary-grid">
        <article className="content-card admin-summary-card">
          <p className="admin-section-label">Resources mapped</p>
          <h2>{summary.resources}</h2>
          <p>Places available as potential shared resources.</p>
        </article>

        <article className="content-card admin-summary-card">
          <p className="admin-section-label">Community links</p>
          <h2>{summary.communityLinks}</h2>
          <p>Event-place links already visible in the prototype data.</p>
        </article>

        <article className="content-card admin-summary-card">
          <p className="admin-section-label">With proposed venue</p>
          <h2>{summary.proposedVenue}</h2>
          <p>Submissions that already bring a host space.</p>
        </article>

        <article className="content-card admin-summary-card">
          <p className="admin-section-label">Need venue support</p>
          <h2>{summary.needsVenue}</h2>
          <p>Activities that still need a suitable place.</p>
        </article>
      </section>

      <section className="content-card admin-commons-readiness">
        <div>
          <p className="admin-section-label">Commons readiness</p>
          <h2>From one-off matching toward shared stewardship</h2>
          <p>
            The current system can connect people to places. The next step is to ask whether those connections create
            durable relationships, shared responsibilities, and clear rules for access.
          </p>
        </div>

        <div className="admin-readiness-steps">
          <span>Resource</span>
          <span>Community</span>
          <span>Governance</span>
        </div>
      </section>

      <section className="admin-panel-grid">
        <div className="admin-panel-stack">
          <section className="page-section admin-block">
            <p className="admin-section-label">Category 1</p>
            <h2>Events with a proposed venue</h2>
            <p>
              These submissions already come with a suggested host space. The admin role is to confirm that the venue
              is suitable, then approve or reject the activity.
            </p>

            <ReviewQueue
              items={submissionsWithVenue}
              places={placeOptions}
              onApprove={handleApproveSubmission}
              onReject={handleRejectSubmission}
              onPlaceChange={handleSubmissionPlaceChange}
              onLink={handleSaveSubmissionLink}
              emptyTitle="No venue-proposed submissions"
              emptyBody="Submissions with their own proposed venue will appear here."
              itemKicker="Submission with proposed venue"
              linkLabel="Proposed venue"
              showVenueSelector={false}
            />
          </section>

          <section className="page-section admin-block">
            <p className="admin-section-label">Category 2</p>
            <h2>Events that need a venue</h2>
            <p>
              These activities do not yet have a confirmed host space. The admin role is to suggest a suitable venue,
              then decide whether the activity has enough resource and community context to move forward.
            </p>

            <ReviewQueue
              items={submissionsNeedingVenue}
              places={placeOptions}
              onApprove={handleApproveSubmission}
              onReject={handleRejectSubmission}
              onPlaceChange={handleSubmissionPlaceChange}
              onLink={handleSaveSubmissionLink}
              emptyTitle="No new submissions need a venue"
              emptyBody="New activities that need help finding a host space will appear here."
              itemKicker="Submission needing venue support"
              linkLabel="Suggest a suitable venue"
              saveLabel="Save venue suggestion"
            />

            <div className="admin-subsection-head">
              <h3>Existing records without a confirmed venue</h3>
              <p>
                These are older event records with location text but no confirmed GatherHub place link yet.
              </p>
            </div>

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
                    <span><strong>Governance gap:</strong> venue relationship unclear</span>
                  </div>

                  <div className="admin-governance-prompts">
                    <p>Before confirming, consider:</p>
                    <ul>
                      <li>Is this a one-off event or a recurring relationship?</li>
                      <li>Who is responsible for the space during and after use?</li>
                      <li>Does this activity contribute back to the shared resource?</li>
                    </ul>
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

                    <button
                      type="button"
                      className="btn-primary"
                      disabled={!item.selectedPlaceId}
                      onClick={() => handleResolveMapping(item.id)}
                    >
                      {item.selectedPlaceId ? 'Confirm venue link' : 'Choose a place first'}
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
            <p className="admin-section-label">Governance checklist</p>
            <h2>Questions before a resource becomes common</h2>
            <p>
              These questions mark the difference between a searchable venue database and a commons-oriented system.
            </p>

            <ul className="admin-checklist">
              {governanceChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="page-section admin-block">
            <p className="admin-section-label">Recent actions</p>
            <h2>Governance log</h2>
            <p>
              A simple action feed makes it easier to explain how this prototype manages visibility, quality, and
              resource relationships without building a full admin backend.
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
