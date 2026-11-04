import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { LABOUR_2026_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3 align-top";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Each change: topic, what the 2026 Act says now, section. From Act No. 43 of 2026. */
const CHANGES: readonly [topic: string, now: string, section: string][] = [
  ["Resignation compensation (permanent worker)", "Per completed year: 7 days’ wages for up to 3 years’ service; 15 days for over 3 and under 10 years; 30 days’ wages or gratuity, whichever is more, for 10 years or more. On top of all other benefits.", "27(4)"],
  ["Which wage the compensation uses", "The last monthly basic wage and dearness allowance before the job ended, plus any ad hoc or interim wage.", "14(3)"],
  ["What counts as “one year” of service", "At least 240 days actually worked in the previous 12 calendar months (and 120 days in 6 months counts as “six months”).", "14(1)"],
  ["Festival leave", "13 days a year (was “eleven”).", "118(1)"],
  ["Maternity leave", "120 days in total (was “sixteen weeks”); 60 days before and 60 after the birth (was “eight weeks”).", "46, 47, 14(2)"],
  ["Maternity leave and earned leave", "Up to 120 days of maternity leave count as days worked for earned leave.", "117(8)(d)"],
];

/** English guide: what the Labour (Amendment) Act 2026 changed for pay and leave (Server Component, no JS). */
export function LabourAct2026AmendmentGuideContent() {
  const exit = localePath("en", calculatorPath("job-exit-benefit-calculator"));

  return (
    <>
      <ContentSection id="when" title="When the law took effect">
        <p>
          The Bangladesh Labour (Amendment) Act 2026 is Act No. 43 of 2026, dated 10 April 2026. Its section 1(2) says it
          takes effect immediately. This page covers only the changes to workers’ money and leave that our calculators use;
          for trade unions and the other changes, read the full Act.
        </p>
      </ContentSection>

      <ContentSection id="changes" title="What changed">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Topic</th>
                <th scope="col" className={head}>What the law says now</th>
                <th scope="col" className={head}>Section</th>
              </tr>
            </thead>
            <tbody>
              {CHANGES.map(([topic, now, section]) => (
                <tr key={topic}>
                  <td className={`${cell} font-medium text-slate-900`}>{topic}</td>
                  <td className={cell}>{now}</td>
                  <td className={`${cell} whitespace-nowrap`}>{section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="resignation" title="What you get when you resign: an example">
        <p>
          The heart of the new section 27(4): compensation for resigning <strong>from the first completed year</strong>, at a
          rate set by your total length of service. Section 27(1) sets 60 days’ written notice before resigning.
        </p>
        <ol>
          <li>A permanent worker resigns with notice after 4 years 8 months; their last monthly basic wage is ৳20,000.</li>
          <li>Completed years: 4, which is over 3 and under 10, so 15 days’ wages per year.</li>
          <li>
            The Act doesn’t say how a monthly wage becomes a daily wage. If your employer divides by 30, the daily wage is
            ৳20,000 ÷ 30 = ৳666.67.
          </li>
          <li>
            Compensation = 4 × 15 × ৳666.67 = <strong>৳40,000</strong>.
          </li>
        </ol>
        <p>
          To work out your own figure, use the{" "}
          <Link href={exit} className={link}>
            Job Exit Benefit Calculator
          </Link>
          ; it also covers retrenchment, discharge and termination by the employer.
        </p>
      </ContentSection>

      <ContentSection id="leave" title="Changes to leave">
        <ul>
          <li>Festival leave is now 13 days a year; section 118 covers substitute leave and pay for working on a festival day.</li>
          <li>Maternity leave is now 120 days, and those days count as days worked for earned leave.</li>
          <li>
            To see how much earned leave you have and what it is worth when you leave, use the{" "}
            <Link href={localePath("en", calculatorPath("earned-leave-calculator"))} className={link}>
              Earned Leave Calculator
            </Link>
            ; for overtime, the{" "}
            <Link href={localePath("en", calculatorPath("overtime-calculator"))} className={link}>
              Overtime Pay Calculator
            </Link>
            .
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="note" title="Keep in mind">
        <p>
          This is a general explanation of the law, not legal advice. If a job ended before 10 April 2026, the law as it
          stood then may apply. Your appointment letter, service rules and the courts decide; if in doubt, ask the labour
          court or a lawyer.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            <a href={S.amendment.url} target="_blank" rel="noopener" className={link} lang="bn">
              {S.amendment.title}
            </a>{" "}
            (Bangla)
          </li>
          <li>
            <a href={S.act.url} target="_blank" rel="noopener" className={link} lang="bn">
              {S.act.title}
            </a>{" "}
            (Bangla)
          </li>
        </ul>
        <p>Read and checked on 2 November 2026.</p>
      </ContentSection>
    </>
  );
}
