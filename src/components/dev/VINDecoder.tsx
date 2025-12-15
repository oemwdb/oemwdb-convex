import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Scan,
  CheckCircle2,
  XCircle,
  Info,
  Car,
  MapPin,
  Calendar,
  Hash,
  Factory,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { decodeVIN, decodeVINEnhanced, generateYAMLStructure, VINDecodedData } from '@/utils/vinDecoder';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const VINDecoder = () => {
  const [vinInput, setVinInput] = useState('');
  const [decodedData, setDecodedData] = useState<VINDecodedData | null>(null);
  const [yamlStructure, setYamlStructure] = useState('');
  const [copiedYAML, setCopiedYAML] = useState(false);
  const [useNHTSA, setUseNHTSA] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Sample VINs for testing
  const sampleVINs = [
    { vin: '1HGBH41JXMN109186', desc: 'Honda Accord' },
    { vin: 'WBADT43452G123456', desc: 'BMW 3 Series' },
    { vin: '5YJSA1E14HF000001', desc: 'Tesla Model S' },
    { vin: 'WDB2030401A635883', desc: 'Mercedes 2004' },
    { vin: '4T1BF1FK5CU123456', desc: 'Toyota Camry' },
    { vin: '1FTFW1ET5BFA12345', desc: 'Ford F-150' },
  ];

  useEffect(() => {
    const decodeVINAsync = async () => {
      if (vinInput.length === 17) {
        setIsLoading(true);
        try {
          const decoded = useNHTSA
            ? await decodeVINEnhanced(vinInput, true)
            : decodeVIN(vinInput);
          setDecodedData(decoded);
          if (decoded.isValid) {
            setYamlStructure(generateYAMLStructure(decoded));
          }
        } catch (error) {
          console.error('Error decoding VIN:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setDecodedData(null);
        setYamlStructure('');
      }
    };

    decodeVINAsync();
  }, [vinInput, useNHTSA]);

  const handleVINInput = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 17);
    setVinInput(cleaned);
  };

  const handleSampleVIN = (vin: string) => {
    setVinInput(vin);
  };

  const handleCopyYAML = async () => {
    await navigator.clipboard.writeText(yamlStructure);
    setCopiedYAML(true);
    setTimeout(() => setCopiedYAML(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-primary" />
          <CardTitle>VIN Decoder</CardTitle>
        </div>
        <CardDescription>
          Decode Vehicle Identification Numbers (VIN) and generate database structure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <Label htmlFor="vin-input">Enter VIN (17 characters)</Label>
          <Input
            id="vin-input"
            type="text"
            placeholder="e.g., 1HGBH41JXMN109186"
            value={vinInput}
            onChange={(e) => handleVINInput(e.target.value)}
            maxLength={17}
            className={cn(
              'font-mono text-lg tracking-wider',
              vinInput.length === 17 && decodedData?.isValid && 'border-green-500',
              vinInput.length === 17 && !decodedData?.isValid && 'border-red-500'
            )}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {vinInput.length}/17 characters
              {vinInput.length === 17 && decodedData && (
                <span className="ml-2">
                  {decodedData.isValid ? (
                    <Badge variant="default" className="ml-2">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="ml-2">
                      <XCircle className="h-3 w-3 mr-1" />
                      Invalid
                    </Badge>
                  )}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* NHTSA API Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
          <div className="space-y-0.5">
            <Label htmlFor="nhtsa-toggle" className="text-sm font-medium">
              Use NHTSA API (Free)
            </Label>
            <p className="text-xs text-muted-foreground">
              Get 140+ vehicle specs from government database
            </p>
          </div>
          <Switch
            id="nhtsa-toggle"
            checked={useNHTSA}
            onCheckedChange={setUseNHTSA}
          />
        </div>

        {/* Sample VINs */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick Test (Sample VINs):</Label>
          <div className="flex flex-wrap gap-2">
            {sampleVINs.map((sample) => (
              <Button
                key={sample.vin}
                variant="outline"
                size="sm"
                onClick={() => handleSampleVIN(sample.vin)}
                className="font-mono text-xs"
              >
                {sample.desc}
              </Button>
            ))}
          </div>
        </div>

        {/* Errors */}
        {decodedData && decodedData.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {decodedData.errors.map((error, idx) => (
                  <li key={idx} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Notes */}
        {decodedData && decodedData.notes && decodedData.notes.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {decodedData.notes.map((note, idx) => (
                  <li key={idx} className="text-sm">
                    {note}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Decoded Information */}
        {decodedData && vinInput.length === 17 && (
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General Data</TabsTrigger>
              <TabsTrigger value="decoded">Specs</TabsTrigger>
              <TabsTrigger value="nhtsa" disabled={!decodedData.nhtsaData}>
                NHTSA {decodedData.nhtsaData && '✓'}
              </TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="yaml">Database</TabsTrigger>
            </TabsList>

            {/* General Data Tab (like lastvin.com) */}
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-3 font-mono text-sm">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h3 className="font-bold mb-3 text-base">General Data</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">VIN (FIN)</span>
                      <span className="font-semibold">{decodedData.vin}</span>
                    </div>
                    {decodedData.nhtsaData?.ModelYear && (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Model Year</span>
                        <span className="font-semibold">{decodedData.nhtsaData.ModelYear}</span>
                      </div>
                    )}
                    {decodedData.nhtsaData?.Make && (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Make</span>
                        <span className="font-semibold">{decodedData.nhtsaData.Make}</span>
                      </div>
                    )}
                    {decodedData.nhtsaData?.Model && (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-semibold">{decodedData.nhtsaData.Model}</span>
                      </div>
                    )}
                    {decodedData.nhtsaData?.Trim && (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Trim</span>
                        <span className="font-semibold">{decodedData.nhtsaData.Trim}</span>
                      </div>
                    )}
                    {decodedData.nhtsaData?.BodyClass && (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Body Class</span>
                        <span className="font-semibold">{decodedData.nhtsaData.BodyClass}</span>
                      </div>
                    )}
                    {decodedData.nhtsaData?.EngineModel && (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Engine</span>
                        <span className="font-semibold">{decodedData.nhtsaData.EngineModel}</span>
                      </div>
                    )}
                    {decodedData.nhtsaData?.TransmissionStyle && (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Transmission</span>
                        <span className="font-semibold">{decodedData.nhtsaData.TransmissionStyle}</span>
                      </div>
                    )}
                    {decodedData.nhtsaData?.PlantCity && (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Plant Location</span>
                        <span className="font-semibold">{decodedData.nhtsaData.PlantCity}, {decodedData.nhtsaData.PlantCountry}</span>
                      </div>
                    )}
                    {decodedData.serialNumber && (
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Production Number</span>
                        <span className="font-semibold">{decodedData.serialNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Database Mapping */}
                {decodedData.vehicleMapping && (
                  <Alert>
                    <Car className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-semibold not-italic">🎯 Vehicle Auto-Select Mapping</p>
                        <p className="text-sm font-mono">
                          {decodedData.vehicleMapping.year} {decodedData.vehicleMapping.make} {decodedData.vehicleMapping.model}
                          {decodedData.vehicleMapping.trim && ` ${decodedData.vehicleMapping.trim}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 not-italic">
                          This will auto-select the correct vehicle in your parts compatibility system
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs not-italic">
                    <strong>Mercedes Datacard Note:</strong> Detailed option codes require manufacturer-specific APIs.
                    NHTSA provides free government specs. For Mercedes option codes (like LastVIN shows), you'll need Mercedes Datacard API access.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* Decoded Tab */}
            <TabsContent value="decoded" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Manufacturer */}
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <Car className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Manufacturer</p>
                    <p className="text-sm font-semibold">
                      {decodedData.manufacturer || 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">WMI: {decodedData.wmi}</p>
                  </div>
                </div>

                {/* Region */}
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Region</p>
                    <p className="text-sm font-semibold">
                      {decodedData.region || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Model Year */}
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Model Year</p>
                    <p className="text-sm font-semibold">
                      {decodedData.manufacturerSpecific?.detectedYear || decodedData.possibleYears?.join(' or ') || 'Unknown'}
                      {decodedData.manufacturerSpecific?.detectedYear && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                          (Detected from VDS)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ISO Code: {decodedData.yearCode} → {decodedData.possibleYears?.join(' or ')}
                    </p>
                  </div>
                </div>

                {/* Plant Code */}
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <Factory className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Plant Code</p>
                    <p className="text-sm font-semibold font-mono">
                      {decodedData.plantCode}
                    </p>
                  </div>
                </div>

                {/* Serial Number */}
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card md:col-span-2">
                  <Hash className="h-5 w-5 text-cyan-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Serial Number (Last 6 digits)
                    </p>
                    <p className="text-sm font-semibold font-mono">
                      {decodedData.serialNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Manufacturer-Specific Data */}
              {decodedData.manufacturerSpecific && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Manufacturer-Specific Details
                    {decodedData.manufacturerSpecific.marketType && (
                      <Badge variant="outline" className="ml-2">
                        {decodedData.manufacturerSpecific.marketType} Market
                      </Badge>
                    )}
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {decodedData.manufacturerSpecific.modelSeries && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Model Series</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.modelSeries}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.modelName && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Model Name</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.modelName}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.bodyStyle && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Body Style</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.bodyStyle}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.engineType && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Engine Type</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.engineType}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.engineDisplacement && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Engine Displacement</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.engineDisplacement}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.engineCode && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Engine Code</p>
                        <p className="text-sm font-medium font-mono">{decodedData.manufacturerSpecific.engineCode}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.fuelType && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Fuel Type</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.fuelType}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.transmissionType && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Transmission</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.transmissionType}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.transmissionGears && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Transmission Gears</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.transmissionGears}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.driveType && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Drive Type</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.driveType}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.steeringPosition && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Steering Position</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.steeringPosition}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.platformCode && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Platform Code</p>
                        <p className="text-sm font-medium font-mono">{decodedData.manufacturerSpecific.platformCode}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.safetySystem && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Safety System</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.safetySystem}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.restraintSystem && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Restraint System</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.restraintSystem}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.brakeSystem && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Brake System</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.brakeSystem}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.wheelSize && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Wheel Size</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.wheelSize}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.trim && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Trim Level</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.trim}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.productionPlant && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Production Plant</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.productionPlant}</p>
                      </div>
                    )}
                    {decodedData.manufacturerSpecific.assemblyLocation && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Assembly Location</p>
                        <p className="text-sm font-medium">{decodedData.manufacturerSpecific.assemblyLocation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Info Alert */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Enhanced Decoding:</strong> Manufacturer-specific decoding with detailed model, engine, transmission, and plant data for Mercedes-Benz, BMW, VW Group (VW/Audi/Porsche/Škoda/SEAT), Volvo, Fiat/Alfa, Jaguar/Land Rover, Toyota/Lexus, Honda/Acura, Ford/Lincoln, and Opel/Vauxhall.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* NHTSA API Data Tab */}
            <TabsContent value="nhtsa" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center space-y-2">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Loading NHTSA data...</p>
                  </div>
                </div>
              ) : decodedData.nhtsaData ? (
                <>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>NHTSA vPIC API Data:</strong> Free government database with 140+ vehicle specifications. Data updated {new Date().toLocaleDateString()}.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-3 md:grid-cols-2">
                    {/* Key specifications from NHTSA */}
                    {decodedData.nhtsaData.Make && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Make</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.Make}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.Model && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Model</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.Model}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.ModelYear && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Model Year</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.ModelYear}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.Trim && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Trim</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.Trim}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.BodyClass && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Body Class</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.BodyClass}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.Doors && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Doors</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.Doors}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.EngineModel && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Engine Model</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.EngineModel}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.EngineCylinders && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Engine Cylinders</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.EngineCylinders}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.EngineHP && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Engine HP</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.EngineHP}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.FuelType && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Fuel Type</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.FuelType}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.TransmissionStyle && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Transmission Style</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.TransmissionStyle}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.DriveType && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Drive Type</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.DriveType}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.BrakeSystemType && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Brake System</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.BrakeSystemType}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.ABS && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">ABS</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.ABS}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.ESC && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">ESC (Stability Control)</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.ESC}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.TPMS && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">TPMS</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.TPMS}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.AirBagLocations && (
                      <div className="p-3 rounded-lg border bg-card/50 md:col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Airbag Locations</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.AirBagLocations}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.PlantCity && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Plant City</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.PlantCity}</p>
                      </div>
                    )}
                    {decodedData.nhtsaData.PlantCountry && (
                      <div className="p-3 rounded-lg border bg-card/50">
                        <p className="text-xs text-muted-foreground mb-1">Plant Country</p>
                        <p className="text-sm font-medium">{decodedData.nhtsaData.PlantCountry}</p>
                      </div>
                    )}
                  </div>

                  {/* Show count of all fields */}
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      NHTSA API returned {Object.keys(decodedData.nhtsaData).length} data fields. Showing key specifications above. Full data available in browser console.
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Enable "Use NHTSA API" toggle above to get enhanced vehicle data from the government database.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Structure Tab */}
            <TabsContent value="structure" className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg border bg-muted/50 font-mono text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Full VIN:</span>
                    <span className="font-bold">{decodedData.vin}</span>
                  </div>
                  <div className="border-t pt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">WMI (1-3):</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {decodedData.wmi}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">VDS (4-8):</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {decodedData.vds}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Check Digit (9):</span>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        {decodedData.checkDigit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Year Code (10):</span>
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">
                        {decodedData.yearCode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Plant Code (11):</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                        {decodedData.plantCode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Serial (12-17):</span>
                      <span className="text-pink-600 dark:text-pink-400 font-semibold">
                        {decodedData.serialNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs space-y-2">
                    <p>
                      <strong>VIN Structure (ISO 3779/3780):</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>
                        <strong>WMI:</strong> World Manufacturer Identifier (region + maker)
                      </li>
                      <li>
                        <strong>VDS:</strong> Vehicle Descriptor Section (model details)
                      </li>
                      <li>
                        <strong>Check Digit:</strong> Validation using weighted algorithm
                      </li>
                      <li>
                        <strong>VIS:</strong> Vehicle Identifier Section (year + plant +
                        serial)
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* YAML Schema Tab */}
            <TabsContent value="yaml" className="space-y-4">
              {decodedData.isValid && yamlStructure ? (
                <>
                  <div className="flex items-center justify-between">
                    <Label>Database Organization Schema</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyYAML}
                      className="gap-2"
                    >
                      {copiedYAML ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-lg border bg-muted/50 text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto">
                    {yamlStructure}
                  </pre>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Usage:</strong> This YAML structure shows how you could organize
                      your database using VIN hierarchy. The WMI identifies manufacturers, VDS
                      groups vehicle configurations, and year codes organize by model year.
                      This allows efficient mapping of wheels and parts to vehicles.
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Enter a valid VIN to generate YAML database structure
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default VINDecoder;
