import './PlaceCard.css'

export default function PlaceCard({ data, onClick, onHover }) {
  if (!data) return null;

  const displayName =
    data.card_name ||
    data.card_type?.replace(/_/g, " ") ||
    "Community space";

  const category =
    data.card_type?.replace(/_/g, " ") || "Community space";

  const postcode =
    data.meta?.card_postcode || "No postcode";

  return (
    <div
      className="place-card"
      onClick={() => onClick(data)}
      onMouseEnter={() => onHover?.(data.place_id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="place-card-image-wrap">
        {data.image ? (
          <img
            src={data.image}
            alt={displayName}
            className="place-card-image"
          />
        ) : (
          <div className="card-image-placeholder">
          <span>Image coming soon</span>
        </div>
        )}
      </div>

      <div className="place-card-body">
        <p className="place-card-category">{category}</p>

        <h3>{displayName}</h3>

        <p className="place-card-location">{postcode}</p>

        <button
          className="btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onClick(data);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
