import { createRootRouteWithContext, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Layout } from "../components/Layout";
import { User } from "@auth0/auth0-react";

interface IRouterContext {
  auth?: {
    error?: Error;
    isAuthenticated: boolean;
    isLoading: boolean;
    user?: User;
  };
}

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: () => (
    <>
      <Layout />
      <TanStackRouterDevtools />
    </>
  ),
  beforeLoad: ({ context, location }) => {
    if (location.pathname !== "/") {
      if (!context.auth?.isAuthenticated) {
        throw redirect({
          to: "/",
        });
      }
    }
  },
});
