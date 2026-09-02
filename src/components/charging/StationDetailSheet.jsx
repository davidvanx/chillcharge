import React from "react";
import { X, MapPin, Star, CheckCircle2, Clock, Navigation, Wifi, Coffee, ShoppingBag, Plug, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n.jsx";

const amenityMeta = { wifi: { icon: Wifi, label: "Wi-Fi" }, coffee: { icon: Coffee, label: "Café" }, shop: { icon: ShoppingBag, label: "Shopping" } };

export default function StationDetailSheet({ station, onClose }) {
  const { t } = useLanguage();
  if (!station) return null;
  const isDC = station.type === "DC";
  const occ = station.total ? ((station.total - station.available) / station.total) * 100 : 0;
  const navUrl = station.latitude && station.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`
    : null;

  return (
    <div className="fixed sm:absolute inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-card rounded-t-[2rem] sm:rounded-3xl shadow-2xl max-h-[88vh] overflow-y-auto border-t border-cyan-400/30">
        <div className="sticky top-0 bg-card pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-white/20" />
        </div>
        <div className="px-5 pb-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">{station.name}</h2>
              <p className="text-[13px] text-white/50 mt-0.5">{station.network}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-3 text-[13px] text-white/60">
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{station.rating?.toFixed(1)}</span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{station.distance_km?.toFixed(1)} km</span>
          </div>

          <div className="mt-4 h-32 rounded-2xl glass flex items-center justify-center relative overflow-hidden">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg", isDC ? "bg-violet-500 neon-blue" : "bg-cyan-500 neon-blue")}>
              <Plug className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <div className="rounded-2xl bg-white/5 p-3 text-center"><div className="text-[11px] text-white/40">{t("detail.type")}</div><div className={cn("text-sm font-bold mt-0.5", isDC ? "text-violet-300" : "text-cyan-300")}>{station.type}</div></div>
            <div className="rounded-2xl bg-white/5 p-3 text-center"><div className="text-[11px] text-white/40">{t("detail.power")}</div><div className="text-sm font-bold text-white mt-0.5">{station.power_kw} kW</div></div>
            <div className="rounded-2xl bg-white/5 p-3 text-center"><div className="text-[11px] text-white/40">{t("detail.price")}</div><div className="text-sm font-bold text-white mt-0.5">{station.price_per_kwh.toFixed(2)} ₪</div></div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-white/80">{t("detail.availability")}</span>
              <span className="flex items-center gap-1 text-[13px]">
                {station.status === "available" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-red-400" />}
                <span className="font-semibold text-white">{station.available}</span>
                <span className="text-white/40">/ {station.total} {t("detail.free")}</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className={cn("h-full rounded-full", occ > 80 ? "bg-red-400" : "bg-emerald-400")} style={{ width: `${occ}%` }} />
            </div>
          </div>

          {station.amenities?.length > 0 && (
            <div className="mt-4">
              <div className="text-[13px] font-semibold text-white/80 mb-2">{t("detail.amenities")}</div>
              <div className="flex flex-wrap gap-2">
                {station.amenities.map((a) => {
                  const m = amenityMeta[a]; if (!m) return null; const Icon = m.icon;
                  return <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-[12px] font-medium text-white/70"><Icon className="w-3.5 h-3.5" />{m.label}</span>;
                })}
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-2.5">
            <button className="flex-1 h-12 rounded-2xl bg-white/5 font-semibold text-[14px] text-white active:scale-95 transition">{t("detail.save")}</button>
            <a href={navUrl || "#"} target="_blank" rel="noreferrer" className="flex-[1.6] h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 font-semibold text-[14px] text-neutral-950 flex items-center justify-center gap-2 active:scale-95 transition shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              <Navigation className="w-4 h-4" /> {t("detail.navigate")} <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}