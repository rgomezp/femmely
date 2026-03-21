"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FEATURED_HELP =
  "Featured outfits appear in the horizontal carousel after “Related outfits” on other outfit detail pages (this outfit is excluded from its own page). Newest published first.";

export function FeaturedTooltipHint() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePos = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.left + r.width / 2 });
  }, []);

  const show = useCallback(() => {
    updatePos();
    setOpen(true);
  }, [updatePos]);

  const hide = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="inline-flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full border border-neutral-300 text-[11px] font-semibold leading-none text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
        aria-label={FEATURED_HELP}
        title={FEATURED_HELP}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        ?
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[200] max-w-[min(18rem,calc(100vw-1rem))] -translate-x-1/2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-normal leading-snug text-neutral-700 shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            {FEATURED_HELP}
          </div>,
          document.body,
        )}
    </>
  );
}
