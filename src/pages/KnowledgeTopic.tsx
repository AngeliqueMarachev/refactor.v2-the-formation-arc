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
      "It is following a learned prediction—trying to protect you based on what it has known before.",
      "Left unchallenged, these loops reinforce themselves.",
      "Reorientation interrupts this process.",
      "When you return to what is true, especially what God says about you, you introduce new information into the system.",
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
      "Safety is registered.",
      "Connection is restored.",
      "The body begins to shift its chemistry accordingly.",
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
    title: "The science behind daily formation",
    subtitle: "Understand how your system responds",
    body: [
      "Every time you have a feeling, good or bad, a chemical is released into your system. This creates an emotional signature, a measurable frequency, that changes the body over time.",
      "Thoughts, emotions, and memories are not just mental; they are biological events that shape how your body functions over time.",
      "Cortisol, adrenaline, and norepinephrine (CAN chemistry) are the stress hormones released into the body when we experience disorder.",
      "They create a low frequency emotional signature in the body.",
      "These states are useful in moments of danger, but when repeated, they keep the body in a state of strain.",
      "Over time, repeated stress signals can:",
      {
        list: [
          "deplete your resources",
          "disrupt regulation",
          "and contribute to ongoing physical and emotional symptoms",
        ],
      },
      "When your system registers safety, a different response is activated.",
      "Dopamine, oxytocin, serotonin, and endorphins (DOSE chemistry) are the feel-good hormones released into the body when we experience alignment.",
      "They create a high frequency emotional signature in the body.",
      "These support:",
      {
        list: [
          "regulation",
          "connection",
          "and repair within the body",
        ],
      },
      "Your system learns from what is repeated.",
      "If stress signals are frequent, the body begins to expect them.",
      "If signals of safety are repeated, the system begins to reorganize around them.",
      "Daily formation introduces consistent signals of safety.",
      "Through focused attention, reorientation, and memory, your system begins to experience steadier states more often.",
      "With repetition, this becomes familiar.",
      "The body shifts from expecting threat to recognizing stability.",
    ],
    closing: "Your system follows what it experiences most often.",
  },
  "begin-with-stability": {
    title: "Starting from the right place",
    subtitle: "Why prayer precedes change",
    body: [
      "Before your system can shift, it needs to register safety.",
      "Your body responds to signals of support before conscious thought fully forms.",
      "When you pause, even briefly, and turn toward God, something changes.",
      "The system begins to settle.",
      "The mind becomes more receptive.",
      "Prayer is not about saying the right words.",
      "It is a signal of connection.",
      "You do not need the right words.",
      "You do not need the right feeling.",
      "Pause.",
      "Give thanks.",
      "Entrust this moment to God.",
    ],
    closing: "Stability begins with what your system experiences as safe.",
  },
  "how-transformation-happens": {
    title: "How transformation happens",
    subtitle: "Change is not random",
    body: [
      "Your system follows a pattern, whether you are aware of it or not.",
      "Neuroplasticity works through three consistent principles.",
      {
        heading: "FOCUS",
        text: "What you give your attention to becomes active in your system. When your focus is directed toward what is true, particularly what God says about you, you begin to shift what your system responds to.",
      },
      {
        heading: "ASSOCIATION",
        text: "Your brain links meaning to experience. When a familiar moment is paired with a new understanding, the meaning attached to it begins to change. Old associations can be replaced when they are consistently met with Truth.",
      },
      {
        heading: "REPETITION",
        text: "What is repeated becomes reinforced. Each time you return to the same pattern, you strengthen the pathway connected to it. Over time, this becomes easier, faster, and more natural.",
      },
      "When these three work together, something changes.",
      "What once felt automatic begins to loosen.",
      "New patterns begin to form.",
      "You are not forcing transformation.",
      "You are training your system to recognize and respond to what is true.",
    ],
    closing: "Transformation is formed through what you consistently focus on, associate, and repeat.",
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
