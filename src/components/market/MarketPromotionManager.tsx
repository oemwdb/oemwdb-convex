import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type {
  EligiblePromotionTarget,
  MarketPromotionMutationInput,
  PromotionSummary,
} from "@/components/market/types";

function toDateTimeLocal(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function fromDateTimeLocal(value: string) {
  if (!value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

interface MarketPromotionManagerProps {
  eligibleTargets: EligiblePromotionTarget[];
  promotions: PromotionSummary[];
  isSaving: boolean;
  onCreate: (value: MarketPromotionMutationInput) => Promise<void>;
  onUpdate: (promotionId: string, value: MarketPromotionMutationInput) => Promise<void>;
  onExpire: (promotionId: string) => Promise<void>;
  onCancel: (promotionId: string) => Promise<void>;
}

export function MarketPromotionManager({
  eligibleTargets,
  promotions,
  isSaving,
  onCreate,
  onUpdate,
  onExpire,
  onCancel,
}: MarketPromotionManagerProps) {
  const defaultTargetKey = eligibleTargets[0]?.key ?? "";
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [targetKey, setTargetKey] = useState(defaultTargetKey);
  const [slotType, setSlotType] = useState<MarketPromotionMutationInput["slot_type"]>("featured_row");
  const [status, setStatus] = useState<MarketPromotionMutationInput["status"]>("active");
  const [bookedPrice, setBookedPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  useEffect(() => {
    if (!targetKey && defaultTargetKey) {
      setTargetKey(defaultTargetKey);
    }
  }, [defaultTargetKey, targetKey]);

  const selectedTarget = useMemo(
    () => eligibleTargets.find((target) => target.key === targetKey) ?? null,
    [eligibleTargets, targetKey]
  );

  const resetForm = () => {
    setEditingPromotionId(null);
    setTargetKey(defaultTargetKey);
    setSlotType("featured_row");
    setStatus("active");
    setBookedPrice("");
    setSortOrder("");
    setStartAt("");
    setEndAt("");
  };

  const buildMutationValue = (): MarketPromotionMutationInput => {
    if (!selectedTarget) {
      throw new Error("Choose a linked target before saving a promotion.");
    }

    return {
      target_type: selectedTarget.target_type,
      brand_id: selectedTarget.target_type === "brand" ? selectedTarget.target_id : undefined,
      vehicle_id: selectedTarget.target_type === "vehicle" ? selectedTarget.target_id : undefined,
      wheel_id: selectedTarget.target_type === "wheel" ? selectedTarget.target_id : undefined,
      wheel_variant_id: selectedTarget.target_type === "wheel_variant" ? selectedTarget.target_id : undefined,
      slot_type: slotType,
      booked_price: bookedPrice.trim() ? Number(bookedPrice) : undefined,
      status,
      sort_order: sortOrder.trim() ? Number(sortOrder) : undefined,
      start_at: fromDateTimeLocal(startAt),
      end_at: fromDateTimeLocal(endAt),
    };
  };

  const handleEdit = (promotion: PromotionSummary) => {
    const nextTarget = eligibleTargets.find(
      (target) =>
        target.target_type === promotion.target_type &&
        ((promotion.target_type === "brand" && promotion.brand_id === target.target_id) ||
          (promotion.target_type === "vehicle" && promotion.vehicle_id === target.target_id) ||
          (promotion.target_type === "wheel" && promotion.wheel_id === target.target_id) ||
          (promotion.target_type === "wheel_variant" && promotion.wheel_variant_id === target.target_id))
    ) ?? eligibleTargets.find((target) => target.target_type === promotion.target_type) ?? null;

    setEditingPromotionId(promotion._id);
    setTargetKey(nextTarget?.key ?? defaultTargetKey);
    setSlotType(promotion.slot_type);
    setStatus(promotion.status);
    setBookedPrice(promotion.booked_price !== null ? String(promotion.booked_price) : "");
    setSortOrder(promotion.sort_order !== null ? String(promotion.sort_order) : "");
    setStartAt(toDateTimeLocal(promotion.start_at));
    setEndAt(toDateTimeLocal(promotion.end_at));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingPromotionId ? "Edit Promotion" : "Add Promotion"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {eligibleTargets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Link this listing to at least one brand, vehicle, wheel, or wheel variant before creating a promotion.
            </p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Target Surface</Label>
                  <Select value={targetKey} onValueChange={setTargetKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose target" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleTargets.map((target) => (
                        <SelectItem key={target.key} value={target.key}>
                          {target.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Slot</Label>
                  <Select value={slotType} onValueChange={(value) => setSlotType(value as MarketPromotionMutationInput["slot_type"])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top_slot">Top Slot</SelectItem>
                      <SelectItem value="featured_row">Featured Row</SelectItem>
                      <SelectItem value="boosted">Boosted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as MarketPromotionMutationInput["status"])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Booked Price</Label>
                  <Input
                    type="number"
                    value={bookedPrice}
                    onChange={(event) => setBookedPrice(event.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <Button
                    type="button"
                    disabled={isSaving || !selectedTarget}
                    onClick={async () => {
                      const value = buildMutationValue();
                      if (editingPromotionId) {
                        await onUpdate(editingPromotionId, value);
                      } else {
                        await onCreate(value);
                      }
                      resetForm();
                    }}
                  >
                    {editingPromotionId ? "Update Promotion" : "Create Promotion"}
                  </Button>
                  {editingPromotionId ? (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel Edit
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Starts At</Label>
                  <Input type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Ends At</Label>
                  <Input type="datetime-local" value={endAt} onChange={(event) => setEndAt(event.target.value)} />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {promotions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">No promotions booked for this listing yet.</p>
            </CardContent>
          </Card>
        ) : (
          promotions.map((promotion) => (
            <Card key={promotion._id}>
              <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{promotion.target_label}</Badge>
                    <Badge variant="outline">{promotion.slot_type}</Badge>
                    <Badge variant="secondary">{promotion.status}</Badge>
                    {promotion.isRenderable ? <Badge variant="secondary">Renderable</Badge> : null}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {promotion.start_at ? `Starts ${new Date(promotion.start_at).toLocaleString()}` : "Starts immediately"}
                    {promotion.end_at ? ` • Ends ${new Date(promotion.end_at).toLocaleString()}` : ""}
                    {promotion.booked_price !== null ? ` • Booked ${promotion.booked_price}` : ""}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => handleEdit(promotion)}>
                    Edit
                  </Button>
                  <Button type="button" variant="outline" onClick={() => void onExpire(promotion._id)}>
                    Expire
                  </Button>
                  <Button type="button" variant="outline" onClick={() => void onCancel(promotion._id)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
