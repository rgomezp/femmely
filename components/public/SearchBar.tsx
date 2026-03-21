"use client";

import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

export function SearchBar({
  className,
  inputId = "site-search",
  autoFocus,
  placeholder = "Search looks, brands, categories…",
}: {
  className?: string;
  inputId?: string;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";

  return (
    <form action="/search" method="get" role="search" className={className}>
      <label htmlFor={inputId} className="sr-only">
        Search outfits
      </label>
      <Icon
        name="search"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
        aria-hidden
      />
      <input
        id={inputId}
        key={q}
        type="search"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        enterKeyHint="search"
        className="w-full rounded-full border-0 bg-surface-container-low py-3 pl-12 pr-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </form>
  );
}

export function SearchBarSkeleton({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div className="h-12 w-full max-w-md rounded-full bg-surface-container-low/80" />
    </div>
  );
}
