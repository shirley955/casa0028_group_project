// 顶部导航栏，用于跳转页面的。页面jsx都放进来就行

import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      padding: "10px 20px",
      borderBottom: "1px solid #ddd"
    }}>
      <h2>GatherHub</h2>

      <Link to="/">Explore</Link>
      <Link to="/events">Events</Link>
      <Link to="/about">About</Link>
    </nav>
  )
}