import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useSettings } from "@/components/charging/SettingsProvider";
import { getReceipts, clearReceipts } from "@/lib/receipts";
import {
  X, Settings, User, Shield, Mail, ChevronLeft, Bell, Ruler, Coins,
  MapPin, Check, Trash2, Loader2, Car, Hash, Receipt, FileText, Languages, Phone,
} from "lucide-react";
import { chargingCompanies } from "@/lib/chargingCompanies";

function Toggle({ icon: Icon, label, on, onChange }) {
  const { dir } = useSettings();
  return (
    <button onClick={onChange} className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition" style={{ textAlign: dir === "ltr" ? "left" : "right" }} dir={dir}>
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
          <Icon className="w-4 h-4 text-neutral-600" />
        </span>
        <span className="text-[14px] font-semibold text-neutral-800">{label}</span>
      </div>
      <div className={`w-11 h-6 rounded-full relative transition shrink-0 ${on ? "bg-emerald-500" : "bg-neutral-300"}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-0.5" : "right-0.5"}`} />
      </div>
    </button>
  );
}

function Segmented({ value, onChange, options }) {
  const { dir } = useSettings();
  return (
    <div className="flex p-1 rounded-2xl bg-neutral-100" dir={dir}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition ${value === o.value ? "bg-white text-emerald-600 shadow-sm" : "text-neutral-500"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = "text" }) {
  const { dir } = useSettings();
  return (
    <div dir={dir}>
      <label className="text-[12px] font-medium text-neutral-500">{label}</label>
      <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-neutral-200 bg-white focus-within:border-emerald-400">
        {Icon && <Icon className="w-4 h-4 text-neutral-400 shrink-0" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[14px] text-neutral-800 placeholder:text-neutral-300"
        />
      </div>
    </div>
  );
}

function SettingsScreen() {
  const { settings, update, t, dir } = useSettings();
  return (
    <div className="space-y-3" dir={dir}>
      <Toggle icon={Bell} label={t("settings.notifications")} on={settings.notifications} onChange={() => update({ notifications: !settings.notifications })} />
      <div className="p-3.5 rounded-2xl bg-neutral-50">
        <div className="text-[13px] font-semibold text-neutral-800 mb-2">{t("settings.distanceUnits")}</div>
        <Segmented value={settings.units} onChange={(v) => update({ units: v })} options={[{ value: "km", label: t("settings.km") }, { value: "mi", label: t("settings.mi") }]} />
      </div>
      <div className="p-3.5 rounded-2xl bg-neutral-50">
        <div className="text-[13px] font-semibold text-neutral-800 mb-2">{t("settings.currency")}</div>
        <Segmented value={settings.currency} onChange={(v) => update({ currency: v })} options={[{ value: "₪", label: t("settings.ils") }, { value: "€", label: t("settings.eur") }, { value: "$", label: t("settings.usd") }]} />
      </div>
      <div className="p-3.5 rounded-2xl bg-neutral-50">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="w-4 h-4 text-neutral-500" />
          <div className="text-[13px] font-semibold text-neutral-800">{t("settings.language")}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "he", label: "עברית" },
            { value: "en", label: "English" },
            { value: "ar", label: "العربية" },
          ].map((o) => (
            <button
              key={o.value}
              onClick={() => update({ language: o.value })}
              className={`py-2.5 rounded-xl text-[13px] font-semibold border transition flex items-center justify-center gap-1.5 ${settings.language === o.value ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-neutral-600 border-neutral-200"}`}
            >
              {settings.language === o.value && <Check className="w-3.5 h-3.5" />}
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <Field icon={MapPin} label={t("settings.defaultCity")} value={settings.defaultCity} onChange={(v) => update({ defaultCity: v })} placeholder={t("settings.defaultCityPlaceholder")} />
    </div>
  );
}

function PersonalScreen() {
  const { profile, updateProfile, t, dir } = useSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (profile.name) await base44.auth.updateMe({ full_name: profile.name });
    } catch {}
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="space-y-3" dir={dir}>
      <Field icon={User} label={t("personal.fullName")} value={profile.name} onChange={(v) => updateProfile({ name: v })} placeholder={t("personal.fullNamePlaceholder")} />
      <Field icon={Mail} label={t("personal.email")} type="email" value={profile.email} onChange={(v) => updateProfile({ email: v })} placeholder="you@example.com" />
      <Field icon={Car} label={t("personal.carModel")} value={profile.car} onChange={(v) => updateProfile({ car: v })} placeholder={t("personal.carPlaceholder")} />
      <Field icon={Hash} label={t("personal.plate")} value={profile.plate} onChange={(v) => updateProfile({ plate: v })} placeholder={t("personal.platePlaceholder")} />
      <button
        onClick={save}
        disabled={saving}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-emerald-500/30 disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saving ? t("personal.saving") : saved ? t("personal.saved") : t("personal.save")}
      </button>
    </div>
  );
}

function PrivacyScreen() {
  const { settings, update, t, dir } = useSettings();
  const [cleared, setCleared] = useState(false);
  const clearHistory = () => {
    try { localStorage.removeItem("chillcharge_history"); } catch {}
    setCleared(true);
    setTimeout(() => setCleared(false), 1600);
  };
  return (
    <div className="space-y-3" dir={dir}>
      <Toggle icon={MapPin} label={t("privacy.shareLocation")} on={settings.shareLocation} onChange={() => update({ shareLocation: !settings.shareLocation })} />
      <Toggle icon={Settings} label={t("privacy.saveHistory")} on={settings.saveHistory} onChange={() => update({ saveHistory: !settings.saveHistory })} />
      <Toggle icon={Shield} label={t("privacy.shareData")} on={settings.shareData} onChange={() => update({ shareData: !settings.shareData })} />
      <button onClick={clearHistory} className="w-full h-12 rounded-2xl bg-red-50 text-red-600 font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition">
        <Trash2 className="w-4 h-4" />
        {cleared ? t("privacy.historyDeleted") : t("privacy.deleteHistory")}
      </button>
    </div>
  );
}

function ContactScreen() {
  const { t, dir } = useSettings();
  return (
    <div className="space-y-2.5" dir={dir}>
      <div className="rounded-2xl bg-emerald-50 p-3.5 mb-1">
        <p className="text-[13px] font-semibold text-emerald-700">{t("contact.header")}</p>
        <p className="text-[12px] text-emerald-600 mt-0.5">{t("contact.desc")}</p>
      </div>
      {chargingCompanies.map((c, i) => (
        <a
          key={i}
          href={`tel:${c.phone.replace(/[*-]/g, "")}`}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <Phone className="w-4 h-4 text-emerald-600" />
            </span>
            <div>
              <div className="text-[14px] font-bold text-neutral-900">{c.name}</div>
              <div className="text-[11px] text-neutral-400">{c.en}</div>
            </div>
          </div>
          <span className="text-[15px] font-bold text-emerald-600 tracking-wide" dir="ltr">{c.phone}</span>
        </a>
      ))}
    </div>
  );
}

function fmtDur(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ReceiptsScreen() {
  const { t, dir } = useSettings();
  const [receipts, setReceipts] = useState(() => getReceipts());
  const [cleared, setCleared] = useState(false);

  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      const locale = dir === "ltr" ? "en-US" : "he-IL";
      return d.toLocaleDateString(locale) + " " + d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  if (receipts.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-400" dir={dir}>
        <Receipt className="w-8 h-8 mx-auto mb-3 opacity-40" />
        <p className="text-[14px] font-medium">{t("receipts.empty")}</p>
        <p className="text-[12px] text-neutral-300 mt-1">{t("receipts.emptyDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" dir={dir}>
      {receipts.map((r) => (
        <div key={r.id} className="rounded-2xl bg-neutral-50 p-4">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-bold text-neutral-900 truncate">{r.station}</div>
            <div className="text-[14px] font-bold text-emerald-600 shrink-0">{r.currency}{r.cost.toFixed(2)}</div>
          </div>
          {r.network && <div className="text-[11px] text-neutral-400 mt-0.5">{r.network}</div>}
          <div className="flex items-center justify-between mt-2 text-[12px] text-neutral-500">
            <span>{fmtDate(r.date)}</span>
            <span>{r.kwh.toFixed(1)} kWh · {fmtDur(r.durationSec)}</span>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          clearReceipts();
          setReceipts([]);
          setCleared(true);
          setTimeout(() => setCleared(false), 1500);
        }}
        className="w-full h-12 rounded-2xl bg-red-50 text-red-600 font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition"
      >
        <Trash2 className="w-4 h-4" />
        {cleared ? t("receipts.deleted") : t("receipts.deleteAll")}
      </button>
    </div>
  );
}

function PolicyScreen() {
  const { t, dir } = useSettings();
  const sections = [
    { t: t("policy.s1t"), b: t("policy.s1b") },
    { t: t("policy.s2t"), b: t("policy.s2b") },
    { t: t("policy.s3t"), b: t("policy.s3b") },
    { t: t("policy.s4t"), b: t("policy.s4b") },
    { t: t("policy.s5t"), b: t("policy.s5b") },
    { t: t("policy.s6t"), b: t("policy.s6b") },
    { t: t("policy.s7t"), b: t("policy.s7b") },
    { t: t("policy.s8t"), b: t("policy.s8b") },
    { t: t("policy.s9t"), b: t("policy.s9b") },
    { t: t("policy.s10t"), b: t("policy.s10b") },
  ];
  return (
    <div className="space-y-4 text-[13px] leading-relaxed text-neutral-600" dir={dir}>
      <div className="rounded-2xl bg-emerald-50 p-4">
        <h3 className="text-[15px] font-bold text-emerald-700">{t("policy.title")}</h3>
        <p className="text-[12px] text-emerald-600 mt-1">{t("policy.updated")}</p>
      </div>
      {sections.map((s) => (
        <div key={s.t}>
          <h4 className="text-[13px] font-bold text-neutral-900">{s.t}</h4>
          <p className="mt-1">{s.b}</p>
        </div>
      ))}
    </div>
  );
}

const screens = {
  settings: SettingsScreen,
  personal: PersonalScreen,
  receipts: ReceiptsScreen,
  privacy: PrivacyScreen,
  policy: PolicyScreen,
  contact: ContactScreen,
};

export default function SettingsMenu({ open, onClose }) {
  const { t, dir } = useSettings();
  const [active, setActive] = useState(null);
  if (!open) return null;

  const items = [
    { id: "settings", label: t("settings.settings"), icon: Settings, desc: t("settings.settingsDesc") },
    { id: "personal", label: t("settings.personal"), icon: User, desc: t("settings.personalDesc") },
    { id: "receipts", label: t("settings.receipts"), icon: Receipt, desc: t("settings.receiptsDesc") },
    { id: "privacy", label: t("settings.privacy"), icon: Shield, desc: t("settings.privacyDesc") },
    { id: "policy", label: t("settings.policy"), icon: FileText, desc: t("settings.policyDesc") },
    { id: "contact", label: t("settings.contact"), icon: Phone, desc: t("settings.contactDesc") },
  ];

  const currentItem = items.find((i) => i.id === active);
  const Screen = active ? screens[active] : null;

  return (
    <div className="absolute inset-0 z-50" dir={dir}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className={`absolute top-0 ${dir === "ltr" ? "left-0" : "right-0"} h-full w-[86%] max-w-[330px] bg-white shadow-2xl flex flex-col animate-in ${dir === "ltr" ? "slide-in-from-left" : "slide-in-from-right"} pt-[max(3.5rem,env(safe-area-inset-top))] pb-safe`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <button
            onClick={active ? () => setActive(null) : onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
          <h2 className="text-[16px] font-bold text-neutral-900">{currentItem ? currentItem.label : t("settings.menuTitle")}</h2>
          <div className="w-9" />
        </div>

        {!currentItem ? (
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 no-scrollbar">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(it.id)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition"
                  style={{ textAlign: dir === "ltr" ? "left" : "right" }}
                >
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-neutral-900">{it.label}</div>
                    <div className="text-[12px] text-neutral-400 truncate">{it.desc}</div>
                  </div>
                  <ChevronLeft className={`w-4 h-4 text-neutral-300 ${dir === "ltr" ? "rotate-180" : ""}`} />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
            <Screen />
          </div>
        )}
      </div>
    </div>
  );
}