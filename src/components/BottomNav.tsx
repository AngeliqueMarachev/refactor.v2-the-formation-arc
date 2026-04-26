import { useLocation, useNavigate } from "react-router-dom";
import { House, Compass, AudioLines, LibraryBig } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKeyboardVisible } from "@/hooks/use-keyboard-visible";

const tabs = [
  { label: "Home", icon: House, path: "/" },
  { label: "Formation", icon: AudioLines, path: "/daily-formation" },
  { label: "Reorient", icon: Compass, path: "/activated" },
  { label: "​Anchors", icon: LibraryBig, path: "/anchors" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const keyboardVisible = useKeyboardVisible();

  if (keyboardVisible) return null;

  return (
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
              onClick={() => navigate(tab.path)}
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
  );
};

export default BottomNav;
