import { pageMetadata } from "@/calculators/metadata";
import { CALCULATORS_PATH } from "@/calculators/paths";
import { CalculatorsIndexPage } from "@/components/pages/calculators-index";

export const metadata = pageMetadata({
  title: "সব ক্যালকুলেটর",
  description:
    "HisabBD-র সব ফ্রি ক্যালকুলেটর এক জায়গায়: স্বাস্থ্য, শিক্ষা, অর্থ, দৈনন্দিন আর তারিখের ক্যালকুলেটর, বিষয় অনুযায়ী সাজানো।",
  path: CALCULATORS_PATH,
  locale: "bn",
});

export default function BanglaCalculatorsPage() {
  return <CalculatorsIndexPage locale="bn" />;
}
