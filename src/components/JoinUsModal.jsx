import { useEffect, useState } from "react";
import SubmitPlaceModal from "./SubmitPlaceModal";
import "./JoinUsModal.css";

export default function JoinUsModal({ isOpen, onClose, mode = "default" }) {

  // ✅ 必须放最上面（修复白屏核心）
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="joinus-modal-overlay" onClick={onClose}>
        <div
          className="joinus-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="joinus-modal-title"
          onClick={handlePanelClick}
        >
          <button
            className="joinus-modal-close"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>

          <div className="joinus-modal-content">
            <p className="joinus-modal-eyebrow">JOIN US</p>

            <h2 id="joinus-modal-title" className="joinus-modal-title">
              Work with GatherHub
            </h2>

            {/* ===== 简要说明 ===== */}
            <div className="joinus-intro">
              <p>
                GatherHub is an ongoing prototype exploring how food-related
                community activity connects to physical space and supports the
                formation of local social networks.
              </p>
              <p>
                The current version focuses on linking events to places. Both the
                data and functionality are still evolving.
              </p>
            </div>

            {/* ===== 三类参与方式 ===== */}
            <div className="joinus-sections">

              {/* 3. submit place */}
              <div className="joinus-section">
                <h3>Add a place</h3>
                <p>
                  If you manage or know a community space that is not currently listed,
                  you can help expand the dataset by submitting its details.
                </p>

                <button
                  className="joinus-modal-link"
                  onClick={() => {
                    setShowSubmitModal(true);
                  }}
                >
                  Submit a place →
                </button>
              </div>

              {/* 1. contributor */}
              <div className="joinus-section">
                <h3>Contribute to the project</h3>
                <p>
                  Support development, improve data quality, or extend
                  event–place linking within the platform.
                </p>

                <ul className="joinus-list">
                  <li>Development (features, UI, bug fixes)</li>
                  <li>Data and linking (event–place matching)</li>
                  <li>Curation and admin (data quality, moderation)</li>
                </ul>

                <a
                  className="joinus-modal-link"
                  href="https://github.com/JianlingZhao/casa0028_group_project"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View repository →
                </a>
              </div>

              {/* 2. organisation */}
              <div className="joinus-section">
                <h3>Collaborate as an organisation</h3>
                <p>
                  If you run or support community spaces or food-related
                  activities, GatherHub can help make these more visible and
                  easier to connect to local participants.
                </p>

                <p>Email us: xxxxx@ucl.ac.uk</p>
                

                <a
                  className="joinus-modal-link"
                  href="mailto:your@email.com"
                >
                  Get in touch →
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ✅ 放在外面（更稳定，不嵌套结构） */}
      <SubmitPlaceModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
      />
    </>
  );
}