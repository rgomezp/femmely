"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { SavedOutfitsCountBadge } from "@/components/public/SavedOutfitsCountBadge";

const items: { href: string; label: string; icon: string }[] = [
  { href: "/", label: "Explore", icon: "auto_awesome" },
  { href: "/outfits", label: "Curate", icon: "dashboard" },
  { href: "/size-guide", label: "Sizing", icon: "straighten" },
  { href: "/saved", label: "Saved", icon: "bookmark" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Mobile"
    >
      <div className="rounded-t-3xl border-t border-surface-container-low/15 bg-white/80 px-6 pb-6 pt-2 shadow-bottom-nav backdrop-blur-2xl">
        <div className="flex items-center justify-around">
          {items.map(({ href, label, icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center transition-all ${
                  active
                    ? "scale-110 -translate-y-2 rounded-full bg-primary p-3 text-on-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <span className="relative inline-flex">
                  <Icon name={icon} className="text-xl" />
                  {href === "/saved" ? (
                    <SavedOutfitsCountBadge variant={active ? "onPrimary" : "default"} />
                  ) : null}
                </span>
                <span className="font-label mt-1 text-center text-[10px] uppercase tracking-widest">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
