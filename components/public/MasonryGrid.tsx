import type { ReactNode } from "react";

export function MasonryGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`masonry-grid mx-auto max-w-[1400px] ${className ?? ""}`}>{children}</div>
  );
}
