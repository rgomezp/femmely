import { del } from "@vercel/blob";
import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { outfits } from "@/lib/db/schema";

/** URLs hosted on this project's Vercel Blob store (not Amazon or external). */
export function isVercelBlobUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    const { hostname } = new URL(url);
    return (
      hostname.endsWith(".public.blob.vercel-storage.com") ||
      hostname.endsWith("blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

/**
 * Deletes main outfit images stored in Vercel Blob before rows are removed from the DB.
 * Best-effort: failures are logged, not thrown.
 */
export async function deleteOutfitMainImageBlobsForOutfitIds(outfitIds: string[]): Promise<void> {
  if (outfitIds.length === 0) return;
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return;

  const rows = await db
    .select({ mainImageUrl: outfits.mainImageUrl })
    .from(outfits)
    .where(inArray(outfits.id, outfitIds));

  const urls = [...new Set(rows.map((r) => r.mainImageUrl).filter(isVercelBlobUrl))];
  if (urls.length === 0) return;

  try {
    await del(urls, { token });
  } catch (e) {
    console.error("[blob] batch delete failed, trying one-by-one", e);
    for (const url of urls) {
      try {
        await del(url, { token });
      } catch (err) {
        console.error("[blob] delete failed", url, err);
      }
    }
  }
}
