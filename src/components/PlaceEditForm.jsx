import { useState, useEffect, useRef } from "react";

export default function PlaceEditForm({ onClose, place }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const fileInputRef = useRef(null);

  // Load any locally saved image preview for the selected place.
  useEffect(() => {
    const saved = localStorage.getItem(`place_image_${place.place_id}`);
    if (saved) setPreview(saved);
  }, [place.place_id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Store the uploaded image for this prototype form.
  const handleSubmit = () => {
    if (image) {
      localStorage.setItem(`place_image_${place.place_id}`, image);
    }

    alert("Suggestion submitted (demo)");
    onClose();
  };

  return (
    <div className="detail-form">
      <h2>Improve this place</h2>

      <p className="text-muted">
        In the full platform, this form would let community members suggest
        missing contact details, facilities, or booking information for{" "}
        {place.card_name}.
      </p>

      <input defaultValue={place.card_name} placeholder="Place name" />

      <input placeholder="Type" defaultValue={place.card_type} />

      <textarea placeholder="Add notes about facilities, contact details, or booking guidance" />

      {/* Button-triggered image upload */}
      <div style={{ marginTop: "12px" }}>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
        >
          Upload image
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />

        {fileName && (
          <p className="text-muted" style={{ marginTop: "6px" }}>
            Selected: {fileName}
          </p>
        )}

        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100%",
              maxHeight: "220px",
              objectFit: "cover",
              borderRadius: "12px",
              marginTop: "12px",
            }}
          />
        )}
      </div>

      <div className="detail-actions">
        <button className="btn-primary" type="button" onClick={handleSubmit}>
          Submit suggestion
        </button>

        <button className="btn-secondary" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
