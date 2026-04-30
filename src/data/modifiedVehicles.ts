export interface ModifiedVehicleRecord {
  id: string;
  slug: string;
  title: string;
  brand: string;
  baseVehicle: string;
  builder: string;
  style: string;
  era: string;
  image: string;
  summary: string;
  featureTags: string[];
  sources: string[];
  notes: string;
}

export const MODIFIED_VEHICLE_RECORDS: ModifiedVehicleRecord[] = [
  {
    id: "build-demo-911-safari",
    slug: "porsche-911-safari-reference",
    title: "Porsche 911 Safari Reference Build",
    brand: "Porsche",
    baseVehicle: "911 Carrera",
    builder: "OEMWDB Workshop",
    style: "Safari",
    era: "Modern classic",
    image: "",
    summary:
      "A placeholder modified-build record used to keep the builds surface live while real Convex-backed build records are normalized.",
    featureTags: ["Rally stance", "All-terrain tires", "Raised suspension"],
    sources: ["Workshop placeholder"],
    notes:
      "Temporary static data. Replace with normalized modified vehicle records once the build schema is backed by Convex.",
  },
  {
    id: "build-demo-bmw-touring",
    slug: "bmw-touring-oem-plus-reference",
    title: "BMW Touring OEM+ Reference Build",
    brand: "BMW",
    baseVehicle: "3 Series Touring",
    builder: "OEMWDB Workshop",
    style: "OEM+",
    era: "Modern",
    image: "",
    summary:
      "A reference build entry for testing the modified vehicles collection, filters, cards, and item-page layout.",
    featureTags: ["Factory wheel language", "Subtle aero", "Daily fitment"],
    sources: ["Workshop placeholder"],
    notes:
      "Temporary static data. Use this only as a UI fixture until canonical modified build records exist.",
  },
  {
    id: "build-demo-land-rover-overland",
    slug: "land-rover-defender-overland-reference",
    title: "Land Rover Defender Overland Reference Build",
    brand: "Land Rover",
    baseVehicle: "Defender",
    builder: "OEMWDB Workshop",
    style: "Overland",
    era: "Current",
    image: "",
    summary:
      "A fixture for the modified-builds route that exercises the card back, tags, detail tabs, and source panel.",
    featureTags: ["Utility rack", "Off-road tires", "Expedition lighting"],
    sources: ["Workshop placeholder"],
    notes:
      "Temporary static data. Promote real build records from Convex when the modified vehicle schema is ready.",
  },
];

export function getModifiedVehicleBySlug(slug: string) {
  return MODIFIED_VEHICLE_RECORDS.find((record) => record.slug === slug) ?? null;
}
