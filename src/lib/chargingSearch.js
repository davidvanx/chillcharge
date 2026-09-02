import { base44 } from "@/api/base44Client";

// Uses web search (Google Maps + web) to find real charging stations near a location in Israel.
// Returns an array of stations matching the ChargingStation shape.
export async function searchStationsNear(location) {
  const schema = {
    type: "object",
    properties: {
      stations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            network: { type: "string" },
            address: { type: "string" },
            city: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
            distance_km: { type: "number" },
            type: { type: "string", enum: ["AC", "DC"] },
            power_kw: { type: "number" },
            price_per_kwh: { type: "number" },
            currency: { type: "string" },
            available: { type: "number" },
            total: { type: "number" },
            status: { type: "string", enum: ["available", "busy", "offline"] },
            amenities: { type: "array", items: { type: "string" } },
            rating: { type: "number" }
          },
          required: ["name", "type", "power_kw", "price_per_kwh"]
        }
      }
    }
  };

  const prompt = `You are an EV charging-station lookup service for Israel.
Find real electric vehicle charging stations near "${location}", Israel using Google Maps and web search.
For each station return: name, network operator (e.g. Afcon, GoTo, EVedge, Pablo, Plugit, Sonol, Doradec, Tesla, Ionity),
full address, city, latitude, longitude, approximate distance_km from the location,
type (DC for fast/ultra-fast chargers, AC for slower destination chargers),
power_kw (typical max power: DC 50-360, AC 7-43),
price_per_kwh in ILS (Israeli Shekel, currency "₪") — estimate from publicly listed rates if exact is unknown,
available and total connectors and status ("available"/"busy"/"offline") based on the latest public info,
amenities (wifi/coffee/shop if known), and rating (1-5) if known.
Return up to 12 stations, sorted by closest first. Be accurate; if a field is unknown use a reasonable estimate and do not invent fictional stations.`;

  const res = await base44.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: true,
    response_json_schema: schema,
  });

  const stations = res?.stations || [];
  // Normalize currency + ids for the UI
  return stations.map((s, i) => ({
    id: `live-${i}`,
    ...s,
    currency: s.currency || "₪",
    available: s.available ?? 0,
    total: s.total ?? 0,
    status: s.status || "available",
  }));
}