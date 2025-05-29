import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { getTote, Tote } from "../database/queries";

export const Route = createFileRoute("/totes_/$toteId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { toteId } = params;
    return await getTote(toteId);
  },
});

function RouteComponent() {
  const tote: Tote | null = Route.useLoaderData();
  return (
    <div>
      {tote?.tote_name ?? "unknown"}
      <Link to="/totes/$toteId/edit" params={{ toteId: tote?.id }}>
        Edit
      </Link>
    </div>
  );
}
