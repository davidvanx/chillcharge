import React from "react";
import { Zap, MapPin, Star, CheckCircle2, Clock, Wifi, Coffee, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const amenityIcon = {
  wifi: Wifi,
  coffee: Coffee,
  shop: ShoppingBag,
};

export default function StationCard({ station, isBestValue, onClick }) {
  const isDC = station.type === "DC";
  const occupancyPct = station.total ? ((station.total - station.available) / station.total) * 100 : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-3xl p-4 transition-all duration-300 active:scale-[0.98]",
        "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] border",
        isBestValue ? "border-emerald-400 shadow-[0_4px_24px_rgba(16,185,129,0.18)]" : "border-black/5"
      )}
    >
      {isBestValue && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" /> Best value
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[15px] text-neutral-900 truncate">{station.name}</h3>
          <p className="text-[12px] text-neutral-500 mt-0.5">{station.network}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-[12px] font-medium text-neutral-700">{station.rating?.toFixed(1) ?? "—"}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-neutral-400">
        <MapPin className="w-3.5 h-3.5" />
        <span className="text-[12px] truncate">{station.address}, {station.city}</span>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span
          className={cn(
            "text-[11px] font-semibold px-2.5 py-1 rounded-full",
            isDC ? "bg-violet-50 text-violet-700" : "bg-sky-50 text-sky-700"
          )}
        >
          {station.type}
        </span>
        <span className="text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
          {station.power_kw} kW
        </span>
        {station.amenities?.slice(0, 2).map((a) => {
          const Icon = amenityIcon[a];
          return Icon ? (
            <span key={a} className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-neutral-500" />
            </span>
          ) : null;
        })}
      </div>

      <div className="flex items-end justify-between mt-3.5 pt-3 border-t border-neutral-100">
        <div>
          <div className="text-[11px] text-neutral-400 leading-none">Price</div>
          <div className="text-[17px] font-bold text-neutral-900 leading-tight mt-0.5">
            {station.currency}{station.price_per_kwh.toFixed(2)}
            <span className="text-[11px] font-medium text-neutral-400 ml-0.5">/kWh</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-neutral-400 leading-none">Available</div>
          <div className="flex items-center gap-1 mt-0.5">
            {station.status === "available" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="text-[13px] font-semibold text-neutral-700">
              {station.available}/{station.total}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 h-1 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            occupancyPct > 80 ? "bg-amber-400" : "bg-emerald-400"
          )}
          style={{ width: `${Math.min(occupancyPct, 100)}%` }}
        />
      </div>
    </button>
  );
}