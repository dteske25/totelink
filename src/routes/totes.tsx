import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { getTotes, createTote, ITote } from "../database/queries";
import { Plus } from "lucide-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { IconHelper } from "../components/IconPicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
      const newTote = await createTote(
        {
          name: toteName.trim(),
          description: "",
        },
        user?.id || "",
      );

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
    <ul className="flex flex-col gap-2 rounded-lg border bg-card text-card-foreground shadow-sm">
      <li className="flex items-center p-4 pb-2">
        <span className="text-xs tracking-wide text-muted-foreground/60">Your totes</span>
      </li>
      <li className="flex items-center p-4">
        {isCreating ? (
          <div className="flex w-full items-center gap-2">
            <Input
              type="text"
              placeholder="Enter tote name"
              className="flex-1"
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
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
          </div>
        ) : (
          <Button
            onClick={handleAddClick}
            variant="default"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 size-4" />
            Add
          </Button>
        )}
      </li>
      {totes?.map((t) => {
        return (
          <Link key={t.id} to="/totes/$toteId" params={{ toteId: t.id }}>
            <li className="group flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <IconHelper name={t.icon} className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-lg">{t.name}</div>
                  <div className="text-xs text-muted-foreground uppercase">
                     Created {format(t.created_on, "PP")}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground truncate max-w-[200px]">{t.description}</p>
            </li>
          </Link>
        );
      })}
    </ul>
  );
}
