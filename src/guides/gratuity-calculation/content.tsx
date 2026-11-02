import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { guidePath } from "@/guides/paths";
import { localePath } from "@/i18n/locales";
import { LABOUR_2026_SOURCES as S } from "../labour-act-2026-amendment/sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** English guide: how gratuity is calculated under the Labour Act (Server Component, no JS). */
export function GratuityCalculationGuideContent() {
  const exit = localePath("en", calculatorPath("job-exit-benefit-calculator"));

  return (
    <>
      <ContentSection id="definition" title="How the law defines gratuity">
        <p>Section 2(10) of the Bangladesh Labour Act 2006 says (our translation of the Bangla text):</p>
        <blockquote className="border-l-4 border-brand-200 pl-4 text-slate-800">
          “Gratuity” means at least 30 days’ wages at the last wage rate for every completed year of a worker’s service, or
          for service of more than six months beyond that, or 45 days’ wages at the last wage rate for service of more than
          10 years, payable to the worker when the employment ends.
        </blockquote>
      </ContentSection>

      <ContentSection id="formula" title="The formula">
        <p>
          <strong>Gratuity = years counted × days per year × daily wage</strong>
        </p>
        <ul>
          <li>
            <strong>Years counted:</strong> every completed year, plus one more if more than six months are left over. 8
            years 7 months = 9 years; 8 years 5 months = 8 years.
          </li>
          <li>
            <strong>Days per year:</strong> at least 30; 45 if service is more than 10 years. Following the definition’s
            wording, we apply 45 days to every year counted.
          </li>
          <li>
            <strong>Daily wage:</strong> from the last wage rate. For job exit benefits, section 14(3) defines wages as the
            last monthly basic wage, dearness allowance and any ad hoc or interim wage. The Act doesn’t say how many days to
            divide the monthly wage by; use the number your employer uses (often 30 or 26).
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="examples" title="Two examples">
        <h3>1. 8 years 7 months on ৳15,000</h3>
        <p>
          A basic wage of ৳14,000 plus ৳1,000 dearness allowance is ৳15,000; divided by 30, ৳500 a day. Years counted: 9
          (7 months is more than six), under 10 years so 30 days a year: 9 × 30 × ৳500 = <strong>৳1,35,000</strong>.
        </p>
        <h3>2. 12 years 7 months on ৳30,000</h3>
        <p>
          ৳30,000 ÷ 30 = ৳1,000 a day. Years counted: 13, and service is over 10 years, so 45 days a year: 13 × 45 ×
          ৳1,000 = <strong>৳5,85,000</strong>.
        </p>
      </ContentSection>

      <ContentSection id="when" title="When you get gratuity">
        <ul>
          <li>
            On retrenchment (section 20), discharge (22), termination by the employer (26) and death (19), the Act pays
            compensation “or gratuity, if payable, whichever is higher”.
          </li>
          <li>
            On resignation (section 27), service of 10 years or more earns 30 days’ wages a year or gratuity, whichever is
            higher; shorter service earns 7 or 15 days’ wages a year under the 2026 amendment. See{" "}
            <Link href={localePath("en", guidePath("labour-act-2026-amendment"))} className={link}>
              what the Labour Act 2026 amendment changed
            </Link>
            .
          </li>
          <li>
            The Act says “if payable”: these sections don’t require every employer to have a gratuity scheme. Check whether
            your appointment letter or service rules provide gratuity.
          </li>
        </ul>
        <p>
          To compare compensation and gratuity with your own wage and service, use the{" "}
          <Link href={exit} className={link}>
            Job Exit Benefit Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="note" title="Keep in mind">
        <p>
          This is a general explanation of the law, not legal advice. Government employees’ pension and gratuity follow
          separate rules, so this isn’t for them. Your appointment letter, service rules and the courts decide.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            <a href={S.act.url} target="_blank" rel="noopener" className={link} lang="bn">
              {S.act.title}
            </a>{" "}
            (sections 2(10), 14(3), 19, 20, 22, 26, 27; Bangla)
          </li>
          <li>
            <a href={S.amendment.url} target="_blank" rel="noopener" className={link} lang="bn">
              {S.amendment.title}
            </a>{" "}
            (Bangla)
          </li>
        </ul>
        <p>Read and checked on 2 November 2026.</p>
      </ContentSection>
    </>
  );
}
