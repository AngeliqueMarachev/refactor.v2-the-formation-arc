import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const content: Record<string, { title: string; subtitle: string; body: string[] }> = {
  "return-to-truth": {
    title: "Return to Truth",
    subtitle: "Use Truth to interrupt patterns and signal safety",
    body: [
      "When the system reads a moment as threat, perception narrows. Returning to Truth interrupts that pattern by introducing a steadier signal.",
      "Truth, repeated with attention, becomes the cue your system uses to feel safe again.",
    ],
  },
  "create-new-associations": {
    title: "Create new associations",
    subtitle: "Update meaning through memory",
    body: [
      "Memory is not static. Each time you revisit it with a steadier presence, the meaning attached to it can shift.",
      "New associations form when an old memory is paired with a new sense of safety.",
    ],
  },
  "neuroplasticity": {
    title: "The science behind neuroplasticity",
    subtitle: "Understand how your system responds",
    body: [
      "Neuroplasticity is your nervous system's ability to reshape itself in response to repeated experience.",
      "Small, repeated returns to steadiness train the system more effectively than rare, intense effort.",
    ],
  },
  "begin-with-stability": {
    title: "Begin with stability",
    subtitle: "Establish safety before change",
    body: [
      "Lasting change is built on a felt sense of safety. Without it, the system defends rather than learns.",
      "Begin by establishing stability — then growth can follow.",
    ],
  },
  "how-transformation-happens": {
    title: "How transformation happens",
    subtitle: "Focus, association, repetition",
    body: [
      "Transformation follows a simple rhythm: focused attention, meaningful association, and patient repetition.",
      "Each return strengthens the pattern. Over time, what was rehearsed becomes the default.",
    ],
  },
};

const KnowledgeTopic = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const topic = slug ? content[slug] : undefined;

  if (!topic) {
    return (
      <div className="screen-with-bottom-nav flex min-h-screen flex-col">
        <main className="flex-1 px-5 pt-8 content-container">
          <button
            onClick={() => navigate("/knowledge")}
            className="flex items-center gap-1 text-text-supporting hover:text-primary text-sm mb-6"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <p className="text-text-body">Topic not found.</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="screen-with-bottom-nav flex min-h-screen flex-col">
      <header className="px-5 pt-8 pb-4 content-container">
        <button
          onClick={() => navigate("/knowledge")}
          className="flex items-center gap-1 text-text-supporting hover:text-primary text-sm mb-6"
        >
          <ChevronLeft className="h-4 w-4" /> Knowledge
        </button>
        <h1>{topic.title}</h1>
        <p className="text-text-supporting mt-2">{topic.subtitle}</p>
      </header>

      <main className="flex-1 px-5 content-container space-y-4">
        {topic.body.map((p, i) => (
          <p key={i} className="text-text-body">{p}</p>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default KnowledgeTopic;
