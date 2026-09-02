import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Accessibility, Code } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const items = [
  { to: "/legal/privacy", label: "מדיניות פרטיות", desc: "Privacy Policy", icon: Shield },
  { to: "/legal/terms", label: "תנאי שימוש", desc: "Terms of Service", icon: FileText },
  { to: "/legal/accessibility", label: "הצהרת נגישות", desc: "Accessibility Statement", icon: Accessibility },
  { to: "/legal/licenses", label: "רישיונות צד שלישי", desc: "Open-source Licenses", icon: Code },
];

export default function Legal() {
  const navigate = useNavigate();
  return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader title="Legal & Privacy" subtitle="Policies and compliance" />
      <div className="px-5 space-y-2.5">
        {items.map(({ to, label, desc, icon: Icon }) => (
          <button key={to} onClick={() => navigate(to)} className="w-full glass rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition text-left">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Icon className="w-5 h-5 text-cyan-300" /></div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white" dir="rtl">{label}</div>
              <div className="text-[11px] text-white/40">{desc}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="h-4" />
    </div>
  );
}