import ItemPageHeaderCard from "@/components/item-page/ItemPageHeaderCard";
import HeaderMediaImage from "@/components/item-page/HeaderMediaImage";
import { useDevMode } from "@/hooks/useDevMode";
import { useAuth } from "@/contexts/AuthContext";

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
  goodPicUrl,
  badPicUrl,
  itemId,
  convexId,
  specs,
}: VehicleHeaderProps) {
  const { isDevMode } = useDevMode();
  const { isAdmin } = useAuth();
  const preferBadPic = isAdmin && isDevMode;
  const sources = preferBadPic
    ? [
        {
          value: badPicUrl,
          bucketHint: "BADPICS",
          fitMode: "contain" as const,
          imageClassName: "max-h-[86%] max-w-[86%]",
        },
        { value: goodPicUrl, bucketHint: "oemwdb images", fitMode: "cover" as const },
        { value: image, bucketHint: "oemwdb images", fitMode: "cover" as const },
      ]
    : [
        { value: goodPicUrl, bucketHint: "oemwdb images", fitMode: "cover" as const },
        {
          value: badPicUrl,
          bucketHint: "BADPICS",
          fitMode: "contain" as const,
          imageClassName: "max-h-[86%] max-w-[86%]",
        },
        { value: image, bucketHint: "oemwdb images", fitMode: "cover" as const },
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
        <HeaderMediaImage
          alt={name}
          sources={sources}
        />
      }
      mediaFrameClassName="border-transparent"
      mediaRatio={1.8}
      layoutClassName="lg:grid-cols-[minmax(0,1fr)_420px]"
      rowsClassName="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2"
      rowClassName="pb-2"
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
