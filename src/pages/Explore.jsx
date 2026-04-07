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

  const [entered, setEntered] = useState(
    sessionStorage.getItem("explore_seen") === "true"
  );

  const [showButton, setShowButton] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!entered) {
      const textTimer = setTimeout(() => {
        setTextVisible(true);
      }, 200);

      const buttonTimer = setTimeout(() => {
        setShowButton(true);
      }, 1000);

      return () => {
        clearTimeout(textTimer);
        clearTimeout(buttonTimer);
      };
    } else {
      setTextVisible(true);
      setShowButton(false);
    }
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
    sessionStorage.setItem("explore_seen", "true");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

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

  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    setVisibleItems([]);
  }, [mode, filters]);

  const displayItems = visibleItems.filter((item) =>
    mode === "event" ? item?.event_id : item?.place_id
  );

  return (
    <div className={`explore-page ${entered ? "entered" : "landing"}`}>
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

      <div className="explore-content">
        <div className="explore-main-wrap">
          <div className="explore-map-section">
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
                Events
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
                Places
              </button>
            </div>

            <div className="explore-filter-bar">
              <MapFilters
                mode={mode}
                filters={filters}
                setFilters={setFilters}
                setMapCenter={setMapCenter}
                events={safeEvents}
                places={safePlaces}
                setUserLocation={setUserLocation}
              />
            </div>

            <MapView
              mode={mode}
              events={filteredEvents}
              places={filteredPlaces}
              setSelected={setSelected}
              mapCenter={mapCenter}
              userLocation={userLocation}
              setVisibleItems={setVisibleItems}
              hoveredId={hoveredId} 
            />
          </div>

          <div className="explore-results-head">
            <div>
              <p className="explore-results-eyebrow">
                {mode === "event" ? "EVENT RESULTS" : "PLACE RESULTS"}
              </p>
              <h2 className="explore-results-title">
                {mode === "event" ? "Events on the map" : "Places on the map"}
              </h2>
            </div>

            <p className="explore-results-copy">
              {mode === "event"
                ? "These cards match the events currently visible in the selected mode."
                : "These cards match the places currently visible in the selected mode."}
            </p>
          </div>

          <div className="explore-card-wrap">
            <div className="explore-card-grid">
              {displayItems.map((item) =>
                mode === "event" ? (
                  <EventCard key={item.event_id} data={item} onClick={setSelected} onHover={setHoveredId}/>
                ) : (
                  <PlaceCard key={item.place_id} data={item} onClick={setSelected} onHover={setHoveredId}/>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {selected && mode === "event" && (
        <EventDetailModal data={selected} onClose={() => setSelected(null)} />
      )}

      {selected && mode === "place" && (
        <PlaceDetailModal data={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}