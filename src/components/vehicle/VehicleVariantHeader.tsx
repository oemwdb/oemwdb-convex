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
        <HeaderMediaImage
          alt={title}
          sources={[{ value: image, bucketHint: "oemwdb images" }]}
        />
      }
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
