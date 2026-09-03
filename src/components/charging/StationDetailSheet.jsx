import React from "react";
import { X, Zap, MapPin, Star, CheckCircle2, Clock, Navigation, Wifi, Coffee, ShoppingBag, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

const amenityMeta = {
  wifi: { icon: Wifi, label: "Wi-Fi" },
  coffee: { icon: Coffee, label: "Café" },
  shop: { icon: ShoppingBag, label: "Shopping" },
};

export default function StationDetailSheet({ station, onClose }) {
  if (!station) return null;
  const isDC = station.type === "DC";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-[2rem] shadow-2xl max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="sticky top-0 bg-white pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-neutral-200" />
        </div>
        <div className="px-5 pb-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">{station.name}</h2>
              <p className="text-[13px] text-neutral-500 mt-0.5">{station.network}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition">
              <X className="w-4.5 h-4.5 text-neutral-500" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-3 text-[13px] text-neutral-600">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {station.rating?.toFixed(1)}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {station.distance_km?.toFixed(1)} km
            </span>
          </div>

          <div className="mt-4 h-32 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, rgba(0,0,0,0.08) 0, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.06) 0, transparent 50%)" }} />
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg", isDC ? "bg-violet-500" : "bg-sky-500")}>
              <Plug className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <div className="rounded-2xl bg-neutral-50 p-3 text-center">
              <div className="text-[11px] text-neutral-400">Type</div>
              <div className={cn("text-sm font-bold mt-0.5", isDC ? "text-violet-600" : "text-sky-600")}>{station.type}</div>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-3 text-center">
              <div className="text-[11px] text-neutral-400">Power</div>
              <div className="text-sm font-bold text-neutral-900 mt-0.5">{station.power_kw} kW</div>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-3 text-center">
              <div className="text-[11px] text-neutral-400">Price</div>
              <div className="text-sm font-bold text-neutral-900 mt-0.5">{station.currency}{station.price_per_kwh.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-neutral-700">Availability</span>
              <span className="flex items-center gap-1 text-[13px]">
                {station.status === "available" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
                <span className="font-semibold text-neutral-900">{station.available}</span>
                <span className="text-neutral-400">/ {station.total} free</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className={cn("h-full rounded-full", ((station.total - station.available) / station.total) > 0.8 ? "bg-amber-400" : "bg-emerald-400")}
                style={{ width: `${((station.total - station.available) / station.total) * 100}%` }}
              />
            </div>
          </div>

          {station.amenities?.length > 0 && (
            <div className="mt-4">
              <div className="text-[13px] font-semibold text-neutral-700 mb-2">Amenities</div>
              <div className="flex flex-wrap gap-2">
                {station.amenities.map((a) => {
                  const meta = amenityMeta[a];
                  if (!meta) return null;
                  const Icon = meta.icon;
                  return (
                    <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-[12px] font-medium text-neutral-700">
                      <Icon className="w-3.5 h-3.5" />
                      {meta.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-2.5">
            <button className="flex-1 h-12 rounded-2xl bg-neutral-100 font-semibold text-[14px] text-neutral-800 active:scale-95 transition">
              Save
            </button>
            <button className="flex-[1.6] h-12 rounded-2xl bg-neutral-900 font-semibold text-[14px] text-white flex items-center justify-center gap-2 active:scale-95 transition shadow-lg">
              <Navigation className="w-4 h-4" />
              Navigate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}