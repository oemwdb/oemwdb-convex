export interface VehicleData {
  name: string;
  generation: string;
  years: string;
  engines: string;
  drive: string;
  segment: string;
  msrp: string;
  description: string;
  
  // Quick Reference
  chassisCode: string;
  platform: string;
  bodyType: string;
  productionYears: string;
  productionLocations: string;
  unitsProduced: string;
  status: string;
  targetMarket: string;
  priceRange: string;
  competitors: string[];
  engineList: string[];
  transmission: string[];
  driveType: string;
  fuelEconomy: string;
  performance: string;

  // Technical specs
  dimensions: {
    length: string;
    width: string;
    height: string;
    wheelbase: string;
    weight: string;
  };
  performanceData: {
    acceleration: string;
    topSpeed: string;
    powerOutput: string;
    torque: string;
  };
  chassisDetails: {
    suspension: string;
    brakes: string;
    steering: string;
    wheels: string;
  };
  safetyFeatures: string[];

  // Other sections
  trims: string[];
  standardEquipment: string[];
  optionalPackages: string[];
  specialEditions: string[];

  exteriorDesign: {
    description: string;
    features: string[];
  };
  interiorFeatures: {
    description: string;
    features: string[];
  };
  infotainmentTechnology: string[];
  driverAssistance: string[];

  awards: string[];
  reviews: string[];
  salesData: string[];
  marketPositioning: string[];

  development: {
    timeline: { year: string; event: string }[];
    description: string;
  };
  modelEvolution: {
    predecessor: string;
    updates: string[];
    successor: string;
  };

  engineVariants: {
    name: string;
    displacement: string;
    power: string;
    torque: string;
    fuelType: string;
    transmission: string;
    acceleration: string;
    topSpeed: string;
    fuelEconomy: string;
  }[];

  commonIssues: string[];
  maintenance: string[];
  ownershipCosts: string[];
  valueRetention: string[];

  primarySources: { name: string; description: string }[];
  secondarySources: { name: string; description: string }[];
}

export const staticVehicleData: Record<string, VehicleData> = {
  "alfa-romeo-159": {
    name: "Alfa Romeo 159",
    generation: "Type 939",
    years: "2005-2011",
    engines: "1.8L I4, 2.2L I4, 3.2L V6, 1.9L Diesel, 2.4L Diesel",
    drive: "FWD/AWD",
    segment: "Executive Sedan",
    msrp: "€25,000 - €40,000",
    description: "The Alfa Romeo 159 represents the pinnacle of Italian automotive design and engineering, featuring distinctive styling, advanced safety technology, and engaging driving dynamics that defined Alfa Romeo's premium sedan offering in the mid-2000s.",
    
    chassisCode: "Type 939",
    platform: "Premium Platform",
    bodyType: "4-door sedan / 5-door wagon",
    productionYears: "2005-2011",
    productionLocations: "Pomigliano d'Arco, Italy",
    unitsProduced: "212,000+",
    status: "Discontinued",
    targetMarket: "Executive/Premium European",
    priceRange: "€25,000 - €40,000",
    competitors: ["BMW 3 Series", "Mercedes C-Class", "Audi A4"],
    engineList: ["1.8L I4 140hp", "2.2L I4 185hp", "3.2L V6 260hp", "1.9L Diesel 150hp", "2.4L Diesel 200hp"],
    transmission: ["6-speed Manual", "6-speed Automatic"],
    driveType: "FWD/AWD (Q4)",
    fuelEconomy: "22-35 MPG",
    performance: "0-60 in 6.1-8.5s",

    dimensions: {
      length: "185.4 in",
      width: "71.3 in",
      height: "58.1 in",
      wheelbase: "107.1 in",
      weight: "3,300-3,600 lbs"
    },
    performanceData: {
      acceleration: "6.1-8.5 seconds",
      topSpeed: "140-155 mph",
      powerOutput: "140-260 hp",
      torque: "140-237 lb-ft"
    },
    chassisDetails: {
      suspension: "MacPherson strut front, multi-link rear",
      brakes: "Ventilated discs front/rear",
      steering: "Electric power steering",
      wheels: "16-19 inch alloys"
    },
    safetyFeatures: ["ABS", "ESP", "6 Airbags", "ISOFIX", "Emergency Brake Assist"],

    trims: ["1.8 MPI", "2.2 JTS", "3.2 V6", "1.9 JTDm", "2.4 JTDm"],
    standardEquipment: ["Xenon Headlights", "Leather Seats", "Climate Control", "17-inch Alloys"],
    optionalPackages: ["Sports Package", "Ti Package", "Luxury Package"],
    specialEditions: ["TI Sport", "Q4 Anniversary"],

    exteriorDesign: {
      description: "Distinctive Italian design with the iconic Alfa Romeo grille and elegant proportions.",
      features: ["Triangular Grille", "Xenon Headlights", "Side Scudetto", "Dual Exhaust"]
    },
    interiorFeatures: {
      description: "Premium Italian interior with attention to detail and driver-focused layout.",
      features: ["Leather/Alcantara Trim", "Red Start Button", "Carbon Fiber Accents", "Sport Seats"]
    },
    infotainmentTechnology: ["Alfa Romeo Connect", "Navigation System", "Premium Audio", "Bluetooth"],
    driverAssistance: ["Parking Sensors", "Rain Sensing Wipers", "Auto Lights"],

    awards: ["European Car of the Year Nominee 2006", "Design Award - Auto Bild 2005"],
    reviews: ["Auto Express: 4/5 stars", "What Car?: Recommended"],
    salesData: ["Peak sales in 2006-2007", "Strong European market presence"],
    marketPositioning: ["Premium Italian alternative", "Design-focused executive car"],

    development: {
      timeline: [
        { year: "2002", event: "Development begins as 166 replacement" },
        { year: "2004", event: "Pre-production testing phase" },
        { year: "2005", event: "Market launch at Geneva Motor Show" }
      ],
      description: "Developed to revitalize Alfa Romeo's presence in the executive car segment with distinctive Italian style."
    },
    modelEvolution: {
      predecessor: "Alfa Romeo 166",
      updates: ["New platform", "Modern safety systems", "Updated engines"],
      successor: "Alfa Romeo Giulia"
    },

    engineVariants: [
      {
        name: "1.8 MPI",
        displacement: "1.8L I4",
        power: "140 hp",
        torque: "140 lb-ft",
        fuelType: "Premium gasoline",
        transmission: "6-speed manual",
        acceleration: "8.5 seconds",
        topSpeed: "127 mph",
        fuelEconomy: "25/35 MPG"
      },
      {
        name: "3.2 V6",
        displacement: "3.2L V6",
        power: "260 hp",
        torque: "237 lb-ft",
        fuelType: "Premium gasoline",
        transmission: "6-speed automatic",
        acceleration: "6.1 seconds",
        topSpeed: "155 mph",
        fuelEconomy: "18/28 MPG"
      }
    ],

    commonIssues: ["Electrical gremlins", "Interior trim wear", "Engine carbon buildup"],
    maintenance: ["Oil change every 10k miles", "Timing belt every 60k miles"],
    ownershipCosts: ["€800-1200 annual maintenance", "Premium fuel recommended"],
    valueRetention: ["40% value after 5 years", "Classic collectible potential"],

    primarySources: [
      { name: "Alfa Romeo Technical Documentation", description: "Factory service manuals and specifications" },
      { name: "European NCAP", description: "Official safety ratings and test results" }
    ],
    secondarySources: [
      { name: "Alfa Romeo Owner Forums", description: "Community experiences and modifications" },
      { name: "Classic Car Magazines", description: "Reviews and buying guides" }
    ]
  },

  "bmw-3-series": {
    name: "BMW 3 Series",
    generation: "G20/G21",
    years: "2019-Present",
    engines: "2.0L Turbo I4, 3.0L Turbo I6",
    drive: "RWD/AWD",
    segment: "Executive Sedan",
    msrp: "$35,000 - $55,000",
    description: "The BMW 3 Series G20/G21 generation represents the seventh generation of BMW's iconic sports sedan, featuring advanced technology, improved dynamics, and the latest BMW design language while maintaining the driving pleasure the series is known for.",
    
    chassisCode: "G20/G21",
    platform: "CLAR Platform",
    bodyType: "4-door sedan / 5-door wagon",
    productionYears: "2019-Present",
    productionLocations: "Munich, Germany; Mexico",
    unitsProduced: "500,000+",
    status: "In Production",
    targetMarket: "Global Executive/Premium",
    priceRange: "$35,000 - $55,000",
    competitors: ["Mercedes C-Class", "Audi A4", "Genesis G70"],
    engineList: ["2.0L Turbo I4 255hp", "3.0L Turbo I6 382hp"],
    transmission: ["8-speed Automatic"],
    driveType: "RWD/AWD (xDrive)",
    fuelEconomy: "25-30 MPG",
    performance: "0-60 in 4.4-5.6s",

    dimensions: {
      length: "185.7 in",
      width: "71.9 in",
      height: "56.8 in",
      wheelbase: "112.2 in",
      weight: "3,500-3,800 lbs"
    },
    performanceData: {
      acceleration: "4.4-5.6 seconds",
      topSpeed: "155 mph",
      powerOutput: "255-382 hp",
      torque: "295-369 lb-ft"
    },
    chassisDetails: {
      suspension: "Multi-link front/rear",
      brakes: "Ventilated discs",
      steering: "Electric power steering",
      wheels: "17-19 inch alloys"
    },
    safetyFeatures: ["Automatic Emergency Braking", "Blind Spot Monitoring", "Lane Departure Warning", "Adaptive Cruise Control"],

    trims: ["330i", "330i xDrive", "M340i xDrive"],
    standardEquipment: ["LED Headlights", "Leather Seats", "Navigation System", "Apple CarPlay"],
    optionalPackages: ["Premium Package", "M Sport Package", "Executive Package"],
    specialEditions: ["M Performance Edition", "Anniversary Edition"],

    exteriorDesign: {
      description: "Modern and athletic design language with signature kidney grille and sharp character lines.",
      features: ["LED Adaptive Headlights", "M Sport Body Kit", "Panoramic Sunroof", "Active Aero"]
    },
    interiorFeatures: {
      description: "Luxurious interior with premium materials and advanced technology integration.",
      features: ["Dakota Leather", "Ambient Lighting", "Heated/Ventilated Seats", "Live Cockpit"]
    },
    infotainmentTechnology: ["iDrive 7.0", "Wireless CarPlay", "Harman Kardon Audio", "Gesture Control"],
    driverAssistance: ["Parking Assistant", "Traffic Jam Assistant", "Active Driving Assistant", "Surround View"],

    awards: ["2020 IIHS Top Safety Pick", "2021 Car of the Year Finalist", "World Car Awards 2019"],
    reviews: ["Motor Trend: 4.5/5 stars", "Car and Driver: Editors' Choice", "Road & Track: Highly Recommended"],
    salesData: ["Best-selling in segment 2020-2021", "250k units sold globally", "Strong US market performance"],
    marketPositioning: ["Premium executive sedan leader", "Strong residual values", "Brand benchmark"],

    development: {
      timeline: [
        { year: "2015", event: "Development begins on CLAR platform" },
        { year: "2018", event: "Pre-production testing phase" },
        { year: "2019", event: "Official market launch" }
      ],
      description: "Developed as part of BMW's new generation strategy focusing on electrification and digitalization."
    },
    modelEvolution: {
      predecessor: "F30 3 Series",
      updates: ["New CLAR platform", "Updated iDrive system", "Improved aerodynamics", "Enhanced safety"],
      successor: "TBD (Future generation)"
    },

    engineVariants: [
      {
        name: "330i",
        displacement: "2.0L Turbo I4",
        power: "255 hp",
        torque: "295 lb-ft",
        fuelType: "Premium gasoline",
        transmission: "8-speed automatic",
        acceleration: "5.6 seconds",
        topSpeed: "155 mph",
        fuelEconomy: "26/36 MPG"
      },
      {
        name: "M340i",
        displacement: "3.0L Turbo I6",
        power: "382 hp",
        torque: "369 lb-ft",
        fuelType: "Premium gasoline",
        transmission: "8-speed automatic",
        acceleration: "4.4 seconds",
        topSpeed: "155 mph",
        fuelEconomy: "22/30 MPG"
      }
    ],

    commonIssues: ["Timing chain issues (early models)", "Electronic system glitches", "Oil consumption"],
    maintenance: ["Oil change every 10k miles", "Brake service every 30k miles", "Software updates"],
    ownershipCosts: ["$600-800 annual maintenance", "Premium fuel required", "Higher insurance costs"],
    valueRetention: ["65% value after 3 years", "Strong resale market", "CPO program available"],

    primarySources: [
      { name: "BMW Official Documentation", description: "Factory service manuals and specifications" },
      { name: "NHTSA Safety Database", description: "Official safety ratings and recall information" }
    ],
    secondarySources: [
      { name: "Automotive Magazines", description: "Professional reviews and road tests" },
      { name: "BMW Owner Forums", description: "Real-world ownership experiences and modifications" }
    ]
  }
};

// Function to match URL parameters to vehicle data
export function getVehicleByUrl(urlParam: string): VehicleData | null {
  // Handle various URL formats
  const cleanParam = urlParam.toLowerCase();
  
  // Direct matches
  if (staticVehicleData[cleanParam]) {
    return staticVehicleData[cleanParam];
  }
  
  // Handle complex URLs like "alfa-romeo---type-939:-159"
  if (cleanParam.includes("alfa-romeo") && cleanParam.includes("159")) {
    return staticVehicleData["alfa-romeo-159"];
  }
  
  if (cleanParam.includes("bmw") && cleanParam.includes("3")) {
    return staticVehicleData["bmw-3-series"];
  }
  
  // Fallback to first vehicle (Alfa Romeo 159)
  return staticVehicleData["alfa-romeo-159"];
}
