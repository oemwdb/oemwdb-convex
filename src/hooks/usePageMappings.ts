import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface PageSectionField {
  id: string;
  field: string;
  value: string; // database column
  label: string;
  order: number;
  visible: boolean;
}

export interface PageSection {
  id: string;
  name: string; // Renameable section name
  enabled: boolean;
  fields: PageSectionField[];
}

export interface PageMappings {
  sections: PageSection[];
}

export function usePageMappings(pageType: 'vehicle' | 'wheel' | 'brand') {
  const [mappings, setMappings] = useState<PageMappings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load mappings from database
  useEffect(() => {
    loadMappings();
  }, [pageType]);

  const loadMappings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      // Try to load user-specific mappings first
      let query = supabase
        .from('page_mappings')
        .select('*')
        .eq('page_type', pageType);
      
      if (user) {
        // Try user-specific mappings first
        const { data: userMappings } = await query.eq('user_id', user.id).single();
      if (userMappings) {
        setMappings(userMappings.mappings as unknown as PageMappings);
        return;
        }
      }
      
      // Fall back to global mappings
      const { data: globalMappings } = await supabase
        .from('page_mappings')
        .select('*')
        .eq('page_type', pageType)
        .is('user_id', null)
        .single();
      
      if (globalMappings) {
        setMappings(globalMappings.mappings as unknown as PageMappings);
      } else {
        // Initialize with default structure
        setMappings(getDefaultMappings(pageType));
      }
    } catch (error) {
      console.error('Error loading page mappings:', error);
      setMappings(getDefaultMappings(pageType));
    } finally {
      setLoading(false);
    }
  };

  const saveMappings = async (newMappings: PageMappings) => {
    try {
      setSaving(true);
      setMappings(newMappings);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const payload = {
        page_type: pageType,
        mappings: newMappings as any, // Cast to any for JSON type compatibility
        user_id: user?.id || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('page_mappings')
        .upsert(payload, {
          onConflict: user ? 'page_type,user_id' : 'page_type',
        });

      if (error) throw error;

      toast({
        title: "Mappings saved",
        description: "Your page configuration has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving page mappings:', error);
      toast({
        title: "Error saving mappings",
        description: "Failed to save your configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Get default mappings for each page type
  const getDefaultMappings = (type: string): PageMappings => {
    switch (type) {
      case 'vehicle':
        return {
          sections: [
            {
              id: 'header',
              name: 'Hero Section',
              enabled: true,
              fields: [
                { id: 'heroImageUrl', field: 'hero_image_url', value: 'hero_image_url', label: 'Hero Image', order: 0, visible: true },
                { id: 'name', field: 'model_name', value: 'model_name', label: 'Model Name', order: 1, visible: true },
                { id: 'generation', field: 'generation', value: 'generation', label: 'Generation', order: 2, visible: true },
                { id: 'years', field: 'production_years', value: 'production_years', label: 'Years', order: 3, visible: true },
                { id: 'segment', field: 'segment', value: 'segment', label: 'Segment', order: 4, visible: true },
                { id: 'drive', field: 'drive', value: 'drive', label: 'Drive', order: 5, visible: true },
                { id: 'engines', field: 'engines', value: 'engines', label: 'Engines', order: 6, visible: true },
                { id: 'msrp', field: 'msrp', value: 'msrp', label: 'MSRP', order: 7, visible: true },
                { id: 'description', field: 'description', value: 'description', label: 'Description', order: 8, visible: true },
              ]
            },
            {
              id: 'brief',
              name: 'Technical Information',
              enabled: true,
              fields: [
                { id: 'chassisCode', field: 'chassis_code', value: 'chassis_code', label: 'Chassis Code', order: 0, visible: true },
                { id: 'platform', field: 'platform', value: 'platform', label: 'Platform', order: 1, visible: true },
                { id: 'production', field: 'production_stats', value: 'production_stats', label: 'Production', order: 2, visible: true },
                { id: 'boltPattern', field: 'bolt_pattern', value: 'bolt_pattern', label: 'Bolt Pattern', order: 3, visible: true },
                { id: 'centerBore', field: 'center_bore', value: 'center_bore', label: 'Center Bore', order: 4, visible: true },
                { id: 'weight', field: 'weight', value: 'weight', label: 'Weight', order: 5, visible: true },
                { id: 'notes', field: 'notes', value: 'notes', label: 'Notes', order: 6, visible: true },
                { id: 'engineType', field: 'engine_type', value: 'engine_type', label: 'Engine Type', order: 7, visible: true },
                { id: 'transmission', field: 'transmission', value: 'transmission', label: 'Transmission', order: 8, visible: true },
                { id: 'drivetrain', field: 'drivetrain', value: 'drivetrain', label: 'Drivetrain', order: 9, visible: true },
              ]
            },
            {
              id: 'wheels',
              name: 'Compatible Wheels',
              enabled: true,
              fields: [
                { id: 'wheelsDescription', field: 'wheels_description', value: 'wheels_description', label: 'Description', order: 0, visible: true },
              ]
            },
            {
              id: 'gallery',
              name: 'Photo Gallery',
              enabled: true,
              fields: [
                { id: 'galleryDescription', field: 'gallery_description', value: 'gallery_description', label: 'Description', order: 0, visible: true },
                { id: 'uploadButtonText', field: 'upload_button_text', value: 'upload_button_text', label: 'Upload Button', order: 1, visible: true },
                { id: 'uploadDescription', field: 'upload_description', value: 'upload_description', label: 'Upload Description', order: 2, visible: true },
              ]
            },
            {
              id: 'comments',
              name: 'User Reviews',
              enabled: true,
              fields: [
                { id: 'commentsDescription', field: 'comments_description', value: 'comments_description', label: 'Description', order: 0, visible: true },
                { id: 'commentPlaceholder', field: 'comment_placeholder', value: 'comment_placeholder', label: 'Placeholder', order: 1, visible: true },
                { id: 'postButtonText', field: 'post_button_text', value: 'post_button_text', label: 'Post Button', order: 2, visible: true },
              ]
            }
          ]
        };
        
      case 'wheel':
        return {
          sections: [
            {
              id: 'header',
              name: 'Product Overview',
              enabled: true,
              fields: [
                { id: 'imageUrl', field: 'good_pic_url', value: 'good_pic_url', label: 'Image', order: 0, visible: true },
                { id: 'wheelName', field: 'wheel_name', value: 'wheel_name', label: 'Wheel Name', order: 1, visible: true },
                { id: 'brandName', field: 'brand_name', value: 'brand_name', label: 'Brand', order: 2, visible: true },
                { id: 'modelCode', field: 'wheel_code', value: 'wheel_code', label: 'Model Code', order: 3, visible: true },
                { id: 'color', field: 'color', value: 'color', label: 'Color', order: 4, visible: true },
                { id: 'material', field: 'metal_type', value: 'metal_type', label: 'Material', order: 5, visible: true },
                { id: 'diameter', field: 'diameter', value: 'diameter', label: 'Diameter', order: 6, visible: true },
                { id: 'width', field: 'width', value: 'width', label: 'Width', order: 7, visible: true },
                { id: 'boltPattern', field: 'bolt_pattern', value: 'bolt_pattern', label: 'Bolt Pattern', order: 8, visible: true },
                { id: 'offset', field: 'wheel_offset', value: 'wheel_offset', label: 'Offset', order: 9, visible: true },
                { id: 'price', field: 'price', value: 'price', label: 'Price', order: 10, visible: true },
              ]
            },
            {
              id: 'fitment',
              name: 'Vehicle Compatibility',
              enabled: true,
              fields: [
                { id: 'fitmentDescription', field: 'fitment_description', value: 'fitment_description', label: 'Description', order: 0, visible: true },
              ]
            },
            {
              id: 'gallery',
              name: 'Product Gallery',
              enabled: true,
              fields: [
                { id: 'galleryDescription', field: 'gallery_description', value: 'gallery_description', label: 'Description', order: 0, visible: true },
                { id: 'uploadButtonText', field: 'upload_button_text', value: 'upload_button_text', label: 'Upload Button', order: 1, visible: true },
              ]
            },
            {
              id: 'comments',
              name: 'Customer Reviews',
              enabled: true,
              fields: [
                { id: 'commentsDescription', field: 'comments_description', value: 'comments_description', label: 'Description', order: 0, visible: true },
                { id: 'commentPlaceholder', field: 'comment_placeholder', value: 'comment_placeholder', label: 'Placeholder', order: 1, visible: true },
              ]
            }
          ]
        };
        
      case 'brand':
        return {
      sections: [
        {
          id: 'header',
          name: 'Brand Identity',
          enabled: true,
          fields: [
                { id: 'logoUrl', field: 'brand_image_url', value: 'brand_image_url', label: 'Logo', order: 0, visible: true },
                { id: 'name', field: 'name', value: 'name', label: 'Brand Name', order: 1, visible: true },
                { id: 'tagline', field: 'tagline', value: 'tagline', label: 'Tagline', order: 2, visible: true },
                { id: 'description', field: 'brand_description', value: 'brand_description', label: 'Description', order: 3, visible: true },
                { id: 'foundedYear', field: 'founded_year', value: 'founded_year', label: 'Founded', order: 4, visible: true },
                { id: 'country', field: 'country', value: 'country', label: 'Country', order: 5, visible: true },
                { id: 'headquarters', field: 'headquarters', value: 'headquarters', label: 'Headquarters', order: 6, visible: true },
                { id: 'vehicleCount', field: 'vehicle_count', value: 'vehicle_count', label: 'Vehicle Count', order: 7, visible: true },
                { id: 'wheelCount', field: 'wheel_count', value: 'wheel_count', label: 'Wheel Count', order: 8, visible: true },
                { id: 'marketSegment', field: 'market_segment', value: 'market_segment', label: 'Market Segment', order: 9, visible: true },
                { id: 'website', field: 'brand_page', value: 'brand_page', label: 'Website', order: 10, visible: true },
              ]
            },
            {
              id: 'vehicles',
              name: 'Vehicle Collection',
              enabled: true,
              fields: []
            },
            {
              id: 'wheels',
              name: 'Wheel Catalog',
              enabled: true,
              fields: []
            }
          ]
        };
        
      default:
        return { sections: [] };
    }
  };

  return {
    mappings,
    loading,
    saving,
    saveMappings,
    reloadMappings: loadMappings,
  };
}