
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import our pages
import BrandsPage from "./pages/BrandsPage";
import VehiclesPage from "./pages/VehiclesPage";
import WheelsPage from "./pages/WheelsPage";
import ContributePage from "./pages/ContributePage";

import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import BrandDetailPage from "./pages/BrandDetailPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import WheelDetailPage from "./pages/WheelDetailPage";
import WheelItemPage from "./pages/WheelItemPage";
import EnginesPage from "./pages/EnginesPage";
import EngineItemPage from "./pages/EngineItemPage";
import DevPage from "./pages/DevPage";
import DatabasePage from "./pages/DatabasePage";
import DatabaseRecordPage from "./pages/DatabaseRecordPage";
import InteractiveSiteMapPage from "./pages/InteractiveSiteMapPage";
import MasterItemTemplatesPage from "./pages/templates/MasterItemTemplatesPage";
import CollectionTemplatesPage from "./pages/templates/CollectionTemplatesPage";
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
const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavigationProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/brands/:brandName" element={<BrandDetailPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/:vehicleName" element={<VehicleDetailPage />} />
                <Route path="/wheels" element={<WheelsPage />} />
                <Route path="/wheels/:wheelName" element={<WheelDetailPage />} />
                <Route path="/wheel/:wheelId" element={<WheelItemPage />} />
                <Route path="/engines" element={<EnginesPage />} />
                <Route path="/engines/:engineId" element={<EngineItemPage />} />
                <Route path="/garage" element={<GaragePage />} />

                <Route path="/users" element={<ProtectedRoute requireAdmin={true}><UsersPage /></ProtectedRoute>} />
                <Route path="/users/:username" element={<PublicProfilePage />} />
                <Route path="/market" element={<ProtectedRoute requireAdmin={true}><MarketPage /></ProtectedRoute>} />
                <Route path="/market/new" element={<ProtectedRoute requireAdmin={true}><CreateListingPage /></ProtectedRoute>} />
                <Route path="/market/:listingId" element={<ProtectedRoute requireAdmin={true}><MarketListingDetailPage /></ProtectedRoute>} />
                <Route path="/cool-board" element={<ProtectedRoute requireAdmin={true}><CoolBoardPage /></ProtectedRoute>} />
                <Route path="/contribute" element={<ProtectedRoute requireAdmin={true}><ContributePage /></ProtectedRoute>} />
                <Route path="/dev" element={<ProtectedRoute requireAdmin={true}><DevPage /></ProtectedRoute>} />
                <Route path="/dev/database" element={<ProtectedRoute requireAdmin={true}><DatabasePage /></ProtectedRoute>} />
                <Route path="/dev/database/:tableName/:recordId" element={<ProtectedRoute requireAdmin={true}><DatabaseRecordPage /></ProtectedRoute>} />
                <Route path="/dev/site-map" element={<ProtectedRoute requireAdmin={true}><InteractiveSiteMapPage /></ProtectedRoute>} />
                <Route path="/dev/templates" element={<ProtectedRoute requireAdmin={true}><MasterItemTemplatesPage /></ProtectedRoute>} />
                <Route path="/dev/templates/collections" element={<ProtectedRoute requireAdmin={true}><CollectionTemplatesPage /></ProtectedRoute>} />
                <Route path="/dev/registered-vehicles" element={<ProtectedRoute><RegisteredVehiclesPage /></ProtectedRoute>} />
                <Route path="/dev/vin-decoder" element={<ProtectedRoute requireAdmin={true}><VINDecoderPage /></ProtectedRoute>} />
                <Route path="/dev/shadcn-workshop" element={<ProtectedRoute requireAdmin={true}><ShadcnWorkshopPage /></ProtectedRoute>} />
                <Route path="/dev/garage" element={<ProtectedRoute requireAdmin={true}><GaragePage /></ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/chart-comparison" element={<ChartComparison />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

            </AuthProvider>
          </NavigationProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
