import { ITote, IToteImage, uploadToteImage, deleteToteImage, getToteImageUrl } from "../database/queries";
import { formatDistanceToNow } from "date-fns";
import { InlineEdit } from "./InlineEdit";
import { ArrowLeft, Upload, Trash2, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ToteQRCode } from "./ToteQRCode";
import { IconPicker } from "./IconPicker";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


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
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="my-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/totes" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Totes
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center gap-4">
                <IconPicker
                  selectedIcon={tote.icon ?? null}
                  onIconSelect={handleUpdateIcon}
                />
                <div className="flex-1">
                  <InlineEdit
                    value={tote.name || ""}
                    onSave={handleUpdateTitle}
                    placeholder="Enter tote name"
                    displayClassName="text-3xl font-bold"
                    editClassName="text-3xl font-bold font-inherit"
                    maxLength={100}
                  />
                </div>
              </div>
              <InlineEdit
                value={tote.description || ""}
                onSave={handleUpdateDescription}
                placeholder="Add a description"
                isMultiline={true}
                displayClassName="text-lg text-muted-foreground"
                editClassName="text-lg"
                className="w-full"
                maxLength={500}
              />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-1">
              <div className="border-l-0 lg:border-l lg:pl-6 space-y-4">
                <div className="flex flex-col gap-1 text-xs font-semibold uppercase text-muted-foreground/60">
                  {tote.created_on && (
                    <div>
                      <span className="font-medium text-foreground">Created:</span>{" "}
                      {formatDistanceToNow(new Date(tote.created_on), {
                        includeSeconds: true,
                        addSuffix: true,
                      })}
                    </div>
                  )}
                  {tote.updated_on && (
                    <div>
                      <span className="font-medium text-foreground">Updated:</span>{" "}
                      {formatDistanceToNow(new Date(tote.updated_on), {
                        includeSeconds: true,
                        addSuffix: true,
                      })}
                    </div>
                  )}
                </div>
              </div>
              {tote.id && (
                <div className="border-l-0 lg:border-l lg:pl-6">
                  <ToteQRCode
                    toteId={tote.id}
                    toteName={tote.name || ""}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Images Section */}
          <div className="mt-10 border-t pt-8">
            <h3 className="text-lg font-bold mb-6">Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images?.map((image) => (
                <div key={image.id} className="relative group aspect-square bg-muted rounded-lg overflow-hidden border">
                  <AsyncImage path={image.file_path} alt="Tote image" />
                  <Button
                    onClick={async () => {
                      if (confirm("Delete this image?")) {
                        await deleteToteImage(image.id);
                        onImagesChange?.();
                      }
                    }}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              ))}
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative border border-dashed hover:bg-muted/80 transition-colors">
                {isUploading ? (
                  <Loader2 className="animate-spin text-muted-foreground" />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 p-4 w-full h-full justify-center">
                    <Upload className="size-6 text-muted-foreground/50" />
                    <span className="text-xs text-muted-foreground/50 font-medium">Upload</span>
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
        </CardContent>
      </Card>
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
