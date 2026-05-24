import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type TopicBlock = string | { heading: string; text: string } | { list: string[] } | { group: string[] };

const content: Record<string, { title: string; subtitle: string; body: TopicBlock[]; closing?: string }> = {
  "how-your-system-learned-to-protect-you": {
    title: "How your system learned to protect you",
    subtitle: "Why your patterns formed",
    body: [
      "Your nervous system is always learning from experience. Every difficult season, painful relationship, repeated stressor, or emotionally overwhelming moment teaches your brain something about the world. Over time, your system begins asking questions like:",
      {
        list: [
          "Am I safe here?",
          "Can I relax?",
          "Do I need to stay alert?",
          "What should I expect next?",
        ],
      },
      "The brain is designed to learn from what feels emotionally important. So when experiences feel painful, unpredictable, lonely, frightening, or unsafe, your nervous system adapts in order to protect you.",
      "This is not weakness.",
      "It is survival intelligence.",
      "For some people, this adaptation happens after a major traumatic event. For others, it forms slowly through years of pressure, criticism, instability, fear, emotional neglect, or chronic stress. Eventually, the brain stops treating these responses as temporary, and begins processing them as necessary. This is how protective patterns form.",
      {
        group: [
          "Your system learns to scan for danger before danger arrives.",
          "It learns to anticipate rejection before connection.",
          "It learns to brace before resting.",
          "It learns to stay prepared instead of settled.",
        ],
      },
      "At first, these patterns may have genuinely helped you survive difficult environments. But what protects us in one season can begin limiting us in another. Over time, repeated thoughts, emotional reactions, stress responses, and behaviors become reinforced through repetition.",
      "The brain strengthens whatever it practices most often. This is why certain reactions can begin feeling automatic. You may notice:",
      {
        list: [
          "overthinking",
          "fear of failure",
          "emotional withdrawal",
          "people-pleasing",
          "chronic tension",
          "difficulty resting",
          "feeling constantly “on”",
          "spiraling thoughts",
          "physical symptoms under stress",
        ],
      },
      "These responses are not random. They are learned protective strategies. Your nervous system is responding according to what it previously learned was necessary for survival.",
      "One of the most important things to understand is this: The brain does not only react to the present moment. It predicts from the past.",
      "If your system has spent years expecting danger, disappointment, shame, abandonment, or pressure, it can begin responding to those possibilities before they even happen.",
      "This is why the body can react strongly even when part of you logically knows you are safe. Your system is forecasting from old learning.",
      "But learned patterns are not permanent. The brain was designed to adapt. Through repeated new experiences, new interpretations, and steadier responses, it can begin updating what it expects. This process is known as neuroplasticity.",
      "With repetition, the brain can slowly weaken old pathways and strengthen new ones. Fear does not have to remain the primary narrator of your experience.",
    ],
    closing: "What was shaped through repetition can also be reshaped through repetition.",
  },

  "return-to-truth": {
    title: "Interrupting the pattern with Truth",
    subtitle: "How you signal safety to your system",
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
    subtitle: "How meaning begins to change",
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
    subtitle: "How your system responds to repetition",
    body: [
      "Your nervous system is constantly learning from what you repeatedly experience. Every thought, emotional reaction, memory, and interpretation sends signals through the body. These experiences are not only psychological. They are biological.",
      "When the brain perceives stress, fear, danger, pressure, or uncertainty, it activates protective survival responses. Stress chemicals such as cortisol, adrenaline, and norepinephrine (known as CAN chemistry) are released to help the body stay alert and prepared.",
      "In moments of real danger, this response is protective. It helps us react quickly, solve problems, and survive difficult situations. But when these stress responses become frequent, the nervous system can begin treating them as normal. Over time, the body becomes increasingly organized around vigilance, contraction, urgency, and prediction of threat. They create a low frequency emotional signature in the body.",
      "Over time, repeated stress activation can contribute to:",
      {
        list: [
          "chronic tension",
          "hypervigilance",
          "emotional reactivity",
          "exhaustion",
          "difficulty resting",
          "ongoing physical and emotional strain",
        ],
      },
      "The nervous system adapts to what it experiences repeatedly. This is one of the central principles behind neuroplasticity. Whatever the brain rehearses most often becomes more familiar, more automatic, and more expected over time.",
      "But the same principle that reinforces stress can also strengthen steadiness.",
      "When the nervous system experiences safety, connection, meaning, relief, joy, or emotional stability, a different biological response begins to activate. Chemicals such as dopamine, oxytocin, serotonin, and endorphins (referred to as DOSE chemistry) help support regulation, repair, bonding, motivation, and wellbeing within the body.",
      "These experiences shape the nervous system too. They create a high frequency emotional signature as the body becomes increasingly organized around connection, openness, steadiness, and safety. Over time, the nervous system begins learning from these experiences as well.",
      "This is why repetition matters. Your system gradually becomes shaped by what it experiences most often.",
      {
        group: [
          "If stress and fear are constantly rehearsed, the body begins expecting them.",
          "If steadiness and safety are repeatedly experienced, the nervous system slowly begins reorganizing around those states instead.",
        ],
      },
      "This is where daily practice becomes important.",
      "Daily formation is not about forcing positive thinking or pretending difficult emotions do not exist. It is about repeatedly introducing the nervous system to steadier patterns through:",
      {
        list: [
          "reorientation",
          "focused attention",
          "memory recall",
          "grounded reflection",
          "repeated return",
        ],
      },
      "At first, these steadier states may feel unfamiliar as stress has been rehearsed for years. But with repetition, the brain slowly begins updating what it expects. The body becomes less organized around constant threat and more capable of recognizing stability.",
      "This is how formation happens.",
      "Not through one dramatic breakthrough, but through repeated experiences that gradually reshape perception, expectation, and response over time.",
    ],
    closing: "Your system follows what it experiences most often.",
  },

  "begin-with-stability": {
    title: "Start from stability",
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
    title: "The pattern of transformation",
    subtitle: "How change is formed over time",
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
          if ("group" in block) {
            return (
              <div key={i} className="space-y-1 text-text-body">
                {block.group.map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
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
