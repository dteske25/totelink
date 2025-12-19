import { ITote, IToteImage, uploadToteImage, deleteToteImage, getToteImageUrl } from "../database/queries";
import { formatDistanceToNow } from "date-fns";
import { InlineEdit } from "./InlineEdit";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ToteQRCode } from "./ToteQRCode";
import { ToteItems } from "./ToteItems";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";


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
              <div className="flex items-start gap-6 rounded-xl border bg-muted/30 p-6 shadow-sm">
                {/* Cover Image Section */}
                <div className="mt-2 shrink-0">
                    <div className="relative group size-24 rounded-lg border bg-muted overflow-hidden">
                        {images && images.length > 0 ? (
                             <AsyncImage path={images[0].file_path} alt="Cover" />
                        ) : (
                             <div className="flex h-full w-full items-center justify-center bg-muted">
                                 <Upload className="size-8 text-muted-foreground/30" />
                             </div>
                        )}
                        
                        <label className={cn(
                            "absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity cursor-pointer",
                            (!images || images.length === 0) && "opacity-0 hover:opacity-100", // Show on hover if empty? No, always hidden unless hover or empty
                             "group-hover:opacity-100"
                        )}>
                            <Upload className="size-6 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">
                                {images && images.length > 0 ? "Change" : "Upload"}
                            </span>
                             <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file && tote.id && user?.id) {
                                      setIsUploading(true);
                                      try {
                                        // Delete existing images first to maintain single cover
                                        if (images) {
                                            for (const img of images) {
                                                await deleteToteImage(img.id);
                                            }
                                        }
                                        await uploadToteImage(tote.id, file, user.id);
                                        onImagesChange?.();
                                      } catch (err) {
                                        console.error(err);
                                      } finally {
                                        setIsUploading(false);
                                      }
                                    }
                                  }}
                                />
                        </label>
                         {isUploading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                                <Loader2 className="size-6 animate-spin text-white" />
                            </div>
                         )}
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                   <div className="flex items-start justify-between">
                      <div className="space-y-1 w-full">
                          <InlineEdit
                            value={tote.name || ""}
                            onSave={handleUpdateTitle}
                            placeholder="Enter tote name"
                            displayClassName="text-3xl font-bold tracking-tight"
                            editClassName="text-3xl font-bold font-inherit"
                            maxLength={100}
                          />
                           <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground">Category:</span>
                              <InlineEdit
                                value={tote.category || ""}
                                onSave={async (val) => { if(tote.id) await onUpdateTote?.(tote.id, { category: val }) }}
                                placeholder="Uncategorized"
                                displayClassName="text-sm text-primary font-medium hover:underline underline-offset-4"
                                editClassName="text-sm"
                                maxLength={50}
                              />
                           </div>
                      </div>
                   </div>
                   <InlineEdit
                    value={tote.description || ""}
                    onSave={handleUpdateDescription}
                    placeholder="Add a description..."
                    isMultiline={true}
                    displayClassName="text-muted-foreground leading-relaxed"
                    editClassName="text-base"
                    className="w-full pt-2 border-t mt-2"
                    maxLength={500}
                  />
                </div>
              </div>
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



          <ToteItems toteId={tote.id!} />

        </CardContent>
      </Card>
    </div>
  );
}

function AsyncImage({ path, alt }: { path: string; alt: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getToteImageUrl(path).then((url) => {
      if (mounted) setSrc(url);
    });
    return () => {
      mounted = false;
    };
  }, [path]);

  if (!src) return <div className="w-full h-full animate-pulse bg-base-300" />;
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}
