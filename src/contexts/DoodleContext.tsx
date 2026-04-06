import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useDevMode } from "@/contexts/DevModeContext";

interface DoodleContextValue {
  canUseDoodle: boolean;
  isQuickDoodleOpen: boolean;
  isDoodlePanelOpen: boolean;
  openQuickDoodle: () => void;
  closeQuickDoodle: () => void;
  openDoodlePanel: () => void;
  closeDoodlePanel: () => void;
  closeAllDoodle: () => void;
}

const DoodleContext = createContext<DoodleContextValue | undefined>(undefined);

export const DoodleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const { isDevMode } = useDevMode();
  const canUseDoodle = isAdmin && isDevMode;

  const [isQuickDoodleOpen, setIsQuickDoodleOpen] = useState(false);
  const [isDoodlePanelOpen, setIsDoodlePanelOpen] = useState(false);

  useEffect(() => {
    if (!canUseDoodle) {
      setIsQuickDoodleOpen(false);
      setIsDoodlePanelOpen(false);
    }
  }, [canUseDoodle]);

  const value = useMemo<DoodleContextValue>(
    () => ({
      canUseDoodle,
      isQuickDoodleOpen,
      isDoodlePanelOpen,
      openQuickDoodle: () => {
        setIsDoodlePanelOpen(true);
        setIsQuickDoodleOpen(true);
      },
      closeQuickDoodle: () => setIsQuickDoodleOpen(false),
      openDoodlePanel: () => {
        setIsDoodlePanelOpen(true);
      },
      closeDoodlePanel: () => {
        setIsQuickDoodleOpen(false);
        setIsDoodlePanelOpen(false);
      },
      closeAllDoodle: () => {
        setIsQuickDoodleOpen(false);
        setIsDoodlePanelOpen(false);
      },
    }),
    [canUseDoodle, isDoodlePanelOpen, isQuickDoodleOpen]
  );

  return <DoodleContext.Provider value={value}>{children}</DoodleContext.Provider>;
};

export const useDoodle = () => {
  const context = useContext(DoodleContext);
  if (!context) {
    throw new Error("useDoodle must be used within a DoodleProvider");
  }
  return context;
};
