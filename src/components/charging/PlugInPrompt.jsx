import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cable, Check, X } from "lucide-react";
import { useSettings } from "@/components/charging/SettingsProvider";

export default function PlugInPrompt({ station, onClose, onConfirmed }) {
  const { t, dir } = useSettings();
  const [phase, setPhase] = useState("prompt");

  useEffect(() => {
    if (station) setPhase("prompt");
  }, [station]);

  if (!station) return null;

  const confirm = () => {
    setPhase("confirmed");
    setTimeout(() => {
      onConfirmed?.(station);
    }, 1800);
  };

  return (
    <motion.div
      className="absolute inset-0 z-[65] bg-gradient-to-b from-neutral-900 to-neutral-800 flex flex-col items-center justify-center px-6 text-white text-center"
      dir={dir}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
        <X className="w-4 h-4 text-white/80" />
      </button>

      <AnimatePresence mode="wait">
        {phase === "prompt" ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-3xl bg-emerald-500/20 flex items-center justify-center mb-6"
            >
              <Cable className="w-12 h-12 text-emerald-400" />
            </motion.div>
            <h2 className="text-[22px] font-bold mb-2">{t("plug.title")}</h2>
            <p className="text-[14px] text-white/60 max-w-[260px] mb-8 leading-relaxed">{t("plug.desc")}</p>
            <button
              onClick={confirm}
              className="w-full max-w-[280px] py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-emerald-500/30"
            >
              <Check className="w-4 h-4" />
              {t("plug.confirm")}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="confirmed"
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
            <motion.h2
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[22px] font-bold"
            >
              {t("plug.detected")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[14px] text-white/60 mt-2"
            >
              {t("plug.starting")}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}