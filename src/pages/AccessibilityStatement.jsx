import React from "react";
import PageHeader from "@/components/PageHeader";

export default function AccessibilityStatement() {
  return (
    <div className="h-full overflow-y-auto bg-background" dir="rtl">
      <PageHeader title="הצהרת נגישות" subtitle="Accessibility Statement" />
      <div className="px-5 pb-8 space-y-4 text-[13px] leading-relaxed text-white/70">
        <div className="glass rounded-2xl p-4">
          <p>
            Chillcharge מחויבת לנגישות ופועלת להתאים את האפליקציה לתקן <span className="text-cyan-300 font-semibold">WCAG 2.1</span> ברמה AA,
            בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות.
          </p>
        </div>
        <Section title="התאמות נגישות באפליקציה">
          כפתור הנגישות זמין בכל עמוד ומאפשר: הגדלת טקסט, מצב ניגודיות גבוהה (High Contrast),
          והתאמות לעיוורון צבעים (Deuteranopia, Protanopia, Tritanopia).
        </Section>
        <Section title="ניווט">
          האפליקציה כוללת ניווט תחתון ברור עם תוויות טקסט, וכל האלמנטים נגישים באמצעות מקלדת וקוראי מסך.
        </Section>
        <Section title="משוב ופניות">
          ניתן לדווח על בעיות נגישות דרך עמוד הפרופיל. אנו מחויבים לשפר את הנגישות באופן שוטף.
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