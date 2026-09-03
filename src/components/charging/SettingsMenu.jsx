import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useSettings } from "@/components/charging/SettingsProvider";
import { getReceipts, clearReceipts } from "@/lib/receipts";
import {
  X, Settings, User, Shield, Mail, ChevronLeft, Bell, Ruler, Coins,
  MapPin, Check, Trash2, Send, Loader2, Car, Hash, Receipt, FileText, Languages,
} from "lucide-react";

const items = [
  { id: "settings", label: "הגדרות", icon: Settings, desc: "העדפות, יחידות, מטבע" },
  { id: "personal", label: "פרטים אישיים", icon: User, desc: "שם, אימייל, פרטי רכב" },
  { id: "receipts", label: "הקבלות שלי", icon: Receipt, desc: "היסטוריית טעינות ותשלומים" },
  { id: "privacy", label: "פרטיות", icon: Shield, desc: "מיקום, היסטוריה, שיתוף" },
  { id: "policy", label: "תצהיר פרטיות", icon: FileText, desc: "מדיניות הפרטיות המלאה" },
  { id: "contact", label: "יצירת קשר", icon: Mail, desc: "תמיכה, משוב, דיווח תקלה" },
];

function Toggle({ icon: Icon, label, on, onChange }) {
  return (
    <button onClick={onChange} className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition text-right">
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
  return (
    <div className="flex p-1 rounded-2xl bg-neutral-100">
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
  return (
    <div>
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
  const { settings, update } = useSettings();
  return (
    <div className="space-y-3">
      <Toggle icon={Bell} label="התראות על עמדות" on={settings.notifications} onChange={() => update({ notifications: !settings.notifications })} />
      <div className="p-3.5 rounded-2xl bg-neutral-50">
        <div className="text-[13px] font-semibold text-neutral-800 mb-2">יחידות מרחק</div>
        <Segmented value={settings.units} onChange={(v) => update({ units: v })} options={[{ value: "km", label: "ק״מ" }, { value: "mi", label: "מייל" }]} />
      </div>
      <div className="p-3.5 rounded-2xl bg-neutral-50">
        <div className="text-[13px] font-semibold text-neutral-800 mb-2">מטבע</div>
        <Segmented value={settings.currency} onChange={(v) => update({ currency: v })} options={[{ value: "₪", label: "₪ ש״ח" }, { value: "€", label: "€ יורו" }, { value: "$", label: "$ דולר" }]} />
      </div>
      <div className="p-3.5 rounded-2xl bg-neutral-50">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="w-4 h-4 text-neutral-500" />
          <div className="text-[13px] font-semibold text-neutral-800">שפה</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "he", label: "עברית" },
            { value: "en", label: "English" },
            { value: "ar", label: "العربية" },
            { value: "ru", label: "Русский" },
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
      <Field icon={MapPin} label="עיר ברירת מחדל לחיפוש" value={settings.defaultCity} onChange={(v) => update({ defaultCity: v })} placeholder="לדוגמה: תל אביב" />
    </div>
  );
}

function PersonalScreen() {
  const { profile, updateProfile } = useSettings();
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
    <div className="space-y-3">
      <Field icon={User} label="שם מלא" value={profile.name} onChange={(v) => updateProfile({ name: v })} placeholder="ישראל ישראלי" />
      <Field icon={Mail} label="אימייל" type="email" value={profile.email} onChange={(v) => updateProfile({ email: v })} placeholder="you@example.com" />
      <Field icon={Car} label="דגם רכב" value={profile.car} onChange={(v) => updateProfile({ car: v })} placeholder="לדוגמה: Tesla Model 3" />
      <Field icon={Hash} label="מספר לוחית" value={profile.plate} onChange={(v) => updateProfile({ plate: v })} placeholder="12-345-67" />
      <button
        onClick={save}
        disabled={saving}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-emerald-500/30 disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saving ? "שומר…" : saved ? "נשמר!" : "שמור פרטים"}
      </button>
    </div>
  );
}

function PrivacyScreen() {
  const { settings, update } = useSettings();
  const [cleared, setCleared] = useState(false);
  const clearHistory = () => {
    try { localStorage.removeItem("chillcharge_history"); } catch {}
    setCleared(true);
    setTimeout(() => setCleared(false), 1600);
  };
  return (
    <div className="space-y-3">
      <Toggle icon={MapPin} label="שיתוף מיקום" on={settings.shareLocation} onChange={() => update({ shareLocation: !settings.shareLocation })} />
      <Toggle icon={Settings} label="שמירת היסטוריית טעינות" on={settings.saveHistory} onChange={() => update({ saveHistory: !settings.saveHistory })} />
      <Toggle icon={Shield} label="שיתוף נתונים אנונימיים" on={settings.shareData} onChange={() => update({ shareData: !settings.shareData })} />
      <button onClick={clearHistory} className="w-full h-12 rounded-2xl bg-red-50 text-red-600 font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition">
        <Trash2 className="w-4 h-4" />
        {cleared ? "היסטוריה נמחקה" : "מחק היסטוריה"}
      </button>
    </div>
  );
}

function ContactScreen() {
  const { profile } = useSettings();
  const [form, setForm] = useState({ name: profile.name || "", email: profile.email || "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!form.email || !form.message) return;
    setSending(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: form.email,
        subject: "יצירת קשר - Chillcharge",
        body: `שם: ${form.name}\nאימייל: ${form.email}\n\n${form.message}`,
      });
      setSent(true);
      setForm((f) => ({ ...f, message: "" }));
    } catch {}
    setSending(false);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="space-y-3">
      <Field icon={User} label="שם" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="השם שלך" />
      <Field icon={Mail} label="אימייל לתשובה" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="you@example.com" />
      <div>
        <label className="text-[12px] font-medium text-neutral-500">הודעה</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="כתוב את הפנייה שלך…"
          rows={4}
          className="mt-1 w-full p-3 rounded-xl border border-neutral-200 bg-white outline-none focus:border-emerald-400 text-[14px] text-neutral-800 placeholder:text-neutral-300 resize-none"
        />
      </div>
      <button
        onClick={send}
        disabled={sending || !form.email || !form.message}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-emerald-500/30 disabled:opacity-50"
      >
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : sent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        {sending ? "שולח…" : sent ? "נשלח! נחזור אליך" : "שלח פנייה"}
      </button>
    </div>
  );
}

function fmtDur(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ReceiptsScreen() {
  const [receipts, setReceipts] = useState(() => getReceipts());
  const [cleared, setCleared] = useState(false);

  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("he-IL") + " " + d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  if (receipts.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-400">
        <Receipt className="w-8 h-8 mx-auto mb-3 opacity-40" />
        <p className="text-[14px] font-medium">אין עדיין קבלות</p>
        <p className="text-[12px] text-neutral-300 mt-1">הקבלות יופיעו כאן לאחר טעינות</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
        {cleared ? "נמחקו" : "מחק את כל הקבלות"}
      </button>
    </div>
  );
}

function PolicyScreen() {
  const sections = [
    { t: "1. מבוא", b: "תצהיר פרטיות זה מתאר כיצד אפליקציית Chillcharge (להלן \"האפליקציה\") אוספת, משתמשת, מאחסנת ומגנה על המידע האישי שלך. בשימוש באפליקציה הנך מאשר/ת את הוראות תצהיר זה." },
    { t: "2. מידע שנאסף", b: "האפליקציה אוספת מידע שתמסר/י מרצונך (שם, אימייל, פרטי רכב), מידע על מיקומך על מנת להציג עמדות טעינה בקרבת מקום, ונתוני טעינה כגון כמות אנרגיה, עלות ומשך הטעינה לשם הפקת קבלות." },
    { t: "3. שימוש במידע", b: "המידע משמש להצגת עמדות טעינה רלוונטיות, חישוב עלויות, הפקת קבלות, שמירת היסטוריית טעינות, שליחת התראות ושיפור חוויית השימוש. לא נשתמש במידע לשיווק ללא הסכמתך." },
    { t: "4. שיתוף מידע", b: "איננו מוכרים את מידעך. מידע עשוי להימסר לצד שלישי רק כאשר הדבר נדרש על פי דין או לשם ביצוע עסקת תשלום מול ספקי התשלומים שבחרת." },
    { t: "5. אבטחת מידע", b: "ננקוט אמצעים סבירים להגן על מידעך מפני גישה בלתי מורשית. עם זאת, אין להבטיח אבטחה מוחלטת של מערכות מידע." },
    { t: "6. שמירת מידע ומחיקתו", b: "נתוני הטעינה והקבלות נשמרים במכשירך. באפשרותך למחוק את היסטוריית הטעינות והקבלות בכל עת דרך מסך הפרטיות או מסך הקבלות שבהגדרות." },
    { t: "7. זכויותיך", b: "הנך זכאי/ת לעיין במידע שנשמר עליך, לבקש את מחיקתו, ולבטל הרשאות (כגון שיתוף מיקום) בכל עת דרך הגדרות האפליקציה או הגדרות המכשיר." },
    { t: "8. ילדים", b: "האפליקציה אינה מיועדת לילדים מתחת לגיל 18, ואיננו אוספים ביודעין מידע מילדים." },
    { t: "9. שינויים בתצהיר", b: "אנו רשאים לעדכן תצהיר זה מעת לעת. הגרסה העדכנית תפורסם באפליקציה." },
    { t: "10. יצירת קשר", b: "לשאלות בנוגע לפרטיות ניתן לפנות דרך מסך \"יצירת קשר\" שבהגדרות." },
  ];
  return (
    <div className="space-y-4 text-[13px] leading-relaxed text-neutral-600">
      <div className="rounded-2xl bg-emerald-50 p-4">
        <h3 className="text-[15px] font-bold text-emerald-700">תצהיר פרטיות</h3>
        <p className="text-[12px] text-emerald-600 mt-1">עודכן לאחרונה: ספטמבר 2026</p>
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
  const [active, setActive] = useState(null);
  if (!open) return null;
  const currentItem = items.find((i) => i.id === active);
  const Screen = active ? screens[active] : null;

  return (
    <div className="absolute inset-0 z-50" dir="rtl">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-[86%] max-w-[330px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right pt-safe pb-safe">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <button
            onClick={active ? () => setActive(null) : onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
          <h2 className="text-[16px] font-bold text-neutral-900">{currentItem ? currentItem.label : "תפריט"}</h2>
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
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition text-right"
                >
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-neutral-900">{it.label}</div>
                    <div className="text-[12px] text-neutral-400 truncate">{it.desc}</div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-neutral-300" />
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