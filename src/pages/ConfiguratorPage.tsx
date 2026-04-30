import { useState } from "react";

import ComboMaker from "@/components/configurator/ComboMaker";
import ConfiguratorModeSwitch from "@/components/configurator/ConfiguratorModeSwitch";
import type { ConfiguratorMode } from "@/components/configurator/configuratorModes";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function ConfiguratorPage() {
  const [mode, setMode] = useState<ConfiguratorMode>("vehicleCombo");

  return (
    <DashboardLayout
      title="Configurator"
      showSearch={false}
      disableContentPadding
      headerLeftContent={<ConfiguratorModeSwitch value={mode} onChange={setMode} />}
    >
      <ComboMaker mode={mode} storageKey="oemwdb.configuratorCombos.v1" />
    </DashboardLayout>
  );
}
