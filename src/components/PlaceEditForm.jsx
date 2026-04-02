export default function PlaceEditForm({ onClose, place }) {
  return (
    <div style={formStyle}>
      <h3>Edit Place Info</h3>

      <input defaultValue={place.card_name} />
      <input placeholder="Type" defaultValue={place.card_type} />
      <input placeholder="Capacity" />

      <textarea placeholder="Description" />

      <button>Submit</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}