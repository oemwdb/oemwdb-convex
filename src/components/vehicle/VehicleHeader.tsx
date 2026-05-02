import ItemPageHeaderCard from "@/components/item-page/ItemPageHeaderCard";
import HeaderMediaImage from "@/components/item-page/HeaderMediaImage";

interface VehicleHeaderProps {
  name: string;
  generation: string;
  years: string;
  engines: string[];
  drive: string;
  segment: string;
  description: string;
  msrp?: string;
  image?: string;
  goodPicUrl?: string | null;
  badPicUrl?: string | null;
  itemId?: string;
  convexId?: string;
  specs?: {
    bolt_pattern_ref?: string[];
    center_bore_ref?: string[];
    wheel_diameter_ref?: string[];
    wheel_width_ref?: string[];
  };
  dimensions?: {
    vehicle_length_mm?: number | null;
    vehicle_width_mm?: number | null;
    vehicle_height_mm?: number | null;
    wheelbase_mm?: number | null;
  };
}

const valueItems = (values?: string[], hrefBuilder?: (value: string) => string) =>
  (values ?? []).filter(Boolean).map((value) => ({
    label: value,
    href: hrefBuilder ? hrefBuilder(value) : undefined,
  }));

const numberValueItem = (value?: number | null, suffix = "") =>
  typeof value === "number" && Number.isFinite(value)
    ? [{ label: `${value.toLocaleString()}${suffix}` }]
    : [];

export default function VehicleHeader({
  name,
  generation,
  years,
  engines,
  drive,
  segment,
  image,
  goodPicUrl,
  badPicUrl,
  itemId,
  convexId,
  specs,
  dimensions,
}: VehicleHeaderProps) {
  const sources = [
    {
      value: goodPicUrl,
      bucketHint: "oemwdb images",
      fitMode: "contain" as const,
      imageClassName: "max-h-full max-w-full",
    },
    {
      value: badPicUrl,
      bucketHint: "BADPICS",
      fitMode: "contain" as const,
      imageClassName: "max-h-full max-w-full",
    },
    {
      value: image,
      bucketHint: "oemwdb images",
      fitMode: "contain" as const,
      imageClassName: "max-h-full max-w-full",
    },
  ];

  return (
    <ItemPageHeaderCard
      title={name}
      editableTitleType="vehicle"
      subtitle={[generation, years].filter(Boolean).join(" • ")}
      itemId={itemId}
      itemType="vehicle"
      convexId={convexId}
      media={
        <div className="relative h-full w-full">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[10%] left-1/2 h-5 w-[68%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.32)_42%,rgba(0,0,0,0)_72%)] blur-[1px]"
          />
          <HeaderMediaImage
            alt={name}
            sources={sources}
            className="relative z-10 h-full w-full object-contain"
            containerClassName="relative z-10 flex h-full w-full items-center justify-center px-2 pb-[8%] pt-1"
          />
        </div>
      }
      mediaFrameClassName="overflow-visible rounded-none border-0 bg-transparent shadow-none"
      mediaRatio={1.8}
      layoutClassName="lg:grid-cols-[minmax(0,1fr)_420px]"
      rowsClassName="grid grid-cols-1 gap-x-8 gap-y-4 text-sm md:grid-cols-3"
      rowClassName="pb-2"
      rows={[]}
      rowGroups={[
        {
          id: "fitment",
          label: "Fitment",
          rows: [
            {
              label: "Bolt Pattern",
              values: valueItems(
                specs?.bolt_pattern_ref,
                (value) => `/vehicles?boltPattern=${encodeURIComponent(value)}`,
              ),
            },
            {
              label: "Center Bore",
              values: valueItems(
                specs?.center_bore_ref,
                (value) => `/vehicles?centerBore=${encodeURIComponent(value)}`,
              ),
            },
          ],
        },
        {
          id: "wheels",
          label: "Wheels",
          rows: [
            {
              label: "Wheel Sizes",
              values: valueItems(
                specs?.wheel_diameter_ref,
                (value) => `/wheels?diameter=${encodeURIComponent(value)}`,
              ),
            },
            {
              label: "Widths",
              values: valueItems(
                specs?.wheel_width_ref,
                (value) => `/wheels?width=${encodeURIComponent(value)}`,
              ),
            },
          ],
        },
        {
          id: "vehicle-dimensions",
          label: "Vehicle Dimensions",
          rows: [
            {
              label: "Length",
              values: numberValueItem(dimensions?.vehicle_length_mm, "mm"),
            },
            {
              label: "Width",
              values: numberValueItem(dimensions?.vehicle_width_mm, "mm"),
            },
            {
              label: "Height",
              values: numberValueItem(dimensions?.vehicle_height_mm, "mm"),
            },
            {
              label: "Wheelbase",
              values: numberValueItem(dimensions?.wheelbase_mm, "mm"),
            },
          ],
        },
      ]}
    />
  );
}
