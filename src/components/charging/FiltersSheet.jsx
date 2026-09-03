import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const amenitiesList = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "coffee", label: "Café" },
  { key: "shop", label: "Shopping" },
];
const powerPresets = [0, 50, 100, 150];
const pricePresets = [0, 2, 3, 4];

const defaults = { type: "all", onlyAvailable: false, minPower: 0, maxPrice: 0, amenities: [], network: "all" };

export default function FiltersSheet({ open, onClose, value, onChange, networks }) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    if (open) setLocal(value);
  }, [open, value]);

  if (!open) return null;

  const set = (patch) => setLocal((v) => ({ ...v, ...patch }));

  const toggleAmenity = (key) => {
    setLocal((v) => ({
      ...v,
      amenities: v.amenities.includes(key) ? v.amenities.filter((a) => a !== key) : [...v.amenities, key],
    }));
  };

  const reset = () => {
    setLocal(defaults);
    onChange(defaults);
    onClose();
  };

  const apply = () => {
    onChange(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md bg-white rounded-t-[2rem] shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom"
        dir="rtl"
      >
        <div className="sticky top-0 bg-white pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-neutral-200" />
        </div>
        <div className="px-5 pb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">פילטרים</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          {/* Type */}
          <div className="mt-5">
            <div className="text-[13px] font-semibold text-neutral-700 mb-2">סוג טעינה</div>
            <div className="flex gap-2">
              {[
                { k: "all", l: "הכל" },
                { k: "DC", l: "DC מהיר" },
                { k: "AC", l: "AC" },
              ].map((o) => (
                <button
                  key={o.k}
                  onClick={() => set({ type: o.k })}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-[13px] font-semibold border transition",
                    local.type === o.k ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-neutral-600 border-black/5"
                  )}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-neutral-700">זמין עכשיו בלבד</span>
            <button
              onClick={() => set({ onlyAvailable: !local.onlyAvailable })}
              className={cn("w-11 h-6 rounded-full relative transition", local.onlyAvailable ? "bg-emerald-500" : "bg-neutral-200")}
            >
              <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", local.onlyAvailable ? "left-0.5" : "right-0.5")} />
            </button>
          </div>

          {/* Min power */}
          <div className="mt-5">
            <div className="text-[13px] font-semibold text-neutral-700 mb-2">הספק מינימלי</div>
            <div className="flex gap-2">
              {powerPresets.map((p) => (
                <button
                  key={p}
                  onClick={() => set({ minPower: p })}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-[12px] font-semibold border transition",
                    local.minPower === p ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-neutral-600 border-black/5"
                  )}
                >
                  {p === 0 ? "הכל" : `${p}+ kW`}
                </button>
              ))}
            </div>
          </div>

          {/* Max price */}
          <div className="mt-5">
            <div className="text-[13px] font-semibold text-neutral-700 mb-2">מחיר מקסימלי ל-kWh</div>
            <div className="flex gap-2">
              {pricePresets.map((p) => (
                <button
                  key={p}
                  onClick={() => set({ maxPrice: p })}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-[12px] font-semibold border transition",
                    local.maxPrice === p ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-neutral-600 border-black/5"
                  )}
                >
                  {p === 0 ? "הכל" : `₪${p}`}
                </button>
              ))}
            </div>
          </div>

          {/* Network */}
          {networks?.length > 0 && (
            <div className="mt-5">
              <div className="text-[13px] font-semibold text-neutral-700 mb-2">רשת</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => set({ network: "all" })}
                  className={cn(
                    "px-3 h-9 rounded-xl text-[12px] font-semibold border transition",
                    local.network === "all" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-neutral-600 border-black/5"
                  )}
                >
                  הכל
                </button>
                {networks.map((n) => (
                  <button
                    key={n}
                    onClick={() => set({ network: n })}
                    className={cn(
                      "px-3 h-9 rounded-xl text-[12px] font-semibold border transition",
                      local.network === n ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-neutral-600 border-black/5"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="mt-5">
            <div className="text-[13px] font-semibold text-neutral-700 mb-2">שירותים</div>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((a) => {
                const on = local.amenities.includes(a.key);
                return (
                  <button
                    key={a.key}
                    onClick={() => toggleAmenity(a.key)}
                    className={cn(
                      "px-3 h-9 rounded-xl text-[12px] font-semibold border transition flex items-center gap-1",
                      on ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-neutral-600 border-black/5"
                    )}
                  >
                    {on && <Check className="w-3.5 h-3.5" />}
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-2.5">
            <button
              onClick={reset}
              className="flex-1 h-12 rounded-2xl bg-neutral-100 font-semibold text-[14px] text-neutral-800 active:scale-95 transition"
            >
              איפוס
            </button>
            <button
              onClick={apply}
              className="flex-[2] h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-[14px] text-white active:scale-95 transition shadow-lg shadow-emerald-500/30"
            >
              הצג תוצאות
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}