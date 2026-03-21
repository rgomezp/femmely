export function AffiliateDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`font-body text-sm text-on-surface-variant ${className}`}>
      As an Amazon Associate we earn from qualifying purchases.
    </p>
  );
}
