"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export function ImageDropzone({
  onUploaded,
  label = "Hero image",
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
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        onUploaded(data.url);
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
        {uploading ? <p>Uploading…</p> : <p>Drop an image here, or click to browse (max 5MB)</p>}
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
