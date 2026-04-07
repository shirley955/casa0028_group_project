export default function PlaceEditForm({ onClose, place }) {
  return (
    <div className="detail-form">
      <h2>Improve this place</h2>
      <p className="text-muted">
        In the full platform, this form would let community members suggest missing contact details, facilities, or booking information for {place.card_name}.
      </p>
      <input defaultValue={place.card_name} placeholder="Place name" />
      <input placeholder="Type" defaultValue={place.card_type} />
      <textarea placeholder="Add notes about facilities, contact details, or booking guidance" />
      <div className="detail-actions">
        <button className="btn-primary" type="button">
          Submit suggestion
        </button>
        <button className="btn-secondary" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
