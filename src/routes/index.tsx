import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

function IndexRoute() {
  return (
    <div>
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-muted/30 py-20 text-center">
        <div className="max-w-md px-6">
          <h1 className="text-5xl font-bold tracking-tight">Totelink</h1>
          <p className="py-6 text-muted-foreground text-lg">
            Smart, seamless inventory management for your totes, bins, and
            decor.
          </p>

          <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
        </div>
      </div>
    </div>
  );
}
