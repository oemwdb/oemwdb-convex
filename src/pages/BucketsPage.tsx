
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { StorageExplorer } from "@/components/storage/StorageExplorer";

const BucketsPage = () => {
    return (
        <DashboardLayout title="Buckets" hideHeader={true}>
            <div className="h-[calc(100vh-2rem)] flex flex-col my-4 mr-4 ml-0">
                <div className="flex-1 min-h-0">
                    <StorageExplorer />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BucketsPage;
