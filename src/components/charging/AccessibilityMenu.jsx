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
    <button onClick={onChange} className="w-full flex items-center justify-between p-2.5 rounded-xl active:bg-neutral-100 text-right transition" dir="rtl">
      <div className="flex items-center gap-3">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${on ? "bg-emerald-50" : "bg-neutral-100"}`}>
          <Icon className={`w-4 h-4 ${on ? "text-emerald-600" : "text-neutral-500"}`} />
        </span>
        <span className="text-[13px] font-semibold text-neutral-800">{label}</span>
      </div>
      <div className={`w-11 h-6 rounded-full relative transition shrink-0 ${on ? "bg-emerald-500" : "bg-neutral-200"}`}>
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
        className="absolute top-[max(0.5rem,env(safe-area-inset-top))] right-20 z-40 w-8 h-8 rounded-full bg-black flex items-center justify-center active:scale-90 transition shadow-md"
        aria-label="נגישות"
      >
        <Accessibility className="w-4 h-4 text-white" />
      </button>

      {open && (
        <>
          <div className="absolute inset-0 z-[64]" onClick={() => setOpen(false)} />
          <div
            className="absolute top-[max(2.5rem,calc(env(safe-area-inset-top)+2rem))] right-3 z-[66] w-72 max-w-[85%] rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-black/5 p-2.5 animate-in fade-in slide-in-from-top-2"
            dir="rtl"
          >
            <div className="flex items-center justify-between px-2 py-2 mb-1">
              <span className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Accessibility className="w-4 h-4 text-emerald-600" />
                </span>
                נגישות
              </span>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition">
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto no-scrollbar">
              {options.map((o) => (
                <Toggle key={o.key} icon={o.icon} label={o.label} on={settings[o.key]} onChange={() => toggle(o.key)} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}