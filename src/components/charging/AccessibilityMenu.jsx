import React, { useState, useRef, useEffect } from "react";
import { useSettings } from "@/components/charging/SettingsProvider";
import { Accessibility, X, Type, Contrast, Volume2, Gauge, Focus, Moon, Subtitles, Languages } from "lucide-react";

const LS_POS = "chillcharge_a11y_pos";
const BTN = 48;

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
  const btnRef = useRef(null);
  const [pos, setPos] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(LS_POS));
      if (v && typeof v.rx === "number" && typeof v.ry === "number") return v;
    } catch {}
    return { rx: 16, ry: 96 };
  });
  const drag = useRef({ active: false, moved: false, sx: 0, sy: 0, srx: 0, sry: 0 });

  useEffect(() => {
    localStorage.setItem(LS_POS, JSON.stringify(pos));
  }, [pos]);

  const clamp = (rx, ry) => {
    const parent = btnRef.current?.offsetParent;
    const cw = parent?.clientWidth ?? 360;
    const ch = parent?.clientHeight ?? 700;
    return {
      rx: Math.max(8, Math.min(rx, cw - BTN - 8)),
      ry: Math.max(8, Math.min(ry, ch - BTN - 8)),
    };
  };

  const onDown = (e) => {
    drag.current = { active: true, moved: false, sx: e.clientX, sy: e.clientY, srx: pos.rx, sry: pos.ry };
    try { btnRef.current?.setPointerCapture?.(e.pointerId); } catch {}
  };
  const onMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.sx;
    const dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.current.moved = true;
    setPos(clamp(drag.current.srx - dx, drag.current.sry - dy));
  };
  const onUp = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    try { btnRef.current?.releasePointerCapture?.(e.pointerId); } catch {}
    if (!drag.current.moved) setOpen((v) => !v);
  };

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
        ref={btnRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        style={{ right: pos.rx, bottom: pos.ry, touchAction: "none" }}
        className="absolute z-[60] w-12 h-12 rounded-full bg-neutral-900 text-white shadow-lg shadow-black/20 flex items-center justify-center active:scale-90 transition select-none cursor-grab"
        aria-label="נגישות — גרר להזזה, לחץ לפתיחה"
      >
        <Accessibility className="w-6 h-6 pointer-events-none" />
      </button>

      {open && (
        <div
          style={{ right: pos.rx, bottom: pos.ry + BTN + 8 }}
          className="absolute z-[70] w-64 max-w-[80%] rounded-2xl bg-white shadow-2xl border border-black/5 p-2 animate-in fade-in slide-in-from-bottom-2"
          dir="rtl"
        >
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