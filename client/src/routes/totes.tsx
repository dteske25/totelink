import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/totes")({
  component: RouteComponent,
  loader: async () => {
    const resp = await fetch(`/api/totes`);
    const result = await resp.json();
    console.log(result);
  },
});

function RouteComponent() {
  return <div>Hello "/totes"!</div>;
}
