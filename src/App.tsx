import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { NavigationProvider } from "./contexts/NavigationContext";
import { LanguageProvider } from "./hooks/useLanguage";
import { POSProvider } from "./contexts/POSContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import POSPageNew from "./pages/pos/POSPageNew";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import More from "./pages/More";
import OrdersPageNew from "./pages/orders/OrdersPageNew";
import MenuPage from "./pages/menu/MenuPage";
import AIChatPage from "./pages/ai/AIChatPage";
import ForecastingPage from "./pages/ai/ForecastingPageNew";
import WasteOptimizerPage from "./pages/ai/WasteOptimizerPageNew";
import SettingsPage from "./pages/settings/SettingsPage";
import UsersPage from "./pages/users/UsersPage";
import HelpPage from "./pages/help/HelpPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <POSProvider>
              <OrdersProvider>
                <InventoryProvider>
                  <NavigationProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <Routes>
                        {/* Public Auth Routes */}
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/register" element={<Register />} />
                        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                        <Route path="/auth/reset-password" element={<ResetPassword />} />
                        
                        {/* Protected Routes */}
                        <Route element={<MainLayout />}>
                          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="/pos" element={<ProtectedRoute><POSPageNew /></ProtectedRoute>} />
                          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                          <Route path="/more" element={<ProtectedRoute><More /></ProtectedRoute>} />
                          <Route path="/orders" element={<ProtectedRoute><OrdersPageNew /></ProtectedRoute>} />
                          <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
                          <Route path="/ai-chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
                          <Route path="/waste-optimizer" element={<ProtectedRoute><WasteOptimizerPage /></ProtectedRoute>} />
                          <Route path="/forecasting" element={<ProtectedRoute><ForecastingPage /></ProtectedRoute>} />
                          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                          <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
                          <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
                        </Route>
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </TooltipProvider>
                  </NavigationProvider>
                </InventoryProvider>
              </OrdersProvider>
            </POSProvider>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
