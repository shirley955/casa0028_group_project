import { useState, useEffect, useRef } from "react";

export default function PlaceEditForm({ onClose, place }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const fileInputRef = useRef(null);

  // ⭐ 读取已保存图片
  useEffect(() => {
    const saved = localStorage.getItem(`place_image_${place.place_id}`);
    if (saved) setPreview(saved);
  }, [place.place_id]);

  // ⭐ 上传处理
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

  // ⭐ 提交
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

      {/* ⭐ 上传（直接用按钮） */}
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

        {/* 文件名提示 */}
        {fileName && (
          <p className="text-muted" style={{ marginTop: "6px" }}>
            Selected: {fileName}
          </p>
        )}

        {/* 预览 */}
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

      {/* 原按钮结构完全保留 */}
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