import { useEffect } from "react";
import { useWakeLockContext } from "@/lib/wake-lock-context";

/**
 * Mount inside a route to automatically request a screen wake lock while
 * the user is on that screen. Released on unmount. No UI.
 */
const AutoWakeLock = () => {
  const { enable, disable } = useWakeLockContext();

  useEffect(() => {
    enable();
    return () => disable();
  }, [enable, disable]);

  return null;
};

export default AutoWakeLock;
