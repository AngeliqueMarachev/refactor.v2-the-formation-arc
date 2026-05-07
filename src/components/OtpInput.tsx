import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  length?: number;
  error?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

const OtpInput = ({
  value,
  onChange,
  onComplete,
  length = 6,
  error = false,
  autoFocus = false,
  disabled = false,
}: OtpInputProps) => {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => refs.current[0]?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const setDigit = (idx: number, digit: string) => {
    const arr = value.padEnd(length, " ").split("");
    arr[idx] = digit || " ";
    const next = arr.join("").replace(/\s+$/g, "").replace(/\s/g, "");
    onChange(next);
    if (next.length === length && onComplete) onComplete(next);
  };

  const handleChange = (idx: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    if (digits.length > 1) {
      // multi-char (e.g. autofill) — fill from this slot onward
      const arr = value.split("");
      let i = idx;
      for (const d of digits.split("")) {
        if (i >= length) break;
        arr[i] = d;
        i++;
      }
      const next = arr.join("").slice(0, length);
      onChange(next);
      const focusIdx = Math.min(i, length - 1);
      refs.current[focusIdx]?.focus();
      if (next.length === length && onComplete) onComplete(next);
      return;
    }
    setDigit(idx, digits);
    if (idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[idx]) {
        setDigit(idx, "");
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
        setDigit(idx - 1, "");
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      e.preventDefault();
      refs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    refs.current[focusIdx]?.focus();
    if (pasted.length === length && onComplete) onComplete(pasted);
  };

  return (
    <div className={cn("flex justify-center gap-2 sm:gap-3", disabled && "opacity-50 pointer-events-none")}>
      {Array.from({ length }).map((_, i) => {
        const filled = !!value[i];
        return (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete="one-time-code"
            aria-label={`Digit ${i + 1}`}
            value={value[i] ?? ""}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => {
              e.currentTarget.select();
              e.currentTarget.style.borderColor = "rgba(168, 192, 168, 0.6)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error
                ? "rgba(168, 192, 168, 0.6)"
                : "rgba(168, 192, 168, 0.35)";
            }}
            className="h-12 w-12 rounded-md text-center text-lg font-medium text-foreground transition-all duration-200 focus:outline-none"
            style={{
              border: `1px solid ${error ? "rgba(168, 192, 168, 0.6)" : "rgba(168, 192, 168, 0.35)"}`,
              backgroundColor: error || filled ? "rgba(12, 70, 81, 0.55)" : "rgba(12, 70, 81, 0.35)",
            }}
          />
        );
      })}
    </div>
  );
};

export default OtpInput;
