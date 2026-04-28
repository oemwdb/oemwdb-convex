import ItemPageHeaderCard from "@/components/item-page/ItemPageHeaderCard";
import HeaderMediaImage from "@/components/item-page/HeaderMediaImage";

interface WheelVariantHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string | null;
  diameters?: string[];
  widths?: string[];
  offsets?: string[];
  boltPatterns?: string[];
  centerBores?: string[];
  finishTypes?: string[];
  colors?: string[];
  partNumbers?: string[];
  markets?: string[];
}

const valueItems = (values?: string[]) =>
  (values ?? []).filter(Boolean).map((value) => ({ label: value }));

export default function WheelVariantHeader({
  title,
  subtitle,
  description,
  image,
  diameters,
  widths,
  offsets,
  boltPatterns,
  centerBores,
  finishTypes,
  colors,
  partNumbers,
  markets,
}: WheelVariantHeaderProps) {
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
        { label: "Diameter", values: valueItems(diameters) },
        { label: "Width", values: valueItems(widths) },
        { label: "Offset", values: valueItems(offsets) },
        { label: "Bolt Pattern", values: valueItems(boltPatterns) },
        { label: "Center Bore", values: valueItems(centerBores) },
        { label: "Finish", values: valueItems(finishTypes) },
        { label: "Color", values: valueItems(colors) },
        { label: "Part Number", values: valueItems(partNumbers?.slice(0, 6)) },
        { label: "Market", values: valueItems(markets) },
      ]}
    />
  );
}
