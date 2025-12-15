import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface HighlightableField {
  id: string;
  value: string;
  label: string;
}

interface HighlightableGallerySectionProps {
  fields: HighlightableField[];
  hoveredMapping: string | null;
  onElementClick: (elementId: string) => void;
  onElementHover: (elementId: string | null) => void;
}

const HighlightableGallerySection: React.FC<HighlightableGallerySectionProps> = ({
  fields,
  hoveredMapping,
  onElementClick,
  onElementHover,
}) => {
  const getFieldValue = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field?.value || `[${fieldId.toUpperCase()}]`;
  };

  const renderField = (fieldId: string, defaultValue: string, className?: string) => {
    const isHighlighted = hoveredMapping === fieldId;
    
    return (
      <span
        className={cn(
          "cursor-pointer transition-all duration-200 px-1 rounded",
          isHighlighted && "bg-yellow-200 dark:bg-yellow-900/50",
          className
        )}
        onClick={() => onElementClick(fieldId)}
        onMouseEnter={() => onElementHover(fieldId)}
        onMouseLeave={() => onElementHover(null)}
      >
        {getFieldValue(fieldId) || defaultValue}
      </span>
    );
  };

  // Mock gallery images for demonstration
  const mockImages = [
    { id: 1, user: "User1", date: "2024-01-15" },
    { id: 2, user: "User2", date: "2024-01-14" },
    { id: 3, user: "User3", date: "2024-01-13" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gallery</h2>
      <p className="text-muted-foreground mb-4">
        {renderField("galleryDescription", "Photos collection")}
      </p>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Button>
              <Image className="mr-2 h-4 w-4" />
              {renderField("uploadButtonText", "Upload Image")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {renderField("uploadDescription", "Share your photos")}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockImages.map((image, index) => (
          <Card key={image.id} className="overflow-hidden">
            <AspectRatio ratio={4/3}>
              <div className="w-full h-full bg-muted flex items-center justify-center">
                {renderField(`galleryImage${index}`, "[IMAGE]", "text-sm text-muted-foreground")}
              </div>
            </AspectRatio>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {renderField(`imageUser${index}`, image.user)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {renderField(`imageDate${index}`, image.date)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HighlightableGallerySection;