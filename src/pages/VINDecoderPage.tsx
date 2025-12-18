import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import VINDecoder from '@/components/dev/VINDecoder';

const VINDecoderPage = () => {
  return (
    <DashboardLayout title="VIN Decoder" showFilterButton={false}>
      <div className="pl-0 pr-4 pt-0 pb-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">VIN Decoder</h1>
          <p className="text-muted-foreground mt-1">
            Decode Vehicle Identification Numbers and explore database organization structures
          </p>
        </div>

        <VINDecoder />

        {/* Additional Info Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border bg-card space-y-2">
            <h3 className="font-semibold text-sm">What is a VIN?</h3>
            <p className="text-xs text-muted-foreground">
              A Vehicle Identification Number (VIN) is a unique 17-character code assigned to
              every motor vehicle manufactured since 1981. It encodes information about the
              manufacturer, vehicle specifications, and production details.
            </p>
          </div>

          <div className="p-4 rounded-lg border bg-card space-y-2">
            <h3 className="font-semibold text-sm">Database Integration</h3>
            <p className="text-xs text-muted-foreground">
              This tool generates YAML schema suggestions for organizing vehicle and parts data
              using VIN structure as the foundation. The hierarchical nature of VINs (WMI →
              VDS → VIS) provides a natural way to organize compatibility data.
            </p>
          </div>
        </div>

        {/* Future Development Section */}
        <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
          <h3 className="font-semibold text-sm">Future Development</h3>
          <div className="grid gap-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Integration with NHTSA vPIC API for detailed vehicle specifications</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Automatic wheel and brake parts compatibility lookup</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>VIN-based database indexing for faster parts searches</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Bulk VIN import and vehicle fleet management</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VINDecoderPage;
