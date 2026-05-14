import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { sanitizeTextInput } from "@/lib/sanitize";

interface AnchorRecallProps {
  anchorTitle: string;
  onAnchorTitleChange: (val: string) => void;
  sceneText: string;
  onSceneTextChange: (val: string) => void;
  emotionTags: string[];
  onEmotionTagsChange: (tags: string[]) => void;
  onContinue: () => void;
  totalSteps: number;
}

type MemoryCategory = "before-life-changed" | "places-you-loved" | "activities-that-felt-free" | null;

const CATEGORIES: { id: MemoryCategory; label: string; description: string }[] = [
  {
    id: "before-life-changed",
    label: "Moments you felt seen",
    description: "Memories of comfort, joy, or acceptance",
  },
  {
    id: "places-you-loved",
    label: "Places you used to love",
    description: "Spaces where you once felt at home",
  },
  {
    id: "activities-that-felt-free",
    label: "Activities that brought life",
    description: "Moments of celebration, peace, or affirmation",
  },
];

const SCENE_SUGGESTIONS: Record<string, string[]> = {
  "before-life-changed": [
    "A birthday you enjoyed",
    "A special holiday",
    "A place you loved",
    "Your childhood backyard",
    "The smell of breakfast on a slow morning",
    "A different memory",
  ],

  "places-you-loved": [
    "The beach on a family vacation",
    "Your grandmother's garden",
    "A forest you used to wander",
    "A home where you felt welcome",
    "A different memory",
  ],

  "activities-that-felt-free": [
    "Climbing a tree",
    "Swinging without a concern",
    "Building an imaginary world",
    "Making mud pies",
    "Building a sandcastle",
    "Listening to your favorite band",
    "Dancing for an audience of one",
    "Playing with your pet",
    "Gardening",
    "Sitting quietly in the sun",
    "A different memory",
  ],
};

const EMOTION_OPTIONS = [
  "Relaxed",
  "Peaceful",
  "Safe",
  "Connected",
  "Loved",
  "Accepted",
  "Seen",
  "Calm",
  "Open",
  "Supported",
  "Grateful",
  "Free",
  "Joy",
];

const AnchorRecall = ({
  anchorTitle,
  onAnchorTitleChange,
  sceneText,
  onSceneTextChange,
  emotionTags,
  onEmotionTagsChange,
  onContinue,
  totalSteps,
}: AnchorRecallProps) => {
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory>(null);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory]);

  const toggleEmotion = (tag: string) => {
    onEmotionTagsChange(emotionTags.includes(tag) ? emotionTags.filter((t) => t !== tag) : [...emotionTags, tag]);
  };

  const handleSceneSelect = (scene: string) => {
    if (scene === "Something else") {
      setSelectedScene("Something else");
    } else {
      setSelectedScene(scene);
    }
  };

  const canContinue = anchorTitle.trim().length > 0 && sceneText.trim().length > 0 && emotionTags.length > 0;

  return (
    <div className="screen-with-bottom-nav flex min-h-screen flex-col text-secondary-foreground rounded-lg">
      <header className="px-5 pt-8 pb-2 content-container">
        <div className="mb-2 h-8" />
        <p className="text-xs text-text-supporting mb-2">Step 1 of {totalSteps}</p>
        <Progress value={(1 / totalSteps) * 100} className="h-1.5 mb-6" />
      </header>

      <main className="flex-1 px-5 pt-2 space-y-8 pb-4 content-container">
        {/* Header */}
        <div>
          <h1 className="tracking-tight">
            Return to a moment of safety
            {selectedScene && selectedScene !== "Something else" && (
              <span className="block font-normal text-text-supporting mt-1 text-primary text-2xl">{selectedScene}</span>
            )}
          </h1>

          {/* Screen 1 — Category selection */}
          {!selectedScene && !selectedCategory && (
            <>
              <h2 className="font-medium uppercase tracking-widest text-primary font-sans mb-2 text-base pt-[10px]">
                ANCHOR MEMORY
              </h2>
              <p className="text-supporting leading-relaxed mt-3 text-destructive-foreground">
                Bring to mind a moment where you felt safe, at ease, or connected.
              </p>
              <p className="text-supporting leading-relaxed mt-3 text-destructive-foreground">
                Start with something small. It doesn’t have to be significant.
              </p>
              <p className="text-supporting leading-relaxed mt-3 text-destructive-foreground">
                Use the prompts below if needed.
              </p>
              <p className="text-supporting leading-relaxed mt-3 text-destructive-foreground">
                You can ask God to guide you.
              </p>
            </>
          )}

          {/* Screen 2 — Scene suggestions */}
          {!selectedScene && selectedCategory && (
            <>
              <p className="text-supporting leading-relaxed mt-3 text-destructive-foreground">
                Think back to a moment that felt peaceful, easy, or natural.
              </p>
              <p className="text-supporting leading-relaxed mt-3 text-destructive-foreground">
                Choose something that resonates with you.
              </p>
              <p>It doesn't need to be spectacular; it's just a moment to connect.</p>
            </>
          )}

          {/* Screen 3 — Writing field */}
          {selectedScene && (
            <>
              <p className="text-supporting leading-relaxed mt-3 text-base text-destructive-foreground">
                Close your eyes as you let the scene gently come into focus. Use your senses to allow the moment become more tangible. Nothing needs
                to be forced.
              </p>
            </>
          )}
        </div>

        {/* Memory Gateway — category cards */}
        {!selectedScene && !selectedCategory && (
          <div className="space-y-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="w-full rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 active:bg-accent/10"
              >
                <p className="font-medium text-primary leading-snug text-base">{cat.label}</p>
                <p className="text-text-supporting mt-1 text-base">{cat.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Scene suggestions */}
        {!selectedScene && selectedCategory && (
          <div className="space-y-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-text-supporting hover:text-text-heading transition-colors text-sm"
            >
              ← Back to categories
            </button>
            <div className="flex flex-wrap gap-2">
              {SCENE_SUGGESTIONS[selectedCategory]!.map((scene) => (
                <button
                  key={scene}
                  onClick={() => handleSceneSelect(scene)}
                  className="rounded-full border border-border px-4 py-2 text-primary transition-colors hover:border-primary/40 text-base"
                >
                  {scene}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Visualization guidance + writing field */}
        {selectedScene && (
          <>
            {/* Vertical step structure */}
            <div className="relative">
              {/* OBSERVATION */}
              <div className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                  <div className="w-px flex-1 bg-border/40 my-1" />
                </div>
                <div className="pb-8 flex-1">
                  <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                    OBSERVATION
                  </h2>
                  <p className="text-text-body text-base leading-relaxed">
                    Notice where you are, your age, and who is with you.
                  </p>
                </div>
              </div>

              {/* ENVIRONMENT */}
              <div className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                  <div className="w-px flex-1 bg-border/40 my-1" />
                </div>
                <div className="pb-8 flex-1">
                  <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                    ENVIRONMENT
                  </h2>
                  <p className="text-text-body text-base leading-relaxed">
                    Take in the light, temperature, and sounds.
                  </p>
                </div>
              </div>

              {/* PERSPECTIVE */}
              <div className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                  <div className="w-px flex-1 bg-border/40 my-1" />
                </div>
                <div className="pb-8 flex-1">
                  <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                    PERSPECTIVE
                  </h2>
                  <p className="text-text-body text-base leading-relaxed">
                    Let yourself be inside the moment, or gently observe it.
                  </p>
                </div>
              </div>

              {/* INNER EXPERIENCE */}
              <div className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                  <div className="w-px flex-1 bg-border/40 my-1" />
                </div>
                <div className="pb-8 flex-1">
                  <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                    INNER EXPERIENCE
                  </h2>
                  <p className="text-text-body text-base leading-relaxed">
                    Notice what you are doing, thinking, and feeling.
                  </p>
                </div>
              </div>

              {/* EMBODIMENT */}
              <div className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-primary/30 bg-primary/10" />
                  <div className="w-px flex-1 bg-border/35 my-1" />
                </div>
                <div className="flex-1">
                  <h2 className="font-sm uppercase tracking-widest text-primary font-sans mb-2 text-base leading-8">
                    EMBODIMENT
                  </h2>

                  <p className="text-text-body text-base leading-relaxed">
                    Let your body experience the moment as if it is happening now.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-heading text-primary">Stay with the moment</label>
              <p className="text-xs text-text-supporting">Capture the moment in a few words</p>
              <Textarea
                placeholder="e.g. I am in my grandmother’s garden. The air is cool. I can feel the ground beneath my feet. I feel safe here."
                value={sceneText}
                onChange={(e) =>
                  onSceneTextChange(sanitizeTextInput(e.target.value, { maxLength: 5000, multiline: true }))
                }
                maxLength={5000}
                className="min-h-[140px] bg-muted border-secondary border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-heading text-primary">Name this moment</label>
              <p className="text-xs text-text-supporting">A few words to help you return here</p>
              <Input
                placeholder="e.g. He lays me down in green pastures"
                value={anchorTitle}
                onChange={(e) => onAnchorTitleChange(sanitizeTextInput(e.target.value, { maxLength: 60 }))}
                maxLength={60}
              />

              <p className="text-xs text-text-supporting text-right">{anchorTitle.length}/60</p>
            </div>

            {/* Emotional layer */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-text-heading">Notice how this felt</p>
              <p className="text-xs text-text-supporting">Let your body register this</p>
              <div className="flex flex-wrap gap-2">
                {EMOTION_OPTIONS.map((tag) => {
                  const selected = emotionTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleEmotion(tag)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 text-text-heading"
                          : "border-border text-text-supporting hover:border-primary/40"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Back + Continue */}
      {selectedScene && (
        <div className="bottom-cta-flow px-5 pt-2 content-container space-y-2">
          <Button className="w-full" size="lg" variant="secondary" onClick={() => setSelectedScene(null)}>
            Back
          </Button>
          <Button className="w-full" size="lg" disabled={!canContinue} onClick={onContinue}>
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnchorRecall;
