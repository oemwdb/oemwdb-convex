import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SaveButtonProps {
  itemId: number | string;  // Allow both number and string
  itemType: 'wheel' | 'vehicle' | 'brand';
  className?: string;
}

export const SaveButton = ({ itemId, itemType, className }: SaveButtonProps) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkIfSaved();
    }
  }, [user, itemId, itemType]);

  const checkIfSaved = async () => {
    if (!user) return;
    
    try {
      let data;
      
      switch (itemType) {
        case 'wheel':
          const { data: wheelData } = await supabase
            .from('saved_wheels')
            .select('id')
            .eq('user_id', user.id)
            .eq('wheel_id', String(itemId))  // Convert to string for wheels
            .single();
          data = wheelData;
          break;
        case 'vehicle':
          const { data: vehicleData } = await supabase
            .from('saved_vehicles')
            .select('id')
            .eq('user_id', user.id)
            .eq('vehicle_id', String(itemId))  // Convert to string for vehicles
            .single();
          data = vehicleData;
          break;
        case 'brand':
          const { data: brandData } = await supabase
            .from('saved_brands')
            .select('id')
            .eq('user_id', user.id)
            .eq('brand_id', String(itemId))  // Convert to string for brands
            .single();
          data = brandData;
          break;
      }
      
      setIsSaved(!!data);
    } catch (error) {
      // No saved item found
      setIsSaved(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        // Remove from saved items
        switch (itemType) {
          case 'wheel':
            await supabase
              .from('saved_wheels')
              .delete()
              .eq('user_id', user.id)
              .eq('wheel_id', String(itemId));  // Convert to string
            break;
          case 'vehicle':
            await supabase
              .from('saved_vehicles')
              .delete()
              .eq('user_id', user.id)
              .eq('vehicle_id', String(itemId));  // Convert to string
            break;
          case 'brand':
            await supabase
              .from('saved_brands')
              .delete()
              .eq('user_id', user.id)
              .eq('brand_id', String(itemId));  // Convert to string
            break;
        }
        
        setIsSaved(false);
        toast.success(`Removed from saved ${itemType}s`);
      } else {
        // Add to saved items
        switch (itemType) {
          case 'wheel':
            await supabase
              .from('saved_wheels')
              .insert({
                user_id: user.id,
                wheel_id: String(itemId)  // Convert to string
              });
            break;
          case 'vehicle':
            await supabase
              .from('saved_vehicles')
              .insert({
                user_id: user.id,
                vehicle_id: String(itemId)  // Convert to string
              });
            break;
          case 'brand':
            await supabase
              .from('saved_brands')
              .insert({
                user_id: user.id,
                brand_id: String(itemId)  // Convert to string
              });
            break;
        }
        
        setIsSaved(true);
        toast.success(`Added to saved ${itemType}s`);
      }
    } catch (error: any) {
      toast.error(`Failed to ${isSaved ? 'remove' : 'save'} ${itemType}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSave}
      disabled={isLoading}
      className={className}
    >
      {isSaved ? (
        <BookmarkCheck className="h-5 w-5" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </Button>
  );
};