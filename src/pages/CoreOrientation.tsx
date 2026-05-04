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
          <p>
            Your life experiences shape your interpretation of the world. Your thoughts create your reality, upholding
            this unique interpretation.
          </p>

          <p>
            Traumatic events or prolonged stress can program your system be on constant alert for recognizable patterns
            that signal danger to proactively protect you. Over time, these patterns become physical structures in the
            brain and strongholds in our lives.{" "}
          </p>
          <p>
            Coping mechanisms, limiting beliefs, emotional walls, and even physical symptoms are survival strategies
            erected by the brain in an effort to ensure your survival.
          </p>
          <p>
            But learned prediction patterns are not permanent. With reassuring repetition, the brain can update
            expectations and safety can be restored.
          </p>
          <p>
            This process is known as neuroplasticity, and when we align our thoughts with Truth, the renewing of the
            mind touches all areas of our lives.
          </p>

          <p className="text-primary">
            The Formation Arc is designed to help you retrain your system on Truth through awareness, alignment, and
            repetition.
          </p>
        </div>

        {/* CTA */}
        <Button onClick={handleEnter} className="w-full" size="lg">
          Begin the journey
        </Button>
      </div>
    </div>
  );
};

export default CoreOrientation;
