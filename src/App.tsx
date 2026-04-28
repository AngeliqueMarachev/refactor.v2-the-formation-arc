import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import ReorientationRehearsal from "./pages/ReorientationRehearsal";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-text-supporting">
      <p className="text-supporting">Loading…</p>
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function OrientationGate({ children }: { children: ReactNode }) {
  const { orientationSeen, hasActiveReorientation, onboardingStateLoading } = useAuth();
  if (onboardingStateLoading) return <LoadingScreen />;
  if (!orientationSeen) return <Navigate to="/onboarding" replace />;
  if (!hasActiveReorientation) return <Navigate to="/activated" replace />;
  return <>{children}</>;
}

function ReorientationGate({ children }: { children: ReactNode }) {
  const { orientationSeen, hasActiveReorientation, onboardingStateLoading } = useAuth();
  if (onboardingStateLoading) return <LoadingScreen />;
  if (!orientationSeen) return <Navigate to="/onboarding" replace />;
  if (!hasActiveReorientation) return <Navigate to="/activated" replace />;
  return <>{children}</>;
}

function CreateReorientationRoute({ children }: { children: ReactNode }) {
  const { orientationSeen, hasActiveReorientation, onboardingStateLoading } = useAuth();
  if (onboardingStateLoading) return <LoadingScreen />;
  if (!orientationSeen && !hasActiveReorientation) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
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
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <RoutePersistenceManager />
          <Routes>
            <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/onboarding" element={<ProtectedRoute><CoreOrientation /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><OrientationGate><RouteRestorationGate><Index /></RouteRestorationGate></OrientationGate></ProtectedRoute>} />
            <Route path="/activated" element={<ProtectedRoute><CreateReorientationRoute><Activated /></CreateReorientationRoute></ProtectedRoute>} />
            <Route path="/daily-formation" element={<ProtectedRoute><ReorientationGate><DailyFormation /></ReorientationGate></ProtectedRoute>} />
            <Route path="/anchors" element={<ProtectedRoute><ReorientationGate><Anchors /></ReorientationGate></ProtectedRoute>} />
            <Route path="/reorientation-rehearsal" element={<ProtectedRoute><ReorientationGate><ReorientationRehearsal /></ReorientationGate></ProtectedRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
