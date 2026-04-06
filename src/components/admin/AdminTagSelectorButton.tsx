import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AdminTagSelectorButtonProps {
  enabled: boolean;
  label: string;
  options: string[];
  onSelect: (value: string) => Promise<void> | void;
  allowCustom?: boolean;
}

export function AdminTagSelectorButton({
  enabled,
  label,
  options,
  onSelect,
  allowCustom = true,
}: AdminTagSelectorButtonProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const normalizedOptions = useMemo(
    () =>
      Array.from(
        new Set(
          options
            .map((option) => option.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [options]
  );

  if (!enabled) return null;

  const trimmedSearch = search.trim();
  const hasExact = normalizedOptions.some(
    (option) => option.toLowerCase() === trimmedSearch.toLowerCase()
  );

  const commit = async (value: string) => {
    const nextValue = value.trim();
    if (!nextValue) return;
    await onSelect(nextValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5 rounded-full border border-orange-400/60 bg-orange-500/20 text-orange-200 hover:bg-orange-500/30"
          title={`Add ${label}`}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${label.toLowerCase()}...`}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No matching values.</CommandEmpty>
            {allowCustom && trimmedSearch && !hasExact ? (
              <CommandGroup heading="Custom">
                <CommandItem onSelect={() => void commit(trimmedSearch)}>
                  Add "{trimmedSearch}"
                </CommandItem>
              </CommandGroup>
            ) : null}
            <CommandGroup heading={label}>
              {normalizedOptions.map((option) => (
                <CommandItem key={option} onSelect={() => void commit(option)}>
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
