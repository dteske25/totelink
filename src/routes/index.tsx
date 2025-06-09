import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Adjust height to account for the navbar */}
      <div className="hero min-h-[calc(100vh-4rem)]">
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
