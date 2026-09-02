import React, { useState } from "react";
import { Accessibility, X, Type, Contrast, Eye, RotateCcw } from "lucide-react";
import { useA11y } from "@/lib/accessibility.jsx";
import { cn } from "@/lib/utils";

export default function AccessibilityFab() {
  const [open, setOpen] = useState(false);
  const a11y = useA11y();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Accessibility options"
        className="fixed sm:absolute bottom-24 sm:bottom-24 right-4 sm:right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-neutral-950 shadow-[0_0_20px_rgba(34,211,238,0.6)] flex items-center justify-center active:scale-90 transition"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed sm:absolute inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-sm glass rounded-t-3xl sm:rounded-3xl p-5 m-0 sm:m-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <Accessibility className="w-5 h-5" /> Accessibility
              </h3>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Text size */}
            <div className="mb-5">
              <div className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Text size
              </div>
              <div className="flex gap-2">
                {[
                  { v: 1, label: "A" },
                  { v: 1.25, label: "A+" },
                  { v: 1.5, label: "A++" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => a11y.setTextScale(o.v)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-sm font-semibold transition",
                      a11y.textScale === o.v
                        ? "bg-cyan-400 text-neutral-950 neon-blue"
                        : "bg-white/10 text-white/70"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High contrast */}
            <button
              onClick={() => a11y.setHighContrast(!a11y.highContrast)}
              className={cn(
                "w-full flex items-center justify-between p-3.5 rounded-xl mb-3 transition",
                a11y.highContrast ? "bg-emerald-400/20 border border-emerald-400" : "bg-white/5 border border-white/10"
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <Contrast className="w-4 h-4 text-emerald-300" /> High contrast
              </span>
              <span className={cn("w-10 h-6 rounded-full p-0.5 transition", a11y.highContrast ? "bg-emerald-400" : "bg-white/20")}>
                <span className={cn("block w-5 h-5 rounded-full bg-white transition-transform", a11y.highContrast && "translate-x-4")} />
              </span>
            </button>

            {/* Color blindness */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Color-blindness
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: "none", label: "Off" },
                  { v: "deuteranopia", label: "Deuteranopia" },
                  { v: "protanopia", label: "Protanopia" },
                  { v: "tritanopia", label: "Tritanopia" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => a11y.setColorBlind(o.v)}
                    className={cn(
                      "py-2.5 rounded-xl text-xs font-semibold transition",
                      a11y.colorBlind === o.v
                        ? "bg-cyan-400 text-neutral-950 neon-blue"
                        : "bg-white/10 text-white/70"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={a11y.reset}
              className="w-full py-2.5 rounded-xl bg-white/5 text-white/60 text-sm font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
}