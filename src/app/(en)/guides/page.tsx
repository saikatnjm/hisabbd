import { pageMetadata } from "@/calculators/metadata";
import { GuidesIndexPage } from "@/components/pages/guides-index";
import { GUIDES_PATH } from "@/guides/paths";

export const metadata = pageMetadata({
  title: "Guides: How Everyday Calculations Work in Bangladesh",
  description:
    "Plain guides to government job age limits, SSC and HSC GPA, land measurement and more, each with a worked example and a free calculator.",
  path: GUIDES_PATH,
});

export default function GuidesPage() {
  return <GuidesIndexPage locale="en" />;
}
