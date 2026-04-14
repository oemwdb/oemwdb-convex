import { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ItemPagePanel } from "@/components/item-page/ItemPageCommonBlocks";

type EditableCollectionItemType = "brand" | "vehicle" | "wheel" | "engine" | "color";

interface AdminPrivateBlurbTabProps {
  itemType: EditableCollectionItemType;
  convexId?: string | null;
  value?: string | null;
}

export function AdminPrivateBlurbTab({
  itemType,
  convexId,
  value,
}: AdminPrivateBlurbTabProps) {
  const updatePrivateBlurb = useMutation(api.mutations.adminCollectionItemPrivateBlurbUpdate);
  const normalizedValue = useMemo(() => value ?? "", [value]);
  const [draft, setDraft] = useState(normalizedValue);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(normalizedValue);
  }, [normalizedValue]);

  const isDirty = draft !== normalizedValue;
  const isDisabled = !convexId || isSaving;

  const handleSave = async () => {
    if (!convexId || !isDirty) return;

    setIsSaving(true);
    try {
      await updatePrivateBlurb({
        itemType,
        id: convexId as never,
        privateBlurb: draft,
      });
      toast.success("Private blurb updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update private blurb.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ItemPagePanel title="Private blurb">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Admin-only persistent notes for handoff, audit state, and item-specific context.
        </p>
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-black/30">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                void handleSave();
              }
            }}
            placeholder="Add admin-only working notes, audit state, source caveats, or handoff context..."
            className="min-h-[320px] resize-y border-0 bg-transparent px-4 py-4 font-mono text-[13px] leading-6 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Supports multi-line notes. Use Cmd/Ctrl + Enter to save.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDraft(normalizedValue)}
              disabled={isDisabled || !isDirty}
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={isDisabled || !isDirty}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </ItemPagePanel>
  );
}
