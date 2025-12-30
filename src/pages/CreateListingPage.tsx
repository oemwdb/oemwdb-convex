import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("wheels");
  const [loading, setLoading] = useState(false);

  const [wheelsFormData, setWheelsFormData] = useState({
    title: "",
    description: "",
    diameter: "",
    width: "",
    boltPattern: "",
    offset: "",
    quantity: "4",
    price: "",
    condition: "good",
    location: "",
    shippingAvailable: false,
    images: [] as string[],
    documents: [] as string[]
  });

  const [tiresFormData, setTiresFormData] = useState({
    title: "",
    description: "",
    brand: "",
    size: "",
    treadDepth: "",
    quantity: "4",
    price: "",
    condition: "good",
    location: "",
    shippingAvailable: false,
    images: [] as string[],
    documents: [] as string[]
  });

  const [vehiclesFormData, setVehiclesFormData] = useState({
    title: "",
    description: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    vin: "",
    price: "",
    condition: "good",
    location: "",
    shippingAvailable: false,
    images: [] as string[],
    documents: [] as string[]
  });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a listing",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }

      let currentFormData;
      let listingType;
      let specifications;

      if (activeTab === "wheels") {
        currentFormData = wheelsFormData;
        listingType = "wheel";
        specifications = {
          diameter: wheelsFormData.diameter,
          width: wheelsFormData.width,
          boltPattern: wheelsFormData.boltPattern,
          offset: wheelsFormData.offset,
          quantity: wheelsFormData.quantity
        };
      } else if (activeTab === "tires") {
        currentFormData = tiresFormData;
        listingType = "tire";
        specifications = {
          brand: tiresFormData.brand,
          size: tiresFormData.size,
          treadDepth: tiresFormData.treadDepth,
          quantity: tiresFormData.quantity
        };
      } else {
        currentFormData = vehiclesFormData;
        listingType = "vehicle";
        specifications = {
          make: vehiclesFormData.make,
          model: vehiclesFormData.model,
          year: vehiclesFormData.year,
          mileage: vehiclesFormData.mileage,
          vin: vehiclesFormData.vin
        };
      }

      if (!currentFormData.title || !currentFormData.description) {
        toast({
          title: "Missing required fields",
          description: "Please fill in title and description",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Fetch user profile to include in seller_profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url, verification_status")
        .eq("id", user.id)
        .single();

      const descriptionWithSpecs = `${currentFormData.description}\n\n--- Specifications ---\n${JSON.stringify(specifications, null, 2)}`;

      const { error } = await supabase.from("market_listings").insert({
        user_id: user.id,
        listing_type: listingType,
        linked_item_id: 0,
        title: currentFormData.title,
        description: descriptionWithSpecs,
        price: parseFloat(currentFormData.price) || null,
        condition: currentFormData.condition,
        location: currentFormData.location,
        shipping_available: currentFormData.shippingAvailable,
        images: currentFormData.images.length > 0 ? currentFormData.images : null,
        documents: currentFormData.documents.length > 0 ? currentFormData.documents : null,
        status: "active",
        seller_profile: profile ? {
          username: profile.username,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          verification_status: profile.verification_status
        } : null
      });

      if (error) throw error;

      toast({
        title: "Listing created!",
        description: "Your listing is now live on the marketplace"
      });

      navigate("/market");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error creating listing",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    files: File[],
    formSetter: any,
    fieldName: 'images' | 'documents'
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files",
        variant: "destructive"
      });
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('listing-files')
        .upload(fileName, file);

      if (error) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive"
        });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('listing-files')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    if (uploadedUrls.length > 0) {
      formSetter((prev: any) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...uploadedUrls]
      }));

      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} file(s) uploaded`
      });
    }
  };

  const removeFile = (formSetter: any, currentFiles: string[], index: number, fieldName: 'images' | 'documents') => {
    formSetter((prev: any) => ({
      ...prev,
      [fieldName]: currentFiles.filter((_, i) => i !== index)
    }));
  };

  return (
    <DashboardLayout title="Create Listing" disableContentPadding={true}>
      <div className="h-full p-2 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wheels">Wheels</TabsTrigger>
              <TabsTrigger value="tires">Tires</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            </TabsList>

            {/* Wheels Tab */}
            <TabsContent value="wheels">
              <Card>
                <CardHeader>
                  <CardTitle>List Wheels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="wheels-title">Title *</Label>
                      <Input
                        id="wheels-title"
                        value={wheelsFormData.title}
                        onChange={(e) => setWheelsFormData({ ...wheelsFormData, title: e.target.value })}
                        placeholder="e.g., BBS CH-R 19&quot; Staggered Set"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wheels-description">Description *</Label>
                      <Textarea
                        id="wheels-description"
                        value={wheelsFormData.description}
                        onChange={(e) => setWheelsFormData({ ...wheelsFormData, description: e.target.value })}
                        placeholder="Describe condition, history, and any included accessories..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="wheels-diameter">Diameter</Label>
                        <Input
                          id="wheels-diameter"
                          value={wheelsFormData.diameter}
                          onChange={(e) => setWheelsFormData({ ...wheelsFormData, diameter: e.target.value })}
                          placeholder='e.g., 19"'
                        />
                      </div>
                      <div>
                        <Label htmlFor="wheels-width">Width</Label>
                        <Input
                          id="wheels-width"
                          value={wheelsFormData.width}
                          onChange={(e) => setWheelsFormData({ ...wheelsFormData, width: e.target.value })}
                          placeholder='e.g., 8.5"'
                        />
                      </div>
                      <div>
                        <Label htmlFor="wheels-bolt">Bolt Pattern</Label>
                        <Input
                          id="wheels-bolt"
                          value={wheelsFormData.boltPattern}
                          onChange={(e) => setWheelsFormData({ ...wheelsFormData, boltPattern: e.target.value })}
                          placeholder="e.g., 5x114.3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wheels-offset">Offset</Label>
                        <Input
                          id="wheels-offset"
                          value={wheelsFormData.offset}
                          onChange={(e) => setWheelsFormData({ ...wheelsFormData, offset: e.target.value })}
                          placeholder="e.g., +35"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wheels-quantity">Quantity</Label>
                        <Select value={wheelsFormData.quantity} onValueChange={(val) => setWheelsFormData({ ...wheelsFormData, quantity: val })}>
                          <SelectTrigger id="wheels-quantity">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Wheel</SelectItem>
                            <SelectItem value="2">2 Wheels</SelectItem>
                            <SelectItem value="3">3 Wheels</SelectItem>
                            <SelectItem value="4">4 Wheels</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Pricing & Condition</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="wheels-price">Price ($) *</Label>
                        <Input
                          id="wheels-price"
                          type="number"
                          value={wheelsFormData.price}
                          onChange={(e) => setWheelsFormData({ ...wheelsFormData, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wheels-condition">Condition *</Label>
                        <Select value={wheelsFormData.condition} onValueChange={(val) => setWheelsFormData({ ...wheelsFormData, condition: val })}>
                          <SelectTrigger id="wheels-condition">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Location & Shipping</h3>
                    <div>
                      <Label htmlFor="wheels-location">Location *</Label>
                      <Input
                        id="wheels-location"
                        value={wheelsFormData.location}
                        onChange={(e) => setWheelsFormData({ ...wheelsFormData, location: e.target.value })}
                        placeholder="e.g., Los Angeles, CA"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wheels-shipping"
                        checked={wheelsFormData.shippingAvailable}
                        onCheckedChange={(checked) => setWheelsFormData({ ...wheelsFormData, shippingAvailable: checked as boolean })}
                      />
                      <Label htmlFor="wheels-shipping">Willing to ship</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Photos</h3>
                    <FileUpload
                      accept="image/*"
                      maxSize={10}
                      maxFiles={10}
                      label="Upload wheel photos"
                      onUpload={(files) => handleFileUpload(files, setWheelsFormData, 'images')}
                      uploadedFiles={wheelsFormData.images}
                      onRemove={(index) => removeFile(setWheelsFormData, wheelsFormData.images, index, 'images')}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Documentation (Optional)</h3>
                    <FileUpload
                      accept=".pdf,.doc,.docx,image/*"
                      maxSize={10}
                      maxFiles={5}
                      label="Upload documentation (receipts, specs, etc.)"
                      onUpload={(files) => handleFileUpload(files, setWheelsFormData, 'documents')}
                      uploadedFiles={wheelsFormData.documents}
                      onRemove={(index) => removeFile(setWheelsFormData, wheelsFormData.documents, index, 'documents')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tires Tab */}
            <TabsContent value="tires">
              <Card>
                <CardHeader>
                  <CardTitle>List Tires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tires-title">Title *</Label>
                      <Input
                        id="tires-title"
                        value={tiresFormData.title}
                        onChange={(e) => setTiresFormData({ ...tiresFormData, title: e.target.value })}
                        placeholder="e.g., Michelin Pilot Sport 4S Set"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tires-description">Description *</Label>
                      <Textarea
                        id="tires-description"
                        value={tiresFormData.description}
                        onChange={(e) => setTiresFormData({ ...tiresFormData, description: e.target.value })}
                        placeholder="Describe condition, mileage, and any wear details..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tires-brand">Brand</Label>
                        <Input
                          id="tires-brand"
                          value={tiresFormData.brand}
                          onChange={(e) => setTiresFormData({ ...tiresFormData, brand: e.target.value })}
                          placeholder="e.g., Michelin"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tires-size">Size</Label>
                        <Input
                          id="tires-size"
                          value={tiresFormData.size}
                          onChange={(e) => setTiresFormData({ ...tiresFormData, size: e.target.value })}
                          placeholder="e.g., 245/40R18"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tires-tread">Tread Depth</Label>
                        <Input
                          id="tires-tread"
                          value={tiresFormData.treadDepth}
                          onChange={(e) => setTiresFormData({ ...tiresFormData, treadDepth: e.target.value })}
                          placeholder="e.g., 8/32"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tires-quantity">Quantity</Label>
                        <Select value={tiresFormData.quantity} onValueChange={(val) => setTiresFormData({ ...tiresFormData, quantity: val })}>
                          <SelectTrigger id="tires-quantity">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Tire</SelectItem>
                            <SelectItem value="2">2 Tires</SelectItem>
                            <SelectItem value="3">3 Tires</SelectItem>
                            <SelectItem value="4">4 Tires</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Pricing & Condition</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tires-price">Price ($) *</Label>
                        <Input
                          id="tires-price"
                          type="number"
                          value={tiresFormData.price}
                          onChange={(e) => setTiresFormData({ ...tiresFormData, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tires-condition">Condition *</Label>
                        <Select value={tiresFormData.condition} onValueChange={(val) => setTiresFormData({ ...tiresFormData, condition: val })}>
                          <SelectTrigger id="tires-condition">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Location & Shipping</h3>
                    <div>
                      <Label htmlFor="tires-location">Location *</Label>
                      <Input
                        id="tires-location"
                        value={tiresFormData.location}
                        onChange={(e) => setTiresFormData({ ...tiresFormData, location: e.target.value })}
                        placeholder="e.g., Los Angeles, CA"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tires-shipping"
                        checked={tiresFormData.shippingAvailable}
                        onCheckedChange={(checked) => setTiresFormData({ ...tiresFormData, shippingAvailable: checked as boolean })}
                      />
                      <Label htmlFor="tires-shipping">Willing to ship</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Photos</h3>
                    <FileUpload
                      accept="image/*"
                      maxSize={10}
                      maxFiles={10}
                      label="Upload tire photos"
                      onUpload={(files) => handleFileUpload(files, setTiresFormData, 'images')}
                      uploadedFiles={tiresFormData.images}
                      onRemove={(index) => removeFile(setTiresFormData, tiresFormData.images, index, 'images')}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Documentation (Optional)</h3>
                    <FileUpload
                      accept=".pdf,.doc,.docx,image/*"
                      maxSize={10}
                      maxFiles={5}
                      label="Upload documentation (receipts, specs, etc.)"
                      onUpload={(files) => handleFileUpload(files, setTiresFormData, 'documents')}
                      uploadedFiles={tiresFormData.documents}
                      onRemove={(index) => removeFile(setTiresFormData, tiresFormData.documents, index, 'documents')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles">
              <Card>
                <CardHeader>
                  <CardTitle>List Vehicle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vehicles-title">Title *</Label>
                      <Input
                        id="vehicles-title"
                        value={vehiclesFormData.title}
                        onChange={(e) => setVehiclesFormData({ ...vehiclesFormData, title: e.target.value })}
                        placeholder="e.g., 1994 Toyota Supra Twin Turbo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicles-description">Description *</Label>
                      <Textarea
                        id="vehicles-description"
                        value={vehiclesFormData.description}
                        onChange={(e) => setVehiclesFormData({ ...vehiclesFormData, description: e.target.value })}
                        placeholder="Describe the vehicle's history, modifications, and condition..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehicles-make">Make</Label>
                        <Input
                          id="vehicles-make"
                          value={vehiclesFormData.make}
                          onChange={(e) => setVehiclesFormData({ ...vehiclesFormData, make: e.target.value })}
                          placeholder="e.g., Toyota"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicles-model">Model</Label>
                        <Input
                          id="vehicles-model"
                          value={vehiclesFormData.model}
                          onChange={(e) => setVehiclesFormData({ ...vehiclesFormData, model: e.target.value })}
                          placeholder="e.g., Supra"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicles-year">Year</Label>
                        <Input
                          id="vehicles-year"
                          value={vehiclesFormData.year}
                          onChange={(e) => setVehiclesFormData({ ...vehiclesFormData, year: e.target.value })}
                          placeholder="e.g., 1994"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicles-mileage">Mileage</Label>
                        <Input
                          id="vehicles-mileage"
                          type="number"
                          value={vehiclesFormData.mileage}
                          onChange={(e) => setVehiclesFormData({ ...vehiclesFormData, mileage: e.target.value })}
                          placeholder="e.g., 75000"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="vehicles-vin">VIN (Optional)</Label>
                        <Input
                          id="vehicles-vin"
                          value={vehiclesFormData.vin}
                          onChange={(e) => setVehiclesFormData({ ...vehiclesFormData, vin: e.target.value })}
                          placeholder="17-digit VIN"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Pricing & Condition</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehicles-price">Price ($) *</Label>
                        <Input
                          id="vehicles-price"
                          type="number"
                          value={vehiclesFormData.price}
                          onChange={(e) => setVehiclesFormData({ ...vehiclesFormData, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicles-condition">Condition *</Label>
                        <Select value={vehiclesFormData.condition} onValueChange={(val) => setVehiclesFormData({ ...vehiclesFormData, condition: val })}>
                          <SelectTrigger id="vehicles-condition">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Location & Shipping</h3>
                    <div>
                      <Label htmlFor="vehicles-location">Location *</Label>
                      <Input
                        id="vehicles-location"
                        value={vehiclesFormData.location}
                        onChange={(e) => setVehiclesFormData({ ...vehiclesFormData, location: e.target.value })}
                        placeholder="e.g., Los Angeles, CA"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vehicles-shipping"
                        checked={vehiclesFormData.shippingAvailable}
                        onCheckedChange={(checked) => setVehiclesFormData({ ...vehiclesFormData, shippingAvailable: checked as boolean })}
                      />
                      <Label htmlFor="vehicles-shipping">Willing to arrange shipping</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Photos</h3>
                    <FileUpload
                      accept="image/*"
                      maxSize={10}
                      maxFiles={10}
                      label="Upload vehicle photos"
                      onUpload={(files) => handleFileUpload(files, setVehiclesFormData, 'images')}
                      uploadedFiles={vehiclesFormData.images}
                      onRemove={(index) => removeFile(setVehiclesFormData, vehiclesFormData.images, index, 'images')}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Documentation (Optional)</h3>
                    <FileUpload
                      accept=".pdf,.doc,.docx,image/*"
                      maxSize={10}
                      maxFiles={5}
                      label="Upload documentation (title, service records, etc.)"
                      onUpload={(files) => handleFileUpload(files, setVehiclesFormData, 'documents')}
                      uploadedFiles={vehiclesFormData.documents}
                      onRemove={(index) => removeFile(setVehiclesFormData, vehiclesFormData.documents, index, 'documents')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
