import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guards";

/** Max image size enforced in the client token (files do not pass through this function's body). */
const MAX_BYTES = 20 * 1024 * 1024;

/** Client builds `outfits/<uuid>/<timestamp>.<ext>` — keep uploads scoped and predictable. */
const OUTFIT_BLOB_PATH = /^outfits\/[0-9a-f-]{36}\/\d+\.(jpg|jpeg|png|webp)$/i;

function assertValidOutfitBlobPath(pathname: string) {
  if (pathname.includes("..") || !OUTFIT_BLOB_PATH.test(pathname)) {
    throw new Error("Invalid upload path");
  }
}

export async function POST(req: NextRequest) {
  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.type === "blob.generate-client-token") {
    const denied = await requireAdmin();
    if (denied) return denied;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN not configured" }, { status: 503 });
  }

  try {
    const jsonResponse = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async (pathname) => {
        assertValidOutfitBlobPath(pathname);
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
        };
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }
}
