// 顶部导航栏，用于跳转页面的。页面jsx都放进来就行

import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
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
          <button className="navbar-join-btn">Join Us</button>
        </div>
      </div>
    </header>
  );
}