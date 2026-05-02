import ItemPageHeaderCard from "@/components/item-page/ItemPageHeaderCard";
import HeaderMediaImage from "@/components/item-page/HeaderMediaImage";

interface VehicleVariantHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string | null;
  engines?: string[];
  markets?: string[];
  bodyStyles?: string[];
  driveTypes?: string[];
  boltPatterns?: string[];
  centerBores?: string[];
  diameters?: string[];
  widths?: string[];
}

const valueItems = (values?: string[]) =>
  (values ?? []).filter(Boolean).map((value) => ({ label: value }));

export default function VehicleVariantHeader({
  title,
  subtitle,
  description,
  image,
  engines,
  markets,
  bodyStyles,
  driveTypes,
  boltPatterns,
  centerBores,
  diameters,
  widths,
}: VehicleVariantHeaderProps) {
  return (
    <ItemPageHeaderCard
      title={title}
      subtitle={subtitle}
      description={description}
      media={
        <div className="relative h-full w-full">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[10%] left-1/2 h-5 w-[68%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.32)_42%,rgba(0,0,0,0)_72%)] blur-[1px]"
          />
          <HeaderMediaImage
            alt={title}
            sources={[
              {
                value: image,
                bucketHint: "oemwdb images",
                fitMode: "contain",
                imageClassName: "max-h-full max-w-full",
              },
            ]}
            className="relative z-10 h-full w-full object-contain"
            containerClassName="relative z-10 flex h-full w-full items-center justify-center px-2 pb-[8%] pt-1"
          />
        </div>
      }
      mediaFrameClassName="overflow-visible rounded-none border-0 bg-transparent shadow-none"
      rows={[
        { label: "Engine", values: valueItems(engines) },
        { label: "Market", values: valueItems(markets) },
        { label: "Body Style", values: valueItems(bodyStyles) },
        { label: "Drive", values: valueItems(driveTypes) },
        { label: "Bolt Pattern", values: valueItems(boltPatterns) },
        { label: "Center Bore", values: valueItems(centerBores) },
        { label: "Wheel Sizes", values: valueItems(diameters) },
        { label: "Widths", values: valueItems(widths) },
      ]}
    />
  );
}
