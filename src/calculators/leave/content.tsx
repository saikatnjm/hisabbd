import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { LEAVE_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[34rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3 align-top";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Explanatory content for the Earned Leave Calculator (Server Component, no JS). Figures match logic.test.ts. */
export function LeaveCalculatorContent() {
  const en = (slug: string) => localePath("en", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="How earned leave is worked out">
        <p>
          <strong>Earned leave = days worked ÷ 18 (or 22, or 11), whole days only. Available = carried forward + earned, up to the limit. Left = available − taken.</strong>
        </p>
        <ol>
          <li>Earned: one day for every 18 days of work (shop, commercial, industrial, factory, road transport), 22 (tea plantation) or 11 (newspaper worker).</li>
          <li>Add earned leave carried forward from before.</li>
          <li>Apply the limit: 40 days (factory, road transport) or 60 days (tea plantation, shop, commercial, industrial).</li>
          <li>Add any leave your employer refused, then subtract the leave you took.</li>
          <li>If your job ends, unused days are paid at your daily wage.</li>
        </ol>
        <h3>A worked example</h3>
        <p>
          A worker in an industrial establishment has completed more than a year, worked 300 days in the last 12 months,
          carries 50 days forward and has taken 14 days. Wage for the last month worked is ৳31,200 for 26 days worked.
        </p>
        <ol>
          <li>Earned: 300 ÷ 18 = 16.67, so 16 whole days (12 days of work are left over).</li>
          <li>With carry-forward: 50 + 16 = 66 days.</li>
          <li>Limit of 60 days: 60 days available, 6 days lost to the limit.</li>
          <li>Taken 14 days: 60 − 14 = 46 days left.</li>
          <li>Daily wage: ৳31,200 ÷ 26 = ৳1,200. Unused leave on leaving: 46 × ৳1,200 = ৳55,200.</li>
        </ol>
        <p>
          Need to count the days between two dates, for example your joining date and today? Use the{" "}
          <Link href={en("date-difference-calculator")} className={link}>
            date difference calculator
          </Link>
          . Working extra hours as well? See the{" "}
          <Link href={en("overtime-calculator")} className={link}>
            overtime calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="what-the-law-says" title="What section 117 says">
        <p>
          The Bangladesh Labour Act 2006, section 117 (মজুরীসহ বাৎসরিক ছুটি, annual leave with wages), as read on the
          government’s Laws of Bangladesh site on 2 November 2026:
        </p>
        <ul>
          <li>
            <strong>117(1), who and how much (adults).</strong> Every adult worker who has completed one year of
            continuous service in an establishment gets leave with wages in the next twelve months for the previous
            twelve months’ work: <em>“প্রতি আঠার দিন কাজের জন্য একদিন”</em> (one day for every 18 days’ work) in a shop,
            commercial or industrial establishment, a factory or a road transport establishment;{" "}
            <em>“প্রতি বাইশ দিন কাজের জন্য একদিন”</em> (one for every 22) in a tea plantation;{" "}
            <em>“প্রতি এগার দিন কাজের জন্য একদিন”</em> (one for every 11) for a newspaper worker.
          </li>
          <li>
            <strong>117(4), carry-forward.</strong> Leave not taken, wholly or partly, in a twelve-month period is added
            to the leave due in the next twelve months.
          </li>
          <li>
            <strong>117(5), the limit (adults).</strong> The entitlement stops when the earned leave due reaches{" "}
            <em>“চল্লিশ দিন”</em> (40 days) in a factory or road transport establishment, or <em>“ষাট দিন”</em> (60
            days) in a tea plantation, shop, commercial or industrial establishment. The section names no limit for
            newspaper workers, so the calculator applies none to them.
          </li>
          <li>
            <strong>117(7), refused leave.</strong> If you apply for earned leave and your employer refuses it, those
            days are added to your account on top of the limit in (5).
          </li>
          <li>
            <strong>117(8), what counts as work.</strong> You count as having worked continuously even if the time
            includes a closed day, paid leave, sick or accident leave (paid or unpaid), up to 120 days of maternity
            leave, a lay-off, or a lawful strike or unlawful lock-out. Include those days in “days worked”.
          </li>
        </ul>
        <p>
          Section 117(2) and (6) give different rates and limits for adolescent (কিশোর) workers. This calculator covers
          adult workers only.
        </p>
        <p>
          To take leave, apply to your employer in writing with your address during the leave (section 10). The
          employer must give an order within seven days of the application or two days before the leave starts,
          whichever is earlier.
        </p>
      </ContentSection>

      <ContentSection id="encashment" title="Pay for unused leave when you leave (encashment)">
        <p>
          Section 11 says that if a worker’s job ends for any reason (retrenchment, discharge, removal, dismissal,
          retirement, resignation or otherwise) and annual leave is still due, the employer must pay, instead of the
          leave, the wages the worker would have received during that leave under the Act.
        </p>
        <p>
          Section 119(1) says what that daily wage is: the daily average of the full-time wage plus dearness allowance
          and ad hoc or interim wage, if any, paid for the days worked in the month immediately before the leave,{" "}
          <strong>not counting overtime allowance and bonus</strong>. So daily wage = that month’s wage ÷ the days worked
          in it. The calculator asks for both numbers and uses the last month you worked as that month. If a cash
          allowance replaces a food-grain facility, section 119(1) says to add it to the wage.
        </p>
        <p>
          Section 119(2) adds that if an adult takes at least four days of annual leave together, the leave pay should
          be paid before the leave starts, as far as possible.
        </p>
      </ContentSection>

      <ContentSection id="leave-types" title="Other kinds of leave in the Act">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Leave</th>
                <th scope="col" className={head}>Days</th>
                <th scope="col" className={head}>Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={cell}>Casual leave, s.115</td>
                <td className={cell}>10 days a calendar year, full wages</td>
                <td className={cell}>Does not accumulate; a year’s leave cannot be taken the next year. Does not apply to tea plantation workers.</td>
              </tr>
              <tr>
                <td className={cell}>Sick leave, s.116</td>
                <td className={cell}>14 days a calendar year, full wages</td>
                <td className={cell}>Needs a registered doctor’s certificate. Does not accumulate. Newspaper workers get half-wage sick leave for at least one-eighteenth of their service instead.</td>
              </tr>
              <tr>
                <td className={cell}>Earned (annual) leave, s.117</td>
                <td className={cell}>1 day per 18 / 22 / 11 days worked</td>
                <td className={cell}>After one year of service; carries forward up to 40 or 60 days (adults). This calculator.</td>
              </tr>
              <tr>
                <td className={cell}>Festival leave, s.118</td>
                <td className={cell}>13 days a calendar year, with wages</td>
                <td className={cell}>The 2026 amendment raised it from 11 to 13. The employer fixes the dates. Working on a festival day earns one substitute day and two days’ compensatory wages.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Casual, sick and festival leave do not carry forward and have no encashment rule in these sections, so the
          calculator only covers earned leave.
        </p>
      </ContentSection>

      <ContentSection id="assumptions" title="Assumptions in this calculator">
        <ul>
          <li>Only whole days are counted. The Act says one day for every 18 days’ work and does not mention part-days, so 17 days of work earn nothing yet.</li>
          <li>The limit is applied when the leave falls due, and leave taken is subtracted afterwards. Your employer’s records may count day by day.</li>
          <li>The daily wage is the wage paid for the days you actually worked in the last month, divided by those days. Your payslip decides what was paid for which days.</li>
          <li>No limit is applied to newspaper workers because section 117(5) names none.</li>
          <li>Service rules or contracts that give more than the Act are not modelled. Government employees follow their own rules.</li>
        </ul>
      </ContentSection>

      <ContentSection id="rules-checked" title="Rules checked on 2 November 2026">
        <p>
          We read sections 10, 11, 115, 116, 117, 118 and 119 on the government’s Laws of Bangladesh site on 2 November
          2026. The text there already includes the Bangladesh Labour (Amendment) Act 2026. This page is general
          information, not legal advice. Your appointment letter, service rules and your employer’s leave records decide
          your balance. If you think leave or leave pay is wrongly refused, talk to your employer, your union or the
          labour office.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Pick where you work. This sets the rate and the limit.</li>
          <li>Say whether you have completed one year of continuous service.</li>
          <li>Enter the days worked in the last 12 months, the earned leave carried forward and the leave already taken.</li>
          <li>Optionally add refused leave, and the last month’s wage and days worked to see the value of unused leave.</li>
          <li>Select Calculate leave to see the earned days, the balance and the encashment.</li>
        </ol>
        <p>
          Your figures stay in your browser. They are saved only in your recent calculations on this device, which you
          can turn off.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          {[S.section117, S.section11, S.section119, S.section115, S.section116, S.section118, S.section10].map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {source.title}
              </a>
            </li>
          ))}
        </ul>
        <p>All checked on 2 November 2026.</p>
      </ContentSection>
    </>
  );
}
