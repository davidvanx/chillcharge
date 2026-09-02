import React from "react";
import PageHeader from "@/components/PageHeader";

export default function Privacy() {
  return (
    <div className="h-full overflow-y-auto bg-background" dir="rtl">
      <PageHeader title="מדיניות פרטיות" subtitle="Privacy Policy" />
      <div className="px-5 pb-8 space-y-4 text-[13px] leading-relaxed text-white/70">
        <Section title="איסוף נתוני מיקום (GPS)">
          האפליקציה Chillcharge מבוססת מיקום על מנת להציג לך את עמדות הטעינה הקרובות אליך.
          אנו משתמשים בנתוני המיקום שלך בזמן אמת כדי למקם אותך על המפה, לחשב מרחקים לעמדות ולהציע ניווט.
          נתוני המיקום נשמרים במכשיר שלך ואינם נשמרים בשרתים שלנו אלא אם כן בחרת לשתף אותם במפורש.
          נתוני המיקום עשויים להיות משותפים עם Google Maps לצורך הצגת המפה והניווט, בהתאם למדיניות הפרטיות של Google.
        </Section>
        <Section title="ניהול הרשאות">
          האפליקציה תבקש הרשאת מיקום (Runtime Permission) בעת השימוש. לפני בקשת ההרשאה מהמערכת
          יופיע חלון הסבר המפרט מדוע נדרשת ההרשאה. ניתן לסרב להרשאה זו; במקרה זה תוכל להזין מיקום ידנית.
        </Section>
        <Section title="הגנת נתונים">
          פרטי המשתמשים מאוחסנים בצורה מאובטחת. בעת שילוב עתידי של אפשרויות תשלום או מעקב היסטוריית טעינות,
          נתוני התשלום יוצפנו ולא יאוחסנו בשרתים שלנו במלואם. אנו נוקטים באמצעים סבירתיים להגן על המידע האישי שלך.
        </Section>
        <Section title="שיתוף עם צד שלישי">
          האפליקציה שואבת נתוני עמדות מחברות צד שלישי ומ- Google Maps. מידע אישי אינו נמכר לצדדים שלישיים.
        </Section>
        <Section title="יצירת קשר">
          לשאלות בנוגע לפרטיות ניתן לפנות אלינו דרך עמוד הפרופיל.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="glass rounded-2xl p-4">
      <h2 className="text-[15px] font-bold text-cyan-300 mb-2">{title}</h2>
      <p>{children}</p>
    </div>
  );
}