import React, { useState, useRef, useEffect } from "react";
import { useSettings } from "@/components/charging/SettingsProvider";
import { Accessibility, X, Type, Contrast, Volume2, Gauge, Focus, Moon, Subtitles, Languages } from "lucide-react";

const LS_POS = "chillcharge_a11y_pos_v2";
const BTN = 52;

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
  const btnRef = useRef(null);
  const [pos, setPos] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(LS_POS));
      if (v && typeof v.rx === "number" && typeof v.ry === "number") return v;
    } catch {}
    return { rx: 16, ry: 110 };
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

  // Re-clamp into view on mount and resize (fixes stale localStorage positions)
  useEffect(() => {
    const fix = () => setPos((p) => clamp(p.rx, p.ry));
    const t = setTimeout(fix, 100);
    window.addEventListener("resize", fix);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", fix);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDown = (e) => {
    e.preventDefault();
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
        className="absolute z-[65] w-[52px] h-[52px] rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_6px_20px_rgba(16,185,129,0.45)] ring-4 ring-white/60 flex items-center justify-center active:scale-90 transition select-none cursor-grab"
        aria-label="נגישות — גרר להזזה, לחץ לפתיחה"
      >
        <Accessibility className="w-6 h-6 pointer-events-none" />
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {open && (
        <>
          <div className="absolute inset-0 z-[64]" onClick={() => setOpen(false)} />
          <div
            style={{ right: pos.rx, bottom: pos.ry + BTN + 10 }}
            className="absolute z-[66] w-72 max-w-[85%] rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-black/5 p-2.5 animate-in fade-in slide-in-from-bottom-2"
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