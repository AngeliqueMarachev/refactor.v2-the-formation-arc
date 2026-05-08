import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type TopicBlock = string | { heading: string; text: string } | { list: string[] };

const content: Record<string, { title: string; subtitle: string; body: TopicBlock[]; closing?: string }> = {
  "return-to-truth": {
    title: "Return to Truth",
    subtitle: "Use Truth to interrupt patterns and signal safety",
    body: [
      "Before the brain can update, it must first register safety.",
      "Reorientation interrupts destructive loops and signals stability to your system.",
      "Each time you return:",
      { list: [
        "patterns are interrupted",
        "expectations begin to shift",
        "your system becomes more receptive",
      ] },
    ],
    closing: "A receptive system forms steadier expectations.",
  },
  "create-new-associations": {
    title: "Create new associations",
    subtitle: "Update meaning through memory",
    body: [
      "Your brain stores experiences as networks of meaning.",
      "When a memory is recalled, it becomes open to new association.",
      "As meaning expands, your system registers safety and connection.",
      "With repetition, these new associations begin to replace old patterns.",
    ],
    closing: "What you reinforce becomes what your system expects.",
  },
  "neuroplasticity": {
    title: "The science behind neuroplasticity",
    subtitle: "Understand how your system responds",
    body: [
      "Every experience releases chemistry into your system.",
      "Stress states produce survival chemistry that keeps the body on alert.",
      "States of safety produce chemistry that support healing and regulation.",
      "Daily formation introduces consistent signals of safety, allowing your system to update over time.",
    ],
    closing: "Your body follows what is repeated.",
  },
  "begin-with-stability": {
    title: "Begin with stability",
    subtitle: "Establish safety before change",
    body: [
      "Your system responds to signals of safety before conscious thought fully forms.",
      "Much of what shapes fear or peace happens below awareness, in systems designed to protect you.",
      "The nervous system responds strongly to signals of safety, connection, and support.",
      "Prayer communicates support to your system.",
      "Before you begin your practice, pause, give thanks, and entrust God with the outcomes.",
    ],
    closing: "Before you begin your practice, pause, give thanks, and entrust God with the outcomes.",
  },
  "how-transformation-happens": {
    title: "How transformation happens",
    subtitle: "Focus, association, repetition",
    body: [
      { heading: "FOCUS", text: "Direct your attention toward what is true." },
      { heading: "ASSOCIATION", text: "Attach new meaning to familiar experiences." },
      { heading: "REPETITION", text: "Reinforce these patterns consistently." },
      "When applied together, these form new pathways over time.",
    ],
    closing: "This is how steadiness is formed.",
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
        {topic.body.map((block, i) => {
          if (typeof block === "string") {
            return <p key={i} className="text-text-body">{block}</p>;
          }
          if ("list" in block) {
            return (
              <ul key={i} className="list-disc pl-5 space-y-2 text-text-body">
                {block.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          }
          return (
            <div key={i} className="space-y-1">
              <h3 className="text-primary font-semibold tracking-wide text-sm font-sans">{block.heading}</h3>
              <p className="text-text-body">{block.text}</p>
            </div>
          );
        })}
        {topic.closing && (
          <>
            <div className="h-4" />
            <p className="text-primary font-medium">{topic.closing}</p>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default KnowledgeTopic;
