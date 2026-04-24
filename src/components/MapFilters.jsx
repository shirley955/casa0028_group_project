// Controls the location search and category filter used by the Explore map.

import { useState } from "react";

export default function MapFilters({
  mode,
  filters,
  setFilters,
  events,
  places,
  setMapCenter,
  setUserLocation,
}) {
  const [postcode, setPostcode] = useState("");

  const types =
    mode === "event"
      ? [...new Set(events.map((e) => e.event_category).filter(Boolean))]
      : [...new Set(places.map((p) => p.card_type).filter(Boolean))];

  // Use browser geolocation to recenter the map.
  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;

        setMapCenter([lng, lat]);
        setUserLocation([lng, lat]);
      },
      () => {
        alert("Unable to get your location");
      }
    );
  };

  // Nominatim keeps postcode lookup lightweight for this prototype.
  const handlePostcodeSearch = async () => {
    if (!postcode) return;

    try {
      const cleaned = postcode.trim();

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleaned)}&countrycodes=gb&limit=1`,
        {
          headers: {
            "User-Agent": "gatherhub-app",
          },
        }
      );

      const data = await res.json();

      if (data.length > 0) {
        const lng = parseFloat(data[0].lon);
        const lat = parseFloat(data[0].lat);

        setMapCenter([lng, lat]);
        setUserLocation([lng, lat]);
      } else {
        alert("Postcode not found");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  };

  return (
    <div className="filters map-filters">

      {/* Location search */}
      <div className="filter-group">
        <span className="filter-label">Find a Location</span>

        <div className="filter-row map-filter-row">
          <button className="map-btn-secondary" onClick={handleLocate}>
            📍 Locate
          </button>

          <input
            className="map-input"
            type="text"
            placeholder="Search by postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />

          <button className="map-btn" onClick={handlePostcodeSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="filter-divider" />

      {/* Category filter */}
      <div className="filter-group">
        <span className="filter-label">Category</span>

        <div className="filter-row map-filter-row">
          <div className="map-select-wrapper">
            <select
              className="map-select"
              value={filters.type || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type: e.target.value || null,
                })
              }
            >
              <option value="">All categories</option>

              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}
