import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, getDir } from "@/lib/translations";

const SettingsContext = createContext(null);
export const useSettings = () => useContext(SettingsContext);

export function useTranslation() {
  const { settings, t, dir, lang } = useSettings();
  return { t, dir, lang };
}

const LS_SETTINGS = "chillcharge_settings";
const LS_PROFILE = "chillcharge_profile";

const defaultSettings = {
  notifications: true,
  units: "km",
  currency: "₪",
  defaultCity: "",
  language: "he",
  // privacy
  shareLocation: true,
  saveHistory: true,
  shareData: false,
  // accessibility
  largeText: false,
  contrast: false,
  voice: false,
  motion: false,
  focus: false,
  dark: false,
  subtitles: false,
  translate: false,
};

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({ ...defaultSettings, ...load(LS_SETTINGS, {}) }));
  const [profile, setProfile] = useState(() => load(LS_PROFILE, { name: "", email: "", car: "", plate: "" }));

  useEffect(() => {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
  }, [profile]);

  const update = (patch) => setSettings((s) => ({ ...s, ...patch }));
  const updateProfile = (patch) => setProfile((p) => ({ ...p, ...patch }));

  const lang = settings.language || "he";
  const dir = getDir(lang);
  const t = (key, params) => {
    const dict = translations[lang] || translations.he;
    let str = dict[key] || translations.he[key] || key;
    if (params) {
      Object.keys(params).forEach((p) => {
        str = str.replace(`{${p}}`, params[p]);
      });
    }
    return str;
  };

  return (
    <SettingsContext.Provider value={{ settings, update, profile, updateProfile, t, dir, lang }}>
      {children}
    </SettingsContext.Provider>
  );
}