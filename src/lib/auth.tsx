import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ensureUsageStats } from "@/lib/usage-stats";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  orientationSeen: boolean;
  hasActiveReorientation: boolean;
  onboardingStateLoading: boolean;
  setOrientationSeen: (v: boolean) => void;
  refreshOnboardingState: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  orientationSeen: false,
  hasActiveReorientation: false,
  onboardingStateLoading: true,
  setOrientationSeen: () => {},
  refreshOnboardingState: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const SESSION_KEY = "orientation_seen_this_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [orientationSeen, setOrientationSeenState] = useState(false);
  const [hasActiveReorientation, setHasActiveReorientation] = useState(false);
  const [onboardingStateLoading, setOnboardingStateLoading] = useState(true);

  const refreshOnboardingState = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const userId = currentSession?.user?.id;

    if (!userId) {
      setOrientationSeenState(false);
      setHasActiveReorientation(false);
      setOnboardingStateLoading(false);
      return;
    }

    setOnboardingStateLoading(true);

    const reorientTemplates = supabase.from("reorient_templates") as any;
    const [{ data: profile, error: profileError }, { data: templates }] = await Promise.all([
      supabase.from("profiles").select("core_orientation_seen").eq("id", userId).maybeSingle(),
      reorientTemplates
        .select("id")
        .eq("user_id", userId)
        .eq("is_active", true)
        .limit(1),
    ]);

    if (profileError) {
      console.error("Failed to load profile onboarding state", profileError);
    }

    const hasSeenOrientation = !!profile?.core_orientation_seen || sessionStorage.getItem(SESSION_KEY) === "true";
    setOrientationSeenState(hasSeenOrientation);
    setHasActiveReorientation(!!templates && templates.length > 0);
    setOnboardingStateLoading(false);
  };

  const setOrientationSeen = (v: boolean) => {
    if (v) {
      sessionStorage.setItem(SESSION_KEY, "true");
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
    setOrientationSeenState(v);

    const userId = session?.user?.id;
    if (userId) {
      supabase.from("profiles").update({ core_orientation_seen: v }).eq("id", userId).then(() => undefined);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === "SIGNED_OUT") {
          sessionStorage.removeItem(SESSION_KEY);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (session?.user?.id) {
      ensureUsageStats(session.user.id);
    }
    refreshOnboardingState();
  }, [loading, session?.user?.id]);

  const signOut = async () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("last_route");
    localStorage.removeItem("last_route_ts");
    setOrientationSeenState(false);
    setHasActiveReorientation(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        orientationSeen,
        hasActiveReorientation,
        onboardingStateLoading,
        setOrientationSeen,
        refreshOnboardingState,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
