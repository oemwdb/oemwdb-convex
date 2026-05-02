import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "../../../convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";

type EditableCollectionItemType =
  | "brand"
  | "vehicle"
  | "wheel"
  | "engine"
  | "color"
  | "vehicle_variant"
  | "wheel_variant";

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
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const draftRef = useRef(normalizedValue);
  const isFocusedRef = useRef(false);
  const isSavingRef = useRef(false);
  const lastSavedRef = useRef(normalizedValue);
  const pendingSaveRef = useRef<string | null>(null);

  useEffect(() => {
    if (normalizedValue === draftRef.current) {
      lastSavedRef.current = normalizedValue;
      setSaveState("saved");
      return;
    }

    if (!isFocusedRef.current && draftRef.current === lastSavedRef.current) {
      draftRef.current = normalizedValue;
      lastSavedRef.current = normalizedValue;
      setDraft(normalizedValue);
      setSaveState("saved");
    }
  }, [normalizedValue]);

  const saveDraft = useCallback(
    async (nextValue: string) => {
      if (!convexId || nextValue === lastSavedRef.current) return;

      pendingSaveRef.current = nextValue;
      if (isSavingRef.current) {
        setSaveState("saving");
        return;
      }

      isSavingRef.current = true;
      setSaveState("saving");
      try {
        while (pendingSaveRef.current !== null) {
          const valueToSave = pendingSaveRef.current;
          pendingSaveRef.current = null;

          if (valueToSave === lastSavedRef.current) continue;

          await updatePrivateBlurb({
            itemType,
            id: convexId as never,
            privateBlurb: valueToSave,
          });
          lastSavedRef.current = valueToSave;
        }
        setSaveState(draftRef.current === lastSavedRef.current ? "saved" : "saving");
      } catch (error) {
        setSaveState("error");
        toast.error(error instanceof Error ? error.message : "Failed to auto-save private blurb.");
      } finally {
        isSavingRef.current = false;
      }
    },
    [convexId, itemType, updatePrivateBlurb]
  );

  useEffect(() => {
    if (!convexId) return;
    if (draft === lastSavedRef.current) {
      setSaveState("saved");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void saveDraft(draft);
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [convexId, draft, saveDraft]);

  const handleDraftChange = (nextValue: string) => {
    draftRef.current = nextValue;
    setDraft(nextValue);
    if (nextValue !== lastSavedRef.current) {
      setSaveState("saving");
    }
  };

  return (
    <div className="overflow-hidden rounded-md border border-border bg-black">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="text-sky-300">&gt; you</span>
          <span className="text-amber-300">&lt; ai</span>
        </div>
        <span
          className={
            saveState === "error"
              ? "text-red-300"
              : saveState === "saving"
                ? "text-zinc-400"
                : "text-emerald-300"
          }
        >
          {saveState === "error" ? "save failed" : saveState === "saving" ? "saving" : "saved"}
        </span>
      </div>
      <Textarea
        value={draft}
        onChange={(event) => handleDraftChange(event.target.value)}
        onFocus={() => {
          isFocusedRef.current = true;
        }}
        onBlur={() => {
          isFocusedRef.current = false;
          void saveDraft(draftRef.current);
        }}
        placeholder={"> your note\n< ai note"}
        spellCheck={false}
        className="min-h-[460px] resize-y rounded-none border-0 bg-transparent px-4 py-4 font-mono text-[13px] leading-6 text-zinc-100 shadow-none selection:bg-sky-500/25 placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
