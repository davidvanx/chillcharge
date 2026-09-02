import React from "react";
import { cn } from "@/lib/utils";

export default function FilterTabs({ value, onChange }) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "DC", label: "DC Fast" },
    { id: "AC", label: "AC" },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 active:scale-95",
            value === t.id
              ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-neutral-950 neon-blue"
              : "bg-white/5 text-white/50 border border-white/10"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}