import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DevModeProvider } from "@/contexts/DevModeContext";
import { CollectionSidebarProvider } from "@/contexts/CollectionSidebarContext";
import Index from "./pages/Index";
import PublicHomePage from "./pages/PublicHomePage";
import NotFound from "./pages/NotFound";

// Import our pages
import BrandsPage from "./pages/BrandsPage";
import VehiclesPage from "./pages/VehiclesPage";
import ModifiedVehiclesPage from "./pages/ModifiedVehiclesPage";
import WheelsPage from "./pages/WheelsPage";
import { WheelsPageErrorBoundary } from "./components/wheel/WheelsPageErrorBoundary";
import ContributePage from "./pages/ContributePage";

import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import ProfilePage from "./pages/ProfilePage";
import BrandDetailPage from "./pages/BrandDetailPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import VehicleVariantPage from "./pages/VehicleVariantPage";
import ModifiedVehicleDetailPage from "./pages/ModifiedVehicleDetailPage";
import WheelItemPage from "./pages/WheelItemPage";
import WheelVariantPage from "./pages/WheelVariantPage";
import WheelLegacyRedirect from "./pages/WheelLegacyRedirect";
import EnginesPage from "./pages/EnginesPage";
import EngineItemPage from "./pages/EngineItemPage";
import ColorsPage from "./pages/ColorsPage";
import ColorItemPage from "./pages/ColorItemPage";
import DevPage from "./pages/DevPage";
import BillyDashPage from "./pages/BillyDashPage";
import TablesPage from "./pages/TablesPage";
import DatabaseRecordPage from "./pages/DatabaseRecordPage";
import InteractiveSiteMapPage from "./pages/InteractiveSiteMapPage";
import MasterItemTemplatesPage from "./pages/templates/MasterItemTemplatesPage";
import CollectionTemplatesPage from "./pages/templates/CollectionTemplatesPage";
import PageTemplatesPage from "./pages/templates/PageTemplatesPage";
import UsersPage from "./pages/UsersPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import MarketPage from "./pages/MarketPage";
import CreateListingPage from "./pages/CreateListingPage";
import MarketListingDetailPage from "./pages/MarketListingDetailPage";
import CoolBoardPage from "./pages/CoolBoardPage";
import RegisteredVehiclesPage from "./pages/RegisteredVehiclesPage";
import ChartComparison from "./pages/ChartComparison";
import VINDecoderPage from "./pages/VINDecoderPage";
import ShadcnWorkshopPage from "./pages/ShadcnWorkshopPage";
import GaragePage from "./pages/GaragePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import BucketsPage from "./pages/BucketsPage";
import AdvertisingPage from "./pages/AdvertisingPage";
import WheelRecogniserPage from "./pages/WheelRecogniserPage";
import SchemaVisualizerPage from "./pages/SchemaVisualizerPage";

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NavigationProvider>
        <AuthProvider>
          <DevModeProvider>
            <CollectionSidebarProvider>
              <Routes>
                <Route path="/" element={<PublicHomePage />} />
                <Route path="/dev/home" element={<ProtectedRoute requireAdmin={true} fallbackPath="/brands"><Index /></ProtectedRoute>} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/brands/:brandName" element={<BrandDetailPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/:vehicleName" element={<VehicleDetailPage />} />
                <Route path="/vehicle-variants/:variantId" element={<VehicleVariantPage />} />
                <Route path="/builds" element={<ModifiedVehiclesPage />} />
                <Route path="/builds/:buildSlug" element={<ModifiedVehicleDetailPage />} />
                <Route path="/wheels" element={<WheelsPageErrorBoundary><WheelsPage /></WheelsPageErrorBoundary>} />
                <Route path="/wheels/:wheelName" element={<WheelLegacyRedirect />} />
                <Route path="/wheel/:wheelId" element={<WheelItemPage />} />
                <Route path="/wheel-variants/:variantId" element={<WheelVariantPage />} />
                <Route path="/colors" element={<ColorsPage />} />
                <Route path="/colors/:colorId" element={<ColorItemPage />} />
                <Route path="/engines" element={<EnginesPage />} />
                <Route path="/engines/:engineId" element={<EngineItemPage />} />
                <Route path="/garage" element={<GaragePage />} />

                <Route path="/users" element={<ProtectedRoute requireAdmin={true}><UsersPage /></ProtectedRoute>} />
                <Route path="/users/:username" element={<PublicProfilePage />} />
                <Route path="/market" element={<MarketPage />} />
                <Route path="/market/new" element={<ProtectedRoute requireAdmin={true} requireDevMode={false}><CreateListingPage /></ProtectedRoute>} />
                <Route path="/market/:listingId" element={<ProtectedRoute requireAdmin={true} requireDevMode={false}><MarketListingDetailPage /></ProtectedRoute>} />
                <Route path="/cool-board" element={<ProtectedRoute requireAdmin={true}><CoolBoardPage /></ProtectedRoute>} />
                <Route path="/contribute" element={<ProtectedRoute requireAdmin={true}><ContributePage /></ProtectedRoute>} />
                <Route path="/dev" element={<ProtectedRoute requireAdmin={true}><DevPage /></ProtectedRoute>} />
                <Route path="/dev/billy-dash" element={<BillyDashPage />} />
                <Route path="/dev/tables" element={<ProtectedRoute requireAdmin={true}><TablesPage /></ProtectedRoute>} />
                <Route path="/dev/tables/:tableName/:recordId" element={<ProtectedRoute requireAdmin={true}><DatabaseRecordPage /></ProtectedRoute>} />
                <Route path="/dev/site-map" element={<ProtectedRoute requireAdmin={true}><InteractiveSiteMapPage /></ProtectedRoute>} />
                <Route path="/dev/templates" element={<ProtectedRoute requireAdmin={true}><MasterItemTemplatesPage /></ProtectedRoute>} />
                <Route path="/dev/templates/collections" element={<ProtectedRoute requireAdmin={true}><CollectionTemplatesPage /></ProtectedRoute>} />
                <Route path="/dev/templates/pages" element={<ProtectedRoute requireAdmin={true}><PageTemplatesPage /></ProtectedRoute>} />
                <Route path="/dev/registered-vehicles" element={<ProtectedRoute><RegisteredVehiclesPage /></ProtectedRoute>} />
                <Route path="/dev/vin-decoder" element={<ProtectedRoute requireAdmin={true}><VINDecoderPage /></ProtectedRoute>} />
                <Route path="/dev/shadcn-workshop" element={<ProtectedRoute requireAdmin={true}><ShadcnWorkshopPage /></ProtectedRoute>} />
                <Route path="/dev/garage" element={<ProtectedRoute requireAdmin={true}><GaragePage /></ProtectedRoute>} />
                <Route path="/dev/buckets" element={<ProtectedRoute requireAdmin={true}><BucketsPage /></ProtectedRoute>} />
                <Route path="/dev/advertising" element={<ProtectedRoute requireAdmin={true}><AdvertisingPage /></ProtectedRoute>} />
                <Route path="/dev/schema" element={<ProtectedRoute requireAdmin={true}><SchemaVisualizerPage /></ProtectedRoute>} />
                <Route path="/dev/wheel-recogniser" element={<ProtectedRoute requireAdmin={true}><WheelRecogniserPage /></ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/account/*" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/chart-comparison" element={<ChartComparison />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CollectionSidebarProvider>
          </DevModeProvider>
        </AuthProvider>
      </NavigationProvider>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
