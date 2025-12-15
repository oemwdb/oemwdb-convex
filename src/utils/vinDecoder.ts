/**
 * VIN Decoder Utility
 * Based on ISO 3779/3780 standard (1981+)
 */

// WMI (World Manufacturer Identifier) Database - First 3 characters
const WMI_DATABASE: Record<string, string> = {
  // North America (1-5)
  '1G1': 'Chevrolet (USA)',
  '1G2': 'Pontiac (USA)',
  '1G3': 'Oldsmobile (USA)',
  '1G6': 'Cadillac (USA)',
  '1GM': 'Pontiac (USA)',
  '1GC': 'Chevrolet Truck (USA)',
  '1GN': 'Chevrolet (USA)',
  '1GT': 'GMC Truck (USA)',
  '1FA': 'Ford (USA)',
  '1FB': 'Ford (USA)',
  '1FC': 'Ford (USA)',
  '1FD': 'Ford (USA)',
  '1FM': 'Ford (USA)',
  '1FT': 'Ford Truck (USA)',
  '1FU': 'Freightliner (USA)',
  '1G': 'General Motors (USA)',
  '1H': 'Honda (USA)',
  '1J': 'Jeep (USA)',
  '1L': 'Lincoln (USA)',
  '1M': 'Mack Truck (USA)',
  '1N': 'Nissan (USA)',
  '1VW': 'Volkswagen (USA)',
  '1YV': 'Mazda (USA)',
  '2C3': 'Chrysler (Canada)',
  '2FA': 'Ford (Canada)',
  '2FM': 'Ford (Canada)',
  '2FT': 'Ford Truck (Canada)',
  '2G1': 'Chevrolet (Canada)',
  '2G2': 'Pontiac (Canada)',
  '2HG': 'Honda (Canada)',
  '2HM': 'Hyundai (Canada)',
  '2T': 'Toyota (Canada)',
  '3FA': 'Ford (Mexico)',
  '3G': 'General Motors (Mexico)',
  '3N': 'Nissan (Mexico)',
  '3VW': 'Volkswagen (Mexico)',
  '4F': 'Mazda (USA)',
  '4M': 'Mercury (USA)',
  '4S': 'Subaru (USA)',
  '4T': 'Toyota (USA)',
  '5F': 'Honda (USA)',
  '5L': 'Lincoln (USA)',
  '5N': 'Nissan (USA)',
  '5T': 'Toyota (USA)',
  '5YJ': 'Tesla (USA)',

  // Europe (S-Z)
  'SAJ': 'Jaguar (UK)',
  'SAL': 'Land Rover (UK)',
  'SAR': 'Rover (UK)',
  'SCC': 'Lotus (UK)',
  'SCE': 'DeLorean (UK)',
  'SDB': 'Peugeot (UK)',
  'SFD': 'Alexander Dennis (UK)',
  'SHS': 'Honda (UK)',
  'SJN': 'Nissan (UK)',
  'TMA': 'Hyundai (Czech)',
  'TMB': 'Skoda (Czech)',
  'TRU': 'Audi (Hungary)',
  'TSM': 'Suzuki (Hungary)',
  'VF1': 'Renault (France)',
  'VF3': 'Peugeot (France)',
  'VF7': 'Citroën (France)',
  'VSS': 'SEAT (Spain)',
  'VWV': 'Volkswagen (Spain)',
  'WAU': 'Audi (Germany)',
  'WBA': 'BMW (Germany)',
  'WBS': 'BMW M (Germany)',
  'WDB': 'Mercedes-Benz (Germany)',
  'WDC': 'DaimlerChrysler (Germany)',
  'WDD': 'Mercedes-Benz (Germany)',
  'WDF': 'Mercedes-Benz (Germany)',
  'WEB': 'Evobus (Germany)',
  'WF0': 'Ford (Germany)',
  'WJM': 'Iveco (Germany)',
  'WJR': 'Irmscher (Germany)',
  'WMA': 'MAN (Germany)',
  'WME': 'Smart (Germany)',
  'WMW': 'MINI (Germany)',
  'WP0': 'Porsche (Germany)',
  'WP1': 'Porsche (Germany)',
  'WUA': 'Quattro (Germany)',
  'WVG': 'Volkswagen (Germany)',
  'WVW': 'Volkswagen (Germany)',
  'WV1': 'Volkswagen Commercial (Germany)',
  'WV2': 'Volkswagen (Germany)',
  'W0L': 'Opel (Germany)',
  'XTA': 'Lada (Russia)',

  // Asia (J, K, L)
  'JAA': 'Isuzu (Japan)',
  'JA3': 'Mitsubishi (Japan)',
  'JA4': 'Mitsubishi (Japan)',
  'JF1': 'Subaru (Japan)',
  'JF2': 'Subaru (Japan)',
  'JHM': 'Honda (Japan)',
  'JHL': 'Honda (Japan)',
  'JH4': 'Acura (Japan)',
  'JM1': 'Mazda (Japan)',
  'JMZ': 'Mazda (Japan)',
  'JN1': 'Nissan (Japan)',
  'JN8': 'Nissan (Japan)',
  'JT': 'Toyota (Japan)',
  'JY': 'Yamaha (Japan)',
  'KL': 'Daewoo (South Korea)',
  'KM': 'Hyundai (South Korea)',
  'KMH': 'Hyundai (South Korea)',
  'KN': 'Kia (South Korea)',
  'KNA': 'Kia (South Korea)',
  'KPT': 'SsangYong (South Korea)',
  'L56': 'Renault (China)',
  'LBV': 'BMW (China)',
  'LDC': 'Dongfeng Peugeot-Citroën (China)',
  'LFM': 'FAW (China)',
  'LFV': 'FAW-Volkswagen (China)',
  'LGB': 'Dong Feng (China)',
  'LGW': 'Great Wall (China)',
  'LHG': 'Guangzhou Honda (China)',
  'LJD': 'Dongfeng Yueda Kia (China)',
  'LKL': 'Suzhou King Long (China)',
  'LL6': 'Geely (China)',
  'LLS': 'Lifan (China)',
  'LNB': 'Beijing Benz (China)',
  'LSG': 'SAIC General Motors (China)',
  'LSV': 'SAIC Volkswagen (China)',
  'LVG': 'GAC Toyota (China)',
  'LVS': 'Ford (China)',
  'LVV': 'Chery (China)',
  'LZE': 'Isuzu (China)',
  'LZG': 'SAIC-GM-Wuling (China)',
  'LZW': 'SAIC (China)',

  // Australia (6-7)
  '6F': 'Ford (Australia)',
  '6G': 'General Motors (Australia)',
  '6H': 'GMH (Australia)',
  '6T': 'Toyota (Australia)',
  '7A': 'Honda (New Zealand)',
};

// Year codes (Character 10) - Cycles every 30 years
const YEAR_CODES: Record<string, number[]> = {
  'A': [1980, 2010],
  'B': [1981, 2011],
  'C': [1982, 2012],
  'D': [1983, 2013],
  'E': [1984, 2014],
  'F': [1985, 2015],
  'G': [1986, 2016],
  'H': [1987, 2017],
  'J': [1988, 2018],
  'K': [1989, 2019],
  'L': [1990, 2020],
  'M': [1991, 2021],
  'N': [1992, 2022],
  'P': [1993, 2023],
  'R': [1994, 2024],
  'S': [1995, 2025],
  'T': [1996, 2026],
  'V': [1997, 2027],
  'W': [1998, 2028],
  'X': [1999, 2029],
  'Y': [2000, 2030],
  '1': [2001, 2031],
  '2': [2002, 2032],
  '3': [2003, 2033],
  '4': [2004, 2034],
  '5': [2005, 2035],
  '6': [2006, 2036],
  '7': [2007, 2037],
  '8': [2008, 2038],
  '9': [2009, 2039],
};

// Geographic regions (Character 1)
const GEOGRAPHIC_REGIONS: Record<string, string> = {
  '1': 'United States',
  '2': 'Canada',
  '3': 'Mexico',
  '4': 'United States',
  '5': 'United States',
  '6': 'Australia',
  '7': 'New Zealand',
  '8': 'South America',
  '9': 'South America',
  'A': 'South Africa',
  'B': 'South Africa',
  'C': 'Asia',
  'D': 'Asia',
  'E': 'Asia',
  'F': 'Asia',
  'G': 'Asia',
  'H': 'Asia',
  'J': 'Japan',
  'K': 'South Korea',
  'L': 'China',
  'M': 'Asia',
  'N': 'Asia',
  'P': 'Asia',
  'R': 'Asia',
  'S': 'Europe',
  'T': 'Europe',
  'U': 'Europe',
  'V': 'Europe',
  'W': 'Europe',
  'X': 'Europe',
  'Y': 'Europe',
  'Z': 'Europe',
};

export interface ManufacturerSpecificData {
  modelSeries?: string;
  modelName?: string;
  bodyStyle?: string;
  engineType?: string;
  engineDisplacement?: string;
  engineCode?: string;
  cylinderCount?: string;
  fuelType?: string;
  platformCode?: string;
  transmissionType?: string;
  transmissionGears?: string;
  driveType?: string;
  steeringPosition?: string;
  safetySystem?: string;
  restraintSystem?: string;
  brakeSystem?: string;
  wheelSize?: string;
  trim?: string;
  productionPlant?: string;
  assemblyLocation?: string;
  detectedYear?: number;
  marketType?: 'North American' | 'European' | 'Asian' | 'Other';
  notes?: string[];
}

export interface VINDecodedData {
  isValid: boolean;
  vin: string;
  wmi: string;
  vds: string;
  vis: string;
  checkDigit: string;
  yearCode: string;
  plantCode: string;
  serialNumber: string;
  manufacturer?: string;
  region?: string;
  possibleYears?: number[];
  manufacturerSpecific?: ManufacturerSpecificData;
  nhtsaData?: NHTSADecodedData;
  vehicleMapping?: VehicleMapping;
  errors: string[];
  notes: string[];
}

export interface VehicleMapping {
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyStyle?: string;
  engineDisplacement?: string;
  engineCode?: string;
  searchQuery?: string; // For matching against your vehicle database
}

export interface NHTSADecodedData {
  Make?: string;
  Model?: string;
  ModelYear?: string;
  Manufacturer?: string;
  PlantCountry?: string;
  PlantCity?: string;
  VehicleType?: string;
  BodyClass?: string;
  Doors?: string;
  EngineModel?: string;
  EngineCylinders?: string;
  EngineHP?: string;
  EngineKW?: string;
  FuelType?: string;
  TransmissionStyle?: string;
  DriveType?: string;
  BrakeSystemType?: string;
  ABS?: string;
  ESC?: string;
  TPMS?: string;
  AirBagLocations?: string;
  Trim?: string;
  Series?: string;
  BasePrice?: string;
  [key: string]: string | undefined;
}

/**
 * Validates VIN format and characters
 */
export function validateVINFormat(vin: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check length
  if (vin.length !== 17) {
    errors.push(`Invalid length: ${vin.length} characters (must be 17)`);
  }

  // Check for illegal characters (I, O, Q are not allowed)
  const illegalChars = vin.split('').filter(char => ['I', 'O', 'Q'].includes(char.toUpperCase()));
  if (illegalChars.length > 0) {
    errors.push(`Illegal characters found: ${illegalChars.join(', ')} (I, O, Q not allowed)`);
  }

  // Check that it only contains alphanumeric characters
  if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin)) {
    errors.push('VIN must only contain letters A-Z and numbers 0-9 (excluding I, O, Q)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate VIN check digit using weighted algorithm
 */
export function calculateCheckDigit(vin: string): string {
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  const transliteration: Record<string, number> = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  };

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i].toUpperCase();
    const value = transliteration[char] || 0;
    sum += value * weights[i];
  }

  const remainder = sum % 11;
  return remainder === 10 ? 'X' : remainder.toString();
}

/**
 * Validate VIN check digit
 */
export function validateCheckDigit(vin: string): boolean {
  if (vin.length !== 17) return false;

  const providedCheckDigit = vin[8].toUpperCase();
  const calculatedCheckDigit = calculateCheckDigit(vin);

  return providedCheckDigit === calculatedCheckDigit;
}

/**
 * Get manufacturer from WMI
 */
export function getManufacturer(wmi: string): string | undefined {
  // Try exact match first (3 characters)
  if (WMI_DATABASE[wmi]) {
    return WMI_DATABASE[wmi];
  }

  // Try first 2 characters
  const wmi2 = wmi.substring(0, 2);
  const match = Object.keys(WMI_DATABASE).find(key => key.startsWith(wmi2));
  if (match) {
    return WMI_DATABASE[match] + ' (partial match)';
  }

  return undefined;
}

/**
 * Get possible years from year code
 */
export function getPossibleYears(yearCode: string): number[] | undefined {
  return YEAR_CODES[yearCode.toUpperCase()];
}

/**
 * Get geographic region from first character
 */
export function getGeographicRegion(firstChar: string): string | undefined {
  return GEOGRAPHIC_REGIONS[firstChar.toUpperCase()];
}

/**
 * Detect market type based on WMI and VDS patterns
 */
function detectMarketType(vin: string, wmi: string, vds: string): 'North American' | 'European' | 'Asian' | 'Other' {
  const firstChar = vin[0];

  // North American
  if (['1', '2', '3', '4', '5'].includes(firstChar)) {
    return 'North American';
  }

  // European
  if (['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].includes(firstChar)) {
    return 'European';
  }

  // Asian
  if (['J', 'K', 'L', 'M', 'N', 'P', 'R'].includes(firstChar)) {
    return 'Asian';
  }

  // Check for VW Group European pattern (ZZZ in positions 4-6)
  if (vds.startsWith('ZZZ')) {
    return 'European';
  }

  return 'Other';
}

/**
 * Decode Mercedes-Benz specific VIN data
 */
function decodeMercedesBenz(vin: string, wmi: string, vds: string): ManufacturerSpecificData {
  const data: ManufacturerSpecificData = {
    notes: [],
  };

  // Comprehensive Mercedes model code database
  const modelCode = vds.substring(0, 2);
  const mercedesModels: Record<string, { series: string; name: string; body?: string }> = {
    // C-Class (W202, W203, W204, W205) - code 20
    '20': { series: 'C-Class/CLK/GLK/GLC', name: 'W202-W205 C-Class / CLK / GLK / GLC', body: 'Sedan/Wagon/SUV/Coupe' },
    // E-Class
    '30': { series: 'E-Class', name: 'W210/W211/W212/W213 E-Class', body: 'Sedan/Wagon' },
    '31': { series: 'E-Class', name: 'E-Class Coupe/Convertible' },
    // S-Class
    '40': { series: 'S-Class', name: 'W220/W221/W222 S-Class', body: 'Sedan' },
    '41': { series: 'S-Class', name: 'S-Class Long Wheelbase' },
    // A-Class / B-Class (codes 15-17)
    '15': { series: 'A-Class/GLA', name: 'W168-W176 A-Class / X156 GLA-Class', body: 'Hatchback/SUV' },
    '16': { series: 'A/B-Class/ML/GLE/GLS', name: 'A/B-Class / ML/GLE/GLS-Class', body: 'Hatchback/MPV/SUV' },
    '17': { series: 'B-Class/SLK', name: 'W245/W246 B-Class / R170-R172 SLK-Class', body: 'MPV/Roadster' },
    // CLS-Class
    '21': { series: 'CLS-Class', name: 'C219/C218 CLS-Class', body: 'Coupe Sedan' },
    // SL-Class
    '23': { series: 'SL-Class', name: 'R129/R230/R231 SL-Class', body: 'Roadster' },
    // ML-Class / GLE-Class
    '29': { series: 'ML/GLE', name: 'ML-Class / GLE-Class', body: 'SUV' },
    // G-Class
    '46': { series: 'G-Class', name: 'W460/W461/W463 G-Class', body: 'SUV' },
    // AMG Models
    '19': { series: 'AMG GT', name: 'C190 AMG GT', body: 'Coupe/Roadster' },
    // Sprinter / Vito Vans
    '90': { series: 'Sprinter', name: 'Sprinter Van', body: 'Commercial' },
    '63': { series: 'Vito', name: 'Vito Van', body: 'Commercial' },
  };

  const modelInfo = mercedesModels[modelCode];
  if (modelInfo) {
    data.modelSeries = modelInfo.series;
    data.modelName = modelInfo.name;
    if (modelInfo.body) {
      data.bodyStyle = modelInfo.body;
    }
  } else {
    data.modelSeries = `Model code: ${modelCode}`;
  }

  // Store model code for later refinement after year detection
  const rawModelCode = modelCode;

  // Body type from position 6 (vds[2])
  const bodyCode = vds[2];
  const bodyTypes: Record<string, string> = {
    '0': 'Sedan (4-door)',
    '1': 'Coupe (2-door)',
    '2': 'Wagon / Estate',
    '3': 'Convertible / Cabriolet',
    '4': 'Long wheelbase',
    '5': 'SUV / Off-road',
    '6': 'Van / Commercial',
    '7': 'Roadster',
  };
  if (!data.bodyStyle && bodyTypes[bodyCode]) {
    data.bodyStyle = bodyTypes[bodyCode];
  }

  // Steering position from VDS position 7 (character 3 in vds string)
  const steeringCode = vds[3];
  switch (steeringCode) {
    case '1':
      data.steeringPosition = 'Left-hand drive (Germany)';
      data.assemblyLocation = 'Germany';
      break;
    case '2':
      data.steeringPosition = 'Right-hand drive (Germany)';
      data.assemblyLocation = 'Germany';
      break;
    case '5':
      data.steeringPosition = 'Left-hand drive CKD';
      data.assemblyLocation = 'CKD (Complete Knock-Down) - Assembled outside Germany';
      break;
    case '6':
      data.steeringPosition = 'Right-hand drive CKD';
      data.assemblyLocation = 'CKD - Assembled outside Germany';
      break;
    default:
      data.steeringPosition = `Code: ${steeringCode}`;
  }

  // Transmission from VDS position 8 (character 4 in vds string)
  const transCode = vds[4];
  switch (transCode) {
    case '0':
      data.transmissionType = 'Manual transmission';
      break;
    case '1':
      data.transmissionType = 'Manual with hydraulic clutch';
      break;
    case '2':
      data.transmissionType = 'Automatic transmission';
      break;
    case '3':
      data.transmissionType = '4-speed automatic';
      data.transmissionGears = '4-speed';
      break;
    case '4':
      data.transmissionType = '5-speed automatic (5G-TRONIC)';
      data.transmissionGears = '5-speed';
      break;
    case '5':
      data.transmissionType = '7-speed automatic (7G-TRONIC)';
      data.transmissionGears = '7-speed';
      break;
    case '6':
      data.transmissionType = '9-speed automatic (9G-TRONIC)';
      data.transmissionGears = '9-speed';
      break;
    default:
      data.transmissionType = `Code: ${transCode}`;
  }

  // Restraint system (airbags) from WMI third character
  if (wmi[2] === 'B') {
    data.restraintSystem = 'Standard airbag system';
  } else if (wmi[2] === 'C') {
    data.restraintSystem = 'Advanced restraint system';
  } else if (wmi[2] === 'D') {
    data.restraintSystem = 'Multiple airbags + side protection';
  }

  // Market type
  data.marketType = detectMarketType(vin, wmi, vds);

  // Check if this is a European VIN and try to extract year from VDS
  if (data.marketType === 'European') {
    // Mercedes VINs encode year in last 2 digits of VDS (positions 7-8)
    const possibleYear = vds.substring(vds.length - 2);
    if (/^\d{2}$/.test(possibleYear)) {
      const yearNum = parseInt(possibleYear, 10);
      // Assume 00-39 = 2000-2039, 40-79 = 1940-1979, 80-99 = 1980-1999
      if (yearNum >= 80) {
        data.detectedYear = 1900 + yearNum;
      } else if (yearNum >= 40) {
        data.detectedYear = 1900 + yearNum;
      } else {
        data.detectedYear = 2000 + yearNum;
      }
      data.notes?.push(`Detected year ${data.detectedYear} from VDS (last 2 digits: "${possibleYear}")`);
    }
  }

  // Refine model identification based on detected year
  if (data.detectedYear && rawModelCode === '20') {
    // C-Class chassis codes by year
    if (data.detectedYear >= 1993 && data.detectedYear <= 2000) {
      data.modelName = 'W202 C-Class';
      data.modelSeries = 'C-Class (W202)';
    } else if (data.detectedYear >= 2000 && data.detectedYear <= 2007) {
      data.modelName = 'W203 C-Class';
      data.modelSeries = 'C-Class (W203)';
    } else if (data.detectedYear >= 2007 && data.detectedYear <= 2014) {
      data.modelName = 'W204 C-Class';
      data.modelSeries = 'C-Class (W204)';
    } else if (data.detectedYear >= 2014 && data.detectedYear <= 2021) {
      data.modelName = 'W205 C-Class';
      data.modelSeries = 'C-Class (W205)';
    } else if (data.detectedYear >= 2021) {
      data.modelName = 'W206 C-Class';
      data.modelSeries = 'C-Class (W206)';
    }
  } else if (data.detectedYear && rawModelCode === '30') {
    // E-Class chassis codes by year
    if (data.detectedYear >= 1995 && data.detectedYear <= 2002) {
      data.modelName = 'W210 E-Class';
      data.modelSeries = 'E-Class (W210)';
    } else if (data.detectedYear >= 2002 && data.detectedYear <= 2009) {
      data.modelName = 'W211 E-Class';
      data.modelSeries = 'E-Class (W211)';
    } else if (data.detectedYear >= 2009 && data.detectedYear <= 2016) {
      data.modelName = 'W212 E-Class';
      data.modelSeries = 'E-Class (W212)';
    } else if (data.detectedYear >= 2016) {
      data.modelName = 'W213 E-Class';
      data.modelSeries = 'E-Class (W213)';
    }
  } else if (data.detectedYear && rawModelCode === '40') {
    // S-Class chassis codes by year
    if (data.detectedYear >= 1998 && data.detectedYear <= 2005) {
      data.modelName = 'W220 S-Class';
      data.modelSeries = 'S-Class (W220)';
    } else if (data.detectedYear >= 2005 && data.detectedYear <= 2013) {
      data.modelName = 'W221 S-Class';
      data.modelSeries = 'S-Class (W221)';
    } else if (data.detectedYear >= 2013 && data.detectedYear <= 2020) {
      data.modelName = 'W222 S-Class';
      data.modelSeries = 'S-Class (W222)';
    } else if (data.detectedYear >= 2020) {
      data.modelName = 'W223 S-Class';
      data.modelSeries = 'S-Class (W223)';
    }
  } else if (data.detectedYear && rawModelCode === '16') {
    // A-Class / ML-Class disambiguation by year
    if (data.detectedYear >= 1997 && data.detectedYear <= 2004) {
      data.modelName = 'W168 A-Class';
      data.modelSeries = 'A-Class (W168)';
    } else if (data.detectedYear >= 2004 && data.detectedYear <= 2012) {
      data.modelName = 'W169 A-Class';
      data.modelSeries = 'A-Class (W169)';
    } else if (data.detectedYear >= 2012 && data.detectedYear <= 2018) {
      data.modelName = 'W176 A-Class';
      data.modelSeries = 'A-Class (W176)';
    } else if (data.detectedYear >= 2018) {
      data.modelName = 'W177 A-Class';
      data.modelSeries = 'A-Class (W177)';
    }
  }

  // Production plant from position 11
  const plantCode = vin[10];
  const plantMap: Record<string, string> = {
    'A': 'Sindelfingen, Germany',
    'B': 'Bremen, Germany',
    'C': 'Stuttgart-Untertürkheim, Germany',
    'D': 'Düsseldorf, Germany (Sprinter)',
    'E': 'Rastatt, Germany (A-Class)',
    'F': 'Tuscaloosa, Alabama, USA (M/GL/GLE-Class)',
    'G': 'Graz, Austria (G-Class)',
    'H': 'East London, South Africa',
    'J': 'Juiz de Fora, Brazil',
    'X': 'Vance, Alabama, USA',
  };
  if (plantMap[plantCode]) {
    data.productionPlant = plantMap[plantCode];
  }

  data.notes?.push('Mercedes-Benz uses manufacturer-specific VDS encoding');
  data.notes?.push('Position 9 may not be check digit for European models');
  data.notes?.push('Full engine and brake specifications require additional data sources');

  return data;
}

/**
 * Decode BMW specific VIN data
 */
function decodeBMW(vin: string, wmi: string, vds: string): ManufacturerSpecificData {
  const data: ManufacturerSpecificData = {
    notes: [],
  };

  // Model series from VDS position 4
  const seriesCode = vds[0];
  const seriesMap: Record<string, string> = {
    '1': '1 Series (Compact)',
    '2': '2 Series (Compact Coupe/Convertible/Active Tourer)',
    '3': '3 Series (Mid-size)',
    '4': '4 Series (Coupe/Convertible/Gran Coupe)',
    '5': '5 Series (Executive)',
    '6': '6 Series (Grand Tourer)',
    '7': '7 Series (Luxury)',
    '8': '8 Series (Luxury Coupe)',
    'X': 'X Series (SAV/SAC)',
    'Z': 'Z Series (Roadster)',
    'i': 'i Series (Electric/Plug-in Hybrid)',
  };
  data.modelSeries = seriesMap[seriesCode] || `Series code: ${seriesCode}`;

  // Detailed model based on series + body
  const bodyCode = vds[1];
  const fullModelCode = seriesCode + bodyCode;
  const detailedModels: Record<string, string> = {
    // 3 Series variants
    '3A': '3 Series Sedan',
    '3B': '3 Series Coupe (E46/E92)',
    '3C': '3 Series Convertible (E46/E93)',
    '3D': '3 Series Wagon/Touring',
    '3G': '3 Series Gran Turismo',
    // 5 Series variants
    '5A': '5 Series Sedan',
    '5B': '5 Series Gran Turismo',
    '5D': '5 Series Wagon/Touring',
    // 7 Series variants
    '7A': '7 Series Sedan',
    '7L': '7 Series Long Wheelbase',
    // X Series variants
    'XX': 'X1 (Compact SAV)',
    'X1': 'X1 (Compact SAV)',
    'X3': 'X3 (Mid-size SAV)',
    'X5': 'X5 (Mid-size SAV)',
    'X6': 'X6 (Sports Activity Coupe)',
    'X7': 'X7 (Full-size SAV)',
    // Z Series
    'ZA': 'Z3 Roadster',
    'ZC': 'Z3 Coupe',
    'ZR': 'Z4 Roadster',
    'Z4': 'Z4 (E85/E86/E89/G29)',
    // M Series
    'MA': 'M3 Sedan',
    'MB': 'M4 Coupe',
    'MC': 'M4 Convertible',
    'M5': 'M5 Sedan',
    'M6': 'M6 Coupe/Convertible',
    'MX': 'M Performance SAV',
    // i Series
    'iA': 'i3 (Electric)',
    'iB': 'i8 (Plug-in Hybrid)',
  };
  if (detailedModels[fullModelCode]) {
    data.modelName = detailedModels[fullModelCode];
  }

  // Body style from VDS position 5
  const bodyMap: Record<string, string> = {
    'A': 'Sedan (4-door)',
    'B': 'Coupe (2-door)',
    'C': 'Convertible / Cabriolet',
    'D': 'Wagon / Touring',
    'G': 'Gran Turismo / Gran Coupe (5-door)',
    'H': 'Hatchback',
    'L': 'Long wheelbase',
    'R': 'Roadster',
    'X': 'SAV (Sports Activity Vehicle) / SUV',
    'S': 'Sports Activity Coupe',
  };
  data.bodyStyle = bodyMap[bodyCode] || `Body code: ${bodyCode}`;

  // Engine displacement and type from VDS position 6
  const engineDispCode = vds[2];
  const engineDispMap: Record<string, string> = {
    'A': '1.6L - 2.0L (4-cylinder)',
    'B': '2.0L - 2.5L (4-cylinder)',
    'C': '2.5L - 3.0L (6-cylinder)',
    'D': '3.0L - 3.5L (6-cylinder)',
    'E': '3.5L - 4.0L (8-cylinder)',
    'F': '4.0L - 4.4L (8-cylinder)',
    'G': '4.4L+ (V8/V12)',
    'H': '5.0L+ (V10/V12)',
    'K': 'Electric motor',
    'U': 'Plug-in Hybrid',
  };
  if (engineDispMap[engineDispCode]) {
    data.engineDisplacement = engineDispMap[engineDispCode];
  }

  // Fuel type from VDS position 7
  const fuelCode = vds[3];
  const fuelMap: Record<string, string> = {
    'A': 'Gasoline / Petrol',
    'B': 'Diesel',
    'C': 'Hybrid (Gasoline + Electric)',
    'D': 'Electric (BEV)',
    'E': 'Plug-in Hybrid (PHEV)',
    'F': 'Flex fuel (E85)',
    'H': 'Hydrogen fuel cell',
  };
  data.fuelType = fuelMap[fuelCode] || `Fuel code: ${fuelCode}`;
  data.engineType = data.fuelType;

  // Restraint/safety system from VDS position 8
  const safetyCode = vds[4];
  const safetyMap: Record<string, string> = {
    '1': 'Standard airbag system',
    '2': 'Advanced airbag system',
    '3': 'Multiple airbags + side curtain',
    '4': 'Full safety package with rollover protection',
    '5': 'M Performance safety system',
  };
  data.restraintSystem = safetyMap[safetyCode] || `Safety code: ${safetyCode}`;
  data.safetySystem = data.restraintSystem;

  // Production plant from position 11
  const plantCode = vin[10];
  const plantMap: Record<string, string> = {
    'A': 'Munich, Germany',
    'B': 'Berlin, Germany',
    'C': 'Regensburg, Germany',
    'D': 'Dingolfing, Germany',
    'E': 'Eisenach, Germany',
    'G': 'Graz, Austria (Magna Steyr)',
    'J': 'Rosslyn, South Africa',
    'K': 'Leipzig, Germany',
    'L': 'Landshut, Germany',
    'M': 'Munich (M Division)',
    'S': 'Spartanburg, South Carolina, USA',
    'T': 'Thailand',
    'V': 'Shenyang, China (BMW Brilliance)',
    'W': 'Wackersdorf, Germany',
  };
  if (plantMap[plantCode]) {
    data.productionPlant = plantMap[plantCode];
  }

  data.marketType = detectMarketType(vin, wmi, vds);
  data.notes?.push('BMW uses consistent position 10 for model year');
  data.notes?.push('Position 9 is check digit for North American and Chinese models');

  // WMI-specific notes
  if (wmi === 'WBS') {
    data.notes?.push('WBS indicates BMW M GmbH (M Division factory model)');
    data.trim = 'M Performance / M Division';
  } else if (wmi === 'WBA') {
    data.notes?.push('WBA indicates standard BMW production');
  } else if (wmi === 'WBY') {
    data.notes?.push('WBY indicates BMW i Division (electric/hybrid)');
    data.trim = 'i Division (Electric/Hybrid)';
  }

  return data;
}

/**
 * Decode Volkswagen Group specific VIN data (VW, Audi, Porsche, SEAT, Skoda)
 */
function decodeVWGroup(vin: string, wmi: string, vds: string): ManufacturerSpecificData {
  const data: ManufacturerSpecificData = {
    notes: [],
  };

  // Detect European pattern (ZZZ in positions 4-6, Z in position 9)
  const isEuropeanPattern = vds.startsWith('ZZZ') && vin[8] === 'Z';

  if (isEuropeanPattern) {
    data.marketType = 'European';
    data.notes?.push('European market VIN detected (ZZZ_Z filler pattern)');

    // Only positions 7-8 contain meaningful data
    const platformCode = vds.substring(3, 5); // Positions 7-8
    data.platformCode = platformCode;

    // Comprehensive VW Group platform codes
    const platformMap: Record<string, { platform: string; models: string }> = {
      // VW platforms
      '1K': { platform: 'PQ35 / A5', models: 'Golf Mk5, Jetta Mk5, Touran' },
      '5K': { platform: 'PQ35 / A6', models: 'Golf Mk6' },
      '5G': { platform: 'MQB', models: 'Golf Mk7' },
      '3C': { platform: 'PQ46 / B6/B7', models: 'Passat B6/B7' },
      '3G': { platform: 'MQB', models: 'Passat B8' },
      '1T': { platform: 'PQ35', models: 'Tiguan Mk1' },
      '5N': { platform: 'MQB', models: 'Tiguan Mk2' },
      '7L': { platform: 'PQ45', models: 'Touareg Mk1' },
      '7P': { platform: 'PL71', models: 'Touareg Mk2' },
      '1P': { platform: 'A04/PQ34/PQ35', models: 'Polo Mk4 / SEAT Ibiza Mk4' },
      '6R': { platform: 'PQ25', models: 'Polo Mk5' },
      '2K': { platform: 'PQ34', models: 'Caddy Mk3' },
      '7H': { platform: 'T5', models: 'Transporter T5' },
      '7E': { platform: 'T6', models: 'Transporter T6' },
      // Audi platforms
      'AU': { platform: 'MLB / MQB', models: 'Audi A4/A5/A6/Q5' },
      'BU': { platform: 'MLB', models: 'Audi A6/A7/A8' },
      '8P': { platform: 'PQ35', models: 'Audi A3 Mk2' },
      '8V': { platform: 'MQB', models: 'Audi A3 Mk3' },
      '8T': { platform: 'B8', models: 'Audi A4 B8' },
      '8W': { platform: 'B9', models: 'Audi A4 B9' },
      '4F': { platform: 'C6', models: 'Audi A6 C6' },
      '4G': { platform: 'C7', models: 'Audi A6/A7 C7' },
      '4N': { platform: 'C8', models: 'Audi A6 C8' },
      '8U': { platform: 'PQ35', models: 'Audi Q3 Mk1' },
      '8R': { platform: 'MLB', models: 'Audi Q5 Mk1' },
      '4L': { platform: 'PL71', models: 'Audi Q7 Mk1' },
      // Porsche platforms
      '97': { platform: '997', models: 'Porsche 911 (997)' },
      '99': { platform: '991', models: 'Porsche 911 (991/992)' },
      '98': { platform: '987/981/982', models: 'Porsche Boxster/Cayman' },
      '92': { platform: 'E2', models: 'Porsche Cayenne Mk1/Mk2' },
      '95': { platform: 'E3/95B', models: 'Porsche Cayenne Mk3 / Porsche Macan' },
      // Škoda platforms
      '1Z': { platform: 'PQ35', models: 'Škoda Octavia Mk2' },
      '5E': { platform: 'MQB', models: 'Škoda Octavia Mk3' },
      '3T': { platform: 'PQ46', models: 'Škoda Superb Mk2' },
      '3V': { platform: 'MQB', models: 'Škoda Superb Mk3' },
      '5L': { platform: 'MQB', models: 'Škoda Kodiaq' },
      // SEAT platforms
      '6J': { platform: 'PQ25', models: 'SEAT Ibiza Mk5' },
      '1M': { platform: 'PQ35', models: 'SEAT Leon Mk2' },
      '5F': { platform: 'MQB', models: 'SEAT Leon Mk3' },
      '7N': { platform: 'MQB', models: 'SEAT Ateca' },
    };

    const platformInfo = platformMap[platformCode];
    if (platformInfo) {
      data.modelSeries = platformInfo.models;
      data.modelName = platformInfo.models;
      data.notes?.push(`Platform: ${platformInfo.platform}`);
    } else {
      data.modelSeries = `Platform code: ${platformCode}`;
    }

    // Year code check
    const yearCode = vin[9];
    if (yearCode === '0') {
      data.notes?.push('Position 10 = "0" indicates model year not encoded (common for European VW)');
    }

  } else {
    // North American or other market - full VDS available
    data.marketType = detectMarketType(vin, wmi, vds);
    data.notes?.push('North American market VIN - full VDS data available');

    // For NA VINs, we can decode more from VDS
    const modelCode = vds.substring(0, 2);
    const bodyCode = vds[2];
    const engineCode = vds[3];
    const restraintCode = vds[4];

    data.engineCode = `Engine: ${engineCode}`;
    data.restraintSystem = `Restraint code: ${restraintCode}`;
  }

  // Brand-specific details based on WMI
  if (wmi.startsWith('WVW') || wmi.startsWith('WVG') || wmi.startsWith('3VW')) {
    data.notes?.push('Volkswagen brand');
    // VW production plants
    const plantCode = vin[10];
    const vwPlants: Record<string, string> = {
      'W': 'Wolfsburg, Germany (Main plant)',
      'E': 'Emden, Germany',
      'H': 'Hanover, Germany',
      'K': 'Osnabrück, Germany',
      'M': 'Puebla, Mexico',
      'P': 'Pamplona, Spain',
      'S': 'Stuttgart, Germany',
      'T': 'Transparent Factory, Dresden, Germany',
    };
    if (vwPlants[plantCode]) {
      data.productionPlant = vwPlants[plantCode];
    }
  } else if (wmi.startsWith('WAU') || wmi === 'TRU' || wmi.startsWith('LFV')) {
    data.notes?.push('Audi brand');
    // Audi production plants
    const plantCode = vin[10];
    const audiPlants: Record<string, string> = {
      'N': 'Neckarsulm, Germany',
      'I': 'Ingolstadt, Germany',
      'G': 'Győr, Hungary',
      'B': 'Brussels, Belgium',
      'M': 'Martorell, Spain (SEAT factory)',
    };
    if (audiPlants[plantCode]) {
      data.productionPlant = audiPlants[plantCode];
    }
  } else if (wmi.startsWith('WP0') || wmi.startsWith('WP1')) {
    data.notes?.push('Porsche brand');
    if (wmi === 'WP0') {
      data.modelSeries = 'Sports car (911, 718 Boxster/Cayman)';
      data.bodyStyle = 'Coupe / Roadster';
    } else if (wmi === 'WP1') {
      data.modelSeries = 'SUV (Cayenne, Macan)';
      data.bodyStyle = 'SUV';
    }
    // Porsche production plants
    const plantCode = vin[10];
    const porschePlants: Record<string, string> = {
      'S': 'Stuttgart-Zuffenhausen, Germany',
      'L': 'Leipzig, Germany',
      'B': 'Bratislava, Slovakia (assembly)',
      'O': 'Osnabrück, Germany (Boxster/Cayman)',
    };
    if (porschePlants[plantCode]) {
      data.productionPlant = porschePlants[plantCode];
    }
  } else if (wmi === 'TMB' || wmi.startsWith('XW8')) {
    data.notes?.push('Škoda brand (Czech Republic)');
    data.productionPlant = 'Mladá Boleslav, Czech Republic (primary)';
  } else if (wmi.startsWith('VSS') || wmi.startsWith('VSX')) {
    data.notes?.push('SEAT brand (Spain)');
    data.productionPlant = 'Martorell, Barcelona, Spain';
  }

  return data;
}

/**
 * Decode Volvo specific VIN data
 */
function decodeVolvo(vin: string, wmi: string, vds: string): ManufacturerSpecificData {
  const data: ManufacturerSpecificData = {
    notes: [],
  };

  data.marketType = detectMarketType(vin, wmi, vds);
  data.notes?.push('Volvo consistently uses position 9 as check digit (even for European models)');
  data.notes?.push('Volvo VINs primarily designed for North American market compliance');

  // WMI-specific vehicle type
  const wmiType: Record<string, string> = {
    'YV1': 'Passenger car',
    'YV2': 'Truck',
    'YV3': 'Bus',
    'YV4': 'Multipurpose passenger vehicle',
  };
  data.bodyStyle = wmiType[wmi] || 'Unknown';

  return data;
}

/**
 * Decode Fiat/Alfa Romeo specific VIN data
 */
function decodeFiatAlfa(vin: string, wmi: string, vds: string): ManufacturerSpecificData {
  const data: ManufacturerSpecificData = {
    notes: [],
  };

  data.marketType = detectMarketType(vin, wmi, vds);

  if (wmi === 'ZFA' || wmi === 'ZFC') {
    data.notes?.push('Fiat brand');
  } else if (wmi === 'ZAR') {
    data.notes?.push('Alfa Romeo brand');
  }

  data.notes?.push('WARNING: Fiat uses DIFFERENT check digit algorithms for European vs. North American models');
  data.notes?.push('European Fiat VINs may fail standard ISO 3779 check digit validation');

  return data;
}

/**
 * Decode Jaguar/Land Rover specific VIN data
 */
function decodeJaguarLandRover(vin: string, wmi: string, vds: string): ManufacturerSpecificData {
  const data: ManufacturerSpecificData = {
    notes: [],
  };

  data.marketType = detectMarketType(vin, wmi, vds);

  if (wmi === 'SAJ') {
    data.notes?.push('Jaguar brand');
  } else if (wmi === 'SAL') {
    data.notes?.push('Land Rover brand (most common)');
  } else if (wmi === 'SAD') {
    data.notes?.push('Built outside Solihull facility');
  }

  data.notes?.push('Follows standard ISO 3779 with check digit validation');
  data.notes?.push('Position 11 indicates assembly plant');

  return data;
}

/**
 * Decode Toyota/Lexus specific VIN data
 */
function decodeToyota(vin: string, wmi: string, vds: string): ManufacturerSpecificData {
  const data: ManufacturerSpecificData = {
    notes: [],
  };

  data.marketType = detectMarketType(vin, wmi, vds);

  // Model series from VDS positions 4-5
  const modelCode = vds.substring(0, 2);
  const toyotaModels: Record<string, string> = {
    'AE': 'Corolla',
    'AL': 'Camry (North America)',
    'AP': 'Camry (Asia/Europe)',
    'AR': 'RAV4',
    'AT': 'Avalon',
    'BZ': 'bZ4X (Electric)',
    'CP': 'Yaris',
    'EB': 'Highlander',
    'EM': 'Sienna',
    'GR': 'GR86 / 86',
    'GS': 'Crown',
    'GX': '4Runner / GX (Lexus)',
    'JT': 'Land Cruiser / Prado',
    'KD': 'Tacoma',
    'KE': 'Tundra',
    'MA': 'Prius',
    'MC': 'Mirai (Hydrogen)',
    'NX': 'NX (Lexus)',
    'RX': 'RX (Lexus)',
    'SB': 'Supra',
    'UC': 'Sequoia',
    'UZ': 'LS (Lexus)',
    'VZ': 'LX (Lexus)',
    'XP': 'C-HR',
    'XU': 'Corolla Cross',
    'ZN': 'bZ3 (Electric)',
  };
  if (toyotaModels[modelCode]) {
    data.modelSeries = toyotaModels[modelCode];
    data.modelName = toyotaModels[modelCode];
  } else {
    data.modelSeries = `Model code: ${modelCode}`;
  }

  // Body style from VDS position 6
  const bodyCode = vds[2];
  const bodyMap: Record<string, string> = {
    '1': 'Standard cab / 2-door',
    '2': 'Extended cab / 4-door sedan',
    '3': '4-door wagon / SUV',
    '4': '5-door hatchback',
    '5': 'Crew cab / Long wheelbase',
    '6': 'Convertible',
    '7': 'Van / Minivan',
  };
  if (bodyMap[bodyCode]) {
    data.bodyStyle = bodyMap[bodyCode];
  }

  // Engine type from VDS position 7
  const engineCode = vds[3];
  const engineMap: Record<string, string> = {
    'A': '1.5L - 1.8L 4-cylinder',
    'B': '2.0L 4-cylinder',
    'C': '2.4L 4-cylinder',
    'D': '2.5L 4-cylinder',
    'E': '3.0L V6',
    'F': '3.5L V6',
    'G': '4.0L V6',
    'H': '4.6L V8 / 5.7L V8',
    'J': 'Hybrid (Gasoline + Electric)',
    'K': 'Plug-in Hybrid',
    'L': 'Electric (BEV)',
    'M': 'Hydrogen Fuel Cell',
    'T': 'Turbocharged',
  };
  if (engineMap[engineCode]) {
    data.engineType = engineMap[engineCode];
    data.engineDisplacement = engineMap[engineCode];
  }

  // Safety/restraint system from VDS position 8
  const restraintCode = vds[4];
  const restraintMap: Record<string, string> = {
    '1': 'Standard airbags (driver + passenger)',
    '2': 'Side airbags included',
    '3': 'Curtain airbags + side airbags',
    '4': 'Advanced safety system (Toyota Safety Sense)',
    '5': 'Full safety package + Pre-Collision',
  };
  if (restraintMap[restraintCode]) {
    data.restraintSystem = restraintMap[restraintCode];
  }

  // Production plant from position 11
  const plantCode = vin[10];
  const toyotaPlants: Record<string, string> = {
    'A': 'Takaoka, Japan',
    'B': 'Burnaston, UK (now closed)',
    'C': 'Cambridge, Ontario, Canada',
    'J': 'Tahara, Japan',
    'K': 'Kyushu, Japan',
    'M': 'Motomachi, Japan',
    'N': 'Tsutsumi, Japan',
    'P': 'Princeton, Indiana, USA',
    'S': 'Georgetown, Kentucky, USA',
    'T': 'Toyota City, Japan',
    'U': 'Blue Springs, Mississippi, USA',
    'X': 'San Antonio, Texas, USA',
    'Y': 'Yoshiwara, Japan',
    'Z': 'Fremont, California, USA (NUMMI, now Tesla)',
  };
  if (toyotaPlants[plantCode]) {
    data.productionPlant = toyotaPlants[plantCode];
  }

  // Brand detection
  if (wmi[0] === 'J' || wmi.startsWith('JT')) {
    data.notes?.push('Toyota brand (Japan)');
  } else if (wmi.startsWith('4T') || wmi.startsWith('5T')) {
    data.notes?.push('Toyota brand (North America)');
  }

  data.notes?.push('Toyota uses consistent check digit validation');
  data.notes?.push('Position 10 reliably encodes model year');

  return data;
}

/**
 * Decode Honda/Acura specific VIN data
 */
function decodeHonda(vin: string, wmi: string, vds: string): ManufacturerSpecificData {
  const data: ManufacturerSpecificData = {
    notes: [],
  };

  data.marketType = detectMarketType(vin, wmi, vds);

  // Model series from VDS
  const modelCode = vds.substring(0, 2);
  const hondaModels: Record<string, string> = {
    'BH': 'Accord',
    'CF': 'Accord (6th gen)',
    'CG': 'Accord (6th gen)',
    'EJ': 'Civic (6th gen)',
    'EM': 'Civic (7th gen)',
    'ES': 'Civic (8th gen)',
    'FA': 'Civic Si (8th gen)',
    'FB': 'Civic (9th gen)',
    'FC': 'Civic (10th gen)',
    'FL': 'Civic (11th gen)',
    'GE': 'Fit / Jazz',
    'GK': 'Fit / Jazz',
    'HR': 'HR-V',
    'KB': 'Odyssey',
    'RL': 'Odyssey',
    'RD': 'CR-V',
    'RE': 'CR-V',
    'RM': 'CR-V',
    'RW': 'CR-V (6th gen)',
    'RT': 'Ridgeline',
    'TC': 'Pilot',
    'YF': 'Pilot',
    'ZE': 'Insight (Hybrid)',
    'ZX': 'CR-Z (Hybrid)',
  };
  if (hondaModels[modelCode]) {
    data.modelSeries = hondaModels[modelCode];
    data.modelName = hondaModels[modelCode];
  } else {
    data.modelSeries = `Model code: ${modelCode}`;
  }

  // Body style from VDS position 6
  const bodyCode = vds[2];
  const bodyMap: Record<string, string> = {
    '1': '2-door coupe',
    '2': '2-door hatchback',
    '3': '3-door hatchback',
    '4': '4-door sedan',
    '5': '5-door hatchback / wagon',
    '6': 'SUV / Crossover',
    '7': 'Minivan',
    '8': 'Pickup truck',
  };
  if (bodyMap[bodyCode]) {
    data.bodyStyle = bodyMap[bodyCode];
  }

  // Engine type from VDS position 7
  const engineCode = vds[3];
  const engineMap: Record<string, string> = {
    'A': '1.5L 4-cylinder',
    'B': '1.8L 4-cylinder',
    'C': '2.0L 4-cylinder',
    'D': '2.4L 4-cylinder',
    'E': '3.0L V6',
    'F': '3.5L V6',
    'G': '3.7L V6',
    'H': 'Hybrid (i-MMD)',
    'J': 'Turbocharged',
    'K': 'Plug-in Hybrid',
    'T': 'VTEC Turbo',
  };
  if (engineMap[engineCode]) {
    data.engineType = engineMap[engineCode];
    data.engineDisplacement = engineMap[engineCode];
  }

  // Transmission info from VDS position 8
  const transCode = vds[4];
  const transMap: Record<string, string> = {
    '1': 'Manual transmission',
    '2': 'Automatic transmission (4-speed)',
    '3': 'Automatic transmission (5-speed)',
    '4': 'CVT (Continuously Variable Transmission)',
    '5': 'Automatic transmission (6-speed)',
    '6': 'Automatic transmission (8-speed)',
    '7': '9-speed automatic',
    '8': '10-speed automatic',
    '9': 'Hybrid e-CVT',
  };
  if (transMap[transCode]) {
    data.transmissionType = transMap[transCode];
  }

  // Production plant from position 11
  const plantCode = vin[10];
  const hondaPlants: Record<string, string> = {
    'A': 'Marysville, Ohio, USA',
    'C': 'East Liberty, Ohio, USA',
    'E': 'Anna, Ohio, USA (Engine plant)',
    'G': 'Greensburg, Indiana, USA',
    'H': 'Saitama, Japan',
    'J': 'Suzuka, Japan',
    'K': 'Kumamoto, Japan',
    'L': 'Lincoln, Alabama, USA',
    'M': 'Sayama, Japan',
    'R': 'Russell\'s Point, Ohio, USA',
    'S': 'Swindon, UK',
    'T': 'Tochigi, Japan',
    'Y': 'Yorii, Japan',
  };
  if (hondaPlants[plantCode]) {
    data.productionPlant = hondaPlants[plantCode];
  }

  // Brand detection
  if (wmi.startsWith('1H') || wmi.startsWith('2H') || wmi.startsWith('JHM')) {
    data.notes?.push('Honda brand');
  } else if (wmi.startsWith('19U')) {
    data.notes?.push('Acura brand (Honda luxury division)');
  }

  data.notes?.push('Honda uses consistent check digit validation');
  data.notes?.push('Well-structured VDS with reliable model/engine/trim encoding');

  return data;
}

/**
 * Decode Ford/Lincoln specific VIN data
 */
function decodeFord(vin: string, wmi: string, vds: string): ManufacturerSpecificData {
  const data: ManufacturerSpecificData = {
    notes: [],
  };

  data.marketType = detectMarketType(vin, wmi, vds);

  // Model/platform from VDS positions 4-5
  const modelCode = vds.substring(0, 2);
  const fordModels: Record<string, string> = {
    'AB': 'Explorer',
    'AF': 'F-150',
    'BF': 'F-Series Super Duty',
    'BL': 'Mustang',
    'CA': 'Edge',
    'CB': 'Escape',
    'CD': 'Focus',
    'CE': 'Fusion',
    'CF': 'Fiesta',
    'CJ': 'Taurus',
    'DA': 'Ranger',
    'DE': 'Expedition',
    'DJ': 'Bronco',
    'EB': 'EcoSport',
    'EC': 'E-Series Van',
    'EK': 'Mustang Mach-E (Electric)',
    'F1': 'F-150 Lightning (Electric)',
    'JB': 'Transit',
    'JC': 'Transit Connect',
    'K8': 'Super Duty',
    'KD': 'Maverick',
    'MK': 'Lincoln MKZ',
    'ML': 'Lincoln MKX / Nautilus',
    'MT': 'Lincoln MKT',
    'U2': 'Bronco Sport',
  };
  if (fordModels[modelCode]) {
    data.modelSeries = fordModels[modelCode];
    data.modelName = fordModels[modelCode];
  } else {
    data.modelSeries = `Model code: ${modelCode}`;
  }

  // Body style from VDS position 6
  const bodyCode = vds[2];
  const bodyMap: Record<string, string> = {
    '1': '2-door coupe',
    '2': '2-door convertible',
    '3': '4-door sedan',
    '4': '4-door wagon',
    '5': '5-door hatchback',
    '6': 'SUV / Crossover',
    '7': 'Pickup truck',
    '8': 'Van / Commercial',
  };
  if (bodyMap[bodyCode]) {
    data.bodyStyle = bodyMap[bodyCode];
  }

  // Engine type from VDS position 7
  const engineCode = vds[3];
  const engineMap: Record<string, string> = {
    'A': '1.5L EcoBoost (3-cylinder)',
    'B': '1.6L / 2.0L EcoBoost (4-cylinder)',
    'C': '2.3L EcoBoost (4-cylinder)',
    'D': '2.5L Duratec (4-cylinder)',
    'E': '2.7L EcoBoost V6',
    'F': '3.0L EcoBoost V6',
    'G': '3.5L EcoBoost V6',
    'H': '3.7L V6',
    'J': '5.0L V8 (Coyote)',
    'K': '5.2L V8 (Voodoo/Predator - Shelby)',
    'L': '6.2L V8',
    'M': '6.7L Power Stroke Diesel V8',
    'N': '7.3L V8 (Godzilla)',
    'P': 'Hybrid Powertrain',
    'R': 'Electric (BEV)',
    'W': '3.3L V6 (Hybrid)',
  };
  if (engineMap[engineCode]) {
    data.engineType = engineMap[engineCode];
    data.engineDisplacement = engineMap[engineCode];
  }

  // Transmission from VDS position 8
  const transCode = vds[4];
  const transMap: Record<string, string> = {
    '1': 'Manual transmission',
    '4': '4-speed automatic',
    '5': '5-speed manual',
    '6': '6-speed automatic / manual',
    '7': '7-speed DCT (PowerShift)',
    '8': '8-speed automatic',
    '9': '10-speed automatic',
    'A': 'SelectShift automatic',
  };
  if (transMap[transCode]) {
    data.transmissionType = transMap[transCode];
  }

  // Production plant from position 11
  const plantCode = vin[10];
  const fordPlants: Record<string, string> = {
    'A': 'Atlanta, Georgia, USA (now closed)',
    'B': 'Oakville, Ontario, Canada',
    'C': 'Ontario Truck, Canada',
    'D': 'Dearborn, Michigan, USA',
    'E': 'Kentucky Truck, Louisville, USA',
    'F': 'Flat Rock, Michigan, USA',
    'H': 'Chicago Assembly, Illinois, USA',
    'J': 'Kansas City Assembly, Missouri, USA',
    'K': 'Claycomo, Missouri, USA',
    'L': 'Michigan Truck, Wayne, USA',
    'N': 'Norfolk, Virginia, USA',
    'P': 'Twin Cities Assembly, Minnesota, USA',
    'R': 'Dearborn Truck, Michigan, USA',
    'S': 'Pilot Plant, Allen Park, Michigan, USA',
    'T': 'Rouge Complex, Dearborn, Michigan, USA',
    'U': 'Louisville Assembly, Kentucky, USA',
    'W': 'Wayne Assembly, Michigan, USA',
  };
  if (fordPlants[plantCode]) {
    data.productionPlant = fordPlants[plantCode];
  }

  // Brand detection
  if (wmi.startsWith('1F') || wmi.startsWith('2F') || wmi.startsWith('3F')) {
    data.notes?.push('Ford brand');
  } else if (wmi.startsWith('1L') || wmi.startsWith('5L')) {
    data.notes?.push('Lincoln brand (Ford luxury division)');
  }

  data.notes?.push('Ford uses consistent check digit validation');
  data.notes?.push('Extensive platform sharing across models');

  return data;
}

/**
 * Get manufacturer-specific decoded data
 */
function getManufacturerSpecificData(vin: string, wmi: string, vds: string): ManufacturerSpecificData | undefined {
  // Mercedes-Benz
  if (wmi.startsWith('WDB') || wmi.startsWith('WDD') || wmi.startsWith('WDC')) {
    return decodeMercedesBenz(vin, wmi, vds);
  }

  // BMW
  if (wmi.startsWith('WBA') || wmi.startsWith('WBS') || wmi.startsWith('WBY')) {
    return decodeBMW(vin, wmi, vds);
  }

  // Volkswagen Group
  if (
    wmi.startsWith('WVW') || wmi.startsWith('WVG') || wmi.startsWith('3VW') || // VW
    wmi.startsWith('WAU') || wmi === 'TRU' || wmi.startsWith('LFV') || // Audi
    wmi.startsWith('WP0') || wmi.startsWith('WP1') || // Porsche
    wmi === 'TMB' || wmi.startsWith('XW8') || // Skoda
    wmi.startsWith('VSS') || wmi.startsWith('VSX') // SEAT
  ) {
    return decodeVWGroup(vin, wmi, vds);
  }

  // Volvo
  if (wmi.startsWith('YV')) {
    return decodeVolvo(vin, wmi, vds);
  }

  // Fiat/Alfa Romeo
  if (wmi.startsWith('ZFA') || wmi.startsWith('ZFC') || wmi === 'ZAR') {
    return decodeFiatAlfa(vin, wmi, vds);
  }

  // Jaguar/Land Rover
  if (wmi === 'SAJ' || wmi === 'SAL' || wmi === 'SAD') {
    return decodeJaguarLandRover(vin, wmi, vds);
  }

  // Opel/Vauxhall
  if (wmi.startsWith('W0L') || wmi.startsWith('W0V')) {
    return {
      notes: [
        'Opel/Vauxhall brand (now part of Stellantis)',
        'Uses check digit validation',
        'Position 10 encodes model year'
      ],
      marketType: 'European',
    };
  }

  // Toyota/Lexus
  if (
    wmi.startsWith('4T') || wmi.startsWith('5T') || // Toyota (USA)
    wmi.startsWith('JT') || wmi.startsWith('2T') || // Toyota (Japan/Canada)
    wmi.startsWith('JF') // Lexus (Japan)
  ) {
    return decodeToyota(vin, wmi, vds);
  }

  // Honda/Acura
  if (
    wmi.startsWith('1H') || wmi.startsWith('2H') || wmi.startsWith('5H') || // Honda (USA/Canada)
    wmi.startsWith('JH') || wmi.startsWith('SHS') || // Honda (Japan/UK)
    wmi.startsWith('19U') // Acura
  ) {
    return decodeHonda(vin, wmi, vds);
  }

  // Ford/Lincoln
  if (
    wmi.startsWith('1F') || wmi.startsWith('2F') || wmi.startsWith('3F') || // Ford (USA/Canada/Mexico)
    wmi.startsWith('1L') || wmi.startsWith('5L') || // Lincoln
    wmi.startsWith('WF0') // Ford (Germany)
  ) {
    return decodeFord(vin, wmi, vds);
  }

  return undefined;
}

/**
 * Decode VIN using NHTSA vPIC API
 * FREE API - No registration required
 * API Documentation: https://vpic.nhtsa.dot.gov/api/
 */
export async function decodeVINWithNHTSA(vin: string): Promise<NHTSADecodedData | null> {
  const NHTSA_API = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  try {
    const response = await fetch(
      `${NHTSA_API}/DecodeVin/${vin}?format=json`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('NHTSA API request failed:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data.Results || data.Results.length === 0) {
      console.error('No results from NHTSA API');
      return null;
    }

    // Convert array of {Variable, Value} objects to a keyed object
    const nhtsaData: NHTSADecodedData = {};
    data.Results.forEach((item: any) => {
      if (item.Value && item.Value !== 'Not Applicable' && item.Value !== '') {
        nhtsaData[item.Variable] = item.Value;
      }
    });

    return nhtsaData;
  } catch (error) {
    console.error('Error calling NHTSA API:', error);
    return null;
  }
}

/**
 * Create vehicle mapping from decoded VIN data for database matching
 */
function createVehicleMapping(decodedData: VINDecodedData): VehicleMapping | undefined {
  // Determine year
  let year: number | undefined;
  if (decodedData.manufacturerSpecific?.detectedYear) {
    year = decodedData.manufacturerSpecific.detectedYear;
  } else if (decodedData.nhtsaData?.ModelYear) {
    year = parseInt(decodedData.nhtsaData.ModelYear);
  } else if (decodedData.possibleYears && decodedData.possibleYears.length > 0) {
    year = decodedData.possibleYears[decodedData.possibleYears.length - 1]; // Use most recent year
  }

  // Determine make
  let make: string | undefined;
  if (decodedData.nhtsaData?.Make) {
    make = decodedData.nhtsaData.Make;
  } else if (decodedData.manufacturer) {
    // Extract just the brand name from WMI description
    make = decodedData.manufacturer.split(' ')[0]; // e.g., "Mercedes-Benz (Germany)" -> "Mercedes-Benz"
  }

  // Determine model
  let model: string | undefined;
  if (decodedData.nhtsaData?.Model) {
    model = decodedData.nhtsaData.Model;
  } else if (decodedData.manufacturerSpecific?.modelName) {
    model = decodedData.manufacturerSpecific.modelName;
  }

  if (!make || !model || !year) {
    return undefined;
  }

  const mapping: VehicleMapping = {
    make,
    model,
    year,
    trim: decodedData.nhtsaData?.Trim || decodedData.manufacturerSpecific?.trim,
    bodyStyle: decodedData.nhtsaData?.BodyClass || decodedData.manufacturerSpecific?.bodyStyle,
    engineDisplacement: decodedData.manufacturerSpecific?.engineDisplacement,
    engineCode: decodedData.manufacturerSpecific?.engineCode,
    // Create search query for database matching
    searchQuery: `${year} ${make} ${model}`.trim(),
  };

  return mapping;
}

/**
 * Enhanced VIN decoder with optional NHTSA API integration
 * @param vin - VIN to decode
 * @param useAPI - Whether to call NHTSA API for enhanced data (default: false for offline mode)
 */
export async function decodeVINEnhanced(vin: string, useAPI: boolean = false): Promise<VINDecodedData> {
  // First decode using our local database
  const localData = decodeVIN(vin);

  // If API is requested and VIN is valid, fetch NHTSA data
  if (useAPI && localData.isValid) {
    try {
      const nhtsaData = await decodeVINWithNHTSA(vin);
      if (nhtsaData) {
        localData.nhtsaData = nhtsaData;
        localData.notes.push('Enhanced with NHTSA vPIC API data');

        // If our local decoder didn't find the manufacturer, use NHTSA's
        if (!localData.manufacturer && nhtsaData.Make) {
          localData.notes.push(`Manufacturer from NHTSA: ${nhtsaData.Make}`);
        }
      }
    } catch (error) {
      localData.notes.push('NHTSA API call failed - using local data only');
    }
  }

  // Create vehicle mapping for database matching
  const vehicleMapping = createVehicleMapping(localData);
  if (vehicleMapping) {
    localData.vehicleMapping = vehicleMapping;
    localData.notes.push(`Vehicle mapping: ${vehicleMapping.searchQuery}`);
  }

  return localData;
}

/**
 * Main VIN decoder function (offline mode - uses local database only)
 */
export function decodeVIN(vin: string): VINDecodedData {
  const normalizedVIN = vin.toUpperCase().trim();
  const validation = validateVINFormat(normalizedVIN);

  if (!validation.isValid) {
    return {
      isValid: false,
      vin: normalizedVIN,
      wmi: '',
      vds: '',
      vis: '',
      checkDigit: '',
      yearCode: '',
      plantCode: '',
      serialNumber: '',
      errors: validation.errors,
      notes: [],
    };
  }

  const errors: string[] = [];
  const notes: string[] = [];

  // Parse VIN components first
  const wmi = normalizedVIN.substring(0, 3);
  const vds = normalizedVIN.substring(3, 8);
  const vis = normalizedVIN.substring(8, 17);
  const checkDigit = normalizedVIN[8];
  const yearCode = normalizedVIN[9];
  const plantCode = normalizedVIN[10];
  const serialNumber = normalizedVIN.substring(11, 17);

  // Decode information
  const manufacturer = getManufacturer(wmi);
  const region = getGeographicRegion(normalizedVIN[0]);
  const possibleYears = getPossibleYears(yearCode);

  // Detect if this is a European/Asian VIN (may not use North American check digit algorithm)
  const firstChar = normalizedVIN[0];
  const isNorthAmerican = ['1', '2', '3', '4', '5'].includes(firstChar);

  // Validate check digit (strict for North America, warning for others)
  const checkDigitValid = validateCheckDigit(normalizedVIN);
  if (!checkDigitValid) {
    if (isNorthAmerican) {
      errors.push('Check digit validation failed (position 9)');
    } else {
      notes.push('Check digit validation failed - European/Asian VINs may use different algorithms or position 9 for other data');
    }
  }

  if (!manufacturer) {
    errors.push('Manufacturer not found in database (WMI unknown)');
  }

  if (!possibleYears) {
    errors.push('Invalid year code');
  }

  // Get manufacturer-specific decoded data
  const manufacturerSpecific = getManufacturerSpecificData(normalizedVIN, wmi, vds);

  // If manufacturer-specific data has notes, add them to notes array
  if (manufacturerSpecific?.notes) {
    notes.push(...manufacturerSpecific.notes);
  }

  return {
    isValid: validation.isValid && (isNorthAmerican ? checkDigitValid : true),
    vin: normalizedVIN,
    wmi,
    vds,
    vis,
    checkDigit,
    yearCode,
    plantCode,
    serialNumber,
    manufacturer,
    region,
    possibleYears,
    manufacturerSpecific,
    errors,
    notes,
  };
}

/**
 * Generate YAML structure suggestion for database organization
 */
export function generateYAMLStructure(decodedVIN: VINDecodedData): string {
  if (!decodedVIN.isValid || !decodedVIN.manufacturer) {
    return '# Unable to generate structure - invalid VIN';
  }

  const manufacturerKey = decodedVIN.wmi;
  const vdsKey = decodedVIN.vds;
  const year = decodedVIN.possibleYears?.[1] || decodedVIN.possibleYears?.[0] || 'YYYY';

  return `# Database Organization Structure (YAML)
# Based on VIN: ${decodedVIN.vin}

manufacturers:
  ${manufacturerKey}:  # ${decodedVIN.manufacturer}
    name: "${decodedVIN.manufacturer}"
    region: "${decodedVIN.region}"
    wmi: "${manufacturerKey}"

    vehicle_configurations:
      ${vdsKey}:  # Vehicle Descriptor Section
        vds: "${vdsKey}"
        description: "Auto-detected from VIN"

        year_ranges:
          ${year}:
            model_year: ${year}
            year_code: "${decodedVIN.yearCode}"

            # OEM Specifications
            oem_specs:
              bolt_pattern: "5x114.3"  # Example
              hub_bore: "64.1"         # Example
              offset_range: [40, 50]   # Example

            # Compatible Wheels
            compatible_wheels:
              - wheel_id: "wheel_001"
                fitment_notes: "OEM fitment"
              - wheel_id: "wheel_002"
                fitment_notes: "Aftermarket option"

            # OEM Brake Specifications
            brake_specs:
              front:
                rotor_diameter: "320mm"  # Example
                rotor_thickness: "28mm"
                pad_type: "D1210"
              rear:
                rotor_diameter: "300mm"
                rotor_thickness: "12mm"
                pad_type: "D1211"

    # VIN Index (for quick lookups)
    vin_index:
      - vin: "${decodedVIN.vin}"
        vehicle_config: "${vdsKey}"
        year: ${year}
        plant_code: "${decodedVIN.plantCode}"
        serial: "${decodedVIN.serialNumber}"`;
}
