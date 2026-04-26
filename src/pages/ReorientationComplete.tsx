import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const ReorientationComplete = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <main className="flex flex-1 flex-col justify-center px-5 py-12 content-container">
        <div className="text-center max-w-md mx-auto space-y-6">
          <h1 className="tracking-tight text-center">Your reorientation flow is established</h1>
          <div className="space-y-4 leading-relaxed">
            <p className="text-text-body text-base">
              Each time activation rises, this sequence helps your system settle more quickly.
            </p>
            <p className="text-text-body text-base">
              Now we will use it to support today's Daily Formation.
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-3">
          <Button className="w-full" size="lg" onClick={() => navigate("/daily-formation?skip_intro=true")}>
            Continue to Daily Formation
          </Button>
          <Button className="w-full" size="lg" variant="secondary" onClick={() => navigate("/activated")}>
            Edit Reorientation
          </Button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default ReorientationComplete;
