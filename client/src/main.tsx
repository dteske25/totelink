import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {
    auth: undefined,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth0();
  return <RouterProvider router={router} context={{ auth }} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-teske.us.auth0.com"
      clientId="clhmGuvXOsCRcuYH89pcqdH8g1wcO5cJ"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <InnerApp />
    </Auth0Provider>
  </StrictMode>,
);
