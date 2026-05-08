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
      "When we reorient ourselves to what God says about us, we interrupt destructive loops in our thinking and retrain the brain to respond to life in ways that better serve us.",
      "Each time you return you:",
      { list: [
        "interrupt negative cycles",
        "update expectations",
        "strengthen internal authority",
        "stabilize identity over time",
      ] },
      "When we return to updated expectations, we signal stability to the nervous system, allowing the mind to become receptive."
    ],
    closing: "A receptive system forms steadier expectations.",
  },
  "create-new-associations": {
    title: "Create new associations",
    subtitle: "Update meaning through memory",
    body: [
      "Your brain stores experiences as networks of meaning, making memory vital for setting and maintaining expectations.",
      "Remembrance is a divine principle Jesus taught us.",
      "Recalling a positive memory in your life is a powerful way to recall God’s faithfulness into remembrance, and enter into communion with Him.",
      "When a memory is recalled, the neural network connected to it becomes open to new association, responding in real time. As positive meaning expands, the brain registers safety and connection, producing DOSE chemistry.",
      "We begin to embody joy, health and grace with greater ease, until eventually, we are separated from trauma, disconnected from old patterns, and established on Truth.",
      "It’s important to know that when the nervous system has been under strain, creativity is obscured and access to memory can narrow.",
      "With practice, however, access widens.",
    ],
    closing: "What you reinforce becomes what your system expects.",
  },
  "neuroplasticity": {
    title: "The science behind neuroplasticity",
    subtitle: "Understand how your system responds",
    body: [
      "Every time you have a feeling, good or bad, a chemical is released into your system. This creates an emotional signature, a measurable frequency, that changes the body over time.",
      "Cortisol, adrenaline, and norepinephrine (CAN chemistry) are the stress hormones released into the body when we experience disorder.",
      "They create low frequency emotional signatures, which deplete our resources, often leading to a weakened immune system and eventually, chronic symptoms.",
      "Dopamine, oxytocin, serotonin, and endorphins (DOSE chemistry) are the feel-good hormones released into the body when we experience alignment.",
      "They create high frequency emotional signatures, which support and heal the body, and help us feel safe.",
    ],
    closing: "Postive repetition provides the nervous system with new, positive information, producing life-giving DOSE chemistry to counteract the effects of CAN chemistry stored in the body.",
  },
  "begin-with-stability": {
    title: "Begin with stability",
    subtitle: "Why prayer preceeds change",
    body: [
      "Your system responds to signals of safety before conscious thought fully forms.",
      "Much of what shapes fear or peace happens below conscious awareness, in systems designed to protect you.",
      "The nervous system responds strongly to signals of safety, connection, and support.",
      "Prayer communicates support to your system.",
    ],
    closing: "Before you begin your practice, give thanks, and entrust God with the outcomes of this process.",
  },
  "how-transformation-happens": {
    title: "How transformation happens",
    subtitle: "Focus, association, repetition",
    body: [
      "Neuroplasticity is established on three principles:",
      { heading: "FOCUS", text: "Focus on God and His promises. You are healed, accepted, whole, anointed, and precious in His sight." },
      { heading: "ASSOCIATION", text: "Replace old, unhealthy associations with Kingdom reality, by making an intentional choice to see yourself as a new creation, alive in victory." },
      { heading: "REPETITION", text: "Change requires repetition to strengthen new neural pathways. Each repetition builds on the last." },
      "When we apply this framework together with God by aligning with Truth, we break our agreements with the lies we’ve accepted.",
      "Repeated DOSE chemistry released into the body drives changes in the brain long term, and we begin to experience true transformation.",
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
          <ChevronLeft className="h-4 w-4" /> Understanding your divine design
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
