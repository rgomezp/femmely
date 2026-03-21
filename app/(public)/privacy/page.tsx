import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Femmely.club.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <h1 className="font-headline text-4xl text-on-surface md:text-5xl">Privacy policy</h1>
      <div className="mt-6 space-y-4 font-body text-on-surface-variant">
        <p>
          We collect only what is needed to run the site. Public pages do not require an account.
        </p>
        <p>
          Affiliate links go to Amazon.com. Amazon&apos;s privacy policy applies when you leave our site. We do not
          sell your personal information.
        </p>
      </div>
    </div>
  );
}
