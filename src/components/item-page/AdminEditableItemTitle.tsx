import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { AdminInlineEditableText } from "@/components/admin/AdminInlineEditableText";

type EditableCollectionItemType = "brand" | "vehicle" | "wheel" | "engine" | "color";

interface AdminEditableItemTitleProps {
  title: string;
  itemType: EditableCollectionItemType;
  convexId?: string | null;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export function AdminEditableItemTitle({
  title,
  itemType,
  convexId,
  className,
  inputClassName,
  placeholder,
}: AdminEditableItemTitleProps) {
  const { isAdmin } = useAuth();
  const updateTitle = useMutation(api.mutations.adminCollectionItemTitleUpdate);
  const [localTitle, setLocalTitle] = useState(title);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  return (
    <AdminInlineEditableText
      enabled={Boolean(isAdmin && convexId)}
      value={localTitle}
      placeholder={placeholder}
      className={className}
      inputClassName={inputClassName}
      onSave={async (nextValue) => {
        if (!convexId) return;
        const previous = localTitle;
        setLocalTitle(nextValue);

        try {
          await updateTitle({
            itemType,
            id: convexId as never,
            title: nextValue,
          });
          toast.success("Title updated");
        } catch (error) {
          setLocalTitle(previous);
          toast.error(error instanceof Error ? error.message : "Failed to update title.");
          throw error;
        }
      }}
    />
  );
}
