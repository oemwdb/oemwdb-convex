import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { ArrowLeft, ArrowRight, CircleDot, Loader2, Shuffle, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { api } from "../../convex/_generated/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVehicleRoutePath } from "@/lib/vehicleRoutes";
import { cn } from "@/lib/utils";

type BoardType = "vehicles" | "wheels";

type BoardItem = {
  id: string;
  type: BoardType;
  title: string;
  brand: string;
  imageUrl: string;
  href: string;
  specs: Array<[string, string]>;
};

type RatingMap = Record<string, number>;

const STORAGE_KEY = "oemwdb.coolBoard.v1";

const ratings = [
  { value: 1, label: "Ice", tone: "border-sky-500/50 text-sky-300" },
  { value: 2, label: "Cold", tone: "border-cyan-500/50 text-cyan-300" },
  { value: 3, label: "Fine", tone: "border-zinc-500/50 text-zinc-200" },
  { value: 4, label: "Cool", tone: "border-orange-500/60 text-orange-300" },
  { value: 5, label: "Peak", tone: "border-amber-400/70 text-amber-200" },
];

function clean(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : "";
}

function ratingKey(type: BoardType, id: string) {
  return `${type}:${id}`;
}

function readRatings(): RatingMap {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeRatings(value: RatingMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function normalizeVehicles(rows: any[] | undefined): BoardItem[] {
  return (rows ?? []).map((row) => {
    const title = clean(row.vehicle_title) || clean(row.model_name) || clean(row.generation) || "Vehicle";
    const brand = clean(row.brand_name) || clean(row.text_brands) || "Unknown";
    return {
      id: String(row._id),
      type: "vehicles" as const,
      title,
      brand,
      imageUrl: clean(row.good_pic_url) || clean(row.bad_pic_url),
      href: getVehicleRoutePath({
        id: String(row._id),
        slug: clean(row.slug) || clean(row.id) || undefined,
        name: title,
      }),
      specs: [
        ["Years", clean(row.production_years) || "unknown"],
        ["Bolt", clean(row.bolt_pattern) || clean(row.text_bolt_patterns) || "unknown"],
        ["Center", clean(row.center_bore) || clean(row.text_center_bores) || "unknown"],
      ],
    };
  });
}

function normalizeWheels(rows: any[] | undefined): BoardItem[] {
  return (rows ?? []).map((row) => {
    const title = clean(row.wheel_title) || clean(row.wheel_name) || "Wheel";
    const brand = clean(row.brand_name) || clean(row.jnc_brands) || "Unknown";
    return {
      id: String(row._id),
      type: "wheels" as const,
      title,
      brand,
      imageUrl: clean(row.good_pic_url) || clean(row.bad_pic_url),
      href: `/wheel/${encodeURIComponent(clean(row.slug) || clean(row.id) || String(row._id))}`,
      specs: [
        ["Diameter", clean(row.diameter) || "unknown"],
        ["Width", clean(row.width) || "unknown"],
        ["Bolt", clean(row.bolt_pattern) || "unknown"],
      ],
    };
  });
}

function filterItems(items: BoardItem[], search: string) {
  const needle = search.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) => `${item.brand} ${item.title}`.toLowerCase().includes(needle));
}

function BoardCard({
  item,
  rating,
  onRate,
}: {
  item: BoardItem;
  rating?: number;
  onRate: (rating: number) => void;
}) {
  return (
    <article className="rounded-lg border border-border bg-card">
      <Link to={item.href} className="flex h-56 items-center justify-center overflow-hidden bg-muted/20 xl:h-64">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <CircleDot className="h-8 w-8" />
            <span className="text-sm">No image</span>
          </div>
        )}
      </Link>
      <div className="border-t border-border p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-semibold">{item.title}</h2>
            <p className="truncate text-sm text-muted-foreground">{item.brand}</p>
          </div>
          {rating ? (
            <div className="flex h-9 min-w-9 items-center justify-center rounded-md border border-orange-500/60 text-sm font-semibold text-orange-300">
              {rating}
            </div>
          ) : null}
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {item.specs.map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-md border border-border bg-black/20 px-2 py-2">
              <div className="text-[10px] font-medium uppercase text-muted-foreground">{label}</div>
              <div className="truncate text-sm font-medium">{value}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {ratings.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={rating === option.value ? "default" : "outline"}
              className={cn("h-12 flex-col gap-0 text-xs", rating !== option.value && option.tone)}
              onClick={() => onRate(option.value)}
            >
              <Star className={cn("h-4 w-4", rating === option.value && "fill-current")} />
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function CoolBoardPage() {
  const vehiclesData = useQuery(api.queries.vehiclesGetAllWithBrands, {});
  const wheelsData = useQuery(api.queries.wheelsGetAllWithBrands, {});
  const [type, setType] = useState<BoardType>("vehicles");
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const [ratingMap, setRatingMap] = useState<RatingMap>(() => readRatings());

  const vehicles = useMemo(() => normalizeVehicles(vehiclesData as any[] | undefined), [vehiclesData]);
  const wheels = useMemo(() => normalizeWheels(wheelsData as any[] | undefined), [wheelsData]);
  const items = type === "vehicles" ? vehicles : wheels;
  const filteredItems = useMemo(() => filterItems(items, search), [items, search]);
  const current = filteredItems[index] ?? filteredItems[0] ?? null;
  const currentRating = current ? ratingMap[ratingKey(current.type, current.id)] : undefined;
  const loading = vehiclesData === undefined || wheelsData === undefined;

  useEffect(() => {
    writeRatings(ratingMap);
  }, [ratingMap]);

  useEffect(() => {
    setIndex(0);
  }, [type, search]);

  const move = (direction: 1 | -1) => {
    if (!filteredItems.length) return;
    setIndex((currentIndex) => (currentIndex + direction + filteredItems.length) % filteredItems.length);
  };

  const shuffle = () => {
    if (filteredItems.length < 2) return;
    setIndex((currentIndex) => {
      let next = Math.floor(Math.random() * filteredItems.length);
      if (next === currentIndex) next = (next + 1) % filteredItems.length;
      return next;
    });
  };

  const setRating = (rating: number) => {
    if (!current) return;
    setRatingMap((existing) => ({
      ...existing,
      [ratingKey(current.type, current.id)]: rating,
    }));
  };

  const ratedItems = useMemo(() => {
    return items.filter((item) => ratingMap[ratingKey(item.type, item.id)]);
  }, [items, ratingMap]);

  return (
    <DashboardLayout title="Cool Board" showFilterButton={false} disableContentPadding>
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="h-full overflow-y-auto p-3">
          <div className="mb-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
            <main className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2">
              <Tabs value={type} onValueChange={(next) => setType(next as BoardType)}>
                <TabsList className="grid w-64 grid-cols-2">
                  <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                  <TabsTrigger value="wheels">Wheels</TabsTrigger>
                </TabsList>
              </Tabs>
              <Input className="max-w-sm" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
              <div className="ml-auto flex gap-2">
                <Button type="button" variant="outline" onClick={() => move(-1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Prev
                </Button>
                <Button type="button" variant="outline" onClick={shuffle}>
                  <Shuffle className="mr-2 h-4 w-4" />
                  Random
                </Button>
                <Button type="button" variant="outline" onClick={() => move(1)}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {current ? (
              <BoardCard item={current} rating={currentRating} onRate={setRating} />
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                No matching items.
              </div>
            )}
          </main>

          <aside className="rounded-lg border border-border bg-card p-3">
            <h2 className="mb-3 text-sm font-semibold">Board</h2>
            <div className="grid grid-cols-1 gap-3">
              {ratings.map((column) => {
                const columnItems = ratedItems.filter((item) => ratingMap[ratingKey(item.type, item.id)] === column.value);
                return (
                  <section key={column.value} className="rounded-md border border-border p-2">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{column.label}</span>
                      <span className="text-xs text-muted-foreground">{columnItems.length}</span>
                    </div>
                    <div className="space-y-2">
                      {columnItems.slice(0, 8).map((item) => (
                        <button
                          key={ratingKey(item.type, item.id)}
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-white/10"
                          onClick={() => {
                            setType(item.type);
                            setSearch("");
                            const nextItems = item.type === "vehicles" ? vehicles : wheels;
                            setIndex(Math.max(0, nextItems.findIndex((candidate) => candidate.id === item.id)));
                          }}
                        >
                          <div className="h-10 w-12 shrink-0 overflow-hidden rounded border border-border bg-muted">
                            {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-full w-full object-contain" /> : null}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{item.title}</div>
                            <div className="truncate text-xs text-muted-foreground">{item.brand}</div>
                          </div>
                        </button>
                      ))}
                      {columnItems.length === 0 ? (
                        <div className="rounded-md border border-dashed border-border py-4 text-center text-xs text-muted-foreground">
                          Empty
                        </div>
                      ) : null}
                    </div>
                  </section>
                );
              })}
            </div>
          </aside>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
