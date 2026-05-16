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

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, hasActiveReorientation } = useAuth();

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

  const cards = [
    {
      title: "Daily Formation",
      subtitle: "Train your system daily. Build steady patterns over time.",
      icon: AudioLines,
      path: "/daily-formation",
    },
    {
      title: "Reorientation",
      subtitle: "Interrupt the pattern and return to steadiness.",
      icon: Compass,
      path: "/activated",
    },
    {
      title: "Anchor Library",
      subtitle: "Reinforce what anchors you with repetition.",
      icon: LibraryBig,
      path: "/anchors",
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
        {cards.map((card) => (
          <Card key={card.path} className="hover:border-primary/40" onClick={() => navigate(card.path)}>
            <CardHeader className="flex-row items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <card.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription className="text-text-supporting text-sm">{card.subtitle}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}

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
    </div>
  );
};

export default Index;
