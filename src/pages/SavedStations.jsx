import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Bookmark } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StationCard from "@/components/charging/StationCard";
import StationDetailSheet from "@/components/charging/StationDetailSheet";
import { useLanguage } from "@/lib/i18n.jsx";

export default function SavedStations() {
  const { t } = useLanguage();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.ChargingStation.list("-created_date", 20)
      .then((data) => setStations(data.slice(0, 5)))
      .catch(() => setStations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader title={t("saved.title")} subtitle={t("saved.subtitle")} />
      <div className="px-5 space-y-3">
        {loading ? (
          [0, 1, 2].map((i) => <div key={i} className="h-40 rounded-3xl glass animate-pulse" />)
        ) : stations.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <Bookmark className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-[14px]">{t("saved.empty")}</p>
          </div>
        ) : (
          stations.map((s) => <StationCard key={s.id} station={s} onClick={() => setSelected(s)} />)
        )}
      </div>
      <div className="h-4" />
      <StationDetailSheet station={selected} onClose={() => setSelected(null)} />
    </div>
  );
}