import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { User, Mail, Zap, Star, Bookmark, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="px-5 pt-6 pb-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.5)]">
          <User className="w-10 h-10 text-neutral-950" />
        </div>
        <h1 className="text-xl font-bold text-white mt-3">{user?.full_name || t("profile.defaultName")}</h1>
        <p className="text-[13px] text-white/50 flex items-center justify-center gap-1 mt-1">
          <Mail className="w-3 h-3" /> {user?.email || "—"}
        </p>
      </div>

      <div className="px-5 grid grid-cols-3 gap-2.5">
        <div className="glass rounded-2xl p-3 text-center">
          <Zap className="w-5 h-5 mx-auto text-cyan-300" />
          <div className="text-lg font-bold text-white mt-1">24</div>
          <div className="text-[10px] text-white/40">{t("profile.charges")}</div>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <Star className="w-5 h-5 mx-auto text-amber-400" />
          <div className="text-lg font-bold text-white mt-1">4.8</div>
          <div className="text-[10px] text-white/40">{t("profile.rating")}</div>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <Bookmark className="w-5 h-5 mx-auto text-emerald-300" />
          <div className="text-lg font-bold text-white mt-1">7</div>
          <div className="text-[10px] text-white/40">{t("profile.saved")}</div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-2.5">
        <button onClick={() => navigate("/saved")} className="w-full glass rounded-2xl p-4 flex items-center justify-between active:scale-98 transition">
          <span className="flex items-center gap-3 text-white text-sm font-medium"><Bookmark className="w-4 h-4 text-cyan-300" /> {t("profile.savedStations")}</span>
        </button>
        <button onClick={() => navigate("/settings")} className="w-full glass rounded-2xl p-4 flex items-center justify-between active:scale-98 transition">
          <span className="flex items-center gap-3 text-white text-sm font-medium"><User className="w-4 h-4 text-cyan-300" /> {t("profile.settings")}</span>
        </button>
        <button onClick={() => base44.auth.logout()} className="w-full rounded-2xl p-4 flex items-center justify-center gap-2 bg-red-500/15 text-red-400 text-sm font-semibold active:scale-98 transition">
          <LogOut className="w-4 h-4" /> {t("profile.signOut")}
        </button>
      </div>
      <div className="h-4" />
    </div>
  );
}