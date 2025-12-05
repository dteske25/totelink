import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { getTotes, createTote, ITote } from "../database/queries";
import { Plus } from "lucide-react";
import { useState } from "react";
import { getIconComponent } from "../utils/iconUtils";
import useAuth from "../hooks/useAuth";

export const Route = createFileRoute("/totes")({
  component: TotesRoute,
  loader: async () => {
    return await getTotes();
  },
});

function TotesRoute() {
  const initialTotes: ITote[] | null = Route.useLoaderData();
  const [totes, setTotes] = useState(initialTotes || []);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleAddClick = () => {
    setIsCreating(true);
  };

  const handleCreateTote = async (toteName: string) => {
    if (!toteName.trim()) {
      setIsCreating(false);
      return;
    }

    setIsLoading(true);
    try {
      const newTote = await createTote({
        name: toteName.trim(),
        description: "",
      }, user?.id || "");

      if (newTote) {
        setTotes([newTote, ...totes]);
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Failed to create tote:", error);
      setIsCreating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  return (
    <ul className="list rounded-box bg-base-200 shadow-lg">
      <li className="flex items-center p-4 pb-2">
        <span className="text-xs tracking-wide opacity-60">Your totes</span>
      </li>
      <li className="flex items-center p-4">
        {isCreating ? (
          <>
            <input
              type="text"
              placeholder="Enter tote name"
              className="input flex-1 p-4 input-primary"
              autoFocus
              disabled={isLoading}
              onBlur={(e) => handleCreateTote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateTote(e.currentTarget.value);
                } else if (e.key === "Escape") {
                  handleCancelCreate();
                }
              }}
            />
            {isLoading && (
              <span className="loading loading-sm loading-spinner"></span>
            )}
          </>
        ) : (
          <button
            onClick={handleAddClick}
            className="btn btn-soft btn-sm btn-primary"
          >
            <Plus className="mr-2 size-6" />
            Add
          </button>
        )}
      </li>
      {totes?.map((t) => {
        const IconComponent = getIconComponent(t.icon);
        return (
          <Link key={t.id} to="/totes/$toteId" params={{ toteId: t.id }}>
            <li className="list-row hover:bg-base-300">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-box bg-primary/10">
                  <IconComponent className="size-6 text-primary" />
                </div>
              </div>
              <div>
                <div className="text-xl">{t.name}</div>
                <div className="pt-2 text-xs font-semibold uppercase opacity-40">
                  Created {format(t.created_on, "PP")}
                </div>
              </div>
              <p className="list-col-wrap text-xs">{t.description}</p>
            </li>
          </Link>
        );
      })}
    </ul>
  );
}
