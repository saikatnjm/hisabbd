import { pageMetadata } from "@/calculators/metadata";
import { GuidesIndexPage } from "@/components/pages/guides-index";
import { GUIDES_PATH } from "@/guides/paths";

export const metadata = pageMetadata({
  title: "হিসাবের নিয়ম ও গাইড: সহজ ভাষায় বাংলাদেশের দৈনন্দিন হিসাব",
  description:
    "সরকারি চাকরির বয়সসীমা, এসএসসি-এইচএসসি জিপিএ, জমি মাপার নিয়মসহ নানা হিসাবের সহজ গাইড, প্রতিটিতে উদাহরণ আর ফ্রি ক্যালকুলেটর।",
  path: GUIDES_PATH,
  locale: "bn",
});

export default function BanglaGuidesPage() {
  return <GuidesIndexPage locale="bn" />;
}
