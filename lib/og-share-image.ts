import "server-only";

import { absoluteUrl } from "@/lib/utils";

const PROBE_BYTE_LIMIT = 262144;

/** Ensure share/OG image URLs are absolute so crawlers (Reddit, etc.) can fetch them. */
export function resolveShareImageUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  if (t.startsWith("https://") || t.startsWith("http://")) return t;
  return absoluteUrl(t.startsWith("/") ? t : `/${t}`);
}

function readImageDimensionsFromBuffer(buf: Buffer): { width: number; height: number } | undefined {
  // PNG
  if (
    buf.length >= 24 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // GIF
  if (buf.length >= 10 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }

  // WebP extended (common for still images from modern pipelines)
  if (
    buf.length >= 30 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP" &&
    buf.toString("ascii", 12, 16) === "VP8X"
  ) {
    const w = buf.readUIntLE(21, 3) + 1;
    const h = buf.readUIntLE(24, 3) + 1;
    if (w > 1 && h > 1) return { width: w, height: h };
  }

  // JPEG
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) break;
      const marker = buf[i + 1];
      // SOF0 / SOF1 / SOF2 (baseline / extended / progressive)
      if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
        return {
          height: buf.readUInt16BE(i + 5),
          width: buf.readUInt16BE(i + 7),
        };
      }
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01) {
        i += 2;
        continue;
      }
      const segLen = buf.readUInt16BE(i + 2);
      if (segLen < 2 || i + 2 + segLen > buf.length) break;
      i += 2 + segLen;
    }
  }

  return undefined;
}

/**
 * Fetches the start of a remote image and reads width/height for og:image:width / og:image:height.
 * Reddit (Embedly) uses these hints to pick and size link previews.
 */
export async function probeImageDimensionsForOg(
  imageUrl: string
): Promise<{ width: number; height: number } | undefined> {
  try {
    const res = await fetch(imageUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return undefined;
    const ab = await res.arrayBuffer();
    const slice = ab.byteLength <= PROBE_BYTE_LIMIT ? ab : ab.slice(0, PROBE_BYTE_LIMIT);
    return readImageDimensionsFromBuffer(Buffer.from(slice));
  } catch {
    return undefined;
  }
}
