import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "@/contexts/AuthContext";
import { getVehicleVariantRoutePath } from "@/lib/variantRoutes";
import {
    buildExactEngineLabel,
    buildFamilyEngineLabel,
    buildPreferredVariantEngineLabel,
    buildVariantEngineSignature,
} from "@/lib/vehicleVariantEngines";

interface VariantsSectionProps {
    vehicleId: Id<"oem_vehicles">;
    vehicleName?: string;
}

type RawVariant = NonNullable<ReturnType<typeof useQuery<typeof api.queries.vehicleVariantsGetByVehicle>>>[number];

const PACKAGE_PATTERN =
    /\b(package|pkg|appearance|technology|tech|convenience|cold weather|driver assistance|winter package)\b/i;

const normalizeText = (value?: string | null) =>
    value?.replace(/\s+/g, " ").trim() ?? "";

const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isHelperAllVariant = (variant: RawVariant) =>
    normalizeText(variant.trim_level).toLowerCase() === "all" &&
    normalizeText(variant.variant_title).toLowerCase() === "all";

const VariantsSection: React.FC<VariantsSectionProps> = ({ vehicleId, vehicleName }) => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const variants = useQuery(api.queries.vehicleVariantsGetByVehicle, { vehicleId });
    const isLoading = variants === undefined;

    const formatYears = (yearFrom?: number | null, yearTo?: number | null) => {
        if (!yearFrom && !yearTo) return null;
        if (!yearFrom) return `${yearTo}`;
        return `${yearFrom}-${yearTo ?? "Present"}`;
    };

    const stripVehiclePrefix = (value?: string | null) => {
        const normalizedValue = normalizeText(value);
        const normalizedVehicleName = normalizeText(vehicleName);
        if (!normalizedValue || !normalizedVehicleName) return normalizedValue;

        const prefixPattern = new RegExp(`^${escapeRegex(normalizedVehicleName)}\\s+`, "i");
        return normalizedValue.replace(prefixPattern, "").trim();
    };

    const looksLikePackage = (value?: string | null) => PACKAGE_PATTERN.test(normalizeText(value));

    const formatEngine = (variant: RawVariant) =>
        buildPreferredVariantEngineLabel(variant);

    const formatFamilyEngine = (variant: RawVariant) =>
        buildFamilyEngineLabel(variant);

    const resolveDisplayLabel = (variant: RawVariant) => {
        const trimLevel = stripVehiclePrefix(variant.trim_level);
        const variantTitle = stripVehiclePrefix(variant.variant_title);
        const exactEngineLabel = buildExactEngineLabel(variant);
        const engineLabel = formatEngine(variant);

        if (trimLevel && !looksLikePackage(trimLevel)) return trimLevel;
        if (variantTitle && !looksLikePackage(variantTitle)) return variantTitle;
        if (exactEngineLabel) return exactEngineLabel;
        if (engineLabel) return engineLabel;
        if (trimLevel) return trimLevel;
        if (variantTitle) return variantTitle;
        return "Base";
    };

    const buildGroupKey = (variant: RawVariant) => {
        const label = resolveDisplayLabel(variant).toLowerCase();
        const engineSignature = buildVariantEngineSignature(variant);

        return `${label}::${engineSignature || "no-engine"}`;
    };

    const groupedVariants = (() => {
        if (!variants) return [];

        const concreteVariants = variants.filter((variant) => !isHelperAllVariant(variant));
        const visibleVariants = concreteVariants.length > 0 ? concreteVariants : variants;

        const groups = new Map<
            string,
            {
                id: string;
                label: string;
                engine: string | null;
                engineFamily: string | null;
                powerHp: number | null;
                yearFrom: number | null;
                yearTo: number | null;
                markets: Set<string>;
                notes: string[];
                searchLabel: string;
                rowCount: number;
            }
        >();

        for (const variant of visibleVariants) {
            const key = buildGroupKey(variant);
            const existing = groups.get(key);
            const label = resolveDisplayLabel(variant);
            const engine = formatEngine(variant);
            const engineFamily = formatFamilyEngine(variant);
            const searchLabel = [vehicleName, label].filter(Boolean).join(" ").trim();
            const note = normalizeText(variant.notes);

            if (!existing) {
                groups.set(key, {
                    id: String(variant._id ?? variant.id ?? key),
                    label,
                    engine,
                    engineFamily,
                    powerHp: variant.engine_variant_power_hp ?? variant.power_hp ?? null,
                    yearFrom: variant.year_from ?? null,
                    yearTo: variant.year_to ?? null,
                    markets: new Set(normalizeText(variant.market) ? [normalizeText(variant.market)] : []),
                    notes: note ? [note] : [],
                    searchLabel,
                    rowCount: 1,
                });
                continue;
            }

            existing.rowCount += 1;
            existing.yearFrom =
                existing.yearFrom === null
                    ? (variant.year_from ?? null)
                    : variant.year_from === undefined
                      ? existing.yearFrom
                      : Math.min(existing.yearFrom, variant.year_from);
            existing.yearTo =
                existing.yearTo === null
                    ? (variant.year_to ?? null)
                    : variant.year_to === undefined
                      ? existing.yearTo
                      : Math.max(existing.yearTo, variant.year_to);

            if (!existing.powerHp && (variant.engine_variant_power_hp || variant.power_hp)) {
                existing.powerHp = variant.engine_variant_power_hp ?? variant.power_hp ?? null;
            }

            const market = normalizeText(variant.market);
            if (market) {
                existing.markets.add(market);
            }

            if (note && !existing.notes.includes(note)) {
                existing.notes.push(note);
            }
        }

        return Array.from(groups.values()).sort((a, b) => {
            const yearDiff = (a.yearFrom ?? 0) - (b.yearFrom ?? 0);
            if (yearDiff !== 0) return yearDiff;
            return a.label.localeCompare(b.label);
        });
    })();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!groupedVariants || groupedVariants.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No variants data available.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupedVariants.map((variant) => (
                <Card
                    key={variant.id}
                    className="flex flex-col transition-shadow hover:shadow-md"
                    onClick={(event) => {
                        if (!isAdmin || !variant.id) return;
                        const target = event.target as HTMLElement | null;
                        if (target?.closest("a,button")) return;
                        navigate(
                          getVehicleVariantRoutePath({
                            id: variant.id,
                            name: [vehicleName, variant.label].filter(Boolean).join(" - "),
                          })
                        );
                    }}
                >
                    <CardContent className="flex flex-col gap-2 p-4">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-foreground text-base">
                                        {variant.label}
                                    </h4>
                                    {variant.engine && (
                                        <p className="text-sm font-medium text-foreground">
                                            {variant.engine}
                                        </p>
                                    )}
                                    {variant.engineFamily && variant.engineFamily !== variant.engine && (
                                        <p className="text-xs text-muted-foreground">
                                            Family: {variant.engineFamily}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1 text-sm">
                                    {formatYears(variant.yearFrom, variant.yearTo) && (
                                        <p className="text-foreground">
                                            <span className="text-muted-foreground">Years:</span> {formatYears(variant.yearFrom, variant.yearTo)}
                                        </p>
                                    )}
                                    {variant.powerHp && (
                                        <p className="text-foreground">
                                            <span className="text-muted-foreground">Power:</span> {variant.powerHp} hp
                                        </p>
                                    )}
                                    {variant.markets.size > 0 && (
                                        <p className="text-foreground">
                                            <span className="text-muted-foreground">Market:</span> {[...variant.markets].join(", ")}
                                        </p>
                                    )}
                                    {variant.rowCount > 1 && (
                                        <p className="text-foreground">
                                            <span className="text-muted-foreground">Grouped:</span> {variant.rowCount} records
                                        </p>
                                    )}
                                    {variant.notes[0] && (
                                        <p className="text-muted-foreground line-clamp-3">
                                            {variant.notes[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-3 pt-3 border-t border-border/50">
                                    <p className="text-xs text-muted-foreground mb-2">Find at</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <a
                                            href={`https://www.autoscout24.com/lst?query=${encodeURIComponent(variant.searchLabel)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                                            title="Search on AutoScout24"
                                        >
                                            AutoScout
                                        </a>
                                        <a
                                            href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(variant.searchLabel)}&_sacat=6001`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                                            title="Search on eBay Motors"
                                        >
                                            eBay
                                        </a>
                                        <a
                                            href={`https://www.autotrader.com/cars-for-sale/all-cars?keywordPhrases=${encodeURIComponent(variant.searchLabel)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                                            title="Search on Autotrader"
                                        >
                                            Autotrader
                                        </a>
                                    </div>
                                </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default VariantsSection;
