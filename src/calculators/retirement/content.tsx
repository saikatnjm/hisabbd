import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { RETIREMENT_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the Government Retirement Date Calculator (Server Component, no JS). */
export function RetirementCalculatorContent() {
  return (
    <>
      <ContentSection id="rules" title="The rules: Civil Service Act 2018">
        <ul>
          <li>
            <strong>Section 43:</strong> a government servant retires on completing 59 years of age; a freedom fighter
            government servant on completing 60 years.
          </li>
          <li>
            <strong>Section 47:</strong> after retiring, post-retirement leave (PRL) of up to 1 year, subject to the rules.
          </li>
          <li>
            <strong>Section 44:</strong> optional retirement any time after completing 25 years of service, with at least 30
            days’ written notice, which can’t then be changed or withdrawn.
          </li>
        </ul>
        <p>
          The Act says “on completing 59 years” but not which calendar day that is. So we show the date you complete 59 (or
          60) years, your birthday that year; your office’s retirement order sets the exact last working day.
        </p>
      </ContentSection>

      <ContentSection id="example" title="Example">
        <p>
          Born 15 May 1970, joined service on 1 July 1996. Retirement date: 15 May 2029 (completing 59); from 2 November 2026
          that is 2 years 6 months 13 days away. PRL could run until 15 May 2030 at most. 25 years of service were completed on
          1 July 2021, so optional retirement with 30 days’ written notice is already possible. As a freedom fighter, the
          retirement date would be 15 May 2030.
        </p>
      </ContentSection>

      <ContentSection id="who" title="Who these rules don’t cover">
        <p>
          Under section 3(3), unless another law or contract says otherwise, the Act doesn’t apply to constitutional posts,
          the judiciary, defence services, public universities, the Parliament Secretariat, the Supreme Court, the Election
          Commission Secretariat, autonomous bodies and state-owned enterprises, local government bodies, development project
          posts, or apprentice, contract, ad hoc or temporary jobs. Check their own rules.
        </p>
        <p>
          For the age limit to join government service, use the{" "}
          <Link href={localePath("en", calculatorPath("government-job-age-calculator"))} className={link}>
            Government Job Age Calculator
          </Link>
          ; for your exact age, the{" "}
          <Link href={localePath("en", calculatorPath("age-calculator"))} className={link}>
            Age Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter your date of birth; tick the box if you are a freedom fighter government servant.</li>
          <li>For the 25-year optional retirement date, enter the date you joined service.</li>
          <li>Select Find retirement date to see the date, the time left, the latest PRL date and the optional retirement date.</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="Source">
        <p>
          <a href={S.act.url} target="_blank" rel="noopener" className={link} lang="bn">
            {S.act.title}
          </a>
          , sections 3(3), 43, 44 and 47 (Bangla). Read and checked on 2 November 2026. This is not legal advice.
        </p>
      </ContentSection>
    </>
  );
}
