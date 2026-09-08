export const chargingCompanies = [
  { name: "אפקון", en: "ON-EV", phone: "*2108" },
  { name: "אי-וי אדג'", en: "EV-Edge", phone: "*9704" },
  { name: "סונול EVI", en: "Sonol EVI", phone: "*3389" },
  { name: "ג'ינרג'י", en: "Gnrgy", phone: "*3847" },
  { name: "פז Charge", en: "Paz Charge", phone: "09-8631188" },
  { name: "סלו צ'ארג'", en: "CelloCharge", phone: "074-712-7839" },
  { name: "גרינספוט", en: "Greenspot", phone: "1-800-201-205" },
  { name: "אי וי סמארט", en: "EV Smart Charge", phone: "03-7702288" },
  { name: "ניסקו", en: "Nisko EV", phone: "072-2400600" },
  { name: "וולטק", en: "VOLTEC", phone: "054-9621819" },
  { name: "ווי-צ'ארג'", en: "WeCharge", phone: "03-7201952" },
  { name: "אי-וי אנרג'י", en: "EV Energy", phone: "077-804-5600" },
];

export function getCompanyPhone(network) {
  if (!network) return null;
  const found = chargingCompanies.find(
    (c) => c.name === network || c.en === network
  );
  return found ? found.phone : null;
}