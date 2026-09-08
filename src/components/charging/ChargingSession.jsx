import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, BatteryCharging, Check, Star, X, Phone, Bell, Cable, AlertTriangle } from "lucide-react";
import { useSettings } from "@/components/charging/SettingsProvider";
import { addReceipt } from "@/lib/receipts";

const CAPACITY_KWH = 60;
const R = 78;
const C = 2 * Math.PI * R;

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function ChargingSession({ station, onEnd }) {
  const { settings, t, dir } = useSettings();
  const currency = settings.currency || station?.currency || "₪";
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [notified80, setNotified80] = useState(false);
  const [show80Popup, setShow80Popup] = useState(false);
  const [phase, setPhase] = useState("charging");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const notifiedRef = useRef(false);
  const [disconnectTimer, setDisconnectTimer] = useState(900);
  const [idleFee, setIdleFee] = useState(false);
  const [disconnected, setDisconnected] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (station) {
      setProgress(0);
      setElapsed(0);
      setPhase("charging");
      setNotified80(false);
      setShow80Popup(false);
      setRating(0);
      setHover(0);
      notifiedRef.current = false;
      setDisconnectTimer(900);
      setIdleFee(false);
      setDisconnected(false);
    }
  }, [station]);

  useEffect(() => {
    if (phase !== "charging" || !station) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 2, 100);
        if (next >= 80 && !notifiedRef.current) {
          notifiedRef.current = true;
          setNotified80(true);
          setShow80Popup(true);
          try {
            if ("vibrate" in navigator) navigator.vibrate([120, 60, 120]);
          } catch {}
          try {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(t("session.reached80Popup"), {
                body: t("session.reached80Body"),
                tag: "chillcharge-80",
              });
            }
          } catch {}
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
  }, [phase, station, t]);

  useEffect(() => {
    if (phase === "done" && station) {
      const kwhVal = (progress / 100) * CAPACITY_KWH;
      addReceipt({
        id: Date.now(),
        station: station.name,
        network: station.network,
        kwh: kwhVal,
        cost: kwhVal * station.price_per_kwh,
        currency,
        durationSec: elapsed,
        date: new Date().toISOString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "disconnect" || disconnected) return;
    if (disconnectTimer <= 0) {
      if (!idleFee) setIdleFee(true);
      return;
    }
    const id = setTimeout(() => setDisconnectTimer((tm) => tm - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, disconnectTimer, disconnected, idleFee]);

  if (!station) return null;

  const kwh = (progress / 100) * CAPACITY_KWH;
  const cost = kwh * station.price_per_kwh;
  const offset = C * (1 - progress / 100);

  const stop = () => setPhase("done");

  if (phase === "done") {
    return (
      <motion.div
        className="absolute inset-0 z-[70] bg-gradient-to-b from-emerald-500 to-teal-600 flex flex-col items-center justify-center px-6 text-white text-center"
        dir={dir}
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
          {t("session.thanks")}
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[14px] text-white/80 mt-2">
          {t("session.complete")}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-7 w-full max-w-[280px] rounded-3xl bg-white/15 backdrop-blur p-5 grid grid-cols-3 gap-2 text-center"
        >
          <div>
            <div className="text-[11px] text-white/70">{t("session.charging")}</div>
            <div className="text-[16px] font-bold mt-0.5">{kwh.toFixed(1)}</div>
            <div className="text-[10px] text-white/70">kWh</div>
          </div>
          <div>
            <div className="text-[11px] text-white/70">{t("session.cost")}</div>
            <div className="text-[16px] font-bold mt-0.5">{cost.toFixed(2)}</div>
            <div className="text-[10px] text-white/70">{currency}</div>
          </div>
          <div>
            <div className="text-[11px] text-white/70">{t("session.duration")}</div>
            <div className="text-[16px] font-bold mt-0.5">{fmtTime(elapsed)}</div>
            <div className="text-[10px] text-white/70">{t("session.minutes")}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8">
          <p className="text-[14px] font-semibold mb-3">{t("session.howWasIt")}</p>
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
          onClick={() => { setDisconnectTimer(900); setIdleFee(false); setDisconnected(false); setPhase("disconnect"); }}
          className="mt-8 w-full max-w-[280px] py-3.5 rounded-2xl bg-white text-emerald-600 font-bold text-[15px] active:scale-95 transition shadow-lg"
        >
          {rating > 0 ? t("session.finish") : t("session.skip")}
        </motion.button>
      </motion.div>
    );
  }

  if (phase === "disconnect") {
    const mins = Math.floor(disconnectTimer / 60);
    const secs = disconnectTimer % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
    const isUrgent = disconnectTimer <= 300 && disconnectTimer > 0;

    return (
      <motion.div
        className="absolute inset-0 z-[70] bg-gradient-to-b from-neutral-900 to-neutral-800 flex flex-col items-center justify-center px-6 text-white text-center"
        dir={dir}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          {!disconnected ? (
            <motion.div
              key="disconnect-prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center w-full max-w-[300px]"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 ${idleFee ? "bg-red-500/20" : "bg-emerald-500/20"}`}
              >
                {idleFee ? (
                  <AlertTriangle className="w-12 h-12 text-red-400" />
                ) : (
                  <Cable className="w-12 h-12 text-emerald-400" />
                )}
              </motion.div>

              {idleFee ? (
                <>
                  <h2 className="text-[22px] font-bold mb-2 text-red-400">{t("disconnect.idleWarning")}</h2>
                  <p className="text-[14px] text-white/60 max-w-[260px] mb-8 leading-relaxed">{t("disconnect.idleDesc")}</p>
                </>
              ) : (
                <>
                  <h2 className="text-[22px] font-bold mb-2">{t("disconnect.title")}</h2>
                  <p className="text-[14px] text-white/60 max-w-[260px] mb-6 leading-relaxed">{t("disconnect.desc")}</p>
                  <div className={`text-[48px] font-bold mb-8 ${isUrgent ? "text-red-400" : "text-emerald-400"}`}>
                    {timeStr}
                  </div>
                </>
              )}

              <button
                onClick={() => {
                  setDisconnected(true);
                  setTimeout(() => onEnd(), 1500);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-emerald-500/30"
              >
                <Check className="w-4 h-4" />
                {t("disconnect.confirm")}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="disconnected"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
                className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/50"
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 12 }}>
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>
              <h2 className="text-[22px] font-bold">{t("disconnect.done")}</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="absolute inset-0 z-[70] bg-gradient-to-b from-neutral-900 to-neutral-800 flex flex-col text-white" dir={dir}>
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <div className="text-[12px] text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {t("session.chargingNow")}
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
              <div className="text-[13px] font-bold">{t("session.reached80")}</div>
              <div className="text-[11px] text-white/70">{t("session.reached80Desc")}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show80Popup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-6"
            dir={dir}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="w-full max-w-[300px] rounded-3xl bg-white p-6 text-center text-neutral-900 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-[18px] font-bold">{t("session.reached80Popup")}</h3>
              <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">
                {t("session.reached80Body")}
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setShow80Popup(false)}
                  className="flex-1 py-3 rounded-2xl bg-neutral-100 text-neutral-700 font-semibold text-[14px] active:scale-95 transition"
                >
                  {t("session.keepCharging")}
                </button>
                <button
                  onClick={() => {
                    setShow80Popup(false);
                    setPhase("done");
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[14px] active:scale-95 transition shadow-lg shadow-emerald-500/30"
                >
                  {t("session.finishCharging")}
                </button>
              </div>
            </motion.div>
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
            <div className="text-[10px] text-white/50">{t("session.charged")}</div>
            <div className="text-[16px] font-bold mt-0.5">{kwh.toFixed(1)}</div>
            <div className="text-[10px] text-white/50">kWh</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3 text-center">
            <div className="text-[10px] text-white/50">{t("session.cost")}</div>
            <div className="text-[16px] font-bold mt-0.5">{cost.toFixed(2)}</div>
            <div className="text-[10px] text-white/50">{currency}</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3 text-center">
            <div className="text-[10px] text-white/50">{t("session.time")}</div>
            <div className="text-[16px] font-bold mt-0.5">{fmtTime(elapsed)}</div>
            <div className="text-[10px] text-white/50">{t("session.minutes")}</div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-3">
        <a
          href="tel:*2422"
          className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 flex items-center gap-3 active:scale-95 transition"
        >
          <span className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-emerald-400" />
          </span>
          <div className="flex-1 text-right">
            <div className="text-[13px] font-semibold text-white">{t("session.support")}</div>
            <div className="text-[11px] text-white/60">{t("session.supportDesc")}</div>
          </div>
          <span className="text-[16px] font-bold text-emerald-400 tracking-wide" dir="ltr">*2422</span>
        </a>
        <button onClick={stop} className="w-full py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-[15px] active:scale-95 transition">
          {t("session.stopCharging")}
        </button>
      </div>
    </div>
  );
}