import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

interface ReorientLines {
  line_1: string | null;
  line_2: string | null;
  line_3: string | null;
  line_4: string | null;
  line_5: string | null;
  line_6: string | null;
}

const phases = [
  { title: "LINE IN THE SAND", lineIndex: 0 },
  { title: "EXPOSE THE MECHANISM", lineIndex: 1 },
  { title: "UNTANGLE TIME", lineIndex: 2 },
  { title: "CHOOSE YOUR AGREEMENT", lineIndex: 3 },
  { title: "SHEPHERD YOUR SOUL", lineIndex: 4 },
  { title: "OCCUPY YOUR IDENTITY", lineIndex: 5 },
];

const ReorientationRehearsal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lines, setLines] = useState<ReorientLines | null>(null);
  const [loading, setLoading] = useState(true);
  const [glowingLine, setGlowingLine] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: templates } = await supabase
        .from("reorient_templates")
        .select("line_1, line_2, line_3, line_4, line_5, line_6")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (templates && templates.length > 0) {
        setLines(templates[0]);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-text-supporting">Loading…</div>;
  }

  const hasLines = lines && Object.values(lines).some((v) => v);

  if (!hasLines) {
    navigate("/daily-formation");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <main className="flex flex-1 flex-col px-5 pt-10 pb-12 content-container">
        <h1 className="tracking-tight mb-[20px] mx-0 mt-[20px]">Communicate safety to  your body</h1>
        <h2 className="font-medium uppercase tracking-widest text-primary font-sans mb-2 text-base pt-[22px]">REORIENTATION</h2>
        <p className="text-text-body text-sm mt-4">
          Before the brain can update expectations, it must first register safety.
        </p>
        <p className="text-text-body text-sm mt-3">
          Rehearsing your Reorientation signals stability to the nervous system, allowing the mind to become receptive.
        </p>
        <p className="text-primary text-sm mt-3">A receptive system forms steadier expectations more easily.</p>
        <div className="mb-6" />

        <p className="text-text-supporting text-sm mb-0">Tap each step.</p>
        <p className="text-text-supporting text-sm mb-0">Read it slowly.</p>
        <p className="text-text-supporting text-sm mb-4">Allow the words to settle.</p>

        <div className="space-y-6 mb-12">
          {phases.map((phase) => {
            const line = Object.values(lines!)[phase.lineIndex];
            if (!line) return null;

            const isReturnPhase = phase.lineIndex === 5;

            return (
              <button
                key={phase.lineIndex}
                onClick={() => {
                  setGlowingLine(phase.lineIndex);
                  setTimeout(() => setGlowingLine((prev) => (prev === phase.lineIndex ? null : prev)), 800);
                }}
                className={`w-full text-left rounded-lg border p-5 transition-all duration-300 ${
                  glowingLine === phase.lineIndex
                    ? isReturnPhase
                      ? "border-primary bg-primary/15 text-text-heading shadow-lg shadow-primary/20"
                      : "border-primary/50 bg-primary/10 text-text-heading shadow-lg shadow-primary/10"
                    : isReturnPhase
                      ? "border-primary/40 bg-primary/8 text-text-heading"
                      : "border-border/50 bg-card/50 text-text-body hover:border-primary/20"
                }`}
              >
                <p className="text-[10px] font-semibold tracking-widest uppercase mb-2 text-primary">{phase.title}</p>
                <p className="text-sm leading-relaxed text-text-heading">{line}</p>
              </button>
            );
          })}
        </div>

        <div className="pt-4 space-y-6">
          <div className="text-center">
            <p className="text-text-body mb-1 font-serif text-xl font-bold">You are ready to continue</p>
            <div className="h-2" />
            <p className="text-text-body mt-3 text-base">You are steady enough to continue.</p>
            <p>Now you will expand your memories and strengthen your expectations of safety.</p>
          </div>
          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => navigate("/daily-formation?screen=create-anchor")}>
              Find a Memory
            </Button>
            <Button className="w-full" size="lg" variant="secondary" onClick={() => navigate("/anchors")}>
              Browse ​Anchors
            </Button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default ReorientationRehearsal;
