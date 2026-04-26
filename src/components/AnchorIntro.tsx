import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

interface AnchorIntroProps {
  onComplete: () => void;
}

const AnchorIntro = ({ onComplete }: AnchorIntroProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (step === 0) {
    return (
      <div className="flex min-h-screen flex-col pb-20">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-40 content-container">
          <h1 className="tracking-tight mb-8">The science behind daily formation</h1>

          <div className="space-y-4 text-base leading-relaxed text-text-body sm:text-lg">
            <p className="text-secondary-foreground">
              Every time you have a feeling, good or bad, a chemical is released into your system. This creates an
              emotional signature, a measurable frequency, that changes the body over time.
            </p>

            <p>
              Cortisol, adrenaline, and norepinephrine (CAN chemistry) are the stress hormones released into the body
              when we experience disorder. They create low frequency emotional signatures, which deplete our resources,
              often leading to a weakened immune system and eventually, chronic symptoms.
            </p>
            <p>
              Dopamine, oxytocin, serotonin, and endorphins (DOSE chemistry) are the feel-good hormones released into
              the body when we experience alignment. They create high frequency emotional signatures, which support and
              heal the body, and help us feel safe.
            </p>
            <p className="text-primary">
              The Daily Formation practice is designed to provide the nervous system with new, positive information to
              produce life-giving DOSE chemistry, which counteracts the effects of CAN chemistry stored in the body.
            </p>
          </div>
        </main>

        <div className="fixed bottom-16 left-0 right-0 px-5 pb-4 pt-2 bg-background/95 backdrop-blur-sm">
          <div className="content-container space-y-2">
            <Button className="w-full" size="lg" onClick={() => setStep(1)}>
              Continue
            </Button>
            <Button className="w-full" size="lg" variant="secondary" onClick={onComplete}>
              Skip
            </Button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="flex min-h-screen flex-col pb-20">
        <main className="flex flex-1 flex-col px-5 pt-10 pb-32 content-container">
          <h1 className="tracking-tight mb-8">Reframing your story</h1>

          <div className="space-y-5 leading-relaxed text-text-body">
            <p className="text-secondary-foreground">
              Your brain stores experiences as networks of meaning, making memory vital for setting and maintaining
              expectations.
            </p>

            <div className="space-y-1">
              <p>
                Remembrance is a divine principle Jesus taught us. Recalling a positive memory in your life is a
                powerful way to recall God's faithfulness into remembrance, and enter into communion with Him.
              </p>
            </div>

            <p className="text-secondary-foreground">
              When a memory is recalled, the neural network connected to it becomes open to new association, responding
              in real time. As positive meaning expands, the brain registers safety and connection, producing DOSE
              chemistry.
            </p>
            <p>
              Repeated exposure to these signals retrains the nervous system to update expectations as we begin to
              surrender to God’s will for us.
            </p>
            <p>
              We begin to embody joy, health and grace with greater ease, until eventually, we are separated from
              trauma, disconnected from old patterns, and established on Truth.
            </p>

            <p>
              It’s important to know that when the nervous system has been under strain, creativity is obscured and
              access to memory can narrow. With practice, however, access widens.
            </p>
          </div>
        </main>

        <div className="fixed bottom-16 left-0 right-0 px-5 pb-4 pt-2 bg-background/95 backdrop-blur-sm">
          <div className="content-container">
            <Button className="w-full" size="lg" onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Step 2 — Screen 3
  return (
    <div className="flex min-h-screen flex-col pb-20">
      <main className="flex flex-1 flex-col px-5 pt-10 pb-32 content-container">
        <h1 className="tracking-tight mb-8">Practicing formation daily</h1>

        <div className="space-y-5 leading-relaxed text-text-body">
          <p className="text-secondary-foreground">There are three principles to neuroplasticity:</p>

          <div className="space-y-4">
            <div>
              <h2 className="mb-2 font-sans uppercase tracking-widest text-primary text-sm">FOCUS</h2>
              <p className="text-base text-text-body">
                Focus on God and His promises. You are healed, accepted, whole, anointed, and precious in His sight.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-sans uppercase tracking-widest text-primary text-sm">ASSOCIATION</h2>
              <p className="text-base text-text-body">
                Replace old, unhealthy associations with Kingdom reality, by making an intentional choice to see
                yourself as a new creation, alive in victory.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-sans uppercase tracking-widest text-primary text-sm">REPETITION</h2>
              <p className="text-base text-text-body">
                Change requires repetition to strengthen new neural pathways. Each repetition builds on the last.
              </p>
            </div>
          </div>

          <p>
            When we apply this framework together with God by aligning with Truth, we break our agreements with the lies
            we’ve accepted.
          </p>

          <p className="text-primary">
            Repeated DOSE chemistry released into the body drives changes in the brain long term, and we begin to
            experience true transformation.
          </p>
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 px-5 pb-4 pt-2 bg-background/95 backdrop-blur-sm">
        <div className="content-container">
          <Button className="w-full" size="lg" onClick={onComplete}>
            Continue
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AnchorIntro;
