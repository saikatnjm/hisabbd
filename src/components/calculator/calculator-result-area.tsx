"use client";

import { useEffect, useRef } from "react";

/**
 * Holds a calculator's result (or its placeholder). Handles the parts every
 * calculator needs: a short screen-reader announcement, a gentle reveal
 * animation (skipped with reduced motion), and scrolling the result into view
 * on small screens after "Calculate".
 *
 * @param revealKey Increment after each successful Calculate. 0 = never revealed.
 * @param announcement One short sentence read by screen readers when it changes.
 */
export function CalculatorResultArea({
  revealKey,
  announcement,
  result,
  placeholder,
}: {
  revealKey: number;
  announcement: string;
  result: React.ReactNode | null;
  placeholder: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (revealKey === 0 || !el) return;
    if (el.getBoundingClientRect().bottom > window.innerHeight) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }, [revealKey]);

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {result ? announcement : ""}
      </p>
      <div ref={ref} className="mt-6 scroll-mt-4">
        {result ? (
          <div key={revealKey} className="result-in">
            {result}
          </div>
        ) : (
          placeholder
        )}
      </div>
    </>
  );
}
