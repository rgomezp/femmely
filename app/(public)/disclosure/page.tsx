import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Disclosure",
  description: "Amazon Associates and FTC disclosure for Femmely.club.",
  alternates: { canonical: absoluteUrl("/disclosure") },
};

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Affiliate disclosure</h1>
      <div className="mt-6 space-y-4 text-[var(--color-text-secondary)]">
        <p>
          Femmely is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program
          designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
        </p>
        <p>
          As an Amazon Associate we earn from qualifying purchases. Product links on this site may include our
          Associates tracking tag; you pay the same price you would otherwise.
        </p>
        <p>
          We do not receive free products from Amazon in exchange for coverage unless explicitly stated in a future
          article. Editorial picks reflect our taste and usefulness for readers, not a payment from brands.
        </p>
        <p>
          This disclosure is provided for transparency under FTC guidelines and Amazon Associates Program operating
          agreement requirements.
        </p>
      </div>
    </div>
  );
}
