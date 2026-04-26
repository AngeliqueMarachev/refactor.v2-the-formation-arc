import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useRoutePersistence, useRouteRestoration } from "@/hooks/use-route-persistence";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CoreOrientation from "./pages/CoreOrientation";
import Activated from "./pages/Activated";
import DailyFormation from "./pages/DailyFormation";
import Anchors from "./pages/Anchors";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import ReorientationComplete from "./pages/ReorientationComplete";
import ReorientationRehearsal from "./pages/ReorientationRehearsal";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function OrientationGate({ children }: { children: React.ReactNode }) {
  const { orientationSeen } = useAuth();
  if (!orientationSeen) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Tracks current route + handles restoration on app reopen */
function RoutePersistenceManager() {
  useRoutePersistence();
  return null;
}

/** Restores saved route on first authenticated load (within 6h) */
function RouteRestorationGate({ children }: { children: React.ReactNode }) {
  useRouteRestoration();
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <RoutePersistenceManager />
          <Routes>
            <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><CoreOrientation /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><OrientationGate><RouteRestorationGate><Index /></RouteRestorationGate></OrientationGate></ProtectedRoute>} />
            <Route path="/activated" element={<ProtectedRoute><Activated /></ProtectedRoute>} />
            <Route path="/daily-formation" element={<ProtectedRoute><DailyFormation /></ProtectedRoute>} />
            <Route path="/anchors" element={<ProtectedRoute><Anchors /></ProtectedRoute>} />
            <Route path="/daily-formation/reorientation-complete" element={<ProtectedRoute><ReorientationComplete /></ProtectedRoute>} />
            <Route path="/reorientation-rehearsal" element={<ProtectedRoute><ReorientationRehearsal /></ProtectedRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
