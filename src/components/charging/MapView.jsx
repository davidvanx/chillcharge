import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const r = requestAnimationFrame(() => map.invalidateSize());
    const ro = new ResizeObserver(() => map.invalidateSize());
    const el = map.getContainer();
    ro.observe(el);
    return () => {
      cancelAnimationFrame(r);
      ro.disconnect();
    };
  }, [map]);
  return null;
}

const cityCoords = {
  "Tel Aviv": [32.0853, 34.7818],
  Tel: [32.0853, 34.7818],
  "Tel-Aviv": [32.0853, 34.7818],
  Jerusalem: [31.7683, 35.2137],
  Haifa: [32.794, 34.9896],
  Herzliya: [32.1663, 34.8457],
  Herzliyya: [32.1663, 34.8457],
  Netanya: [32.3214, 34.8532],
  "Rishon LeZion": [31.973, 34.7925],
  "Rishon Leziyyon": [31.973, 34.7925],
  "Petah Tikva": [32.084, 34.8878],
  "Petah Tiqwa": [32.084, 34.8878],
  "Be'er Sheva": [31.2518, 34.7913],
  "Beersheba": [31.2518, 34.7913],
  Ashdod: [31.8044, 34.6553],
  "Ramat Gan": [32.0684, 34.8248],
  Rehovot: [31.8928, 34.8113],
  "Kfar Saba": [32.1788, 34.9073],
  "Kefar Sava": [32.1788, 34.9073],
  "Ra'anana": [32.1833, 34.8716],
  Raanana: [32.1833, 34.8716],
  Hadera: [32.434, 34.9196],
  "Modi'in": [31.8973, 35.0104],
  Modiin: [31.8973, 35.0104],
  Nazareth: [32.6996, 35.2974],
  Tiberias: [32.792, 35.531],
  Eilat: [29.5577, 34.9519],
};

function coordsFor(station, index) {
  if (station.latitude && station.longitude) return [station.latitude, station.longitude];
  const base = cityCoords[station.city] || cityCoords[station.city?.replace(/-/g, " ")] || [32.0853, 34.7818];
  const j = (index % 6) * 0.004 - 0.01;
  return [base[0] + j, base[1] + j];
}

const makeIcon = (color) =>
  L.divIcon({
    html: `<div style="width:20px;height:20px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,.35)"></div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });

const dcIcon = makeIcon("#8b5cf6");
const acIcon = makeIcon("#0ea5e9");

export default function MapView({ stations, onSelect }) {
  const points = stations.map((s, i) => ({ s, pos: coordsFor(s, i) }));
  const center = points[0]?.pos || [32.0853, 34.7818];

  return (
    <div className="flex-1 min-h-0 px-3 pb-3 relative z-0">
      <div className="h-full w-full rounded-2xl overflow-hidden border border-black/5 shadow-sm bg-neutral-100">
        <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <MapResizer />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          {points.map(({ s, pos }, i) => (
            <Marker
              key={s.id || i}
              position={pos}
              icon={s.type === "DC" ? dcIcon : acIcon}
              eventHandlers={{ click: () => onSelect?.(s) }}
            >
              <Popup>
                <div style={{ minWidth: 140 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{s.network}</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {s.power_kw} kW · ₪{s.price_per_kwh?.toFixed(2)}/kWh
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}