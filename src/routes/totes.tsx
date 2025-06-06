import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { getTotes, createTote, Tote } from "../database/queries";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/totes")({
  component: RouteComponent,
  loader: async () => {
    return await getTotes();
  },
});

function RouteComponent() {
  const initialTotes: Tote[] | null = Route.useLoaderData();
  const [totes, setTotes] = useState(initialTotes || []);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        tote_name: toteName.trim(),
        tote_description: "",
      });

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
          <button onClick={handleAddClick} className="btn btn-soft">
            <Plus className="mr-2 size-6" />
            Add
          </button>
        )}
      </li>
      {totes?.map((t) => (
        <Link key={t.id} to="/totes/$toteId" params={{ toteId: t.id }}>
          <li className="list-row hover:bg-base-300">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
              />
            </div>
            <div>
              <div className="text-xl">{t.tote_name}</div>
              <div className="pt-2 text-xs font-semibold uppercase opacity-40">
                Created {format(t.created_on, "PP")}
              </div>
            </div>
            <p className="list-col-wrap text-xs">{t.tote_description}</p>
            {/* <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              >
              <path d="M6 3L20 12 6 21 6 3z"></path>
              </g>
              </svg>
              </button>
              <button className="btn btn-square btn-ghost">
              <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              >
              <g
              strokeLinejoin="round"
              strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </g>
            </svg>
          </button> */}
          </li>
        </Link>
      ))}
    </ul>
  );
}
