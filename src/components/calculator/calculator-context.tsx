"use client";

import { createContext, useContext, useEffect } from "react";
import { track } from "@/lib/analytics";
import { rememberRecent } from "@/lib/saved-calculators";

const CalculatorSlugContext = createContext<string | null>(null);

/** The current calculator's slug, for analytics in shared result components. */
export function useCalculatorSlug(): string | null {
  return useContext(CalculatorSlugContext);
}

/**
 * Wraps a calculator widget: provides its slug, remembers it as "recently
 * used" in this browser (slug only) and reports that the calculator was opened.
 */
export function CalculatorProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  useEffect(() => {
    rememberRecent(slug);
    track({ name: "calculator_opened", calculator: slug });
  }, [slug]);

  return <CalculatorSlugContext.Provider value={slug}>{children}</CalculatorSlugContext.Provider>;
}
