import React from "react";
import { Zap, MapPin, Star, CheckCircle2, Clock, Wifi, Coffee, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n.jsx";

const amenityIcon = { wifi: Wifi, coffee: Coffee, shop: ShoppingBag };

const statusColor = {
  available: "text-emerald-400",
  busy: "text-red-400",
  offline: "text-white/30",
};

export default function StationCard({ station, isBestValue, onClick }) {
  const isDC = station.type === "DC";
  const occ = station.total ? ((station.total - station.available) / station.total) * 100 : 0;
  const dot = station.status === "available" ? "bg-emerald-400" : station.status === "busy" ? "bg-red-400" : "bg-white/30";
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-3xl p-4 transition-all duration-300 active:scale-[0.98] glass",
        isBestValue && "border-emerald-400/60 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
      )}
    >
      {isBestValue && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-400/15 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" /> {t("station.bestValue")}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", dot)} />
            <h3 className="font-semibold text-[15px] text-white truncate">{station.name}</h3>
          </div>
          <p className="text-[12px] text-white/40 mt-0.5">{station.network}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-[12px] font-medium text-white/70">{station.rating?.toFixed(1) ?? "—"}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-white/40">
        <MapPin className="w-3.5 h-3.5" />
        <span className="text-[12px] truncate">{station.address}, {station.city}</span>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full", isDC ? "bg-violet-400/15 text-violet-300" : "bg-cyan-400/15 text-cyan-300")}>
          {station.type}
        </span>
        <span className="text-[11px] font-medium text-white/70 bg-white/5 px-2.5 py-1 rounded-full">{station.power_kw} kW</span>
        <span className="text-[11px] font-medium text-white/50">{station.distance_km?.toFixed(1)} km</span>
      </div>

      <div className="flex items-end justify-between mt-3.5 pt-3 border-t border-white/10">
        <div>
          <div className="text-[11px] text-white/40 leading-none">{t("station.price")}</div>
          <div className="text-[17px] font-bold text-white leading-tight mt-0.5">
            {station.price_per_kwh.toFixed(2)} ₪
            <span className="text-[11px] font-medium text-white/40 ml-0.5">/kWh</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-white/40 leading-none">{t("station.available")}</div>
          <div className="flex items-center gap-1 mt-0.5">
            {station.status === "available" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-red-400" />}
            <span className="text-[13px] font-semibold text-white">{station.available}/{station.total}</span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 h-1 rounded-full bg-white/10 overflow-hidden">
        <div className={cn("h-full rounded-full", occ > 80 ? "bg-red-400" : "bg-emerald-400")} style={{ width: `${Math.min(occ, 100)}%` }} />
      </div>
    </button>
  );
}