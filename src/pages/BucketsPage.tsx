
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { StorageExplorer } from "@/components/storage/StorageExplorer";

const BucketsPage = () => {
    return (
        <DashboardLayout title="Buckets" hideHeader={true} disableContentPadding={true}>
            <div className="h-full p-2 flex flex-col">
                <div className="flex-1 min-h-0">
                    <StorageExplorer />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BucketsPage;
