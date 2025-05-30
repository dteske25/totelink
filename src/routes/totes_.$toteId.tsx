import { createFileRoute, Link } from "@tanstack/react-router";
import { getTote, Tote } from "../database/queries";
import { format } from "date-fns";
import { Edit } from "lucide-react";

export const Route = createFileRoute("/totes_/$toteId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { toteId } = params;
    return await getTote(toteId);
  },
});

function RouteComponent() {
  const tote: Tote | null = Route.useLoaderData();

  if (!tote) {
    return <div className="p-4 text-center text-error">Tote not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h1 className="card-title text-3xl">{tote.tote_name}</h1>
            <Link
              to="/totes/$toteId/edit"
              params={{ toteId: tote.id }}
              className="btn btn-outline btn-primary"
            >
              <Edit className="mr-2 size-5" />
              Edit
            </Link>
          </div>

          {tote.tote_description && (
            <p className="mt-4 text-lg">{tote.tote_description}</p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="stat rounded-box bg-base-300 p-4">
              <div className="stat-title text-sm uppercase opacity-60">
                Created On
              </div>
              <div className="stat-value text-xl">
                {format(new Date(tote.created_on), "PPpp")}
              </div>
            </div>
            {tote.updated_on && (
              <div className="stat rounded-box bg-base-300 p-4">
                <div className="stat-title text-sm uppercase opacity-60">
                  Last Updated
                </div>
                <div className="stat-value text-xl">
                  {format(new Date(tote.updated_on), "PPpp")}
                </div>
              </div>
            )}
          </div>

          {/* Placeholder for items within the tote if applicable */}
          {/* <div className="mt-6">
            <h2 className="text-2xl font-semibold">Items in this Tote</h2>
             You can map through tote.items or similar here if that data exists 
          </div> */}
        </div>
      </div>
    </div>
  );
}
