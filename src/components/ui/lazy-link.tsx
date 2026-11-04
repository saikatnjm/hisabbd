"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * next/link that prefetches only when the visitor shows intent: hover,
 * keyboard focus or touch. Plain <Link> prefetches every link that scrolls
 * into view, and with long lists (footer, homepage, related calculators)
 * that downloads many pages nobody opens, which is most of the site's
 * bandwidth on Vercel. A touch starts about 100 ms before the tap lands, so
 * navigation still feels instant. Use it everywhere instead of next/link.
 */
export function LazyLink({ onMouseEnter, onFocus, onTouchStart, prefetch, ...props }: ComponentProps<typeof Link>) {
  const [intent, setIntent] = useState(false);
  return (
    <Link
      {...props}
      prefetch={intent ? (prefetch ?? null) : false}
      onMouseEnter={(event) => {
        setIntent(true);
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        setIntent(true);
        onFocus?.(event);
      }}
      onTouchStart={(event) => {
        setIntent(true);
        onTouchStart?.(event);
      }}
    />
  );
}
