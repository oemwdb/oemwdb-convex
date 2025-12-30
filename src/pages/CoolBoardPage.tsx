import React, { useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RandomItemCard from "@/components/coolboard/RandomItemCard";
import RatingButtons from "@/components/coolboard/RatingButtons";
import RatingsKanban from "@/components/coolboard/RatingsKanban";
import CommunityJustifications from "@/components/coolboard/CommunityJustifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CoolBoardPage = () => {
  const [currentItem, setCurrentItem] = useState<{ type: string; id: number } | null>(null);
  const [selectedType, setSelectedType] = useState<'brands' | 'vehicles' | 'wheels' | 'colors'>('brands');
  const { user } = useAuth();
  const randomItemCardRef = useRef<any>(null);

  const handleItemChange = (type: string, id: number) => {
    setCurrentItem({ type, id });
  };

  return (
    <DashboardLayout title="Cool Board" showFilterButton={false} disableContentPadding={true}>
      <div className="h-full p-2 space-y-4 overflow-y-auto">
        {/* Tabs at Top */}
        <Tabs defaultValue="brands" value={selectedType} onValueChange={(value) => setSelectedType(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="wheels">Wheels</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Centered Content */}
        <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
          {/* Random Item Card */}
          <div className="w-full">
            <RandomItemCard
              ref={randomItemCardRef}
              onItemChange={handleItemChange}
              filterType={selectedType === 'colors' ? 'wheel' : selectedType.slice(0, -1) as any}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => randomItemCardRef.current?.handlePrevious()}
              variant="outline"
              className="flex-1 h-12"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => randomItemCardRef.current?.handleNext()}
              variant="outline"
              className="flex-1 h-12"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Rating Buttons */}
          {currentItem && (
            <div className="w-full">
              <RatingButtons
                itemType={currentItem.type as 'brand' | 'vehicle' | 'wheel'}
                itemId={currentItem.id}
                userId={user?.id}
              />
            </div>
          )}
        </div>

        {/* Bottom Section: Live Ratings and Comments as Tabs */}
        <Tabs defaultValue="ratings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ratings">Live Ratings</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="ratings" className="w-full mt-6">
            {user ? (
              <div className="w-full">
                <RatingsKanban userId={user.id} />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Sign in to see your rating history
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="w-full mt-6">
            <Card>
              <CardContent className="p-6">
                {currentItem ? (
                  <div className="max-h-[400px] overflow-y-auto">
                    <CommunityJustifications
                      itemType={currentItem.type as 'brand' | 'vehicle' | 'wheel'}
                      itemId={currentItem.id}
                      userId={user?.id}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select an item to see community comments
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CoolBoardPage;