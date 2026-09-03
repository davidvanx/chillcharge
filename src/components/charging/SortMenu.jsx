import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const options = [
    { id: "value", label: "הכי משתלם" },
    { id: "distance", label: "הכי קרוב" },
    { id: "power", label: "הכי מהיר" },
    { id: "rating", label: "הכי מדורג" },
  ];
  const current = options.find((o) => o.id === value);

  return (
    <div className="relative" dir="rtl">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-black/5 shadow-sm text-[13px] font-bold text-neutral-700 active:scale-95 transition"
      >
        {current?.label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-black/5 py-1.5 z-20 overflow-hidden">
            {options.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  onChange(o.id);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 font-medium"
              >
                {o.label}
                {value === o.id && <Check className="w-4 h-4 text-emerald-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}