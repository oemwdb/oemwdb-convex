import { Suspense } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { RootErrorBoundary } from "./RootErrorBoundary";
import { BackendTargetProvider, useBackendTarget } from "@/contexts/BackendTargetContext";
import { getBackendUrlConfig } from "@/lib/backendTarget";
import "./index.css";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CLERK_AUTH_REDIRECT_URL = "/";
const { controlUrl, workshopUrl } = getBackendUrlConfig();

declare global {
  interface Window {
    __OEMWDB_REACT_ROOT__?: Root;
  }
}

function ConvexBackendBridge({
  controlClient,
  workshopClient,
  children,
}: {
  controlClient: ConvexReactClient;
  workshopClient: ConvexReactClient | null;
  children: React.ReactNode;
}) {
  const { activeTarget } = useBackendTarget();
  const sameBackendUrl = workshopUrl === controlUrl;
  const client =
    activeTarget === "workshop" && workshopClient && !sameBackendUrl
      ? workshopClient
      : controlClient;
  const authStorageNamespace =
    activeTarget === "workshop" && sameBackendUrl
      ? "oemwdb-control"
      : `oemwdb-${activeTarget}`;

  return (
    <ConvexProviderWithClerk key={authStorageNamespace} client={client} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

const root = document.getElementById("root")!;
if (!PUBLISHABLE_KEY) {
  root.innerHTML = `
    <div style="padding: 2rem; font-family: system-ui; max-width: 500px; margin: 2rem auto;">
      <h1 style="color: #b91c1c;">Missing Clerk Publishable Key</h1>
      <p>Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>.env.local</code> and restart the dev server (<code>npm run dev</code>).</p>
    </div>
  `;
} else if (!controlUrl) {
  root.innerHTML = `
    <div style="padding: 2rem; font-family: system-ui; max-width: 500px; margin: 2rem auto;">
      <h1 style="color: #b91c1c;">Missing Convex URL</h1>
      <p>Set <code>VITE_CONVEX_CONTROL_URL</code> (or legacy <code>VITE_CONVEX_URL</code>) in <code>.env.local</code> and restart the dev server (<code>npm run dev</code>).</p>
    </div>
  `;
} else {
  const controlClient = new ConvexReactClient(controlUrl);
  const workshopClient = workshopUrl ? new ConvexReactClient(workshopUrl) : null;
  const reactRoot = window.__OEMWDB_REACT_ROOT__ ?? createRoot(root);
  window.__OEMWDB_REACT_ROOT__ = reactRoot;
  reactRoot.render(
    <RootErrorBoundary>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl={CLERK_AUTH_REDIRECT_URL}
        signInFallbackRedirectUrl={CLERK_AUTH_REDIRECT_URL}
        signInForceRedirectUrl={CLERK_AUTH_REDIRECT_URL}
        signUpFallbackRedirectUrl={CLERK_AUTH_REDIRECT_URL}
        signUpForceRedirectUrl={CLERK_AUTH_REDIRECT_URL}
      >
        <BrowserRouter>
          <BackendTargetProvider>
            <ConvexBackendBridge controlClient={controlClient} workshopClient={workshopClient}>
              <QueryClientProvider client={queryClient}>
                <Suspense
                  fallback={
                    <div style={{ padding: "2rem", fontFamily: "system-ui", textAlign: "center" }}>
                      Loading…
                    </div>
                  }
                >
                  <App />
                </Suspense>
              </QueryClientProvider>
            </ConvexBackendBridge>
          </BackendTargetProvider>
        </BrowserRouter>
      </ClerkProvider>
    </RootErrorBoundary>
  );
}
