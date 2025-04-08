import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/totes_/$toteId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const resp = await fetch(`/api/totes/${params.toteId}`);
    const result = await resp.text();
    console.log(result);
  },
});

function RouteComponent() {
  const { toteId } = Route.useParams();
  return <div>Hello "/totes/{toteId}"!</div>;
}
