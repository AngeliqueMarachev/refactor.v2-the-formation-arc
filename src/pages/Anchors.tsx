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
import { useWakeLock } from "@/hooks/use-wake-lock";
import WakeLockToggle from "@/components/WakeLockToggle";

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

type View = "list" | "detail" | "recall-prompt";

const Anchors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchors, setAnchors] = useState<AnchorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<AnchorEntry | null>(null);
  const [sceneExpanded, setSceneExpanded] = useState(false);
  const wakeLock = useWakeLock();
  const [wakeLockToggle, setWakeLockToggle] = useState(true);

  const handleWakeLockToggle = (value: boolean) => {
    setWakeLockToggle(value);
    if (value) {
      wakeLock.enable();
    } else {
      wakeLock.disable();
    }
  };
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
    await supabase
      .from("anchor_entries")
      .update({ session_count: selected.session_count + 1 })
      .eq("id", selected.id);
    await supabase.rpc('increment_stat', { stat_name: 'anchor_recall_count', user_id_input: user.id });
    wakeLock.disable();
    navigate("/");
  };

  // ── Recall Prompt ──
  if (view === "recall-prompt" && selected) {
    return (
      <div className="flex min-h-screen flex-col pb-20">
        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center content-container">
          <WakeLockToggle
            enabled={wakeLockToggle}
            onToggle={handleWakeLockToggle}
            isSupported={wakeLock.isSupported}
            className="mb-8 w-full"
          />
          <div>
            <p className="text-supporting leading-relaxed max-w-xs">Take 10–20 seconds to return to this moment.</p>
            <p className="text-supporting leading-relaxed max-w-xs">Let the feeling become familiar again.</p>
          </div>
          <p className="font-serif text-lg italic text-text-heading max-w-sm mt-8">"{selected.anchor_phrase}"</p>
          <p className="text-sm text-text-supporting mt-4">Each return makes this pathway easier to access.</p>
          <p className="text-sm text-text-supporting mt-4">You are strengthening steadiness.</p>
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
      <div className="flex min-h-screen flex-col pb-20">
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
              <h2 className="text-xs font-medium uppercase tracking-widest text-primary font-sans mb-2">Scene</h2>
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

            {/* Anchor Phrase */}
            <div className="mt-5">
              <h2 className="text-xs font-medium uppercase tracking-widest text-primary font-sans mb-2">
                Anchor Phrase
              </h2>
              <p className="font-serif text-lg italic text-text-heading">"{selected.anchor_phrase}"</p>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Button onClick={() => {
                if (wakeLockToggle) wakeLock.enable();
                setView("recall-prompt");
              }} className="w-full">
                Recall This Anchor
              </Button>
            </div>
          </div>
        </ScrollArea>
        <BottomNav />
      </div>
    );
  }

  // ── List View ──
  const isEmpty = !loading && anchors.length === 0;

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <header className="px-5 pt-8 pb-2 content-container">
        <h1 className="tracking-tight font-serif">Anchor Recall</h1>
        <p className="text-supporting mt-1 text-primary">Return to ​Anchors that help you expect steadiness.</p>
        <p className="text-supporting mt-1">​Anchors deepen with repetition. Tap an anchor to revisit the memory. </p>
        <p className="text-supporting mt-1 text-xs">​</p>
      </header>

      {isEmpty ? (
        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center space-y-4 content-container">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/60">
            <LibraryBig className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-semibold">Create an Anchor</h2>
          <p className="max-w-xs text-supporting">
            ​Anchors are memories and phrases that help your nervous system learn steadiness.
          </p>
          <p className="max-w-xs text-supporting">​Anchors are created during Daily Formation.</p>
          <p className="max-w-xs text-supporting">Your library will grow over time as you create new ​anchors.</p>
          <p className="max-w-xs text-supporting">
            Each time you return to an anchor, the pathway becomes easier to access and safety is reinforced.
          </p>
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate("/daily-formation")}
          >
            Create an Anchor
          </Button>
        </main>
      ) : (
        <ScrollArea className="flex-1 px-5">
          <div className="space-y-4 pt-1 pb-4 content-container">
            {anchors.map((anchor) => (
              <Card
                key={anchor.id}
                className="hover:border-primary/40"
                onClick={() => {
                  setSelected(anchor);
                  setView("detail");
                }}
              >
                <CardContent className="p-5 space-y-3">
                  <p className="text-base leading-relaxed text-primary">
                    {anchor.anchor_title ||
                      (anchor.scene_text.length > 120 ? anchor.scene_text.slice(0, 120) + "…" : anchor.scene_text)}
                  </p>
                  <p className="font-serif text-base italic text-text-body">"{anchor.anchor_phrase}"</p>
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
                onClick={() => navigate("/daily-formation?skip_intro=true")}
              >
                Create new anchor
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
