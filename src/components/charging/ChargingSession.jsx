import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, BatteryCharging, Check, Star, X } from "lucide-react";
import { useSettings } from "@/components/charging/SettingsProvider";

const CAPACITY_KWH = 60;
const R = 78;
const C = 2 * Math.PI * R;

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function ChargingSession({ station, onEnd }) {
  const { settings } = useSettings();
  const currency = settings.currency || station.currency || "₪";
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [notified80, setNotified80] = useState(false);
  const [phase, setPhase] = useState("charging");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (phase !== "charging") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 2, 100);
        if (next >= 80 && !notifiedRef.current) {
          notifiedRef.current = true;
          setNotified80(true);
        }
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setPhase("done"), 700);
        }
        return next;
      });
      setElapsed((e) => e + 0.25);
    }, 250);
    return () => clearInterval(id);
  }, [phase]);

  if (!station) return null;

  const kwh = (progress / 100) * CAPACITY_KWH;
  const cost = kwh * station.price_per_kwh;
  const offset = C * (1 - progress / 100);

  const stop = () => setPhase("done");

  if (phase === "done") {
    return (
      <motion.div
        className="absolute inset-0 z-50 bg-gradient-to-b from-emerald-500 to-teal-600 flex flex-col items-center justify-center px-6 text-white text-center"
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 12 }}>
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h2 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-[28px] font-bold">
          תודה שהטענת איתנו!
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[14px] text-white/80 mt-2">
          הטעינה הושלמה בהצלחה
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-7 w-full max-w-[280px] rounded-3xl bg-white/15 backdrop-blur p-5 grid grid-cols-3 gap-2 text-center"
        >
          <div>
            <div className="text-[11px] text-white/70">טעינה</div>
            <div className="text-[16px] font-bold mt-0.5">{kwh.toFixed(1)}</div>
            <div className="text-[10px] text-white/70">kWh</div>
          </div>
          <div>
            <div className="text-[11px] text-white/70">עלות</div>
            <div className="text-[16px] font-bold mt-0.5">{cost.toFixed(2)}</div>
            <div className="text-[10px] text-white/70">{currency}</div>
          </div>
          <div>
            <div className="text-[11px] text-white/70">משך</div>
            <div className="text-[16px] font-bold mt-0.5">{fmtTime(elapsed)}</div>
            <div className="text-[10px] text-white/70">דקות</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8">
          <p className="text-[14px] font-semibold mb-3">איך הייתה החוויה?</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="active:scale-90 transition"
              >
                <Star className={`w-9 h-9 transition ${(hover || rating) >= n ? "fill-amber-300 text-amber-300" : "text-white/40"}`} />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onEnd}
          className="mt-8 w-full max-w-[280px] py-3.5 rounded-2xl bg-white text-emerald-600 font-bold text-[15px] active:scale-95 transition shadow-lg"
        >
          {rating > 0 ? "סיום" : "דלג"}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-gradient-to-b from-neutral-900 to-neutral-800 flex flex-col text-white" dir="rtl">
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <div className="text-[12px] text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> טוען כעת
          </div>
          <h2 className="text-[18px] font-bold mt-0.5">{station.name}</h2>
        </div>
        <button onClick={stop} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
          <X className="w-4 h-4 text-white/80" />
        </button>
      </div>

      <AnimatePresence>
        {notified80 && progress < 100 && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="mx-5 mt-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 flex items-center gap-2.5"
          >
            <BatteryCharging className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-right">
              <div className="text-[13px] font-bold">הרכב הגיע ל-80%</div>
              <div className="text-[11px] text-white/70">מומלץ לסיים את הטעינה בקרוב</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-56 h-56">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
            <circle
              cx="90"
              cy="90"
              r={R}
              fill="none"
              stroke="url(#cgrad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
            />
            <defs>
              <linearGradient id="cgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[44px] font-bold leading-none">
              {Math.round(progress)}
              <span className="text-[20px]">%</span>
            </div>
            <div className="text-[12px] text-white/60 mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3" /> {station.power_kw} kW
            </div>
          </div>
        </div>

        <div className="mt-8 w-full max-w-[300px] grid grid-cols-3 gap-3 px-5">
          <div className="rounded-2xl bg-white/5 p-3 text-center">
            <div className="text-[10px] text-white/50">נטען</div>
            <div className="text-[16px] font-bold mt-0.5">{kwh.toFixed(1)}</div>
            <div className="text-[10px] text-white/50">kWh</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3 text-center">
            <div className="text-[10px] text-white/50">עלות</div>
            <div className="text-[16px] font-bold mt-0.5">{cost.toFixed(2)}</div>
            <div className="text-[10px] text-white/50">{currency}</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3 text-center">
            <div className="text-[10px] text-white/50">זמן</div>
            <div className="text-[16px] font-bold mt-0.5">{fmtTime(elapsed)}</div>
            <div className="text-[10px] text-white/50">דקות</div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-6">
        <button onClick={stop} className="w-full py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-[15px] active:scale-95 transition">
          עצור טעינה
        </button>
      </div>
    </div>
  );
}