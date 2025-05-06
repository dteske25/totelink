import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/totes")({
  component: RouteComponent,
  loader: async () => {},
});

function RouteComponent() {
  return <div>Hello "/totes"!</div>;
}
