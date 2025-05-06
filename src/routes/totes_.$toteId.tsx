import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/totes_/$toteId")({
  component: RouteComponent,
  loader: async () => {},
});

function RouteComponent() {
  const { toteId } = Route.useParams();
  return <div>Hello "/totes/{toteId}"!</div>;
}
