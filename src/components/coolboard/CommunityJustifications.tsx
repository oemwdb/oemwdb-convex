import React, { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CommunityJustificationsProps {
  itemType: 'brand' | 'vehicle' | 'wheel';
  itemId: number;
  userId?: string;
}

interface Justification {
  id: string;
  userId: string;
  rating: number;
  justification: string;
  createdAt: string;
  userProfile?: {
    username: string;
    avatarUrl?: string;
  };
}

const CommunityJustifications: React.FC<CommunityJustificationsProps> = ({ 
  itemType, 
  itemId,
  userId 
}) => {
  const [justifications, setJustifications] = useState<Justification[]>([]);
  const [myJustification, setMyJustification] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const ratingLabels = {
    1: "Very Uncool",
    2: "Uncool",
    3: "Meh",
    4: "Cool",
    5: "Very Cool"
  };

  const ratingColors = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-gray-500",
    4: "bg-blue-500",
    5: "bg-green-500"
  };

  useEffect(() => {
    if (itemId) {
      fetchJustifications();
    }
  }, [itemId, itemType]);

  const fetchJustifications = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('cool_ratings')
        .select(`
          id,
          user_id,
          rating,
          justification,
          created_at
        `)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .not('justification', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        rating: item.rating,
        justification: item.justification || '',
        createdAt: item.created_at,
        userProfile: undefined
      }));

      setJustifications(formattedData);

      // Set current user's justification if exists
      const userJustification = formattedData.find(j => j.userId === userId);
      if (userJustification) {
        setMyJustification(userJustification.justification);
      }
    } catch (error) {
      console.error('Error fetching justifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJustification = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add your justification",
        variant: "destructive"
      });
      return;
    }

    if (!myJustification.trim()) {
      toast({
        title: "Empty justification",
        description: "Please write something before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('cool_ratings')
        .update({ justification: myJustification })
        .eq('user_id', userId)
        .eq('item_type', itemType)
        .eq('item_id', itemId);

      if (error) throw error;

      toast({
        title: "Justification saved!",
        description: "Your thoughts have been shared with the community",
      });

      fetchJustifications();
    } catch (error) {
      console.error('Error saving justification:', error);
      toast({
        title: "Error",
        description: "Failed to save justification",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {userId && (
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Share Your Thoughts</h4>
          <div className="space-y-3">
            <Textarea
              placeholder="Why did you rate it this way? Share your justification..."
              value={myJustification}
              onChange={(e) => setMyJustification(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleSaveJustification} 
              disabled={isSaving || !myJustification.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isSaving ? "Saving..." : "Share Justification"}
            </Button>
          </div>
        </Card>
      )}

      <div>
        <h4 className="font-semibold mb-3">Community Vibes</h4>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {justifications.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No justifications yet. Be the first to share your thoughts!
              </Card>
            ) : (
              justifications.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.userProfile?.avatarUrl} />
                      <AvatarFallback>
                        {item.userProfile?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {item.userProfile?.username || 'Anonymous'}
                        </span>
                        <Badge 
                          className={cn(
                            "text-white",
                            ratingColors[item.rating as keyof typeof ratingColors]
                          )}
                        >
                          {ratingLabels[item.rating as keyof typeof ratingLabels]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{item.justification}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CommunityJustifications;