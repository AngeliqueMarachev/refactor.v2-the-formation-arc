import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/formation-arc-logo.png";

type PageState = "verifying" | "ready" | "submitting" | "success" | "error";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pageState, setPageState] = useState<PageState>("verifying");
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event from Supabase auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPageState("ready");
      }
    });

    // Also check if we already have a session (recovery token may have been auto-processed)
    // The hash fragment contains access_token & type=recovery
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      // Supabase JS client auto-processes the hash; wait briefly for it
      const timer = setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            setPageState("ready");
          } else {
            setPageState("error");
            setErrorMessage("This reset link is invalid or has expired.");
          }
        });
      }, 1500);
      return () => {
        clearTimeout(timer);
        subscription.unsubscribe();
      };
    }

    // If no hash, wait a few seconds then show error
    const timeout = setTimeout(() => {
      setPageState((prev) => (prev === "verifying" ? "error" : prev));
      if (pageState === "verifying") {
        setErrorMessage("This reset link is invalid or has expired.");
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const validate = (): boolean => {
    const errors: { password?: string; confirm?: string } = {};
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      errors.confirm = "Passwords do not match";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setPageState("submitting");
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setPageState("ready");
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPageState("success");
      // Sign out so user starts fresh, then redirect to auth
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/auth", { replace: true });
      }, 2500);
    }
  };

  const handleRequestNewLink = () => {
    navigate("/auth", { replace: true });
  };

  // --- Verifying state ---
  if (pageState === "verifying") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5">
        <img src={logo} alt="The Formation Arc" className="h-24 w-auto mb-8" />
        <p className="text-muted-foreground animate-pulse">Verifying reset link…</p>
      </div>
    );
  }

  // --- Error state ---
  if (pageState === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5">
        <img src={logo} alt="The Formation Arc" className="h-24 w-auto mb-8" />
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Link Expired</h1>
          <p className="text-sm text-muted-foreground">
            {errorMessage || "This reset link is invalid or has expired."}
          </p>
          <Button onClick={handleRequestNewLink} className="w-full">
            Back to Sign In
          </Button>
          <p className="text-xs text-muted-foreground">
            You can request a new password reset from the sign-in screen.
          </p>
        </div>
      </div>
    );
  }

  // --- Success state ---
  if (pageState === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5">
        <img src={logo} alt="The Formation Arc" className="h-24 w-auto mb-8" />
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Password Updated</h1>
          <p className="text-sm text-muted-foreground">
            Your password has been changed. Redirecting to sign in…
          </p>
        </div>
      </div>
    );
  }

  // --- Ready / Submitting state ---
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 pb-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <img src={logo} alt="The Formation Arc" className="h-24 w-auto mx-auto" />
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
            <p className="text-sm text-muted-foreground">Choose a new password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                required
                minLength={6}
                placeholder="••••••••"
                className="bg-secondary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-sm text-destructive">{fieldErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirm) setFieldErrors((p) => ({ ...p, confirm: undefined }));
                }}
                required
                minLength={6}
                placeholder="••••••••"
                className="bg-secondary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.confirm && (
              <p className="text-sm text-destructive">{fieldErrors.confirm}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={pageState === "submitting"}>
            {pageState === "submitting" ? "Updating…" : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
