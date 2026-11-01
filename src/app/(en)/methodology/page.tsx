import { pageMetadata } from "@/calculators/metadata";
import { MethodologyPage } from "@/components/pages/methodology-page";

export const metadata = pageMetadata({
  title: "How We Check Our Numbers",
  description:
    "How HisabBD checks every figure: visible formulas tested against worked examples, official dated sources, no guessed rules, and when each rule was last reviewed.",
  path: "/methodology",
});

export default function EnglishMethodologyPage() {
  return <MethodologyPage locale="en" />;
}
