import React from "react";
import { cn } from "@/lib/utils";

export default function FilterTabs({ value, onChange }) {
  const tabs = [
    { id: "all", label: "הכל" },
    { id: "DC", label: "DC מהיר" },
    { id: "AC", label: "AC" },
  ];

  return (
    <div className="flex gap-2" dir="rtl">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200 active:scale-95",
            value === t.id
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30"
              : "bg-white text-neutral-500 border border-black/5 shadow-sm"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}