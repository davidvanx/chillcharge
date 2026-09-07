import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function SplashScreen({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      setTimeout(onFinish, 550);
    }, 2200);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 z-[100] bg-gradient-to-b from-emerald-500 via-teal-500 to-emerald-600 flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.45 }}
        >
          {/* Expanding rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-white/20"
              style={{ width: 180 + i * 90, height: 180 + i * 90 }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.3], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.35, ease: "easeOut" }}
            />
          ))}

          {/* Floating spark particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/70"
              style={{ left: `${30 + i * 8}%`, top: "60%" }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [-10, -120], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25, ease: "easeOut" }}
            />
          ))}

          {/* Central charging orb */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl ring-4 ring-white/30">
              <motion.div
                animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="w-14 h-14 text-white fill-white drop-shadow-lg" />
              </motion.div>
            </div>
          </motion.div>

          {/* Brand */}
          <motion.h1
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative z-10 mt-8 text-[34px] font-bold text-white tracking-tight"
          >
            Chillcharge
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 mt-1 text-[13px] text-white/70 font-medium"
          >
            טעינה בקרבת מקום
          </motion.p>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="relative z-10 mt-10 w-40 h-1.5 rounded-full bg-white/20 overflow-hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ delay: 1, duration: 1.1, ease: "easeInOut" }}
              className="h-full rounded-full bg-white"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}