import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { ExternalLink, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVehicleRoutePath } from "@/lib/vehicleRoutes";
import { cn } from "@/lib/utils";

type CompareType = "vehicles" | "wheels";

type VehicleRow = {
  _id: string;
  id?: string | null;
  slug?: string | null;
  vehicle_title?: string | null;
  model_name?: string | null;
  generation?: string | null;
  brand_name?: string | null;
  text_brands?: string | null;
  production_years?: string | null;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
  bolt_pattern?: string | null;
  text_bolt_patterns?: string | null;
  center_bore?: string | null;
  text_center_bores?: string | null;
  diameter?: string | null;
  text_diameters?: string | null;
  width?: string | null;
  text_widths?: string | null;
  private_blurb?: string | null;
};

type WheelRow = {
  _id: string;
  id?: string | null;
  slug?: string | null;
  wheel_title?: string | null;
  wheel_name?: string | null;
  brand_name?: string | null;
  jnc_brands?: string | null;
  good_pic_url?: string | null;
  bad_pic_url?: string | null;
  diameter?: string | null;
  width?: string | null;
  bolt_pattern?: string | null;
  center_bore?: string | null;
  tire_size?: string | null;
  color?: string | null;
  private_blurb?: string | null;
};

function clean(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : "";
}

function vehicleTitle(row?: VehicleRow | null) {
  return clean(row?.vehicle_title) || clean(row?.model_name) || clean(row?.generation) || "Vehicle";
}

function vehicleBrand(row?: VehicleRow | null) {
  return clean(row?.brand_name) || clean(row?.text_brands) || "Unknown";
}

function wheelTitle(row?: WheelRow | null) {
  return clean(row?.wheel_title) || clean(row?.wheel_name) || "Wheel";
}

function wheelBrand(row?: WheelRow | null) {
  return clean(row?.brand_name) || clean(row?.jnc_brands) || "Unknown";
}

function imageUrl(row?: VehicleRow | WheelRow | null) {
  return clean(row?.good_pic_url) || clean(row?.bad_pic_url);
}

function valueText(value: unknown) {
  return clean(value) || "unknown";
}

function routeFor(type: CompareType, row: VehicleRow | WheelRow) {
  if (type === "vehicles") {
    const vehicle = row as VehicleRow;
    return getVehicleRoutePath({
      id: String(vehicle._id),
      slug: clean(vehicle.slug) || clean(vehicle.id) || undefined,
      name: vehicleTitle(vehicle),
    });
  }

  const wheel = row as WheelRow;
  return `/wheel/${encodeURIComponent(clean(wheel.slug) || clean(wheel.id) || String(wheel._id))}`;
}

function specsFor(type: CompareType, row?: VehicleRow | WheelRow | null) {
  if (!row) return [];
  if (type === "vehicles") {
    const vehicle = row as VehicleRow;
    return [
      ["Brand", vehicleBrand(vehicle)],
      ["Years", vehicle.production_years],
      ["Bolt pattern", vehicle.bolt_pattern ?? vehicle.text_bolt_patterns],
      ["Center bore", vehicle.center_bore ?? vehicle.text_center_bores],
      ["Diameter", vehicle.diameter ?? vehicle.text_diameters],
      ["Width", vehicle.width ?? vehicle.text_widths],
    ] as const;
  }

  const wheel = row as WheelRow;
  return [
    ["Brand", wheelBrand(wheel)],
    ["Diameter", wheel.diameter],
    ["Width", wheel.width],
    ["Bolt pattern", wheel.bolt_pattern],
    ["Center bore", wheel.center_bore],
    ["Tire size", wheel.tire_size],
    ["Color", wheel.color],
  ] as const;
}

function SearchPicker<T extends { _id: string }>({
  label,
  rows,
  value,
  onChange,
  getTitle,
  getBrand,
}: {
  label: string;
  rows: T[];
  value: string;
  onChange: (next: string) => void;
  getTitle: (row: T) => string;
  getBrand: (row: T) => string;
}) {
  const [search, setSearch] = useState("");
  const filteredRows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const candidates = needle
      ? rows.filter((row) => `${getBrand(row)} ${getTitle(row)}`.toLowerCase().includes(needle))
      : rows;
    return candidates.slice(0, 72);
  }, [rows, search, getTitle, getBrand]);

  return (
    <section className="min-h-0 rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{label}</h2>
        <span className="text-xs text-muted-foreground">{rows.length}</span>
      </div>
      <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
      <div className="mt-2 max-h-64 space-y-1 overflow-y-auto rounded-md border border-border bg-black/20 p-1">
        {filteredRows.map((row) => {
          const selected = String(row._id) === value;
          return (
            <button
              key={String(row._id)}
              type="button"
              className={cn(
                "block w-full rounded-md px-2 py-2 text-left hover:bg-white/10",
                selected && "bg-white text-black hover:bg-white",
              )}
              onClick={() => onChange(String(row._id))}
            >
              <div className="truncate text-sm font-medium">{getTitle(row)}</div>
              <div className={cn("truncate text-xs", selected ? "text-black/60" : "text-muted-foreground")}>{getBrand(row)}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ComparePanel({
  type,
  row,
}: {
  type: CompareType;
  row?: VehicleRow | WheelRow | null;
}) {
  if (!row) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        Select an item.
      </div>
    );
  }

  const title = type === "vehicles" ? vehicleTitle(row as VehicleRow) : wheelTitle(row as WheelRow);
  const brand = type === "vehicles" ? vehicleBrand(row as VehicleRow) : wheelBrand(row as WheelRow);
  const specs = specsFor(type, row);
  const url = imageUrl(row);

  return (
    <article className="min-h-0 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex h-80 items-center justify-center border-b border-border bg-muted/20">
        {url ? (
          <img src={url} alt={title} className="h-full w-full object-contain" />
        ) : (
          <span className="text-sm text-muted-foreground">No image</span>
        )}
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold">{title}</h2>
            <p className="truncate text-sm text-muted-foreground">{brand}</p>
          </div>
          <Button asChild size="icon" variant="outline">
            <Link to={routeFor(type, row)}>
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Open detail</span>
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {specs.map(([label, value]) => (
            <div key={label} className="rounded-md border border-border bg-black/20 px-3 py-2">
              <div className="text-[10px] font-medium uppercase text-muted-foreground">{label}</div>
              <div className="truncate text-sm font-medium">{valueText(value)}</div>
            </div>
          ))}
        </div>
        {clean(row.private_blurb) ? (
          <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-black p-3 font-mono text-xs leading-relaxed text-muted-foreground">
            {clean(row.private_blurb)}
          </pre>
        ) : null}
      </div>
    </article>
  );
}

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState<CompareType>(() => (searchParams.get("type") === "wheels" ? "wheels" : "vehicles"));
  const [leftId, setLeftId] = useState(searchParams.get("left") ?? "");
  const [rightId, setRightId] = useState(searchParams.get("right") ?? "");

  const vehiclesData = useQuery(api.queries.vehiclesGetAllWithBrands, {}) as VehicleRow[] | undefined;
  const wheelsData = useQuery(api.queries.wheelsGetAllWithBrands, {}) as WheelRow[] | undefined;
  const rows = type === "vehicles" ? vehiclesData ?? [] : wheelsData ?? [];
  const loading = vehiclesData === undefined || wheelsData === undefined;

  useEffect(() => {
    if (!rows.length) return;
    if (!leftId || !rows.some((row) => String(row._id) === leftId)) setLeftId(String(rows[0]._id));
    if (!rightId || !rows.some((row) => String(row._id) === rightId)) setRightId(String(rows[1]?._id ?? rows[0]._id));
  }, [rows, leftId, rightId]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("type", type);
    if (leftId) params.set("left", leftId);
    if (rightId) params.set("right", rightId);
    setSearchParams(params, { replace: true });
  }, [type, leftId, rightId]);

  const leftRow = rows.find((row) => String(row._id) === leftId) ?? null;
  const rightRow = rows.find((row) => String(row._id) === rightId) ?? null;
  const titleFor = type === "vehicles" ? vehicleTitle : wheelTitle;
  const brandFor = type === "vehicles" ? vehicleBrand : wheelBrand;

  return (
    <DashboardLayout title="Compare" showSearch={false} disableContentPadding>
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid h-full min-h-0 grid-cols-[300px_minmax(0,1fr)] gap-3 p-3">
          <aside className="min-h-0 space-y-3 overflow-y-auto">
            <Tabs value={type} onValueChange={(next) => {
              setType(next as CompareType);
              setLeftId("");
              setRightId("");
            }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                <TabsTrigger value="wheels">Wheels</TabsTrigger>
              </TabsList>
            </Tabs>
            <SearchPicker
              label="Left"
              rows={rows}
              value={leftId}
              onChange={setLeftId}
              getTitle={titleFor as (row: VehicleRow | WheelRow) => string}
              getBrand={brandFor as (row: VehicleRow | WheelRow) => string}
            />
            <SearchPicker
              label="Right"
              rows={rows}
              value={rightId}
              onChange={setRightId}
              getTitle={titleFor as (row: VehicleRow | WheelRow) => string}
              getBrand={brandFor as (row: VehicleRow | WheelRow) => string}
            />
          </aside>
          <main className="grid min-h-0 grid-cols-2 gap-3 overflow-y-auto">
            <ComparePanel type={type} row={leftRow} />
            <ComparePanel type={type} row={rightRow} />
          </main>
        </div>
      )}
    </DashboardLayout>
  );
}
