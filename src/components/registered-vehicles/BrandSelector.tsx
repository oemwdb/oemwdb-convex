import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabaseBrands } from "@/hooks/useSupabaseBrands";

interface BrandSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function BrandSelector({ value, onValueChange, disabled }: BrandSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: brands = [], isLoading } = useSupabaseBrands();

  const selectedBrand = brands?.find((brand) => brand.id === value);

  const filteredBrands = useMemo(() => {
    if (!searchTerm) return brands;
    return brands.filter((brand) =>
      brand.brand_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

  if (isLoading) {
    return (
      <div className="w-full p-2 border rounded-md bg-muted text-muted-foreground">
        Loading brands...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="Search brands..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={disabled}
      />
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {selectedBrand ? (
              <div className="flex items-center gap-2">
                {selectedBrand.brand_image_url && (
                  <img
                    src={selectedBrand.brand_image_url}
                    alt={selectedBrand.brand_title}
                    className="h-5 w-5 object-contain"
                  />
                )}
                <span>{selectedBrand.brand_title}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Select brand...</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filteredBrands.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              No brands found
            </div>
          ) : (
            filteredBrands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                <div className="flex items-center gap-2">
                  {brand.brand_image_url && (
                    <img
                      src={brand.brand_image_url}
                      alt={brand.brand_title}
                      className="h-5 w-5 object-contain"
                    />
                  )}
                  <span>{brand.brand_title}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
