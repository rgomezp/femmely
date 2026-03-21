"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { isGarmentCategory } from "@/lib/sizing/types";
import { GARMENT_CATEGORY_LABELS } from "@/lib/sizing/types";
import { AffiliateDisclosure } from "./AffiliateDisclosure";
import { BottomSheet } from "./BottomSheet";
import { SizeTranslator } from "./SizeTranslator";

export type ItemDisplay = {
  id: string;
  title: string;
  imageUrl: string;
  affiliateUrl: string;
  priceCents: number | null;
  currency: string;
  displayLabel: string;
  garmentCategory: string;
};

export function ItemCard({ item }: { item: ItemDisplay }) {
  const [open, setOpen] = useState(false);
  const showSize =
    item.garmentCategory &&
    item.garmentCategory !== "none" &&
    isGarmentCategory(item.garmentCategory);
  const sizeTitle = showSize
    ? GARMENT_CATEGORY_LABELS[item.garmentCategory as keyof typeof GARMENT_CATEGORY_LABELS]
    : "";

  const translator = showSize ? (
    <SizeTranslator garmentCategory={item.garmentCategory} />
  ) : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
      <div className="relative aspect-square w-full bg-[var(--color-bg)]">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
          {item.displayLabel}
        </span>
        <h3 className="font-semibold leading-snug text-[var(--color-text-primary)]">{item.title}</h3>
        <p className="text-lg font-medium text-[var(--color-text-primary)]">
          {formatPrice(item.priceCents, item.currency)}
        </p>
        <AffiliateDisclosure />
        <Link
          href={item.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex min-h-11 w-full items-center justify-center rounded-[12px] bg-[var(--color-accent)] px-4 text-center text-sm font-semibold text-white transition hover:opacity-90"
        >
          Shop on Amazon
        </Link>
        {showSize ? (
          <>
            <button
              type="button"
              className="md:hidden flex min-h-11 w-full items-center justify-center rounded-[12px] border border-[var(--color-border-secondary)] bg-[var(--color-accent-secondary)]/10 px-4 text-sm font-semibold text-[var(--color-accent-secondary)]"
              onClick={() => setOpen(true)}
            >
              Find your size
            </button>
            <BottomSheet open={open} onClose={() => setOpen(false)} title={`Size: ${sizeTitle}`}>
              {translator}
            </BottomSheet>
            <div className="hidden md:block">
              <details className="rounded-xl border border-[var(--color-border)] p-3">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--color-accent-secondary)]">
                  Find your size
                </summary>
                <div className="mt-3">{translator}</div>
              </details>
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
}
