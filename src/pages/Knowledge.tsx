import BottomNav from "@/components/BottomNav";

const Knowledge = () => {
  return (
    <div className="screen-with-bottom-nav flex min-h-screen flex-col">
      <header className="px-5 pt-8 pb-4 content-container">
        <h1>Knowledge</h1>
        <p className="text-text-supporting mt-2">
          Background, science, and guidance to deepen your practice.
        </p>
      </header>

      <main className="flex-1 px-5 content-container">
        <p className="text-text-body">Coming soon.</p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Knowledge;
