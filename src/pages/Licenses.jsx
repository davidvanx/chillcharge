import React from "react";
import PageHeader from "@/components/PageHeader";

const licenses = [
  { name: "React", version: "MIT License", url: "https://reactjs.org" },
  { name: "React Leaflet", version: "BSD-2-Clause", url: "https://react-leaflet.js.org" },
  { name: "Leaflet", version: "BSD-2-Clause", url: "https://leafletjs.com" },
  { name: "OpenStreetMap", version: "ODbL", url: "https://www.openstreetmap.org/copyright" },
  { name: "CARTO basemaps", version: "CC BY 3.0", url: "https://carto.com" },
  { name: "Tailwind CSS", version: "MIT License", url: "https://tailwindcss.com" },
  { name: "shadcn/ui", version: "MIT License", url: "https://ui.shadcn.com" },
  { name: "Lucide Icons", version: "ISC License", url: "https://lucide.dev" },
  { name: "Google Maps", version: "Google Maps Terms", url: "https://www.google.com/maps" },
  { name: "Framer Motion", version: "MIT License", url: "https://www.framer.com/motion" },
];

export default function Licenses() {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader title="Open-source licenses" subtitle="Third-party credits" />
      <div className="px-5 pb-8 space-y-2.5">
        {licenses.map((l) => (
          <a key={l.name} href={l.url} target="_blank" rel="noreferrer" className="glass rounded-2xl p-4 flex items-center justify-between active:scale-98 transition">
            <div>
              <div className="text-sm font-semibold text-white">{l.name}</div>
              <div className="text-[11px] text-white/40">{l.version}</div>
            </div>
            <span className="text-[11px] text-cyan-300">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}