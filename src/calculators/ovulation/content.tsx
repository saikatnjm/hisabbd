import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { OVULATION_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the Ovulation Calculator (Server Component, no JS). */
export function OvulationCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How the ovulation days are worked out">
        <ol>
          <li>
            <strong>Next period = first day of the last period + cycle length.</strong>
          </li>
          <li>
            <strong>Likely ovulation = from 16 days to 10 days before the next period.</strong> The NHS says most women
            ovulate around 10 to 16 days before their next period, so we show that range rather than one exact day.
          </li>
        </ol>
        <h3>Example</h3>
        <p>
          Last period on 20 October 2026, 28-day cycle. The next period is 20 October + 28 days ={" "}
          <strong>17 November</strong>. Likely ovulation is 16 to 10 days before 17 November: <strong>1 to 7 November</strong>{" "}
          (days 13 to 19 of the cycle, around day 14). In the cycle after that it is 29 November to 5 December, with the
          next period on 15 December.
        </p>
      </ContentSection>

      <ContentSection id="fertile" title="Fertile days and their limits">
        <ul>
          <li>Sperm can survive up to 7 days, so sex in the days before ovulation can also lead to pregnancy.</li>
          <li>If you are trying for a baby, the NHS suggests sex every 2 to 3 days rather than aiming for one day.</li>
          <li>The NHS says cycles of 21 to 35 days are normal. Outside that, or with irregular cycles, the dates are less reliable.</li>
          <li>
            This is not contraception: ovulation can come earlier or later. For a reliable method, ask a doctor or family
            planning service.
          </li>
        </ul>
        <p>
          If you are pregnant, the{" "}
          <Link href={localePath("en", calculatorPath("pregnancy-calculator"))} className={link}>
            Pregnancy Due Date Calculator
          </Link>{" "}
          gives your due date and how many weeks you are; to count days between dates, use the{" "}
          <Link href={localePath("en", calculatorPath("date-difference-calculator"))} className={link}>
            Date Difference Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the first day of your last period.</li>
          <li>Enter your cycle length in days (leave 28 if you’re not sure).</li>
          <li>Select Show my dates to see the likely ovulation days, today’s cycle day and your next three period dates.</li>
        </ol>
        <p>The dates you enter are never sent anywhere, and for privacy no list of calculations is kept.</p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            <a href={S.cycle.url} target="_blank" rel="noopener" className={link}>
              {S.cycle.title}
            </a>{" "}
            (reviewed 5 January 2023).
          </li>
          <li>
            <a href={S.trying.url} target="_blank" rel="noopener" className={link}>
              {S.trying.title}
            </a>{" "}
            (reviewed 2 June 2026).
          </li>
        </ul>
        <p>Checked on 2 November 2026. This is not medical advice.</p>
      </ContentSection>
    </>
  );
}
