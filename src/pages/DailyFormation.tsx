import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeText } from "@/lib/sanitize";
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
        body: "We give thanks to God for His kindness and release the outcomes of this process into His hands.",
      },
      {
        title: "REORIENT",
        body: "We communicate safety to the nervous system by reorienting to Truth.",
      },
      {
        title: "ANCHOR MEMORY",
        body: "We strengthen a memory that expands expectations of safety and draws us into communion.",
      },
    ];

    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-8 content-container">
          <h1 className="tracking-tight mb-4 mx-0 mt-[20px] pt-0 pb-[8px]">The science behind daily formation</h1>

          <div className="space-y-4 text-base leading-relaxed text-text-body sm:text-lg mb-12">
            <p className="text-secondary-foreground">
              Every time you have a feeling, good or bad, a chemical is released into your system. This creates an
              emotional signature, a measurable frequency, that changes the body over time.
            </p>

            <p>
              Cortisol, adrenaline, and norepinephrine (CAN chemistry) are the stress hormones released into the body
              when we experience disorder.
            </p>
            <p>
              They create low frequency emotional signatures, which deplete our resources, often leading to a weakened
              immune system and eventually, chronic symptoms.
            </p>
            <p>
              Dopamine, oxytocin, serotonin, and endorphins (DOSE chemistry) are the feel-good hormones released into
              the body when we experience alignment.
            </p>
            <p>
              They create high frequency emotional signatures, which support and heal the body, and help us feel safe.
            </p>
            <p className="text-primary">
              Daily formation provides the nervous system with new, positive information, producing life-giving DOSE
              chemistry to counteract the effects of CAN chemistry stored in the body.
            </p>
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
            Begin Daily Formation
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
        <main className="flex flex-1 flex-col px-5 pt-10 pb-12 content-container">
          <h1 className="tracking-tight mb-[20px] mx-0 mt-[20px]">Daily formation begins with stability</h1>

          <div className="space-y-4 leading-relaxed mb-10">
            <WakeLockToggle
              enabled={wakeLockToggle}
              onToggle={handleWakeLockToggle}
              isSupported={wakeLock.isSupported}
              className="mt-4 pt-[15px] pb-[28px]"
            />

            <h2 className="font-medium uppercase tracking-widest text-primary font-sans mb-2 text-base">PRAY</h2>
            <p className="text-text-body text-base">
              Your body responds to signals of safety before conscious thoughts fully form.
            </p>

            <p className="text-secondary-foreground">
              Much of what shapes fear or peace happens below conscious awareness, in systems designed to protect you.
            </p>

            <p className="text-primary">
              The nervous system responds strongly to signals of safety, connection and support.
            </p>

            <p className="text-primary font-normal">Prayer communicates support to your system.</p>

            <p>It signals that you are not alone in this moment.</p>

            <p>When the system senses support, internal pressure decreases.</p>
            <p>
              Reduced pressure allows the system to soften.
              <br />A softened system becomes more receptive to change.
            </p>

            <p>
              You do not need the right words.
              <br />
              You do not need the right feeling.
            </p>

            <p className="text-primary font-normal">
              Pause, give thanks, and entrust God with the outcomes of this moment.
            </p>

            <div className="pt-6">
              <Button className="w-full" size="lg" onClick={() => navigate("/reorientation-rehearsal")}>
                I've given this to God
              </Button>
            </div>
          </div>
        </main>

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
        <main className="flex flex-1 flex-col justify-center px-5 py-12 content-container">
          <h1 className="tracking-tight mb-8">Daily Anchor Loop</h1>

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

          <Button className="w-full" size="lg" onClick={handleDailyLoopDone}>
            Done
          </Button>
        </main>

        <BottomNav />
      </div>
    );
  }

  // REFRAMING STORY INTRO
  if (screen === "reframing-story") {
    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-8 content-container">
          <h1 className="tracking-tight mb-[20px] mx-0 mt-[20px]">Reframing your story</h1>

          <div className="space-y-5 text-base leading-relaxed text-text-body sm:text-lg pb-8">
            <p>
              Your brain stores experiences as networks of meaning, making memory vital for setting and maintaining
              expectations.
            </p>

            <p>Remembrance is a divine principle Jesus taught us.</p>
            <p>
              Recalling a positive memory in your life is a powerful way to recall God’s faithfulness into remembrance,
              and enter into communion with Him.
            </p>

            <p>
              When a memory is recalled, the neural network connected to it becomes open to new association, responding
              in real time. As positive meaning expands, the brain registers safety and connection, producing DOSE
              chemistry.
            </p>

            <p>
              Repeated exposure to these signals retrains the nervous system to update expectations as we begin to
              surrender to God’s will for us.
            </p>

            <p className="text-primary">
              We begin to embody joy, health and grace with greater ease, until eventually, we are separated from
              trauma, disconnected from old patterns, and established on Truth.
            </p>

            <p>
              It’s important to know that when the nervous system has been under strain, creativity is obscured and
              access to memory can narrow.
            </p>
            <p>With practice, however, access widens.</p>
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
    const totalSteps = 4;

    if (createStep === 0) {
      return (
        <>
          <AnchorRecall
            anchorTitle={anchorTitle}
            onAnchorTitleChange={setAnchorTitle}
            sceneText={sceneText}
            onSceneTextChange={setSceneText}
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
        return meaningConclusion.trim().length > 0 && widenedMeaning.trim().length > 0;
      }

      if (createStep === 2) {
        return anchorPhrase.trim().length > 0;
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
              <h1 className="tracking-tight">Expand your conclusion</h1>
              <p className="text-supporting leading-relaxed">
                Let the meaning of this moment gently unfold.
                <br />
                Sometimes a memory holds more than we first noticed.
                <br />
                Allow new understanding to emerge naturally.
              </p>

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
                      You may notice new meaning emerging as you stay with the memory.
                    </p>
                    <p className="text-supporting leading-relaxed mt-2">
                      What else becomes visible as you remain in this scene?
                      <br />
                      Is there something about this moment, or about yourself, that feels clearer now?
                    </p>
                    <Textarea
                      placeholder="e.g. Creation celebrates me. "
                      value={meaningConclusion}
                      onChange={(e) => setMeaningConclusion(e.target.value)}
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
                      If God were present with you in this moment, how might that have felt?
                      <br />
                      What changes when the moment is experienced with support?
                    </p>
                    <Textarea
                      placeholder="e.g. We were full of joy and I saw Jesus thanking God for me!"
                      value={widenedMeaning}
                      onChange={(e) => setWidenedMeaning(e.target.value)}
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
                      NEARNESS
                    </h2>
                    <p className="text-supporting leading-relaxed mt-2">How present did God feel in this moment?</p>
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
                  <div className="flex-1">
                    <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      INTEGRATION
                    </h2>
                    <p className="text-supporting leading-relaxed mt-2">Stay with the feeling this moment carries.</p>
                    <p className="text-supporting leading-relaxed mt-2">
                      Imagine this experience as a warmth, a color, or a gentle current.
                    </p>
                    <p className="text-supporting leading-relaxed mt-2">
                      Allow it to move slowly through you, from your head, through your chest, into your body.
                    </p>
                    <p className="text-supporting leading-relaxed mt-2">
                      Allow your body to recognize this experience.
                    </p>
                    <p className="text-supporting leading-relaxed mt-2">Take one slow breath here.</p>
                  </div>
                </div>
              </div>
              <div className="h-8" />
            </div>
          )}

          {/* Step 2: Anchor Phrase */}
          {createStep === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold tracking-tight text-3xl">Create an Anchor Phrase</h2>
              <div className="space-y-3 leading-relaxed">
                <h2 className="text-sm font-medium uppercase tracking-widest text-primary font-sans mb-2">
                  ANCHOR RECALL
                </h2>
                <p className="text-text-body text-primary">
                  Your brain remembers stories. But it stabilizes around summaries.
                </p>
              </div>
              <p className="font-normal text-primary">
                Your Anchor Phrase updates an old template that no longer serves you.
              </p>
              <p className="text-text-body">It does not erase the memory. It widens the meaning. </p>

              <div className="pt-2 space-y-6">
                <div className="space-y-2 rounded-lg border bg-card p-5 sm:p-6 text-text-body border-primary">
                  <p className="mb-2 font-medium text-text-heading text-primary text-sm">Examples of Anchor Phrases</p>
                  <p className="italic text-muted-foreground text-sm">
                    I thought I was forgotten, but I was not as alone.
                  </p>
                  <p className="italic text-muted-foreground text-sm">Even though I was afraid, I endured.</p>
                  <p className="italic text-muted-foreground text-sm">I felt abandoned, but I was being championed.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-heading text-primary">Write your anchor phrase</label>
                  <Textarea
                    placeholder="e.g. I believed no-one noticed, but God was always with me."
                    value={anchorPhrase}
                    onChange={(e) => setAnchorPhrase(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Use your Anchor Phrase */}
          {createStep === 3 && (
            <div>
              <h2 className="font-semibold tracking-tight text-3xl mb-6">Use your Anchor Phrase</h2>

              <div className="mb-10">
                <p className="text-text-body leading-relaxed mb-4">
                  This phrase helps your nervous system remember what this moment meant.
                </p>
                <p className="text-text-body leading-relaxed">
                  It isn't something you repeat all day. It has three specific uses.
                </p>
              </div>

              {/* Vertical pathway container */}
              <div className="relative mb-10">
                {/* Section 1: DAILY MOMENT */}
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="pb-8 flex-1">
                    <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      DAILY MOMENT
                    </h2>
                    <p className="text-text-body leading-relaxed mt-2">
                      Attach it to one daily moment that already happens, for example:
                    </p>
                    <div className="text-text-body text-medium space-y-1 pl-1 mt-2">
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Before you brush your teeth</li>
                        <li>When you close your laptop</li>
                        <li>After you get into bed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 2: DURING MOMENTS OF CONTRACTION */}
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="pb-8 flex-1">
                    <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      DURING MOMENTS OF CONTRACTION
                    </h2>
                    <p className="text-text-body leading-relaxed mt-2">
                      Use your phrase when your system begins to tighten, for example:
                    </p>
                    <div className="text-text-body text-medium space-y-1 pl-1 mt-2">
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Tension</li>
                        <li>Shame</li>
                        <li>Fear</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 3: OLD THOUGHT PATTERNS */}
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                    <div className="w-px flex-1 bg-border/40 my-1" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                      OLD THOUGHT PATTERNS
                    </h2>
                    <p className="text-text-body leading-relaxed mt-2">
                      Use your phrase when familiar internal narratives begin to surface, for example:
                    </p>
                    <div className="text-text-body text-medium space-y-1 pl-1 mt-2">
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>I am alone</li>
                        <li>I am not enough</li>
                        <li>This will end badly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-2xl p-6 border border-solid bg-muted border-secondary">
                <p className="text-muted-foreground font-semibold text-base mb-5">IN THAT MOMENT</p>
                <div className="text-text-body space-y-4" style={{ lineHeight: "1.7" }}>
                  <p className="font-medium">Pause for 10 seconds.</p>
                  <p>Recall the memory briefly.</p>
                  <p>Say your phrase once.</p>
                </div>
                <div className="mt-8">
                  <p className="text-text-body leading-relaxed">A wider meaning sits inside a narrow moment.</p>
                </div>
              </div>

              <p className="text-text-heading font-medium mt-8 py-0 my-[33px]">
                Over time, the nervous system begins to expect steadiness.
              </p>
            </div>
          )}
        </main>

        <div className="bottom-cta-flow px-5 pt-2 space-y-2 content-container">
          <Button className="w-full" size="lg" variant="secondary" onClick={() => setCreateStep(createStep - 1)}>
            Back
          </Button>
          <Button className="w-full" size="lg" disabled={!canProceed() || saving} onClick={handleNext}>
            {saving ? "Saving…" : createStep === totalSteps - 1 ? "Save Anchor" : "Continue"}
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
        <main className="flex flex-1 flex-col justify-center px-5 py-12 content-container">
          <h1 className="tracking-tight mb-8 text-lg">You strengthened steadiness today</h1>

          <div className="space-y-4 leading-relaxed">
            <p className="text-text-body">Today you:</p>

            <ul className="list-disc pl-5 space-y-1">
              <li>Interrupted automatic threat prediction</li>

              <li>Stabilized a meaningful memory</li>

              <li>Strengthened steadiness</li>
            </ul>

            <p className="text-primary font-medium pt-2">Each return trains your nervous system to expect stability.</p>

            <p>Small returns create lasting formation.</p>
          </div>

          <Button
            className="mt-10 w-full"
            size="lg"
            onClick={() => {
              wakeLock.disable();
              navigate("/");
            }}
          >
            Carry this forward
          </Button>
        </main>

        <BottomNav />
      </div>
    );
  }

  return null;
};

export default DailyFormation;
