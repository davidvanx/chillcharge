import React from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/components/charging/SettingsProvider";

export default function FilterTabs({ value, onChange }) {
  const { t, dir } = useSettings();
  const tabs = [
    { id: "all", label: t("tabs.all") },
    { id: "DC", label: t("tabs.dc") },
    { id: "AC", label: t("tabs.ac") },
  ];

  return (
    <div className="flex gap-2" dir={dir}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200 active:scale-95",
            value === tab.id
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30"
              : "bg-white text-neutral-500 border border-black/5 shadow-sm"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}