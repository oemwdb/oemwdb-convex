import { mutation } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

type WheelDoc = Doc<"oem_wheels">;
type VehicleDoc = Doc<"oem_vehicles">;

type ExistingWheelVariantSeed = {
  oldId: string;
  variantTitle: string;
  diameter?: string;
  width?: string;
  offset?: string;
  boltPattern?: string;
  centerBore?: string;
  color?: string;
  partNumber?: string;
  notes?: string;
  imageUrl?: string;
  yearFrom?: number;
  yearTo?: number;
};

type NewWheelVariantSeed = {
  slug: string;
  variantTitle: string;
  diameter?: string;
  width?: string;
  offset?: string;
  boltPattern?: string;
  centerBore?: string;
  color?: string;
  partNumber?: string;
  notes?: string;
  imageUrl?: string;
  yearFrom?: number;
  yearTo?: number;
};

type WheelFamilySeed = {
  key: string;
  businessId: string;
  title: string;
  vehicleKey: "4c" | "giulia" | "stelvio" | "tonale";
  styleNumber?: string;
  notes: string;
  boltPattern?: string;
  centerBore?: string;
  imageUrl?: string;
  existingMembers?: ExistingWheelVariantSeed[];
  newVariants?: NewWheelVariantSeed[];
};

type VehicleVariantSeed = {
  slug: string;
  variantTitle: string;
  trimLevel?: string;
  yearFrom?: number;
  yearTo?: number;
  notes?: string;
  wheelFamilyKeys: string[];
};

type VehicleSeed = {
  key: "4c" | "giulia" | "stelvio" | "tonale";
  businessId: string;
  title: string;
  modelName: string;
  productionYears: string;
  yearFrom: number;
  yearTo?: number;
  bodyType: string;
  driveType: string;
  notes: string;
  diameters: string[];
  widths: string[];
  boltPattern?: string;
  centerBore?: string;
  variants: VehicleVariantSeed[];
};

function clean(value: unknown): string | undefined {
  const out = String(value ?? "").trim();
  return out ? out : undefined;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function dedupe(values: Array<string | undefined>): string[] {
  return [...new Set(values.map((value) => clean(value)).filter(Boolean) as string[])];
}

function joinCsv(values: Array<string | undefined>): string | undefined {
  const out = dedupe(values);
  return out.length ? out.join(", ") : undefined;
}

const VEHICLES: VehicleSeed[] = [
  {
    key: "4c",
    businessId: "alfa-romeo-alfa-romeo-4c",
    title: "Alfa Romeo 4C",
    modelName: "Alfa Romeo 4C",
    productionYears: "2015-2020",
    yearFrom: 2015,
    yearTo: 2020,
    bodyType: "Sports Car",
    driveType: "RWD",
    notes:
      "Verified against Alfa Romeo USA owner manual coverage for 4C Coupe and 4C Spider. Wheel families rebuilt from Alfa Romeo workshop / Hubcap Haven source rows.",
    diameters: ["17 inch", "18 inch", "19 inch"],
    widths: ["7J", "8J", "8.5J"],
    boltPattern: "5x98",
    variants: [
      {
        slug: "alfa-romeo-4c-coupe",
        variantTitle: "4C Coupe",
        trimLevel: "Coupe",
        yearFrom: 2015,
        yearTo: 2020,
        notes: "Manual-backed Alfa Romeo 4C Coupe fitment grouping.",
        wheelFamilyKeys: [
          "4c-black-machined",
          "4c-painted",
          "4c-silver-10-spoke",
          "4c-charcoal-10-spoke",
          "4c-silver-5-split",
          "4c-charcoal-5-split",
        ],
      },
      {
        slug: "alfa-romeo-4c-spider",
        variantTitle: "4C Spider",
        trimLevel: "Spider",
        yearFrom: 2015,
        yearTo: 2020,
        notes: "Manual-backed Alfa Romeo 4C Spider fitment grouping.",
        wheelFamilyKeys: [
          "4c-black-machined",
          "4c-painted",
          "4c-silver-10-spoke",
          "4c-charcoal-10-spoke",
          "4c-silver-5-split",
          "4c-charcoal-5-split",
        ],
      },
    ],
  },
  {
    key: "giulia",
    businessId: "alfa-romeo-alfa-romeo-giulia",
    title: "Alfa Romeo Giulia",
    modelName: "Alfa Romeo Giulia",
    productionYears: "2017-present",
    yearFrom: 2017,
    bodyType: "Sedan",
    driveType: "RWD, AWD",
    notes:
      "Verified against current Alfa Romeo USA Giulia pages and owner manual coverage. Legacy wheel families regrouped from Alfa Romeo workshop / Hubcap Haven source rows.",
    diameters: ["17 inch", "18 inch", "19 inch"],
    widths: ["7.5J", "8J", "8.5J", "9J", "10J"],
    boltPattern: "5x110",
    variants: [
      {
        slug: "alfa-romeo-giulia-base-and-touring",
        variantTitle: "Giulia Base / Touring",
        trimLevel: "Base / Touring",
        yearFrom: 2017,
        notes: "Grouped around verified 17-inch and 18-inch Giulia OEM wheels.",
        wheelFamilyKeys: ["giulia-17-grey", "giulia-18-painted", "giulia-18-grey-machined", "giulia-18-dark-grey"],
      },
      {
        slug: "alfa-romeo-giulia-sport-19-inch-package",
        variantTitle: "Giulia Sport 19-Inch Package",
        trimLevel: "Sport",
        yearFrom: 2017,
        notes: "Grouped around verified 19-inch Giulia WCT sport-package wheels.",
        wheelFamilyKeys: ["giulia-19-sport-hyper-charcoal"],
      },
      {
        slug: "alfa-romeo-giulia-quadrifoglio-hyper-silver",
        variantTitle: "Giulia Quadrifoglio Hyper Silver",
        trimLevel: "Quadrifoglio",
        yearFrom: 2017,
        notes: "Grouped around verified staggered Giulia Quadrifoglio hyper-silver wheel variants.",
        wheelFamilyKeys: ["giulia-qv-19-hyper-silver"],
      },
      {
        slug: "alfa-romeo-giulia-quadrifoglio-hyper-charcoal",
        variantTitle: "Giulia Quadrifoglio Hyper Charcoal",
        trimLevel: "Quadrifoglio",
        yearFrom: 2017,
        notes: "Grouped around verified staggered Giulia Quadrifoglio hyper-charcoal wheel variants.",
        wheelFamilyKeys: ["giulia-qv-19-hyper-charcoal"],
      },
    ],
  },
  {
    key: "stelvio",
    businessId: "alfa-romeo-alfa-romeo-stelvio",
    title: "Alfa Romeo Stelvio",
    modelName: "Alfa Romeo Stelvio",
    productionYears: "2018-present",
    yearFrom: 2018,
    bodyType: "SUV",
    driveType: "AWD",
    notes:
      "Verified against current Alfa Romeo USA Stelvio pages and owner manual coverage. Wheel families regrouped from Alfa Romeo workshop / Hubcap Haven source rows.",
    diameters: ["18 inch", "19 inch", "20 inch"],
    widths: ["8J", "8.5J"],
    boltPattern: "5x110",
    variants: [
      {
        slug: "alfa-romeo-stelvio-standard-18-inch",
        variantTitle: "Stelvio Standard 18-Inch",
        trimLevel: "Standard",
        yearFrom: 2018,
        notes: "Grouped around verified 18-inch Stelvio OEM wheels.",
        wheelFamilyKeys: ["stelvio-18-painted"],
      },
      {
        slug: "alfa-romeo-stelvio-touring-19-inch",
        variantTitle: "Stelvio Touring 19-Inch",
        trimLevel: "Touring",
        yearFrom: 2018,
        notes: "Grouped around verified 19-inch Stelvio OEM wheels.",
        wheelFamilyKeys: ["stelvio-19-charcoal-machined", "stelvio-19-silver-painted"],
      },
      {
        slug: "alfa-romeo-stelvio-sport-20-inch",
        variantTitle: "Stelvio Sport 20-Inch",
        trimLevel: "Sport",
        yearFrom: 2018,
        notes: "Grouped around verified 20-inch Stelvio OEM wheels.",
        wheelFamilyKeys: ["stelvio-20-five-y", "stelvio-20-black-machined"],
      },
    ],
  },
  {
    key: "tonale",
    businessId: "alfa-romeo-alfa-romeo-tonale",
    title: "Alfa Romeo Tonale",
    modelName: "Alfa Romeo Tonale",
    productionYears: "2023-present",
    yearFrom: 2023,
    bodyType: "SUV",
    driveType: "FWD, AWD",
    notes:
      "Verified against current Alfa Romeo USA Tonale pages, official Tonale product-guide snippets, and targeted OEM parts listings for 18-inch, 19-inch, and 20-inch Tonale wheels.",
    diameters: ["18 inch", "19 inch", "20 inch"],
    widths: ["7.5J", "8J"],
    boltPattern: "5x110",
    centerBore: "65.1mm",
    variants: [
      {
        slug: "alfa-romeo-tonale-standard-18-inch",
        variantTitle: "Tonale Standard 18-Inch",
        trimLevel: "Standard",
        yearFrom: 2023,
        notes: "Grouped around verified 18-inch Tonale OEM wheels.",
        wheelFamilyKeys: ["tonale-18-diamond-cut"],
      },
      {
        slug: "alfa-romeo-tonale-veloce-tributo-19-inch",
        variantTitle: "Tonale Veloce / Tributo Italiano 19-Inch",
        trimLevel: "Veloce / Tributo Italiano",
        yearFrom: 2023,
        notes: "Grouped around verified 19-inch Tonale OEM wheels and official Veloce / Tributo wheel sizing.",
        wheelFamilyKeys: ["tonale-19-five-hole"],
      },
      {
        slug: "alfa-romeo-tonale-intensa-sport-speciale-20-inch",
        variantTitle: "Tonale Intensa / Sport Speciale 20-Inch",
        trimLevel: "Intensa / Sport Speciale",
        yearFrom: 2025,
        notes: "Grouped around verified 20-inch Tonale OEM wheels and official Intensa / Sport Speciale wheel sizing.",
        wheelFamilyKeys: ["tonale-20-black-alloy"],
      },
    ],
  },
];

const WHEEL_FAMILIES: WheelFamilySeed[] = [
  {
    key: "4c-black-machined",
    businessId: "alfa-romeo-4c-10-spoke-black-machined-wheels",
    title: "Alfa Romeo 4C 10-Spoke Black Machined Wheels",
    vehicleKey: "4c",
    styleNumber: "ALY58153/ALY58154",
    notes: "Regrouped from verified Alfa Romeo 4C black-machined workshop rows.",
    boltPattern: "5x98",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58153-4c-black-machined-68237519aa-wheels",
        variantTitle: "Front 17x7 Black Machined (68237519AA)",
        diameter: "17 inch",
        width: "7J",
        color: "Black",
        partNumber: "68237519AA",
        boltPattern: "5x98",
      },
      {
        oldId: "alfa-romeo-aly58154-4c-black-machined-68237520aa-wheels",
        variantTitle: "Rear 18x8 Black Machined (68237520AA)",
        diameter: "18 inch",
        width: "8J",
        color: "Black",
        partNumber: "68237520AA",
        boltPattern: "5x98",
      },
    ],
  },
  {
    key: "4c-painted",
    businessId: "alfa-romeo-4c-10-spoke-painted-wheels",
    title: "Alfa Romeo 4C 10-Spoke Painted Wheels",
    vehicleKey: "4c",
    styleNumber: "ALY58195U/ALY58196U",
    notes: "Regrouped from verified Alfa Romeo 4C painted workshop rows with missing source part numbers.",
    boltPattern: "5x98",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58195u-4c-painted-wheels",
        variantTitle: "Front 17x7 Painted",
        diameter: "17 inch",
        width: "7J",
        color: "Silver or black",
        boltPattern: "5x98",
      },
      {
        oldId: "alfa-romeo-aly58196u-4c-painted-wheels",
        variantTitle: "Rear 18x8 Painted",
        diameter: "18 inch",
        width: "8J",
        color: "Silver or black",
        boltPattern: "5x98",
      },
    ],
  },
  {
    key: "4c-silver-10-spoke",
    businessId: "alfa-romeo-4c-10-spoke-silver-painted-wheels",
    title: "Alfa Romeo 4C 10-Spoke Silver Painted Wheels",
    vehicleKey: "4c",
    styleNumber: "ALY58155U20/ALY58156U20",
    notes: "Regrouped from verified Alfa Romeo 4C silver-painted workshop rows.",
    boltPattern: "5x98",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58155u20-4c-silver-painted-68267942aa-wheels",
        variantTitle: "Front 18x7 Silver Painted (68267942AA)",
        diameter: "18 inch",
        width: "7J",
        color: "Silver",
        partNumber: "68267942AA",
        boltPattern: "5x98",
      },
      {
        oldId: "alfa-romeo-aly58156u20-4c-silver-painted-68267945aa-wheels",
        variantTitle: "Rear 19x8.5 Silver Painted (68267945AA)",
        diameter: "19 inch",
        width: "8.5J",
        color: "Silver",
        partNumber: "68267945AA",
        boltPattern: "5x98",
      },
    ],
  },
  {
    key: "4c-charcoal-10-spoke",
    businessId: "alfa-romeo-4c-10-spoke-charcoal-painted-wheels",
    title: "Alfa Romeo 4C 10-Spoke Charcoal Painted Wheels",
    vehicleKey: "4c",
    styleNumber: "ALY58155U30/ALY58156U30",
    notes: "Regrouped from verified Alfa Romeo 4C charcoal-painted workshop rows.",
    boltPattern: "5x98",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58155u30-4c-charcoal-painted-68267943aa-wheels",
        variantTitle: "Front 18x7 Charcoal Painted (68267943AA)",
        diameter: "18 inch",
        width: "7J",
        color: "Charcoal",
        partNumber: "68267943AA",
        boltPattern: "5x98",
      },
      {
        oldId: "alfa-romeo-aly58156u30-4c-charcoal-painted-68267946aa-wheels",
        variantTitle: "Rear 19x8.5 Charcoal Painted (68267946AA)",
        diameter: "19 inch",
        width: "8.5J",
        color: "Charcoal",
        partNumber: "68267946AA",
        boltPattern: "5x98",
      },
    ],
  },
  {
    key: "4c-silver-5-split",
    businessId: "alfa-romeo-4c-5-split-spoke-silver-painted-wheels",
    title: "Alfa Romeo 4C 5 Split-Spoke Silver Painted Wheels",
    vehicleKey: "4c",
    styleNumber: "ALY58157U20/ALY58158U20",
    notes: "Regrouped from verified Alfa Romeo 4C silver 5-split-spoke workshop rows.",
    boltPattern: "5x98",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58157u20-4c-silver-painted-68237423aa-wheels",
        variantTitle: "Front 18x7 Silver Painted (68237423AA)",
        diameter: "18 inch",
        width: "7J",
        color: "Silver",
        partNumber: "68237423AA",
        boltPattern: "5x98",
      },
      {
        oldId: "alfa-romeo-aly58158u20-4c-silver-painted-68237414aa-wheels",
        variantTitle: "Rear 19x8.5 Silver Painted (68237414AA)",
        diameter: "19 inch",
        width: "8.5J",
        color: "Silver",
        partNumber: "68237414AA",
        boltPattern: "5x98",
      },
    ],
  },
  {
    key: "4c-charcoal-5-split",
    businessId: "alfa-romeo-4c-5-split-spoke-charcoal-painted-wheels",
    title: "Alfa Romeo 4C 5 Split-Spoke Charcoal Painted Wheels",
    vehicleKey: "4c",
    styleNumber: "ALY58157U30/ALY58158U30",
    notes: "Regrouped from verified Alfa Romeo 4C charcoal 5-split-spoke workshop rows.",
    boltPattern: "5x98",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58157u30-4c-charcoal-painted-68237424aa-wheels",
        variantTitle: "Front 18x7 Charcoal Painted (68237424AA)",
        diameter: "18 inch",
        width: "7J",
        color: "Charcoal",
        partNumber: "68237424AA",
        boltPattern: "5x98",
      },
      {
        oldId: "alfa-romeo-aly58158u30-4c-charcoal-painted-68237425aa-wheels",
        variantTitle: "Rear 19x8.5 Charcoal Painted (68237425AA)",
        diameter: "19 inch",
        width: "8.5J",
        color: "Charcoal",
        partNumber: "68237425AA",
        boltPattern: "5x98",
      },
    ],
  },
  {
    key: "giulia-17-grey",
    businessId: "alfa-romeo-giulia-17-inch-10-spoke-grey-wheels",
    title: "Alfa Romeo Giulia 17-Inch 10-Spoke Grey Wheels",
    vehicleKey: "giulia",
    styleNumber: "ALY58135",
    notes: "Regrouped from verified 17-inch Giulia workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58135-giulia-grey-painted-6cp04u06aa-wheels",
        variantTitle: "17x7.5 Grey Painted (6CP04U06AA)",
        diameter: "17 inch",
        width: "7.5J",
        color: "Grey",
        partNumber: "6CP04U06AA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "giulia-18-painted",
    businessId: "alfa-romeo-giulia-18-inch-painted-wheels",
    title: "Alfa Romeo Giulia 18-Inch Painted Wheels",
    vehicleKey: "giulia",
    styleNumber: "ALY58159U",
    notes: "Regrouped from verified 18-inch Giulia painted workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58159u-giulia-painted-6cp08maaaa-wheels",
        variantTitle: "18x8 Painted (6CP08MAAAA / 6CP08U65AA)",
        diameter: "18 inch",
        width: "8J",
        color: "Silver or grey",
        partNumber: "6CP08MAAAA, 6CP08U65AA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "giulia-18-grey-machined",
    businessId: "alfa-romeo-giulia-18-inch-20-spoke-grey-machined-wheels",
    title: "Alfa Romeo Giulia 18-Inch 20-Spoke Grey Machined Wheels",
    vehicleKey: "giulia",
    styleNumber: "ALY58160",
    notes: "Regrouped from verified 18-inch Giulia grey-machined workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58160-giulia-grey-machined-6cp05u65aa-wheels",
        variantTitle: "18x8 Grey Machined (6CP05U65AA)",
        diameter: "18 inch",
        width: "8J",
        color: "Grey machined",
        partNumber: "6CP05U65AA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "giulia-18-dark-grey",
    businessId: "alfa-romeo-giulia-18-inch-dark-grey-painted-wheels",
    title: "Alfa Romeo Giulia 18-Inch Dark Grey Painted Wheels",
    vehicleKey: "giulia",
    styleNumber: "ALY58161",
    notes: "Regrouped from verified 18-inch Giulia dark-grey workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58161-giulia-grey-painted-6cp07u90aa-wheels",
        variantTitle: "18x8 Dark Grey Painted (6CP07U90AA)",
        diameter: "18 inch",
        width: "8J",
        color: "Dark grey",
        partNumber: "6CP07U90AA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "giulia-19-sport-hyper-charcoal",
    businessId: "alfa-romeo-giulia-19-inch-5-y-spoke-hyper-charcoal-wheels",
    title: "Alfa Romeo Giulia 19-Inch 5 Y-Spoke Hyper Charcoal Wheels",
    vehicleKey: "giulia",
    styleNumber: "ALY58166/ALY58167",
    notes: "Regrouped from verified Giulia WCT 19-inch sport-package workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58166-giulia-hyper-charcoal-6cp06u3saa-wheels",
        variantTitle: "Front 19x8 Hyper Charcoal (6CP06U3SAA)",
        diameter: "19 inch",
        width: "8J",
        color: "Hyper charcoal",
        partNumber: "6CP06U3SAA",
        boltPattern: "5x110",
      },
      {
        oldId: "alfa-romeo-aly58167-giulia-hyper-charcoal-6fm59u5gaa-wheels",
        variantTitle: "Rear 19x9 Hyper Charcoal (6FM59U5GAA)",
        diameter: "19 inch",
        width: "9J",
        color: "Hyper charcoal",
        partNumber: "6FM59U5GAA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "giulia-qv-19-hyper-silver",
    businessId: "alfa-romeo-giulia-quadrifoglio-19-inch-5-y-spoke-hyper-silver-wheels",
    title: "Alfa Romeo Giulia Quadrifoglio 19-Inch 5 Y-Spoke Hyper Silver Wheels",
    vehicleKey: "giulia",
    styleNumber: "ALY58162/63/64/65",
    notes: "Regrouped from verified Giulia Quadrifoglio hyper-silver workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58162u77-giulia-hyper-silver-6cp07u90aa-wheels",
        variantTitle: "Front 19x8.5 Hyper Silver (6CP07U90AA)",
        diameter: "19 inch",
        width: "8.5J",
        color: "Hyper silver",
        partNumber: "6CP07U90AA",
        boltPattern: "5x110",
      },
      {
        oldId: "alfa-romeo-aly58163u77-giulia-hyper-silver-6eb09u5raa-wheels",
        variantTitle: "Rear 19x10 Hyper Silver (6EB09U5RAA)",
        diameter: "19 inch",
        width: "10J",
        color: "Hyper silver",
        partNumber: "6EB09U5RAA",
        boltPattern: "5x110",
      },
      {
        oldId: "alfa-romeo-aly58164u77-giulia-hyper-silver-6cq44u0oaa-wheels",
        variantTitle: "Front 19x8.5 Hyper Silver (6CQ44U0OAA)",
        diameter: "19 inch",
        width: "8.5J",
        color: "Hyper silver",
        partNumber: "6CQ44U0OAA",
        boltPattern: "5x110",
      },
      {
        oldId: "alfa-romeo-aly58165u77-giulia-hyper-silver-6eb13u0oaa-wheels",
        variantTitle: "Rear 19x10 Hyper Silver (6EB13U0OAA)",
        diameter: "19 inch",
        width: "10J",
        color: "Hyper silver",
        partNumber: "6EB13U0OAA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "giulia-qv-19-hyper-charcoal",
    businessId: "alfa-romeo-giulia-quadrifoglio-19-inch-5-y-spoke-hyper-charcoal-wheels",
    title: "Alfa Romeo Giulia Quadrifoglio 19-Inch 5 Y-Spoke Hyper Charcoal Wheels",
    vehicleKey: "giulia",
    styleNumber: "ALY58162/63/64/65",
    notes: "Regrouped from verified Giulia Quadrifoglio hyper-charcoal workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58162u79-giulia-hyper-charcoal-6cp07u06aa-wheels",
        variantTitle: "Front 19x8.5 Hyper Charcoal (6CP07U06AA)",
        diameter: "19 inch",
        width: "8.5J",
        color: "Hyper charcoal",
        partNumber: "6CP07U06AA",
        boltPattern: "5x110",
      },
      {
        oldId: "alfa-romeo-aly58163u79-giulia-hyper-charcoal-6eb09u06aa-wheels",
        variantTitle: "Rear 19x10 Hyper Charcoal (6EB09U06AA)",
        diameter: "19 inch",
        width: "10J",
        color: "Hyper charcoal",
        partNumber: "6EB09U06AA",
        boltPattern: "5x110",
      },
      {
        oldId: "alfa-romeo-aly58164u79-giulia-hyper-charcoal-6cq44u3saa-wheels",
        variantTitle: "Front 19x8.5 Hyper Charcoal (6CQ44U3SAA)",
        diameter: "19 inch",
        width: "8.5J",
        color: "Hyper charcoal",
        partNumber: "6CQ44U3SAA",
        boltPattern: "5x110",
      },
      {
        oldId: "alfa-romeo-aly58165u79-giulia-hyper-charcoal-6eb13u5gaa-wheels",
        variantTitle: "Rear 19x10 Hyper Charcoal (6EB13U5GAA)",
        diameter: "19 inch",
        width: "10J",
        color: "Hyper charcoal",
        partNumber: "6EB13U5GAA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "stelvio-18-painted",
    businessId: "alfa-romeo-stelvio-18-inch-5-spoke-painted-wheels",
    title: "Alfa Romeo Stelvio 18-Inch 5-Spoke Painted Wheels",
    vehicleKey: "stelvio",
    styleNumber: "ALY58168",
    notes: "Regrouped from verified 18-inch Stelvio workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58168u20-58187-stelvio-silver-painted-6ra91udcaa-wheels",
        variantTitle: "18x8 Silver Painted (6RA91UDCAA)",
        diameter: "18 inch",
        width: "8J",
        color: "Silver",
        partNumber: "6RA91UDCAA",
        boltPattern: "5x110",
      },
      {
        oldId: "alfa-romeo-aly58168u35-58187-stelvio-grey-painted-6ra91udcaa-wheels",
        variantTitle: "18x8 Grey Painted (6RA91UDCAA)",
        diameter: "18 inch",
        width: "8J",
        color: "Grey",
        partNumber: "6RA91UDCAA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "stelvio-19-charcoal-machined",
    businessId: "alfa-romeo-stelvio-19-inch-5-split-spoke-charcoal-machined-wheels",
    title: "Alfa Romeo Stelvio 19-Inch 5 Split-Spoke Charcoal Machined Wheels",
    vehicleKey: "stelvio",
    styleNumber: "ALY58172",
    notes: "Regrouped from verified 19-inch Stelvio charcoal-machined workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58172-stelvio-charcoal-machined-6me43udaaa-wheels",
        variantTitle: "19x8 Charcoal Machined (6ME43UDAAA)",
        diameter: "19 inch",
        width: "8J",
        color: "Charcoal",
        partNumber: "6ME43UDAAA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "stelvio-19-silver-painted",
    businessId: "alfa-romeo-stelvio-19-inch-10-spoke-silver-painted-wheels",
    title: "Alfa Romeo Stelvio 19-Inch 10-Spoke Silver Painted Wheels",
    vehicleKey: "stelvio",
    styleNumber: "ALY58173",
    notes: "Regrouped from verified 19-inch Stelvio silver-painted workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58173-stelvio-silver-painted-6me42ld9aa-wheels",
        variantTitle: "19x8 Silver Painted (6ME42LD9AA)",
        diameter: "19 inch",
        width: "8J",
        color: "Silver",
        partNumber: "6ME42LD9AA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "stelvio-20-five-y",
    businessId: "alfa-romeo-stelvio-20-inch-5-y-spoke-wheels",
    title: "Alfa Romeo Stelvio 20-Inch 5 Y-Spoke Wheels",
    vehicleKey: "stelvio",
    styleNumber: "ALY58174",
    notes: "Regrouped from verified 20-inch Stelvio workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-aly58174u20-58188-stelvio-silver-painted-6me44udbaa-wheels",
        variantTitle: "20x8.5 Silver Painted (6ME44UDBAA)",
        diameter: "20 inch",
        width: "8.5J",
        color: "Silver",
        partNumber: "6ME44UDBAA",
        boltPattern: "5x110",
      },
      {
        oldId: "alfa-romeo-aly58174u77-58188-stelvio-hyper-silver-6me44udbaa-wheels",
        variantTitle: "20x8.5 Hyper Silver (6ME44UDBAA)",
        diameter: "20 inch",
        width: "8.5J",
        color: "Hyper silver",
        partNumber: "6ME44UDBAA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "stelvio-20-black-machined",
    businessId: "alfa-romeo-stelvio-20-inch-5-split-spoke-black-machined-wheels",
    title: "Alfa Romeo Stelvio 20-Inch 5 Split-Spoke Black Machined Wheels",
    vehicleKey: "stelvio",
    styleNumber: "ALYAL062",
    notes: "Regrouped from verified 20-inch Stelvio black-machined workshop rows.",
    boltPattern: "5x110",
    existingMembers: [
      {
        oldId: "alfa-romeo-alyal062-stelvio-black-machined-6yk43u00aa-wheels",
        variantTitle: "20x8.5 Black Machined (6YK43U00AA)",
        diameter: "20 inch",
        width: "8.5J",
        color: "Black",
        partNumber: "6YK43U00AA",
        boltPattern: "5x110",
      },
    ],
  },
  {
    key: "tonale-18-diamond-cut",
    businessId: "alfa-romeo-tonale-18-inch-black-diamond-cut-wheels",
    title: "Alfa Romeo Tonale 18-Inch Black Diamond Cut Wheels",
    vehicleKey: "tonale",
    styleNumber: "50569059/50569060",
    notes:
      "Added from official Tonale pricing / product-guide material and targeted OEM wheel listings for part numbers 50569059 and 50569060.",
    boltPattern: "5x110",
    centerBore: "65.1mm",
    newVariants: [
      {
        slug: "alfa-romeo-tonale-18-inch-black-diamond-cut-wheels-50569059-50569060",
        variantTitle: "18x7.5 Black Diamond Cut (50569059 / 50569060)",
        diameter: "18 inch",
        width: "7.5J",
        offset: "ET37",
        boltPattern: "5x110",
        centerBore: "65.1mm",
        color: "Black diamond cut",
        partNumber: "50569059, 50569060",
        notes:
          "Verified from official Tonale material and OEM parts listings describing 18x7.5J ET37 5x110 Tonale wheels.",
      },
    ],
  },
  {
    key: "tonale-19-five-hole",
    businessId: "alfa-romeo-tonale-19-inch-veloce-five-hole-wheels",
    title: "Alfa Romeo Tonale 19-Inch Veloce Five-Hole Wheels",
    vehicleKey: "tonale",
    styleNumber: "50569176",
    notes:
      "Added from official Tonale Veloce / Tributo Italiano sizing and targeted OEM listing for part number 50569176.",
    boltPattern: "5x110",
    centerBore: "65.1mm",
    newVariants: [
      {
        slug: "alfa-romeo-tonale-19-inch-veloce-five-hole-wheels-50569176",
        variantTitle: "19x8 Veloce Five-Hole (50569176)",
        diameter: "19 inch",
        width: "8J",
        offset: "ET37",
        boltPattern: "5x110",
        centerBore: "65.1mm",
        color: "Dark finish / diamond cut",
        partNumber: "50569176",
        notes: "Verified from OEM listing describing 19x8J ET37 5x110 65.1 Tonale wheel.",
      },
    ],
  },
  {
    key: "tonale-20-black-alloy",
    businessId: "alfa-romeo-tonale-20-inch-black-alloy-wheels",
    title: "Alfa Romeo Tonale 20-Inch Black Alloy Wheels",
    vehicleKey: "tonale",
    styleNumber: "50290618",
    notes:
      "Added from official Tonale 20-inch sizing references and targeted OEM listing for part number 50290618.",
    boltPattern: "5x110",
    centerBore: "65.1mm",
    newVariants: [
      {
        slug: "alfa-romeo-tonale-20-inch-black-alloy-wheels-50290618",
        variantTitle: "20-Inch Black Alloy (50290618)",
        diameter: "20 inch",
        width: "8J",
        offset: "ET37",
        boltPattern: "5x110",
        centerBore: "65.1mm",
        color: "Black",
        partNumber: "50290618",
        notes:
          "Verified from targeted OEM listing and official Tonale Intensa / Sport Speciale 20-inch wheel references.",
      },
    ],
  },
];

async function getOrCreateByIndex(
  ctx: any,
  table: string,
  indexName: string,
  field: string,
  value: string
) {
  const existing = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(field, value))
    .first();
  if (existing) return existing._id;
  return await ctx.db.insert(table, { [field]: value });
}

async function ensureJunctionRow(
  ctx: any,
  table: string,
  indexName: string,
  fieldA: string,
  valueA: any,
  fieldB: string,
  valueB: any,
  row: Record<string, unknown>
) {
  const existing = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(fieldA, valueA).eq(fieldB, valueB))
    .first();
  if (existing) return existing._id;
  return await ctx.db.insert(table, row);
}

async function moveIndexedRows(
  ctx: any,
  table: string,
  indexName: string,
  foreignField: string,
  fromId: any,
  toId: any,
  signatureKeys: string[],
  patch: Record<string, unknown> = {},
  dryRun = false
) {
  const sourceRows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, fromId))
    .collect();
  const targetRows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, toId))
    .collect();
  const targetSignatures = new Set(
    targetRows.map((row: any) => JSON.stringify(signatureKeys.map((key) => row[key] ?? null)))
  );

  let moved = 0;
  let deleted = 0;
  for (const row of sourceRows) {
    const signature = JSON.stringify(signatureKeys.map((key) => row[key] ?? null));
    if (targetSignatures.has(signature)) {
      if (!dryRun) await ctx.db.delete(row._id);
      deleted += 1;
      continue;
    }
    if (!dryRun) {
      await ctx.db.patch(row._id, {
        [foreignField]: toId,
        ...patch,
      });
    }
    targetSignatures.add(signature);
    moved += 1;
  }

  return { moved, deleted };
}

async function moveSavedRows(
  ctx: any,
  table: string,
  indexName: string,
  foreignField: string,
  fromId: any,
  toId: any,
  dryRun = false
) {
  const sourceRows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, fromId))
    .collect();
  const targetRows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, toId))
    .collect();
  const targetUsers = new Set(targetRows.map((row: any) => row.user_id));

  let moved = 0;
  let deleted = 0;
  for (const row of sourceRows) {
    if (targetUsers.has(row.user_id)) {
      if (!dryRun) await ctx.db.delete(row._id);
      deleted += 1;
      continue;
    }
    if (!dryRun) await ctx.db.patch(row._id, { [foreignField]: toId });
    targetUsers.add(row.user_id);
    moved += 1;
  }

  return { moved, deleted };
}

async function moveCommentRows(
  ctx: any,
  table: string,
  indexName: string,
  foreignField: string,
  fromId: any,
  toId: any,
  dryRun = false
) {
  const rows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(foreignField, fromId))
    .collect();
  if (!dryRun) {
    const now = new Date().toISOString();
    for (const row of rows) {
      await ctx.db.patch(row._id, { [foreignField]: toId, updated_at: now });
    }
  }
  return rows.length;
}

async function moveRegisteredVehicleWheels(
  ctx: any,
  fromWheelId: Id<"oem_wheels">,
  toWheelId: Id<"oem_wheels">,
  canonicalTitle: string,
  dryRun = false
) {
  const sourceRows = await ctx.db
    .query("j_registered_vehicle_wheel")
    .withIndex("by_wheel", (q: any) => q.eq("wheel_id", fromWheelId))
    .collect();
  const targetRows = await ctx.db
    .query("j_registered_vehicle_wheel")
    .withIndex("by_wheel", (q: any) => q.eq("wheel_id", toWheelId))
    .collect();
  const targetVehicleIds = new Set(targetRows.map((row: any) => row.registered_vehicle_id));

  let moved = 0;
  let deleted = 0;
  for (const row of sourceRows) {
    if (targetVehicleIds.has(row.registered_vehicle_id)) {
      if (!dryRun) await ctx.db.delete(row._id);
      deleted += 1;
      continue;
    }
    if (!dryRun) {
      await ctx.db.patch(row._id, {
        wheel_id: toWheelId,
        wheel_title: canonicalTitle,
      });
    }
    targetVehicleIds.add(row.registered_vehicle_id);
    moved += 1;
  }
  return { moved, deleted };
}

async function deleteRowsByIndex(
  ctx: any,
  table: string,
  indexName: string,
  field: string,
  value: any,
  dryRun = false
) {
  const rows = await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(field, value))
    .collect();
  if (!dryRun) {
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  }
  return rows.length;
}

async function ensureVehicleBrandLink(
  ctx: any,
  vehicleId: Id<"oem_vehicles">,
  brandId: Id<"oem_brands">,
  brandTitle: string,
  vehicleTitle: string,
  dryRun = false
) {
  const existing = await ctx.db
    .query("j_vehicle_brand")
    .withIndex("by_vehicle_brand", (q: any) => q.eq("vehicle_id", vehicleId).eq("brand_id", brandId))
    .first();
  if (existing || dryRun) return;
  await ctx.db.insert("j_vehicle_brand", {
    vehicle_id: vehicleId,
    brand_id: brandId,
    vehicle_title: vehicleTitle,
    brand_title: brandTitle,
  });
}

async function ensureWheelBrandLink(
  ctx: any,
  wheelId: Id<"oem_wheels">,
  brandId: Id<"oem_brands">,
  brandTitle: string,
  wheelTitle: string,
  dryRun = false
) {
  const existing = await ctx.db
    .query("j_wheel_brand")
    .withIndex("by_wheel_brand", (q: any) => q.eq("wheel_id", wheelId).eq("brand_id", brandId))
    .first();
  if (existing || dryRun) return;
  await ctx.db.insert("j_wheel_brand", {
    wheel_id: wheelId,
    brand_id: brandId,
    wheel_title: wheelTitle,
    brand_title: brandTitle,
  });
}

async function mergeWheelIntoCanonical(
  ctx: any,
  canonical: WheelDoc,
  duplicate: WheelDoc,
  dryRun = false
) {
  const canonicalTitle = String(canonical.wheel_title ?? duplicate.wheel_title ?? "").trim();
  await moveIndexedRows(
    ctx,
    "j_wheel_brand",
    "by_wheel",
    "wheel_id",
    duplicate._id,
    canonical._id,
    ["brand_id"],
    { wheel_title: canonicalTitle },
    dryRun
  );
  await moveSavedRows(ctx, "saved_wheels", "by_wheel", "wheel_id", duplicate._id, canonical._id, dryRun);
  await moveCommentRows(ctx, "wheel_comments", "by_wheel", "wheel_id", duplicate._id, canonical._id, dryRun);
  await moveRegisteredVehicleWheels(ctx, duplicate._id, canonical._id, canonicalTitle, dryRun);
  if (!dryRun) {
    await ctx.db.delete(duplicate._id);
  }
}

async function mergeVehicleIntoCanonical(
  ctx: any,
  canonical: VehicleDoc,
  duplicate: VehicleDoc,
  dryRun = false
) {
  const canonicalTitle = String(canonical.vehicle_title ?? canonical.model_name ?? duplicate.vehicle_title ?? "").trim();
  await moveIndexedRows(
    ctx,
    "j_vehicle_brand",
    "by_vehicle",
    "vehicle_id",
    duplicate._id,
    canonical._id,
    ["brand_id"],
    { vehicle_title: canonicalTitle },
    dryRun
  );
  await moveSavedRows(ctx, "saved_vehicles", "by_vehicle", "vehicle_id", duplicate._id, canonical._id, dryRun);
  await moveCommentRows(ctx, "vehicle_comments", "by_vehicle", "vehicle_id", duplicate._id, canonical._id, dryRun);
  if (!dryRun) {
    await ctx.db.delete(duplicate._id);
  }
}

async function createWheelVariant(
  ctx: any,
  wheelId: Id<"oem_wheels">,
  wheelTitle: string,
  seed: ExistingWheelVariantSeed | NewWheelVariantSeed,
  dryRun = false
) {
  if (dryRun) {
    return `dry-${clean("oldId" in seed ? seed.oldId : seed.slug)}` as unknown as Id<"oem_wheel_variants">;
  }

  const slug = "oldId" in seed ? seed.oldId : seed.slug;
  const variantId = await ctx.db.insert("oem_wheel_variants", {
    wheel_id: wheelId,
    slug,
    variant_title: seed.variantTitle,
    wheel_title: wheelTitle,
    part_numbers: clean(seed.partNumber),
    notes: clean(seed.notes),
    good_pic_url: clean(seed.imageUrl),
    bad_pic_url: clean(seed.imageUrl),
    year_from: seed.yearFrom,
    year_to: seed.yearTo,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const diameter = clean(seed.diameter);
  const width = clean(seed.width);
  const offset = clean(seed.offset);
  const boltPattern = clean(seed.boltPattern);
  const centerBore = clean(seed.centerBore);
  const color = clean(seed.color);
  const partNumber = clean(seed.partNumber);

  if (diameter) {
    const diameterId = await getOrCreateByIndex(ctx, "oem_diameters", "by_diameter", "diameter", diameter);
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_diameter",
      "by_oem_wheel_variant_diameter",
      "variant_id",
      variantId,
      "diameter_id",
      diameterId,
      { variant_id: variantId, diameter_id: diameterId, variant_title: seed.variantTitle, diameter }
    );
    await ensureJunctionRow(
      ctx,
      "j_wheel_diameter",
      "by_wheel_diameter",
      "wheel_id",
      wheelId,
      "diameter_id",
      diameterId,
      { wheel_id: wheelId, diameter_id: diameterId, wheel_title: wheelTitle, diameter }
    );
  }

  if (width) {
    const widthId = await getOrCreateByIndex(ctx, "oem_widths", "by_width", "width", width);
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_width",
      "by_oem_wheel_variant_width",
      "variant_id",
      variantId,
      "width_id",
      widthId,
      { variant_id: variantId, width_id: widthId, variant_title: seed.variantTitle, width }
    );
    await ensureJunctionRow(
      ctx,
      "j_wheel_width",
      "by_wheel_width",
      "wheel_id",
      wheelId,
      "width_id",
      widthId,
      { wheel_id: wheelId, width_id: widthId, wheel_title: wheelTitle, width }
    );
  }

  if (offset) {
    const offsetId = await getOrCreateByIndex(ctx, "oem_offsets", "by_offset", "offset", offset);
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_offset",
      "by_oem_wheel_variant_offset",
      "variant_id",
      variantId,
      "offset_id",
      offsetId,
      { variant_id: variantId, offset_id: offsetId, variant_title: seed.variantTitle, offset }
    );
    await ensureJunctionRow(
      ctx,
      "j_wheel_offset",
      "by_wheel_offset",
      "wheel_id",
      wheelId,
      "offset_id",
      offsetId,
      { wheel_id: wheelId, offset_id: offsetId, wheel_title: wheelTitle, offset }
    );
  }

  if (boltPattern) {
    const boltPatternId = await getOrCreateByIndex(
      ctx,
      "oem_bolt_patterns",
      "by_bolt_pattern",
      "bolt_pattern",
      boltPattern
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_bolt_pattern",
      "by_oem_wheel_variant_bolt_pattern",
      "variant_id",
      variantId,
      "bolt_pattern_id",
      boltPatternId,
      { variant_id: variantId, bolt_pattern_id: boltPatternId, variant_title: seed.variantTitle, bolt_pattern: boltPattern }
    );
    await ensureJunctionRow(
      ctx,
      "j_wheel_bolt_pattern",
      "by_wheel_bolt_pattern",
      "wheel_id",
      wheelId,
      "bolt_pattern_id",
      boltPatternId,
      { wheel_id: wheelId, bolt_pattern_id: boltPatternId, wheel_title: wheelTitle, bolt_pattern: boltPattern }
    );
  }

  if (centerBore) {
    const centerBoreId = await getOrCreateByIndex(
      ctx,
      "oem_center_bores",
      "by_center_bore",
      "center_bore",
      centerBore
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_center_bore",
      "by_oem_wheel_variant_center_bore",
      "variant_id",
      variantId,
      "center_bore_id",
      centerBoreId,
      { variant_id: variantId, center_bore_id: centerBoreId, variant_title: seed.variantTitle, center_bore: centerBore }
    );
    await ensureJunctionRow(
      ctx,
      "j_wheel_center_bore",
      "by_wheel_center_bore",
      "wheel_id",
      wheelId,
      "center_bore_id",
      centerBoreId,
      { wheel_id: wheelId, center_bore_id: centerBoreId, wheel_title: wheelTitle, center_bore: centerBore }
    );
  }

  if (color) {
    const colorId = await getOrCreateByIndex(ctx, "oem_colors", "by_color", "color", color);
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_color",
      "by_oem_wheel_variant_color",
      "variant_id",
      variantId,
      "color_id",
      colorId,
      { variant_id: variantId, color_id: colorId, variant_title: seed.variantTitle, color }
    );
    await ensureJunctionRow(
      ctx,
      "j_wheel_color",
      "by_wheel_color",
      "wheel_id",
      wheelId,
      "color_id",
      colorId,
      { wheel_id: wheelId, color_id: colorId, wheel_title: wheelTitle, color }
    );
  }

  if (partNumber) {
    const partNumberId = await getOrCreateByIndex(
      ctx,
      "oem_part_numbers",
      "by_part_number",
      "part_number",
      partNumber
    );
    await ensureJunctionRow(
      ctx,
      "j_oem_wheel_variant_part_number",
      "by_oem_wheel_variant_part_number",
      "variant_id",
      variantId,
      "part_number_id",
      partNumberId,
      { variant_id: variantId, part_number_id: partNumberId, variant_title: seed.variantTitle, part_number: partNumber }
    );
    await ensureJunctionRow(
      ctx,
      "j_wheel_part_number",
      "by_wheel_part_number",
      "wheel_id",
      wheelId,
      "part_number_id",
      partNumberId,
      { wheel_id: wheelId, part_number_id: partNumberId, wheel_title: wheelTitle, part_number: partNumber }
    );
  }

  return variantId;
}

export const rebuildAlfaRomeoNavigation = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;
    const now = new Date().toISOString();

    const brand = await ctx.db
      .query("oem_brands")
      .withIndex("by_brand_title", (q: any) => q.eq("brand_title", "Alfa Romeo"))
      .first();
    if (!brand) {
      throw new Error("Alfa Romeo brand not found.");
    }

    const brandId = brand._id as Id<"oem_brands">;
    const brandTitle = brand.brand_title ?? "Alfa Romeo";

    const [allVehicles, allWheels] = await Promise.all([
      ctx.db.query("oem_vehicles").collect(),
      ctx.db.query("oem_wheels").collect(),
    ]);

    const alfaVehicles = allVehicles.filter((vehicle) => vehicle.brand_id === brandId);
    const alfaWheels = allWheels.filter((wheel) => wheel.brand_id === brandId);

    const vehicleByBusinessId = new Map(
      alfaVehicles.map((vehicle) => [String(vehicle.id ?? vehicle.slug ?? ""), vehicle])
    );
    const wheelByBusinessId = new Map(
      alfaWheels.map((wheel) => [String(wheel.id ?? wheel.slug ?? ""), wheel])
    );

    const alfaWheelIds = alfaWheels.map((wheel) => wheel._id as Id<"oem_wheels">);
    const alfaVehicleIds = alfaVehicles.map((vehicle) => vehicle._id as Id<"oem_vehicles">);

    const existingWheelVariantRows = (
      await Promise.all(
        alfaWheelIds.map((wheelId) =>
          ctx.db.query("oem_wheel_variants").withIndex("by_wheel_id", (q: any) => q.eq("wheel_id", wheelId)).collect()
        )
      )
    ).flat();
    const existingWheelVariantIds = existingWheelVariantRows.map((row) => row._id as Id<"oem_wheel_variants">);

    const existingVehicleVariantRows = (
      await Promise.all(
        alfaVehicleIds.map((vehicleId) =>
          ctx.db
            .query("oem_vehicle_variants")
            .withIndex("by_vehicle_id", (q: any) => q.eq("vehicle_id", vehicleId))
            .collect()
        )
      )
    ).flat();
    const existingVehicleVariantIds = existingVehicleVariantRows.map((row) => row._id as Id<"oem_vehicle_variants">);

    const summary = {
      deletedWheelVariants: existingWheelVariantIds.length,
      deletedVehicleVariants: existingVehicleVariantIds.length,
      mergedWheelRows: 0,
      deletedAllVehicles: 0,
      insertedVehicles: 0,
      patchedVehicles: 0,
      resultingWheelFamilies: WHEEL_FAMILIES.length,
      resultingWheelVariants:
        WHEEL_FAMILIES.reduce(
          (sum, family) => sum + (family.existingMembers?.length ?? 0) + (family.newVariants?.length ?? 0),
          0
        ),
      resultingVehicleVariants: VEHICLES.reduce((sum, vehicle) => sum + vehicle.variants.length, 0),
      wheelVehicleLinks: 0,
      vehicleVariantWheelVariantLinks: 0,
    };

    if (!dryRun) {
      for (const wheelVariantId of existingWheelVariantIds) {
        await deleteRowsByIndex(ctx, "j_oem_vehicle_variant_wheel_variant", "by_oem_wheel_variant", "wheel_variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_market", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_bolt_pattern", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_center_bore", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_diameter", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_width", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_offset", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_color", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_tire_size", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_part_number", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_material", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_finish_type", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(ctx, "j_oem_wheel_variant_design_style", "by_oem_wheel_variant", "variant_id", wheelVariantId);
        await deleteRowsByIndex(
          ctx,
          "j_registered_vehicle_wheel_variant",
          "by_oem_wheel_variant",
          "wheel_variant_id",
          wheelVariantId
        );
        await ctx.db.delete(wheelVariantId);
      }

      for (const wheelId of alfaWheelIds) {
        await deleteRowsByIndex(ctx, "j_wheel_vehicle", "by_wheel", "wheel_id", wheelId);
        await deleteRowsByIndex(ctx, "j_wheel_bolt_pattern", "by_wheel", "wheel_id", wheelId);
        await deleteRowsByIndex(ctx, "j_wheel_center_bore", "by_wheel", "wheel_id", wheelId);
        await deleteRowsByIndex(ctx, "j_wheel_diameter", "by_wheel", "wheel_id", wheelId);
        await deleteRowsByIndex(ctx, "j_wheel_width", "by_wheel", "wheel_id", wheelId);
        await deleteRowsByIndex(ctx, "j_wheel_offset", "by_wheel", "wheel_id", wheelId);
        await deleteRowsByIndex(ctx, "j_wheel_color", "by_wheel", "wheel_id", wheelId);
        await deleteRowsByIndex(ctx, "j_wheel_tire_size", "by_wheel", "wheel_id", wheelId);
        await deleteRowsByIndex(ctx, "j_wheel_part_number", "by_wheel", "wheel_id", wheelId);
      }

      for (const vehicleVariantId of existingVehicleVariantIds) {
        await deleteRowsByIndex(
          ctx,
          "j_oem_vehicle_variant_wheel_variant",
          "by_oem_vehicle_variant",
          "vehicle_variant_id",
          vehicleVariantId
        );
        await deleteRowsByIndex(ctx, "j_oem_vehicle_variant_bolt_pattern", "by_oem_vehicle_variant", "variant_id", vehicleVariantId);
        await deleteRowsByIndex(ctx, "j_oem_vehicle_variant_center_bore", "by_oem_vehicle_variant", "variant_id", vehicleVariantId);
        await deleteRowsByIndex(ctx, "j_oem_vehicle_variant_diameter", "by_oem_vehicle_variant", "variant_id", vehicleVariantId);
        await deleteRowsByIndex(ctx, "j_oem_vehicle_variant_width", "by_oem_vehicle_variant", "variant_id", vehicleVariantId);
        await deleteRowsByIndex(ctx, "j_oem_vehicle_variant_offset", "by_oem_vehicle_variant", "variant_id", vehicleVariantId);
        await deleteRowsByIndex(ctx, "j_oem_vehicle_variant_tire_size", "by_oem_vehicle_variant", "variant_id", vehicleVariantId);
        await deleteRowsByIndex(ctx, "j_oem_vehicle_variant_part_number", "by_oem_vehicle_variant", "variant_id", vehicleVariantId);
        await ctx.db.delete(vehicleVariantId);
      }
    }

    const familyWheelIdByKey = new Map<string, Id<"oem_wheels">>();

    for (const family of WHEEL_FAMILIES) {
      let canonical: WheelDoc | null = null;
      const memberRows = (family.existingMembers ?? [])
        .map((member) => wheelByBusinessId.get(member.oldId))
        .filter((wheel): wheel is WheelDoc => Boolean(wheel));

      if (memberRows.length > 0) {
        canonical = memberRows[0];
        for (const duplicate of memberRows.slice(1)) {
          await mergeWheelIntoCanonical(ctx, canonical, duplicate, dryRun);
          if (!dryRun) {
            summary.mergedWheelRows += 1;
            wheelByBusinessId.delete(String(duplicate.id ?? duplicate.slug ?? ""));
          }
        }
      } else if (!dryRun) {
        const wheelId = await ctx.db.insert("oem_wheels", {
          id: family.businessId,
          slug: family.businessId,
          wheel_title: family.title,
          brand_id: brandId,
          jnc_brands: brandTitle,
          text_brands: brandTitle,
          created_at: now,
          updated_at: now,
        });
        canonical = (await ctx.db.get(wheelId)) as WheelDoc;
        summary.insertedVehicles += 0;
      }

      if (!canonical) {
        continue;
      }

      const widths = dedupe([
        ...(family.existingMembers ?? []).map((member) => member.width),
        ...(family.newVariants ?? []).map((variant) => variant.width),
      ]);
      const diameters = dedupe([
        ...(family.existingMembers ?? []).map((member) => member.diameter),
        ...(family.newVariants ?? []).map((variant) => variant.diameter),
      ]);
      const colors = dedupe([
        ...(family.existingMembers ?? []).map((member) => member.color),
        ...(family.newVariants ?? []).map((variant) => variant.color),
      ]);
      const offsets = dedupe([
        ...(family.existingMembers ?? []).map((member) => member.offset),
        ...(family.newVariants ?? []).map((variant) => variant.offset),
      ]);
      const partNumbers = dedupe([
        ...(family.existingMembers ?? []).map((member) => member.partNumber),
        ...(family.newVariants ?? []).map((variant) => variant.partNumber),
      ]);
      const sourceImage =
        family.imageUrl ??
        canonical.good_pic_url ??
        memberRows.find((wheel) => clean(wheel.good_pic_url))?.good_pic_url ??
        undefined;

      if (!dryRun) {
        await ctx.db.patch(canonical._id, {
          id: family.businessId,
          slug: family.businessId,
          wheel_title: family.title,
          brand_id: brandId,
          jnc_brands: brandTitle,
          text_brands: brandTitle,
          text_vehicles: VEHICLES.find((vehicle) => vehicle.key === family.vehicleKey)?.title,
          text_widths: joinCsv(widths),
          text_diameters: joinCsv(diameters),
          text_bolt_patterns: family.boltPattern,
          text_center_bores: family.centerBore,
          text_colors: joinCsv(colors),
          text_offsets: joinCsv(offsets),
          part_numbers: joinCsv(partNumbers),
          good_pic_url: sourceImage,
          bad_pic_url: sourceImage,
          image_source: sourceImage ? canonical.image_source ?? "verified source" : canonical.image_source,
          style_number: family.styleNumber,
          notes: family.notes,
          specifications_json: JSON.stringify({
            family_key: family.key,
            source: "alfa_romeo_navigation_rebuild",
            regrouped_from: (family.existingMembers ?? []).map((member) => member.oldId),
            bolt_pattern: family.boltPattern,
            center_bore: family.centerBore,
            variant_count: (family.existingMembers?.length ?? 0) + (family.newVariants?.length ?? 0),
          }),
          updated_at: now,
        });
        await ensureWheelBrandLink(ctx, canonical._id, brandId, brandTitle, family.title);
      }

      familyWheelIdByKey.set(family.key, canonical._id as Id<"oem_wheels">);
    }

    for (const vehicle of alfaVehicles.filter((row) => String(row.id ?? "").endsWith("-all"))) {
      const canonicalBusinessId = String(vehicle.id ?? "").replace(/-all$/, "");
      const canonical = vehicleByBusinessId.get(canonicalBusinessId);
      if (!canonical) continue;
      await mergeVehicleIntoCanonical(ctx, canonical, vehicle, dryRun);
      summary.deletedAllVehicles += 1;
      if (!dryRun) vehicleByBusinessId.delete(String(vehicle.id ?? vehicle.slug ?? ""));
    }

    const resultingVehicleIds = new Map<string, Id<"oem_vehicles">>();
    for (const vehicleSeed of VEHICLES) {
      let vehicle = vehicleByBusinessId.get(vehicleSeed.businessId);
      if (!vehicle && !dryRun) {
        const vehicleId = await ctx.db.insert("oem_vehicles", {
          id: vehicleSeed.businessId,
          slug: vehicleSeed.businessId,
          model_name: vehicleSeed.modelName,
          vehicle_title: vehicleSeed.title,
          brand_id: brandId,
          text_brands: brandTitle,
          body_type: vehicleSeed.bodyType,
          drive_type: vehicleSeed.driveType,
          production_years: vehicleSeed.productionYears,
          year_from: vehicleSeed.yearFrom,
          year_to: vehicleSeed.yearTo,
          text_diameters: vehicleSeed.diameters.join(", "),
          text_widths: vehicleSeed.widths.join(", "),
          text_bolt_patterns: vehicleSeed.boltPattern,
          text_center_bores: vehicleSeed.centerBore,
          special_notes: vehicleSeed.notes,
          created_at: now,
          updated_at: now,
        });
        vehicle = (await ctx.db.get(vehicleId)) as VehicleDoc;
        summary.insertedVehicles += 1;
      }

      if (!vehicle) {
        continue;
      }

      if (!dryRun) {
        await ctx.db.patch(vehicle._id, {
          id: vehicleSeed.businessId,
          slug: vehicleSeed.businessId,
          model_name: vehicleSeed.modelName,
          vehicle_title: vehicleSeed.title,
          brand_id: brandId,
          text_brands: brandTitle,
          body_type: vehicleSeed.bodyType,
          drive_type: vehicleSeed.driveType,
          production_years: vehicleSeed.productionYears,
          year_from: vehicleSeed.yearFrom,
          year_to: vehicleSeed.yearTo,
          text_diameters: vehicleSeed.diameters.join(", "),
          text_widths: vehicleSeed.widths.join(", "),
          text_bolt_patterns: vehicleSeed.boltPattern,
          text_center_bores: vehicleSeed.centerBore,
          special_notes: vehicleSeed.notes,
          updated_at: now,
        });
        await ensureVehicleBrandLink(ctx, vehicle._id as Id<"oem_vehicles">, brandId, brandTitle, vehicleSeed.title);
      }

      resultingVehicleIds.set(vehicleSeed.key, vehicle._id as Id<"oem_vehicles">);
      summary.patchedVehicles += 1;
    }

    const wheelVariantIdsByFamilyKey = new Map<string, Id<"oem_wheel_variants">[]>();
    for (const family of WHEEL_FAMILIES) {
      const wheelId = familyWheelIdByKey.get(family.key);
      if (!wheelId) continue;
      const createdIds: Id<"oem_wheel_variants">[] = [];
      for (const seed of family.existingMembers ?? []) {
        createdIds.push(await createWheelVariant(ctx, wheelId, family.title, seed, dryRun));
      }
      for (const seed of family.newVariants ?? []) {
        createdIds.push(await createWheelVariant(ctx, wheelId, family.title, seed, dryRun));
      }
      wheelVariantIdsByFamilyKey.set(family.key, createdIds);
    }

    const vehicleVariantIdBySlug = new Map<string, Id<"oem_vehicle_variants">>();
    for (const vehicleSeed of VEHICLES) {
      const vehicleId = resultingVehicleIds.get(vehicleSeed.key);
      if (!vehicleId) continue;

      for (const variantSeed of vehicleSeed.variants) {
        let vehicleVariantId: Id<"oem_vehicle_variants">;
        if (dryRun) {
          vehicleVariantId = `dry-${variantSeed.slug}` as unknown as Id<"oem_vehicle_variants">;
        } else {
          vehicleVariantId = await ctx.db.insert("oem_vehicle_variants", {
            vehicle_id: vehicleId,
            slug: variantSeed.slug,
            variant_title: variantSeed.variantTitle,
            trim_level: variantSeed.trimLevel,
            year_from: variantSeed.yearFrom,
            year_to: variantSeed.yearTo,
            notes: variantSeed.notes,
          });
        }
        vehicleVariantIdBySlug.set(variantSeed.slug, vehicleVariantId);
      }
    }

    for (const family of WHEEL_FAMILIES) {
      const wheelId = familyWheelIdByKey.get(family.key);
      const vehicleId = resultingVehicleIds.get(family.vehicleKey);
      if (!wheelId || !vehicleId) continue;
      summary.wheelVehicleLinks += 1;
      if (!dryRun) {
        await ensureJunctionRow(
          ctx,
          "j_wheel_vehicle",
          "by_wheel_vehicle",
          "wheel_id",
          wheelId,
          "vehicle_id",
          vehicleId,
          {
            wheel_id: wheelId,
            vehicle_id: vehicleId,
            wheel_title: family.title,
            vehicle_title: VEHICLES.find((vehicle) => vehicle.key === family.vehicleKey)?.title ?? "",
          }
        );
      }
    }

    for (const vehicleSeed of VEHICLES) {
      for (const variantSeed of vehicleSeed.variants) {
        const vehicleVariantId = vehicleVariantIdBySlug.get(variantSeed.slug);
        if (!vehicleVariantId) continue;
        for (const familyKey of variantSeed.wheelFamilyKeys) {
          const wheelVariantIds = wheelVariantIdsByFamilyKey.get(familyKey) ?? [];
          for (const wheelVariantId of wheelVariantIds) {
            summary.vehicleVariantWheelVariantLinks += 1;
            if (!dryRun) {
              await ensureJunctionRow(
                ctx,
                "j_oem_vehicle_variant_wheel_variant",
                "by_oem_vehicle_variant_wheel_variant",
                "vehicle_variant_id",
                vehicleVariantId,
                "wheel_variant_id",
                wheelVariantId,
                {
                  vehicle_variant_id: vehicleVariantId,
                  wheel_variant_id: wheelVariantId,
                  variant_title: variantSeed.variantTitle,
                  wheel_variant_title: "",
                }
              );
            }
          }
        }
      }
    }

    if (!dryRun) {
      const allVariantLinks = await ctx.db.query("j_oem_vehicle_variant_wheel_variant").collect();
      const wheelVariants = await ctx.db.query("oem_wheel_variants").collect();
      const titleByVariantId = new Map(
        wheelVariants.map((variant) => [String(variant._id), String(variant.variant_title ?? "")])
      );
      for (const link of allVariantLinks) {
        if (!titleByVariantId.has(String(link.wheel_variant_id))) continue;
        await ctx.db.patch(link._id, {
          wheel_variant_title: titleByVariantId.get(String(link.wheel_variant_id)) ?? "",
        });
      }
    }

    return {
      dryRun,
      summary,
    };
  },
});
