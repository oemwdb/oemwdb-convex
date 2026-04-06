import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MarketTargetPicker } from "@/components/market/MarketTargetPicker";
import type {
  LinkTargetSearchResult,
  MarketListingMutationInput,
  MarketListingSummary,
} from "@/components/market/types";

function toPickerValue(
  value: { id: string; label: string; subtitle?: string | null } | null | undefined
): LinkTargetSearchResult | null {
  return value
    ? {
        id: value.id,
        label: value.label,
        subtitle: value.subtitle ?? null,
      }
    : null;
}

function joinLines(values: string[] | undefined) {
  return (values ?? []).join("\n");
}

interface MarketListingEditorProps {
  initialValue?: MarketListingSummary | null;
  submitLabel: string;
  isSaving: boolean;
  onSubmit: (value: MarketListingMutationInput) => Promise<void>;
}

export function MarketListingEditor({
  initialValue,
  submitLabel,
  isSaving,
  onSubmit,
}: MarketListingEditorProps) {
  const [listingType, setListingType] = useState<MarketListingMutationInput["listing_type"]>("wheel");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<MarketListingMutationInput["condition"]>("good");
  const [location, setLocation] = useState("");
  const [shippingAvailable, setShippingAvailable] = useState(false);
  const [status, setStatus] = useState<MarketListingMutationInput["status"]>("draft");
  const [imagesText, setImagesText] = useState("");
  const [documentsText, setDocumentsText] = useState("");
  const [brand, setBrand] = useState<LinkTargetSearchResult | null>(null);
  const [vehicle, setVehicle] = useState<LinkTargetSearchResult | null>(null);
  const [wheel, setWheel] = useState<LinkTargetSearchResult | null>(null);
  const [wheelVariant, setWheelVariant] = useState<LinkTargetSearchResult | null>(null);

  useEffect(() => {
    if (!initialValue) return;
    setListingType(initialValue.listing_type);
    setTitle(initialValue.title);
    setDescription(initialValue.description ?? "");
    setPrice(initialValue.price ? String(initialValue.price) : "");
    setCondition(initialValue.condition ?? "good");
    setLocation(initialValue.location ?? "");
    setShippingAvailable(initialValue.shipping_available ?? false);
    setStatus(initialValue.status);
    setImagesText(joinLines(initialValue.images));
    setDocumentsText(joinLines(initialValue.documents));
    setBrand(toPickerValue(initialValue.linkedTargets.brand));
    setVehicle(toPickerValue(initialValue.linkedTargets.vehicle));
    setWheel(toPickerValue(initialValue.linkedTargets.wheel));
    setWheelVariant(toPickerValue(initialValue.linkedTargets.wheelVariant));
  }, [initialValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="market-listing-type">Listing Type</Label>
            <Select value={listingType} onValueChange={(value) => setListingType(value as MarketListingMutationInput["listing_type"])}>
              <SelectTrigger id="market-listing-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheel">Wheel</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="part">Part</SelectItem>
                <SelectItem value="tire">Tire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="market-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as MarketListingMutationInput["status"])}>
              <SelectTrigger id="market-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="market-title">Title</Label>
          <Input
            id="market-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="OEM wheel set, vehicle, or part title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="market-description">Description</Label>
          <Textarea
            id="market-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-32"
            placeholder="Condition notes, included parts, known issues, provenance."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="market-price">Price</Label>
            <Input
              id="market-price"
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="market-condition">Condition</Label>
            <Select value={condition ?? "good"} onValueChange={(value) => setCondition(value as MarketListingMutationInput["condition"])}>
              <SelectTrigger id="market-condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="parts">For Parts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="market-location">Location</Label>
            <Input
              id="market-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City, region"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
          <div>
            <div className="text-sm font-medium">Shipping available</div>
            <div className="text-xs text-muted-foreground">
              Controls the shipping badge and admin filters.
            </div>
          </div>
          <Switch checked={shippingAvailable} onCheckedChange={(checked) => setShippingAvailable(checked)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MarketTargetPicker
            label="Linked Brand"
            targetType="brand"
            value={brand}
            onChange={setBrand}
          />
          <MarketTargetPicker
            label="Linked Vehicle"
            targetType="vehicle"
            value={vehicle}
            onChange={setVehicle}
          />
          <MarketTargetPicker
            label="Linked Wheel"
            targetType="wheel"
            value={wheel}
            onChange={setWheel}
          />
          <MarketTargetPicker
            label="Linked Wheel Variant"
            targetType="wheel_variant"
            value={wheelVariant}
            onChange={setWheelVariant}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="market-images">Image URLs</Label>
            <Textarea
              id="market-images"
              value={imagesText}
              onChange={(event) => setImagesText(event.target.value)}
              className="min-h-28"
              placeholder="One image URL per line"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="market-documents">Document URLs</Label>
            <Textarea
              id="market-documents"
              value={documentsText}
              onChange={(event) => setDocumentsText(event.target.value)}
              className="min-h-28"
              placeholder="One document URL per line"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            disabled={isSaving}
            onClick={() =>
              void onSubmit({
                listing_type: listingType,
                title: title.trim(),
                description: description.trim() || undefined,
                price: price.trim() ? Number(price) : undefined,
                condition,
                location: location.trim() || undefined,
                shipping_available: shippingAvailable,
                images: imagesText
                  .split(/\n+/)
                  .map((value) => value.trim())
                  .filter(Boolean),
                documents: documentsText
                  .split(/\n+/)
                  .map((value) => value.trim())
                  .filter(Boolean),
                status,
                brand_id: brand?.id,
                vehicle_id: vehicle?.id,
                wheel_id: wheel?.id,
                wheel_variant_id: wheelVariant?.id,
              })
            }
          >
            {isSaving ? "Saving..." : submitLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
