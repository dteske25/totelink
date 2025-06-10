import { useEffect, useState } from "react";
import {
  getToteImages,
  uploadToteImages,
  getToteImageUrl,
  ToteImage,
} from "../database/queries";

interface Props {
  toteId: string;
}

export function ToteImageGallery({ toteId }: Props) {
  const [images, setImages] = useState<(ToteImage & { url: string })[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  useEffect(() => {
    getToteImages(toteId)
      .then(async (imgs) => {
        const imgData = await Promise.all(
          (imgs || []).map(async (img) => ({
            ...img,
            url: await getToteImageUrl(img.file_path),
          })),
        );
        setImages(imgData);
      })
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
      const uploadedWithUrls = await Promise.all(
        uploaded.map(async (img) => ({
          ...img,
          url: await getToteImageUrl(img.file_path),
        })),
      );
      setImages((prev) => [...prev, ...uploadedWithUrls]);
      e.target.value = "";
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
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
          {images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              onClick={() => setZoomSrc(img.url)}
              className="aspect-square w-full cursor-pointer rounded-box object-cover"
            />
          ))}
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
