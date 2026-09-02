import React, { createContext, useContext, useState, useMemo } from "react";

const A11yContext = createContext(null);

export const useA11y = () => useContext(A11yContext);

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

  const value = useMemo(
    () => ({
      textScale,
      setTextScale,
      highContrast,
      setHighContrast,
      colorBlind,
      setColorBlind,
      reset: () => {
        setTextScale(1);
        setHighContrast(false);
        setColorBlind("none");
      },
    }),
    [textScale, highContrast, colorBlind]
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