import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const PublicHomePage = () => {
  return (
    <DashboardLayout
      title="Home"
      showSearch={false}
      showBreadcrumb={false}
      disableContentPadding={true}
    >
      <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-background px-6 text-center">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png"
            alt=""
            aria-hidden="true"
            className="animate-ghost-roam-a absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] blur-[1px] md:w-72"
          />
          <img
            src="/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png"
            alt=""
            aria-hidden="true"
            className="animate-ghost-roam-b absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] md:w-56"
          />
        </div>
        <h1 className="relative z-10 text-5xl font-semibold tracking-tight text-white md:text-7xl">
          Coming soon
        </h1>
      </div>
    </DashboardLayout>
  );
};

export default PublicHomePage;
