import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <div className="hero h-100">
        <div className="hero-content text-center">
          <div className="max-w-sm">
            <h1 className="text-5xl font-bold">Totelink</h1>
            <p className="py-6">
              Smart, seamless inventory management for your totes, bins, and
              decor.
            </p>

            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
}
