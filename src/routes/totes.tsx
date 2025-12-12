import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { getTotes, createTote, ITote, getToteImageUrl } from "../database/queries";
import { Plus, LayoutGrid, List, Search, Package } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { user } = useAuth();

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
          category: categoryFilter !== "all" ? categoryFilter : null, 
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

  const filteredTotes = useMemo(() => {
    return totes.filter((t) => {
        const matchesSearch = t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              t.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
  }, [totes, searchQuery, categoryFilter]);

  const categories = useMemo(() => {
      const cats = new Set(totes.map(t => t.category).filter(Boolean));
      return Array.from(cats) as string[];
  }, [totes]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 size-4" />
                New Tote
            </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
                placeholder="Search totes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as "grid" | "list")}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                    <List className="size-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
      </div>

      {isCreating && (
        <Card className="border-dashed bg-muted/50">
            <CardContent className="flex items-center gap-4 p-4">
                 <Input
                    placeholder="Enter tote name..."
                    autoFocus
                    disabled={isLoading}
                    onBlur={(e) => handleCreateTote(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateTote(e.currentTarget.value);
                        if (e.key === "Escape") setIsCreating(false);
                    }}
                 />
                 {isLoading && <Loader2 className="animate-spin text-muted-foreground" />}
            </CardContent>
        </Card>
      )}

      {filteredTotes.length === 0 && !isCreating ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center animate-in fade-in-50">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No totes found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {searchQuery || categoryFilter !== 'all' ? "Try adjusting your filters." : "Get started by creating your first tote."}
            </p>
            {(searchQuery || categoryFilter !== 'all') ? (
                 <Button variant="outline" onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}>Clear Filters</Button>
            ) : (
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="mr-2 size-4" />
                    Create Tote
                </Button>
            )}
          </div>
      ) : (
        <div className={cn("grid gap-6", viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
            {filteredTotes.map((t) => (
                <Link key={t.id} to="/totes/$toteId" params={{ toteId: t.id }} className="group">
                    <Card className={cn("h-full transition-all hover:shadow-md hover:border-primary/50", viewMode === "list" && "flex flex-row items-center")}>
                        <CardHeader className={cn("flex gap-4 space-y-0 p-4", viewMode === "list" ? "flex-row items-center flex-1" : "flex-col items-start")}>
                              <div className={cn("relative overflow-hidden rounded-md bg-muted/20 transition-colors group-hover:bg-muted/40", viewMode === "grid" ? "h-32 w-full mb-2" : "h-16 w-16 shrink-0")}>
                                {t.cover_image_path ? (
                                    <AsyncImage path={t.cover_image_path} alt={t.name || "Tote"} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
                                         <Package className={cn(viewMode === "grid" ? "h-12 w-12" : "h-8 w-8")} />
                                    </div>
                                )}
                              </div>
                             <div className="flex-1 space-y-1">
                                <CardTitle className="text-base">{t.name}</CardTitle>
                                {viewMode === "list" && <CardDescription className="line-clamp-1">{t.description}</CardDescription>}
                             </div>
                        </CardHeader>
                        <CardContent className={cn("flex flex-col gap-2", viewMode === "list" ? "flex-none w-[200px] py-4 items-end" : "pt-0")}>
                            {viewMode === "grid" && <CardDescription className="line-clamp-2 min-h-[40px]">{t.description || "No description"}</CardDescription>}
                            <div className="flex items-center gap-2 mt-auto">
                                {t.category && <Badge variant="secondary" className="text-xs">{t.category}</Badge>}
                                <span className="text-xs text-muted-foreground ml-auto">
                                    {format(new Date(t.updated_on), "MMM d, yyyy")}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      )}
    </div>
  );
}

function AsyncImage({ path, alt, className }: { path: string; alt: string; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
     if (path) {
         getToteImageUrl(path).then(setSrc);
     }
  }, [path]);

  if (!src) return <div className={cn("animate-pulse bg-muted", className)} />;
  return <img src={src} alt={alt} className={className} />;
}
