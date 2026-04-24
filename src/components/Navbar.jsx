import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import JoinUsModal from "./JoinUsModal";
import "./Navbar.css";

export default function Navbar() {
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="navbar">
          <Link to="/" className="navbar-logo">
            GatherHub
          </Link>

          <nav className="navbar-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Explore
            </NavLink>
            <NavLink to="/events" className={({ isActive }) => (isActive ? "active" : "")}>
              Events
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
              Admin
            </NavLink>
          </nav>

          <div className="navbar-actions">
            <button
              className="navbar-join-btn"
              type="button"
              onClick={() => setShowJoinModal(true)}
            >
              Join Us
            </button>
          </div>
        </div>
      </header>

      <JoinUsModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        mode="default"
      />
    </>
  );
}
