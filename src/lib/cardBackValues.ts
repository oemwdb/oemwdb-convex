const VALUE_KEYS = ["value", "raw", "title", "name", "label"] as const;

function tryParseJson(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) return null;

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}

function splitDisplayValue(input: string): string[] {
  return input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function collectCardBackValues(...sources: unknown[]): string[] {
  const values = sources.flatMap((source) => {
    if (source == null) return [];

    if (typeof source === "string") {
      const parsed = tryParseJson(source);
      if (parsed != null) {
        return collectCardBackValues(parsed);
      }

      return splitDisplayValue(source);
    }

    if (Array.isArray(source)) {
      return collectCardBackValues(...source);
    }

    if (typeof source === "object") {
      const record = source as Record<string, unknown>;

      if (typeof record.title === "string" && typeof record.id === "string") {
        return collectCardBackValues(record.title);
      }

      for (const key of VALUE_KEYS) {
        const candidate = record[key];
        if (candidate != null) {
          return collectCardBackValues(candidate);
        }
      }

      return [];
    }

    return [String(source)];
  });

  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function firstCardBackValue(...sources: unknown[]): string | null {
  return collectCardBackValues(...sources)[0] ?? null;
}

export function stripCardBackContext(value: string): string {
  return value.replace(/^.*?\s-\s/, "").trim();
}
