import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, "-");
}

export const useContributeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const convex = useConvex();
  const wheelVehicleLink = useMutation(api.mutations.wheelVehicleLink);

  const [brandData, setBrandData] = useState({
    brandPage: "",
    brandDescription: "",
    oemChasisCodes: "",
    oemModelLines: "",
    oemWheels: "",
    imagelink: "",
  });

  const [vehicleData, setVehicleData] = useState({
    brandName: "",
    modelName: "",
    oemChasisCode: "",
    generationTag: "",
    productionYearsRange: "",
    heroImage: "",
    oemWheels: "",
    status: "active",
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
    status: "active",
  });

  const handleSubmitBrand = async () => {
    setIsSubmitting(true);
    try {
      const id = slugify(brandData.brandPage);
      await convex.mutation(api.mutations.brandsInsert, {
        id,
        brand_title: brandData.brandPage,
        brand_description: brandData.brandDescription || undefined,
        brand_page: brandData.brandPage || undefined,
        brand_image_url: brandData.imagelink || undefined,
      });
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
        imagelink: "",
      });
    } catch (error: unknown) {
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
      const brandSlug = slugify(vehicleData.brandName);
      const brand = await convex.query(api.queries.brandsGetById, {
        id: brandSlug,
      });
      if (!brand) {
        toast({
          title: "Error",
          description: "Brand not found. Add the brand first.",
          variant: "destructive",
        });
        return;
      }
      const vehicleId = slugify(
        `${vehicleData.brandName}-${vehicleData.oemChasisCode}`
      );
      await convex.mutation(api.mutations.vehiclesInsert, {
        id: vehicleId,
        model_name: vehicleData.modelName || undefined,
        vehicle_title: vehicleData.modelName || undefined,
        generation: vehicleData.oemChasisCode || undefined,
        production_years: vehicleData.productionYearsRange || undefined,
        bad_pic_url: vehicleData.heroImage || undefined,
      });
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
        status: "active",
      });
    } catch (error: unknown) {
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
      const brandSlug = slugify(wheelData.brandRel);
      const brand = await convex.query(api.queries.brandsGetById, {
        id: brandSlug,
      });
      if (!brand) {
        toast({
          title: "Error",
          description: "Brand not found. Add the brand first.",
          variant: "destructive",
        });
        return;
      }
      const wheelId = slugify(wheelData.wheelName) || "wheel-" + Date.now();
      const wheelIdRes = await convex.mutation(api.mutations.wheelsInsert, {
        id: wheelId,
        wheel_title: wheelData.wheelName,
        part_numbers: wheelData.oemPartNumbersTxt || undefined,
        notes: wheelData.userSubmissionInput || undefined,
        good_pic_url: wheelData.goodPic || undefined,
      });

      if (wheelData.vehicleRel) {
        const vehicle = await convex.query(api.queries.vehiclesGetById, {
          id: wheelData.vehicleRel.trim(),
        });
        if (vehicle) {
          await wheelVehicleLink({
            wheel_id: wheelIdRes,
            vehicle_id: vehicle._id,
          });
        }
      }

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
        status: "active",
      });
    } catch (error: unknown) {
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
    handleSubmitWheel,
  };
};
