import React from "react";
import { Zap } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/lib/i18n.jsx";

export default function ChargingSessions() {
  const { t } = useLanguage();
  return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader title={t("sessions.title")} subtitle={t("sessions.subtitle")} />
      <div className="px-5 flex flex-col items-center justify-center text-center pt-24">
        <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center mb-4">
          <Zap className="w-7 h-7 text-cyan-300" />
        </div>
        <p className="text-[14px] text-white/50">{t("sessions.empty")}</p>
      </div>
    </div>
  );
}