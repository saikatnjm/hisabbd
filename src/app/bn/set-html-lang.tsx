"use client";

import { useEffect } from "react";

/**
 * The root layout renders one <html lang> for both locales; this flips it to
 * Bangla on /bn pages for assistive tech. Search engines use the hreflang
 * alternates and the page content itself.
 */
export function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [lang]);

  return null;
}
