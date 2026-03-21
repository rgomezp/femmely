"use client";

import { upload } from "@vercel/blob/client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_BYTES = 20 * 1024 * 1024;

export function ImageDropzone({
  onUploaded,
  label = "Upload image",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setError(null);
      setUploading(true);
      try {
        if (file.size > MAX_BYTES) {
          throw new Error(`Max size ${Math.round(MAX_BYTES / (1024 * 1024))}MB`);
        }
        const ext =
          file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const pathname = `outfits/${crypto.randomUUID()}/${Date.now()}.${ext}`;
        const blob = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          contentType: file.type,
          multipart: file.size > 4 * 1024 * 1024,
        });
        onUploaded(blob.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div>
      <p className="text-sm font-medium text-neutral-700">{label}</p>
      <div
        {...getRootProps()}
        className={`mt-2 flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm ${
          isDragActive ? "border-[#e8485c] bg-red-50" : ""
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading…</p>
        ) : (
          <p>Drop an image here, or click to browse (JPEG, PNG, WebP — up to 20MB)</p>
        )}
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
