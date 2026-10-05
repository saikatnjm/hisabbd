import { pageMetadata } from "@/calculators/metadata";
import { ProsePage } from "@/components/layout/prose-page";
import { ContentSection } from "@/components/ui/content-section";

export const metadata = pageMetadata({
  title: "Terms of use",
  description:
    "The terms for using HisabBD's free calculators: results are for general information and should be checked before important decisions.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ProsePage title="Terms of use" intro="Using HisabBD means you accept these simple terms." updated="5 October 2026">
      <ContentSection id="information" title="Results are for information">
        <p>
          HisabBD’s calculators are built carefully and their formulas are explained on each page, but
          results are estimates for general information. They aren’t financial, medical, legal,
          academic or professional advice.
        </p>
        <p>
          Before relying on a result for something important, such as a loan, a health decision, an
          admission or official paperwork, confirm it with the institution involved or a qualified
          professional.
        </p>
      </ContentSection>
      <ContentSection id="as-is" title="No guarantee">
        <p>
          The site is provided as it is, without any warranty that it is error-free or always
          available. HisabBD isn’t responsible for losses that result from relying on a calculation.
        </p>
      </ContentSection>
      <ContentSection id="use" title="Fair use">
        <p>
          You’re welcome to use the calculators for personal, study or work purposes and to share
          results. Please don’t attempt to disrupt the site or copy it wholesale.
        </p>
      </ContentSection>
      <ContentSection id="changes" title="Changes">
        <p>These terms may be updated. The date above shows the latest version.</p>
      </ContentSection>
    </ProsePage>
  );
}
