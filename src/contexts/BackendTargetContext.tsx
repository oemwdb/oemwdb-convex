import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import { ADMIN_EMAILS } from "@/lib/perspective";
import {
  type BackendTarget,
  BACKEND_TARGET_CHANGE_EVENT,
  getBackendUrlConfig,
  normalizeBackendTarget,
  persistBackendTarget,
  readStoredBackendTarget,
} from "@/lib/backendTarget";
import { setRuntimeConvexSiteUrl } from "@/lib/backendTargetRuntime";

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
  const { user, isLoaded, isSignedIn } = useUser();
  const [{ controlUrl, workshopUrl, controlSiteUrl, workshopSiteUrl }] = useState(() => getBackendUrlConfig());
  const [selectedTarget, setSelectedTargetState] = useState<BackendTarget>(() => readStoredBackendTarget());

  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() ??
    user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() ??
    null;
  const isAdmin = !!primaryEmail && ADMIN_EMAILS.has(primaryEmail);
  const workshopConfigured = Boolean(workshopUrl);
  const canUseWorkshop = !!isLoaded && !!isSignedIn && isAdmin && workshopConfigured;
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
