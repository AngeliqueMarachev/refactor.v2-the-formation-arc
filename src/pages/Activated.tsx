import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeText } from "@/lib/sanitize";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { useWakeLock } from "@/hooks/use-wake-lock";
import WakeLockToggle from "@/components/WakeLockToggle";

const PHASES = [
  {
    title: "Line In The Sand",
    introduction: [
      "Interrupt escalation. Establish internal authority.",
      "Choose a phrase that helps you pause and slow down the spiral.",
    ],
    customLabel: "Write your own interruption",
    options: [
      "Breathe. Be calm.",
      "I speak peace to you, oh my soul.",
      "Be still, of whom shall I be afraid?",
      "Gently now, you're okay.",
    ],
  },
  {
    title: "Expose The Mechanism",
    introduction: [
      "What you feel is real.",
      "This step names what your nervous system is doing behind the reaction.",
      "Choose the explanation that fits best.",
    ],
    customLabel: "Write your own explanation",
    options: [
      "My nervous system has shifted into survival mode.",
      "My brain is running an old trauma prediction loop.",
      "This is a protective pattern, not a present danger.",
      "My mind and body are receiving false messages from my brain.",
    ],
  },
  {
    title: "Untangle Time",
    introduction: [
      "Separate past learning from present reality.",
      "Choose the statement that reminds your system that then is not now.",
    ],
    customLabel: "Write your own statement",
    options: [
      "The season that trained this response is in the past.",
      "I survived that chapter. This is a different moment.",
      "My nervous system is remembering the past, but I am safe now.",
      "In the past, I believed the lies, but now I know I can align with Truth.",
    ],
  },
  {
    title: "Choose Your Agreement",
    introduction: [
      "Fear offers an interpretation of this moment.",
      "Choose the statement that reflects what you agree with.",
    ],
    customLabel: "Write your own statement",
    options: [
      "I choose to align with God instead of fear.",
      "I belong to a Kingdom of peace.",
      "No weapon formed against me shall prosper.",
      "I have a sound mind and not a spirit of fear.",
    ],
  },
  {
    title: "Shepherd Your Soul",
    introduction: [
      "Speak to yourself with steadiness and kindness.",
      "Choose the words that will guide you right now.",
    ],
    customLabel: "Write your own encouragement",
    options: [
      "You're not broken. Your body is protecting you.",
      "You are allowed to need time.",
      "You are learning to stand differently.",
      "Activation does not remove your authority.",
    ],
  },
  {
    title: "Occupy Your Identity",
    introduction: [
      "Your current state does not define who you are.",
      "Choose the identity that aligns with the truth of who God says you are.",
    ],
    customLabel: "Write your true identity",
    options: [
      "I am a chosen people, a royal priesthood, a holy nation, God’s special possession.",
      "I am created in the image of God.",
      "God chose me before the foundations of the world.",
      "My body is a temple of the Holy Spirit who lives in me.",
    ],
  },
];

type Screen = "loading" | "use-script" | "entry" | "phase" | "complete";

const Activated = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: existingScript, isLoading: scriptLoading } = useQuery({
    queryKey: ["reorient_script", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("reorient_templates")
        .select("id, line_1, line_2, line_3, line_4, line_5, line_6")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1);
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!user,
  });

  const [screen, setScreen] = useState<Screen>("loading");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [selections, setSelections] = useState<(string | null)[]>(Array(6).fill(null));
  const [customTexts, setCustomTexts] = useState<string[]>(Array(6).fill(""));
  const [useCustom, setUseCustom] = useState<boolean[]>(Array(6).fill(false));
  const [saving, setSaving] = useState(false);
  const [revealedCount, setRevealedCount] = useState(1);
  const [justRevealed, setJustRevealed] = useState<number | null>(null);
  const [scriptComplete, setScriptComplete] = useState(false);
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
    if (scriptLoading) return;
    if (existingScript) {
      setScreen("use-script");
    } else {
      setScreen("entry");
    }
  }, [scriptLoading, existingScript]);

  const handleSelectOption = (option: string) => {
    const next = [...selections];
    next[phaseIndex] = option;
    setSelections(next);
    const nextCustom = [...useCustom];
    nextCustom[phaseIndex] = false;
    setUseCustom(nextCustom);
  };

  const handleCustomToggle = () => {
    const next = [...useCustom];
    next[phaseIndex] = true;
    setUseCustom(next);
    const nextSel = [...selections];
    nextSel[phaseIndex] = null;
    setSelections(nextSel);
  };

  const handleCustomChange = (val: string) => {
    const next = [...customTexts];
    next[phaseIndex] = val;
    setCustomTexts(next);
  };

  const currentSelection = useCustom[phaseIndex] ? customTexts[phaseIndex] : selections[phaseIndex];

  const canContinue = !!currentSelection && currentSelection.trim().length > 0;

  const handleContinue = () => {
    if (phaseIndex < 5) {
      setPhaseIndex(phaseIndex + 1);
    } else {
      setScreen("complete");
    }
  };

  const prefillFromScript = (script: {
    line_1: string | null;
    line_2: string | null;
    line_3: string | null;
    line_4: string | null;
    line_5: string | null;
    line_6: string | null;
  }) => {
    const lines = [script.line_1, script.line_2, script.line_3, script.line_4, script.line_5, script.line_6];
    const newSelections: (string | null)[] = Array(6).fill(null);
    const newCustomTexts = Array(6).fill("");
    const newUseCustom = Array(6).fill(false);

    lines.forEach((line, i) => {
      if (!line) return;
      const isPreset = PHASES[i].options.includes(line);
      if (isPreset) {
        newSelections[i] = line;
      } else {
        newUseCustom[i] = true;
        newCustomTexts[i] = line;
      }
    });

    setSelections(newSelections);
    setCustomTexts(newCustomTexts);
    setUseCustom(newUseCustom);
  };

  const handleEdit = () => {
    setPhaseIndex(0);
    setScreen("phase");
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const lines: Record<string, string | null> = {};
    for (let i = 0; i < 6; i++) {
      const val = useCustom[i] ? customTexts[i] : selections[i];
      lines[`line_${i + 1}`] = sanitizeText(val, { maxLength: 500 });
    }

    // Upsert: delete old template then insert new one
    await supabase.from("reorient_templates").delete().eq("user_id", user.id);
    await supabase.from("reorient_templates").insert({
      user_id: user.id,
      ...lines,
      updated_at: new Date().toISOString(),
    });

    await supabase.rpc("increment_stat", { stat_name: "reorient_return_count", user_id_input: user.id });

    setSaving(false);
    wakeLock.disable();

    const flowSource = sessionStorage.getItem("flow_source");
    if (flowSource === "daily_formation") {
      navigate("/daily-formation/reorientation-complete");
    } else {
      navigate("/");
    }
  };

  // LOADING
  if (screen === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-text-supporting">Loading…</div>;
  }

  // USE EXISTING SCRIPT
  if (screen === "use-script" && existingScript) {
    const lines = [
      existingScript.line_1,
      existingScript.line_2,
      existingScript.line_3,
      existingScript.line_4,
      existingScript.line_5,
      existingScript.line_6,
    ].filter(Boolean) as string[];

    const handleUseComplete = async () => {
      if (!user) return;
      setSaving(true);
      await supabase.rpc("increment_stat", { stat_name: "reorient_return_count", user_id_input: user.id });

      setSaving(false);
      wakeLock.disable();
      navigate("/");
    };

    const stepLabels = [
      "LINE IN THE SAND",
      "EXPOSE THE MECHANISM",
      "UNTANGLE TIME",
      "CHOOSE YOUR AGREEMENT",
      "SHEPHERD YOUR SOUL",
      "OCCUPY YOUR IDENTITY",
    ];

    return (
      <div className="flex min-h-screen flex-col pb-20">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-12 content-container">
          <h1 className="tracking-tight mb-2">Your Reorientation</h1>

          <WakeLockToggle
            enabled={wakeLockToggle}
            onToggle={handleWakeLockToggle}
            isSupported={wakeLock.isSupported}
            className="mb-6 pb-[20px] pt-[20px]"
          />

          <p className="text-supporting leading-relaxed mb-6">
            Read each line slowly.
            <br /> Let each statement interrupt the fear loop and reorient you to steadiness.
          </p>

          <div className="relative mb-12">
            {lines.map((line, i) => {
              if (i >= revealedCount) return null;
              const isLatest = i === revealedCount - 1;
              const isLastStep = i === lines.length - 1;
              const isTappable = isLatest && !scriptComplete;
              const wasJustRevealed = justRevealed === i;

              return (
                <div
                  key={i}
                  className="relative flex gap-4"
                  style={
                    wasJustRevealed
                      ? {
                          animation: "fade-in 300ms ease-out forwards",
                        }
                      : undefined
                  }
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-500 ${
                        isLatest && !scriptComplete
                          ? "border-primary bg-primary text-primary-foreground"
                          : scriptComplete
                            ? "border-primary/40 bg-primary/20 text-primary/70"
                            : "border-primary/30 bg-primary/10 text-primary/60"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < revealedCount - 1 && <div className="w-px flex-1 bg-border/40 my-1" />}
                    {isLatest && !scriptComplete && !isLastStep && <div className="w-px flex-1 bg-border/20 my-1" />}
                  </div>

                  <button
                    onClick={() => {
                      if (!isTappable) return;
                      if (revealedCount === 1 && wakeLockToggle) {
                        wakeLock.enable();
                      }
                      if (isLastStep) {
                        setScriptComplete(true);
                      } else {
                        setJustRevealed(revealedCount);
                        setRevealedCount((c) => c + 1);
                      }
                    }}
                    disabled={!isTappable}
                    className={`pb-8 flex-1 text-left transition-all duration-500 ${
                      scriptComplete ? "opacity-50" : !isLatest ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-semibold tracking-widest uppercase mb-1 transition-colors duration-300 ${
                        isLatest && !scriptComplete ? "text-primary" : "text-primary/40"
                      }`}
                    >
                      {stepLabels[i] || `Step ${i + 1}`}
                    </p>
                    <div
                      className={`rounded-lg border p-4 text-sm leading-relaxed backdrop-blur-sm transition-all duration-500 ${
                        isLatest && !scriptComplete
                          ? "border-primary/50 bg-primary/10 text-text-heading"
                          : "border-border/30 bg-card/30 text-text-supporting"
                      }`}
                    >
                      {line}
                    </div>
                    {isTappable && (
                      <p className="text-[10px] text-text-supporting mt-2.5 text-center">Tap to continue</p>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {scriptComplete && (
            <div className="space-y-6" style={{ animation: "fade-in 400ms ease-out forwards" }}>
              <div className="text-center py-4 max-w-md mx-auto">
                <p
                  className="font-semibold text-text-heading text-xl font-serif mb-8"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  You interrupted the spiral
                </p>

                {/* Section 1 */}
                <div className="mb-9 space-y-1.5">
                  <p className="text-text-body text-base leading-relaxed">Fear tried to take over the moment.</p>
                  <p className="text-text-body text-base leading-relaxed">
                    Instead of letting it lead,
                    <br />
                    you returned and guided your system.
                  </p>
                </div>

                {/* Section 2 */}
                <div className="mb-9">
                  <p className="text-primary text-base leading-relaxed font-thin mb-4">
                    Your nervous system just experienced a different response.
                  </p>
                  <p className="text-text-body text-base leading-relaxed mb-3">Each time you return:</p>
                  <div className="space-y-2.5">
                    <p className="text-text-body text-base leading-relaxed">Recovery becomes faster.</p>
                    <p className="text-text-body text-base leading-relaxed">Your system learns steadiness.</p>
                    <p className="text-text-body text-base leading-relaxed">
                      Your identity becomes more stable than the moment.
                    </p>
                  </div>
                </div>

                {/* Section 3 */}
                <div>
                  <p className="text-primary text-base leading-relaxed font-thin mb-1.5">
                    This is how formation happens.
                  </p>
                  <p className="text-text-body text-base leading-relaxed mb-1.5">Not in dramatic breakthroughs.</p>
                  <p className="text-text-body text-base leading-relaxed">But in quiet returns like this.</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleUseComplete} disabled={saving}>
                  {saving ? "Saving…" : "Return home"}
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    if (existingScript) prefillFromScript(existingScript);
                    setPhaseIndex(0);
                    setScreen("phase");
                  }}
                >
                  Refine my Reorientation
                </Button>
              </div>
            </div>
          )}
        </main>
        <BottomNav />
      </div>
    );
  }

  // ENTRY
  if (screen === "entry") {
    return (
      <div className="flex min-h-screen flex-col pb-20">
        <main className="flex flex-1 flex-col justify-center px-5 py-12 content-container">
          <h1 className="tracking-tight mb-8">When activation rises</h1>
          <div className="space-y-4 leading-relaxed">
            <p className="text-text-body">Fear can accelerate perception.</p>

            <p>As your mind begins predicting danger, your body prepares for survival.</p>

            <p>This can feel intense, especially when it appears suddenly.</p>
            <p className="text-text-body">
              Often, what you are experiencing is often a learned protection pattern, not a present threat.
            </p>
            <p className="text-primary">
              The Reorientation process helps you interrupt the spiral and retrain how your brain interprets these
              moments.
            </p>

            <p className="text-text-body">
              Each time you move through this sequence you:
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li> interrupt reinforcement</li>
                <li> update prediction</li>
                <li>strengthen internal authority</li>
                <li>stabilize your identity over time</li>
              </ul>
            </p>
            <p className="text-text-body">You do not need to rush.</p>
            <p className="text-text-body">Just begin.</p>
          </div>

          <Button
            className="mt-10 w-full"
            size="lg"
            onClick={() => {
              if (wakeLockToggle) wakeLock.enable();
              setScreen("phase");
            }}
          >
            Begin Reorientation
          </Button>
        </main>
        <BottomNav />
      </div>
    );
  }

  // COMPLETE — Reorientation Review
  if (screen === "complete") {
    const stepTitles = [
      "Line in the Sand",
      "Expose the Mechanism",
      "Untangle Time",
      "Choose Your Agreement",
      "Shepherd Your Soul",
      "Occupy Your Identity",
    ];

    const userSelections = PHASES.map((_, i) => (useCustom[i] ? customTexts[i] : selections[i])?.trim() || "—");

    return (
      <div className="flex min-h-screen flex-col pb-40">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-12 content-container">
          <h1 className="tracking-tight mb-2">You have established reorientation</h1>
          <div className="space-y-4 leading-relaxed mb-8">
            <p className="text-primary">These words create a reliable pathway back to steadiness.</p>
            <p className="text-text-body">
              When fear, urgency, or inner pressure rises,
              <br />
              return to reorient, moving through each line slowly.
            </p>
            <p className="text-text-body">
              Repetition teaches your nervous system
              <br />
              that this moment is safe to experience.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {stepTitles.map((title, i) => (
              <div key={i} className="rounded-lg border bg-card p-5 border-secondary">
                <p className="text-xs text-text-supporting uppercase tracking-wider mb-2 text-primary">{title}</p>
                <p className="text-text-heading text-base leading-relaxed text-primary">{userSelections[i]}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 leading-relaxed mb-10 text-center">
            <p className="text-text-heading font-serif font-semibold text-xl">You have established reorientation</p>
            <p className="text-text-body">
              Over time, returning becomes more natural.
              <br />
              Steadiness becomes more familiar.
            </p>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-5 py-4 space-y-3 z-10">
          <div className="content-container">
            <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Reorientation"}
            </Button>
            <Button className="w-full mt-3" size="lg" variant="secondary" onClick={handleEdit}>
              Edit Reorientation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // PHASE SCREENS
  const phase = PHASES[phaseIndex];

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <header className="px-5 pt-8 pb-2 content-container">
        <p className="text-xs text-text-supporting mb-2">Step {phaseIndex + 1} of 6</p>
        <Progress value={((phaseIndex + 1) / 6) * 100} className="h-1.5 mb-6" />
        <h2 className="font-semibold tracking-tight">{phase.title}</h2>
        {phase.introduction.map((line, i) => (
          <p key={i} className="text-supporting mt-1 text-sm">
            {line}
          </p>
        ))}
      </header>

      <main className="flex-1 px-5 pt-4 space-y-3 content-container">
        {phase.options.map((option) => {
          const isSelected = !useCustom[phaseIndex] && selections[phaseIndex] === option;
          return (
            <button
              key={option}
              onClick={() => handleSelectOption(option)}
              className={`w-full rounded-lg border p-4 text-left text-sm transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10 text-text-heading"
                  : "border-border bg-card text-text-body hover:border-primary/40"
              }`}
            >
              {option}
            </button>
          );
        })}

        <div className="pt-2">
          {useCustom[phaseIndex] ? (
            <Textarea
              placeholder={`${phase.customLabel}…`}
              value={customTexts[phaseIndex]}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="min-h-[80px]"
              autoFocus
            />
          ) : (
            <button
              onClick={handleCustomToggle}
              className="text-xs text-text-supporting hover:text-text-heading transition-colors"
            >
              + {phase.customLabel}
            </button>
          )}
        </div>
      </main>

      <div className="px-5 pb-4 pt-2 content-container">
        <Button className="w-full" size="lg" disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Activated;
