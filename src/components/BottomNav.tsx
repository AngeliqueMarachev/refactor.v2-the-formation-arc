import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { House, Compass, AudioLines, LibraryBig, BookOpen, Lock } from "lucide-react";
import { useKeyboardVisible } from "@/hooks/use-keyboard-visible";
import { useAuth } from "@/lib/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const tabs = [
  { label: "Home", icon: House, path: "/" },
  { label: "Formation", icon: AudioLines, path: "/daily-formation" },
  { label: "Reorient", icon: Compass, path: "/activated" },
  { label: "Library", icon: LibraryBig, path: "/anchors" },
  { label: "Knowledge", icon: BookOpen, path: "/knowledge" },
];

interface BottomNavProps {
  onUnsavedReorientationContinue?: () => void;
}

const BottomNav = ({ onUnsavedReorientationContinue }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const keyboardVisible = useKeyboardVisible();
  const { hasActiveReorientation } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const lockedTabs = new Set(["/daily-formation", "/anchors"]);
  const isLocked = (path: string) => !hasActiveReorientation && lockedTabs.has(path);

  const handleNavigate = (path: string) => {
    if (!hasActiveReorientation && location.pathname === "/activated" && path !== "/activated") {
      setPendingPath(path);
      setConfirmOpen(true);
      return;
    }
    if (isLocked(path)) return;
    navigate(path);
  };

  const handleContinue = () => {
    const target = pendingPath ?? "/";
    setPendingPath(null);
    setConfirmOpen(false);
    navigate(target, { replace: true });
  };

  const handleOpenChange = (open: boolean) => {
    setConfirmOpen(open);
    if (!open) setPendingPath(null);
  };

  if (keyboardVisible) return null;

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 border-t z-50"
        style={{
          backdropFilter: "blur(14px)",
          background: "rgba(12, 70, 81, 0.6)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex h-16 items-center justify-around">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            const onActivated = location.pathname === "/activated" && !hasActiveReorientation;
            const locked = isLocked(tab.path) && !onActivated;
            return (
              <button
                key={tab.path}
                onClick={() => handleNavigate(tab.path)}
                disabled={locked}
                aria-disabled={locked || undefined}
                className="nav-tab relative flex flex-col items-center gap-1 text-xs group disabled:cursor-not-allowed"
                data-active={active || undefined}
                style={{
                  color: active ? "#DDFF2C" : "rgba(248, 247, 242, 0.45)",
                  opacity: locked ? 0.4 : 1,
                  transition: "color 180ms ease, transform 180ms ease, opacity 180ms ease",
                }}
              >
                <div className="relative">
                  <tab.icon
                    className="h-5 w-5 transition-transform duration-[180ms] ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.04] group-active:scale-95"
                  />
                  {locked && (
                    <Lock className="absolute -right-1.5 -top-1 h-2.5 w-2.5" strokeWidth={2.5} />
                  )}
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogDescription className="text-text-body leading-relaxed">
            Your reorientation isn’t saved yet. Leaving now will discard your progress. How do you want to continue?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-[8.875rem] border-primary text-primary hover:bg-primary/10">Stay</AlertDialogCancel>
            <AlertDialogAction className="w-[8.875rem]" onClick={handleContinue}>Come back later</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BottomNav;
