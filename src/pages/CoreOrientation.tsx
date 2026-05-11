import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const CoreOrientation = () => {
  const navigate = useNavigate();
  const { hasActiveReorientation, setOrientationSeen } = useAuth();

  const handleEnter = () => {
    setOrientationSeen(true);
    navigate(hasActiveReorientation ? "/" : "/activated", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-5 py-16">
      <div className="content-container space-y-12">
        {/* Header */}
        <h1 className="font-fraunces text-3xl font-semibold tracking-tight text-text-heading sm:text-4xl">
          The journey that reshapes reality
        </h1>

        {/* Intro text */}
        <div className="space-y-4 text-base leading-relaxed text-text-body sm:text-lg mb-0 pb-0">
          <p>Your life experiences shape how you see the world.</p>
          <p>Over time, your brain learns patterns to protect you, scanning for danger and preparing you to respond.</p>

          <p>These patterns can become automatic, shaping your thoughts, your reactions, and even your body.</p>
          <p className="text-primary">But what was learned can be updated.</p>
          <p>With steady repetition, the brain begins to expect safety again.</p>
          <p>This is neuroplasticity.</p>

          <p className="text-primary">
            The Formation Arc helps you retrain your system on Truth through awareness, alignment, and repetition.
          </p>
        </div>

        {/* CTA */}
        <Button onClick={handleEnter} className="w-full" size="lg">
          Begin the journey
        </Button>

        <p className="text-xs leading-relaxed text-text-supporting/70 pt-8 text-center">
          Designed to support personal formation and reflection. Not a replacement for medical or mental health care.
        </p>
      </div>
    </div>
  );
};

export default CoreOrientation;
