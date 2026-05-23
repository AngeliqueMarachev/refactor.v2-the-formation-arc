import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { LibraryBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomNav from "@/components/BottomNav";
import { formatDistanceToNow } from "date-fns";
import { incrementUsageStat } from "@/lib/usage-stats";

interface AnchorEntry {
  id: string;
  anchor_title: string | null;
  scene_text: string;
  emotion_tags: string[] | null;
  meaning_conclusion: string | null;
  widened_meaning: string | null;
  anchor_phrase: string;
  communion_awareness: number | null;
  where_is_god: string | null;
  session_count: number;
  created_at: string;
}

type View = "intro" | "list" | "detail" | "recall-prompt";

const Anchors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchors, setAnchors] = useState<AnchorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("intro");
  const [selected, setSelected] = useState<AnchorEntry | null>(null);
  const [sceneExpanded, setSceneExpanded] = useState(false);
  useEffect(() => {
    if (!user) return;
    supabase
      .from("anchor_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setAnchors((data as AnchorEntry[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const handleRecallDone = async () => {
    if (!selected || !user) return;
    const { error: updateError } = await supabase
      .from("anchor_entries")
      .update({ session_count: selected.session_count + 1 })
      .eq("id", selected.id);
    if (updateError) {
      console.error("Failed to update anchor recall session count", updateError);
    }
    await incrementUsageStat("anchor_recall_count", user.id);
    
    navigate("/");
  };

  // ── Recall Prompt ──
  if (view === "recall-prompt" && selected) {
    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center content-container">
          <div>
            <p className="text-supporting leading-relaxed max-w-xs">Take 10–20 seconds to return to this moment.</p>
            <p className="text-supporting leading-relaxed max-w-xs">Let your body recognize it again.</p>
          </div>
          {selected.emotion_tags && selected.emotion_tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-xs">
              {selected.emotion_tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/40 px-2.5 py-1 text-xs text-text-supporting"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="font-serif text-lg italic text-text-heading max-w-sm mt-8">"{selected.anchor_phrase}"</p>
          <p className="text-sm text-text-supporting mt-4">Each return strengthens this pattern.</p>
          <p className="text-sm text-text-supporting mt-4">Steadiness is becoming more familiar.</p>
          <Button onClick={handleRecallDone} className="w-full max-w-xs mt-7">
            Return to today
          </Button>
        </main>
        <BottomNav />
      </div>
    );
  }

  // ── Detail View ──
  if (view === "detail" && selected) {
    const maxChars = 260;
    const canTruncate = selected.scene_text.length > maxChars;

    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <header className="px-5 pt-8 pb-2 content-container">
          <button
            onClick={() => {
              setView("list");
              setSelected(null);
              setSceneExpanded(false);
            }}
            className="text-sm text-text-supporting mb-4 hover:text-text-heading transition-colors"
          >
            ← Back
          </button>
        </header>

        <ScrollArea className="flex-1 px-5">
          <div className="pb-8 content-container">
            {/* Title */}
            <h1 className="tracking-tight font-serif text-primary">{selected.anchor_title || "Anchor"}</h1>

            {/* Scene Snapshot */}
            <div className="mt-4">
              <h2 className="text-xs font-medium uppercase tracking-widest text-primary font-sans mb-2">MEMORY</h2>
              <div className="relative">
                <div
                  className="overflow-hidden transition-all duration-200 ease-out"
                  style={
                    !sceneExpanded && canTruncate
                      ? {
                          maxHeight: "6.5em",
                          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                        }
                      : {}
                  }
                >
                  <p className="text-sm leading-relaxed text-text-heading whitespace-pre-line">{selected.scene_text}</p>
                </div>
              </div>
              {canTruncate && (
                <button
                  onClick={() => setSceneExpanded(!sceneExpanded)}
                  className="text-sm text-text-supporting mt-1 hover:text-text-heading transition-colors"
                >
                  {sceneExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            {/* Widened Meaning */}
            {selected.widened_meaning && (
              <div className="mt-5">
                <h2 className="text-xs font-medium uppercase tracking-widest text-primary font-sans mb-2">
                  Widened Meaning
                </h2>
                <p className="text-sm leading-relaxed text-text-heading">{selected.widened_meaning}</p>
              </div>
            )}

            {/* Emotion Tags */}
            {selected.emotion_tags && selected.emotion_tags.length > 0 && (
              <div className="mt-5">
                <h2 className="text-xs font-medium uppercase tracking-widest text-primary font-sans mb-2">
                  What it felt like
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selected.emotion_tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/40 px-2.5 py-1 text-xs text-text-supporting"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Anchor Phrase */}
            <div className="mt-5">
              <h2 className="text-xs font-medium uppercase tracking-widest text-primary font-sans mb-2">
                Anchor Phrase
              </h2>
              <p className="font-serif text-lg italic text-text-heading">"{selected.anchor_phrase}"</p>
            </div>
          </div>
        </ScrollArea>

        <div className="bottom-cta-flow px-5 pt-2 content-container">
          <Button
            onClick={() => {
              
              setView("recall-prompt");
            }}
            className="w-full"
          >
            Recall this anchor
          </Button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // ── Intro View ──
  const isEmpty = !loading && anchors.length === 0;

  if (view === "intro") {
    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <ScrollArea className="flex-1 px-5">
          <div className="pt-8 pb-8 content-container">
            <h1 className="tracking-tight font-serif">Strengthen your anchors</h1>
            <div className="h-6" aria-hidden="true" />
            <section>
              <div className="h-5" aria-hidden="true" />

              <div>
                <p className="text-text-body leading-relaxed">
                  An anchor phrase helps your nervous system remember the true meaning of moments in your life.
                </p>
                <p>When you apply your anchor phrase, the new association reminds your system of safety.</p>
                <div className="h-4" aria-hidden="true" />
                <p className="text-text-body leading-relaxed">
                  You can use your anchor phrase whenever you need to. Here are three specific uses:
                </p>
              </div>

              <div className="h-8" aria-hidden="true" />

              <div className="relative">
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="pb-8 flex-1">
                    <h3 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      AS A DAILY RHYTHM
                    </h3>
                    <p className="text-text-body leading-relaxed mt-2">
                      Attach it to one daily moment that already happens, for example:
                    </p>
                    <div className="text-text-body text-medium space-y-1 pl-1 mt-2">
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Before you drink your morning coffee</li>
                        <li>When you finish work for the day</li>
                        <li>After you get into bed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="pb-8 flex-1">
                    <h3 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      IN MOMENTS OF TENSION
                    </h3>
                    <p className="text-text-body leading-relaxed mt-2">
                      Use your phrase when your system begins to tighten, for example when you experience:
                    </p>
                    <div className="text-text-body text-medium space-y-1 pl-1 mt-2">
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Stress</li>
                        <li>Shame</li>
                        <li>Fear</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      WHEN OLD PATTERNS RESURFACE
                    </h3>
                    <p className="text-text-body leading-relaxed mt-2">
                      Use your phrase when familiar internal narratives begin to surface, for example when you find
                      yourself thinking:
                    </p>
                    <div className="text-text-body text-medium space-y-1 pl-1 mt-2">
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>I am alone</li>
                        <li>I am not good enough</li>
                        <li>This will end badly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-8" aria-hidden="true" />

              <div className="rounded-2xl p-6 border border-solid bg-muted border-secondary">
                <p className="text-muted-foreground font-semibold text-base mb-5">IN THAT MOMENT</p>
                <div className="text-text-body space-y-4" style={{ lineHeight: "1.7" }}>
                  <p className="font-medium">Pause.</p>
                  <p>Recall the memory.</p>
                  <p>Say your phrase once.</p>
                </div>
                <div className="h-8" aria-hidden="true" />
                <p className="text-text-body leading-relaxed">A wider meaning sits inside a narrow moment.</p>
              </div>

              <div className="h-8" aria-hidden="true" />

              <p className="text-text-heading font-medium leading-relaxed">
                Over time, your system learns to expect steadiness.
              </p>
            </section>
            <div className="h-8" aria-hidden="true" />
            <Button className="w-full" onClick={() => setView("list")}>
              Choose your anchor
            </Button>
          </div>
        </ScrollArea>
        <BottomNav />
      </div>
    );
  }

  // ── List View ──

  return (
    <div className="screen-with-bottom-nav flex min-h-screen flex-col">
      <header className="px-5 pt-8 pb-8 content-container">
        <h1 className="tracking-tight font-serif">Return to your anchors</h1>
        {!isEmpty && (
          <>
            <p className="text-supporting mt-4 text-primary">Return to what steadies you.</p>
            <p className="text-supporting mt-4">Select an anchor to access the moment.</p>
          </>
        )}
      </header>

      {isEmpty ? (
        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center space-y-4 content-container">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/60">
            <LibraryBig className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-semibold">Your anchor library is empty</h2>
          <p className="max-w-xs text-supporting">Anchors are created during daily formation.</p>
          <p className="max-w-xs text-supporting">They help your system return to steadiness.</p>
          <p className="max-w-xs text-supporting">Create your first anchor.</p>

          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate("/daily-formation")}
          >
            Create an anchor
          </Button>
        </main>
      ) : (
        <ScrollArea className="flex-1 px-5">
          <div className="space-y-8 pt-2 pb-8 content-container">
            {anchors.map((anchor) => (
              <Card
                key={anchor.id}
                className="hover:border-primary/40"
                onClick={() => {
                  setSelected(anchor);
                  setView("detail");
                }}
              >
                <CardContent className="p-5 space-y-6">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-text-supporting/70 mb-1.5">
                      Memory
                    </p>
                    <p className="text-base leading-relaxed text-primary">
                      {anchor.anchor_title ||
                        (anchor.scene_text.length > 120 ? anchor.scene_text.slice(0, 120) + "…" : anchor.scene_text)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-text-supporting/70 mb-1.5">
                      Anchor phrase
                    </p>
                    <p className="font-serif text-base italic text-text-body">"{anchor.anchor_phrase}"</p>
                  </div>
                  <p className="text-xs text-text-supporting">
                    Created {formatDistanceToNow(new Date(anchor.created_at), { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            ))}
            <div className="mt-7">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
                onClick={() => navigate("/daily-formation")}
              >
                Build a new anchor
              </Button>
            </div>
          </div>
        </ScrollArea>
      )}

      <BottomNav />
    </div>
  );
};

export default Anchors;
