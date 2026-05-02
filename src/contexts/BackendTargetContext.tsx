import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  type BackendTarget,
  BACKEND_TARGET_CHANGE_EVENT,
  getBackendUrlConfig,
  normalizeBackendTarget,
  persistBackendTarget,
  readStoredBackendTarget,
} from "@/lib/backendTarget";
import { setRuntimeConvexSiteUrl } from "@/lib/backendTargetRuntime";
import { readStoredPerspective, type ViewerPerspective } from "@/lib/perspective";

interface BackendTargetContextValue {
  selectedTarget: BackendTarget;
  activeTarget: BackendTarget;
  setSelectedTarget: (nextTarget: BackendTarget) => void;
  workshopConfigured: boolean;
  workshopEligible: boolean;
  canUseWorkshop: boolean;
  isPinnedToControl: boolean;
  controlUrl: string;
  workshopUrl: string;
}

const BackendTargetContext = createContext<BackendTargetContextValue | undefined>(undefined);

export const BackendTargetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [{ controlUrl, workshopUrl, controlSiteUrl, workshopSiteUrl }] = useState(() => getBackendUrlConfig());
  const [selectedTarget, setSelectedTargetState] = useState<BackendTarget>(() => readStoredBackendTarget());
  const [storedPerspective, setStoredPerspective] = useState<ViewerPerspective>(() => readStoredPerspective());

  const workshopConfigured = Boolean(workshopUrl);
  const canUseWorkshop = workshopConfigured && storedPerspective === "dev";
  const activeTarget: BackendTarget =
    canUseWorkshop && selectedTarget === "workshop"
      ? "workshop"
      : "control";

  useEffect(() => {
    const syncStoredTarget = () => {
      setSelectedTargetState(readStoredBackendTarget());
    };

    window.addEventListener("storage", syncStoredTarget);
    window.addEventListener(BACKEND_TARGET_CHANGE_EVENT, syncStoredTarget);

    return () => {
      window.removeEventListener("storage", syncStoredTarget);
      window.removeEventListener(BACKEND_TARGET_CHANGE_EVENT, syncStoredTarget);
    };
  }, []);

  useEffect(() => {
    const syncStoredPerspective = () => {
      setStoredPerspective(readStoredPerspective());
    };

    window.addEventListener("storage", syncStoredPerspective);
    window.addEventListener("viewer-perspective-change", syncStoredPerspective);

    return () => {
      window.removeEventListener("storage", syncStoredPerspective);
      window.removeEventListener("viewer-perspective-change", syncStoredPerspective);
    };
  }, []);

  useEffect(() => {
    const activeSiteUrl = activeTarget === "workshop" ? workshopSiteUrl : controlSiteUrl;
    setRuntimeConvexSiteUrl(activeSiteUrl);
  }, [activeTarget, controlSiteUrl, workshopSiteUrl]);

  const setSelectedTarget = (nextTarget: BackendTarget) => {
    const normalized = normalizeBackendTarget(nextTarget);
    const safeTarget =
      normalized === "workshop" && canUseWorkshop
        ? "workshop"
        : "control";
    persistBackendTarget(safeTarget);
    setSelectedTargetState(safeTarget);
  };

  const value = useMemo<BackendTargetContextValue>(() => ({
    selectedTarget,
    activeTarget,
    setSelectedTarget,
    workshopConfigured,
    canUseWorkshop,
    workshopEligible: canUseWorkshop,
    isPinnedToControl: false,
    controlUrl,
    workshopUrl,
  }), [
    activeTarget,
    canUseWorkshop,
    controlUrl,
    selectedTarget,
    workshopConfigured,
    workshopUrl,
  ]);

  return (
    <BackendTargetContext.Provider value={value}>
      {children}
    </BackendTargetContext.Provider>
  );
};

export function useBackendTarget() {
  const context = useContext(BackendTargetContext);
  if (!context) {
    throw new Error("useBackendTarget must be used within a BackendTargetProvider");
  }
  return context;
}
