export function buildTireRackUrl(tireSize?: string | null) {
  const normalized = String(tireSize ?? "")
    .replace(/\s+/g, "")
    .toUpperCase();
  const match = normalized.match(/^(?:P)?(\d{3})\/(\d{2})(?:R|-)?(\d{2})$/);
  if (!match) return null;

  const [, width, ratio, diameter] = match;
  return `https://www.tirerack.com/tires/TireSearchResults.jsp?width=${encodeURIComponent(`${width}/`)}&ratio=${encodeURIComponent(ratio)}&diameter=${encodeURIComponent(diameter)}`;
}
