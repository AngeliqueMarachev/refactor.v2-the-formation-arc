import { createContext, useContext, ReactNode } from "react";
import { useWakeLock } from "@/hooks/use-wake-lock";

type WakeLockContextValue = ReturnType<typeof useWakeLock>;

const WakeLockContext = createContext<WakeLockContextValue | null>(null);

export const WakeLockProvider = ({ children }: { children: ReactNode }) => {
  const value = useWakeLock();
  return <WakeLockContext.Provider value={value}>{children}</WakeLockContext.Provider>;
};

export const useWakeLockContext = () => {
  const ctx = useContext(WakeLockContext);
  if (!ctx) throw new Error("useWakeLockContext must be used inside WakeLockProvider");
  return ctx;
};
