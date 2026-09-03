import React, { useState } from "react";
import { useSettings } from "@/components/charging/SettingsProvider";
import { Accessibility, X, Type, Contrast, Volume2, Gauge, Focus, Moon, Subtitles, Languages } from "lucide-react";

function speak(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "he-IL";
  window.speechSynthesis.speak(u);
}

function Toggle({ icon: Icon, label, on, onChange }) {
  return (
    <button onClick={onChange} className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 text-right">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-neutral-500" />
        <span className="text-[13px] font-medium text-neutral-700">{label}</span>
      </div>
      <div className={`w-10 h-6 rounded-full relative transition shrink-0 ${on ? "bg-emerald-500" : "bg-neutral-200"}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-0.5" : "right-0.5"}`} />
      </div>
    </button>
  );
}

export default function AccessibilityMenu() {
  const { settings, update } = useSettings();
  const [open, setOpen] = useState(false);

  const options = [
    { key: "largeText", icon: Type, label: "טקסט מוגדל" },
    { key: "contrast", icon: Contrast, label: "ניגודיות גבוהה" },
    { key: "voice", icon: Volume2, label: "הקראה בקול" },
    { key: "motion", icon: Gauge, label: "האטת אנימציות" },
    { key: "focus", icon: Focus, label: "מסגרת ממוקדת" },
    { key: "dark", icon: Moon, label: "מצב כהה" },
    { key: "subtitles", icon: Subtitles, label: "כתוביות ותיאורים" },
    { key: "translate", icon: Languages, label: "תרגום שפה" },
  ];

  const toggle = (key) => {
    const next = !settings[key];
    update({ [key]: next });
    if (key === "voice") speak(next ? "הקראה בקול הופעלה" : "הקראה בקול בוטלה");
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="absolute bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-neutral-900 text-white shadow-lg shadow-black/20 flex items-center justify-center active:scale-90 transition"
        aria-label="נגישות"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {open && (
        <div className="absolute bottom-40 right-4 z-40 w-64 max-w-[80%] rounded-2xl bg-white shadow-2xl border border-black/5 p-2 animate-in fade-in slide-in-from-bottom-2" dir="rtl">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-[14px] font-bold text-neutral-900">נגישות</span>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-neutral-500" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {options.map((o) => (
              <Toggle key={o.key} icon={o.icon} label={o.label} on={settings[o.key]} onChange={() => toggle(o.key)} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}