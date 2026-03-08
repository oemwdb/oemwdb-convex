#!/usr/bin/env node

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const CONVEX_URL = (process.env.VITE_CONVEX_URL || "").replace(/\/$/, "");

async function convexQuery(path, args = {}) {
  const res = await fetch(`${CONVEX_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.errorMessage || "Convex query failed");
  return json.value;
}

async function convexMutation(path, args = {}) {
  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.errorMessage || "Convex mutation failed");
  return json.value;
}

function isBlank(value) {
  return value === null || value === undefined || (typeof value === "string" && value.trim() === "");
}

function hasBadYears(value) {
  return /bolt pattern|center bore|width|diameter/i.test(String(value ?? ""));
}

function cleanYears(value) {
  if (isBlank(value) || hasBadYears(value)) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function makeHaystack(vehicle) {
  return [
    vehicle.brand_name,
    vehicle.text_brands,
    vehicle.id,
    vehicle.vehicle_title,
    vehicle.model_name,
    vehicle.generation,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function bodyTypeFromTitle(haystack) {
  if (/open-wheel|formula e|i-type/.test(haystack)) return "single-seat open-wheel race car";
  if (/drophead|dawn|roadster|spyder|spider|convertible|cabriolet|cabrio/.test(haystack)) return "convertible / roadster";
  if (/coupe|coupé|wraith|f430|f12|488 gtb|12cilindri|aventador|huracan|revuelto|temerario/.test(haystack)) return "2-door coupe";
  if (/sportbrake|estate|touring|wagon|combi|clubman/.test(haystack)) return "estate / wagon";
  if (/hatch|forfour|fortwo|fabia|scala|rapid|golf/.test(haystack)) return "hatchback";
  if (/countryman|kamiq|karoq|kodiaq|yeti|suv|discovery|range rover|defender|e-pace|f-pace|i-pace|macan|cayenne|cullinan|evoque|velar|x5/.test(haystack)) return "SUV / crossover";
  if (/pullman|sedan|saloon|s-class|e-class|c-class|xe|xf|xj|ghost|phantom|panamera|taycan|octavia|superb/.test(haystack)) return "sedan / saloon";
  return "";
}

function findRule(haystack, rules) {
  return rules.find((rule) => rule.match.test(haystack))?.data ?? {};
}

const JAGUAR_RULES = [
  {
    match: /x152|f-type/,
    data: {
      generation: "X152",
      production_years: "2013-2024",
      body_type: "2-door coupe / convertible",
      platform: "JLR D6a / XK-derived aluminum architecture",
      drive_type: "RWD / AWD",
      segment: "luxury sports car",
      engine_details: "2.0L turbo I4, 3.0L supercharged V6, 5.0L supercharged V8",
      price_range: "Approx. MSRP: $65k-$130k new",
    },
  },
  {
    match: /x200|s-type/,
    data: {
      generation: "X200",
      production_years: "1999-2007",
      body_type: "sedan / saloon",
      platform: "Ford DEW98",
      drive_type: "RWD",
      segment: "mid-size luxury sedan",
      engine_details: "2.5L / 3.0L V6 and 4.0L / 4.2L V8 petrol engines",
      price_range: "Approx. MSRP: $45k-$70k new",
    },
  },
  {
    match: /x400|x-type/,
    data: {
      generation: "X400",
      production_years: "2001-2009",
      body_type: "sedan / estate",
      platform: "Ford CD132",
      drive_type: "FWD / AWD",
      segment: "compact executive car",
      engine_details: "2.0L / 2.2L diesel I4 plus 2.1L / 2.5L / 3.0L V6 petrol engines",
      price_range: "Approx. MSRP: $30k-$45k new",
    },
  },
  {
    match: /x760|\bxe\b/,
    data: {
      generation: "X760",
      production_years: "2015-2024",
      body_type: "compact executive sedan",
      platform: "JLR D7a",
      drive_type: "RWD / AWD",
      segment: "compact luxury sedan",
      engine_details: "2.0L Ingenium I4 and 3.0L supercharged V6 engines",
      price_range: "Approx. MSRP: $35k-$65k new",
    },
  },
  {
    match: /x250|xfr/,
    data: {
      generation: "X250",
      production_years: "2008-2015",
      body_type: "sedan / estate",
      platform: "Ford DEW98",
      drive_type: "RWD",
      segment: "executive luxury sedan",
      engine_details: "2.2L diesel I4, 3.0L V6, 4.2L V8, and 5.0L V8 engines",
      price_range: "Approx. MSRP: $50k-$95k new",
    },
  },
  {
    match: /x260|xf sportbrake/,
    data: {
      generation: "X260",
      production_years: "2015-2024",
      body_type: "sedan / estate",
      platform: "JLR D7a",
      drive_type: "RWD / AWD",
      segment: "executive luxury sedan",
      engine_details: "2.0L Ingenium I4, 3.0L V6 petrol, and 2.0L / 3.0L diesel engines",
      price_range: "Approx. MSRP: $52k-$90k new",
    },
  },
  {
    match: /x300|xj12|xj6|xjr/,
    data: {
      generation: "X300",
      production_years: "1994-1997",
      body_type: "luxury sedan",
      platform: "Jaguar XJ (X300) platform",
      drive_type: "RWD",
      segment: "full-size luxury sedan",
      engine_details: "3.2L / 4.0L inline-6 plus 6.0L V12 on XJ12",
      price_range: "Approx. MSRP: $55k-$95k new",
    },
  },
  {
    match: /x308/,
    data: {
      generation: "X308",
      production_years: "1997-2003",
      body_type: "luxury sedan",
      platform: "Jaguar XJ (X308) platform",
      drive_type: "RWD",
      segment: "full-size luxury sedan",
      engine_details: "3.2L / 4.0L supercharged and naturally aspirated V8 engines",
      price_range: "Approx. MSRP: $60k-$100k new",
    },
  },
  {
    match: /x350/,
    data: {
      generation: "X350",
      production_years: "2003-2009",
      body_type: "luxury sedan",
      platform: "all-aluminium XJ monocoque",
      drive_type: "RWD / AWD",
      segment: "full-size luxury sedan",
      engine_details: "3.0L V6 plus 3.5L / 4.2L V8 engines",
      price_range: "Approx. MSRP: $65k-$115k new",
    },
  },
  {
    match: /x351/,
    data: {
      generation: "X351",
      production_years: "2009-2019",
      body_type: "luxury sedan",
      platform: "Jaguar XJ aluminum architecture",
      drive_type: "RWD / AWD",
      segment: "full-size luxury sedan",
      engine_details: "2.0L I4, 3.0L V6, and 5.0L V8 engines",
      price_range: "Approx. MSRP: $74k-$125k new",
    },
  },
  {
    match: /x100|xk8|xkr/,
    data: {
      generation: "X100",
      production_years: "1996-2006",
      body_type: "2-door coupe / convertible",
      platform: "Jaguar XK grand touring platform",
      drive_type: "RWD",
      segment: "luxury grand tourer",
      engine_details: "4.0L and 4.2L V8 engines, supercharged on XKR",
      price_range: "Approx. MSRP: $70k-$120k new",
    },
  },
  {
    match: /x150/,
    data: {
      generation: "X150",
      production_years: "2006-2014",
      body_type: "2-door coupe / convertible",
      platform: "all-aluminium Jaguar XK platform",
      drive_type: "RWD",
      segment: "luxury grand tourer",
      engine_details: "4.2L and 5.0L V8 engines, including supercharged XKR variants",
      price_range: "Approx. MSRP: $80k-$140k new",
    },
  },
  {
    match: /x540|e-pace/,
    data: {
      generation: "X540",
      production_years: "2017-2025",
      body_type: "compact luxury SUV",
      platform: "JLR D8 / PTA-derived architecture",
      drive_type: "AWD",
      segment: "compact luxury crossover",
      engine_details: "2.0L Ingenium petrol and diesel engines",
      price_range: "Approx. MSRP: $40k-$60k new",
    },
  },
  {
    match: /x761|f-pace/,
    data: {
      generation: "X761",
      production_years: "2016-2025",
      body_type: "midsize luxury SUV",
      platform: "JLR D7a",
      drive_type: "AWD",
      segment: "luxury performance SUV",
      engine_details: "2.0L Ingenium I4, 3.0L inline-6 / V6, and 5.0L supercharged V8 engines",
      price_range: "Approx. MSRP: $52k-$95k new",
    },
  },
  {
    match: /x590|i-pace/,
    data: {
      generation: "X590",
      production_years: "2018-present",
      body_type: "electric luxury SUV",
      platform: "dedicated electric Jaguar architecture",
      drive_type: "AWD",
      segment: "electric luxury crossover",
      engine_details: "dual-motor battery-electric powertrain",
      price_range: "Approx. MSRP: $70k-$110k new",
    },
  },
  {
    match: /xj40/,
    data: {
      generation: "XJ40",
      production_years: "1986-1994",
      body_type: "luxury sedan",
      platform: "Jaguar XJ40 platform",
      drive_type: "RWD",
      segment: "full-size luxury sedan",
      engine_details: "2.9L and 3.2L / 4.0L inline-6 engines",
      price_range: "Approx. MSRP: $50k-$85k new",
    },
  },
  {
    match: /i-type/,
    data: {
      generation: "Gen 1",
      production_years: "2016-2017",
      body_type: "single-seat open-wheel race car",
      platform: "Formula E Gen 1 chassis",
      drive_type: "RWD",
      segment: "Formula E race car",
      engine_details: "single-motor Formula E electric powertrain",
      price_range: "Factory race program",
    },
  },
];

const LAND_ROVER_RULES = [
  { match: /l314|freelander(?! 2)/, data: { generation: "L314", production_years: "1997-2006", body_type: "compact SUV", platform: "Freelander monocoque platform", drive_type: "AWD / 4WD", segment: "compact off-road SUV", engine_details: "1.8L I4, 2.0L diesel, and 2.5L V6 engines", price_range: "Approx. MSRP: $28k-$40k new" } },
  { match: /l316|defender(?!.*l663)/, data: { generation: "L316", production_years: "1983-2016", body_type: "body-on-frame off-road SUV", platform: "Defender ladder-frame chassis", drive_type: "4WD", segment: "utility off-roader", engine_details: "2.5L diesel and 2.2L / 2.4L Puma diesel engines depending on year", price_range: "Approx. MSRP: $30k-$55k new" } },
  { match: /l318.*discovery i|discovery i/, data: { generation: "L318", production_years: "1989-1998", body_type: "full-size SUV", platform: "Discovery ladder-frame chassis", drive_type: "4WD", segment: "off-road SUV", engine_details: "3.5L / 3.9L V8 and 2.5L diesel engines", price_range: "Approx. MSRP: $35k-$50k new" } },
  { match: /l318.*discovery ii|discovery ii/, data: { generation: "L318", production_years: "1998-2004", body_type: "full-size SUV", platform: "Discovery ladder-frame chassis", drive_type: "4WD", segment: "off-road SUV", engine_details: "4.0L V8 and 2.5L Td5 diesel engines", price_range: "Approx. MSRP: $38k-$55k new" } },
  { match: /p38a/, data: { generation: "P38A", production_years: "1994-2002", body_type: "full-size luxury SUV", platform: "Range Rover P38 platform", drive_type: "4WD", segment: "luxury off-road SUV", engine_details: "2.5L diesel and 4.0L / 4.6L V8 engines", price_range: "Approx. MSRP: $55k-$80k new" } },
  { match: /l319.*lr3|l319.*discovery/, data: { generation: "L319", production_years: "2004-2009", body_type: "full-size SUV", platform: "Integrated Body Frame", drive_type: "4WD", segment: "luxury off-road SUV", engine_details: "4.0L V6, 4.4L V8, and 2.7L TDV6 engines", price_range: "Approx. MSRP: $45k-$65k new" } },
  { match: /l319.*lr4/, data: { generation: "L319", production_years: "2009-2016", body_type: "full-size SUV", platform: "Integrated Body Frame", drive_type: "4WD", segment: "luxury off-road SUV", engine_details: "5.0L V8 and 3.0L supercharged V6 engines", price_range: "Approx. MSRP: $50k-$70k new" } },
  { match: /l320/, data: { generation: "L320", production_years: "2005-2013", body_type: "midsize luxury SUV", platform: "Discovery 3-derived Integrated Body Frame", drive_type: "4WD", segment: "luxury performance SUV", engine_details: "3.6L TDV8, 5.0L V8, and supercharged V8 engines", price_range: "Approx. MSRP: $60k-$95k new" } },
  { match: /l322/, data: { generation: "L322", production_years: "2001-2012", body_type: "full-size luxury SUV", platform: "Range Rover L322 architecture", drive_type: "4WD", segment: "flagship luxury SUV", engine_details: "3.0L diesel, 4.4L V8, 4.2L supercharged V8, and 5.0L V8 engines", price_range: "Approx. MSRP: $75k-$130k new" } },
  { match: /l359|freelander 2/, data: { generation: "L359", production_years: "2006-2014", body_type: "compact SUV", platform: "EUCD-derived Freelander 2 platform", drive_type: "AWD", segment: "compact luxury SUV", engine_details: "2.2L diesel I4 and 3.2L inline-6 petrol engines", price_range: "Approx. MSRP: $35k-$48k new" } },
  { match: /l405/, data: { generation: "L405", production_years: "2012-2021", body_type: "full-size luxury SUV", platform: "all-aluminium Range Rover architecture", drive_type: "4WD", segment: "flagship luxury SUV", engine_details: "3.0L V6, 3.0L I6, 5.0L V8, and diesel / PHEV variants", price_range: "Approx. MSRP: $84k-$210k new" } },
  { match: /l460/, data: { generation: "L460", production_years: "2022-present", body_type: "full-size luxury SUV", platform: "MLA-Flex", drive_type: "4WD", segment: "flagship luxury SUV", engine_details: "3.0L inline-6, 4.4L twin-turbo V8, and PHEV powertrains", price_range: "Approx. MSRP: $107k-$250k new" } },
  { match: /l461/, data: { generation: "L461", production_years: "2022-present", body_type: "midsize luxury SUV", platform: "MLA-Flex", drive_type: "4WD", segment: "luxury performance SUV", engine_details: "3.0L inline-6 and 4.4L twin-turbo V8 powertrains", price_range: "Approx. MSRP: $84k-$180k new" } },
  { match: /l462/, data: { generation: "L462", production_years: "2017-present", body_type: "full-size SUV", platform: "D7u", drive_type: "4WD", segment: "luxury family SUV", engine_details: "2.0L I4, 3.0L V6, and 3.0L diesel / mild-hybrid powertrains", price_range: "Approx. MSRP: $60k-$85k new" } },
  { match: /l494/, data: { generation: "L494", production_years: "2013-2022", body_type: "midsize luxury SUV", platform: "D7u / aluminium architecture", drive_type: "4WD", segment: "luxury performance SUV", engine_details: "3.0L V6, 5.0L V8, diesel, and PHEV powertrains", price_range: "Approx. MSRP: $66k-$130k new" } },
  { match: /l538/, data: { generation: "L538", production_years: "2011-2018", body_type: "compact luxury SUV", platform: "Ford EUCD", drive_type: "AWD / FWD", segment: "premium compact SUV", engine_details: "2.0L turbo petrol and 2.2L diesel engines", price_range: "Approx. MSRP: $42k-$60k new" } },
  { match: /l550/, data: { generation: "L550", production_years: "2014-present", body_type: "compact luxury SUV", platform: "JLR D8", drive_type: "AWD", segment: "premium family SUV", engine_details: "2.0L Ingenium petrol and diesel engines", price_range: "Approx. MSRP: $43k-$60k new" } },
  { match: /l551/, data: { generation: "L551", production_years: "2018-present", body_type: "compact luxury SUV", platform: "JLR PTA", drive_type: "AWD", segment: "premium compact SUV", engine_details: "2.0L Ingenium petrol, diesel, and mild-hybrid powertrains", price_range: "Approx. MSRP: $50k-$70k new" } },
  { match: /l560/, data: { generation: "L560", production_years: "2017-present", body_type: "midsize luxury SUV", platform: "JLR D7a", drive_type: "AWD", segment: "luxury SUV", engine_details: "2.0L Ingenium I4, 3.0L V6 / I6, and 5.0L V8 engines", price_range: "Approx. MSRP: $61k-$110k new" } },
  { match: /l663/, data: { generation: "L663", production_years: "2019-present", body_type: "modern off-road SUV", platform: "D7x", drive_type: "4WD", segment: "premium off-roader", engine_details: "2.0L I4, 3.0L I6, 5.0L V8, and PHEV powertrains", price_range: "Approx. MSRP: $56k-$120k new" } },
];

const MINI_RULES = [
  { match: /r50\/r52\/r53|r50|r52|r53/, data: { generation: "R50 / R52 / R53", production_years: "2001-2008", body_type: "3-door hatchback / convertible", platform: "first-generation BMW MINI platform", drive_type: "FWD", segment: "premium subcompact car", engine_details: "1.4L and 1.6L inline-4 engines; supercharged on Cooper S (R53)", price_range: "Approx. MSRP: $18k-$30k new" } },
  { match: /r55.*clubman|clubman.*r55/, data: { generation: "R55", production_years: "2007-2014", body_type: "estate / wagon", platform: "second-generation MINI platform", drive_type: "FWD", segment: "premium compact wagon", engine_details: "1.6L petrol and diesel engines, including turbocharged Cooper S variants", price_range: "Approx. MSRP: $24k-$35k new" } },
  { match: /r58|r59|coupe\/roadster|mini coupe|mini roadster/, data: { generation: "R58 / R59", production_years: "2011-2015", body_type: "2-door coupe / roadster", platform: "second-generation MINI platform", drive_type: "FWD", segment: "premium small sports car", engine_details: "1.6L petrol engines, including turbocharged Cooper S and JCW variants", price_range: "Approx. MSRP: $26k-$40k new" } },
  { match: /r60.*countryman|countryman.*r60/, data: { generation: "R60", production_years: "2010-2016", body_type: "subcompact crossover", platform: "second-generation MINI crossover platform", drive_type: "FWD / AWD", segment: "premium small SUV", engine_details: "1.6L petrol and diesel engines, including Cooper S and JCW trims", price_range: "Approx. MSRP: $24k-$38k new" } },
  { match: /f54.*clubman|clubman.*f54/, data: { generation: "F54", production_years: "2015-2024", body_type: "estate / wagon", platform: "BMW UKL2", drive_type: "FWD / AWD", segment: "premium compact wagon", engine_details: "1.5L and 2.0L turbo petrol / diesel engines", price_range: "Approx. MSRP: $30k-$48k new" } },
  { match: /f60.*countryman|countryman.*f60/, data: { generation: "F60", production_years: "2017-2024", body_type: "subcompact crossover", platform: "BMW UKL2", drive_type: "FWD / AWD", segment: "premium small SUV", engine_details: "1.5L and 2.0L turbo engines plus PHEV variants", price_range: "Approx. MSRP: $31k-$50k new" } },
  { match: /u25.*countryman|countryman.*u25/, data: { generation: "U25", production_years: "2024-present", body_type: "compact crossover", platform: "BMW FAAR", drive_type: "FWD / AWD", segment: "premium compact SUV", engine_details: "1.5L / 2.0L turbo petrol engines plus all-electric Countryman EV variants", price_range: "Approx. MSRP: $39k-$58k new" } },
  { match: /j05|aceman/, data: { generation: "J05", production_years: "2024-present", body_type: "electric crossover", platform: "Spotlight EV", drive_type: "FWD", segment: "premium electric subcompact SUV", engine_details: "single-motor and higher-output battery-electric powertrains", price_range: "Approx. MSRP: $35k-$45k new" } },
  { match: /f65\/f66\/f67|f66|mini hatchback/, data: { generation: "F65 / F66 / F67", production_years: "2024-present", body_type: "3-door / 5-door hatchback / convertible", platform: "updated BMW UKL architecture", drive_type: "FWD", segment: "premium subcompact car", engine_details: "1.5L and 2.0L turbo petrol engines", price_range: "Approx. MSRP: $29k-$43k new" } },
  { match: /r56\/f56|f55\/f56\/f57/, data: { generation: "R56 / F55 / F56 / F57", production_years: "2006-present", body_type: "3-door / 5-door hatchback / convertible", platform: "second-gen MINI platform evolving to BMW UKL", drive_type: "FWD", segment: "premium subcompact car", engine_details: "1.5L and 2.0L turbo petrol / diesel engines across the hatch family", price_range: "Approx. MSRP: $22k-$42k new" } },
];

const BMW_RULES = [
  { match: /\be36\b/, data: { generation: "E36", production_years: "1992-1999", body_type: "sedan / coupe / convertible / touring", platform: "BMW 3 Series E36 platform", drive_type: "RWD", segment: "compact executive car", engine_details: "1.6L-3.2L inline-4 / inline-6 petrol engines plus diesel variants", price_range: "Approx. MSRP: $25k-$50k new" } },
  { match: /\be46\b/, data: { generation: "E46", production_years: "1997-2006", body_type: "sedan / coupe / convertible / touring", platform: "BMW 3 Series E46 platform", drive_type: "RWD / AWD", segment: "compact executive car", engine_details: "1.8L-3.2L inline-4 / inline-6 petrol engines plus diesel variants", price_range: "Approx. MSRP: $28k-$60k new" } },
  { match: /\be9x\b/, data: { generation: "E9X", production_years: "2005-2013", body_type: "sedan / coupe / convertible / touring", platform: "BMW 3 Series E9X platform", drive_type: "RWD / AWD", segment: "compact executive car", engine_details: "inline-4, inline-6, V8, and diesel powertrains depending on trim", price_range: "Approx. MSRP: $33k-$65k new" } },
  { match: /\be53\b/, data: { generation: "E53", production_years: "1999-2006", body_type: "luxury SUV", platform: "BMW E53 X5 platform", drive_type: "AWD", segment: "luxury midsize SUV", engine_details: "3.0L inline-6, 4.4L / 4.6L / 4.8L V8, and diesel engines", price_range: "Approx. MSRP: $42k-$70k new" } },
  { match: /\be70\b/, data: { generation: "E70", production_years: "2006-2013", body_type: "luxury SUV", platform: "BMW X5 E70 platform", drive_type: "AWD", segment: "luxury midsize SUV", engine_details: "3.0L inline-6, 4.8L V8, and turbo-diesel engines", price_range: "Approx. MSRP: $48k-$85k new" } },
  { match: /\bf87\b/, data: { generation: "F87", production_years: "2016-2021", body_type: "2-door coupe", platform: "BMW 2 Series / F22-based platform", drive_type: "RWD", segment: "compact performance coupe", engine_details: "3.0L turbocharged inline-6 engines (N55 / S55)", price_range: "Approx. MSRP: $52k-$65k new" } },
  { match: /f3x\/f8x|3\/4 series/, data: { generation: "F3X / F8X", production_years: "2012-2020", body_type: "sedan / coupe / convertible / gran coupe", platform: "BMW F3X / F8X platform", drive_type: "RWD / AWD", segment: "compact executive car", engine_details: "2.0L turbo I4, 3.0L inline-6, and M turbo inline-6 / V8 powertrains", price_range: "Approx. MSRP: $35k-$85k new" } },
  { match: /g3x\/g8x/, data: { generation: "G3X / G8X", production_years: "2019-present", body_type: "sedan / coupe / convertible / gran coupe", platform: "BMW CLAR", drive_type: "RWD / AWD", segment: "compact executive car", engine_details: "2.0L turbo I4, 3.0L turbo inline-6, and M high-performance variants", price_range: "Approx. MSRP: $46k-$95k new" } },
  { match: /\bg90\b/, data: { generation: "G90", production_years: "2024-present", body_type: "executive sedan", platform: "BMW CLAR", drive_type: "RWD / AWD", segment: "executive luxury sedan", engine_details: "mild-hybrid 4-cylinder and 6-cylinder petrol / diesel powertrains", price_range: "Approx. MSRP: $58k-$90k new" } },
];

const VW_RULES = [
  { match: /mk4.*r32|golf r32/, data: { generation: "Mk4", production_years: "2002-2004", body_type: "3-door / 5-door hatchback", platform: "Volkswagen Group A4 / PQ34", drive_type: "AWD", segment: "hot hatch", engine_details: "3.2L VR6", price_range: "Approx. MSRP: $30k-$35k new" } },
  { match: /mk7.*golf r|golf r/, data: { generation: "Mk7", production_years: "2012-2020", body_type: "hatchback", platform: "Volkswagen Group MQB", drive_type: "AWD", segment: "hot hatch", engine_details: "2.0L turbocharged inline-4", price_range: "Approx. MSRP: $37k-$45k new" } },
  { match: /mk7.*golf/, data: { generation: "Mk7", production_years: "2012-2020", body_type: "hatchback / estate", platform: "Volkswagen Group MQB", drive_type: "FWD / AWD", segment: "compact hatchback", engine_details: "1.0L-2.0L petrol and diesel engines plus GTI / GTE / e-Golf variants", price_range: "Approx. MSRP: $20k-$35k new" } },
  { match: /xl1/, data: { generation: "XL1", production_years: "2013-2015", body_type: "2-door aerodynamic coupe", platform: "carbon-fibre plug-in hybrid architecture", drive_type: "RWD", segment: "limited-production eco halo car", engine_details: "0.8L TDI plug-in hybrid", price_range: "Approx. MSRP: $145k new" } },
];

const SMART_RULES = [
  { match: /smart-451|\b451\b/, data: { generation: "451", production_years: "2007-2014", body_type: "3-door hatchback / cabriolet", platform: "smart fortwo 451 platform", drive_type: "RWD", segment: "microcar", engine_details: "1.0L petrol engines plus EV variants", price_range: "Approx. MSRP: $13k-$28k new" } },
  { match: /smart-453|\b453\b/, data: { generation: "453", production_years: "2014-2024", body_type: "3-door / 5-door hatchback", platform: "Renault Twingo III-shared platform", drive_type: "RWD", segment: "microcar / city car", engine_details: "0.9L and 1.0L petrol engines plus EV variants", price_range: "Approx. MSRP: $15k-$30k new" } },
  { match: /smart-454|\b454\b/, data: { generation: "454", production_years: "2004-2006", body_type: "5-door hatchback", platform: "Mitsubishi Colt Z30-shared platform", drive_type: "FWD", segment: "subcompact city car", engine_details: "1.1L-1.5L petrol engines and diesel options", price_range: "Approx. MSRP: $14k-$22k new" } },
];

const FERRARI_RULES = [
  { match: /f430/, data: { generation: "F430", production_years: "2004-2009", body_type: "2-door coupe / spider", platform: "rear mid-engine rear-wheel-drive Ferrari platform", drive_type: "RWD", segment: "exotic sports car", engine_details: "4.3L naturally aspirated V8", price_range: "Approx. MSRP: $170k-$220k new" } },
  { match: /f12 berlinetta|f12/, data: { generation: "F12", production_years: "2012-2017", body_type: "2-door coupe", platform: "front mid-engine rear-wheel-drive transaxle architecture", drive_type: "RWD", segment: "front-engine exotic GT", engine_details: "6.3L naturally aspirated V12", price_range: "Approx. MSRP: $320k-$380k new" } },
  { match: /488 gtb|f142m/, data: { generation: "F142M", production_years: "2015-2020", body_type: "2-door berlinetta", platform: "mid-engine Ferrari sports-car platform", drive_type: "RWD", segment: "exotic sports car", engine_details: "3.9L twin-turbocharged V8", price_range: "Approx. MSRP: $245k-$350k new" } },
  { match: /12cilindri|f167/, data: { generation: "F167", production_years: "2024-present", body_type: "2-door coupe", platform: "front mid-engine rear-wheel-drive Ferrari grand touring platform", drive_type: "RWD", segment: "front-engine exotic GT", engine_details: "6.5L naturally aspirated V12", price_range: "Approx. MSRP: $430k-$500k new" } },
];

const LAMBO_RULES = [
  { match: /l539|aventador/, data: { generation: "L539", production_years: "2011-2022", body_type: "2-door coupe / roadster", platform: "mid-engine all-wheel-drive Aventador platform", drive_type: "AWD", segment: "flagship supercar", engine_details: "6.5L naturally aspirated V12", price_range: "Approx. MSRP: $400k-$600k new" } },
  { match: /lb724|huracan/, data: { generation: "LB724", production_years: "2014-2024", body_type: "2-door coupe / spyder", platform: "mid-engine sports-car platform", drive_type: "RWD / AWD", segment: "exotic sports car", engine_details: "5.2L naturally aspirated V10", price_range: "Approx. MSRP: $240k-$350k new" } },
  { match: /lb744|revuelto/, data: { generation: "LB744", production_years: "2023-present", body_type: "2-door coupe", platform: "mid-engine plug-in hybrid supercar platform", drive_type: "AWD", segment: "flagship hybrid supercar", engine_details: "6.5L naturally aspirated V12 with three electric motors", price_range: "Approx. MSRP: $600k+ new" } },
  { match: /lb634|temerario/, data: { generation: "LB634", production_years: "2025-present", body_type: "2-door coupe", platform: "mid-engine plug-in hybrid platform", drive_type: "AWD", segment: "hybrid super sports car", engine_details: "4.0L twin-turbo V8 with three electric motors", price_range: "Approx. MSRP: $350k-$450k new" } },
];

const ROLLS_RULES = [
  { match: /rr01|phantom vii/, data: { generation: "Phantom VII", production_years: "2003-2017", body_type: "4-door sedan", platform: "Phantom VII architecture", drive_type: "RWD", segment: "ultra-luxury sedan", engine_details: "6.75L naturally aspirated V12", price_range: "Approx. MSRP: $380k-$500k new" } },
  { match: /rr02|drophead/, data: { generation: "Phantom Drophead Coupe", production_years: "2007-2016", body_type: "convertible", platform: "Phantom VII architecture", drive_type: "RWD", segment: "ultra-luxury convertible", engine_details: "6.75L naturally aspirated V12", price_range: "Approx. MSRP: $440k-$520k new" } },
  { match: /rr03|phantom coupe/, data: { generation: "Phantom Coupe", production_years: "2008-2016", body_type: "2-door coupe", platform: "Phantom VII architecture", drive_type: "RWD", segment: "ultra-luxury coupe", engine_details: "6.75L naturally aspirated V12", price_range: "Approx. MSRP: $430k-$500k new" } },
  { match: /rr04|ghost i/, data: { generation: "Ghost I", production_years: "2009-2020", body_type: "4-door sedan", platform: "BMW 7 Series F01-derived architecture", drive_type: "RWD / AWD", segment: "ultra-luxury sedan", engine_details: "6.6L twin-turbocharged V12", price_range: "Approx. MSRP: $250k-$350k new" } },
  { match: /rr05|wraith/, data: { generation: "Wraith", production_years: "2013-2023", body_type: "2-door coupe", platform: "Ghost-derived platform", drive_type: "RWD", segment: "ultra-luxury grand tourer", engine_details: "6.6L twin-turbocharged V12", price_range: "Approx. MSRP: $320k-$390k new" } },
  { match: /rr06|dawn/, data: { generation: "Dawn", production_years: "2015-2023", body_type: "convertible", platform: "Ghost-derived platform", drive_type: "RWD", segment: "ultra-luxury convertible", engine_details: "6.6L twin-turbocharged V12", price_range: "Approx. MSRP: $350k-$420k new" } },
  { match: /rr11|phantom viii/, data: { generation: "Phantom VIII", production_years: "2017-present", body_type: "4-door sedan", platform: "Architecture of Luxury", drive_type: "RWD", segment: "flagship ultra-luxury sedan", engine_details: "6.75L twin-turbocharged V12", price_range: "Approx. MSRP: $460k-$550k new" } },
  { match: /rr12|ewb/, data: { generation: "Phantom VIII EWB", production_years: "2017-present", body_type: "4-door extended-wheelbase sedan", platform: "Architecture of Luxury", drive_type: "RWD", segment: "flagship ultra-luxury limousine", engine_details: "6.75L twin-turbocharged V12", price_range: "Approx. MSRP: $540k+ new" } },
  { match: /rr21|ghost ii/, data: { generation: "Ghost II", production_years: "2020-present", body_type: "4-door sedan", platform: "Architecture of Luxury", drive_type: "AWD", segment: "ultra-luxury sedan", engine_details: "6.75L twin-turbocharged V12", price_range: "Approx. MSRP: $350k-$420k new" } },
  { match: /rr22|ghost ii ewb/, data: { generation: "Ghost II EWB", production_years: "2020-present", body_type: "4-door extended-wheelbase sedan", platform: "Architecture of Luxury", drive_type: "AWD", segment: "ultra-luxury limousine", engine_details: "6.75L twin-turbocharged V12", price_range: "Approx. MSRP: $400k-$450k new" } },
  { match: /rr25|spectre/, data: { generation: "Spectre", production_years: "2023-present", body_type: "2-door coupe", platform: "Architecture of Luxury", drive_type: "AWD", segment: "ultra-luxury electric coupe", engine_details: "dual-motor battery-electric powertrain", price_range: "Approx. MSRP: $420k+ new" } },
  { match: /rr31|cullinan/, data: { generation: "Cullinan", production_years: "2018-present", body_type: "5-door SUV", platform: "Architecture of Luxury", drive_type: "AWD", segment: "ultra-luxury SUV", engine_details: "6.75L twin-turbocharged V12", price_range: "Approx. MSRP: $350k-$450k new" } },
];

const SKODA_RULES = [
  { match: /elroq|\bel\b/, data: { generation: "EL", production_years: "2024-present", body_type: "electric compact SUV", platform: "Volkswagen Group MEB", drive_type: "RWD / AWD", segment: "electric compact crossover", engine_details: "single-motor and dual-motor battery-electric powertrains", price_range: "Approx. MSRP: $35k-$50k new" } },
  { match: /enyaq|5a/, data: { generation: "5A", production_years: "2020-present", body_type: "electric SUV / coupe-SUV", platform: "Volkswagen Group MEB", drive_type: "RWD / AWD", segment: "electric family SUV", engine_details: "battery-electric single-motor and dual-motor variants", price_range: "Approx. MSRP: $45k-$65k new" } },
  { match: /fabia iii|nj/, data: { generation: "NJ", production_years: "2014-2021", body_type: "hatchback / estate", platform: "Volkswagen Group PQ26", drive_type: "FWD", segment: "supermini", engine_details: "1.0L / 1.2L petrol and 1.4L diesel engines", price_range: "Approx. MSRP: $15k-$24k new" } },
  { match: /fabia iv|pj/, data: { generation: "PJ", production_years: "2021-present", body_type: "hatchback", platform: "Volkswagen Group MQB A0", drive_type: "FWD", segment: "supermini", engine_details: "1.0L and 1.5L petrol engines", price_range: "Approx. MSRP: $18k-$28k new" } },
  { match: /kamiq|nw/, data: { generation: "NW", production_years: "2019-present", body_type: "subcompact crossover", platform: "Volkswagen Group MQB A0", drive_type: "FWD", segment: "small crossover", engine_details: "1.0L / 1.5L TSI petrol engines and 1.6L TDI diesel", price_range: "Approx. MSRP: $23k-$33k new" } },
  { match: /karoq|nu/, data: { generation: "NU", production_years: "2017-present", body_type: "compact SUV", platform: "Volkswagen Group MQB A1", drive_type: "FWD / AWD", segment: "compact crossover", engine_details: "1.0L-2.0L petrol and diesel engines", price_range: "Approx. MSRP: $28k-$40k new" } },
  { match: /kodiaq i|ns/, data: { generation: "NS", production_years: "2016-2023", body_type: "midsize SUV", platform: "Volkswagen Group MQB A2", drive_type: "FWD / AWD", segment: "family SUV", engine_details: "1.4L / 1.5L / 2.0L petrol and 2.0L diesel engines", price_range: "Approx. MSRP: $34k-$50k new" } },
  { match: /kodiaq ii|ps/, data: { generation: "PS", production_years: "2023-present", body_type: "midsize SUV", platform: "Volkswagen Group MQB Evo", drive_type: "FWD / AWD", segment: "family SUV", engine_details: "1.5L mild-hybrid, 2.0L petrol, 2.0L diesel, and PHEV powertrains", price_range: "Approx. MSRP: $40k-$58k new" } },
  { match: /octavia ii|1z/, data: { generation: "1Z", production_years: "2004-2013", body_type: "liftback / estate", platform: "Volkswagen Group PQ35", drive_type: "FWD / AWD", segment: "compact family car", engine_details: "1.2L-2.0L petrol and 1.6L / 1.9L / 2.0L diesel engines", price_range: "Approx. MSRP: $18k-$32k new" } },
  { match: /octavia iii|5e/, data: { generation: "5E", production_years: "2012-2020", body_type: "liftback / estate", platform: "Volkswagen Group MQB", drive_type: "FWD / AWD", segment: "compact family car", engine_details: "1.0L-2.0L petrol and diesel engines including vRS variants", price_range: "Approx. MSRP: $20k-$38k new" } },
  { match: /octavia iv|nx/, data: { generation: "NX", production_years: "2019-present", body_type: "liftback / estate", platform: "Volkswagen Group MQB Evo", drive_type: "FWD / AWD", segment: "compact family car", engine_details: "1.0L / 1.5L / 2.0L petrol, diesel, mild-hybrid, and PHEV powertrains", price_range: "Approx. MSRP: $27k-$42k new" } },
  { match: /rapid|nh/, data: { generation: "NH", production_years: "2012-2019", body_type: "liftback / hatchback", platform: "Volkswagen Group PQ25 / A05+", drive_type: "FWD", segment: "subcompact family car", engine_details: "1.2L / 1.4L petrol and 1.6L diesel engines", price_range: "Approx. MSRP: $15k-$24k new" } },
  { match: /scala/, data: { generation: "NW", production_years: "2019-present", body_type: "hatchback", platform: "Volkswagen Group MQB A0", drive_type: "FWD", segment: "compact hatchback", engine_details: "1.0L / 1.5L petrol and 1.6L diesel engines", price_range: "Approx. MSRP: $21k-$31k new" } },
  { match: /superb iii|3v/, data: { generation: "3V", production_years: "2015-2023", body_type: "liftback / estate", platform: "Volkswagen Group MQB B", drive_type: "FWD / AWD", segment: "large family / executive car", engine_details: "1.4L / 1.5L / 2.0L petrol and diesel engines", price_range: "Approx. MSRP: $28k-$48k new" } },
  { match: /superb iv|3y/, data: { generation: "3Y", production_years: "2023-present", body_type: "liftback / estate", platform: "Volkswagen Group MQB Evo", drive_type: "FWD / AWD", segment: "large family / executive car", engine_details: "1.5L mild-hybrid, 2.0L petrol / diesel, and plug-in hybrid powertrains", price_range: "Approx. MSRP: $40k-$58k new" } },
  { match: /yeti|5l/, data: { generation: "5L", production_years: "2009-2017", body_type: "compact crossover", platform: "Volkswagen Group PQ35", drive_type: "FWD / AWD", segment: "compact SUV", engine_details: "1.2L / 1.4L / 1.8L petrol and 2.0L diesel engines", price_range: "Approx. MSRP: $22k-$34k new" } },
];

const PORSCHE_RULES = [
  { match: /986-?boxster/, data: { generation: "986", production_years: "1996-2004", body_type: "2-door roadster", platform: "mid-engine Boxster platform", drive_type: "RWD", segment: "sports car", engine_details: "2.5L / 2.7L / 3.2L flat-6 engines", price_range: "Approx. MSRP: $40k-$55k new" } },
  { match: /987/, data: { generation: "987", production_years: "2005-2012", body_type: "2-door roadster / coupe", platform: "mid-engine Boxster / Cayman platform", drive_type: "RWD", segment: "sports car", engine_details: "2.7L / 2.9L / 3.2L / 3.4L flat-6 engines", price_range: "Approx. MSRP: $48k-$75k new" } },
  { match: /981/, data: { generation: "981", production_years: "2012-2016", body_type: "2-door roadster / coupe", platform: "mid-engine Boxster / Cayman platform", drive_type: "RWD", segment: "sports car", engine_details: "2.7L and 3.4L flat-6 engines", price_range: "Approx. MSRP: $52k-$85k new" } },
  { match: /982|718/, data: { generation: "982 / 718", production_years: "2016-present", body_type: "2-door roadster / coupe", platform: "mid-engine 718 platform", drive_type: "RWD", segment: "sports car", engine_details: "2.0L / 2.5L turbo flat-4 and 4.0L flat-6 engines", price_range: "Approx. MSRP: $65k-$180k new" } },
  { match: /918/, data: { generation: "918", production_years: "2013-2015", body_type: "2-door roadster", platform: "carbon-fibre hybrid hypercar platform", drive_type: "AWD", segment: "hybrid hypercar", engine_details: "4.6L naturally aspirated V8 with plug-in hybrid system", price_range: "Approx. MSRP: $845k new" } },
  { match: /931\/932|924/, data: { generation: "931 / 932", production_years: "1976-1988", body_type: "2-door coupe", platform: "front-engine transaxle platform", drive_type: "RWD", segment: "entry sports coupe", engine_details: "2.0L inline-4 petrol engines, turbocharged on 931", price_range: "Approx. MSRP: $20k-$35k new" } },
  { match: /955\/957|cayenne e1/, data: { generation: "955 / 957", production_years: "2002-2010", body_type: "luxury SUV", platform: "PL71", drive_type: "AWD", segment: "performance luxury SUV", engine_details: "3.2L / 3.6L V6, 4.5L / 4.8L V8, and diesel engines", price_range: "Approx. MSRP: $43k-$100k new" } },
  { match: /958|cayenne e2/, data: { generation: "958", production_years: "2010-2018", body_type: "luxury SUV", platform: "PL72", drive_type: "AWD", segment: "performance luxury SUV", engine_details: "3.0L V6, 3.6L V6, 4.8L V8, diesel, and hybrid powertrains", price_range: "Approx. MSRP: $49k-$160k new" } },
  { match: /9y0|cayenne e3/, data: { generation: "9Y0", production_years: "2019-present", body_type: "luxury SUV", platform: "MLB Evo", drive_type: "AWD", segment: "performance luxury SUV", engine_details: "3.0L V6, 4.0L V8, and plug-in hybrid powertrains", price_range: "Approx. MSRP: $80k-$200k new" } },
  { match: /95b|macan/, data: { generation: "95B", production_years: "2014-2024", body_type: "compact luxury SUV", platform: "Audi MLB-derived platform", drive_type: "AWD", segment: "performance compact SUV", engine_details: "2.0L turbo I4, 3.0L twin-turbo V6, and 2.9L twin-turbo V6 engines", price_range: "Approx. MSRP: $50k-$95k new" } },
  { match: /j1a|macan electric/, data: { generation: "J1A", production_years: "2024-present", body_type: "electric luxury SUV", platform: "PPE", drive_type: "RWD / AWD", segment: "electric performance SUV", engine_details: "battery-electric single-motor and dual-motor powertrains", price_range: "Approx. MSRP: $78k-$110k new" } },
  { match: /970|panamera g1/, data: { generation: "970", production_years: "2009-2016", body_type: "4-door fastback sedan", platform: "Panamera G1 platform", drive_type: "RWD / AWD", segment: "luxury performance sedan", engine_details: "3.0L / 3.6L V6, 4.8L V8, diesel, and hybrid powertrains", price_range: "Approx. MSRP: $75k-$180k new" } },
  { match: /971|panamera g2|panamera/, data: { generation: "971", production_years: "2016-present", body_type: "4-door fastback sedan / Sport Turismo", platform: "MSB", drive_type: "RWD / AWD", segment: "luxury performance sedan", engine_details: "2.9L V6, 4.0L V8, and hybrid powertrains", price_range: "Approx. MSRP: $95k-$220k new" } },
  { match: /964/, data: { generation: "964", production_years: "1989-1994", body_type: "2-door coupe / cabriolet / targa", platform: "911 rear-engine platform", drive_type: "RWD / AWD", segment: "sports car", engine_details: "3.6L naturally aspirated flat-6", price_range: "Approx. MSRP: $65k-$90k new" } },
  { match: /991/, data: { generation: "991", production_years: "2012-2019", body_type: "2-door coupe / cabriolet / targa", platform: "911 rear-engine platform", drive_type: "RWD / AWD", segment: "sports car", engine_details: "3.0L turbo flat-6 and GT naturally aspirated flat-6 engines", price_range: "Approx. MSRP: $90k-$250k new" } },
  { match: /992/, data: { generation: "992", production_years: "2019-present", body_type: "2-door coupe / cabriolet / targa", platform: "911 rear-engine platform", drive_type: "RWD / AWD", segment: "sports car", engine_details: "3.0L twin-turbo flat-6 and GT naturally aspirated flat-6 engines", price_range: "Approx. MSRP: $120k-$300k new" } },
  { match: /993/, data: { generation: "993", production_years: "1994-1998", body_type: "2-door coupe / cabriolet / targa", platform: "911 rear-engine platform", drive_type: "RWD / AWD", segment: "sports car", engine_details: "3.6L naturally aspirated flat-6", price_range: "Approx. MSRP: $65k-$95k new" } },
  { match: /996/, data: { generation: "996", production_years: "1998-2005", body_type: "2-door coupe / cabriolet / targa", platform: "911 rear-engine platform", drive_type: "RWD / AWD", segment: "sports car", engine_details: "3.4L / 3.6L flat-6 engines", price_range: "Approx. MSRP: $70k-$125k new" } },
  { match: /997/, data: { generation: "997", production_years: "2005-2012", body_type: "2-door coupe / cabriolet / targa", platform: "911 rear-engine platform", drive_type: "RWD / AWD", segment: "sports car", engine_details: "3.6L and 3.8L flat-6 engines", price_range: "Approx. MSRP: $76k-$140k new" } },
  { match: /980|carrera gt/, data: { generation: "980", production_years: "2003-2007", body_type: "2-door roadster", platform: "carbon-fibre supercar platform", drive_type: "RWD", segment: "supercar", engine_details: "5.7L naturally aspirated V10", price_range: "Approx. MSRP: $440k new" } },
  { match: /y1a|taycan/, data: { generation: "Y1A", production_years: "2019-present", body_type: "4-door sports sedan / Cross Turismo", platform: "J1", drive_type: "RWD / AWD", segment: "electric performance car", engine_details: "battery-electric single-motor and dual-motor powertrains", price_range: "Approx. MSRP: $90k-$230k new" } },
];

function inferMercedes(vehicle, haystack) {
  if ((vehicle.brand_name || vehicle.text_brands) !== "Mercedes-Benz") return {};
  const title = String(vehicle.vehicle_title || vehicle.model_name || "");
  const family = [
    ["s-class", "full-size luxury sedan", "Approx. MSRP: $95k-$220k new", "inline-6, V8, and V12 petrol / diesel engines depending on generation"],
    ["e-class", "executive luxury car", "Approx. MSRP: $55k-$120k new", "inline-4, inline-6, V6, and V8 petrol / diesel engines depending on generation"],
    ["c-class", "compact executive car", "Approx. MSRP: $45k-$95k new", "inline-4, V6, and V8 petrol / diesel engines depending on generation"],
    ["cla", "compact four-door coupe", "Approx. MSRP: $40k-$65k new", "turbocharged inline-4 petrol and diesel engines"],
    ["cls", "executive four-door coupe", "Approx. MSRP: $70k-$100k new", "inline-6 and V8 petrol / diesel engines"],
    ["gls", "full-size luxury SUV", "Approx. MSRP: $90k-$180k new", "inline-6 and V8 engines with 4MATIC"],
    ["gle", "midsize luxury SUV", "Approx. MSRP: $65k-$120k new", "turbocharged four-, six-, and eight-cylinder engines with 4MATIC"],
    ["glk", "compact luxury SUV", "Approx. MSRP: $40k-$55k new", "four- and six-cylinder petrol / diesel engines"],
    ["ml", "midsize luxury SUV", "Approx. MSRP: $45k-$80k new", "V6 and V8 petrol / diesel engines"],
    ["g-class", "luxury off-roader", "Approx. MSRP: $140k-$190k new", "inline-6 and V8 petrol / diesel engines with 4MATIC"],
    ["gla", "subcompact luxury crossover", "Approx. MSRP: $40k-$60k new", "turbocharged four-cylinder engines"],
    ["slr", "super grand tourer", "Approx. MSRP: $450k+ new", "5.4L supercharged V8"],
    ["slk", "compact roadster", "Approx. MSRP: $42k-$70k new", "four-, six-, and eight-cylinder petrol engines"],
    ["slc", "compact roadster", "Approx. MSRP: $48k-$65k new", "turbocharged four- and six-cylinder petrol engines"],
    ["sl ", "luxury roadster", "Approx. MSRP: $90k-$180k new", "V6, V8, and V12 petrol engines depending on generation"],
    ["citan", "compact van", "Approx. MSRP: $30k-$45k new", "small-displacement petrol and diesel engines"],
    ["cla coupe", "compact four-door coupe", "Approx. MSRP: $40k-$65k new", "turbocharged inline-4 petrol and diesel engines"],
  ].find(([needle]) => haystack.includes(needle));

  const body = bodyTypeFromTitle(haystack) || (
    /\bx\d{3}\b/.test(haystack) ? "SUV" :
    /\br\d{3}\b/.test(haystack) ? "roadster" :
    /\bc\d{3}\b/.test(haystack) ? "coupe" :
    /\bs\d{3}\b/.test(haystack) ? "estate / wagon" :
    /\bv\d{3}\b/.test(haystack) ? "limousine / pullman" :
    /\bh\d{3}\b/.test(haystack) ? "hearse" :
    "sedan / saloon"
  );
  const drive = /g-class|gls|gle|glk|ml|citan|4matic|suv/.test(haystack)
    ? "AWD / 4MATIC"
    : "RWD / AWD depending on trim";
  return {
    body_type: body,
    drive_type: drive,
    segment: family?.[1] ?? "premium passenger car",
    engine_details: family?.[3] ?? "petrol and diesel powertrains varied by generation and trim",
    price_range: family?.[2] ?? "Approx. MSRP: varied by model and trim",
    platform: /g-class/.test(haystack) ? "Mercedes-Benz G-Class ladder-frame platform" : "",
  };
}

function inferVehicleFields(vehicle) {
  const haystack = makeHaystack(vehicle);
  const brand = vehicle.brand_name || vehicle.text_brands || "";
  let inferred = {};

  if (brand === "Jaguar") inferred = findRule(haystack, JAGUAR_RULES);
  else if (brand === "Land Rover") inferred = findRule(haystack, LAND_ROVER_RULES);
  else if (brand === "Mini") inferred = findRule(haystack, MINI_RULES);
  else if (brand === "BMW") inferred = findRule(haystack, BMW_RULES);
  else if (brand === "Volkswagen") inferred = findRule(haystack, VW_RULES);
  else if (brand === "Smart") inferred = findRule(haystack, SMART_RULES);
  else if (brand === "Ferrari") inferred = findRule(haystack, FERRARI_RULES);
  else if (brand === "Lamborghini") inferred = findRule(haystack, LAMBO_RULES);
  else if (brand === "Rolls-Royce") inferred = findRule(haystack, ROLLS_RULES);
  else if (brand === "Skoda") inferred = findRule(haystack, SKODA_RULES);
  else if (brand === "Porsche") inferred = findRule(haystack, PORSCHE_RULES);
  else if (brand === "Mercedes-Benz") inferred = inferMercedes(vehicle, haystack);

  if (!inferred.body_type) {
    const genericBody = bodyTypeFromTitle(haystack);
    if (genericBody) inferred.body_type = genericBody;
  }
  if (!inferred.production_stats && inferred.production_years) {
    inferred.production_stats = `Production run: ${inferred.production_years}`;
  }
  return inferred;
}

function assignPatchField(patch, vehicle, key, nextValue, force = false) {
  if (isBlank(nextValue)) return false;
  const current = vehicle[key];
  if (key === "production_years") {
    if (!force && !isBlank(current) && !hasBadYears(current)) return false;
    patch[key] = cleanYears(nextValue);
    return true;
  }
  if (!force && !isBlank(current)) return false;
  patch[key] = nextValue;
  return true;
}

async function run() {
  if (!CONVEX_URL) {
    console.error("Missing VITE_CONVEX_URL in .env.local");
    process.exit(1);
  }

  const vehicles = await convexQuery("queries:vehiclesGetAllWithBrands", {});
  let updated = 0;

  for (const vehicle of vehicles) {
    const inferred = inferVehicleFields(vehicle);
    const patch = { id: vehicle._id };
    let changed = false;

    changed = assignPatchField(patch, vehicle, "generation", inferred.generation, /^n\/a$/i.test(String(vehicle.generation ?? ""))) || changed;
    changed = assignPatchField(patch, vehicle, "production_years", inferred.production_years, hasBadYears(vehicle.production_years)) || changed;
    changed = assignPatchField(patch, vehicle, "body_type", inferred.body_type) || changed;
    changed = assignPatchField(patch, vehicle, "platform", inferred.platform) || changed;
    changed = assignPatchField(patch, vehicle, "drive_type", inferred.drive_type) || changed;
    changed = assignPatchField(patch, vehicle, "segment", inferred.segment) || changed;
    changed = assignPatchField(patch, vehicle, "engine_details", inferred.engine_details) || changed;
    changed = assignPatchField(patch, vehicle, "price_range", inferred.price_range) || changed;
    changed = assignPatchField(patch, vehicle, "production_stats", inferred.production_stats) || changed;

    if (!changed) continue;
    await convexMutation("mutations:vehiclesUpdate", patch);
    updated++;
  }

  console.log(JSON.stringify({ totalVehicles: vehicles.length, updated }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
