import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guards";
import { getPublishedOutfitSlugs } from "@/lib/queries";
import { partnerTagValueToStore } from "@/lib/partner-tag";
import {
  bulkRetagOutfitItemAffiliateUrls,
  getAmazonPartnerTagEnv,
  getAmazonPartnerTagOverrideRaw,
  getAmazonPartnerTagResolved,
  setAmazonPartnerTagOverride,
} from "@/lib/site-settings";
import { adminSiteSettingsPatchSchema } from "@/lib/validators";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [envDefault, override, effective] = await Promise.all([
    Promise.resolve(getAmazonPartnerTagEnv()),
    getAmazonPartnerTagOverrideRaw(),
    getAmazonPartnerTagResolved(),
  ]);

  return NextResponse.json({ envDefault, override, effective });
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json().catch(() => null);
  const parsed = adminSiteSettingsPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const toStore = partnerTagValueToStore(
    parsed.data.amazonPartnerTagOverride,
    getAmazonPartnerTagEnv(),
  );

  await setAmazonPartnerTagOverride(toStore);

  const effective = await getAmazonPartnerTagResolved();

  if (parsed.data.bulkRetagAffiliateUrls) {
    await bulkRetagOutfitItemAffiliateUrls(effective);
    revalidatePath("/");
    revalidatePath("/outfits");
    revalidatePath("/sitemap.xml");
    const slugs = await getPublishedOutfitSlugs();
    for (const slug of slugs) {
      revalidatePath(`/outfits/${slug}`);
    }
  } else {
    revalidatePath("/");
    revalidatePath("/outfits");
    revalidatePath("/sitemap.xml");
  }

  const [overrideAfter, envDefault] = await Promise.all([
    getAmazonPartnerTagOverrideRaw(),
    Promise.resolve(getAmazonPartnerTagEnv()),
  ]);

  return NextResponse.json({
    envDefault,
    override: overrideAfter,
    effective,
    bulkRetagged: Boolean(parsed.data.bulkRetagAffiliateUrls),
  });
}
