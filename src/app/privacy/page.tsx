import { pageMetadata } from "@/calculators/metadata";
import { ProsePage } from "@/components/layout/prose-page";
import { ContentSection } from "@/components/ui/content-section";
import { analyticsEnabled } from "@/config/analytics";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How HisabBD handles your information: calculations run in your browser, nothing you enter is stored or sent, no accounts and no tracking cookies.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ProsePage
      title="Privacy"
      intro="A short, plain explanation of what happens to your information on HisabBD."
      updated="5 October 2026"
    >
      <ContentSection id="inputs" title="What you type into calculators">
        <p>
          Calculations run in your browser. The numbers and dates you enter aren’t sent to HisabBD’s
          servers and aren’t stored by HisabBD. They’re cleared when you reset the calculator or leave
          the page.
        </p>
        <p>
          If you use <strong>Copy result</strong> or <strong>Share</strong>, the result goes to your
          clipboard or to the app you choose, and from there it’s up to you.
        </p>
      </ContentSection>
      <ContentSection id="saved" title="Saved and recently used calculators">
        <p>
          To show “Your calculators” on the homepage, your browser remembers which calculators you
          opened recently and which ones you saved. Only the calculator’s name (for example
          “age-calculator”) is stored, in your browser’s local storage. Nothing you type into a
          calculator is stored, and this list is never sent to HisabBD. Clearing your browser’s
          site data removes it.
        </p>
      </ContentSection>

      <ContentSection id="accounts" title="Accounts, cookies and tracking">
        <ul>
          <li>There are no accounts or sign-ups.</li>
          <li>HisabBD doesn’t use advertising or tracking cookies.</li>
          <li>Fonts are served from this website, not from a third-party font service.</li>
        </ul>
        {analyticsEnabled ? (
          <p>
            HisabBD uses <strong>Umami</strong>, a privacy-focused analytics service that doesn’t
            use cookies, to count page visits and a few anonymous actions: opening a calculator,
            completing a calculation, searching (the number of results only, not what you typed),
            clicking a search result or a related calculator, saving a calculator, and copying or
            sharing a result. Each event records only which calculator it was.{" "}
            <strong>The values you enter and the results you get are never sent.</strong> If your
            browser sends a “Do Not Track” signal, no analytics are collected.
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
