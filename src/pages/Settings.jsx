import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Moon, Accessibility, FileText, Shield, Eye, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useA11y } from "@/lib/accessibility.jsx";
import { cn } from "@/lib/utils";

export default function Settings() {
  const navigate = useNavigate();
  const a11y = useA11y();

  const Row = ({ icon: Icon, label, onClick, right }) => (
    <button onClick={onClick} className="w-full glass rounded-2xl p-4 flex items-center justify-between active:scale-98 transition">
      <span className="flex items-center gap-3 text-white text-sm font-medium"><Icon className="w-4 h-4 text-cyan-300" /> {label}</span>
      {right || <ChevronRight className="w-4 h-4 text-white/30" />}
    </button>
  );

  return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader title="Settings" subtitle="Preferences & accessibility" />
      <div className="px-5 space-y-2.5">
        <Row icon={Moon} label="Dark mode" right={<span className="text-[12px] text-emerald-300 font-semibold">On (default)</span>} onClick={() => {}} />
        <Row icon={Bell} label="Notifications" right={<span className="text-[12px] text-white/40">Off</span>} onClick={() => {}} />

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 text-white text-sm font-medium mb-3"><Accessibility className="w-4 h-4 text-cyan-300" /> Accessibility</div>
          <div className="text-[11px] text-white/40 mb-2">Text size</div>
          <div className="flex gap-2 mb-3">
            {[1, 1.25, 1.5].map((v, i) => (
              <button key={v} onClick={() => a11y.setTextScale(v)} className={cn("flex-1 py-2 rounded-xl text-xs font-semibold", a11y.textScale === v ? "bg-cyan-400 text-neutral-950" : "bg-white/5 text-white/60")}>
                {["A", "A+", "A++"][i]}
              </button>
            ))}
          </div>
          <button onClick={() => a11y.setHighContrast(!a11y.highContrast)} className="w-full flex items-center justify-between py-1">
            <span className="text-[12px] text-white/70">High contrast</span>
            <span className={cn("w-10 h-6 rounded-full p-0.5 transition", a11y.highContrast ? "bg-emerald-400" : "bg-white/20")}>
              <span className={cn("block w-5 h-5 rounded-full bg-white transition-transform", a11y.highContrast && "translate-x-4")} />
            </span>
          </button>
        </div>

        <Row icon={Eye} label="Accessibility statement" onClick={() => navigate("/legal/accessibility")} />
        <Row icon={Shield} label="Privacy policy" onClick={() => navigate("/legal/privacy")} />
        <Row icon={FileText} label="Terms of service" onClick={() => navigate("/legal/terms")} />
        <Row icon={FileText} label="Open-source licenses" onClick={() => navigate("/legal/licenses")} />
      </div>
      <div className="h-4" />
    </div>
  );
}