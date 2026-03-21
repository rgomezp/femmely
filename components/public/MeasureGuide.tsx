export function MeasureGuide() {
  return (
    <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">How to measure</h2>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Use a soft tape measure, keep it level but not tight, and breathe normally. These guides are a starting
        point—every body is different.
      </p>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <figure className="space-y-3">
          <svg viewBox="0 0 120 140" className="mx-auto h-36 w-28 text-[var(--color-accent-secondary)]" aria-hidden>
            <ellipse cx="60" cy="28" rx="22" ry="20" fill="currentColor" opacity="0.2" />
            <path
              d="M60 48 L35 58 L30 95 L45 130 L75 130 L90 95 L85 58 Z"
              fill="currentColor"
              opacity="0.15"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M40 52 Q60 62 80 52"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text x="60" y="18" textAnchor="middle" className="fill-[var(--color-text-secondary)] text-[8px]">
              Bust
            </text>
          </svg>
          <figcaption>
            <h3 className="font-semibold text-[var(--color-text-primary)]">Bust / chest</h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Wrap the tape around the fullest part of your chest, under the arms, keeping the tape parallel to the
              floor.
            </p>
          </figcaption>
        </figure>
        <figure className="space-y-3">
          <svg viewBox="0 0 120 140" className="mx-auto h-36 w-28 text-[var(--color-accent-secondary)]" aria-hidden>
            <path
              d="M60 48 L35 58 L30 95 L45 130 L75 130 L90 95 L85 58 Z"
              fill="currentColor"
              opacity="0.15"
              stroke="currentColor"
              strokeWidth="2"
            />
            <ellipse cx="60" cy="72" rx="28" ry="8" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 3" />
            <text x="60" y="68" textAnchor="middle" className="fill-[var(--color-text-secondary)] text-[8px]">
              Waist
            </text>
          </svg>
          <figcaption>
            <h3 className="font-semibold text-[var(--color-text-primary)]">Natural waist</h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Find the narrowest part of your torso, usually just above the belly button. Relax your stomach while
              measuring.
            </p>
          </figcaption>
        </figure>
        <figure className="space-y-3">
          <svg viewBox="0 0 120 140" className="mx-auto h-36 w-28 text-[var(--color-accent-secondary)]" aria-hidden>
            <path
              d="M60 48 L35 58 L30 95 L45 130 L75 130 L90 95 L85 58 Z"
              fill="currentColor"
              opacity="0.15"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M32 88 Q60 102 88 88"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text x="60" y="108" textAnchor="middle" className="fill-[var(--color-text-secondary)] text-[8px]">
              Hips
            </text>
          </svg>
          <figcaption>
            <h3 className="font-semibold text-[var(--color-text-primary)]">Hips</h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Measure around the widest part of your hips and seat, usually 7–9 inches below your natural waist.
            </p>
          </figcaption>
        </figure>
        <figure className="space-y-3">
          <svg viewBox="0 0 120 140" className="mx-auto h-36 w-28 text-[var(--color-accent-secondary)]" aria-hidden>
            <path
              d="M60 48 L35 58 L30 95 L45 130 L75 130 L90 95 L85 58 Z"
              fill="currentColor"
              opacity="0.15"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line x1="42" y1="58" x2="78" y2="58" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 3" />
            <line x1="38" y1="68" x2="82" y2="68" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 3" />
            <text x="60" y="52" textAnchor="middle" className="fill-[var(--color-text-secondary)] text-[7px]">
              Under / overbust
            </text>
          </svg>
          <figcaption>
            <h3 className="font-semibold text-[var(--color-text-primary)]">Bra band & cup</h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Underbust: tape snugly under the bust. Overbust: around the fullest part of the chest. Cup size often
              follows the difference between these two measurements.
            </p>
          </figcaption>
        </figure>
      </div>
      <div className="mt-10 rounded-xl bg-[var(--color-bg)] p-4 text-sm text-[var(--color-text-secondary)]">
        <p className="font-medium text-[var(--color-text-primary)]">Fit tips</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Broader shoulders or a larger ribcage may mean sizing up in tops and dresses.</li>
          <li>Narrower hips can shift how pants and skirts sit—check waist and hip measurements together.</li>
          <li>Brand charts differ; use these converters as a first pass, then read each product&apos;s size notes.</li>
        </ul>
      </div>
    </section>
  );
}
