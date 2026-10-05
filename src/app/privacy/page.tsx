import { pageMetadata } from "@/calculators/metadata";
import { ProsePage } from "@/components/layout/prose-page";
import { ContentSection } from "@/components/ui/content-section";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How HisabBD handles your information: calculations run in your browser, no accounts, no analytics or advertising cookies.",
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
      <ContentSection id="accounts" title="Accounts, cookies and tracking">
        <ul>
          <li>There are no accounts or sign-ups.</li>
          <li>HisabBD doesn’t use analytics, advertising or tracking cookies.</li>
          <li>Fonts are served from this website, not from a third-party font service.</li>
        </ul>
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
          If HisabBD’s practices change (for example, if analytics are added), this page will be
          updated before the change takes effect, with a new date above.
        </p>
      </ContentSection>
    </ProsePage>
  );
}
