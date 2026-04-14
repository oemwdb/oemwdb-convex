import ItemPageHeaderCard from "@/components/item-page/ItemPageHeaderCard";

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
  itemId?: string;
  convexId?: string;
  specs?: {
    bolt_pattern_ref?: string[];
    center_bore_ref?: string[];
    wheel_diameter_ref?: string[];
    wheel_width_ref?: string[];
  };
}

const valueItems = (values?: string[], hrefBuilder?: (value: string) => string) =>
  (values ?? []).filter(Boolean).map((value) => ({
    label: value,
    href: hrefBuilder ? hrefBuilder(value) : undefined,
  }));

export default function VehicleHeader({
  name,
  generation,
  years,
  engines,
  drive,
  segment,
  image,
  itemId,
  convexId,
  specs,
}: VehicleHeaderProps) {
  return (
    <ItemPageHeaderCard
      title={name}
      editableTitleType="vehicle"
      subtitle={[generation, years].filter(Boolean).join(" • ")}
      itemId={itemId}
      itemType="vehicle"
      convexId={convexId}
      media={
        image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            onError={(event) => {
              (event.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="px-2 text-center text-xs text-muted-foreground">
              No image available
            </span>
          </div>
        )
      }
      rows={[
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
        {
          label: "Segment",
          values: segment && segment !== "-" ? [{ label: segment }] : [],
        },
        {
          label: "Drive",
          values: drive && drive !== "-" ? [{ label: drive }] : [],
        },
        {
          label: "Engines",
          span: "full",
          values: engines.slice(0, 6).map((engine) => ({ label: engine })),
        },
      ]}
    />
  );
}
