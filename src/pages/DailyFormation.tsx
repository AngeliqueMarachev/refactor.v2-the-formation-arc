import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeText, sanitizeTextInput } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import AnchorRecall from "@/components/AnchorRecall";
import { useWakeLock } from "@/hooks/use-wake-lock";
import WakeLockToggle from "@/components/WakeLockToggle";
import { incrementUsageStat } from "@/lib/usage-stats";

type Screen = "daily-rhythm" | "reorientation" | "daily-loop" | "reframing-story" | "create-anchor" | "completion";

interface AnchorEntry {
  id: string;
  scene_text: string;
  anchor_phrase: string;
  session_count: number;
}

const DailyFormation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const screenParam = searchParams.get("screen");

  const [screen, setScreen] = useState<Screen>(
    screenParam === "create-anchor"
      ? "create-anchor"
      : screenParam === "reframing-story"
        ? "reframing-story"
        : "daily-rhythm",
  );

  const [loading, setLoading] = useState(true);

  const [anchors, setAnchors] = useState<AnchorEntry[]>([]);
  const [currentAnchorIndex, setCurrentAnchorIndex] = useState(0);

  const [sceneText, setSceneText] = useState("");
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [meaningConclusion, setMeaningConclusion] = useState("");
  const [widenedMeaning, setWidenedMeaning] = useState("");
  const [anchorPhrase, setAnchorPhrase] = useState("");
  const [anchorTitle, setAnchorTitle] = useState("");
  const [communionAwareness, setCommunionAwareness] = useState("");
  const [whereIsGod, setWhereIsGod] = useState("");
  const [createStep, setCreateStep] = useState(0);
  const [saving, setSaving] = useState(false);
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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [createStep, screen]);

  useEffect(() => {
    return () => {
      wakeLock.disable();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: anchorData } = await supabase
        .from("anchor_entries")
        .select("id, scene_text, anchor_phrase, session_count")
        .eq("user_id", user.id)
        .order("session_count", { ascending: true });

      if (anchorData) setAnchors(anchorData);

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleDailyLoopDone = async () => {
    if (!user || anchors.length === 0) return;

    const anchor = anchors[currentAnchorIndex];

    await supabase
      .from("anchor_entries")
      .update({
        session_count: anchor.session_count + 1,
      })
      .eq("id", anchor.id);

    setScreen("completion");
  };

  const handleSaveAnchor = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase.from("anchor_entries").insert({
      user_id: user.id,
      anchor_title: sanitizeText(anchorTitle, { maxLength: 60 }),
      scene_text: sanitizeText(sceneText, { maxLength: 5000, nullable: false, multiline: true }) || "",
      emotion_tags: emotionTags,
      meaning_conclusion: sanitizeText(meaningConclusion, { maxLength: 2000, multiline: true }),
      widened_meaning: sanitizeText(widenedMeaning, { maxLength: 2000, multiline: true }),
      anchor_phrase: sanitizeText(anchorPhrase, { maxLength: 500, nullable: false }) || "",
      communion_awareness: communionAwareness ? Math.min(Math.max(parseInt(communionAwareness) || 0, 0), 10) : null,
      where_is_god: sanitizeText(whereIsGod, { maxLength: 2000, multiline: true }),
    });

    if (error) {
      console.error("Failed to save anchor", error);
    } else {
      await incrementUsageStat("anchors_created", user.id);
    }

    setSaving(false);

    setScreen("completion");
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading…</div>;
  }

  // DAILY RHYTHM INTRO
  if (screen === "daily-rhythm") {
    const rhythmSteps = [
      {
        title: "PRAY",
        body: "Begin with gratitude and release.",
      },
      {
        title: "REORIENT",
        body: "Return to what is true.",
      },
      {
        title: "ANCHOR MEMORY",
        body: "Strengthen a memory of safety.",
      },
    ];

    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-8 content-container">
          <h1 className="tracking-tight mb-4 mx-0 mt-[20px] pt-0 pb-[8px]">Daily Formation</h1>

          <div className="space-y-4 text-base leading-relaxed text-text-body sm:text-lg mb-12">
            <p className="text-secondary-foreground">This is your daily practice.</p>

            <p>It builds patterns of safety through repetition.</p>
          </div>

          <p className="text-secondary-foreground leading-relaxed mb-10">It follows a simple rhythm:</p>

          <div className="relative">
            {rhythmSteps.map((step, index) => (
              <div key={step.title} className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                  <div className="w-px flex-1 bg-border/40 my-1" />
                </div>
                <div className={index < rhythmSteps.length - 1 ? "pb-10 flex-1" : "flex-1"}>
                  <h2 className="font-medium uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                    {step.title}
                  </h2>
                  <p className="text-text-body leading-relaxed mt-2">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <div className="bottom-cta-flow px-5 pt-2 content-container">
          <Button className="w-full" size="lg" onClick={() => setScreen("reorientation")}>
            Start daily formation
          </Button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // REORIENTATION ENTRY
  if (screen === "reorientation") {
    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-8 content-container">
          <h1 className="tracking-tight mb-[20px] mx-0 mt-[20px]">Begin with stability</h1>

          <div className="space-y-4 leading-relaxed">
            <WakeLockToggle
              enabled={wakeLockToggle}
              onToggle={handleWakeLockToggle}
              isSupported={wakeLock.isSupported}
              className="mt-4 pt-[15px] pb-[28px]"
            />
            <h2 className="font-medium uppercase tracking-widest text-primary font-sans mb-2 text-base">PRAY</h2>
            <p className="text-text-body text-secondary-foreground">Pause for a moment.</p>

            <p className="text-secondary-foreground">
              You do not need the right words.
              <br />
              You do not need the right feeling.
            </p>
            <p className="font-normal text-secondary-foreground">
              Lift up a prayer of gratitude to God as you place this moment in His hands.
            </p>
          </div>
        </main>

        <div className="bottom-cta-flow px-5 pt-2 content-container">
          <Button className="w-full" size="lg" onClick={() => navigate("/reorientation-rehearsal")}>
            I've given this to God
          </Button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // DAILY LOOP
  if (screen === "daily-loop") {
    const anchor = anchors[currentAnchorIndex];

    if (!anchor) {
      setScreen("create-anchor");
      return null;
    }

    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-8 content-container">
          <h1 className="tracking-tight mb-8 mt-[20px]">Daily Anchor Loop</h1>

          <div className="rounded-lg border p-5 mb-6">
            <p className="text-xs uppercase mb-2">Scene</p>

            <p className="mb-4">{anchor.scene_text}</p>

            <p className="text-xs uppercase mb-2">Anchor Phrase</p>

            <p className="font-medium">{anchor.anchor_phrase}</p>
          </div>

          <p className="mb-10">
            Recall the scene for 10–20 seconds.
            <br />
            Then say the Anchor Phrase once.
          </p>
        </main>

        <div className="bottom-cta-flow px-5 pt-2 content-container">
          <Button className="w-full" size="lg" onClick={handleDailyLoopDone}>
            Done
          </Button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // REFRAMING STORY INTRO
  if (screen === "reframing-story") {
    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-8 content-container">
          <h1 className="tracking-tight mb-[20px] mx-0 mt-[20px]">Create new associations</h1>

          <div className="space-y-5 text-base leading-relaxed text-text-body sm:text-lg pb-8">
            <p>Remembrance is a divine principle.</p>
            <p>
              When you bring a memory into awareness, which is grounded in Truth, you are not just remembering what
              happened. You are expanding its meaning.
            </p>
            <p>New associations form when an old memory is paired with a new sense of safety.</p>
            <p>Finding a memory may not feel easy at first.</p>
            <p>When your system has been under strain, access to memory can narrow.</p>
            <p className="text-primary">With practice, however, access widens.</p>
            <p>Take your time.</p>
            <p>You don’t need the perfect memory.</p>
          </div>
        </main>

        <div className="bottom-cta-flow px-5 pt-2 content-container">
          <Button className="w-full" size="lg" onClick={() => setScreen("create-anchor")}>
            Continue
          </Button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // CREATE ANCHOR
  if (screen === "create-anchor") {
    const totalSteps = 2;

    if (createStep === 0) {
      return (
        <>
          <AnchorRecall
            anchorTitle={anchorTitle}
            onAnchorTitleChange={(value) => setAnchorTitle(sanitizeTextInput(value, { maxLength: 60 }))}
            sceneText={sceneText}
            onSceneTextChange={(value) => setSceneText(sanitizeTextInput(value, { maxLength: 5000, multiline: true }))}
            emotionTags={emotionTags}
            onEmotionTagsChange={setEmotionTags}
            onContinue={() => setCreateStep(1)}
            totalSteps={totalSteps}
          />

          <BottomNav />
        </>
      );
    }

    const canProceed = () => {
      if (createStep === 1) {
        return (
          meaningConclusion.trim().length > 0 && widenedMeaning.trim().length > 0 && anchorPhrase.trim().length > 0
        );
      }

      return true;
    };

    const handleNext = () => {
      if (createStep < totalSteps - 1) {
        setCreateStep(createStep + 1);
      } else {
        handleSaveAnchor();
      }
    };

    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <header className="px-5 pt-8 pb-2 content-container">
          <p className="text-xs text-text-supporting mb-2">
            Step {createStep + 1} of {totalSteps}
          </p>
          <Progress value={((createStep + 1) / totalSteps) * 100} className="h-1.5 mb-6" />
        </header>

        <main className="flex-1 px-5 pt-2 content-container">
          {/* Step 1: Meaning */}
          {createStep === 1 && (
            <div className="space-y-4">
              <h1 className="tracking-tight">Expand the meaning</h1>
              <p className="text-supporting leading-relaxed">Let the meaning of this moment gently unfold.</p>

              {/* Vertical pathway container */}
              <div className="relative">
                {/* Section 1: EXPANSION */}
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="pb-8 flex-1">
                    <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      EXPANSION
                    </h2>
                    <p className="text-supporting leading-relaxed mt-2">
                      Allow yourself to see this moment from a bird's eye view. Let your awareness expand to hear what
                      love wants to tell you.
                    </p>
                    <Textarea
                      placeholder="e.g. Creation celebrates me."
                      value={meaningConclusion}
                      onChange={(e) =>
                        setMeaningConclusion(sanitizeTextInput(e.target.value, { maxLength: 2000, multiline: true }))
                      }
                      maxLength={2000}
                      className="min-h-[80px] text-muted-foreground mt-2"
                    />
                  </div>
                </div>

                {/* Section 2: PRESENCE */}
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="pb-8 flex-1">
                    <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      PRESENCE
                    </h2>
                    <p className="text-supporting leading-relaxed mt-2">
                      Let yourself experience this moment with God present.
                      <br />
                      Notice what changes as you feel seen and connected.
                    </p>
                    <Textarea
                      placeholder="e.g. I am of great value to God."
                      value={widenedMeaning}
                      onChange={(e) =>
                        setWidenedMeaning(sanitizeTextInput(e.target.value, { maxLength: 2000, multiline: true }))
                      }
                      maxLength={2000}
                      className="min-h-[80px] mt-2"
                    />
                  </div>
                </div>

                {/* Section 3: NEARNESS */}
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="pb-8 flex-1">
                    <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      AWARENESS
                    </h2>
                    <p className="text-supporting leading-relaxed mt-2">Notice how present God feels in this moment.</p>
                    <div className="mt-2">
                      <div className="relative flex items-center justify-between px-1 sm:px-4 w-full">
                        {/* Background connector line — spans center of first circle to center of last */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 left-[calc(0.25rem+12px)] right-[calc(0.25rem+12px)] sm:left-[calc(1rem+16px)] sm:right-[calc(1rem+16px)]"
                          style={{
                            height: "2px",
                            backgroundColor: "rgba(248,247,242,0.25)",
                          }}
                        />
                        {/* Active connector line */}
                        {communionAwareness && Number(communionAwareness) >= 1 && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 left-[calc(0.25rem+12px)] sm:left-[calc(1rem+16px)]"
                            style={{
                              height: "2px",
                              backgroundColor: "hsl(var(--primary) / 0.9)",
                              width: `calc((100% - 0.5rem - 24px) * ${(Number(communionAwareness) - 1) / 9})`,
                            }}
                          />
                        )}
                        {Array.from({ length: 10 }, (_, i) => {
                          const value = i + 1;
                          const isFilled = communionAwareness !== "" && value <= Number(communionAwareness);
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setCommunionAwareness(String(value))}
                              className="relative z-10 flex items-center justify-center w-6 h-10 sm:w-8 sm:h-8"
                            >
                              <span
                                className={`block rounded-full transition-all duration-200 ${
                                  isFilled ? "bg-primary border-2 border-primary" : "bg-background border-2"
                                }`}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  ...(!isFilled ? { borderColor: "rgba(248,247,242,0.45)" } : {}),
                                }}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex justify-between px-1 sm:px-4 mt-2">
                        <span className="text-xs sm:text-sm text-text-supporting">Distant</span>
                        <span className="text-xs sm:text-sm text-text-supporting">Deeply present</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: INTEGRATION */}
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/35 my-1" />
                  </div>
                  <div className="pb-8 flex-1">
                    <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      INTEGRATION
                    </h2>
                    {emotionTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {emotionTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border/40 px-2.5 py-1 text-xs text-text-supporting"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-supporting leading-relaxed mt-2">Stay with the feeling this moment carries.</p>
                    <p className="text-supporting leading-relaxed mt-2">
                      With your eyes closed, imagine this experience as a substance, a color, or a gentle current.
                    </p>
                    <p className="text-supporting leading-relaxed mt-2">
                      Let it to move slowly through you, from your head, through your chest, into your body, reaching
                      every part of you.
                    </p>
                  </div>
                </div>

                {/* Section 5: ANCHOR */}
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      ANCHOR PHRASE
                    </h2>
                    <p className="text-supporting leading-relaxed mt-2">
                      Create a phrase to anchor the memory for easy retrieval later.
                    </p>
                    <div className="mt-4 space-y-2">
                      <Textarea
                        placeholder="e.g. The world is full of joy."
                        value={anchorPhrase}
                        onChange={(e) => setAnchorPhrase(sanitizeTextInput(e.target.value, { maxLength: 500 }))}
                        maxLength={500}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-8" />
            </div>
          )}
        </main>

        <div className="bottom-cta-flow px-5 pt-2 space-y-2 content-container">
          <Button className="w-full" size="lg" variant="secondary" onClick={() => setCreateStep(createStep - 1)}>
            Back
          </Button>
          <Button className="w-full" size="lg" disabled={!canProceed() || saving} onClick={handleNext}>
            {saving ? "Saving…" : createStep === 1 ? "Save anchor" : "Continue"}
          </Button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // COMPLETION
  if (screen === "completion") {
    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-8 content-container">
          <h1 className="tracking-tight mb-4 mx-0 mt-[20px] pt-0 pb-[8px]">You strengthened a new pattern</h1>

          <p className="text-secondary-foreground leading-relaxed mb-10">
            Old patterns were interrupted. New ones were reinforced. This is how steadiness is built.
          </p>
          <p className="text-primary mb-6">This is how your system changes.</p>
          <p className="text-secondary-foreground leading-relaxed mb-10">Focus. Association. Repetition.</p>
        </main>

        <div className="bottom-cta-flow px-5 pt-2 space-y-3 content-container">
          <Button
            className="w-full"
            size="lg"
            variant="secondary"
            onClick={() => {
              wakeLock.disable();
              navigate("/knowledge");
            }}
          >
            Learn why this works
          </Button>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              wakeLock.disable();
              navigate("/");
            }}
          >
            Return to today
          </Button>
        </div>

        <BottomNav />
      </div>
    );
  }

  return null;
};

export default DailyFormation;
