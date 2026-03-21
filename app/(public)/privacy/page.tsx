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
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Privacy policy</h1>
      <div className="mt-6 space-y-4 text-[var(--color-text-secondary)]">
        <p>
          We collect only what is needed to run the site. Admin authentication uses secure sessions. Public pages do
          not require an account.
        </p>
        <p>
          If you use contact or newsletter features in the future, we will describe what is stored and how to opt out.
          Currently, this MVP does not include user accounts on the public site.
        </p>
        <p>
          Affiliate links go to Amazon.com. Amazon&apos;s privacy policy applies when you leave our site. We do not
          sell your personal information.
        </p>
        <p>
          For questions, contact the operator listed on the About page or your hosting provider&apos;s support channel
          for this deployment.
        </p>
      </div>
    </div>
  );
}
