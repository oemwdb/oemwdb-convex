import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConvexReactClient } from 'convex/react'
import { ClerkProvider, useAuth } from '@clerk/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import App from './App.tsx'
import { RootErrorBoundary } from './RootErrorBoundary'
import './index.css'

const queryClient = new QueryClient()

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined
if (!convexUrl?.trim()) {
  const root = document.getElementById("root")!
  root.innerHTML = `
    <div style="padding: 2rem; font-family: system-ui; max-width: 500px; margin: 2rem auto;">
      <h1 style="color: #b91c1c;">Missing Convex URL</h1>
      <p>Set <code>VITE_CONVEX_URL</code> in <code>.env.local</code> (project root) and restart the dev server (<code>npm run dev</code>).</p>
    </div>
  `
} else {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!PUBLISHABLE_KEY) {
    const root = document.getElementById("root")!
    root.innerHTML = `
      <div style="padding: 2rem; font-family: system-ui; max-width: 500px; margin: 2rem auto;">
        <h1 style="color: #b91c1c;">Missing Clerk Publishable Key</h1>
        <p>Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>.env.local</code> (project root) and restart the dev server (<code>npm run dev</code>).</p>
      </div>
    `
  } else {
    const convex = new ConvexReactClient(convexUrl)
    createRoot(document.getElementById("root")!).render(
      <RootErrorBoundary>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'system-ui', textAlign: 'center' }}>Loading…</div>}>
                <App />
              </Suspense>
            </QueryClientProvider>
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </RootErrorBoundary>
    )
  }
}
