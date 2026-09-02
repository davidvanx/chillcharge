import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Map, Bookmark, Menu } from "lucide-react";
import { useLanguage } from "@/lib/i18n.jsx";
import { cn } from "@/lib/utils";
import MenuSheet from "@/components/charging/MenuSheet";

export default function BottomNav() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const items = [
    { to: "/", label: t("nav.map"), icon: Map, end: true },
    { to: "/saved", label: t("nav.saved"), icon: Bookmark },
  ];

  return (
    <>
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
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 text-white/40 transition-colors active:scale-95"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{t("nav.menu")}</span>
          </button>
        </div>
      </div>
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}