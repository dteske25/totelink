import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getTote, updateTote, Tote, UpdateToteData } from "../database/queries";
import { useState } from "react";
import { ToteDetails } from "../components/ToteDetails";

export const Route = createFileRoute("/totes_/$toteId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { toteId } = params;
    return await getTote(toteId);
  },
});

function RouteComponent() {
  const initialTote: Tote | null = Route.useLoaderData();
  const router = useRouter();
  const [tote, setTote] = useState(initialTote);

  if (!tote) {
    return <div className="p-4 text-center text-error">Tote not found.</div>;
  }

  const handleUpdateTote = async (
    id: string,
    updates: Partial<UpdateToteData>,
  ) => {
    try {
      const updatedTote = await updateTote(id, updates);
      setTote(updatedTote);

      await router.invalidate();
    } catch (error) {
      console.error("Error updating tote:", error);
      throw error;
    }
  };

  return <ToteDetails tote={tote} onUpdateTote={handleUpdateTote} />;
}
