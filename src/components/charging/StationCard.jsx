import React from "react";
import { Zap, MapPin, Star, CheckCircle2, Clock, Wifi, Coffee, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/components/charging/SettingsProvider";

const amenityIcon = {
  wifi: Wifi,
  coffee: Coffee,
  shop: ShoppingBag,
};

export default function StationCard({ station, isBestValue, onClick }) {
  const { settings } = useSettings();
  const currency = settings.currency || station.currency || "₪";
  const isDC = station.type === "DC";
  const occupancyPct = station.total ? ((station.total - station.available) / station.total) * 100 : 0;
  const available = station.status === "available" && station.available > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-right rounded-[1.75rem] p-4 transition-all duration-300 active:scale-[0.97]",
        "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)] border",
        isBestValue ? "border-emerald-300 shadow-[0_6px_24px_rgba(16,185,129,0.16)]" : "border-black/[0.04]"
      )}
      dir="rtl"
    >
      {isBestValue && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" /> הכי משתלם
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[16px] text-neutral-900 truncate leading-tight">{station.name}</h3>
          <p className="text-[12px] text-neutral-500 mt-0.5 font-medium">{station.network}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-[12px] font-bold text-amber-700">{station.rating?.toFixed(1) ?? "—"}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-neutral-400">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[12px] truncate">{station.address}, {station.city}</span>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span
          className={cn(
            "text-[11px] font-bold px-2.5 py-1 rounded-full",
            isDC ? "bg-violet-50 text-violet-700" : "bg-sky-50 text-sky-700"
          )}
        >
          {station.type}
        </span>
        <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
          {station.power_kw} kW
        </span>
        {station.amenities?.slice(0, 2).map((a) => {
          const Icon = amenityIcon[a];
          return Icon ? (
            <span key={a} className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-neutral-500" />
            </span>
          ) : null;
        })}
      </div>

      <div className="flex items-end justify-between mt-4 pt-3 border-t border-neutral-100">
        <div>
          <div className="text-[11px] text-neutral-400 leading-none font-medium">מחיר</div>
          <div className="text-[20px] font-bold text-neutral-900 leading-tight mt-1">
            {currency}{station.price_per_kwh.toFixed(2)}
            <span className="text-[11px] font-medium text-neutral-400 mr-0.5">/kWh</span>
          </div>
        </div>
        <div className="text-left">
          <div className="text-[11px] text-neutral-400 leading-none font-medium">זמינות</div>
          <div className="flex items-center gap-1 mt-1 justify-end">
            {available ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <Clock className="w-4 h-4 text-amber-500" />
            )}
            <span className={cn("text-[14px] font-bold", available ? "text-emerald-600" : "text-amber-600")}>
              {station.available}/{station.total}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            occupancyPct > 80 ? "bg-amber-400" : "bg-emerald-400"
          )}
          style={{ width: `${Math.min(occupancyPct, 100)}%` }}
        />
      </div>
    </button>
  );
}