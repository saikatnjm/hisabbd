/**
 * Privacy-first analytics events.
 *
 * Only these events exist, and their properties are limited to calculator
 * slugs, counts and flags. Calculator INPUT VALUES (dates, weights, salaries,
 * loan amounts …) and search text are never sent: the types below make that
 * impossible to do by accident.
 *
 * Events go to Umami (cookieless) when it is configured (see
 * components/analytics/analytics-script.tsx). Without configuration every call
 * is a no-op, so the site works the same and loads no extra script.
 */

export type AnalyticsEvent =
  | { name: "calculator_opened"; calculator: string }
  | { name: "calculation_completed"; calculator: string }
  | { name: "calculator_search"; results: number }
  | { name: "search_result_clicked"; target: string; kind: "calculator" | "category" }
  | { name: "related_calculator_clicked"; from: string; to: string; placement: "next" | "related" }
  | { name: "result_copied"; calculator: string }
  | { name: "result_shared"; calculator: string }
  | { name: "page_shared"; calculator: string; method: "share" | "copy" }
  | { name: "favorite_toggled"; calculator: string; favorite: boolean };

interface UmamiTracker {
  track: (event: string, data?: Record<string, string | number | boolean>) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const { name, ...data } = event;
  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics must never break the page.
  }
}

/**
 * Data attributes for links that should report a related-calculator click.
 * Read by AnalyticsClickListener (no client JavaScript needed on the link).
 */
export function relatedLinkAttributes(from: string, to: string, placement: "next" | "related") {
  return {
    "data-analytics": "related_calculator_clicked",
    "data-from": from,
    "data-to": to,
    "data-placement": placement,
  } as const;
}
