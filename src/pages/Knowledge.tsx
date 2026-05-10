import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Link2, Brain, Anchor, Sparkles, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const topics = [
  {
    slug: "how-your-system-learned-to-protect-you",
    title: "How your system learned to protect you",
    subtitle: "Your thoughts create your reality",
    icon: AlarmClock,
  },
  {
    slug: "return-to-truth",
    title: " Interrupt the pattern with Truth",
    subtitle: "Truth interrupts patterns and signals safety",
    icon: ShieldCheck,
  },
  {
    slug: "create-new-associations",
    title: "Creating new associations",
    subtitle: "Update meaning through memory",
    icon: Link2,
  },
  {
    slug: "neuroplasticity",
    title: "The science behind neuroplasticity",
    subtitle: "Understand how your system responds",
    icon: Brain,
  },
  {
    slug: "begin-with-stability",
    title: "Begin with stability",
    subtitle: "Establish safety before change",
    icon: Anchor,
  },
  {
    slug: "how-transformation-happens",
    title: "How transformation happens",
    subtitle: "Focus, association, repetition",
    icon: Sparkles,
  },
];

const Knowledge = () => {
  const navigate = useNavigate();

  return (
    <div className="screen-with-bottom-nav flex min-h-screen flex-col">
      <header className="px-5 pt-8 pb-6 content-container">
        <h1>Knowledge</h1>
        <p className="text-text-supporting mt-2">
          How your mind, body, and faith work together to bring about lasting change
        </p>
      </header>

      <main className="flex-1 px-5 space-y-6 content-container">
        {topics.map((topic) => (
          <Card
            key={topic.slug}
            className="hover:border-primary/40 cursor-pointer"
            onClick={() => navigate(`/knowledge/${topic.slug}`)}
          >
            <CardHeader className="flex-row items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <topic.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg">{topic.title}</CardTitle>
                <CardDescription className="text-text-supporting text-sm">{topic.subtitle}</CardDescription>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-text-supporting/60" />
            </CardHeader>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Knowledge;
