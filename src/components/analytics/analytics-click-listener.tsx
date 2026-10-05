"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * One delegated click listener for server-rendered links marked with
 * `data-analytics` (see relatedLinkAttributes), so those links stay plain HTML.
 */
export function AnalyticsClickListener() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest<HTMLElement>("[data-analytics]");
      if (!link) return;
      const { analytics, from, to, placement } = link.dataset;
      if (analytics === "related_calculator_clicked" && from && to) {
        track({ name: analytics, from, to, placement: placement === "next" ? "next" : "related" });
      }
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
