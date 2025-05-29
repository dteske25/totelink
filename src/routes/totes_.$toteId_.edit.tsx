import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/totes_/$toteId_/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/totes/toteId/edit"!</div>;
}
