import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { DeleteOutfitButton } from "@/components/admin/DeleteOutfitButton";
import { OutfitForm } from "@/components/admin/OutfitForm";
import { db, outfits } from "@/lib/db";
import {
  getOutfitCategoryIds,
  getOutfitItems,
  getOutfitTagIds,
  listCategories,
  listTags,
} from "@/lib/queries";
import type { DraftOutfitItem } from "@/components/admin/ItemSortableList";

type Props = { params: Promise<{ id: string }> };

export default async function EditOutfitPage({ params }: Props) {
  const { id } = await params;
  const row = await db.select().from(outfits).where(eq(outfits.id, id)).limit(1);
  const outfit = row[0];
  if (!outfit) notFound();

  const [items, catIds, tagIds, categories, tags] = await Promise.all([
    getOutfitItems(id),
    getOutfitCategoryIds(id),
    getOutfitTagIds(id),
    listCategories(),
    listTags(),
  ]);

  const initialItems: DraftOutfitItem[] = items.map((i) => ({
    tempId: i.id,
    serverId: i.id,
    asin: i.asin,
    title: i.title,
    affiliateUrl: i.affiliateUrl,
    imageUrl: i.imageUrl,
    priceCents: i.priceCents,
    currency: i.currency,
    displayLabel: i.displayLabel,
    garmentCategory: i.garmentCategory,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit outfit</h1>
      <OutfitForm
        mode="edit"
        outfit={outfit}
        initialItems={initialItems}
        initialCategoryIds={catIds}
        initialTagIds={tagIds}
        categories={categories}
        tags={tags}
      />
      <DeleteOutfitButton outfitId={outfit.id} title={outfit.title} />
    </div>
  );
}
