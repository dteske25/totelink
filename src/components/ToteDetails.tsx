import { ITote, IToteImage, uploadToteImage, deleteToteImage, getToteImageUrl } from "../database/queries";
import { formatDistanceToNow } from "date-fns";
import { InlineEdit } from "./InlineEdit";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ToteQRCode } from "./ToteQRCode";
import { IconPicker } from "./IconPicker";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

interface ToteDetailsProps {
  tote?: Partial<ITote> | null;
  isLoading?: boolean;
  onUpdateTote?: (id: string, updates: Partial<ITote>) => Promise<void>;
  images?: IToteImage[];
  onImagesChange?: () => void;
}

export function ToteDetails({ tote, onUpdateTote, images, onImagesChange }: ToteDetailsProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  if (!tote) {
    return <div className="p-4 text-center text-error">Tote not found.</div>;
  }
  const handleUpdateTitle = async (newTitle: string) => {
    if (!tote.id) return;
    await onUpdateTote?.(tote.id, { name: newTitle });
  };

  const handleUpdateDescription = async (newDescription: string) => {
    if (!tote.id) return;
    await onUpdateTote?.(tote.id, { description: newDescription });
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
                  value={tote.name || ""}
                  onSave={handleUpdateTitle}
                  placeholder="Enter tote name"
                  displayClassName="text-3xl font-bold"
                  editClassName="text-3xl font-bold"
                  maxLength={100}
                />
              </div>
              <InlineEdit
                value={tote.description || ""}
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
                      <span className="font-medium">Created:</span>
                      {formatDistanceToNow(new Date(tote.created_on), {
                        includeSeconds: true,
                        addSuffix: true,
                      })}
                    </div>
                  )}
                  {tote.updated_on && (
                    <div>
                      <span className="font-medium">Updated:</span>
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
                    toteName={tote.name || ""}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Images Section */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images?.map((image) => (
                <div key={image.id} className="relative group aspect-square bg-base-300 rounded-lg overflow-hidden">
                  <AsyncImage path={image.file_path} alt="Tote image" />
                  <button
                    onClick={async () => {
                      if (confirm("Delete this image?")) {
                        await deleteToteImage(image.id);
                        onImagesChange?.();
                      }
                    }}
                    className="absolute top-2 right-2 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
              <div className="aspect-square bg-base-300 rounded-lg flex items-center justify-center relative">
                {isUploading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 p-4 w-full h-full justify-center hover:bg-base-300/80 transition-colors">
                    <Upload className="size-6 opacity-50" />
                    <span className="text-xs opacity-50">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file && tote.id && user?.id) {
                          setIsUploading(true);
                          try {
                            await uploadToteImage(tote.id, file, user.id);
                            onImagesChange?.();
                          } catch (err) {
                            console.error(err);
                            alert("Failed to upload image");
                          } finally {
                            setIsUploading(false);
                          }
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AsyncImage({ path, alt }: { path: string; alt: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useState(() => {
    getToteImageUrl(path).then(setSrc);
  });

  if (!src) return <div className="w-full h-full animate-pulse bg-base-300" />;
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}
