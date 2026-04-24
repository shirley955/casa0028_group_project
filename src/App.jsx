import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Explore from "./pages/Explore";
import Events from "./pages/Events";
import About from "./pages/About";

import EventDetailPage from "./components/EventDetailPage";
import PlaceDetailPage from "./components/PlaceDetailPage";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Explore />} />
        <Route path="events" element={<Events />} />
        <Route path="about" element={<About />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="places/:id" element={<PlaceDetailPage />} />
      </Route>
    </Routes>
  );
}
