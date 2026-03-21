"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/ui/Icon";
import { SearchBar, SearchBarSkeleton } from "@/components/public/SearchBar";

const nav: { href: string; label: string }[] = [
  { href: "/", label: "Browse" },
  { href: "/outfits", label: "Outfits" },
  { href: "/size-guide", label: "Size Guide" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 h-20 w-full bg-[#fcf9f4]/70 shadow-card backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-6 md:gap-8 lg:gap-10">
          <Link
            href="/"
            className="font-headline shrink-0 text-2xl font-bold tracking-tighter text-on-surface transition-opacity hover:opacity-80"
          >
            Femmely
          </Link>

          <Link
            href="/search"
            className="flex shrink-0 items-center justify-center rounded-full p-2 text-primary transition-opacity hover:opacity-80 lg:hidden"
            aria-label="Search outfits"
          >
            <Icon name="search" className="text-2xl" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-label inline-block border-b-2 border-transparent pb-[2px] text-sm transition-colors hover:text-primary ${
                    active
                      ? "border-primary font-semibold text-primary"
                      : "font-normal text-on-surface-variant"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center px-4 lg:flex lg:px-8">
          <Suspense fallback={<SearchBarSkeleton className="relative w-full max-w-md" />}>
            <SearchBar className="relative w-full max-w-md" inputId="header-search" />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
