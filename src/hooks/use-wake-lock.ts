import { useState, useEffect, useCallback, useRef } from "react";

export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const enabledRef = useRef(false);
  const isSupported = typeof navigator !== "undefined" && "wakeLock" in navigator;

  const enable = useCallback(async () => {
    if (!isSupported) return;
    enabledRef.current = true;
    try {
      const sentinel = await navigator.wakeLock.request("screen");
      sentinelRef.current = sentinel;
      setIsActive(true);
      sentinel.addEventListener("release", () => {
        setIsActive(false);
        sentinelRef.current = null;
      });
    } catch {
      // Fail silently
    }
  }, [isSupported]);

  const disable = useCallback(() => {
    enabledRef.current = false;
    if (sentinelRef.current) {
      sentinelRef.current.release().catch(() => {});
      sentinelRef.current = null;
    }
    setIsActive(false);
  }, []);

  // Reacquire on visibility change
  useEffect(() => {
    if (!isSupported) return;

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && enabledRef.current && !sentinelRef.current) {
        navigator.wakeLock.request("screen").then((sentinel) => {
          sentinelRef.current = sentinel;
          setIsActive(true);
          sentinel.addEventListener("release", () => {
            setIsActive(false);
            sentinelRef.current = null;
          });
        }).catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isSupported]);

  // Release on unmount
  useEffect(() => {
    return () => {
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {});
      }
    };
  }, []);

  return { isActive, isSupported, enable, disable };
}
