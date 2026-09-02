import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Zap, Search, LocateFixed, SlidersHorizontal } from "lucide-react";
import StationCard from "@/components/charging/StationCard";
import FilterTabs from "@/components/charging/FilterTabs";
import SortMenu from "@/components/charging/SortMenu";
import StationDetailSheet from "@/components/charging/StationDetailSheet";
import iPhoneFrame from "@/components/charging/iPhoneFrame";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("value");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.ChargingStation.list("-created_date", 100)
      .then((data) => setStations(data))
      .catch(() => setStations([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...stations];
    if (filter !== "all") list = list.filter((s) => s.type === filter);
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
  }, [stations, filter, sort, query]);

  const bestValueId = useMemo(() => {
    if (filter === "all" || sort !== "value") return null;
    const cheapest = [...stations]
      .filter((s) => s.type === filter)
      .sort((a, b) => a.price_per_kwh - b.price_per_kwh)[0];
    return cheapest?.id ?? null;
  }, [stations, filter, sort]);

  const dcCount = stations.filter((s) => s.type === "DC").length;
  const acCount = stations.filter((s) => s.type === "AC").length;

  return (
    <iPhoneFrame>
    <div className="h-full font-body text-neutral-900">
      <div className="mx-auto max-w-md h-full bg-neutral-50 relative flex flex-col">
        {/* Status bar */}
        <div className="sticky top-0 z-30 bg-neutral-50/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[12px] font-semibold text-neutral-900">
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
                <h1 className="text-[26px] font-bold tracking-tight leading-tight">Chillcharge</h1>
                <p className="text-[12px] text-neutral-500 mt-0.5 flex items-center gap-1">
                  <LocateFixed className="w-3 h-3" /> Charging near you
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-5 pb-3">
            <div className="flex items-center gap-2 h-11 px-3.5 rounded-2xl bg-white border border-black/5 shadow-sm">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stations or city"
                className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Filters + sort */}
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
        </div>

        {/* List */}
        <div className="px-5 pt-1 pb-4 space-y-3 flex-1 overflow-y-auto">
          {loading ? (
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

        {/* Bottom tab bar */}
        <div className="shrink-0 px-3 pb-3 pt-1">
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-black/5 shadow-[0_-2px_20px_rgba(0,0,0,0.08)] flex items-center justify-around py-2.5">
            <button className="flex flex-col items-center gap-0.5 text-neutral-900">
              <Zap className="w-5 h-5 fill-neutral-900" />
              <span className="text-[10px] font-semibold">Stations</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-neutral-400">
              <LocateFixed className="w-5 h-5" />
              <span className="text-[10px] font-medium">Map</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-neutral-400">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">Filter</span>
            </button>
          </div>
        </div>
      </div>

      <StationDetailSheet station={selected} onClose={() => setSelected(null)} />
    </div>
    </iPhoneFrame>
  );
}