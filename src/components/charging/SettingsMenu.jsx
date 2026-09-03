import React, { useState } from "react";
import { X, Settings, User, Shield, Mail, ChevronLeft } from "lucide-react";

const items = [
  { id: "settings", label: "הגדרות", icon: Settings, desc: "העדפות כלליות, שפה, התראות" },
  { id: "personal", label: "פרטים אישיים", icon: User, desc: "שם, אימייל, פרטי רכב" },
  { id: "privacy", label: "פרטיות", icon: Shield, desc: "מיקום, היסטוריה, שיתוף מידע" },
  { id: "contact", label: "יצירת קשר", icon: Mail, desc: "תמיכה, משוב, דיווח תקלה" },
];

const content = {
  settings: "כאן תוכלו לנהל את העדפות האפליקציה — שפה, התראות, יחידות ועוד.",
  personal: "נהלו את הפרטים האישיים: שם מלא, כתובת אימייל ופרטי הרכב.",
  privacy: "שליטה מלאה בנתוני המיקום, היסטוריית הטעינות ושיתוף מידע.",
  contact: "צרו קשר עם התמיכה, שלחו משוב או דווחו על תקלה בעמדת טעינה.",
};

export default function SettingsMenu({ open, onClose }) {
  const [active, setActive] = useState(null);
  if (!open) return null;
  const currentItem = items.find((i) => i.id === active);

  return (
    <div className="absolute inset-0 z-50" dir="rtl">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-[84%] max-w-[320px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <button
            onClick={active ? () => setActive(null) : onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
          <h2 className="text-[16px] font-bold text-neutral-900">{currentItem ? currentItem.label : "תפריט"}</h2>
          <div className="w-9" />
        </div>

        {!currentItem ? (
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(it.id)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition text-right"
                >
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-neutral-900">{it.label}</div>
                    <div className="text-[12px] text-neutral-400 truncate">{it.desc}</div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-neutral-300" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <p className="text-[14px] text-neutral-600 leading-relaxed">{content[currentItem.id]}</p>
            <div className="mt-5 space-y-3">
              {["אפשרות ראשונה", "אפשרות שנייה", "אפשרות שלישית"].map((o, i) => (
                <div key={o} className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50">
                  <span className="text-[13px] font-medium text-neutral-700">{o}</span>
                  <div className={`w-10 h-6 rounded-full relative transition ${i === 0 ? "bg-emerald-500" : "bg-neutral-200"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${i === 0 ? "left-0.5" : "right-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}