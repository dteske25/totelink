import { Tote } from "../database/queries";
import { formatDistanceToNow } from "date-fns";
import { InlineEdit } from "./InlineEdit";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ToteDetailsProps {
  tote?: Partial<Tote> | null;
  isLoading?: boolean;
  onUpdateTote?: (id: string, updates: Partial<Tote>) => Promise<void>;
}

export function ToteDetails({ tote, onUpdateTote }: ToteDetailsProps) {
  if (!tote) {
    return <div className="p-4 text-center text-error">Tote not found.</div>;
  }

  const handleUpdateTitle = async (newTitle: string) => {
    if (!tote.id) return;
    await onUpdateTote?.(tote.id, { ...tote, tote_name: newTitle });
  };

  const handleUpdateDescription = async (newDescription: string) => {
    if (!tote.id) return;
    await onUpdateTote?.(tote.id, {
      ...tote,
      tote_description: newDescription,
    });
  };
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/totes" className="btn mb-4 gap-2 btn-ghost btn-sm">
          <ArrowLeft className="size-4" />
          Back to Totes
        </Link>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <InlineEdit
            value={tote.tote_name || ""}
            onSave={handleUpdateTitle}
            placeholder="Enter tote name"
            displayClassName="text-3xl font-bold"
            editClassName="text-3xl font-bold"
            maxLength={100}
          />
          <InlineEdit
            value={tote.tote_description || ""}
            onSave={handleUpdateDescription}
            placeholder="Add a description"
            isMultiline={true}
            displayClassName="mt-4 text-lg"
            editClassName="mt-4"
            className="mt-4"
            maxLength={500}
          />
          <div className="mt-8 flex justify-end">
            <div className="flex flex-col gap-1 text-right text-xs font-semibold uppercase opacity-40">
              {tote.created_on && (
                <div>
                  Created{" "}
                  {formatDistanceToNow(new Date(tote.created_on), {
                    includeSeconds: true,
                    addSuffix: true,
                  })}
                </div>
              )}
              {tote.updated_on && (
                <div>
                  Updated{" "}
                  {formatDistanceToNow(new Date(tote.updated_on), {
                    includeSeconds: true,
                    addSuffix: true,
                  })}
                </div>
              )}
            </div>
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
