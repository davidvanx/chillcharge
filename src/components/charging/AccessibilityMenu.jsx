import React, { useState } from "react";
import { Accessibility, X, Type, Contrast, Volume2, Gauge, Focus, Moon, Subtitles, Languages } from "lucide-react";

function Toggle({ icon: Icon, label, on, set }) {
  return (
    <button onClick={() => set(!on)} className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 text-right">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-neutral-500" />
        <span className="text-[13px] font-medium text-neutral-700">{label}</span>
      </div>
      <div className={`w-10 h-6 rounded-full relative transition ${on ? "bg-emerald-500" : "bg-neutral-200"}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-0.5" : "right-0.5"}`} />
      </div>
    </button>
  );
}

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState({
    largeText: false,
    contrast: false,
    voice: false,
    motion: false,
    focus: false,
    dark: false,
    subtitles: false,
    lang: false,
  });
  const set = (k) => (v) => setOpts((s) => ({ ...s, [k]: v }));

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
            <Toggle icon={Type} label="טקסט מוגדל" on={opts.largeText} set={set("largeText")} />
            <Toggle icon={Contrast} label="ניגודיות גבוהה" on={opts.contrast} set={set("contrast")} />
            <Toggle icon={Volume2} label="הקראה בקול" on={opts.voice} set={set("voice")} />
            <Toggle icon={Gauge} label="האטת אנימציות" on={opts.motion} set={set("motion")} />
            <Toggle icon={Focus} label="מסגרת ממוקדת" on={opts.focus} set={set("focus")} />
            <Toggle icon={Moon} label="מצב כהה" on={opts.dark} set={set("dark")} />
            <Toggle icon={Subtitles} label="כתוביות ותיאורים" on={opts.subtitles} set={set("subtitles")} />
            <Toggle icon={Languages} label="תרגום שפה" on={opts.lang} set={set("lang")} />
          </div>
        </div>
      )}
    </>
  );
}