import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AppIcon from "@/components/dev/AppIcon";
import { Grid, FileText, Layers } from "lucide-react";

const MasterItemTemplatesPage = () => {
  return (
    <DashboardLayout title="Components" showFilterButton={false} disableContentPadding={true}>
      <div className="h-full p-2 overflow-y-auto">
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <AppIcon
            to="/dev/templates/collections"
            icon={Grid}
            label="Collection Builder"
            description="Configure grid layouts"
          />
          <AppIcon
            to="/dev/templates/pages"
            icon={FileText}
            label="Page Builder"
            description="Map data to detail pages"
          />
          <AppIcon
            to="/dev/templates/card-system"
            icon={Layers}
            label="Card Builder"
            description="Component architecture"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MasterItemTemplatesPage;