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
import type { ItemDisplay } from "./ItemCard";

export function ItemDetail({
  outfitTitle,
  outfitSlug,
  item,
}: {
  outfitTitle: string;
  outfitSlug: string;
  item: ItemDisplay;
}) {
  const [open, setOpen] = useState(false);
  const showSize =
    item.garmentCategory &&
    item.garmentCategory !== "none" &&
    isGarmentCategory(item.garmentCategory);
  const sizeTitle = showSize
    ? GARMENT_CATEGORY_LABELS[item.garmentCategory as keyof typeof GARMENT_CATEGORY_LABELS]
    : "";
  const translator = showSize ? <SizeTranslator garmentCategory={item.garmentCategory} /> : null;

  const label =
    item.displayLabel?.trim() ||
    (showSize ? GARMENT_CATEGORY_LABELS[item.garmentCategory as keyof typeof GARMENT_CATEGORY_LABELS] : "");

  const detailsBlock = (
    <div className="flex flex-col gap-6">
      {label ? (
        <p className="font-label text-[10px] uppercase tracking-widest text-primary">{label}</p>
      ) : null}
      <div>
        <h1 className="font-headline text-2xl leading-tight text-on-surface md:text-3xl">{item.title}</h1>
        <p className="font-headline mt-3 text-2xl text-on-surface">
          {formatPrice(item.priceCents, item.currency)}
        </p>
      </div>

      <a
        href={item.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="font-label hidden min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-4 text-center text-xs uppercase tracking-widest text-on-primary shadow-lg transition hover:opacity-90 md:flex"
      >
        Shop on Amazon
      </a>

      {showSize ? (
        <>
          <button
            type="button"
            className="font-label flex min-h-11 w-full items-center justify-center rounded-full border border-outline bg-surface-container-low px-4 text-xs uppercase tracking-widest text-primary transition-opacity hover:opacity-80 md:hidden"
            onClick={() => setOpen(true)}
          >
            Find your size
          </button>
          <BottomSheet open={open} onClose={() => setOpen(false)} title={`Size: ${sizeTitle}`}>
            {translator}
          </BottomSheet>
          <div className="hidden rounded-xl bg-surface-container-low p-6 md:block">
            <p className="font-label text-[10px] uppercase tracking-widest text-primary">Find your size</p>
            <div className="mt-4">{translator}</div>
          </div>
        </>
      ) : null}

      <nav className="font-body text-sm text-on-surface-variant">
        <Link href="/" className="transition-opacity hover:text-primary hover:opacity-80">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/outfits" className="transition-opacity hover:text-primary hover:opacity-80">
          Outfits
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/outfits/${outfitSlug}`} className="transition-opacity hover:text-primary hover:opacity-80">
          {outfitTitle}
        </Link>
      </nav>

      <AffiliateDisclosure className="text-xs" />
    </div>
  );

  return (
    <div className="pb-28 md:pb-0">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:flex md:min-h-[70vh] md:gap-10 md:px-6 md:py-12">
        <div className="md:w-[55%] md:shrink-0">
          <div className="relative mx-auto w-full max-h-[85vh] overflow-hidden rounded-xl bg-surface-container shadow-card">
            <Image
              src={item.primaryImageUrl}
              alt={item.title}
              width={1200}
              height={1600}
              className="h-auto w-full max-h-[85vh] object-contain"
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
            />
          </div>
        </div>
        <div className="mt-8 md:mt-0 md:flex md:w-[45%] md:flex-col md:justify-center">{detailsBlock}</div>
      </div>

      <div className="fixed inset-x-0 bottom-20 z-40 border-t border-outline-variant bg-surface/90 p-4 backdrop-blur-xl md:bottom-0 md:hidden">
        <a
          href={item.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-label flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-4 text-center text-xs uppercase tracking-widest text-on-primary shadow-lg"
        >
          Shop on Amazon
        </a>
      </div>
    </div>
  );
}
