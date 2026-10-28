"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { track } from "@/lib/analytics";
import { rememberRecent } from "@/lib/saved-calculators";

const CalculatorContext = createContext<{ slug: string; name: string } | null>(null);

/** The current calculator's slug, for analytics and history in shared result components. */
export function useCalculatorSlug(): string | null {
  return useContext(CalculatorContext)?.slug ?? null;
}

/** The current calculator's name in the page language (e.g. for the share image). */
export function useCalculatorName(): string {
  return useContext(CalculatorContext)?.name ?? "";
}

/**
 * Wraps a calculator widget: provides its slug and name, remembers it as "recently
 * used" in this browser (slug only) and reports that the calculator was opened.
 */
export function CalculatorProvider({ slug, name, children }: { slug: string; name: string; children: React.ReactNode }) {
  useEffect(() => {
    rememberRecent(slug);
    track({ name: "calculator_opened", calculator: slug });
  }, [slug]);

  const value = useMemo(() => ({ slug, name }), [slug, name]);
  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}
