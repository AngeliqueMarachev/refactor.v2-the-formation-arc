import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type TopicBlock = string | { heading: string; text: string } | { list: string[] };

const content: Record<string, { title: string; subtitle: string; body: TopicBlock[]; closing?: string }> = {
  "how-your-system-learned-to-protect-you": {
    title: "How your system learned to protect you",
    subtitle: "Your thoughts create your reality",
    body: [
      "Your life experiences shape your interpretation of the world.",
      "Your thoughts create your reality, upholding this unique interpretation.",
      "Over time, your brain learns patterns to protect you, scanning for danger and preparing you to respond.",
      "This design is not working against you. On the contrary it is working to keep you safe.",

      "Traumatic events or prolonged stress can train your system to be on high alert.",
      "What once helped you survive can become your default way of moving through the world.",
      "These patterns become embedded, manifesting as physical structures in the brain and strongholds in our lives.",
      "They are reinforced through repetition until they feel automatic, shaping your thoughts, your reactions, and even your body.",
      "What you experience today is often not the present moment, but a prediction based on what has been learned before.",
      "Coping mechanisms, limiting beliefs, emotional walls, and even physical symptoms are not random.",
      "They are survival strategies erected by the brain in an effort to ensure your survival.",
      "Your system is responding exactly as it was trained to.",
      "But what was learned is not not permanent. With steady repetition, the brain can update what it expects.",
      "It can begin to register safety again.",
      "This process is known as neuroplasticity.",
      "And when your system is repeatedly aligned with what is true, we break our agreements with the lies we’ve accepted.",
    ],
    closing: "What was formed through experience can be reshaped through repetition.",
  },

  "return-to-truth": {
    title: "Interrupt the pattern with Truth",
    subtitle: "Use Truth to interrupt patterns and signal safety",
    body: [
      "Your system cannot update while it still perceives threat.",
      "Before new patterns can form, your brain must first register safety.",
      "When your mind is caught in a familiar loop, it is not choosing poorly.",
      "It is following a learned prediction, trying to protect you based on what it learned in the past.",
      "Left unchallenged, these loops reinforce themselves, becoming stronger and easier to access, until eventually, become the default.",
      "Reorientation interrupts this process.",
      "When you return to what is true, you override these loops with updated information.",
      "This is not just a shift in thinking. It is a signal.",
      "Each time you return you:",
      {
        list: [
          "interrupt negative cycles",
          "update expectations",
          "strengthen internal authority",
          "stabilize identity over time",
        ],
      },
      "With repetition, your system begins to recognize these signals as safe.",
      "The mind becomes more receptive. New patterns form more easily.",
    ],
    closing: "Stability is not forced. It is learned through what you repeatedly return to.",
  },

  "create-new-associations": {
    title: "Creating new associations",
    subtitle: "Update meaning through memory",
    body: [
      "Your brain stores experience as networks of meaning.",
      "What you have lived through does not just disappear. It is organized, connected, and remembered in ways that shape what you expect from life.",
      "Memory is not static: Each time you return to a moment, it becomes active again, open, responsive, and capable of change.",
      "When a memory is recalled in a steadier state, something shifts.",
      "The same experience can begin to carry a different meaning.",
      "New associations form when an old memory is paired with a new sense of safety.",
      "This is why remembrance matters.",
      "Remembrance is a divine principle Jesus taught us.",
      "When you bring a memory into awareness with God, you are not just remembering what happened.",
      "You are allowing new meaning to emerge, grounded in truth, not in what was once concluded.",
      "As meaning expands, the system responds.",
      "Safety is registered. Connection is restored. The body begins to shift its chemistry accordingly.",
      "With repetition, these new associations begin to take hold.",
      "What once triggered contraction can begin to signal stability.",
      "What once reinforced fear can begin to reinforce truth.",
      "It is common, at first, to struggle to access memory.",
      "When the nervous system has been under strain, recall can feel distant or unclear.",
      "But with practice, access widens.",
      "What was once difficult to reach becomes more available.",
      "What was once fixed begins to change.",
    ],
    closing: "Meaning is not locked in the past. It is reshaped by what you return to with safety.",
  },
  neuroplasticity: {
    title: "The science behind neuroplasticity",
    subtitle: "Understand how your system responds",
    body: [
      "Every time you have a feeling, good or bad, a chemical is released into your system. This creates an emotional signature, a measurable frequency, that changes the body over time.",
      "Cortisol, adrenaline, and norepinephrine (CAN chemistry) are the stress hormones released into the body when we experience disorder.",
      "They create low frequency emotional signatures, which deplete our resources, often leading to a weakened immune system and eventually, chronic symptoms.",
      "Dopamine, oxytocin, serotonin, and endorphins (DOSE chemistry) are the feel-good hormones released into the body when we experience alignment.",
      "They create high frequency emotional signatures, which support and heal the body, and help us feel safe.",
    ],
    closing:
      "Postive repetition provides the nervous system with new, positive information, producing life-giving DOSE chemistry to counteract the effects of CAN chemistry stored in the body.",
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
      "Change using neuroplasticity is built on three principles: ",
      {
        heading: "FOCUS",
        text: "Focus on God and His promises. You are healed, accepted, whole, anointed, and precious in His sight.",
      },
      {
        heading: "ASSOCIATION",
        text: "Replace old, unhealthy associations with Kingdom reality, by making an intentional choice to see yourself as a new creation, alive in victory.",
      },
      {
        heading: "REPETITION",
        text: "Change requires repetition to strengthen new neural pathways. Each repetition builds on the last.",
      },
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
          <ChevronLeft className="h-4 w-4" /> Knowledge
        </button>
        <h1>{topic.title}</h1>
        <p className="text-text-supporting mt-2">{topic.subtitle}</p>
      </header>

      <main className="flex-1 px-5 content-container space-y-4">
        {topic.body.map((block, i) => {
          if (typeof block === "string") {
            return (
              <p key={i} className="text-text-body">
                {block}
              </p>
            );
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
