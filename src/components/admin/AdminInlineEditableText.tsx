import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AdminInlineEditableTextProps {
  enabled: boolean;
  value: string;
  onSave: (nextValue: string) => Promise<void> | void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export function AdminInlineEditableText({
  enabled,
  value,
  onSave,
  className,
  inputClassName,
  placeholder,
}: AdminInlineEditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [editing, value]);

  const commit = async () => {
    const nextValue = draft.trim();
    setEditing(false);
    if (nextValue === value.trim()) return;
    setSaving(true);
    try {
      await onSave(nextValue);
    } finally {
      setSaving(false);
    }
  };

  if (!enabled) {
    return <span className={className}>{value}</span>;
  }

  if (editing) {
    return (
      <Input
        autoFocus
        value={draft}
        placeholder={placeholder}
        className={cn("h-9 rounded-lg border-white/15 bg-black/30", inputClassName)}
        disabled={saving}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => void commit()}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void commit();
          }
          if (event.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <span
      className={cn(className, "cursor-text")}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
      }}
      title="Double-click to edit"
    >
      {value}
    </span>
  );
}
