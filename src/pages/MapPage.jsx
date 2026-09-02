import React, { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { base44 } from "@/api/base44Client";
import { Zap, Search, LocateFixed, SlidersHorizontal, Layers } from "lucide-react";
import StationCard from "@/components/charging/StationCard";
import FilterTabs from "@/components/charging/FilterTabs";
import StationDetailSheet from "@/components/charging/StationDetailSheet";
import { searchStationsNear } from "@/lib/chargingSearch";
import { cn } from "@/lib/utils";

const TEL_AVIV = [32.0853, 34.7818];

const statusColor = {
  available: "#22c55e",
  busy: "#ef4444",
  offline: "#6b7280",
};

function makeIcon(status) {
  const c = statusColor[status] || statusColor.offline;
  return L.divIcon({
    className: "",
    html: `<div style="width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${c};box-shadow:0 0 12px ${c};border:2px solid #0a0e1a"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });
}

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#22d3ee;box-shadow:0 0 0 6px rgba(34,211,238,0.25),0 0 16px #22d3ee;border:2px solid #fff"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1.2 });
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [liveMode, setLiveMode] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveLocation, setLiveLocation] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [center, setCenter] = useState(TEL_AVIV);
  const [sheetOpen, setSheetOpen] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    base44.entities.ChargingStation.list("-created_date", 100)
      .then((data) => setStations(data))
      .catch(() => setStations([]))
      .finally(() => setLoading(false));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p = [pos.coords.latitude, pos.coords.longitude];
          setUserPos(p);
          setCenter(p);
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const runLiveSearch = async (location) => {
    const loc = (location || query).trim();
    if (!loc) return;
    setLiveLoading(true);
    setLiveLocation(loc);
    try {
      const results = await searchStationsNear(loc);
      setStations(results);
      if (results[0]?.latitude) setCenter([results[0].latitude, results[0].longitude]);
    } catch (e) {
      setStations([]);
    } finally {
      setLiveLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...stations];
    if (filter !== "all") list = list.filter((s) => s.type === filter);
    if (query.trim() && !liveMode) {
      const q = query.toLowerCase();
      list = list.filter((s) => s.name?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.network?.toLowerCase().includes(q));
    }
    return list.sort((a, b) => (a.distance_km ?? 999) - (b.distance_km ?? 999));
  }, [stations, filter, query, liveMode]);

  const bestValueId = useMemo(() => {
    if (filter === "all") return null;
    const cheapest = [...stations].filter((s) => s.type === filter).sort((a, b) => a.price_per_kwh - b.price_per_kwh)[0];
    return cheapest?.id ?? null;
  }, [stations, filter]);

  return (
    <div className="h-full relative bg-background">
      {/* Map */}
      <MapContainer
        center={center}
        zoom={13}
        className="absolute inset-0 z-0"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        <FlyTo center={center} />
        {userPos && <Marker position={userPos} icon={userIcon}><Popup>Your location</Popup></Marker>}
        {filtered.map((s) =>
          s.latitude && s.longitude ? (
            <Marker
              key={s.id}
              position={[s.latitude, s.longitude]}
              icon={makeIcon(s.status)}
              eventHandlers={{ click: () => setSelected(s) }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-white/60">{s.type} · {s.power_kw} kW · {s.currency}{s.price_per_kwh.toFixed(2)}/kWh</div>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-3">
        <div className="glass rounded-3xl p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiveMode((v) => !v)}
              className={cn(
                "h-10 px-3 rounded-2xl flex items-center gap-1.5 text-[13px] font-semibold transition active:scale-95",
                liveMode ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-neutral-950 neon-blue" : "bg-white/5 text-white/60"
              )}
            >
              <LocateFixed className="w-4 h-4" /> Live
            </button>
            <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-2xl bg-white/5">
              <Search className="w-4 h-4 text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && liveMode && runLiveSearch(query)}
                placeholder={liveMode ? "City in Israel, e.g. Tel Aviv" : "Search stations"}
                className="flex-1 bg-transparent outline-none text-[13px] text-white placeholder:text-white/40"
              />
              {liveMode && (
                <button onClick={() => runLiveSearch(query)} disabled={liveLoading} className="text-[13px] font-semibold text-cyan-300 disabled:opacity-50">
                  {liveLoading ? "…" : "Find"}
                </button>
              )}
            </div>
            <button
              onClick={() => userPos && setCenter(userPos)}
              className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center active:scale-90 transition"
              aria-label="My location"
            >
              <LocateFixed className="w-4 h-4 text-cyan-300" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <FilterTabs value={filter} onChange={setFilter} />
            {liveMode && liveLocation && (
              <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {liveLocation}
              </span>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="glass rounded-2xl px-3 py-2 mt-2 inline-flex items-center gap-3 text-[11px] text-white/70">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 neon-green" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Occupied</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white/30" /> Offline</span>
        </div>
      </div>

      {/* Bottom sheet list */}
      <div className={cn(
        "absolute left-0 right-0 bottom-0 z-10 transition-transform duration-300",
        sheetOpen ? "translate-y-0" : "translate-y-[calc(100%-72px)]"
      )}>
        <div className="glass rounded-t-3xl border-t border-cyan-400/20 max-h-[60%] flex flex-col">
          <button onClick={() => setSheetOpen((v) => !v)} className="pt-3 pb-2 flex flex-col items-center shrink-0">
            <div className="w-10 h-1.5 rounded-full bg-white/20" />
            <div className="flex items-center gap-2 mt-2 text-white/70">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[13px] font-semibold">{filtered.length} stations nearby</span>
            </div>
          </button>
          <div className="overflow-y-auto px-4 pb-4 space-y-3">
            {(loading || liveLoading) ? (
              [0, 1, 2].map((i) => <div key={i} className="h-40 rounded-3xl glass animate-pulse" />)
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-white/40">
                <SlidersHorizontal className="w-7 h-7 mx-auto mb-2 opacity-50" />
                <p className="text-[13px]">No stations match your filters</p>
              </div>
            ) : (
              filtered.map((s) => (
                <StationCard key={s.id} station={s} isBestValue={s.id === bestValueId} onClick={() => setSelected(s)} />
              ))
            )}
          </div>
        </div>
      </div>

      <StationDetailSheet station={selected} onClose={() => setSelected(null)} />
    </div>
  );
}