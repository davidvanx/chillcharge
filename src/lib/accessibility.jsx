import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const A11yContext = createContext(null);

export const useA11y = () => useContext(A11yContext);

export const ACCENT_PRESETS = [
  { id: "cyan", label: "כחול-ירוק", primary: "190 100% 50%", accent: "150 100% 50%" },
  { id: "violet", label: "סגול", primary: "268 100% 65%", accent: "320 100% 60%" },
  { id: "amber", label: "ענבר", primary: "43 100% 60%", accent: "25 100% 55%" },
  { id: "rose", label: "ורוד", primary: "330 100% 60%", accent: "350 100% 65%" },
  { id: "blue", label: "כחול", primary: "220 100% 60%", accent: "200 100% 55%" },
];

const cbFilters = {
  none: "none",
  deuteranopia: "url(#cb-deuteranopia)",
  protanopia: "url(#cb-protanopia)",
  tritanopia: "url(#cb-tritanopia)",
};

export function AccessibilityProvider({ children }) {
  const [textScale, setTextScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [colorBlind, setColorBlind] = useState("none");
  const [accent, setAccent] = useState(() => localStorage.getItem("cc-accent") || "cyan");

  useEffect(() => {
    const preset = ACCENT_PRESETS.find((p) => p.id === accent) || ACCENT_PRESETS[0];
    const root = document.documentElement;
    root.style.setProperty("--primary", preset.primary);
    root.style.setProperty("--accent", preset.accent);
    root.style.setProperty("--ring", preset.primary);
    root.style.setProperty("--sidebar-primary", preset.primary);
    root.style.setProperty("--sidebar-ring", preset.primary);
    root.style.setProperty("--chart-1", preset.primary);
    root.style.setProperty("--chart-2", preset.accent);
    localStorage.setItem("cc-accent", accent);
  }, [accent]);

  const value = useMemo(
    () => ({
      textScale,
      setTextScale,
      highContrast,
      setHighContrast,
      colorBlind,
      setColorBlind,
      accent,
      setAccent,
      reset: () => {
        setTextScale(1);
        setHighContrast(false);
        setColorBlind("none");
        setAccent("cyan");
      },
    }),
    [textScale, highContrast, colorBlind, accent]
  );

  return (
    <A11yContext.Provider value={value}>
      <div
        style={{ fontSize: `${textScale * 100}%`, filter: cbFilters[colorBlind] }}
        className={highContrast ? "a11y-high-contrast" : ""}
      >
        {/* SVG filters for color-blindness simulation/adjustment */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <defs>
            <filter id="cb-deuteranopia">
              <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
            </filter>
            <filter id="cb-protanopia">
              <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
            </filter>
            <filter id="cb-tritanopia">
              <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
            </filter>
          </defs>
        </svg>
        {children}
      </div>
    </A11yContext.Provider>
  );
}