
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const BrandsTab = () => {
  const { data: brands, isLoading, error } = { data: null as any, isLoading: false, error: null };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load brands. Please try again later.</p>
      </div>
    );
  }

  // Render a brand card with the consistent component structure
  const renderBrandCard = (brand: any) => (
    <div className="h-[120px] xs:h-[160px] w-full perspective-1000">
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <p className="font-medium text-center">{brand.brand_title}</p>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {(brands || []).map(brand => (
        <Link 
          key={brand.id} 
          to={`/brands/${brand.brand_title.toLowerCase().replace(/\s+/g, '-')}`}
          className="block"
        >
          {renderBrandCard(brand)}
        </Link>
      ))}
    </div>
  );
};

export default BrandsTab;
