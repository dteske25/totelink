import {
  createRootRouteWithContext,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Layout } from "../components/Layout";

import useAuth from "../hooks/useAuth";

interface IRouterContext {}

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: () => {
    const { session } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    if (session && pathname === "/") {
      navigate({ to: "/totes", replace: true });
    }

    // if (!session && pathname !== "/") {
    //   navigate({ to: "/", replace: true });
    // }

    return (
      <>
        <Layout />
        <TanStackRouterDevtools />
      </>
    );
  },
});
