import React from "react";
import { useNavigate } from "react-router-dom";
import { X, User, Settings, Zap, Receipt, FileText } from "lucide-react";
import { useLanguage } from "@/lib/i18n.jsx";

const items = [
  { to: "/profile", key: "menu.profile", icon: User },
  { to: "/settings", key: "menu.settings", icon: Settings },
  { to: "/sessions", key: "menu.sessions", icon: Zap },
  { to: "/receipts", key: "menu.receipts", icon: Receipt },
  { to: "/legal", key: "menu.legal", icon: FileText },
];

export default function MenuSheet({ open, onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  if (!open) return null;

  const go = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 bottom-0 right-0 w-[78%] max-w-xs glass border-l border-cyan-400/20 shadow-2xl flex flex-col animate-[slidein_0.25s_ease-out]">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
          <span className="text-[15px] font-bold text-white">{t("nav.menu")}</span>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {items.map(({ to, key, icon: Icon }) => (
            <button
              key={to}
              onClick={() => go(to)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition active:scale-98 text-right"
            >
              <Icon className="w-5 h-5 text-cyan-300" />
              <span className="text-[15px] font-semibold text-white">{t(key)}</span>
            </button>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[11px] text-white/30">Chillcharge · ישראל</p>
        </div>
      </div>
    </div>
  );
}