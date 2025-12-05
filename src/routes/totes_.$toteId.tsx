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

  const toteId = tote?.id;

  // Load images when component mounts or tote changes
  const loadImages = useCallback(async () => {
    if (!toteId) return;

    try {
      const toteImages = await getToteImages(toteId);
      setImages(toteImages);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  }, [toteId]);

  // Load images on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
