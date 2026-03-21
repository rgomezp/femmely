import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">Femmely</p>
            <p className="mt-1 max-w-sm text-sm text-[var(--color-text-secondary)]">
              Curated outfit boards and practical sizing help for exploring women&apos;s fashion.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/privacy" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]">
              Privacy
            </Link>
            <Link href="/disclosure" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]">
              Disclosure
            </Link>
            <Link href="/size-guide" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-secondary)]">
              Size guide
            </Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-[var(--color-text-secondary)]">
          © {new Date().getFullYear()} Honey Wolf LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
