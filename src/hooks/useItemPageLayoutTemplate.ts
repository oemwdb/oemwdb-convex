import { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "../../convex/_generated/api";
import { useConvexResourceQuery } from "@/hooks/useConvexResourceQuery";
import {
  DEFAULT_ITEM_PAGE_LAYOUT_SCOPE,
  FALLBACK_ITEM_PAGE_TEMPLATES,
  normalizeItemPageTemplate,
  parseItemPageLayoutRecord,
  serializeItemPageLayoutTemplate,
} from "@/lib/itemPageLayouts";
import type {
  ItemPageLayoutTemplate,
  ItemPageType,
  PersistedItemPageLayoutRecord,
} from "@/types/itemPageLayout";

export function useResolvedItemPageLayoutTemplate(pageType: ItemPageType) {
  const fallback = FALLBACK_ITEM_PAGE_TEMPLATES[pageType];
  const resource = useConvexResourceQuery<PersistedItemPageLayoutRecord | null>({
    queryKey: ["item-page-layout", pageType],
    queryRef: api.pageLayouts.getTemplate,
    args: {
      pageType,
      layoutScope: DEFAULT_ITEM_PAGE_LAYOUT_SCOPE,
    },
  });

  const template = useMemo(() => {
    if (resource.isBackendUnavailable || resource.isError || !resource.data) {
      return normalizeItemPageTemplate(pageType, fallback);
    }
    return parseItemPageLayoutRecord(pageType, resource.data);
  }, [fallback, pageType, resource.data, resource.isBackendUnavailable, resource.isError]);

  return {
    template,
    layoutDoc: resource.data,
    isLoading: resource.isInitialLoading,
    isBackendUnavailable: resource.isBackendUnavailable,
    error: resource.error,
  };
}

export function useItemPageLayoutTemplateEditor(pageType: ItemPageType) {
  const { template: resolvedTemplate, layoutDoc, isLoading, isBackendUnavailable, error } =
    useResolvedItemPageLayoutTemplate(pageType);
  const [draftTemplate, setDraftTemplate] = useState<ItemPageLayoutTemplate>(resolvedTemplate);
  const upsertTemplate = useMutation(api.pageLayouts.upsertTemplate);
  const resetTemplate = useMutation(api.pageLayouts.resetTemplate);

  useEffect(() => {
    setDraftTemplate(resolvedTemplate);
  }, [resolvedTemplate]);

  const isDirty = useMemo(
    () => JSON.stringify(draftTemplate) !== JSON.stringify(resolvedTemplate),
    [draftTemplate, resolvedTemplate],
  );

  const save = async () => {
    const normalized = normalizeItemPageTemplate(pageType, draftTemplate);
    const serialized = serializeItemPageLayoutTemplate(normalized);

    try {
      await upsertTemplate({
        pageType,
        layoutScope: DEFAULT_ITEM_PAGE_LAYOUT_SCOPE,
        version: serialized.version,
        titleTabLabelMode: serialized.titleTabLabelMode,
        defaultActiveTab: serialized.defaultActiveTab,
        containerStyleJson: serialized.containerStyleJson,
        templateJson: serialized.templateJson,
      });
      setDraftTemplate(normalized);
      toast("Layout saved", {
        description: "The page template is now persisted on the active backend.",
      });
    } catch (saveError) {
      toast("Save failed", {
        description:
          saveError instanceof Error
            ? saveError.message
            : "Could not save the page template on this backend.",
      });
      throw saveError;
    }
  };

  const reset = async () => {
    try {
      await resetTemplate({
        pageType,
        layoutScope: DEFAULT_ITEM_PAGE_LAYOUT_SCOPE,
      });
      setDraftTemplate(FALLBACK_ITEM_PAGE_TEMPLATES[pageType]);
      toast("Template reset", {
        description: "The saved layout was removed and the fallback template is active again.",
      });
    } catch (resetError) {
      toast("Reset failed", {
        description:
          resetError instanceof Error
            ? resetError.message
            : "Could not reset the page template on this backend.",
      });
      throw resetError;
    }
  };

  return {
    draftTemplate,
    setDraftTemplate,
    resolvedTemplate,
    layoutDoc,
    isDirty,
    isLoading,
    isBackendUnavailable,
    error,
    save,
    reset,
  };
}
