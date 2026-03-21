import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SizeGuideNav } from "@/components/public/SizeGuideNav";
import { SizeTranslator } from "@/components/public/SizeTranslator";
import { GARMENT_CATEGORY_LABELS, isGarmentCategory, SIZING_CATEGORY_SLUGS } from "@/lib/sizing/types";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 86400;

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return SIZING_CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isGarmentCategory(category) || category === "none") {
    return { title: "Size guide" };
  }
  const label = GARMENT_CATEGORY_LABELS[category];
  const title = `Men's to women's ${label.toLowerCase()} size converter`;
  const url = absoluteUrl(`/size-guide/${category}`);
  return {
    title,
    description: `Convert men's sizing to women's ${label.toLowerCase()} sizes. Heuristic chart for shopping women's fashion with confidence.`,
    alternates: { canonical: url },
    openGraph: { title, url },
  };
}

export default async function SizeGuideCategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isGarmentCategory(category) || category === "none") notFound();

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I convert men's shoe size to women's?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Women's US sizes are typically about 1.5 to 2 sizes larger than men's US sizes for a similar foot length. Use our interactive chart for a starting point.",
        },
      },
      {
        "@type": "Question",
        name: "Are these conversions exact?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Brands and cuts vary. Treat these values as a first pass and always read the brand's own size chart when available.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <h2 className="font-headline text-xl text-on-surface md:text-2xl">
        {GARMENT_CATEGORY_LABELS[category]} converter
      </h2>
      <div className="mt-6">
        <SizeGuideNav active={category} />
      </div>
      <div className="mt-8 rounded-xl bg-surface-container-lowest p-6 shadow-card md:p-8">
        <SizeTranslator garmentCategory={category} />
      </div>
    </>
  );
}
