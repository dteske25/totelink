import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  getTote,
  updateTote,
  ITote,
  UpdateToteData,
  getToteImages,
  IToteImage,
} from "../database/queries";
import { useState, useCallback, useEffect } from "react";
import { ToteDetails } from "../components/ToteDetails";

export const Route = createFileRoute("/totes_/$toteId")({
  component: ToteDetailsRoute,
  loader: async ({ params }) => {
    const { toteId } = params;
    return await getTote(toteId);
  },
});

function ToteDetailsRoute() {
  const initialTote: ITote | null = Route.useLoaderData();
  const router = useRouter();
  const [tote, setTote] = useState(initialTote);
  const [images, setImages] = useState<IToteImage[]>([]);

  // Load images when component mounts or tote changes
  const loadImages = useCallback(async () => {
    if (!tote?.id) return;

    try {
      const toteImages = await getToteImages(tote.id);
      setImages(toteImages);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  }, [tote?.id]);
  // Load images on mount
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  if (!tote) {
    return <div className="p-4 text-center text-error">Tote not found.</div>;
  }

  const handleUpdateTote = async (
    id: string,
    updates: Partial<UpdateToteData>,
  ) => {
    try {
      const updatedTote = await updateTote(id, updates);
      setTote(updatedTote);

      await router.invalidate();
    } catch (error) {
      console.error("Error updating tote:", error);
      throw error;
    }
  };
  return (
    <ToteDetails
      tote={tote}
      onUpdateTote={handleUpdateTote}
      images={images}
      onImagesChange={loadImages}
    />
  );
}
