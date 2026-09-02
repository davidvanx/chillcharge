import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const LangContext = createContext(null);

const STORAGE_KEY = "chillcharge.lang";

const translations = {
  he: {
    "nav.map": "מפה",
    "nav.saved": "שמורים",
    "nav.menu": "תפריט",
    "saved.title": "עמדות שמורות",
    "saved.subtitle": "עמדות ששמרת",
    "saved.empty": "אין עמדות שמורות עדיין",
    "menu.profile": "פרטים אישיים",
    "menu.settings": "הגדרות",
    "menu.sessions": "טעינות",
    "menu.receipts": "קבלות",
    "menu.legal": "מידע משפטי",
    "map.live": "חי",
    "map.search": "חיפוש עמדות",
    "map.searchLive": "עיר בישראל, לדוגמה תל אביב",
    "map.find": "חפש",
    "map.myLocation": "המיקום שלי",
    "map.legend.available": "זמין",
    "map.legend.occupied": "תפוס",
    "map.legend.offline": "מנותק",
    "map.stationsNearby": "{n} עמדות בקרבת מקום",
    "map.noStations": "אין עמדות התואמות את הסינון",
    "filter.all": "הכל",
    "filter.dc": "מהיר DC",
    "filter.ac": "AC",
    "station.bestValue": "משתלם ביותר",
    "station.price": "מחיר",
    "station.available": "זמין",
    "detail.type": "סוג",
    "detail.power": "הספק",
    "detail.price": "מחיר",
    "detail.availability": "זמינות",
    "detail.free": "פנוי",
    "detail.amenities": "שירותים",
    "detail.save": "שמור",
    "detail.navigate": "ניווט",
    "detail.yourLocation": "המיקום שלך",
    "settings.title": "הגדרות",
    "settings.subtitle": "העדפות ונגישות",
    "settings.darkMode": "מצב כהה",
    "settings.darkModeOn": "פעיל (ברירת מחדל)",
    "settings.notifications": "התראות",
    "settings.off": "כבוי",
    "settings.accessibility": "נגישות",
    "settings.textSize": "גודל טקסט",
    "settings.highContrast": "ניגודיות גבוהה",
    "settings.language": "שפה",
    "settings.accentColor": "צבע נושא",
    "settings.accessibilityStatement": "הצהרת נגישות",
    "settings.privacy": "מדיניות פרטיות",
    "settings.terms": "תנאי שימוש",
    "settings.licenses": "רישיונות קוד פתוח",
    "profile.charges": "טעינות",
    "profile.rating": "דירוג",
    "profile.saved": "שמורים",
    "profile.savedStations": "עמדות שמורות",
    "profile.settings": "הגדרות",
    "profile.signOut": "התנתק",
    "profile.defaultName": "משתמש Chillcharge",
    "sessions.title": "טעינות",
    "sessions.subtitle": "היסטוריית טעינות",
    "sessions.empty": "אין טעינות קודמות עדיין",
    "receipts.title": "קבלות",
    "receipts.subtitle": "קבלות על טעינות",
    "receipts.empty": "אין קבלות עדיין",
  },
  en: {
    "nav.map": "Map",
    "nav.saved": "Saved",
    "nav.menu": "Menu",
    "saved.title": "Saved stations",
    "saved.subtitle": "Your bookmarked chargers",
    "saved.empty": "No saved stations yet",
    "menu.profile": "Personal details",
    "menu.settings": "Settings",
    "menu.sessions": "Charging sessions",
    "menu.receipts": "Receipts",
    "menu.legal": "Legal",
    "map.live": "Live",
    "map.search": "Search stations",
    "map.searchLive": "City in Israel, e.g. Tel Aviv",
    "map.find": "Find",
    "map.myLocation": "My location",
    "map.legend.available": "Available",
    "map.legend.occupied": "Occupied",
    "map.legend.offline": "Offline",
    "map.stationsNearby": "{n} stations nearby",
    "map.noStations": "No stations match your filters",
    "filter.all": "All",
    "filter.dc": "DC Fast",
    "filter.ac": "AC",
    "station.bestValue": "Best value",
    "station.price": "Price",
    "station.available": "Available",
    "detail.type": "Type",
    "detail.power": "Power",
    "detail.price": "Price",
    "detail.availability": "Availability",
    "detail.free": "free",
    "detail.amenities": "Amenities",
    "detail.save": "Save",
    "detail.navigate": "Navigate",
    "detail.yourLocation": "Your location",
    "settings.title": "Settings",
    "settings.subtitle": "Preferences & accessibility",
    "settings.darkMode": "Dark mode",
    "settings.darkModeOn": "On (default)",
    "settings.notifications": "Notifications",
    "settings.off": "Off",
    "settings.accessibility": "Accessibility",
    "settings.textSize": "Text size",
    "settings.highContrast": "High contrast",
    "settings.language": "Language",
    "settings.accentColor": "Accent color",
    "settings.accessibilityStatement": "Accessibility statement",
    "settings.privacy": "Privacy policy",
    "settings.terms": "Terms of service",
    "settings.licenses": "Open-source licenses",
    "profile.charges": "Charges",
    "profile.rating": "Rating",
    "profile.saved": "Saved",
    "profile.savedStations": "Saved stations",
    "profile.settings": "Settings",
    "profile.signOut": "Sign out",
    "profile.defaultName": "Chillcharge User",
    "sessions.title": "Charging sessions",
    "sessions.subtitle": "Charging history",
    "sessions.empty": "No charging sessions yet",
    "receipts.title": "Receipts",
    "receipts.subtitle": "Receipts for charging sessions",
    "receipts.empty": "No receipts yet",
  },
};

export const useLanguage = () => useContext(LangContext);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return "he";
    return localStorage.getItem(STORAGE_KEY) || "he";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    const dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = useCallback((l) => setLangState(l), []);
  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang] || translations.he;
      let str = dict[key] ?? translations.he[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}