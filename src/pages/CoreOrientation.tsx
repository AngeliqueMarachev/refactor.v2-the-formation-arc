import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const CoreOrientation = () => {
  const navigate = useNavigate();
  const { setOrientationSeen } = useAuth();

  const handleEnter = () => {
    setOrientationSeen(true);
    navigate("/", { replace: true });
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
            Your interpretation of the world was shaped over time by your life experiences. This unique interpretation
            is upheld by your thoughts, creating your reality today.
          </p>
          <p>To keep you safe, the brain scans for patterns that signal danger.</p>
          <p>
            Traumatic or repeated stressful experiences can program your system to be on constant alert searching for
            recognized patterns to shield you in the future. Over time, these patterns become physical structures in the
            brain and strongholds in our lives.{" "}
          </p>
          <p>
            Coping mechanisms, limiting beliefs, emotional walls, and even physical symptoms are survival strategies
            that the body erects in an effort to ensure your survival.
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
            reinforcement.
          </p>
        </div>

        {/* Path cards */}
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-text-body">There are two ways to use this space:</p>

          {/* Card 2 */}
          <div className="rounded-lg border bg-card p-5 sm:p-6 border-secondary">
            <p className="mb-2 text-lg font-medium text-text-heading text-primary">When you want to expand slowly</p>

            <p className="mt-1.5 leading-relaxed text-text-supporting text-base">
              Daily Formation is a thoughtful, daily practice that strengthens pathways of safety and deepens your
              sense of agency.
            </p>
          </div>

          {/* Card 1 */}
          <div className="rounded-lg border bg-card p-5 sm:p-6 border-secondary">
            <p className="mb-2 text-lg font-medium text-text-heading text-primary">
              When you want to return to safety quickly
            </p>
            <p className="mt-1.5 leading-relaxed text-text-supporting text-base">
              Reorientation is a short sequence that quickly interrupts destructive thinking and restores
              internal authority.
            </p>
          </div>
        </div>

        {/* Closing reassurance */}
        <div className="space-y-1.5 text-base leading-relaxed text-text-body">
          <p>You do not need to do everything today.</p>
          <p>Begin where you are.</p>
          <p>Return often.</p>
        </div>

        {/* CTA */}
        <Button onClick={handleEnter} className="w-full" size="lg">
          Enter
        </Button>
      </div>
    </div>
  );
};

export default CoreOrientation;
