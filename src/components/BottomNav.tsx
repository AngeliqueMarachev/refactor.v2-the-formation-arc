import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { House, Compass, AudioLines, LibraryBig } from "lucide-react";
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
  { label: "​Anchors", icon: LibraryBig, path: "/anchors" },
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

  const handleNavigate = (path: string) => {
    if (!hasActiveReorientation) {
      setConfirmOpen(true);
      return;
    }

    navigate(path);
  };

  const handleContinue = () => {
    setConfirmOpen(false);
    if (onUnsavedReorientationContinue) {
      onUnsavedReorientationContinue();
      return;
    }
    navigate("/activated", { replace: true, state: { resetReorientation: true } });
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
            return (
              <button
                key={tab.path}
                onClick={() => handleNavigate(tab.path)}
                className="nav-tab flex flex-col items-center gap-1 text-xs group"
                data-active={active || undefined}
                style={{
                  color: active ? "#DDFF2C" : "rgba(248, 247, 242, 0.45)",
                  transition: "color 180ms ease, transform 180ms ease, opacity 180ms ease",
                }}
              >
                <tab.icon
                  className="h-5 w-5 transition-transform duration-[180ms] ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.04] group-active:scale-95"
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogDescription className="text-text-body leading-relaxed">
            Your reorientation isn’t saved yet. Leaving now will discard your progress. Do you want to continue?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-full border-primary text-primary hover:bg-primary/10">Stay</AlertDialogCancel>
            <AlertDialogAction onClick={handleContinue}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BottomNav;
