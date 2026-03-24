import { OutfitForm } from "@/components/admin/OutfitForm";
import { listCategories, listTags } from "@/lib/queries";
import { getAmazonPartnerTagResolved } from "@/lib/site-settings";

export default async function NewOutfitPage() {
  const [categories, tags, partnerTag] = await Promise.all([
    listCategories(),
    listTags(),
    getAmazonPartnerTagResolved(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New outfit</h1>
      <OutfitForm
        mode="create"
        categories={categories}
        tags={tags}
        amazonPartnerTag={partnerTag || undefined}
        amazonDefaultMarketplace={process.env.AMAZON_MARKETPLACE ?? "www.amazon.com"}
      />
    </div>
  );
}
