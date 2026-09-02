import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function PageHeader({ title, subtitle, back = true }) {
  const navigate = useNavigate();
  return (
    <div className="px-5 pt-3 pb-3">
      <div className="flex items-center gap-3">
        {back && (
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-90 transition">
            <ChevronLeft className="w-5 h-5 text-cyan-300" />
          </button>
        )}
        <div className={back ? "" : "flex-1"}>
          <h1 className="text-[22px] font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-[12px] text-white/50 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}