import { pageMetadata } from "@/calculators/metadata";
import { ProsePage } from "@/components/layout/prose-page";
import { ContentSection } from "@/components/ui/content-section";
import { LocalDataControls } from "@/components/layout/local-data-controls";
import { analyticsEnabled, gaEnabled, umamiEnabled } from "@/config/analytics";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How HisabBD handles your information: calculations run in your browser, nothing you enter is sent anywhere, recent calculations stay on your device, and no accounts.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ProsePage
      title="Privacy"
      intro="A short, plain explanation of what happens to your information on HisabBD."
      updated="28 October 2026"
    >
      <ContentSection id="inputs" title="What you type into calculators">
        <p>
          Calculations run in your browser. The numbers and dates you enter are never sent to
          HisabBD’s servers, never put in a link and never passed to analytics.
        </p>
        <p>
          To show “Your recent calculations”, your browser keeps your last few calculations on this
          device: what you entered and a one-line result, up to 5 per calculator and 30 in total. They
          stay in your browser’s local storage, so anyone using this browser on this device can see
          them. You can remove one, turn saving off, or clear everything below.
        </p>
        <p>
          If you use <strong>Copy result</strong> or <strong>Share</strong>, the result goes to your
          clipboard or to the app you choose, and from there it’s up to you.
        </p>
      </ContentSection>
      <ContentSection id="saved" title="Saved on this device">
        <p>Your browser also remembers, on this device only:</p>
        <ul>
          <li>which calculators you opened recently and which ones you saved (only their names, for example “age-calculator”);</li>
          <li>your settings in each calculator, such as cm or feet, kg or lb, HSC or SSC, or your katha size.</li>
        </ul>
        <p>
          None of this is sent to HisabBD. Clearing your browser’s site data removes it, or use the
          controls here:
        </p>
        <LocalDataControls />
      </ContentSection>

      <ContentSection id="accounts" title="Accounts, cookies and tracking">
        <ul>
          <li>There are no accounts or sign-ups.</li>
          <li>
            {gaEnabled
              ? "HisabBD doesn’t use advertising cookies. Google Analytics sets analytics cookies, described below."
              : "HisabBD doesn’t use advertising or tracking cookies."}
          </li>
          <li>Fonts are served from this website, not from a third-party font service.</li>
        </ul>
        {analyticsEnabled ? (
          <p>
            HisabBD uses{" "}
            {gaEnabled ? <strong>Google Analytics</strong> : null}
            {gaEnabled && umamiEnabled ? " and " : null}
            {umamiEnabled ? <strong>Umami</strong> : null}
            {gaEnabled
              ? " (Google Analytics sets cookies to tell visits apart; advertising features are turned off),"
              : ", a privacy-focused analytics service that doesn’t use cookies,"}{" "}
            to count page visits and a few anonymous actions: opening a calculator,
            completing a calculation, searching (the number of results only, not what you typed),
            clicking a search result or a related calculator, saving a calculator, and copying or
            sharing a result. Each event records only which calculator it was.{" "}
            <strong>The values you enter and the results you get are never sent.</strong> If your
            browser sends a “Do Not Track” signal, Umami collects nothing.
          </p>
        ) : (
          <p>HisabBD doesn’t currently use any analytics.</p>
        )}
      </ContentSection>

      <ContentSection id="hosting" title="Hosting">
        <p>
          Like any website, the hosting provider may record standard technical information when pages
          are requested, such as your IP address, browser type and the pages visited, to deliver and
          protect the site.
        </p>
      </ContentSection>
      <ContentSection id="changes" title="Changes">
        <p>
          If HisabBD’s practices change, this page will be
          updated before the change takes effect, with a new date above.
        </p>
      </ContentSection>
    </ProsePage>
  );
}
