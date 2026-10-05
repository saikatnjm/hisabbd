"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { toggleFavorite } from "@/lib/saved-calculators";
import { useSavedCalculators } from "@/lib/use-saved-calculators";
import { ShareIcon, StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const buttonClasses =
  "inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-slate-900/10 bg-white px-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-900/25";

/**
 * Save (favourite) and Share for a calculator page. Sharing sends only the
 * page address, never anything typed into the calculator.
 */
export function CalculatorPageActions({ slug, name }: { slug: string; name: string }) {
  const favorites = useSavedCalculators("favorites");
  const isFavorite = favorites.includes(slug);
  const [status, setStatus] = useState("");

  function onToggleFavorite() {
    const nowFavorite = toggleFavorite(slug);
    setStatus(nowFavorite ? `${name} saved to your calculators.` : `${name} removed from your calculators.`);
    track({ name: "favorite_toggled", calculator: slug, favorite: nowFavorite });
  }

  async function onShare() {
    const url = `${window.location.origin}${window.location.pathname}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `${name} | HisabBD`, url });
        track({ name: "page_shared", calculator: slug, method: "share" });
        setStatus("");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      track({ name: "page_shared", calculator: slug, method: "copy" });
      setStatus("Link copied.");
    } catch {
      setStatus(`Couldn’t copy automatically. The link is ${url}`);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button type="button" aria-pressed={isFavorite} onClick={onToggleFavorite} className={buttonClasses}>
        <StarIcon className={cn("size-5", isFavorite ? "fill-sun-300 text-finance-ink" : "text-slate-500")} />
        {isFavorite ? "Saved" : "Save"}
      </button>
      <button type="button" onClick={onShare} className={buttonClasses}>
        <ShareIcon className="size-5 text-slate-500" />
        Share
        <span className="sr-only">this calculator</span>
      </button>
      <p role="status" className="min-h-5 text-sm text-slate-700">
        {status}
      </p>
    </div>
  );
}

