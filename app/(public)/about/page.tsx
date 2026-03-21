import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "What Femmely is, who runs it, and how we approach affiliate content.",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <h1 className="font-headline text-4xl text-on-surface md:text-5xl">About Femmely</h1>
      <div className="mt-6 space-y-4 font-body text-on-surface-variant">
        <p>
          Femmely is a fashion discovery site built around curated outfit boards. Each board is styled like a look
          you might save for inspiration—with clear links to shop the pieces on Amazon when we can match them.
        </p>
        <p>
          We focus on practical, welcoming guidance for people exploring women&apos;s fashion, including sizing tools
          that translate common men&apos;s measurements into useful women&apos;s size starting points. Charts are
          educational, not a substitute for trying things on or reading brand-specific guides.
        </p>
        <p>
          Femmely is operated by Honey Wolf LLC. Editorial choices (which outfits to feature, how they&apos;re
          described) are ours. Product availability and prices come from Amazon when you click through—we refresh
          listings regularly, but only Amazon&apos;s site is authoritative at checkout.
        </p>
      </div>
    </div>
  );
}
