import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ToteForm, ToteFormData } from "../components/ToteForm";
import { createTote } from "../database/queries";
import { useState } from "react";

export const Route = createFileRoute("/totes_/new")({
  component: NewToteComponent,
});

function NewToteComponent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ToteFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTote = await createTote(data);
      if (newTote) {
        navigate({ to: "/totes/$toteId", params: { toteId: newTote.id } });
      } else {
        setError("Failed to create tote. No data returned.");
      }
    } catch (err) {
      console.error("Failed to create tote:", err);
      let errorMessage = "Failed to create tote. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Create New Tote</h1>
      {error && <div className="mb-4 alert alert-error">{error}</div>}
      <ToteForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Create Tote"
      />
    </div>
  );
}
