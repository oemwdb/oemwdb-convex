import React from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBackendTarget } from "@/contexts/BackendTargetContext";

export default function BackendTargetBadge() {
  const { isAdmin, actualIsAuthenticated } = useAuth();
  const { activeTarget } = useBackendTarget();

  if (!actualIsAuthenticated || !isAdmin) return null;
  if (activeTarget !== "workshop") return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200 shadow-[0_0_18px_rgba(239,68,68,0.22)]">
      <ShieldAlert className="h-3.5 w-3.5" />
      Workshop
    </div>
  );
}
