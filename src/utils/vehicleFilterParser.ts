export interface ParsedVehicleFilters {
  brand?: string[];
  boltPattern?: string[];
  centerBore?: string[];
  productionYears?: string[];
}

export function parseVehicleFilterString(input: string): ParsedVehicleFilters {
  const result: ParsedVehicleFilters = {};
  const lowerInput = input.toLowerCase();

  // Bolt Pattern: "5x120", "5x112.5"
  const boltPatternMatches = input.match(/\d+x\d+\.?\d*/gi);
  if (boltPatternMatches) {
    result.boltPattern = [...new Set(boltPatternMatches)];
  }

  // Center Bore: "66.6", "66.6mm" (but not if part of bolt pattern)
  const centerBoreMatches = input.match(/(?<!\dx)(\d+\.\d+)\s*(?:mm)?\b/gi);
  if (centerBoreMatches) {
    const bores = centerBoreMatches
      .filter(m => {
        const num = parseFloat(m);
        // Center bore is typically between 50 and 120mm
        return num >= 50 && num <= 120;
      })
      .map(m => {
        const num = m.match(/\d+\.\d+/)?.[0];
        return num || m;
      });
    if (bores.length > 0) {
      result.centerBore = [...new Set(bores)];
    }
  }

  // Production Years: "1995-2000", "2010-2015", "1995"
  const yearRangeMatches = input.match(/\b(19|20)\d{2}(?:\s*-\s*(19|20)\d{2})?\b/gi);
  if (yearRangeMatches) {
    result.productionYears = [...new Set(yearRangeMatches)];
  }

  // Brand names: Try to extract capitalized words that could be brands
  // Common brands: BMW, Toyota, Honda, Mercedes, Audi, etc.
  const knownBrands = [
    'BMW', 'Toyota', 'Honda', 'Mercedes', 'Audi', 'Volkswagen', 'VW', 
    'Ford', 'Chevrolet', 'Nissan', 'Mazda', 'Subaru', 'Lexus', 'Porsche',
    'Ferrari', 'Lamborghini', 'Bentley', 'Rolls-Royce', 'Jaguar', 'Land Rover',
    'Volvo', 'Saab', 'Peugeot', 'Renault', 'Citroen', 'Fiat', 'Alfa Romeo',
    'Hyundai', 'Kia', 'Genesis', 'Acura', 'Infiniti', 'Cadillac', 'Lincoln',
    'Buick', 'GMC', 'Dodge', 'Chrysler', 'Jeep', 'Ram', 'Tesla', 'Rivian'
  ];
  
  const brandMatches = knownBrands.filter(brand => 
    lowerInput.includes(brand.toLowerCase())
  );
  if (brandMatches.length > 0) {
    result.brand = [...new Set(brandMatches)];
  }

  return result;
}
