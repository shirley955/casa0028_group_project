import { formatPlaceOptionLabel } from '../utils/eventUtils'

export default function ReviewQueue({
  items,
  places,
  onApprove,
  onReject,
  onPlaceChange,
  onLink,
  showVenueSelector = true,
  emptyTitle = 'Nothing waiting right now',
  emptyBody = 'New submissions will appear here before they become visible as public resource relationships.',
  itemKicker = 'Potential commons relationship',
  linkLabel = 'Link to shared resource',
  saveLabel = 'Save resource link',
}) {
  if (!items?.length) {
    return (
      <div className="admin-empty-state content-card">
        <h4>{emptyTitle}</h4>
        <p>{emptyBody}</p>
      </div>
    )
  }

  return (
    <div className="admin-review-list">
      {items.map((item) => {
        const selectedPlace = places.find((place) => String(place.place_id) === String(item.selectedPlaceId))

        return (
          <article key={item.id} className="content-card admin-review-card">
            <div className="admin-review-meta">
              <p className="admin-review-kicker">{itemKicker}</p>
              <h3>{item.title}</h3>
              <p className="admin-review-copy">{item.description}</p>
            </div>

            <div className="admin-review-details">
              <span><strong>Type:</strong> {item.type}</span>
              <span><strong>Date:</strong> {item.date}</span>
              <span><strong>Submitted by:</strong> {item.submittedBy}</span>
              <span><strong>Venue hint:</strong> {item.venueHint}</span>
            </div>

            {showVenueSelector ? (
              <div className="admin-review-linker">
                <label htmlFor={`place-select-${item.id}`}>{linkLabel}</label>
                <div className="admin-review-linker-row">
                  <select
                    id={`place-select-${item.id}`}
                    value={item.selectedPlaceId || ''}
                    onChange={(event) => onPlaceChange?.(item.id, event.target.value)}
                  >
                    <option value="">Select a place</option>
                    {places.map((place) => (
                      <option key={place.place_id} value={place.place_id}>
                        {formatPlaceOptionLabel(place)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="admin-inline-btn admin-inline-btn-outline"
                    onClick={() => onLink?.(item.id)}
                  >
                    {saveLabel}
                  </button>
                </div>
              </div>
            ) : (
              <div className="admin-review-venue-note">
                <span>{linkLabel}</span>
                <strong>{item.venueHint}</strong>
                <p>{selectedPlace ? `Matched place record: ${formatPlaceOptionLabel(selectedPlace)}` : 'No internal place record has been attached yet.'}</p>
              </div>
            )}

            <div className="admin-review-actions">
              <button type="button" className="admin-inline-btn admin-inline-btn-muted" onClick={() => onReject?.(item.id)}>
                Reject
              </button>
              <button type="button" className="btn-primary" onClick={() => onApprove?.(item.id)}>
                Approve
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
