import React from "react";
import { X, Apple } from "lucide-react";
import { useSettings } from "@/components/charging/SettingsProvider";

export default function NavMenu({ station, onClose }) {
  const { t, dir } = useSettings();
  if (!station) return null;

  const hasCoords = station.latitude != null && station.longitude != null;
  const dest = hasCoords
    ? `${station.latitude},${station.longitude}`
    : encodeURIComponent(`${station.name} ${station.address || ""} ${station.city || ""}`.trim());

  const apps = [
    { name: "Waze", icon: "W", bg: "bg-sky-400", url: hasCoords ? `https://waze.com/ul?ll=${dest}&navigate=yes` : `https://waze.com/ul?q=${dest}&navigate=yes` },
    { name: "Google Maps", icon: "G", bg: "bg-red-500", url: `https://www.google.com/maps/dir/?api=1&destination=${dest}` },
    { name: "Apple Maps", icon: null, bg: "bg-neutral-900", url: `https://maps.apple.com/?${hasCoords ? "daddr" : "q"}=${dest}` },
  ];

  return (
    <div className="absolute inset-0 z-[60] flex items-end justify-center" dir={dir}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom pb-safe">
        <div className="pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-neutral-200" />
        </div>
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-bold text-neutral-900">{t("nav.title")}</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition">
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
          <div className="space-y-2.5">
            {apps.map((app) => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-14 rounded-2xl bg-neutral-50 active:bg-neutral-100 flex items-center gap-3 px-4 transition"
              >
                <span className={`w-10 h-10 rounded-xl ${app.bg} flex items-center justify-center shrink-0`}>
                  {app.icon ? (
                    <span className="text-[18px] font-bold text-white">{app.icon}</span>
                  ) : (
                    <Apple className="w-5 h-5 text-white" />
                  )}
                </span>
                <span className="text-[15px] font-bold text-neutral-900">{app.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}