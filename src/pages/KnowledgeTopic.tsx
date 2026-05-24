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
      "Your nervous system cannot fully update while it still perceives constant threat. Before new patterns can form, the brain first needs experiences that signal enough safety to become receptive to change.",
      "When your mind becomes caught in a familiar spiral, it doesn't mean you are weak, irrational, or failing spiritually. Often, your system is doing what it previously learned was necessary for protection. The brain predicts from what it has practiced before.",
      "If fear, shame, pressure, rejection, danger, or self-protection have been repeatedly rehearsed, the nervous system begins expecting those experiences automatically. Over time, these reactions can become so familiar that they feel immediate and unquestionable.",
      "This is how loops form.",
      {
        group: [
          "A fearful thought creates emotional activation.",
          "The activation strengthens the thought.",
          "The thought reinforces the prediction.",
          "And the cycle repeats.",
        ],
      },
      "Left uninterrupted, the brain continues strengthening the same pathways through repetition.",
      "This is why awareness alone is often not enough to create change. The pattern must be interrupted. This is the purpose of reorientation. Reorientation interrupts automatic prediction before the spiral fully reinforces itself.",
      "Instead of continuing agreement with fear, you intentionally return to what is true:",
      {
        list: [
          "what is true about your identity",
          "what is true about the present moment",
          "what is true about your safety",
          "what is true beyond the fear narrative",
          "what is true about God",
        ],
      },
      "This is not denial. And it is not forced positivity. It is the intentional introduction of new information into the system.",
      "Each time you return to truth during activation, the brain encounters something unexpected. In neuroscience, this is sometimes called prediction error: the moment when the brain's fearful expectation is not fully confirmed. These moments matter because prediction error is one of the ways old pathways begin weakening and new learning becomes possible.",
      "Each return helps:",
      {
        list: [
          "interrupt automatic reinforcement",
          "reduce escalation",
          "update expectation",
          "strengthen internal leadership",
          "stabilize identity over time",
        ],
      },
      "At first, this may feel unfamiliar or difficult. Fear pathways often become deeply practiced. But repetition changes familiarity. Over time, the nervous system begins recognizing these repeated returns as safer, steadier, and more trustworthy than the old spiral.",
      {
        group: [
          "The mind becomes more receptive.",
          "The body becomes less reactive.",
          "New patterns become easier to access.",
        ],
      },
      "This is how stability develops.",
      "Not through force or striving.",
    ],
    closing: "Stability develops through repeated return to what is true until the system begins expecting steadiness more than fear.",
  },

  "create-new-associations": {
    title: "Creating new associations",
    subtitle: "How meaning begins to change",
    body: [
      "Your brain does not store experiences like files in a cabinet. It stores them as connected networks of emotion, meaning, sensation, expectation, and memory. What you live through does not simply disappear. Experiences become organized inside the nervous system in ways that shape:",
      {
        list: [
          "what feels safe",
          "what feels threatening",
          "what you expect from people",
          "what you expect from yourself",
          "and even what you expect from God",
        ],
      },
      "Over time, these experiences begin forming internal templates.",
      "A painful moment may teach:",
      {
        list: [
          "“I am alone.”",
          "“I am unsafe.”",
          "“I cannot rest.”",
          "“People will leave.”",
          "“I must stay guarded.”",
        ],
      },
      "These conclusions often form automatically, especially during overwhelming or emotionally significant moments. The nervous system continues predicting from them long after the moment has passed.",
      "But memory is not as fixed as many people assume.",
      "Each time a memory is recalled, the brain briefly reactivates the emotional network connected to it. For a short period, that memory becomes more flexible, responsive, and open to new association. This process is sometimes called memory reconsolidation. In simple terms, when a memory becomes active again, the meaning attached to it can begin to shift.",
      "This matters because the nervous system does not only respond to events themselves. It responds to what those events came to mean.",
      "When an old memory is revisited from a steadier, safer, more grounded state, something important can begin happening. The same experience may no longer carry only fear, shame, isolation, or helplessness.",
      {
        group: [
          "New perspective becomes possible.",
          "New associations begin forming.",
        ],
      },
      "The nervous system starts learning:",
      {
        list: [
          "“Perhaps I was not abandoned.”",
          "“Perhaps I was stronger than I realized.”",
          "“Perhaps the story was not as hopeless as it once felt.”",
          "“Perhaps this moment does not define my identity.”",
        ],
      },
      "This is why remembrance matters. Throughout Scripture, remembrance was never merely intellectual recall. It was relational reorientation. Again and again, God instructed His people to remember:",
      {
        list: [
          "His faithfulness",
          "His nearness",
          "His provision",
          "His presence within difficult seasons",
        ],
      },
      "Why? Because remembrance reshapes interpretation. When you bring a memory into awareness with God, you are not pretending the pain did not happen. You are allowing the memory to be seen from a wider and steadier perspective than the one your nervous system originally formed under fear, shame, or survival.",
      "As meaning begins to widen, the nervous system responds.",
      {
        group: [
          "The body registers increased safety.",
          "Connection becomes more available.",
          "The system becomes less organized around threat alone.",
        ],
      },
      "Over time, repeated experiences like this begin creating new associative pathways. What once triggered contraction may begin carrying less fear. What once reinforced helplessness may begin reinforcing steadiness instead.",
      "At first, many people struggle to access memory clearly. This is common. When the nervous system has lived under prolonged strain, stress, or protection, access to memory can feel distant, fragmented, or emotionally flat. Contraction narrows access. But with gentleness and repetition, access often begins widening again.",
      {
        group: [
          "What once felt unreachable becomes easier to revisit.",
          "What once felt emotionally fixed begins becoming more flexible.",
          "What once carried only fear begins holding new meaning as well.",
        ],
      },
      "The past is not erased. But the meaning attached to it does not have to remain frozen forever.",
    ],
    closing: "Meaning changes through what the nervous system repeatedly revisits with safety, steadiness, and truth.",
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
      "Before the brain can learn something new, the nervous system first needs to register enough safety to become receptive.",
      "When the body feels highly threatened, survival responses become prioritized. The system narrows its focus toward:",
      {
        list: [
          "protection",
          "urgency",
          "prediction",
          "control",
          "self-preservation",
        ],
      },
      "In these states, it becomes harder to:",
      {
        list: [
          "think clearly",
          "reflect honestly",
          "receive comfort",
          "feel connected",
          "remain present",
        ],
      },
      "This is why lasting change rarely begins through pressure, fear, striving, or self-condemnation.",
      "The nervous system learns best from steadiness. Even brief moments of safety and connection can begin shifting the body into a more receptive state. This is one reason prayer matters.",
      {
        group: [
          "Not because you say the perfect words.",
          "Not because you force the right emotions.",
          "Not because God only responds when you perform correctly.",
        ],
      },
      "But because turning toward the Creator interrupts isolation.",
      {
        group: [
          "It signals relationship.",
          "Connection.",
          "Support.",
          "Nearness.",
        ],
      },
      "And the body responds to those signals.",
      "Research consistently shows that the nervous system is deeply shaped by attachment, connection, and perceived support. Your body often responds to relational safety before conscious thought fully forms. This is why even a brief pause can matter.",
      {
        group: [
          "A moment of gratitude.",
          "A quiet prayer.",
          "A simple acknowledgment of a loving presence.",
        ],
      },
      "These moments can begin reducing internal threat signaling and increasing receptivity within the system.",
      {
        group: [
          "The mind becomes less braced.",
          "The body softens slightly.",
          "Attention becomes more open.",
        ],
      },
      "This does not mean all fear disappears instantly. It means the nervous system is no longer relating to the moment entirely alone.",
      "Prayer is not performance. It is relational orientation.",
      "You do not need the perfect words, or perfect emotional state. You do not need to force certainty. You can simply pause. Breathe. Give thanks for one thing and trust that you are not alone.",
      "Over time, repeated moments of connection begin teaching the nervous system something important: You are not abandoned inside your experience.",
    ],
    closing: "From that place of increasing steadiness, formation becomes possible.",
  },

  "how-transformation-happens": {
    title: "The pattern of transformation",
    subtitle: "How change is formed over time",
    body: [
      "Your nervous system is always being shaped by patterns. Every thought you repeatedly return to, every emotional reaction you rehearse, every meaning you reinforce, and every expectation you carry teaches your brain something about how to move through life. Over time, these patterns become increasingly automatic.",
      "This is why certain fears, reactions, identities, and habits can begin feeling deeply ingrained. The brain strengthens what it practices repeatedly.",
      "The process known as neuroplasticity is the brain's ability to adapt, reorganize, and form new pathways through experience and repetition.",
      "While change is complex, much of transformation follows three consistent principles:",
      {
        heading: "FOCUS",
        text: "Whatever consistently holds your attention becomes more active within the nervous system.",
      },
      "The brain pays special attention to what feels emotionally important, threatening, meaningful, or repeatedly rehearsed. This means attention is never neutral. If your attention remains fixed on fear, shame, danger, pressure, or self-condemnation, the nervous system continues strengthening those pathways. But attention can also be redirected.",
      "When you intentionally return your focus toward:",
      {
        list: [
          "truth",
          "steadiness",
          "safety",
          "connectedness",
          "grounded identity",
        ],
      },
      "the brain begins activating different networks instead.",
      "Over time, what you repeatedly focus on becomes easier for the system to access automatically.",
      {
        heading: "ASSOCIATION",
        text: "The brain constantly links meaning to experience. A single moment can become connected to:",
      },
      {
        list: [
          "fear",
          "rejection",
          "safety",
          "shame",
          "belonging",
          "danger",
          "peace",
        ],
      },
      "Over time, these associations begin shaping how you interpret future experiences. This is why two people can live through similar situations yet carry very different internal expectations afterward.",
      "But associations are not completely fixed.",
      "When an old experience becomes repeatedly paired with new understanding, increased safety, grounded truth, or steadier interpretation, the meaning attached to it can begin changing.",
      "This is how old patterns slowly loosen.",
      "The nervous system starts learning:",
      "\"This moment may not mean what I once believed it meant.\"",
      {
        heading: "REPETITION",
        text: "Whatever is repeated becomes reinforced.",
      },
      "Each time the brain runs the same emotional, mental, or behavioral pathway, that pathway strengthens. This is true for fear patterns, but it is also true for healing, steadiness, identity, and regulation.",
      "At first, new pathways may feel unfamiliar or difficult to access. Old reactions often feel easier simply because they have been rehearsed longer. But repetition changes familiarity.",
      "With enough repeated return, new responses become:",
      {
        list: [
          "easier",
          "faster",
          "more natural",
          "more automatic over time",
        ],
      },
      "This is how transformation becomes embodied instead of temporary.",
      "When focus, association, and repetition begin working together, something shifts.",
      {
        group: [
          "What once felt automatic begins loosening.",
          "Old expectations become less dominant.",
          "New pathways begin strengthening.",
        ],
      },
      "This is not forced transformation. It is the gradual retraining of the nervous system through repeated experiences of truth, safety, steadiness, and aligned identity.",
      "Transformation is not formed in one moment.",
    ],
    closing: "Transformation is formed through what you consistently focus on, associate, and repeat over time.",
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
