import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/formation-arc-logo.png";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const completeAuth = async () => {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

      const errorParam =
        params.get("error") ||
        params.get("error_code") ||
        hashParams.get("error") ||
        hashParams.get("error_code");

      const isExpired =
        errorParam === "otp_expired" ||
        errorParam === "access_denied" ||
        (params.get("error_description") || hashParams.get("error_description") || "")
          .toLowerCase()
          .includes("expired");

      if (errorParam) {
        if (!cancelled) {
          navigate(isExpired ? "/auth?expired=true" : "/auth", { replace: true });
        }
        return;
      }

      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Magic link callback failed", error);
          if (!cancelled) {
            navigate("/auth?expired=true", { replace: true });
          }
          return;
        }
      }

      if (!cancelled) {
        // OrientationGate routes new users to /onboarding and returning users to home.
        navigate("/", { replace: true });
      }
    };

    completeAuth();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <img
        src={logo}
        alt="The Formation Arc"
        className="h-auto object-contain mb-8"
        style={{ width: "min(85vw, 420px)" }}
      />
      <p className="text-muted-foreground animate-pulse">Signing you in…</p>
    </div>
  );
};

export default AuthCallback;
