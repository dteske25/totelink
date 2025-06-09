import { useEffect, useState } from "react";
import supabase from "../database/supabase";
import { getToteImages, uploadToteImages, ToteImage } from "../database/queries";

interface Props {
  toteId: string;
}

export function ToteImageGallery({ toteId }: Props) {
  const [images, setImages] = useState<ToteImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  useEffect(() => {
    getToteImages(toteId)
      .then((imgs) => setImages(imgs || []))
      .catch((e) => console.error(e));
  }, [toteId]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploading(true);
    try {
      const uploaded = await uploadToteImages(toteId, files);
      setImages((prev) => [...prev, ...uploaded]);
      e.target.value = "";
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const getUrl = (path: string) => {
    return supabase.storage.from("tote-images").getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-2">
        <label className="btn btn-primary btn-sm">
          Upload Images
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
        {isUploading && (
          <span className="loading loading-sm loading-spinner"></span>
        )}
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {images.map((img) => {
            const url = getUrl(img.file_path);
            return (
              <img
                key={img.id}
                src={url}
                onClick={() => setZoomSrc(url)}
                className="aspect-square w-full cursor-pointer rounded-box object-cover"
              />
            );
          })}
        </div>
      )}
      {zoomSrc && (
        <dialog
          className="modal modal-open"
          onClick={() => setZoomSrc(null)}
        >
          <div
            className="modal-box max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={zoomSrc} className="w-full" />
          </div>
        </dialog>
      )}
    </div>
  );
}
