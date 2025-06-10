import React, { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import {
  ToteImage,
  uploadToteImage,
  deleteToteImage,
  getToteImageUrl,
} from "../database/queries";

interface ToteImageGalleryProps {
  toteId: string;
  images: ToteImage[];
  onImagesChange: () => void;
}

export function ToteImageGallery({
  toteId,
  images,
  onImagesChange,
}: ToteImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      setUploadError(null);

      try {
        // Upload each file
        for (const file of Array.from(files)) {
          // Validate file type
          if (!file.type.startsWith("image/")) {
            throw new Error(`File ${file.name} is not an image`);
          }

          // Validate file size (50MB max)
          if (file.size > 50 * 1024 * 1024) {
            throw new Error(
              `File ${file.name} is too large. Maximum size is 50MB.`,
            );
          }

          await uploadToteImage(toteId, file);
        }

        // Refresh the images list
        onImagesChange();

        // Clear the input
        event.target.value = "";
      } catch (error) {
        console.error("Error uploading images:", error);
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload images",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [toteId, onImagesChange],
  );

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteToteImage(imageId);
      onImagesChange();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <ImageIcon className="size-5" />
          Images ({images.length})
        </h3>

        <div className="relative">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="sr-only"
          />
          <label
            htmlFor="image-upload"
            className={`btn gap-2 btn-sm btn-primary ${isUploading ? "loading" : ""}`}
          >
            {!isUploading && <Upload className="size-4" />}
            {isUploading ? "Uploading..." : "Add Images"}
          </label>
        </div>
      </div>

      {uploadError && (
        <div className="alert alert-error">
          <span>{uploadError}</span>
        </div>
      )}

      {images.length === 0 ? (
        <div className="py-8 text-center text-base-content/60">
          <ImageIcon className="mx-auto mb-2 size-12 opacity-40" />
          <p>No images uploaded yet.</p>
          <p className="text-sm">Upload some images to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg bg-base-200">
                <img
                  src={getToteImageUrl(image.file_path)}
                  alt="Tote image"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="btn absolute top-2 right-2 btn-circle opacity-0 transition-opacity btn-xs btn-error group-hover:opacity-100"
                title="Delete image"
              >
                <X className="size-3" />
              </button>
              <div className="absolute right-2 bottom-2 left-2">
                <div className="rounded bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
                  {new Date(image.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-base-content/60">
        <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
        <p>• Maximum file size: 50MB per image</p>
        <p>• You can select multiple images at once</p>
      </div>
    </div>
  );
}
