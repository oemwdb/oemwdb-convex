
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Image } from "lucide-react";

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  user: string;
  date: string;
}

interface GallerySectionProps {
  vehicleName: string;
  images: GalleryImage[];
}

const GallerySection = ({ vehicleName, images }: GallerySectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gallery</h2>
      <p className="text-slate-500 mb-4">Photos of {vehicleName}</p>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Button>
              <Image className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <p className="text-sm text-slate-500">Share photos of your {vehicleName}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <AspectRatio ratio={4/3}>
              <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
            </AspectRatio>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{image.user}</span>
                <span className="text-xs text-slate-500">{image.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GallerySection;
