import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FilterField {
    label: string;
    category: string;
    values: string[];
}

interface CollectionSecondarySidebarProps {
    title: string;
    filterFields: FilterField[];
    parsedFilters: Record<string, string[] | undefined>;
    onTagClick: (tag: string, category: string) => void;
    onClearAll?: () => void;
    searchPlaceholder?: string;
    onSearchChange?: (value: string) => void;
    searchValue?: string;
    searchTags?: string[];
    onAddSearchTag?: (tag: string) => void;
    onRemoveSearchTag?: (tag: string) => void;
    totalResults?: number;
}

export const CollectionSecondarySidebar = ({
    title,
    filterFields,
    parsedFilters,
    onTagClick,
    onClearAll,
    searchPlaceholder = "Search...",
    onSearchChange,
    searchValue = "",
    searchTags = [],
    onAddSearchTag,
    onRemoveSearchTag,
    totalResults
}: CollectionSecondarySidebarProps) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
        Object.fromEntries(filterFields.map((f) => [f.category, f.category === "brand"]))
    );

    const hasActiveFilters = Object.values(parsedFilters).some(arr => arr && arr.length > 0) || searchTags.length > 0;

    const toggleSection = (category: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Filter sections */}
            <div className="flex-1 overflow-y-auto border-t border-border/60">
                {filterFields.map((field) => {
                    const isExpanded = expandedSections[field.category];
                    const activeCount = parsedFilters[field.category]?.length || 0;

                    return (
                        <div key={field.category} className="border-b border-border/50">
                            <button
                                onClick={() => toggleSection(field.category)}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                            >
                                <span className="text-xs font-medium text-foreground flex items-center gap-2">
                                    {field.label}
                                    {activeCount > 0 && (
                                        <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px]">
                                            {activeCount}
                                        </span>
                                    )}
                                </span>
                                {isExpanded ? (
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="px-3 pb-2 flex flex-wrap gap-1">
                                    {field.values.slice(0, 20).map((value, idx) => {
                                        const isActive = parsedFilters[field.category]?.includes(value);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => onTagClick(value, field.category)}
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
                                    {field.values.length > 20 && (
                                        <span className="text-[10px] text-muted-foreground py-0.5">
                                            +{field.values.length - 20} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border">
                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                    <span
                        className={cn(
                            "block w-full px-3 py-1.5 rounded-full border border-border bg-card/80 text-right",
                            !totalResults && "invisible"
                        )}
                    >
                        {totalResults !== undefined ? `${totalResults} results` : ''}
                    </span>
                    {hasActiveFilters && (
                        <button
                            onClick={onClearAll}
                            className="self-end text-primary hover:underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionSecondarySidebar;
