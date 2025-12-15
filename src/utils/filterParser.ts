export interface ParsedFilters {
  brand?: string[];
  diameter?: string[];
  width?: string[];
  boltPattern?: string[];
  centerBore?: string[];
  offset?: string[];
  color?: string[];
}

const KNOWN_COLORS = [
  'black', 'white', 'silver', 'grey', 'gray', 'chrome', 'gold', 
  'bronze', 'gunmetal', 'anthracite', 'titanium', 'platinum',
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink'
];

export function parseFilterString(input: string): ParsedFilters {
  const result: ParsedFilters = {};
  const lowerInput = input.toLowerCase();

  // Diameter pattern: "20 inch", "20\"", "20in", "20 in"
  const diameterMatches = input.match(/(\d+)\s*(?:inch|in|")/gi);
  if (diameterMatches) {
    result.diameter = diameterMatches.map(m => {
      const num = m.match(/\d+/)?.[0];
      return num ? `${num} inch` : m;
    });
  }

  // Bolt Pattern: "5x120", "5x112.5"
  const boltPatternMatches = input.match(/\d+x\d+\.?\d*/gi);
  if (boltPatternMatches) {
    result.boltPattern = [...new Set(boltPatternMatches)];
  }

  // Width pattern: "9.0J", "8.5J", "9J", "8.5", "9.0"
  // But exclude if it's part of bolt pattern (has 'x' nearby)
  const widthMatches = input.match(/(?<!\dx)(\d+\.?\d*)\s*J?\b/gi);
  if (widthMatches) {
    const widths = widthMatches
      .filter(m => {
        const num = parseFloat(m);
        // Width is typically between 5 and 15
        return num >= 5 && num <= 15;
      })
      .map(m => {
        const num = m.match(/\d+\.?\d*/)?.[0];
        return num ? `${num}J` : m;
      });
    if (widths.length > 0) {
      result.width = [...new Set(widths)];
    }
  }

  // Offset pattern: "ET45", "+35", "-12", "ET+45"
  const offsetMatches = input.match(/(?:ET|et)?\s*[+-]?\s*\d+(?=\s|$|mm)/gi);
  if (offsetMatches) {
    result.offset = offsetMatches.map(m => {
      const num = m.match(/[+-]?\d+/)?.[0];
      return num ? `${num}` : m;
    });
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

  // Color: match known colors
  const colorMatches = KNOWN_COLORS.filter(color => 
    lowerInput.includes(color.toLowerCase())
  );
  if (colorMatches.length > 0) {
    result.color = [...new Set(colorMatches.map(c => 
      c.charAt(0).toUpperCase() + c.slice(1)
    ))];
  }

  return result;
}
