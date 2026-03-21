import { NextResponse } from "next/server";
import { listCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const rows = await listCategories();
  return NextResponse.json({ categories: rows });
}
