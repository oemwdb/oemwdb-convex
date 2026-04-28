import React from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ConvexBackendUnavailableCard } from "@/components/convex/ConvexBackendUnavailableCard";
import { ConvexResourceStatusBadge } from "@/components/convex/ConvexResourceStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import { cn } from "@/lib/utils";
import { getConvexErrorMessage } from "@/lib/convexErrors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Database,
  GitBranch,
  Loader2,
  LockKeyhole,
  RefreshCcw,
  Search,
  ShieldAlert,
  SignalHigh,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

type Stage =
  | "Seeded"
  | "Vehicle Canon"
  | "Fitment"
  | "Family Links"
  | "Exact Links"
  | "Media Polish"
  | "Complete";

type Health = "healthy" | "watch" | "critical" | "idle";
type Movement = "improving" | "steady" | "at-risk" | "quiet";
type DisplayMode = "percent" | "absolute";
type SortKey = "highestDebt" | "worstCoverage" | "highestBlocked" | "stalestQueue" | "brand" | "score";

type CoverageMetric = {
  current: number;
  total: number;
  percent: number;
};

type BrandControlTowerRow = {
  brandId: string;
  brand: string;
  slug: string | null;
  seeded: boolean;
  stage: Stage;
  health: Health;
  recentMovement: Movement;
  progressScore: number;
  lastMeaningfulUpdate: string | null;
  nextLane: string;
  counts: {
    vehicleFamilies: number;
    vehicleVariants: number;
    wheelFamilies: number;
    wheelVariants: number;
    unresolvedWorkshopResidue: number;
    workshopVehicleResidue: number;
    workshopVehicleVariantResidue: number;
    workshopWheelResidue: number;
    workshopWheelVariantResidue: number;
    workshopBrandResidue: number;
    workshopJunctionResidue: number;
    workshopOtherResidue: number;
  };
  coverage: {
    vehicleFamilyCanon: CoverageMetric;
    vehicleVariantCanon: CoverageMetric;
    familyFitment: CoverageMetric;
    variantFitment: CoverageMetric;
    familyWheelLinks: CoverageMetric;
    exactVariantLinks: CoverageMetric;
    media: CoverageMetric;
    queueHealth: CoverageMetric;
    mediaLayers: {
      brands: CoverageMetric;
      vehicleFamilies: CoverageMetric;
      vehicleVariants: CoverageMetric;
      wheelFamilies: CoverageMetric;
      wheelVariants: CoverageMetric;
    };
  };
  queue: {
    blocked: number;
    review: number;
    held: number;
    stale: number;
    unresolvedResidue: number;
    resolvedThisWeek: number;
    statusBreakdown: Array<{ label: string; count: number }>;
  };
  debt: {
    zeroLinkFamilies: number;
    variantsMissingExactLinks: number;
    parentlessWheelVariants: number;
    familiesMissingBoltPattern: number;
    familiesMissingCenterBore: number;
    familiesMissingBoth: number;
    entitiesMissingRealMedia: number;
    missingBrandLinks: number;
    directFieldImageDrift: number;
    imageNormalizationDrift: number;
    orphanRows: number;
    unresolvedWorkshopResidue: number;
    blocked: number;
    review: number;
    held: number;
    stale: number;
  };
  blockers: string[];
};

type ControlTowerOverview = {
  refreshedAt: string;
  snapshotVersion: string;
  summary: {
    totalCanonicalBrands: number;
    brandsSeeded: number;
    brandsVehicleComplete: number;
    brandsFitmentComplete: number;
    brandsFamilyLinkComplete: number;
    brandsExactLinkReadyOrComplete: number;
    brandsMediaComplete: number;
    queue: {
      blocked: number;
      review: number;
      held: number;
      stale: number;
      newlyImprovedThisWeek: number;
      regressedThisWeek: number;
    };
  };
  brands: BrandControlTowerRow[];
  globalRisk: {
    orphanRows: number;
    orphanImageRows: number;
    backlogBrandsWithoutCanonical: string[];
  };
};

const stages: Array<Stage | "all"> = [
  "all",
  "Seeded",
  "Vehicle Canon",
  "Fitment",
  "Family Links",
  "Exact Links",
  "Media Polish",
  "Complete",
];

const healthFilters: Array<Health | "all"> = ["all", "critical", "watch", "healthy", "idle"];

function formatNumber(value: number) {
  return value.toLocaleString();
}

function formatDate(value: string | null) {
  if (!value) return "No signal";
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return value;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function coverageLabel(metric: CoverageMetric, mode: DisplayMode) {
  if (!metric.total) return mode === "absolute" ? "0/0" : "—";
  return mode === "absolute" ? `${formatNumber(metric.current)}/${formatNumber(metric.total)}` : `${metric.percent}%`;
}

function coverageTone(percent: number) {
  if (percent >= 92) return "bg-emerald-400";
  if (percent >= 65) return "bg-amber-400";
  if (percent > 0) return "bg-red-400";
  return "bg-slate-500";
}

function stageClass(stage: Stage) {
  switch (stage) {
    case "Complete":
      return "border-emerald-400/50 bg-emerald-400/10 text-emerald-100";
    case "Media Polish":
      return "border-cyan-300/50 bg-cyan-300/10 text-cyan-100";
    case "Exact Links":
      return "border-blue-300/50 bg-blue-300/10 text-blue-100";
    case "Family Links":
      return "border-sky-300/50 bg-sky-300/10 text-sky-100";
    case "Fitment":
      return "border-amber-300/60 bg-amber-300/10 text-amber-100";
    case "Vehicle Canon":
      return "border-orange-300/60 bg-orange-300/10 text-orange-100";
    case "Seeded":
      return "border-slate-400/50 bg-slate-400/10 text-slate-200";
  }
}

function healthClass(health: Health) {
  switch (health) {
    case "healthy":
      return "border-emerald-400/40 bg-emerald-400/10 text-emerald-100";
    case "watch":
      return "border-amber-400/40 bg-amber-400/10 text-amber-100";
    case "critical":
      return "border-red-400/50 bg-red-400/10 text-red-100";
    case "idle":
      return "border-slate-500/40 bg-slate-500/10 text-slate-300";
  }
}

function movementLabel(value: Movement) {
  switch (value) {
    case "improving":
      return "Improving";
    case "at-risk":
      return "At risk";
    case "quiet":
      return "Quiet";
    case "steady":
      return "Steady";
  }
}

function debtScore(row: BrandControlTowerRow) {
  return (
    row.debt.zeroLinkFamilies * 3 +
    row.debt.variantsMissingExactLinks * 2 +
    row.debt.parentlessWheelVariants * 4 +
    row.debt.familiesMissingBoth * 2 +
    row.debt.entitiesMissingRealMedia +
    row.queue.blocked * 5 +
    row.queue.review * 2 +
    row.queue.stale * 3 +
    row.debt.directFieldImageDrift +
    row.debt.imageNormalizationDrift
  );
}

function worstCoverage(row: BrandControlTowerRow) {
  return Math.min(
    row.coverage.vehicleFamilyCanon.percent || 0,
    row.coverage.vehicleVariantCanon.percent || 0,
    row.coverage.familyFitment.percent || 0,
    row.coverage.variantFitment.percent || 0,
    row.coverage.familyWheelLinks.percent || 0,
    row.coverage.exactVariantLinks.percent || 0,
    row.coverage.media.percent || 0,
  );
}

function sortRows(rows: BrandControlTowerRow[], sortKey: SortKey) {
  return [...rows].sort((a, b) => {
    if (sortKey === "brand") return a.brand.localeCompare(b.brand);
    if (sortKey === "score") return b.progressScore - a.progressScore;
    if (sortKey === "worstCoverage") return worstCoverage(a) - worstCoverage(b);
    if (sortKey === "highestBlocked") return b.queue.blocked - a.queue.blocked || debtScore(b) - debtScore(a);
    if (sortKey === "stalestQueue") return b.queue.stale - a.queue.stale || b.queue.held - a.queue.held;
    return debtScore(b) - debtScore(a);
  });
}

function sumRows(rows: BrandControlTowerRow[], selector: (row: BrandControlTowerRow) => number) {
  return rows.reduce((sum, row) => sum + selector(row), 0);
}

function StageBadge({ stage }: { stage: Stage }) {
  return (
    <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-xs font-semibold", stageClass(stage))}>
      {stage}
    </Badge>
  );
}

function HealthChip({ health }: { health: Health }) {
  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]", healthClass(health))}>
      {health}
    </Badge>
  );
}

function CoverageRail({
  label,
  metric,
  mode,
  compact = false,
}: {
  label: string;
  metric: CoverageMetric;
  mode: DisplayMode;
  compact?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", compact && "space-y-1")}>
      <div className="flex items-center justify-between gap-3">
        <span className={cn("text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>{label}</span>
        <span className={cn("font-medium text-foreground", compact ? "text-[11px]" : "text-xs")}>
          {coverageLabel(metric, mode)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn("h-full rounded-full transition-all duration-500", coverageTone(metric.percent))}
          style={{ width: `${Math.max(0, Math.min(metric.percent, 100))}%` }}
        />
      </div>
    </div>
  );
}

function OpsMetricCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: "green" | "amber" | "red" | "blue" | "neutral";
}) {
  const toneClass = {
    green: "border-emerald-400/30 bg-emerald-400/[0.08]",
    amber: "border-amber-400/30 bg-amber-400/[0.08]",
    red: "border-red-400/35 bg-red-400/[0.08]",
    blue: "border-sky-300/30 bg-sky-300/[0.08]",
    neutral: "border-white/10 bg-white/[0.035]",
  }[tone];

  return (
    <div className={cn("rounded-[1.35rem] border p-4", toneClass)}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">{label}</div>
      <div className="mt-3 text-3xl font-black tracking-tight text-foreground">{value}</div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function SectionShell({
  eyebrow,
  title,
  description,
  children,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#11100e]/90 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {eyebrow ? (
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.34em] text-amber-200/70">{eyebrow}</div>
          ) : null}
          <h2 className="text-xl font-black tracking-tight text-foreground">{title}</h2>
          <p className="mt-1 max-w-4xl text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function QueueCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  tone: "green" | "amber" | "red" | "slate";
}) {
  const Icon = tone === "green" ? CheckCircle2 : tone === "red" ? ShieldAlert : tone === "amber" ? AlertTriangle : CircleDashed;
  const colorClass = {
    green: "border-emerald-400/35 text-emerald-100",
    amber: "border-amber-400/35 text-amber-100",
    red: "border-red-400/40 text-red-100",
    slate: "border-slate-400/25 text-slate-200",
  }[tone];

  return (
    <div className={cn("rounded-2xl border bg-black/20 p-4", colorClass)}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-3xl font-black tracking-tight">{formatNumber(value)}</div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function RankedDebtList({
  title,
  rows,
  selector,
  label,
  danger = false,
}: {
  title: string;
  rows: BrandControlTowerRow[];
  selector: (row: BrandControlTowerRow) => number;
  label: string;
  danger?: boolean;
}) {
  const ranked = rows
    .map((row) => ({ row, value: selector(row) }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const total = rows.reduce((sum, row) => sum + selector(row), 0);
  const max = ranked[0]?.value ?? 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "rounded-full px-3 py-1",
            danger ? "border-red-400/40 bg-red-400/10 text-red-100" : "border-amber-400/35 bg-amber-400/10 text-amber-100",
          )}
        >
          {formatNumber(total)}
        </Badge>
      </div>
      <div className="mt-4 space-y-3">
        {ranked.length ? ranked.map(({ row, value }) => (
          <div key={`${title}-${row.brandId}`} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-semibold text-foreground">{row.brand}</span>
              <span className="text-muted-foreground">{formatNumber(value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn("h-full rounded-full", danger ? "bg-red-400" : "bg-amber-400")}
                style={{ width: `${max ? Math.max(10, (value / max) * 100) : 0}%` }}
              />
            </div>
          </div>
        )) : (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
            No live debt in this bucket.
          </div>
        )}
      </div>
    </div>
  );
}

function BrandDetailPanel({ row, mode }: { row: BrandControlTowerRow; mode: DisplayMode }) {
  const coverageRows = [
    ["Vehicle family canon", row.coverage.vehicleFamilyCanon],
    ["Vehicle variant canon", row.coverage.vehicleVariantCanon],
    ["Family fitment", row.coverage.familyFitment],
    ["Variant fitment", row.coverage.variantFitment],
    ["Family wheel links", row.coverage.familyWheelLinks],
    ["Exact variant links", row.coverage.exactVariantLinks],
    ["Media coverage", row.coverage.media],
    ["Queue health", row.coverage.queueHealth],
  ] as const;

  return (
    <div className="animate-in slide-in-from-top-2 fade-in-0 duration-200 border-t border-white/10 bg-[#15130f] px-4 py-4">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Exact breakdown</div>
              <h4 className="mt-1 font-bold text-foreground">{row.stage} lane</h4>
            </div>
            <Badge variant="outline" className="rounded-full border-white/20 bg-white/5 px-3 py-1 text-white">
              Score {row.progressScore}
            </Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {coverageRows.map(([label, metric]) => (
              <CoverageRail key={label} label={label} metric={metric} mode={mode} compact />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Queue composition</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["Blocked", row.queue.blocked, "text-red-100 border-red-400/30"],
              ["Review", row.queue.review, "text-amber-100 border-amber-400/30"],
              ["Held", row.queue.held, "text-sky-100 border-sky-300/30"],
              ["Stale", row.queue.stale, "text-slate-200 border-slate-400/30"],
            ].map(([label, value, className]) => (
              <div key={String(label)} className={cn("rounded-xl border bg-black/20 p-3", String(className))}>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
                <div className="mt-1 text-xl font-black">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {row.queue.statusBreakdown.length ? row.queue.statusBreakdown.map((entry) => (
              <Badge key={`${row.brandId}-${entry.label}`} variant="outline" className="border-white/15 bg-white/[0.04] text-xs text-muted-foreground">
                {entry.label}: {entry.count}
              </Badge>
            )) : (
              <span className="text-sm text-muted-foreground">No unresolved staging statuses.</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Next action</div>
          <div className="mt-3 rounded-xl border border-amber-300/25 bg-amber-300/10 p-3 text-lg font-black text-amber-100">
            {row.nextLane}
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Known blockers</div>
            {row.blockers.length ? row.blockers.map((blocker) => (
              <div key={blocker} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-muted-foreground">
                {blocker}
              </div>
            )) : (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
                No high-priority blocker signals.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandProgressTable({
  rows,
  mode,
  expandedBrandId,
  onToggleExpanded,
}: {
  rows: BrandControlTowerRow[];
  mode: DisplayMode;
  expandedBrandId: string | null;
  onToggleExpanded: (brandId: string) => void;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-muted-foreground">
        No brands match the current control-tower filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1500px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.035] text-left">
              {[
                "Brand",
                "Stage",
                "VF",
                "VV",
                "WF",
                "WV",
                "Family fitment",
                "Variant fitment",
                "Family links",
                "Exact links",
                "Media",
                "Blocked",
                "Review",
                "Stale",
                "Last signal",
                "Next lane",
              ].map((heading) => (
                <th key={heading} className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isExpanded = expandedBrandId === row.brandId;
              return (
                <React.Fragment key={row.brandId}>
                  <tr
                    className="cursor-pointer border-b border-white/10 transition-colors hover:bg-white/[0.035]"
                    onClick={() => onToggleExpanded(row.brandId)}
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-3">
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-180 text-white")} />
                        <div>
                          <div className="font-black text-foreground">{row.brand}</div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Score {row.progressScore}</span>
                            <span>•</span>
                            <span>{movementLabel(row.recentMovement)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-2">
                        <StageBadge stage={row.stage} />
                        <HealthChip health={row.health} />
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top font-semibold text-foreground">{formatNumber(row.counts.vehicleFamilies)}</td>
                    <td className="px-4 py-3 align-top font-semibold text-foreground">{formatNumber(row.counts.vehicleVariants)}</td>
                    <td className="px-4 py-3 align-top font-semibold text-foreground">{formatNumber(row.counts.wheelFamilies)}</td>
                    <td className="px-4 py-3 align-top font-semibold text-foreground">{formatNumber(row.counts.wheelVariants)}</td>
                    <td className="px-4 py-3 align-top"><CoverageRail label="" metric={row.coverage.familyFitment} mode={mode} compact /></td>
                    <td className="px-4 py-3 align-top"><CoverageRail label="" metric={row.coverage.variantFitment} mode={mode} compact /></td>
                    <td className="px-4 py-3 align-top"><CoverageRail label="" metric={row.coverage.familyWheelLinks} mode={mode} compact /></td>
                    <td className="px-4 py-3 align-top"><CoverageRail label="" metric={row.coverage.exactVariantLinks} mode={mode} compact /></td>
                    <td className="px-4 py-3 align-top"><CoverageRail label="" metric={row.coverage.media} mode={mode} compact /></td>
                    <td className="px-4 py-3 align-top text-red-100">{row.queue.blocked}</td>
                    <td className="px-4 py-3 align-top text-amber-100">{row.queue.review}</td>
                    <td className="px-4 py-3 align-top text-slate-200">{row.queue.stale}</td>
                    <td className="px-4 py-3 align-top text-muted-foreground">{formatDate(row.lastMeaningfulUpdate)}</td>
                    <td className="px-4 py-3 align-top">
                      <Badge variant="outline" className="rounded-full border-amber-300/30 bg-amber-300/10 px-3 py-1 text-amber-100">
                        {row.nextLane}
                      </Badge>
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr>
                      <td colSpan={16} className="p-0">
                        <BrandDetailPanel row={row} mode={mode} />
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CoverageMatrix({ rows, mode }: { rows: BrandControlTowerRow[]; mode: DisplayMode }) {
  const visibleRows = rows.slice(0, 24);
  const columns = [
    ["Vehicle family canon", "vehicleFamilyCanon"],
    ["Vehicle variant canon", "vehicleVariantCanon"],
    ["Family fitment", "familyFitment"],
    ["Variant fitment", "variantFitment"],
    ["Family wheel links", "familyWheelLinks"],
    ["Exact variant links", "exactVariantLinks"],
    ["Media", "media"],
  ] as const;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.035] text-left">
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Brand</th>
              {columns.map(([label]) => (
                <th key={label} className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={`matrix-${row.brandId}`} className="border-b border-white/10 last:border-b-0">
                <td className="px-4 py-3 font-black text-foreground">{row.brand}</td>
                {columns.map(([label, key]) => (
                  <td key={`${row.brandId}-${label}`} className="px-4 py-3">
                    <CoverageRail label="" metric={row.coverage[key]} mode={mode} compact />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UnauthorizedState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-[#11100e] p-8 text-center shadow-2xl">
        <LockKeyhole className="mx-auto h-10 w-10 text-amber-200" />
        <h1 className="mt-5 text-2xl font-black text-white">Admin-only control tower</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This page exposes operational database debt, queue health, and private context. Sign in with an admin account to continue.
        </p>
      </div>
    </div>
  );
}

const BillyDashPage = () => {
  const { isAdmin, isLoading } = useAuth();
  const overviewResource = useConvexResourceQuery<ControlTowerOverview>({
    queryKey: ["billyDashBrowser", "controlTowerOverview"],
    queryRef: api.billyDashBrowser.overviewGet,
    args: {},
    enabled: isAdmin,
    staleTime: 25_000,
  });
  const refreshOverview = useMutation(api.billyDashBrowser.refreshOverview);
  const [brandFilter, setBrandFilter] = React.useState("");
  const [stageFilter, setStageFilter] = React.useState<Stage | "all">("all");
  const [healthFilter, setHealthFilter] = React.useState<Health | "all">("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("highestDebt");
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>("percent");
  const [expandedBrandId, setExpandedBrandId] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const overview = overviewResource.data;
  const brands = React.useMemo(() => overview?.brands ?? [], [overview]);

  const filteredRows = React.useMemo(() => {
    const search = brandFilter.trim().toLowerCase();
    const visible = brands.filter((row) => {
      const brandMatches = search
        ? [row.brand, row.slug, row.stage, row.nextLane]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(search)
        : true;
      const stageMatches = stageFilter === "all" || row.stage === stageFilter;
      const healthMatches = healthFilter === "all" || row.health === healthFilter;
      return brandMatches && stageMatches && healthMatches;
    });
    return sortRows(visible, sortKey);
  }, [brands, brandFilter, healthFilter, sortKey, stageFilter]);

  const globalDebt = React.useMemo(() => ({
    zeroLinkFamilies: sumRows(brands, (row) => row.debt.zeroLinkFamilies),
    variantsMissingExactLinks: sumRows(brands, (row) => row.debt.variantsMissingExactLinks),
    parentlessWheelVariants: sumRows(brands, (row) => row.debt.parentlessWheelVariants),
    missingBolt: sumRows(brands, (row) => row.debt.familiesMissingBoltPattern),
    missingCenter: sumRows(brands, (row) => row.debt.familiesMissingCenterBore),
    missingBoth: sumRows(brands, (row) => row.debt.familiesMissingBoth),
    missingMedia: sumRows(brands, (row) => row.debt.entitiesMissingRealMedia),
    directFieldImageDrift: sumRows(brands, (row) => row.debt.directFieldImageDrift),
    imageNormalizationDrift: sumRows(brands, (row) => row.debt.imageNormalizationDrift),
    missingBrandLinks: sumRows(brands, (row) => row.debt.missingBrandLinks),
    unresolvedResidue: sumRows(brands, (row) => row.debt.unresolvedWorkshopResidue),
  }), [brands]);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshOverview({});
      await overviewResource.refetch();
      toast.success("Control tower refreshed");
    } catch (error) {
      toast.error("Could not refresh control tower", {
        description: getConvexErrorMessage(error),
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [overviewResource, refreshOverview]);

  if (isLoading || overviewResource.isInitialLoading) {
    return (
      <DashboardLayout title="Workshop Control" showFilterButton={false} disableContentPadding={true}>
        <div className="flex h-full items-center justify-center bg-[#0c0b09]">
          <div className="rounded-2xl border border-white/10 bg-[#11100e] p-6 text-center">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-amber-200" />
            <p className="mt-4 text-sm text-muted-foreground">Reading canonical progress from Convex…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) return <UnauthorizedState />;

  if (overviewResource.isBackendUnavailable) {
    return (
      <DashboardLayout title="Workshop Control" showFilterButton={false} disableContentPadding={true}>
        <div className="h-full overflow-y-auto bg-[#0c0b09] p-3">
          <ConvexBackendUnavailableCard
            title="Control tower query is not deployed"
            description="The admin-only `billyDashBrowser.overviewGet` query is missing from the active Convex deployment."
            error={overviewResource.error}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (overviewResource.error) {
    return (
      <DashboardLayout title="Workshop Control" showFilterButton={false} disableContentPadding={true}>
        <div className="h-full overflow-y-auto bg-[#0c0b09] p-3">
          <Card className="border-red-400/30 bg-red-400/10">
            <CardContent className="p-8 text-center">
              <TriangleAlert className="mx-auto h-10 w-10 text-red-100" />
              <h2 className="mt-4 text-lg font-black text-foreground">Could not load control tower</h2>
              <p className="mt-2 text-sm text-muted-foreground">{getConvexErrorMessage(overviewResource.error)}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Workshop Control" showFilterButton={false} disableContentPadding={true}>
      <div className="h-full overflow-y-auto bg-[#0c0b09] p-2 text-foreground">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14120f] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%)]" />
            <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full border-amber-300/40 bg-amber-300/10 px-3 py-1 text-amber-100">
                    OEMWDB Workshop
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-white/15 bg-black/30 px-3 py-1 text-muted-foreground">
                    Live canonical Convex data
                  </Badge>
                  <ConvexResourceStatusBadge status={overviewResource.status} label="Refreshing control tower" />
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                  Canonical Control Tower
                </h1>
                <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">
                  Operational truth for brand completion, canonical debt, queue pressure, and next-work selection. `ws_*` residue is treated as backlog risk, not completion.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Badge variant="outline" className="rounded-full border-white/15 bg-black/30 px-4 py-2 text-muted-foreground">
                  Refreshed {formatDate(overview?.refreshedAt ?? null)}
                </Badge>
                <Button onClick={handleRefresh} disabled={isRefreshing} className="gap-2 rounded-full bg-white text-black hover:bg-white/90">
                  {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                  Refresh now
                </Button>
              </div>
            </div>
          </div>

          <SectionShell
            eyebrow="Canonical Progress"
            title="Completion Gates"
            description="High-signal brand counts by canonical layer. These are not row totals; they show which brands have crossed actual completion thresholds."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              <OpsMetricCard label="Seeded" value={overview?.summary.brandsSeeded ?? 0} detail="Canonical brand rows live" tone="neutral" />
              <OpsMetricCard label="Vehicle complete" value={overview?.summary.brandsVehicleComplete ?? 0} detail="Family + variant canon" tone="blue" />
              <OpsMetricCard label="Fitment complete" value={overview?.summary.brandsFitmentComplete ?? 0} detail="Family + exact fitment" tone="amber" />
              <OpsMetricCard label="Family links" value={overview?.summary.brandsFamilyLinkComplete ?? 0} detail="Parent wheel families linked" tone="amber" />
              <OpsMetricCard label="Exact ready" value={overview?.summary.brandsExactLinkReadyOrComplete ?? 0} detail="Exact variant layer active" tone="blue" />
              <OpsMetricCard label="Media complete" value={overview?.summary.brandsMediaComplete ?? 0} detail="Non-placeholder media coverage" tone="green" />
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="Progress by Brand"
            title="Operational Brand Matrix"
            description="Default sort prioritizes problem discovery. Expand a row to see exact coverage breakdown, queue composition, blockers, and the recommended next lane."
            action={
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={brandFilter}
                    onChange={(event) => setBrandFilter(event.target.value)}
                    placeholder="Filter brands or lanes"
                    className="h-10 w-full rounded-full border-white/15 bg-black/30 pl-9 lg:w-60"
                  />
                </div>
                <Select value={stageFilter} onValueChange={(value) => setStageFilter(value as Stage | "all")}>
                  <SelectTrigger className="h-10 rounded-full border-white/15 bg-black/30 lg:w-44">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage === "all" ? "All stages" : stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={healthFilter} onValueChange={(value) => setHealthFilter(value as Health | "all")}>
                  <SelectTrigger className="h-10 rounded-full border-white/15 bg-black/30 lg:w-40">
                    <SelectValue placeholder="Health" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthFilters.map((health) => (
                      <SelectItem key={health} value={health}>
                        {health === "all" ? "All health" : health}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
                  <SelectTrigger className="h-10 rounded-full border-white/15 bg-black/30 lg:w-52">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highestDebt">Highest debt</SelectItem>
                    <SelectItem value="worstCoverage">Worst coverage</SelectItem>
                    <SelectItem value="highestBlocked">Highest blocked</SelectItem>
                    <SelectItem value="stalestQueue">Stalest queue</SelectItem>
                    <SelectItem value="score">Best score</SelectItem>
                    <SelectItem value="brand">Brand A-Z</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-white/15 bg-black/30 px-4 hover:border-white hover:bg-black/50"
                  onClick={() => setDisplayMode((current) => current === "percent" ? "absolute" : "percent")}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {displayMode === "percent" ? "Percent" : "Counts"}
                </Button>
              </div>
            }
          >
            <BrandProgressTable
              rows={filteredRows}
              mode={displayMode}
              expandedBrandId={expandedBrandId}
              onToggleExpanded={(brandId) => setExpandedBrandId((current) => current === brandId ? null : brandId)}
            />
          </SectionShell>

          <SectionShell
            eyebrow="Canonical Debt"
            title="Remaining Debt Buckets"
            description="Ranked debt lists by brand. These emphasize incomplete normalized layers and queue pressure, not raw inventory size."
          >
            <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              <RankedDebtList title="Zero-link wheel families" rows={brands} selector={(row) => row.debt.zeroLinkFamilies} label="Parent wheel families with no j_wheel_vehicle links" danger />
              <RankedDebtList title="Variants missing exact links" rows={brands} selector={(row) => row.debt.variantsMissingExactLinks} label="Vehicle variants without exact wheel-variant links" danger />
              <RankedDebtList title="Parentless wheel variants" rows={brands} selector={(row) => row.debt.parentlessWheelVariants} label="Wheel variants missing parent wheel family" danger />
              <RankedDebtList title="Missing bolt pattern" rows={brands} selector={(row) => row.debt.familiesMissingBoltPattern} label="Vehicle families missing normalized bolt pattern" />
              <RankedDebtList title="Missing center bore" rows={brands} selector={(row) => row.debt.familiesMissingCenterBore} label="Vehicle families missing normalized center bore" />
              <RankedDebtList title="Missing both fitment anchors" rows={brands} selector={(row) => row.debt.familiesMissingBoth} label="Families missing both bolt pattern and center bore" danger />
              <RankedDebtList title="Missing real media" rows={brands} selector={(row) => row.debt.entitiesMissingRealMedia} label="Non-placeholder media not found in canonical image coverage" />
              <RankedDebtList title="Unresolved blocked queues" rows={brands} selector={(row) => row.queue.blocked} label="Blocked queue signals from ws_* and private blurb" danger />
              <RankedDebtList title="Review-heavy queues" rows={brands} selector={(row) => row.queue.review} label="Review/audit/verify queue signals" />
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="Queue Health"
            title="Workflow Control Panel"
            description="Operational pressure from workshop residue, private context, stale imports, and recent movement."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              <QueueCard label="Blocked" value={overview?.summary.queue.blocked ?? 0} detail="Must unblock before progress counts matter" tone="red" />
              <QueueCard label="Review" value={overview?.summary.queue.review ?? 0} detail="Needs human verification or audit" tone="amber" />
              <QueueCard label="Held" value={overview?.summary.queue.held ?? 0} detail="Paused, waiting, or deliberately deferred" tone="slate" />
              <QueueCard label="Stale" value={overview?.summary.queue.stale ?? 0} detail="Unresolved queue older than the stale window" tone="slate" />
              <QueueCard label="Improved" value={overview?.summary.queue.newlyImprovedThisWeek ?? 0} detail="Brands with recent positive movement" tone="green" />
              <QueueCard label="Regressed" value={overview?.summary.queue.regressedThisWeek ?? 0} detail="Brands with fresh at-risk pressure" tone="red" />
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="Coverage Matrix"
            title="Layer-by-Layer Brand Coverage"
            description="A compact scan of which layer is lagging for each brand. This intentionally separates family layers from exact variant layers."
          >
            <CoverageMatrix rows={filteredRows} mode={displayMode} />
          </SectionShell>

          <SectionShell
            eyebrow="Backlog and Risk"
            title="Non-Canonical Residue"
            description="These surfaces are useful for planning and cleanup, but they are explicitly not counted as completion."
          >
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-foreground">
                  <Database className="h-4 w-4 text-amber-100" />
                  ws_* residue
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <OpsMetricCard label="Unresolved" value={globalDebt.unresolvedResidue} detail="Backlog only" tone="amber" />
                  <OpsMetricCard label="Missing canonical brands" value={overview?.globalRisk.backlogBrandsWithoutCanonical.length ?? 0} detail="ws_* groups without brand rows" tone="red" />
                </div>
                {overview?.globalRisk.backlogBrandsWithoutCanonical.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {overview.globalRisk.backlogBrandsWithoutCanonical.slice(0, 10).map((brand) => (
                      <Badge key={brand} variant="outline" className="border-red-400/30 bg-red-400/10 text-red-100">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-foreground">
                  <GitBranch className="h-4 w-4 text-sky-100" />
                  Drift and orphan risk
                </div>
                <div className="mt-4 space-y-3">
                  <CoverageRail label="Direct/image-table drift" metric={{ current: globalDebt.directFieldImageDrift, total: Math.max(globalDebt.directFieldImageDrift + globalDebt.imageNormalizationDrift, 1), percent: globalDebt.directFieldImageDrift ? 100 : 0 }} mode="absolute" />
                  <CoverageRail label="Image normalization drift" metric={{ current: globalDebt.imageNormalizationDrift, total: Math.max(globalDebt.directFieldImageDrift + globalDebt.imageNormalizationDrift, 1), percent: globalDebt.imageNormalizationDrift ? 100 : 0 }} mode="absolute" />
                  <CoverageRail label="Missing brand links" metric={{ current: globalDebt.missingBrandLinks, total: Math.max(globalDebt.missingBrandLinks + overview!.globalRisk.orphanRows, 1), percent: globalDebt.missingBrandLinks ? 100 : 0 }} mode="absolute" />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-foreground">
                  <SignalHigh className="h-4 w-4 text-emerald-100" />
                  Next-work pressure
                </div>
                <div className="mt-4 space-y-3">
                  {sortRows(brands, "highestDebt").slice(0, 6).map((row) => (
                    <div key={`risk-${row.brandId}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-bold text-foreground">{row.brand}</span>
                        <Badge variant="outline" className="border-amber-300/30 bg-amber-300/10 text-amber-100">
                          {row.nextLane}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <ArrowRight className="h-3.5 w-3.5" />
                        Debt score {debtScore(row)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionShell>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillyDashPage;
