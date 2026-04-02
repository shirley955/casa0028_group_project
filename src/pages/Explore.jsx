// 探索页面，包含map等组建，作为主要使用功能界面。用到地点位置与地点信息等数据
// 主页面（地图 + 筛选 + place列表）
// 是整个项目核心
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MapView from "../components/MapView";
import MapFilters from "../components/MapFilters";
import EventCard from "../components/EventCard";
import PlaceCard from "../components/PlaceCard";
import EventDetailModal from "../components/EventDetailModal";
import PlaceDetailModal from "../components/PlaceDetailModal";

import { events } from "../data/events_full";
import { places } from "../data/places_full";

import "../styles/style.css";
import "./Explore.css";

export default function Explore() {
  const location = useLocation();

  // ⭐ 是否已经进入（只在当前 session 有效）
  const [entered, setEntered] = useState(
    sessionStorage.getItem("explore_seen") === "true"
  );

  // ⭐ 控制按钮延迟出现
  const [showButton, setShowButton] = useState(false);

  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    if (!entered) {
      // 文字先出现
      setTimeout(() => {
        setTextVisible(true);
      }, 200);

      // 按钮后出现
      setTimeout(() => {
        setShowButton(true);
      }, 1000);
    }
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
    sessionStorage.setItem("explore_seen", "true");
  };

  // ---------- 原逻辑 ----------


  const [userLocation, setUserLocation] = useState(null);
  const [mode, setMode] = useState(location.state?.mode || "place");
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({});
  const [mapCenter, setMapCenter] = useState([-0.1, 51.5]);


  const safeEvents = events?.filter(Boolean) || [];
  const safePlaces = places?.filter(Boolean) || [];

  const filteredEvents = safeEvents.filter((e) =>
    filters.type ? e.event_category === filters.type : true
  );

  const filteredPlaces = safePlaces.filter((p) =>
    filters.type ? p.card_type === filters.type : true
  );

  const visibleEvents = filteredEvents.slice(0, 6);
  const visiblePlaces = filteredPlaces.slice(0, 8);

  return (
    <div className={`explore-page ${entered ? "entered" : "landing"}`}>

      {/* ⭐ HERO */}
      <div className="explore-hero">
        <div className={`explore-hero-inner ${textVisible ? "loaded" : ""}`}>

          <p className="explore-eyebrow">COMMUNITY FIRST</p>

          <h1 className="explore-title">
            Discover Spaces <br />
            And Events Near You
          </h1>

          <p className="explore-subtitle">
            Explore community kitchens, shared spaces and local events across the city.
          </p>

          {!entered && (
            <button
              className={`hero-start-btn ${showButton ? "show" : ""}`}
              onClick={handleEnter}
            >
              Start Exploring
            </button>
          )}
        </div>
      </div>

      {/* 主内容 */}
      <div className="explore-content">

        {/* 提示文字 */}
        <div className="explore-map-hint">
          Click on map points to view details
        </div>

        <div className="explore-toggle">
          <button
            className={`explore-chip ${
              mode === "event" ? "explore-chip-active" : ""
            }`}
            onClick={() => {
              setMode("event");
              setSelected(null);
              setFilters({});
            }}
          >
            Explore Events
          </button>

          <button
            className={`explore-chip ${
              mode === "place" ? "explore-chip-active" : ""
            }`}
            onClick={() => {
              setMode("place");
              setSelected(null);
              setFilters({});
            }}
          >
            Explore Places
          </button>
        </div>

        <MapFilters
          mode={mode}
          filters={filters}
          setFilters={setFilters}
          setMapCenter={setMapCenter}
          events={safeEvents}
          places={safePlaces}
          setUserLocation={setUserLocation}
        />

        <MapView
          mode={mode}
          events={filteredEvents}
          places={filteredPlaces}
          setSelected={setSelected}
          mapCenter={mapCenter}
          userLocation={userLocation}
        />

        <div className="explore-card-grid">
          {mode === "event"
            ? visibleEvents.map((e) => (
                <EventCard key={e.event_id} data={e} onClick={setSelected} />
              ))
            : visiblePlaces.map((p) => (
                <PlaceCard key={p.place_id} data={p} onClick={setSelected} />
              ))}
        </div>

      </div>

      {/* modal */}
      {selected && mode === "event" && (
        <EventDetailModal data={selected} onClose={() => setSelected(null)} />
      )}

      {selected && mode === "place" && (
        <PlaceDetailModal data={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}