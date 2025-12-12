import { useState, useEffect, useCallback } from "react";
import {
  IToteItem,
  getToteItems,
  createToteItem,
  updateToteItem,
  deleteToteItem,
  IToteItemImage,
  uploadItemImage,
  getItemImages,
  deleteItemImage,
  getToteImageUrl
} from "../database/queries";
import { Loader2, Plus, Trash2, Check, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useAuth from "../hooks/useAuth";

interface ToteItemsProps {
  toteId: string;
}

export function ToteItems({ toteId }: ToteItemsProps) {
  const [items, setItems] = useState<IToteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();

  const loadItems = useCallback(async () => {
    if (!toteId) return;
    try {
      const data = await getToteItems(toteId);
      setItems(data);
    } catch (error) {
      console.error("Failed to load items", error);
    } finally {
      setLoading(false);
    }
  }, [toteId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    setIsAdding(true);
    try {
      const newItem = await createToteItem(toteId, newItemName.trim());
      setItems([...items, newItem]);
      setNewItemName("");
    } catch (error) {
      console.error("Failed to add item", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleCheck = async (item: IToteItem) => {
    const updated = !item.checked;
    // Optimistic update
    setItems(items.map((i) => (i.id === item.id ? { ...i, checked: updated } : i)));
    try {
      await updateToteItem(item.id, { checked: updated });
    } catch (error) {
      // Revert on error
      console.error("Failed to update item", error);
      setItems(items.map((i) => (i.id === item.id ? { ...i, checked: !updated } : i)));
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteToteItem(itemId);
      setItems(items.filter((i) => i.id !== itemId));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Contents</h3>
        <span className="text-sm text-muted-foreground">{items.length} items</span>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add new item..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          disabled={isAdding}
        />
        <Button onClick={handleAddItem} disabled={isAdding || !newItemName.trim()}>
          {isAdding ? <Loader2 className="animate-spin size-4" /> : <Plus className="size-4" />}
          <span className="ml-2 hidden sm:inline">Add Item</span>
        </Button>
      </div>

      <div className="min-h-[100px] flex flex-col gap-2">
      {loading ? (
        <div className="flex justify-center p-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground/50" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed bg-muted/10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Plus className="size-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium">Your tote is empty</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Start adding items to keep track of what's inside.
            </p>
        </div>
      ) : (
        items.map((item) => (
          <ItemRow key={item.id} item={item} onDelete={() => handleDeleteItem(item.id)} onToggle={() => handleToggleCheck(item)} userId={user?.id} />
        ))
      )}
      </div>
    </div>
  );
}

function ItemRow({ item, onDelete, onToggle, userId }: { item: IToteItem; onDelete: () => void; onToggle: () => void; userId?: string }) {
    const [images, setImages] = useState<IToteItemImage[]>([]);
    const [showImages, setShowImages] = useState(false);
    const [uploading, setUploading] = useState(false);



    useEffect(() => {
        // Initial load check if we should show indicator
        getItemImages(item.id).then(data => {
            setImages(data);
        });
    }, [item.id]);

    const handleUpload = async (file: File) => {
        if (!userId) return;
        setUploading(true);
        try {
            await uploadItemImage(item.id, file, userId);
            const data = await getItemImages(item.id);
            setImages(data);
            setShowImages(true);
        } catch(e) {
            console.error(e);
        } finally {
            setUploading(false);
        }
    }

    const handleDeleteImage = async (imageId: string) => {
        if(!confirm("Delete image?")) return;
        try {
            await deleteItemImage(imageId);
            const data = await getItemImages(item.id);
            setImages(data);
        } catch(e) { console.error(e) }
    }

  return (
    <div className={cn("group flex flex-col gap-2 rounded-xl border p-4 bg-card transition-all hover:shadow-sm", item.checked && "bg-muted/40 border-transparent shadow-none")}>
      <div className="flex items-center gap-4">
        <Button
            variant="ghost"
            size="icon"
            className={cn("size-8 rounded-full border-2 transition-all", 
                item.checked 
                    ? "bg-primary border-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                    : "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 text-transparent hover:text-primary/20"
            )}
            onClick={onToggle}
        >
            <Check className={cn("size-4 transition-transform", item.checked ? "scale-100" : "scale-75")} />
        </Button>
        
        <div className="flex-1 flex flex-col justify-center">
             <span className={cn("font-medium transition-colors text-lg", item.checked && "text-muted-foreground line-through decoration-muted-foreground/40")}>
                {item.name}
             </span>
             {images.length > 0 && !showImages && (
                 <div className="mt-1 flex items-center gap-2">
                     <button 
                        onClick={() => setShowImages(true)} 
                        className="group/preview relative h-12 w-12 overflow-hidden rounded-md border bg-muted transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1"
                     >
                         <AsyncImage path={images[0].file_path} alt="Item preview" />
                         {images.length > 1 && (
                             <div className="absolute bottom-0 right-0 rounded-tl bg-black/60 px-1 py-0.5 text-[8px] font-bold text-white">
                                 +{images.length - 1}
                             </div>
                         )}
                     </button>
                 </div>
             )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
            <Button 
                variant="ghost" 
                size="icon" 
                className={cn("size-8 text-muted-foreground hover:text-foreground", showImages && "bg-muted text-foreground")} 
                onClick={() => setShowImages(!showImages)}
                title={showImages ? "Hide images" : "Show images"}
            >
                <ImageIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
                <Trash2 className="size-4" />
            </Button>
        </div>
      </div>
      
      {showImages && (
          <div className="pl-12 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex flex-wrap gap-3">
                  {images.map(img => (
                      <div key={img.id} className="relative size-20 shrink-0 rounded-lg border bg-muted overflow-hidden group/img shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
                          <AsyncImage path={img.file_path} alt="Item image" />
                          <button 
                            onClick={() => handleDeleteImage(img.id)} 
                            className="absolute top-1 right-1 bg-black/60 hover:bg-destructive text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-all backdrop-blur-sm"
                          >
                              <Trash2 className="size-3" />
                          </button>
                      </div>
                  ))}
                   <label className="flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors text-muted-foreground hover:text-primary">
                        {uploading ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
                        <span className="text-[10px] font-medium uppercase tracking-wide">Add</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            const f = e.target.files?.[0];
                            if(f) handleUpload(f);
                        }} />
                   </label>
              </div>
          </div>
      )}
    </div>
  );
}

function AsyncImage({ path, alt }: { path: string; alt: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
      getToteImageUrl(path).then(setSrc);
  }, [path]);
  if (!src) return <div className="w-full h-full animate-pulse bg-muted" />;
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}
