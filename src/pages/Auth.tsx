import { useEffect, useRef, useState } from "react";
import logo from "@/assets/formation-arc-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { sanitizeEmail, sanitizePasswordInput } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getAuthRedirectUrl } from "@/lib/auth-redirects";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 3.58Z"
      fill="#EA4335"
    />
  </svg>
);

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleExistingAccount = () => {
    setIsSignUp(false);
    setIsForgotPassword(false);
    setAuthMessage("An account already exists with this email. You can sign in or reset your password.");
    window.requestAnimationFrame(() => passwordInputRef.current?.focus());
  };

  const isDuplicateAccountError = (error: unknown, data?: { user?: { identities?: unknown[] | null } | null }) => {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    return (
      (typeof error === "object" && error !== null && "code" in error && error.code === "user_already_exists") ||
      (typeof error === "object" && error !== null && "status" in error && error.status === 422) ||
      message.includes("already registered") ||
      message.includes("already exists") ||
      message.includes("already been registered") ||
      data?.user?.identities?.length === 0
    );
  };

  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    if (confirmed === "true") {
      setIsSignUp(false);
      setIsForgotPassword(false);
      setAuthMessage("Your email has been confirmed. You can now sign in.");
      setSearchParams({}, { replace: true });
    } else if (confirmed === "false") {
      setIsSignUp(false);
      setIsForgotPassword(false);
      setAuthMessage("This confirmation link is invalid or has expired. Please request a new one.");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const validateEmail = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "Enter a valid email address";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address";
    return "";
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleEmailChange = (value: string) => {
    const lower = sanitizeEmail(value);
    setEmail(lower);
    if (forgotPasswordMessage) setForgotPasswordMessage("");
    if (emailTouched) setEmailError(validateEmail(lower));
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setAuthMessage("");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        setAuthMessage("We couldn't sign you in with Google. Please try again.");
      }

      if (result.redirected) {
        return;
      }
    } catch {
      setAuthMessage("We couldn't sign you in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setAuthMessage("");
    setForgotPasswordMessage("");
    const error = validateEmail(email);
    setEmailError(error);
    if (error) return;
    setLoading(true);

    const networkErrorMessage = "We couldn't complete this request. Please try again.";

    try {
      if (isForgotPassword) {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: getAuthRedirectUrl("/reset-password"),
          });
          setForgotPasswordMessage(
            error
              ? "We couldn't send the reset link. Please try again."
              : "If an account exists for this email, you'll receive a reset link.",
          );
        } catch {
          setForgotPasswordMessage("We couldn't send the reset link. Please try again.");
        }
        return;
      }

      if (isSignUp) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: getAuthRedirectUrl("/auth/callback") },
          });
          const isExistingAccountError = isDuplicateAccountError(error, data);

          if (error || isExistingAccountError) {
            setAuthMessage("We couldn't create your account. Try signing in or resetting your password.");
          } else {
            setIsSignUp(false);
            setPassword("");
            setAuthMessage("Account created. Check your email to verify your account.");
          }
        } catch {
          setAuthMessage(networkErrorMessage);
        }
      } else {
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            setAuthMessage("We couldn't sign you in. Please check your email or password.");
          } else {
            setAuthMessage("");
          }
        } catch {
          setAuthMessage(networkErrorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 pb-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="py-4 max-w-md mx-auto text-left space-y-6">
          <img
            src={logo}
            alt="The Formation Arc"
            className="h-auto object-contain mx-auto mt-[7px]"
            style={{ width: "min(85vw, 420px)" }}
          />
          <div className="space-y-1.5 text-supporting italic leading-relaxed">
            <p className="text-primary not-italic font-normal text-center">Overcome Fear. Restore identity.</p>
            <p></p>
            <p className="text-base not-italic text-destructive-foreground text-center">
              A practice for retraining distress and strengthening stability.
            </p>
          </div>
          <div className="space-y-3">
            <h1 className="text-foreground font-sans tracking-[0.12em] leading-6 text-base font-medium text-center pt-[20px]">
              {isSignUp ? "CREATE AN ACCOUNT" : "SIGN IN"}
            </h1>
            {!isForgotPassword && (
              <p className="text-text-supporting text-sm text-center">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMessage("");
                    setForgotPasswordMessage("");
                    setIsSignUp(!isSignUp);
                  }}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {isSignUp ? "Sign in" : "Create an account"}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Google Login Button */}
        <div className="pt-0">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-md h-10 px-3 text-sm font-medium text-foreground transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            style={{
              border: "1px solid rgba(168, 192, 168, 0.35)",
              backgroundColor: "rgba(12, 70, 81, 0.35)",
            }}
          >
            <GoogleIcon />
            <span>{googleLoading ? "..." : "Continue with Google"}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 py-0">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.15)]" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.15)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="you@example.com"
              className="bg-secondary"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
            />
            {emailTouched && emailError && <p className="text-sm text-muted-foreground mt-1">{emailError}</p>}
          </div>

          {!isForgotPassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  ref={passwordInputRef}
                  onChange={(e) => setPassword(sanitizePasswordInput(e.target.value))}
                  required
                  minLength={6}
                  maxLength={128}
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
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : isForgotPassword ? "Send Reset Link" : isSignUp ? "Create account" : "Sign in"}
          </Button>

          {isForgotPassword && forgotPasswordMessage && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-md border border-border/40 bg-muted/40 px-3 py-2 text-sm text-muted-foreground text-center"
            >
              {forgotPasswordMessage}
            </div>
          )}

          {authMessage && !isForgotPassword && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-md border border-border/40 bg-muted/40 px-3 py-2 text-sm text-muted-foreground text-center"
            >
              {authMessage}
            </div>
          )}

          {!isForgotPassword && !isSignUp && (
            <button
              type="button"
              onClick={() => {
                setAuthMessage("");
                setForgotPasswordMessage("");
                setIsForgotPassword(true);
              }}
              className="w-full text-center text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline mt-3 text-sm"
            >
              Forgot password?
            </button>
          )}

          {isForgotPassword && (
            <p className="text-center text-text-supporting mt-2 text-base">
              <button
                type="button"
                onClick={() => {
                  setAuthMessage("");
                  setForgotPasswordMessage("");
                  setIsForgotPassword(false);
                }}
                className="text-primary underline-offset-4 hover:underline"
              >
                Back to sign in
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
