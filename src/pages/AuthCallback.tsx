import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/formation-arc-logo.png";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const completeConfirmation = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.error("Email confirmation callback failed", error);
      }

      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const hashType = hashParams.get("type");

      if (hashType === "signup" || code) {
        localStorage.removeItem("last_route");
        localStorage.removeItem("last_route_ts");
        await supabase.auth.signOut();
      }

      if (!cancelled) {
        navigate("/auth?confirmed=true", { replace: true });
      }
    };

    completeConfirmation();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <img src={logo} alt="The Formation Arc" className="h-auto object-contain mb-8" style={{ width: "min(85vw, 420px)" }} />
      <p className="text-muted-foreground animate-pulse">Confirming your email…</p>
    </div>
  );
};

export default AuthCallback;