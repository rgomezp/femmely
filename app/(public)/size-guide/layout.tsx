import { MeasureGuide } from "@/components/public/MeasureGuide";

export default function SizeGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 md:px-6">
      <h1 className="font-headline text-4xl text-on-surface md:text-5xl">Size guide</h1>
      <p className="font-body mt-2 text-lg leading-relaxed text-on-surface-variant">
        Practical men&apos;s-to-women&apos;s sizing starting points for shoes, apparel, and more. Not medical
        advice—always check brand charts.
      </p>
      <div className="mt-10">
        <MeasureGuide />
      </div>
      <div className="mt-12">{children}</div>
    </div>
  );
}
