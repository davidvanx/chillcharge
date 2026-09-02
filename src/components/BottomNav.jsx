import React from "react";
import { NavLink } from "react-router-dom";
import { Map, Bookmark, User, Settings, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Map", icon: Map, end: true },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/legal", label: "Legal", icon: FileText },
];

export default function BottomNav() {
  return (
    <div className="shrink-0 px-3 pb-3 pt-1">
      <div className="glass rounded-3xl flex items-center justify-around py-2.5 shadow-[0_-2px_30px_rgba(34,211,238,0.12)]">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 transition-colors",
                isActive ? "text-cyan-300" : "text-white/40"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("w-5 h-5 transition-all", isActive && "drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]")} />
                <span className="text-[10px] font-semibold">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}