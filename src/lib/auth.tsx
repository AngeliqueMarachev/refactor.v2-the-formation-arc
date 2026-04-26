import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  orientationSeen: boolean;
  setOrientationSeen: (v: boolean) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  orientationSeen: false,
  setOrientationSeen: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const SESSION_KEY = "orientation_seen_this_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [, forceUpdate] = useState(0);

  const orientationSeen = sessionStorage.getItem(SESSION_KEY) === "true";

  const setOrientationSeen = (v: boolean) => {
    if (v) {
      sessionStorage.setItem(SESSION_KEY, "true");
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
    forceUpdate((n) => n + 1);
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

  const signOut = async () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("last_route");
    localStorage.removeItem("last_route_ts");
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, orientationSeen, setOrientationSeen, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
