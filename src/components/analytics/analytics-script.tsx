import Script from "next/script";
import { siteConfig } from "@/config/site";
import { UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } from "@/config/analytics";
import { AnalyticsClickListener } from "@/components/analytics/analytics-click-listener";

/**
 * Loads Umami (cookieless, ~2 KB) after the page is interactive, only on the
 * production domain, and respects the browser's Do Not Track setting.
 */
export function AnalyticsScript() {
  if (!UMAMI_WEBSITE_ID) return null;
  return (
    <>
      <Script
        src={UMAMI_SCRIPT_URL}
        data-website-id={UMAMI_WEBSITE_ID}
        data-domains={new URL(siteConfig.url).hostname}
        data-do-not-track="true"
        strategy="afterInteractive"
      />
      <AnalyticsClickListener />
    </>
  );
}
