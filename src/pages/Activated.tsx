import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeText, sanitizeTextInput } from "@/lib/sanitize";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { incrementUsageStat } from "@/lib/usage-stats";

const PHASES = [
  {
    title: "Line In The Sand",
    introduction: ["Interrupt the spiral.", "Choose a phrase to pause the moment."],
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
    introduction: ["This is a pattern. Not a signal of danger.", "Choose what fits."],
    customLabel: "Write your own explanation",
    options: [
      "My nervous system is trying to protect me.",
      "My brain is running an old prediction loop.",
      "This is a protective pattern, not a present danger.",
      "My system is misreading this moment as a threat.",
    ],
  },
  {
    title: "Untangle Time",
    introduction: ["This is not the past. This is now.", "Choose what feels true."],
    customLabel: "Write your own statement",
    options: [
      "That season is over. This is a different moment.",
      "I survived that chapter. I am here now.",
      "My body is remembering, but I am safe now.",
      "I am not back there. I am here.",
    ],
  },
  {
    title: "Choose Your Agreement",
    introduction: ["You don’t have to agree with fear.", "Choose what you want to align with."],
    customLabel: "Write your own statement",
    options: [
      "I return to Truth instead of fear.",
      "I move through moment without fear leading me.",
      "Fear has no power over me.",
      "I have a sound mind.",
    ],
  },
  {
    title: "Shepherd Your Soul",
    introduction: ["Be gentle with yourself in this moment.", "Choose what you need to hear."],
    customLabel: "Write your own encouragement",
    options: [
      "You're not broken. Your body is protecting you.",
      "You are allowed to need time.",
      "You are learning to stand differently.",
      "This feeling doesn’t control you.",
    ],
  },
];

/**
 * Display order of the reorientation steps, mapped onto the stable
 * database columns (line_1..line_5 / PHASES indices).
 * Shepherd Your Soul (index 4) comes before Choose Your Agreement (index 3),
 * so saved statements keep mapping to the same columns.
 */
const LINE_ORDER = [0, 1, 2, 4, 3];
const TOTAL_STEPS = LINE_ORDER.length;

type Screen = "loading" | "use-script" | "entry" | "phase" | "complete";


const Activated = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshOnboardingState } = useAuth();

  const { data: existingScript, isLoading: scriptLoading } = useQuery({
    queryKey: ["reorient_script", user?.id],
    queryFn: async () => {
      const reorientTemplates = supabase.from("reorient_templates") as any;
      const { data } = await reorientTemplates
        .select("id, line_1, line_2, line_3, line_4, line_5")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!user,
  });

  const [screen, setScreen] = useState<Screen>("loading");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [selections, setSelections] = useState<(string | null)[]>(Array(5).fill(null));
  const [customTexts, setCustomTexts] = useState<string[]>(Array(5).fill(""));
  const [useCustom, setUseCustom] = useState<boolean[]>(Array(5).fill(false));
  const [saving, setSaving] = useState(false);
  const [revealedCount, setRevealedCount] = useState(1);
  const [justRevealed, setJustRevealed] = useState<number | null>(null);
  const [scriptComplete, setScriptComplete] = useState(false);

  const resetInProgressReorientation = () => {
    setScreen("entry");
    setPhaseIndex(0);
    setSelections(Array(5).fill(null));
    setCustomTexts(Array(5).fill(""));
    setUseCustom(Array(5).fill(false));
    setSaving(false);
    setRevealedCount(1);
    setJustRevealed(null);
    setScriptComplete(false);
    navigate("/activated", { replace: true, state: null });
  };

  useEffect(() => {
    if (location.state?.resetReorientation) {
      resetInProgressReorientation();
    }
  }, [location.state]);

  useEffect(() => {
    if (scriptLoading) return;
    if (existingScript) {
      setScreen("use-script");
    } else {
      setScreen("entry");
    }
  }, [scriptLoading, existingScript]);

  // Index of the underlying line/PHASE for the current display step
  const lineIndex = LINE_ORDER[phaseIndex];

  const handleSelectOption = (option: string) => {
    const next = [...selections];
    next[lineIndex] = option;
    setSelections(next);
    const nextCustom = [...useCustom];
    nextCustom[lineIndex] = false;
    setUseCustom(nextCustom);
  };

  const handleCustomToggle = () => {
    const next = [...useCustom];
    next[lineIndex] = true;
    setUseCustom(next);
    const nextSel = [...selections];
    nextSel[lineIndex] = null;
    setSelections(nextSel);
  };

  const handleCustomChange = (val: string) => {
    const next = [...customTexts];
    next[lineIndex] = sanitizeTextInput(val, { maxLength: 500 });
    setCustomTexts(next);
  };

  const currentSelection = useCustom[lineIndex] ? customTexts[lineIndex] : selections[lineIndex];


  const canContinue = !!currentSelection && currentSelection.trim().length > 0;

  const handleContinue = () => {
    if (phaseIndex < TOTAL_STEPS - 1) {
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
  }) => {
    const lines = [script.line_1, script.line_2, script.line_3, script.line_4, script.line_5];
    const newSelections: (string | null)[] = Array(5).fill(null);
    const newCustomTexts = Array(5).fill("");
    const newUseCustom = Array(5).fill(false);

    lines.forEach((line, i) => {
      if (!line || !PHASES[i]) return;
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
    for (let i = 0; i < 5; i++) {
      const val = useCustom[i] ? customTexts[i] : selections[i];
      lines[`line_${i + 1}`] = sanitizeText(val, { maxLength: 500 });
    }
    lines.line_6 = null;

    // Upsert: delete old template then insert new one
    await supabase.from("reorient_templates").delete().eq("user_id", user.id);
    const reorientTemplates = supabase.from("reorient_templates") as any;
    await reorientTemplates.insert({
      user_id: user.id,
      ...lines,
      is_active: true,
      updated_at: new Date().toISOString(),
    });

    await incrementUsageStat("reorient_return_count", user.id);
    await refreshOnboardingState();

    setSaving(false);
    navigate("/");
  };

  // LOADING
  if (screen === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-text-supporting">Loading…</div>;
  }

  // USE EXISTING SCRIPT
  if (screen === "use-script" && existingScript) {
    const allLines = [
      existingScript.line_1,
      existingScript.line_2,
      existingScript.line_3,
      existingScript.line_4,
      existingScript.line_5,
    ];

    const allStepLabels = [
      "LINE IN THE SAND",
      "EXPOSE THE MECHANISM",
      "UNTANGLE TIME",
      "CHOOSE YOUR AGREEMENT",
      "SHEPHERD YOUR SOUL",
    ];

    const orderedSteps = LINE_ORDER.map((idx) => ({ label: allStepLabels[idx], line: allLines[idx] })).filter(
      (s) => !!s.line,
    ) as { label: string; line: string }[];

    const lines = orderedSteps.map((s) => s.line);
    const stepLabels = orderedSteps.map((s) => s.label);

    const handleUseComplete = async () => {
      if (!user) return;
      setSaving(true);
      await incrementUsageStat("reorient_return_count", user.id);

      setSaving(false);

      navigate("/");
    };


    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col rounded-lg">
        <main className="flex flex-1 flex-col px-5 pt-10 content-container pb-0">
          <h1 className="tracking-tight mb-2 pb-[10px]">Your reorientation path</h1>

          <div className="text-supporting leading-relaxed mb-6 space-y-3">
            <p>Notice what feels active in you right now without becoming consumed by it.</p>
            <p>Move through your reorientation slowly, one line at a time.</p>
            <p>Read it aloud, with intention.</p>
            <p>Allow your system to experience a different response.</p>
          </div>

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
              <div className="text-left py-4 max-w-md mx-auto">
                {/* Section 2 */}
                <div>
                  <p className="text-primary text-base leading-relaxed font-thin mb-1.5">
                    This is how your system learns steadiness.
                  </p>
                  <p className="text-text-body text-base leading-relaxed mb-1.5">Not by force.</p>
                  <p className="text-text-body text-base leading-relaxed">But through repeated return.</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleUseComplete} disabled={saving}>
                  {saving ? "Saving…" : "Return to today"}
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
                  Refine reorientation
                </Button>
              </div>
            </div>
          )}
        </main>
        <BottomNav onUnsavedReorientationContinue={resetInProgressReorientation} />
      </div>
    );
  }

  // ENTRY
  if (screen === "entry") {
    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col rounded-lg">
        <main className="flex flex-1 flex-col justify-center px-5 py-12 content-container">
          <h1 className="tracking-tight mb-8">Return to Truth</h1>
          <div className="space-y-4 leading-relaxed">
            <p className="text-primary"> Reorientation is the starting point for the practices that follow.</p>
            <p className="font-normal text-secondary-foreground">
              {" "}
              In moments of fear, shame, urgency, or overwhelm, the system falls back on what it has learned to expect.
            </p>
            <p className="font-normal text-secondary-foreground">
              What you experience in those moments is not random. It is patterned.
            </p>
            <p className="font-normal text-secondary-foreground">It’s what your system learned to expect.</p>
            <p className="font-normal text-secondary-foreground">
              Reorientation interrupts that pattern. It helps your system return to stability, truth, and steadier
              expectation.
            </p>
            <p className="font-normal text-secondary-foreground">You are not trying to force calm.</p>
            <p className="font-normal text-primary">You’re learning to return to Truth.</p>
          </div>

          <Button
            className="mt-10 w-full"
            size="lg"
            onClick={() => {
              setScreen("phase");
            }}
          >
            Begin reorientation
          </Button>
        </main>
        <BottomNav onUnsavedReorientationContinue={resetInProgressReorientation} />
      </div>
    );
  }

  // COMPLETE — Reorientation Review
  if (screen === "complete") {
    const allStepTitles = [
      "Line in the Sand",
      "Expose the Mechanism",
      "Untangle Time",
      "Choose Your Agreement",
      "Shepherd Your Soul",
    ];

    const stepTitles = LINE_ORDER.map((idx) => allStepTitles[idx]);

    const userSelections = LINE_ORDER.map((idx) => (useCustom[idx] ? customTexts[idx] : selections[idx])?.trim() || "—");


    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col px-5 pt-10 content-container pb-0">
          <h1 className="tracking-tight mb-2 pb-[10px]">You interrupted the pattern</h1>
          <div className="space-y-4 leading-relaxed mb-8">
            <p className="text-primary">This is how change begins.</p>
            <p className="text-text-body">Read this slowly.</p>
          </div>

          <div className="space-y-3 mb-8">
            {stepTitles.map((title, i) => (
              <div key={i} className="rounded-lg border bg-card p-5 border-secondary">
                <p className="text-xs text-text-supporting uppercase tracking-wider mb-2 text-primary">{title}</p>
                <p className="text-text-heading text-base leading-relaxed text-primary">{userSelections[i]}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 leading-relaxed mb-10">
            <p className="text-text-body">Each time you return, old patterns weaken.</p>
            <p className="text-primary">Steadiness becomes the pattern.</p>
          </div>
        </main>

        <div className="bottom-cta-flow px-5 pt-2 space-y-3 content-container">
          <div>
            <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save reorientation"}
            </Button>
            <Button className="w-full mt-3" size="lg" variant="secondary" onClick={handleEdit}>
              Edit reorientation
            </Button>
          </div>
        </div>
        <BottomNav onUnsavedReorientationContinue={resetInProgressReorientation} />
      </div>
    );
  }

  // PHASE SCREENS
  const phase = PHASES[lineIndex];

  return (
    <div className="screen-with-bottom-nav flex min-h-screen flex-col">
      <header className="px-5 pt-8 pb-2 content-container">
        <p className="text-xs text-text-supporting mb-2">Step {phaseIndex + 1} of {TOTAL_STEPS}</p>
        <Progress value={((phaseIndex + 1) / TOTAL_STEPS) * 100} className="h-1.5 mb-6" />

        <h2 className="font-semibold tracking-tight">{phase.title}</h2>
        {phase.introduction.map((line, i) => (
          <p key={i} className="text-supporting mt-1 text-sm">
            {line}
          </p>
        ))}
      </header>

      <main className="flex-1 px-5 pt-4 space-y-3 content-container">
        {phase.options.map((option) => {
          const isSelected = !useCustom[lineIndex] && selections[lineIndex] === option;
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
          {useCustom[lineIndex] ? (
            <Textarea
              placeholder={`${phase.customLabel}…`}
              value={customTexts[lineIndex]}
              onChange={(e) => handleCustomChange(e.target.value)}
              maxLength={500}
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

      <div className="bottom-cta-flow px-5 pt-2 content-container">
        <Button className="w-full" size="lg" disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Button>
      </div>

      <BottomNav onUnsavedReorientationContinue={resetInProgressReorientation} />
    </div>
  );
};

export default Activated;
