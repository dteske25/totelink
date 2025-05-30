import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ToteForm, ToteFormData } from "../components/ToteForm";
import { getTote, updateTote } from "../database/queries";
import { useState } from "react";

export const Route = createFileRoute("/totes_/$toteId_/edit")({
  component: EditToteComponent,
  loader: async ({ params }) => {
    return getTote(params.toteId);
  },
});

function EditToteComponent() {
  const tote = Route.useLoaderData(); // tote is Tote | null
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ToteFormData) => {
    if (!tote?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      await updateTote(tote.id, { ...tote, ...data });
      navigate({ to: "/totes/$toteId", params: { toteId: tote.id } });
    } catch (err) {
      console.error("Failed to update tote:", err);
      setError("Failed to update tote. Please try again.");
    }
    setIsLoading(false);
  };

  if (!tote) {
    return (
      <div className="p-4 text-center text-error">
        Tote not found or failed to load.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Tote</h1>
      {error && <div className="mb-4 alert alert-error">{error}</div>}
      <ToteForm
        initialData={tote} // tote (Tote | null) is compatible with Partial<Tote> | undefined
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Save Changes"
      />
    </div>
  );
}
