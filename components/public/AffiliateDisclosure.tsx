export function AffiliateDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm text-[var(--color-text-secondary)] ${className}`}>
      As an Amazon Associate I earn from qualifying purchases.
    </p>
  );
}
