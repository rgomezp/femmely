import type { ReactNode } from "react";

export function MasonryGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1400px] columns-1 gap-3 min-[480px]:columns-2 min-[640px]:columns-3 min-[1024px]:columns-4 min-[1280px]:columns-5 min-[1024px]:gap-6">
      {children}
    </div>
  );
}
