import { useEffect } from "react";
import { useWakeLockContext } from "@/lib/wake-lock-context";

/**
 * Hook variant: call inside a page component to auto-acquire the screen
 * wake lock while the page is mounted, and release on unmount.
 */
export function useAutoWakeLock() {
  const { enable, disable } = useWakeLockContext();
  useEffect(() => {
    enable();
    return () => disable();
  }, [enable, disable]);
}
