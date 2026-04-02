import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="layout-content">
        <Outlet />
      </main>
    </>
  );
}