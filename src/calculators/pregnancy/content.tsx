import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { PREGNANCY_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Explanatory content for the Pregnancy Due Date Calculator page (Server Component, no JS). */
export function PregnancyCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How the due date is calculated">
        <p>
          <strong>Due date = first day of your last period + 280 days (40 weeks)</strong>
        </p>
        <p>
          Pregnancy is counted from the first day of the last period, not from conception, because that first date is
          usually known. How many weeks pregnant you are is the number of days since then ÷ 7: completed weeks and the
          days left over.
        </p>
        <h3>Worked example</h3>
        <ol>
          <li>The last period started on 1 June 2026.</li>
          <li>1 June 2026 + 280 days = <strong>8 March 2027</strong> (a Monday), the due date.</li>
          <li>On 1 November 2026 it is 153 days since 1 June: 153 ÷ 7 = 21 weeks with 6 days over, so <strong>21 weeks 6 days</strong>.</li>
          <li>21 weeks is the second trimester, with 127 days to the due date.</li>
        </ol>
        <p>
          If your doctor gave you a date from an ultrasound, choose “Due date from my doctor”. The calculator counts 280
          days back from that date and shows how many weeks you are now. For a due date of 20 May 2027, on 1 November
          2026 that is 11 weeks 3 days, in the first trimester.
        </p>
      </ContentSection>

      <ContentSection id="stages" title="Trimesters and term">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Stage</th>
                <th scope="col" className={head}>Weeks</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>First trimester</td><td className={cell}>Up to 13 weeks 6 days</td></tr>
              <tr><td className={cell}>Second trimester</td><td className={cell}>14 weeks to 27 weeks 6 days</td></tr>
              <tr><td className={cell}>Third trimester</td><td className={cell}>28 weeks until birth</td></tr>
              <tr><td className={cell}>Early term</td><td className={cell}>37 weeks to 38 weeks 6 days</td></tr>
              <tr><td className={cell}>Full term</td><td className={cell}>39 weeks to 40 weeks 6 days</td></tr>
              <tr><td className={cell}>Late term</td><td className={cell}>41 weeks to 41 weeks 6 days</td></tr>
              <tr><td className={cell}>Post-term</td><td className={cell}>42 weeks and later</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The due date falls at exactly 40 weeks, in the middle of full term. Think of it as the middle of a window, not
          a fixed day.
        </p>
      </ContentSection>

      <ContentSection id="accuracy" title="When your doctor’s date is more accurate">
        <ul>
          <li>
            <strong>A first-trimester ultrasound</strong> is more accurate than the period date. ACOG’s guidance says to
            use the ultrasound date when the two differ.
          </li>
          <li>
            <strong>Irregular periods</strong>, or not being sure of the date of the last period, make the 280-day rule
            less accurate. Many websites add or subtract days for cycle length, but we found no authoritative source for
            that, so we don’t.
          </li>
          <li>
            <strong>After IVF</strong> the date is worked out from the embryo transfer; use the date your doctor gave
            you.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="care" title="What this calculator is not">
        <p>
          This calculator only works out dates; it is not medical advice and doesn’t replace antenatal check-ups. The
          World Health Organization recommends at least eight contacts with a health worker during pregnancy. If
          anything worries you, contact a doctor or your nearest health centre.
        </p>
        <p>
          The{" "}
          <Link href={localePath("en", calculatorPath("bmi-calculator"))} className={link}>
            BMI Calculator
          </Link>{" "}
          doesn’t apply during pregnancy; ask your doctor about your weight before pregnancy. To count the days between
          any two dates, use the{" "}
          <Link href={localePath("en", calculatorPath("date-difference-calculator"))} className={link}>
            Date Difference Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose “First day of my last period” or “Due date from my doctor”.</li>
          <li>Enter the date. The date to count to is today by default; you can change it.</li>
          <li>
            Select Calculate due date to see the weeks, due date, trimester, days to go and the date each stage of term
            starts.
          </li>
        </ol>
        <p>
          The dates you enter are never sent anywhere. For privacy, this calculator also keeps nothing in “Your recent
          calculations”.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            The 280-day rule and ultrasound dating:{" "}
            <a href={S.dueDate.url} target="_blank" rel="noopener" className={link}>
              {S.dueDate.title}
            </a>
            .
          </li>
          <li>
            Term categories:{" "}
            <a href={S.term.url} target="_blank" rel="noopener" className={link}>
              {S.term.title}
            </a>
            .
          </li>
          <li>
            Antenatal contacts:{" "}
            <a href={S.antenatal.url} target="_blank" rel="noopener" className={link}>
              {S.antenatal.title}
            </a>
            .
          </li>
        </ul>
        <p>Checked on 1 November 2026.</p>
      </ContentSection>
    </>
  );
}
