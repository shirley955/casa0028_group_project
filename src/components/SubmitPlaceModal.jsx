import { useEffect } from "react";
import "./JoinUsModal.css";

export default function SubmitPlaceModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="joinus-modal-overlay" onClick={onClose}>
      <div className="submit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="joinus-modal-content">
          <h2>Add a place</h2>

          <p>
            Submit your place using the format below. Unknown fields can be left as null.
          </p>

          <pre className="joinus-code">
{`{
  "card_name": "Your place",
  "latitude": 51.50,
  "longitude": -0.12,
  "card_type": "community_centre",
  "meta": {
    "card_postcode": "SW1A 1AA"
  }
}`}
          </pre>

          <p>Email to: xxxxx@ucl.ac.uk</p>

          <p className="submit-modal-hint">
            Click outside this panel to close
          </p>

          <a
            className="joinus-modal-link"
            href="mailto:your@email.com"
          >
            Email submission →
          </a>
        </div>
      </div>
    </div>
  );
}