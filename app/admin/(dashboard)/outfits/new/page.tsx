import { OutfitForm } from "@/components/admin/OutfitForm";
import { listCategories, listTags } from "@/lib/queries";

export default async function NewOutfitPage() {
  const [categories, tags] = await Promise.all([listCategories(), listTags()]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New outfit</h1>
      <OutfitForm
        mode="create"
        categories={categories}
        tags={tags}
        amazonPartnerTag={process.env.AMAZON_PARTNER_TAG}
        amazonDefaultMarketplace={process.env.AMAZON_MARKETPLACE ?? "www.amazon.com"}
      />
    </div>
  );
}
