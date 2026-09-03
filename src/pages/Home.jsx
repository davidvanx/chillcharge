import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Zap, Search, LocateFixed, SlidersHorizontal, Menu, Map as MapIcon } from "lucide-react";
import StationCard from "@/components/charging/StationCard";
import FilterTabs from "@/components/charging/FilterTabs";
import SortMenu from "@/components/charging/SortMenu";
import StationDetailSheet from "@/components/charging/StationDetailSheet";
import IPhoneFrame from "@/components/charging/iPhoneFrame";
import SettingsMenu from "@/components/charging/SettingsMenu";
import PaymentSheet from "@/components/charging/PaymentSheet";
import ChargingSession from "@/components/charging/ChargingSession";
import AccessibilityMenu from "@/components/charging/AccessibilityMenu";
import MapView from "@/components/charging/MapView";
import FiltersSheet from "@/components/charging/FiltersSheet";
import { SettingsProvider, useSettings } from "@/components/charging/SettingsProvider";
import { cn } from "@/lib/utils";
import { searchStationsNear } from "@/lib/chargingSearch";

function HomeInner() {
  const { settings } = useSettings();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("value");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [liveMode, setLiveMode] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveLocation, setLiveLocation] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [payStation, setPayStation] = useState(null);
  const [sessionStation, setSessionStation] = useState(null);
  const [view, setView] = useState("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advFilters, setAdvFilters] = useState({
    onlyAvailable: false,
    minPower: 0,
    maxPrice: 0,
    amenities: [],
    network: "all",
  });

  useEffect(() => {
    base44.entities.ChargingStation.list("-created_date", 100)
      .then((data) => setStations(data))
      .catch(() => setStations([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (settings.defaultCity) setQuery(settings.defaultCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runLiveSearch = async (location) => {
    const loc = (location || query).trim();
    if (!loc) return;
    setLiveLoading(true);
    setLiveLocation(loc);
    try {
      const results = await searchStationsNear(loc);
      setStations(results);
    } catch (e) {
      setStations([]);
    } finally {
      setLiveLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...stations];
    if (filter !== "all") list = list.filter((s) => s.type === filter);
    if (advFilters.onlyAvailable) list = list.filter((s) => s.status === "available" && s.available > 0);
    if (advFilters.minPower > 0) list = list.filter((s) => s.power_kw >= advFilters.minPower);
    if (advFilters.maxPrice > 0) list = list.filter((s) => s.price_per_kwh <= advFilters.maxPrice);
    if (advFilters.network !== "all") list = list.filter((s) => s.network === advFilters.network);
    if (advFilters.amenities.length > 0) list = list.filter((s) => advFilters.amenities.every((a) => s.amenities?.includes(a)));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q) ||
          s.network?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "value") return a.price_per_kwh - b.price_per_kwh;
      if (sort === "distance") return (a.distance_km ?? 999) - (b.distance_km ?? 999);
      if (sort === "power") return b.power_kw - a.power_kw;
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });
    return list;
  }, [stations, filter, sort, query, advFilters]);

  const bestValueId = useMemo(() => {
    if (filter === "all" || sort !== "value") return null;
    const cheapest = [...stations]
      .filter((s) => s.type === filter)
      .sort((a, b) => a.price_per_kwh - b.price_per_kwh)[0];
    return cheapest?.id ?? null;
  }, [stations, filter, sort]);

  const dcCount = stations.filter((s) => s.type === "DC").length;
  const acCount = stations.filter((s) => s.type === "AC").length;
  const networks = useMemo(() => [...new Set(stations.map((s) => s.network).filter(Boolean))], [stations]);

  const a11yClass = [
    settings.dark && "a11y-dark",
    settings.motion && "a11y-motion",
    settings.focus && "a11y-focus",
  ].filter(Boolean).join(" ");
  const a11yStyle = {};
  const filters = [];
  if (settings.dark) filters.push("invert(1)", "hue-rotate(180deg)");
  if (settings.contrast) filters.push("contrast(1.3)", "saturate(1.25)");
  if (filters.length) a11yStyle.filter = filters.join(" ");
  if (settings.largeText) a11yStyle.zoom = 1.08;

  return (
    <div className="relative h-full font-body text-neutral-900">
      <div className={`mx-auto max-w-md h-full bg-gradient-to-b from-emerald-50/60 to-neutral-50 relative flex flex-col ${a11yClass}`} style={a11yStyle}>
        {/* Status bar */}
        <div className="sticky top-0 z-30 bg-emerald-50/70 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-1 text-[12px] font-semibold text-neutral-900">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="1"/><rect x="4" y="4" width="3" height="6" rx="1"/><rect x="8" y="2" width="3" height="8" rx="1"/><rect x="12" y="0" width="3" height="10" rx="1"/></svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 0C4.2 0 1.6 1.1 0 2.9l1.4 1.4C2.7 2.9 4.8 2 7 2s4.3.9 5.6 2.3L14 2.9C12.4 1.1 9.8 0 7 0zm0 4C5.3 4 3.7 4.7 2.5 5.9l1.4 1.4C4.7 6.5 5.8 6 7 6s2.3.5 3.1 1.3l1.4-1.4C10.3 4.7 8.7 4 7 4zm0 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/></svg>
              <div className="flex items-center"><div className="w-6 h-3 rounded-sm border border-neutral-900/40 relative"><div className="absolute inset-0.5 bg-neutral-900 rounded-[1px]" style={{ width: "70%" }} /></div></div>
            </div>
          </div>

          {/* Header */}
          <div className="px-5 pt-2 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[26px] font-bold tracking-tight leading-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Chillcharge</h1>
                <p className="text-[12px] text-emerald-600 mt-0.5 flex items-center gap-1 font-medium">
                  <LocateFixed className="w-3 h-3" /> Charging near you
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="w-10 h-10 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center active:scale-90 transition"
                  aria-label="תפריט"
                >
                  <Menu className="w-5 h-5 text-neutral-700" />
                </button>
                <img
                  src="https://media.base44.com/images/public/6a9882e54bedc57ccf9f0c16/018895c7e_generated_image.png"
                  alt="Chillcharge"
                  className="w-11 h-11 rounded-2xl shadow-lg object-cover ring-1 ring-emerald-200"
                />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-5 pb-3 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLiveMode((v) => !v)}
                className={
                  "h-11 px-3.5 rounded-2xl border shadow-sm flex items-center gap-1.5 text-[13px] font-semibold transition active:scale-95 " +
                  (liveMode
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-neutral-600 border-black/5")
                }
              >
                <LocateFixed className="w-4 h-4" />
                Live
              </button>
              <div className="flex-1 flex items-center gap-2 h-11 px-3.5 rounded-2xl bg-white border border-black/5 shadow-sm">
                <Search className="w-4 h-4 text-neutral-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (liveMode) runLiveSearch(query);
                    }
                  }}
                  placeholder={liveMode ? "Enter a city in Israel, e.g. Tel Aviv" : "Search stations or city"}
                  className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-neutral-400"
                />
                {liveMode && (
                  <button
                    onClick={() => runLiveSearch(query)}
                    disabled={liveLoading}
                    className="text-[13px] font-semibold text-emerald-600 disabled:opacity-50"
                  >
                    {liveLoading ? "…" : "Find"}
                  </button>
                )}
              </div>
            </div>
            {liveMode && (
              <div className="flex gap-1.5 flex-wrap">
                {["Tel Aviv", "Jerusalem", "Haifa", "Herzliya", "Netanya"].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setQuery(c);
                      runLiveSearch(c);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white border border-black/5 text-[11px] font-medium text-neutral-500 shadow-sm active:scale-95 transition"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            {liveMode && liveLocation && (
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live results near {liveLocation}, Israel
              </p>
            )}
          </div>

          {view === "list" && (
            <>
              <div className="px-5 pb-3 flex items-center justify-between gap-2">
                <FilterTabs value={filter} onChange={setFilter} />
                <SortMenu value={sort} onChange={setSort} />
              </div>

              {/* Count summary */}
              <div className="px-5 pb-2 flex items-center gap-3 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> {dcCount} DC fast</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> {acCount} AC</span>
                <span className="ml-auto">{filtered.length} shown</span>
              </div>
            </>
          )}
        </div>

        {view === "list" ? (
          <div className="px-5 pt-1 pb-4 space-y-3 flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {loading || liveLoading ? (
              [0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl bg-white border border-black/5 p-4 h-44 animate-pulse">
                  <div className="h-3 w-1/2 bg-neutral-100 rounded mb-3" />
                  <div className="h-2 w-2/3 bg-neutral-100 rounded mb-6" />
                  <div className="h-8 w-1/3 bg-neutral-100 rounded" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                <SlidersHorizontal className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-[14px]">No stations match your filters</p>
              </div>
            ) : (
              filtered.map((s) => (
                <StationCard
                  key={s.id}
                  station={s}
                  isBestValue={s.id === bestValueId}
                  onClick={() => setSelected(s)}
                />
              ))
            )}
          </div>
        ) : (
          <MapView stations={filtered} onSelect={setSelected} />
        )}

        {/* Bottom tab bar */}
        <div className="shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1">
          <div className="relative z-30 rounded-3xl bg-white/90 backdrop-blur-xl border border-black/5 shadow-[0_-2px_20px_rgba(0,0,0,0.08)] flex items-center justify-around py-2.5">
            <button onClick={() => setView("list")} className={cn("flex flex-col items-center gap-0.5 transition", view === "list" ? "text-emerald-600" : "text-neutral-400")}>
              <Zap className={cn("w-5 h-5", view === "list" && "fill-emerald-500 text-emerald-500")} />
              <span className="text-[10px] font-semibold">עמדות</span>
            </button>
            <button onClick={() => setView("map")} className={cn("flex flex-col items-center gap-0.5 transition", view === "map" ? "text-emerald-600" : "text-neutral-400")}>
              <MapIcon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">מפה</span>
            </button>
            <button onClick={() => setFiltersOpen(true)} className={cn("flex flex-col items-center gap-0.5 transition", filtersOpen ? "text-emerald-600" : "text-neutral-400")}>
              <SlidersHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-semibold">פילטרים</span>
            </button>
          </div>
        </div>
      </div>

      <StationDetailSheet
        station={selected}
        onClose={() => setSelected(null)}
        onStartCharging={(s) => {
          setSelected(null);
          setPayStation(s);
        }}
      />
      <SettingsMenu open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <PaymentSheet station={payStation} onClose={() => setPayStation(null)} onConfirm={(s) => setSessionStation(s)} />
      <ChargingSession station={sessionStation} onEnd={() => setSessionStation(null)} />
      <FiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={{ type: filter, ...advFilters }}
        onChange={(v) => {
          setFilter(v.type || "all");
          setAdvFilters({
            onlyAvailable: v.onlyAvailable,
            minPower: v.minPower,
            maxPrice: v.maxPrice,
            amenities: v.amenities,
            network: v.network,
          });
        }}
        networks={networks}
      />
      <AccessibilityMenu />
    </div>
  );
}

export default function Home() {
  return (
    <IPhoneFrame>
      <SettingsProvider>
        <HomeInner />
      </SettingsProvider>
    </IPhoneFrame>
  );
}