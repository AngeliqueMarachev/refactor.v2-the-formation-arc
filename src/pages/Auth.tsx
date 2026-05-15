import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "@/assets/formation-arc-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { sanitizeEmail } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OtpInput from "@/components/OtpInput";

const RESEND_COOLDOWN_S = 40;
const RATE_LIMIT_COOLDOWN_S = 12;

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState<"landing" | "email" | "code">("landing");

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      setCodeError("Your code has expired. Request a new one.");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const validateEmail = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "Enter a valid email address";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address";
    return "";
  };

  const handleEmailChange = (value: string) => {
    const lower = sanitizeEmail(value);
    setEmail(lower);
    if (emailTouched) setEmailError(validateEmail(lower));
  };

  const sendCode = async (target: string): Promise<boolean> => {
    if (!target) {
      setStatusMessage("Enter your email before requesting a code.");
      return false;
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: target,
        options: { shouldCreateUser: true },
      });
      if (error) {
        const msg = (error.message || "").toLowerCase();
        const status = (error as { status?: number }).status;
        if (
          status === 429 ||
          msg.includes("rate limit") ||
          msg.includes("for security purposes") ||
          msg.includes("only request this after")
        ) {
          setStatusMessage("Almost there. Please wait a few more seconds.");
          setCooldown(RATE_LIMIT_COOLDOWN_S);
        } else {
          setStatusMessage("Something went wrong. Check your connection and try again.");
        }
        return false;
      }
      setCooldown(RESEND_COOLDOWN_S);
      return true;
    } catch {
      setStatusMessage("Something went wrong. Check your connection and try again.");
      return false;
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setStatusMessage("");
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;
    setLoading(true);
    try {
      const ok = await sendCode(email);
      if (ok) {
        setSentTo(email);
        setCode("");
        setCodeError("");
        setStep("code");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!sentTo || cooldown > 0 || loading) return;
    setLoading(true);
    setStatusMessage("");
    setCodeError("");
    try {
      const ok = await sendCode(sentTo);
      if (ok) {
        setCode("");
        setStatusMessage("Code resent. Check your inbox.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseDifferentEmail = () => {
    setStep("email");
    setSentTo("");
    setCode("");
    setCodeError("");
    setStatusMessage("");
    setEmail("");
    setEmailTouched(false);
    setEmailError("");
    setCooldown(0);
    verifiedRef.current = false;
  };

  const handleVerify = async (codeToVerify?: string) => {
    const token = (codeToVerify ?? code).trim();
    if (token.length !== 6 || verifying || verifiedRef.current) return;
    setVerifying(true);
    setCodeError("");
    setStatusMessage("");
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: sentTo,
        token,
        type: "email",
      });
      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("expired")) {
          setCodeError("Your code has expired. Request a new one.");
        } else {
          setCodeError("That code didn't work. Check it and try again, or request a new one.");
        }
        return;
      }
      verifiedRef.current = true;
      navigate("/", { replace: true });
    } catch {
      setCodeError("That code didn't work. Check it and try again, or request a new one.");
    } finally {
      setVerifying(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setStatusMessage("");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) setStatusMessage("We couldn't sign you in with Google. Please try again.");
      if (result.redirected) return;
    } catch {
      setStatusMessage("We couldn't sign you in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (step === "code") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 pb-12">
        <div className="w-full max-w-sm space-y-6">
          <img
            src={logo}
            alt="The Formation Arc"
            className="h-auto object-contain mx-auto mt-[7px]"
            style={{ width: "min(85vw, 420px)" }}
          />
          <div className="space-y-3 text-center pt-4">
            <h1 className="text-foreground font-sans tracking-[0.12em] leading-6 text-base font-medium">
              ENTER YOUR CODE
            </h1>
            <p className="text-text-supporting text-sm leading-loose">
              We sent a 6-digit code to
              <br />
              <span className="text-foreground break-all">{sentTo}</span>
            </p>
          </div>

          <div className="space-y-3">
            <OtpInput
              value={code}
              onChange={(v) => {
                setCode(v);
                if (codeError) setCodeError("");
              }}
              onComplete={(v) => handleVerify(v)}
              error={!!codeError}
              autoFocus
              disabled={verifying}
            />
            {codeError && <p className="text-sm text-muted-foreground text-center">{codeError}</p>}
          </div>

          <Button onClick={() => handleVerify()} className="w-full" disabled={code.length !== 6 || verifying}>
            {verifying ? "..." : "Verify"}
          </Button>

          {statusMessage && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-md border border-border/40 bg-muted/40 px-3 py-2 text-sm text-muted-foreground text-center"
            >
              {statusMessage}
            </div>
          )}

          <div className="flex flex-col items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
              aria-disabled={cooldown > 0 || loading}
              className={
                cooldown > 0 || loading
                  ? "text-sm text-muted-foreground opacity-50 cursor-not-allowed"
                  : "text-sm text-primary underline underline-offset-4 transition-opacity hover:opacity-80 active:opacity-70 cursor-pointer"
              }
            >
              {loading ? "Sending..." : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
            <button
              type="button"
              onClick={handleUseDifferentEmail}
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scrollToAuth = () => {
    document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-5 pt-10 pb-12">
      <div className="w-full max-w-sm space-y-8">
        {/* HERO */}
        <div className="space-y-6 text-center">
          <img
            src={logo}
            alt="The Formation Arc"
            className="h-auto object-contain mx-auto mt-[7px]"
            style={{ width: "min(85vw, 420px)" }}
          />
          <div className="space-y-3 pt-2">
            <h1 className="font-fraunces text-primary text-2xl sm:text-3xl leading-tight">
              Fear conditions perception.
              <br />
              Formation restores it.
            </h1>
            <p className="text-text-supporting/90 text-sm sm:text-base leading-snug max-w-[440px] mx-auto">
              A structured practice for retraining perception and stabilizing your internal world through neuroscience,
              structured repetition, and identity-based formation.
            </p>
          </div>

          {/* Stacked CTAs */}
          <div className="space-y-3 pt-2">
            <Button onClick={scrollToAuth} className="w-full" size="lg">
              Begin your formation
            </Button>
            <a
              href="https://tally.so/r/EkvV7q"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-md h-11 px-4 text-sm font-medium border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              Take the assessment
            </a>
          </div>
        </div>

        {/* AUTH SECTION */}
        <div id="auth-section" className="pt-8 space-y-5">
          <div className="space-y-1.5 text-center">
            <h2 className="text-foreground font-sans tracking-[0.12em] leading-6 text-sm font-medium">
              START YOUR JOURNEY
            </h2>
            <p className="text-text-supporting text-sm">Enter your email to continue</p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => {
                setEmailTouched(true);
                setEmailError(validateEmail(email));
              }}
              placeholder="you@example.com"
              className="bg-secondary"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
            />
            {emailTouched && emailError && <p className="text-sm text-muted-foreground mt-1">{emailError}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : "Send code to continue"}
          </Button>

          {statusMessage && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-md border border-border/40 bg-muted/40 px-3 py-2 text-sm text-muted-foreground text-center"
            >
              {statusMessage}
            </div>
          )}
        </form>

        <div className="flex items-center gap-3 py-0">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.15)]" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.15)]" />
        </div>

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
      </div>
    </div>
  );
};

export default Auth;
