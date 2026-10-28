import { pageMetadata } from "@/calculators/metadata";
import { CALCULATORS_PATH } from "@/calculators/paths";
import { CalculatorsIndexPage } from "@/components/pages/calculators-index";

export const metadata = pageMetadata({
  title: "All Calculators",
  description:
    "Every free HisabBD calculator in one place: health, education, finance, everyday and date calculators, grouped by topic.",
  path: CALCULATORS_PATH,
});

export default function CalculatorsPage() {
  return <CalculatorsIndexPage locale="en" />;
}
