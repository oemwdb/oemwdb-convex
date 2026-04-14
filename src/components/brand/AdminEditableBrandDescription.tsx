import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AdminEditableBrandDescriptionProps {
  value?: string | null;
  convexId?: string | null;
  className?: string;
  placeholder?: string;
}

export function AdminEditableBrandDescription({
  value,
  convexId,
  className,
  placeholder = "No brand description yet.",
}: AdminEditableBrandDescriptionProps) {
  const { isAdmin } = useAuth();
  const updateDescription = useMutation(api.mutations.adminBrandDescriptionUpdate);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  useEffect(() => {
    if (!editing) {
      setDraft(value ?? "");
    }
  }, [editing, value]);

  const enabled = Boolean(isAdmin && convexId);
  const displayValue = String(value ?? "").trim();

  const commit = async () => {
    if (!convexId) {
      setEditing(false);
      return;
    }

    const nextValue = draft.trim();
    const previousValue = String(value ?? "").trim();
    setEditing(false);
    if (nextValue === previousValue) return;

    setSaving(true);
    try {
      await updateDescription({
        id: convexId as never,
        description: nextValue,
      });
      toast.success("Brand description updated");
    } catch (error) {
      setDraft(value ?? "");
      toast.error(error instanceof Error ? error.message : "Failed to update brand description.");
    } finally {
      setSaving(false);
    }
  };

  if (!enabled) {
    return (
      <div className={className}>
        {displayValue ? (
          displayValue
        ) : (
          <span className="text-muted-foreground/70">{placeholder}</span>
        )}
      </div>
    );
  }

  if (editing) {
    return (
      <Textarea
        autoFocus
        value={draft}
        disabled={saving}
        placeholder={placeholder}
        className={cn(
          "min-h-[140px] resize-none border-0 bg-transparent px-0 py-0 font-inherit text-sm leading-7 text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0",
          className
        )}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => void commit()}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            void commit();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            setDraft(value ?? "");
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <div
      className={cn(className, "cursor-text")}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
      }}
      title="Double-click to edit"
    >
      {displayValue ? (
        displayValue
      ) : (
        <span className="text-muted-foreground/70">{placeholder}</span>
      )}
    </div>
  );
}
