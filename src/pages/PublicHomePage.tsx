import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WheelRunnerGame from "@/components/home/WheelRunnerGame";

const PublicHomePage = () => {
  return (
    <DashboardLayout
      title="Wheels Runner 2026"
      showSearch={false}
      disableContentPadding
    >
      <WheelRunnerGame />
    </DashboardLayout>
  );
};

export default PublicHomePage;
