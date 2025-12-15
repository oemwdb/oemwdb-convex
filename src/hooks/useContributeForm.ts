import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useContributeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form states for different item types
  const [brandData, setBrandData] = useState({
    brandPage: "",
    brandDescription: "",
    oemChasisCodes: "",
    oemModelLines: "",
    oemWheels: "",
    imagelink: ""
  });

  const [vehicleData, setVehicleData] = useState({
    brandName: "",
    modelName: "",
    oemChasisCode: "",
    generationTag: "",
    productionYearsRange: "",
    heroImage: "",
    oemWheels: "",
    status: "active"
  });

  const [wheelData, setWheelData] = useState({
    wheelName: "",
    diameter: "",
    diameterTag: "",
    brandRel: "",
    boltPatternTxt: "",
    boltPatternTag: "",
    centerBoreTxt: "",
    centerBoreTag: "",
    widthTag: "",
    colorNamesTxt: "",
    colorGroups: "",
    designStyleTag: "",
    offsetTxt: "",
    oemPartNumbersTxt: "",
    hollanderInterchangePartNumbers: "",
    oemBoltPatterns: "",
    oemColorRel: "",
    vehicleRel: "",
    vehicleRelTxt: "",
    wheelSourceLink: "",
    goodPic: "",
    badPic: "",
    sources: "",
    userSubmissionInput: "",
    status: "active"
  });

  const handleSubmitBrand = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('oem_brands')
        .insert([{
          id: brandData.brandPage.toLowerCase().replace(/\s+/g, '-'),
          brand_title: brandData.brandPage,
          brand_description: brandData.brandDescription,
          brand_page: brandData.brandPage,
          brand_image_url: brandData.imagelink
        }] as any);

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Brand added successfully to the database.",
      });
      
      setBrandData({
        brandPage: "",
        brandDescription: "",
        oemChasisCodes: "",
        oemModelLines: "",
        oemWheels: "",
        imagelink: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add brand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitVehicle = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('oem_vehicles')
        .insert([{
          id: `${vehicleData.brandName}-${vehicleData.oemChasisCode}`.toLowerCase().replace(/\s+/g, '-'),
          brand_ref: vehicleData.brandName ? [vehicleData.brandName] : [],
          model_name: vehicleData.modelName,
          vehicle_id_only: vehicleData.oemChasisCode,
          production_years: vehicleData.productionYearsRange,
          hero_image_url: vehicleData.heroImage
        }] as any);

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Vehicle added successfully to the database.",
      });
      
      setVehicleData({
        brandName: "",
        modelName: "",
        oemChasisCode: "",
        generationTag: "",
        productionYearsRange: "",
        heroImage: "",
        oemWheels: "",
        status: "active"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitWheel = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('oem_wheels')
        .insert({
          id: wheelData.wheelName, // id is the wheel name in the oem_wheels table
          wheel_title: wheelData.wheelName,
          color: wheelData.colorNamesTxt,
          wheel_offset: wheelData.offsetTxt,
          part_numbers: wheelData.oemPartNumbersTxt,
          good_pic_url: wheelData.goodPic,
          notes: wheelData.userSubmissionInput,
          // For now, set refs as empty arrays - would need proper ref handling
          diameter_ref: [],
          width_ref: [],
          bolt_pattern_ref: [],
          center_bore_ref: [],
          brand_ref: wheelData.brandRel ? [wheelData.brandRel] : [],
          color_ref: [],
          vehicle_ref: [],
          design_style_ref: wheelData.designStyleTag ? [wheelData.designStyleTag] : [],
        });

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Wheel added successfully to the database.",
      });
      
      setWheelData({
        wheelName: "",
        diameter: "",
        diameterTag: "",
        brandRel: "",
        boltPatternTxt: "",
        boltPatternTag: "",
        centerBoreTxt: "",
        centerBoreTag: "",
        widthTag: "",
        colorNamesTxt: "",
        colorGroups: "",
        designStyleTag: "",
        offsetTxt: "",
        oemPartNumbersTxt: "",
        hollanderInterchangePartNumbers: "",
        oemBoltPatterns: "",
        oemColorRel: "",
        vehicleRel: "",
        vehicleRelTxt: "",
        wheelSourceLink: "",
        goodPic: "",
        badPic: "",
        sources: "",
        userSubmissionInput: "",
        status: "active"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add wheel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    brandData,
    setBrandData,
    vehicleData,
    setVehicleData,
    wheelData,
    setWheelData,
    handleSubmitBrand,
    handleSubmitVehicle,
    handleSubmitWheel
  };
};