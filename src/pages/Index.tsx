import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/formation-arc-logo.png";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Compass, AudioLines, LibraryBig, Lock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { formatDistanceToNow } from "date-fns";
import { ensureUsageStats } from "@/lib/usage-stats";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type LockedModalKey = "daily-formation" | "anchors";

const LOCKED_MODAL_COPY: Record<LockedModalKey, { title: string; body: string[] }> = {
  "daily-formation": {
    title: "​COMPLETE REORIENTATION",
    body: [
      "Reorientation establishes the foundation for the practices that follow.",
      "Daily Formation becomes more effective once your reorientation path is in place.",
    ],
  },
  anchors: {
    title: "YOUR ANCHOR LIBRARY BUILDS OVER TIME",
    body: [
      "Anchors are created during Daily Formation.",
      "Complete your reorientation first to begin building your library.",
    ],
  },
};

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, hasActiveReorientation } = useAuth();
  const [lockedModal, setLockedModal] = useState<LockedModalKey | null>(null);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) {
        console.error("Failed to load profile", error);
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["usage_stats", user?.id],
    queryFn: async () => {
      await ensureUsageStats(user!.id);
      const { data, error } = await supabase.from("usage_stats").select("*").eq("user_id", user!.id).maybeSingle();
      if (error) {
        console.error("Failed to load usage_stats", error);
      }
      return data;
    },
    enabled: !!user,
  });

  const cards: Array<{
    title: string;
    subtitle: string;
    icon: typeof AudioLines;
    path: string;
    lockable: boolean;
    modalKey?: LockedModalKey;
  }> = [
    {
      title: "Daily Formation",
      subtitle: "Train daily to build steady patterns over time.",
      icon: AudioLines,
      path: "/daily-formation",
      lockable: true,
      modalKey: "daily-formation",
    },
    {
      title: "Reorientation",
      subtitle: "Interrupt the pattern to return to steadiness.",
      icon: Compass,
      path: "/activated",
      lockable: false,
    },
    {
      title: "Anchor Library",
      subtitle: "Reinforce what anchors you through repetition.",
      icon: LibraryBig,
      path: "/anchors",
      lockable: true,
      modalKey: "anchors",
    },
  ];

  const reorientations = stats?.reorient_return_count ?? 0;
  const anchorsCreated = stats?.anchors_created ?? 0;
  const recalls = (stats as any)?.anchor_recall_count ?? 0;
  const lastActivityLabel = stats?.last_active_at
    ? formatDistanceToNow(new Date(stats.last_active_at), { addSuffix: true })
    : "—";

  return (
    <div className="screen-with-bottom-nav flex min-h-screen flex-col rounded-lg">
      <header className="relative px-5 pt-6 pb-8 content-container">
        <div className="flex justify-end">
          <button
            onClick={signOut}
            className="text-xs text-text-supporting hover:text-primary/65 transition-colors mr-[-1px]"
          >
            Sign out
          </button>
        </div>
        <div className="flex justify-center mt-2">
          <img
            src={logo}
            alt="The Formation Arc"
            className="h-auto object-contain"
            style={{ width: "min(85vw, 420px)" }}
          />
        </div>
      </header>

      <main className="flex-1 px-5 space-y-6 content-container">
        {cards.map((card) => {
          const locked = card.lockable && !hasActiveReorientation;
          return (
            <Card
              key={card.path}
              className={
                locked ? "border-border/30 cursor-pointer hover:scale-100 active:scale-100" : "hover:border-primary/40"
              }
              style={locked ? { opacity: 0.55 } : undefined}
              onClick={() => {
                if (locked) {
                  if (card.modalKey) setLockedModal(card.modalKey);
                  return;
                }
                navigate(card.path);
              }}
              aria-disabled={locked || undefined}
            >
              <CardHeader className="flex-row items-start gap-5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <card.icon className="h-7 w-7 text-primary" />
                  {locked && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/90 border border-border/50">
                      <Lock className="h-2.5 w-2.5 text-text-supporting" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription className="text-text-supporting text-sm">{card.subtitle}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}

        <div className="pt-3">
          <Card className="border-none">
            <div className="px-5 pt-4 pb-1 text-center">
              <h3
                className="font-medium tracking-tight text-base"
                style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", letterSpacing: "-0.01em" }}
              >
                Progress
              </h3>
            </div>
            <div className="px-5 pb-4 pt-3">
              <div className="flex justify-center gap-6">
                {[
                  { value: String(anchorsCreated), label: "Anchors" },
                  { value: String(reorientations), label: "Reorientations" },
                  { value: String(recalls), label: "Returns" },
                ].map((metric) => (
                  <div key={metric.label} className="flex flex-col items-center gap-1.5">
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 60,
                        height: 60,
                        border: "1px solid rgba(51, 142, 127, 0.45)",
                        background: "rgba(51, 142, 127, 0.08)",
                      }}
                    >
                      <span className="text-xl font-medium tracking-tight text-text-heading">{metric.value}</span>
                    </div>
                    <p className="text-text-supporting text-sm">{metric.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-center mt-3 text-text-supporting text-sm font-semibold">
                Last active: {lastActivityLabel}
              </p>
            </div>
          </Card>
        </div>
      </main>

      <BottomNav />

      <AlertDialog open={lockedModal !== null} onOpenChange={(open) => !open && setLockedModal(null)}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          {lockedModal && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-sans text-base font-semibold tracking-wider">
                  {LOCKED_MODAL_COPY[lockedModal].title}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-text-body leading-relaxed space-y-3">
                  {LOCKED_MODAL_COPY[lockedModal].body.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col gap-3 sm:flex-row sm:space-x-0">
                <AlertDialogAction
                  className="w-full whitespace-nowrap border-transparent bg-primary text-primary-foreground hover:bg-primary/90 sm:order-2 sm:flex-1"
                  onClick={() => {
                    setLockedModal(null);
                    navigate("/activated");
                  }}
                >
                  Begin reorientation
                </AlertDialogAction>
                <AlertDialogCancel
                  className="mt-0 w-full whitespace-nowrap border border-primary bg-transparent text-primary hover:bg-primary/10 sm:order-1 sm:flex-1"
                  onClick={() => setLockedModal(null)}
                >
                  Not now
                </AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
