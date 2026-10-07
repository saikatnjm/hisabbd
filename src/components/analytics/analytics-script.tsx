import Script from "next/script";
import { siteConfig } from "@/config/site";
import { GA_MEASUREMENT_ID, UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } from "@/config/analytics";
import { AnalyticsClickListener } from "@/components/analytics/analytics-click-listener";

/**
 * Loads Google Analytics 4 and/or Umami after the page is interactive. Each is
 * off unless its env var is set. Umami is cookieless, runs only on the
 * production domain and respects Do Not Track.
 */
export function AnalyticsScript() {
  if (!GA_MEASUREMENT_ID && !UMAMI_WEBSITE_ID) return null;
  return (
    <>
      {GA_MEASUREMENT_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
        </>
      ) : null}
      {UMAMI_WEBSITE_ID ? (
        <Script
          src={UMAMI_SCRIPT_URL}
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains={new URL(siteConfig.url).hostname}
          data-do-not-track="true"
          strategy="afterInteractive"
        />
      ) : null}
      <AnalyticsClickListener />
    </>
  );
}
