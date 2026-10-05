import Link from "next/link";
import { pageMetadata } from "@/calculators/metadata";
import { CALCULATORS_PATH } from "@/calculators/paths";
import { ProsePage } from "@/components/layout/prose-page";
import { ContentSection } from "@/components/ui/content-section";

export const metadata = pageMetadata({
  title: "About",
  description:
    "HisabBD is a free set of simple online calculators for everyday life in Bangladesh: what it does, how calculations work and their limits.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ProsePage
      title="About HisabBD"
      intro="Hisab (হিসাব) is the Bangla word for calculation. HisabBD is a free set of simple calculators for everyday life in Bangladesh."
    >
      <ContentSection id="what" title="What HisabBD does">
        <p>
          Each calculator does one job: your exact age, a BMI check, a semester GPA, a loan
          instalment, a discount in Taka and so on. You get a clear answer and a short explanation of
          how it was worked out.
        </p>
        <p>
          <Link href={CALCULATORS_PATH} className="font-semibold text-brand-700 underline underline-offset-4">
            See all calculators
          </Link>
        </p>
      </ContentSection>
      <ContentSection id="how" title="How the calculations work">
        <ul>
          <li>Calculations run in your browser. What you type isn’t sent to a server.</li>
          <li>Each calculator states its formula and assumptions on its page.</li>
          <li>
            Rules that change over time, such as tax rates or a university’s grading policy, aren’t
            guessed. Where they matter, you enter them yourself or the page tells you what it
            assumes.
          </li>
        </ul>
      </ContentSection>
      <ContentSection id="limits" title="Limits">
        <p>
          Results are for general information. For decisions about money, health, admissions or
          anything official, check the figures with the institution involved or a qualified
          professional.
        </p>
      </ContentSection>
    </ProsePage>
  );
}
