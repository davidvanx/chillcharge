import React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n.jsx";

export default function FilterTabs({ value, onChange }) {
  const { t } = useLanguage();
  const tabs = [
    { id: "all", label: t("filter.all") },
    { id: "DC", label: t("filter.dc") },
    { id: "AC", label: t("filter.ac") },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 active:scale-95",
            value === tab.id
              ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-neutral-950 neon-blue"
              : "bg-white/5 text-white/50 border border-white/10"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}