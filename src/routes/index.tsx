import { useAuth0 } from "@auth0/auth0-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({
        to: "/totes",
      });
    }
  }, [isAuthenticated]);

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

            <button
              className="btn btn-primary"
              onClick={() => loginWithRedirect()}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
