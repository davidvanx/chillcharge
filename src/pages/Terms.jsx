import React from "react";
import PageHeader from "@/components/PageHeader";

export default function Terms() {
  return (
    <div className="h-full overflow-y-auto bg-background" dir="rtl">
      <PageHeader title="תנאי שימוש" subtitle="Terms of Service" />
      <div className="px-5 pb-8 space-y-4 text-[13px] leading-relaxed text-white/70">
        <Section title="הסרת אחריות (Disclaimer)">
          האפליקציה שואבת נתוני עמדות טעינה מחברות צד שלישי וממקורות ציבוריים. ייתכן שהסטטוס המוצג
          (זמין/תפוס/מחוץ לפעילות) אינו מעודכן בזמן אמת. החברה אינה אחראית אם עמדה שמופיעה כ"זמינה"
          מתגלה כתקולה או תפוסה בעת ההגעה אליה. השימוש באפליקציה הוא על אחריות המשתמש בלבד.
        </Section>
        <Section title="כללי התנהגות">
          במידה ויופעל פיצ'ר דיווח משתמשים על עמדות תקולות, אסור להשתמש במערכת לרעה — לרבות דיווחי שווא,
          ניסיונות חסימת עמדות לשימוש עצמי, או הטרדת משתמשים אחרים. הפרת כללים אלו עלולה להוביל לחסימת החשבון.
        </Section>
        <Section title="שימוש בשירות">
          האפליקציה מספקת מידע על עמדות טעינה בלבד ואינה מבצעת תשלום או טעינה בפועל בשלב זה.
        </Section>
        <Section title="שינויים בתנאים">
          אנו רשאים לעדכן תנאים אלו מעת לעת. המשך השימוש באפליקציה מהווה הסכמה לתנאים המעודכנים.
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