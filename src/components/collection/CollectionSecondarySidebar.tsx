import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

export interface FilterField {
  label: string;
  category: string;
  values: string[];
}

interface CollectionSecondarySidebarStateArgs {
  title: string;
  filterFields: FilterField[];
  parsedFilters: Record<string, string[] | undefined>;
  onApply: (payload: { filters: Record<string, string[] | undefined>; searchQuery: string }) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  totalResults?: number;
}

export interface CollectionSecondarySidebarState {
  title: string;
  filterFields: FilterField[];
  expandedSections: Record<string, boolean>;
  draftFilters: Record<string, string[] | undefined>;
  draftSearch: string;
  searchPlaceholder: string;
  totalResults?: number;
  hasPendingChanges: boolean;
  hasDraftFilters: boolean;
  toggleSection: (category: string) => void;
  toggleTag: (tag: string, category: string) => void;
  setDraftSearch: (value: string) => void;
  handleApply: () => void;
  handleClearDraft: () => void;
}

const normalizeFilters = (filters: Record<string, string[] | undefined>) =>
  Object.fromEntries(
    Object.entries(filters)
      .map(([key, values]) => [key, [...new Set((values ?? []).filter(Boolean))].sort()] as const)
      .filter(([, values]) => values.length > 0)
      .sort(([left], [right]) => left.localeCompare(right))
  );

export function useCollectionSecondarySidebarState({
  title,
  filterFields,
  parsedFilters,
  onApply,
  searchPlaceholder = "Search...",
  searchValue = "",
  totalResults,
}: CollectionSecondarySidebarStateArgs): CollectionSecondarySidebarState {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(filterFields.map((field) => [field.category, field.category === "brand"]))
  );
  const [draftFilters, setDraftFilters] = useState<Record<string, string[] | undefined>>(parsedFilters);
  const [draftSearch, setDraftSearch] = useState(searchValue);

  useEffect(() => {
    setDraftFilters(parsedFilters);
  }, [parsedFilters]);

  useEffect(() => {
    setDraftSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    setExpandedSections((current) => ({
      ...Object.fromEntries(filterFields.map((field) => [field.category, field.category === "brand"])),
      ...current,
    }));
  }, [filterFields]);

  const normalizedAppliedFilters = useMemo(() => normalizeFilters(parsedFilters), [parsedFilters]);
  const normalizedDraftFilters = useMemo(() => normalizeFilters(draftFilters), [draftFilters]);
  const appliedSearch = searchValue.trim();
  const draftSearchTrimmed = draftSearch.trim();
  const hasPendingChanges =
    appliedSearch !== draftSearchTrimmed ||
    JSON.stringify(normalizedAppliedFilters) !== JSON.stringify(normalizedDraftFilters);
  const hasDraftFilters =
    Object.values(draftFilters).some((arr) => arr && arr.length > 0) || draftSearchTrimmed.length > 0;

  const toggleSection = (category: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleTag = (tag: string, category: string) => {
    setDraftFilters((current) => {
      const currentValues = current[category] ?? [];
      const nextValues = currentValues.includes(tag)
        ? currentValues.filter((value) => value !== tag)
        : [...currentValues, tag];

      return {
        ...current,
        [category]: nextValues.length > 0 ? nextValues : undefined,
      };
    });
  };

  const handleApply = () => {
    onApply({
      filters: normalizedDraftFilters,
      searchQuery: draftSearchTrimmed,
    });
  };

  const handleClearDraft = () => {
    setDraftFilters({});
    setDraftSearch("");
  };

  return {
    title,
    filterFields,
    expandedSections,
    draftFilters,
    draftSearch,
    searchPlaceholder,
    totalResults,
    hasPendingChanges,
    hasDraftFilters,
    toggleSection,
    toggleTag,
    setDraftSearch,
    handleApply,
    handleClearDraft,
  };
}

export function CollectionSecondarySidebarHeader({
  state,
}: {
  state: CollectionSecondarySidebarState;
}) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={state.draftSearch}
        onChange={(event) => state.setDraftSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            state.handleApply();
          }
        }}
        placeholder={state.searchPlaceholder || state.title}
        className="h-8 w-full rounded-full border border-border/70 bg-black px-3 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-border focus:ring-0"
      />
      <button
        type="button"
        onClick={state.handleApply}
        className={cn(
          "absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors",
          state.hasPendingChanges
            ? "text-emerald-400 hover:text-emerald-300"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Apply filters"
      >
        <Search className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function CollectionSecondarySidebarBody({
  state,
}: {
  state: CollectionSecondarySidebarState;
}) {
  const [showAllValuesByCategory, setShowAllValuesByCategory] = useState<Record<string, boolean>>({});
  const [hasOverflowByCategory, setHasOverflowByCategory] = useState<Record<string, boolean>>({});
  const [collapsedHeightByCategory, setCollapsedHeightByCategory] = useState<Record<string, number>>({});
  const valuesContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tagRefs = useRef<Record<string, Array<HTMLButtonElement | null>>>({});

  useEffect(() => {
    const measureOverflow = () => {
      const nextOverflow: Record<string, boolean> = {};
      const nextCollapsedHeights: Record<string, number> = {};

      state.filterFields.forEach((field) => {
        const container = valuesContainerRefs.current[field.category];
        const tags = (tagRefs.current[field.category] ?? []).filter(
          (value): value is HTMLButtonElement => Boolean(value),
        );

        if (!container) {
          nextOverflow[field.category] = false;
          return;
        }

        nextOverflow[field.category] = container.scrollHeight > container.clientHeight + 1;

        if (tags.length === 0) {
          return;
        }

        const uniqueRowTops = [...new Set(tags.map((tag) => tag.offsetTop))].sort((left, right) => left - right);
        if (uniqueRowTops.length <= 2) {
          return;
        }

        const firstRowTop = uniqueRowTops[0];
        const secondRowTop = uniqueRowTops[1];
        const secondRowTags = tags.filter((tag) => tag.offsetTop === secondRowTop);
        const secondRowBottom =
          secondRowTags.length > 0
            ? Math.max(...secondRowTags.map((tag) => tag.offsetTop + tag.offsetHeight))
            : secondRowTop;

        nextCollapsedHeights[field.category] = secondRowBottom - firstRowTop;
      });

      setHasOverflowByCategory((current) => {
        const currentSerialized = JSON.stringify(current);
        const nextSerialized = JSON.stringify(nextOverflow);
        return currentSerialized === nextSerialized ? current : nextOverflow;
      });

      setCollapsedHeightByCategory((current) => {
        const currentSerialized = JSON.stringify(current);
        const nextSerialized = JSON.stringify(nextCollapsedHeights);
        return currentSerialized === nextSerialized ? current : nextCollapsedHeights;
      });
    };

    const timeoutId = window.setTimeout(measureOverflow, 0);
    window.addEventListener("resize", measureOverflow);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", measureOverflow);
    };
  }, [state.filterFields, showAllValuesByCategory]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {state.filterFields.map((field) => {
          const isExpanded = state.expandedSections[field.category];
          const activeCount = state.draftFilters[field.category]?.length || 0;
          const showAllValues = showAllValuesByCategory[field.category] ?? false;
          const hasOverflow = hasOverflowByCategory[field.category] ?? false;
          const collapsedHeight = collapsedHeightByCategory[field.category];

          return (
            <div key={field.category} className="border-b border-border/50">
              <button
                onClick={() => state.toggleSection(field.category)}
                className="group w-full flex items-center justify-between px-3 py-2 transition-colors text-left"
              >
                <span className="text-xs font-medium text-foreground flex items-center gap-2 transition-colors group-hover:text-white">
                  {field.label}
                  {activeCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px]">
                      {activeCount}
                    </span>
                  )}
                </span>
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-white" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-white" />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-2">
                  <div
                    ref={(element) => {
                      valuesContainerRefs.current[field.category] = element;
                    }}
                    className="flex flex-wrap gap-1 overflow-hidden"
                    style={!showAllValues && collapsedHeight ? { maxHeight: `${collapsedHeight}px` } : undefined}
                  >
                    {field.values.map((value, idx) => {
                      const isActive = state.draftFilters[field.category]?.includes(value);
                      return (
                        <button
                          key={idx}
                          ref={(element) => {
                            const currentRefs = tagRefs.current[field.category] ?? [];
                            currentRefs[idx] = element;
                            tagRefs.current[field.category] = currentRefs;
                          }}
                          onClick={() => state.toggleTag(value, field.category)}
                          className={cn(
                            "text-[11px] px-2 py-0.5 rounded-full border transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}
                  </div>
                  {hasOverflow && !showAllValues ? (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAllValuesByCategory((current) => ({
                          ...current,
                          [field.category]: true,
                        }))
                      }
                      className="text-[10px] text-muted-foreground py-0.5 hover:text-foreground transition-colors"
                    >
                      +more
                    </button>
                  ) : null}
                  {hasOverflow && showAllValues ? (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAllValuesByCategory((current) => ({
                          ...current,
                          [field.category]: false,
                        }))
                      }
                      className="text-[10px] text-muted-foreground py-0.5 hover:text-foreground transition-colors"
                    >
                      Show less
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <span
            className={cn(
              "block w-full px-3 py-1.5 rounded-full border border-border bg-card/80 text-right",
              state.totalResults === undefined && "invisible"
            )}
          >
            {state.totalResults !== undefined ? `${state.totalResults} results` : ""}
          </span>
          {state.hasDraftFilters && (
            <button
              onClick={state.handleClearDraft}
              className="self-end text-primary hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const CollectionSecondarySidebar = ({
  title,
  filterFields,
  parsedFilters,
  onApply,
  searchPlaceholder = "Search...",
  searchValue = "",
  totalResults,
}: CollectionSecondarySidebarStateArgs) => {
  const state = useCollectionSecondarySidebarState({
    title,
    filterFields,
    parsedFilters,
    onApply,
    searchPlaceholder,
    searchValue,
    totalResults,
  });

  return <CollectionSecondarySidebarBody state={state} />;
};

export default CollectionSecondarySidebar;
