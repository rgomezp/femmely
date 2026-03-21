import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 bg-surface-container-low py-16 px-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        <div>
          <p className="font-headline text-lg italic text-on-surface">Femmely</p>
          <p className="font-label mt-2 max-w-sm text-xs tracking-wide text-on-surface-variant">
            Curated outfit boards and practical sizing help for exploring femme fashion.
          </p>
        </div>
        <nav className="flex flex-wrap items-start gap-x-8 gap-y-3 md:justify-center">
          <Link
            href="/about"
            className="font-label text-xs tracking-wide text-on-surface-variant opacity-60 transition hover:text-primary hover:opacity-100"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="font-label text-xs tracking-wide text-on-surface-variant opacity-60 transition hover:text-primary hover:opacity-100"
          >
            Privacy
          </Link>
          <Link
            href="/disclosure"
            className="font-label text-xs tracking-wide text-on-surface-variant opacity-60 transition hover:text-primary hover:opacity-100"
          >
            Disclosure
          </Link>
        </nav>
        <p className="font-label text-xs tracking-wide text-on-surface-variant md:text-right">
          © 2026 Femmely. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
