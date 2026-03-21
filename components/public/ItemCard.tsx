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
  /** Amazon product image (same as imageUrl; used for detail hero / OG). */
  primaryImageUrl: string;
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
    <article className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-card">
      <div className="relative aspect-square w-full bg-surface-container">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="font-label text-[10px] uppercase tracking-widest text-primary">{item.displayLabel}</span>
        <h3 className="font-headline leading-snug text-on-surface">{item.title}</h3>
        <p className="font-headline text-lg text-on-surface">{formatPrice(item.priceCents, item.currency)}</p>
        <AffiliateDisclosure />
        <Link
          href={item.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-label flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container px-4 text-center text-xs uppercase tracking-widest text-on-primary shadow-lg transition hover:opacity-90"
        >
          Shop on Amazon
        </Link>
        {showSize ? (
          <>
            <button
              type="button"
              className="font-label flex min-h-11 w-full items-center justify-center rounded-full border border-outline bg-surface-container-low px-4 text-xs uppercase tracking-widest text-primary md:hidden"
              onClick={() => setOpen(true)}
            >
              Find your size
            </button>
            <BottomSheet open={open} onClose={() => setOpen(false)} title={`Size: ${sizeTitle}`}>
              {translator}
            </BottomSheet>
            <div className="hidden md:block">
              <div className="rounded-xl bg-surface-container-low p-4">
                <p className="font-label text-[10px] uppercase tracking-widest text-primary">Find your size</p>
                <div className="mt-3">{translator}</div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
}
