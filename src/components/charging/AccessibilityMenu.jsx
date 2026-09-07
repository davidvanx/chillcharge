import React from "react";
import { useSettings } from "@/components/charging/SettingsProvider";
import { Accessibility, X, Type, Contrast, Volume2, Gauge, Focus, Moon, Subtitles } from "lucide-react";

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

export default function AccessibilityMenu({ open, onClose }) {
  const { settings, update, t, dir } = useSettings();

  const options = [
    { key: "largeText", icon: Type, label: t("a11y.largeText") },
    { key: "contrast", icon: Contrast, label: t("a11y.contrast") },
    { key: "voice", icon: Volume2, label: t("a11y.voice") },
    { key: "motion", icon: Gauge, label: t("a11y.motion") },
    { key: "focus", icon: Focus, label: t("a11y.focus") },
    { key: "dark", icon: Moon, label: t("a11y.dark") },
    { key: "subtitles", icon: Subtitles, label: t("a11y.subtitles") },
  ];

  const toggle = (key) => {
    const next = !settings[key];
    update({ [key]: next });
    if (key === "voice") speak(next ? t("a11y.voiceOn") : t("a11y.voiceOff"));
  };

  if (!open) return null;

  return (
    <>
      <div className="absolute inset-0 z-[64]" onClick={onClose} />
      <div
        className="absolute bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] right-3 z-[66] w-72 max-w-[85%] rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-black/5 p-2.5 animate-in fade-in slide-in-from-bottom-2"
        dir={dir}
      >
        <div className="flex items-center justify-between px-2 py-2 mb-1">
          <span className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Accessibility className="w-4 h-4 text-emerald-600" />
            </span>
            {t("a11y.title")}
          </span>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition">
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
  );
}