import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Link2, Brain, Power, Blocks, ChevronRight, CircleDashed } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const topics = [
  {
    slug: "how-your-system-learned-to-protect-you",
    title: "How your system learned to protect you",
    subtitle: "Why your patterns formed",
    icon: CircleDashed,
  },
  {
    slug: "neuroplasticity",
    title: "The science behind daily formation",
    subtitle: "How your system responds to repetition",
    icon: Brain,
  },
  {
    slug: "begin-with-stability",
    title: "Start from stability",
    subtitle: "Why prayer precedes change",
    icon: Power,
  },
  {
    slug: "return-to-truth",
    title: "Interrupting the pattern with Truth",
    subtitle: "How you signal safety to your system",
    icon: Zap,
  },
  {
    slug: "create-new-associations",
    title: "Creating new associations",
    subtitle: "How meaning begins to change",
    icon: Link2,
  },
  {
    slug: "how-transformation-happens",
    title: "The pattern of transformation",
    subtitle: "How change is formed over time",
    icon: Blocks,
  },
];

const Knowledge = () => {
  const navigate = useNavigate();

  return (
    <div className="screen-with-bottom-nav flex min-h-screen flex-col">
      <header className="px-5 pt-8 pb-6 content-container">
        <h1>Understanding the system</h1>
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

        <p className="text-xs leading-relaxed text-text-supporting/70 pt-12 pb-4 text-center">
          The Formation Arc is designed to support personal formation, nervous system awareness, and reflective practice. It is not intended to replace medical care, psychological treatment, therapy, or professional mental health support.
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Knowledge;
