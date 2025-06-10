import { Tote } from "../database/queries";
import { formatDistanceToNow } from "date-fns";
import { InlineEdit } from "./InlineEdit";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ToteQRCode } from "./ToteQRCode";
import { IconPicker } from "./IconPicker";

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
    await onUpdateTote?.(tote.id, { tote_name: newTitle });
  };

  const handleUpdateDescription = async (newDescription: string) => {
    if (!tote.id) return;
    await onUpdateTote?.(tote.id, { tote_description: newDescription });
  };
  const handleUpdateIcon = async (iconName: string) => {
    if (!tote.id) return;
    await onUpdateTote?.(tote.id, { icon: iconName });
  };

  return (
    <div className="container mx-auto">
      <div className="my-4">
        <Link to="/totes" className="btn mb-4 gap-2 btn-ghost btn-sm">
          <ArrowLeft className="size-4" />
          Back to Totes
        </Link>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center gap-4">
                <IconPicker
                  selectedIcon={tote.icon ?? null}
                  onIconSelect={handleUpdateIcon}
                />
                <InlineEdit
                  value={tote.tote_name || ""}
                  onSave={handleUpdateTitle}
                  placeholder="Enter tote name"
                  displayClassName="text-3xl font-bold"
                  editClassName="text-3xl font-bold"
                  maxLength={100}
                />
              </div>
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
            </div>
            <div className="flex flex-col gap-4 lg:col-span-1">
              <div className="border-l-0 lg:border-l lg:border-base-300 lg:pl-4">
                <div className="flex flex-col gap-1 text-xs font-semibold uppercase opacity-40">
                  {tote.created_on && (
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {formatDistanceToNow(new Date(tote.created_on), {
                        includeSeconds: true,
                        addSuffix: true,
                      })}
                    </div>
                  )}
                  {tote.updated_on && (
                    <div>
                      <span className="font-medium">Updated:</span>{" "}
                      {formatDistanceToNow(new Date(tote.updated_on), {
                        includeSeconds: true,
                        addSuffix: true,
                      })}
                    </div>
                  )}
                </div>
              </div>
              {tote.id && (
                <div className="border-l-0 lg:border-l lg:border-base-300 lg:pl-4">
                  <ToteQRCode
                    toteId={tote.id}
                    toteName={tote.tote_name || ""}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
