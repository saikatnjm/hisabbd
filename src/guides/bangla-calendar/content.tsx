import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[28rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Bangabda 1433: month, Bangla name, days, first and last day (Gregorian), season. Starts and the year end are pinned by the converter's logic.test.ts. */
const YEAR_1433 = [
  ["Boishakh", "বৈশাখ", "31", "14 Apr 2026", "14 May 2026", "Grishma (summer)"],
  ["Joishtho", "জ্যৈষ্ঠ", "31", "15 May 2026", "14 Jun 2026", "Grishma (summer)"],
  ["Asharh", "আষাঢ়", "31", "15 Jun 2026", "15 Jul 2026", "Borsha (monsoon)"],
  ["Srabon", "শ্রাবণ", "31", "16 Jul 2026", "15 Aug 2026", "Borsha (monsoon)"],
  ["Bhadro", "ভাদ্র", "31", "16 Aug 2026", "15 Sep 2026", "Shorot (autumn)"],
  ["Ashwin", "আশ্বিন", "31", "16 Sep 2026", "16 Oct 2026", "Shorot (autumn)"],
  ["Kartik", "কার্তিক", "30", "17 Oct 2026", "15 Nov 2026", "Hemonto (late autumn)"],
  ["Agrahayan", "অগ্রহায়ণ", "30", "16 Nov 2026", "15 Dec 2026", "Hemonto (late autumn)"],
  ["Poush", "পৌষ", "30", "16 Dec 2026", "14 Jan 2027", "Sheet (winter)"],
  ["Magh", "মাঘ", "30", "15 Jan 2027", "13 Feb 2027", "Sheet (winter)"],
  ["Falgun", "ফাল্গুন", "29", "14 Feb 2027", "14 Mar 2027", "Boshonto (spring)"],
  ["Chaitra", "চৈত্র", "30", "15 Mar 2027", "13 Apr 2027", "Boshonto (spring)"],
] as const;

/** English guide: how Bangladesh's revised Bangla calendar works (Server Component, no JS). */
export function BanglaCalendarGuideContent() {
  const converter = localePath("en", calculatorPath("bangla-date-converter"));

  return (
    <>
      <ContentSection id="rules" title="How Bangabda works: four rules">
        <p>
          The Bangla calendar used officially in Bangladesh (Bangabda, বঙ্গাব্দ) was last revised by Bangla
          Academy in 2019. Its rules are the same every year and easy to remember:
        </p>
        <ol>
          <li>
            The year starts on <strong>14 April</strong>, which is 1 Boishakh, or Pohela Boishakh. 13 April is the
            last day of Chaitra.
          </li>
          <li>
            The first six months, Boishakh to Ashwin, have <strong>31 days</strong> each.
          </li>
          <li>
            Kartik, Agrahayan, Poush, Magh and Chaitra have <strong>30 days</strong>.
          </li>
          <li>
            Falgun has <strong>29 days</strong>, or 30 in a leap year.
          </li>
        </ol>
        <p>
          To find the Bangla year, subtract <strong>593</strong> from the English year on or after 14 April, or{" "}
          <strong>594</strong> before it. So 14 April 2026 starts 1433, and 1 January 2027 is still 1433
          (2027 − 594). To skip the counting, use the{" "}
          <Link href={converter} className={link}>
            Bangla Date Converter
          </Link>
          ; it follows exactly these rules.
        </p>
      </ContentSection>

      <ContentSection id="year-1433" title="Bangla calendar 1433: when each month runs">
        <p>
          Because the month lengths are fixed, each Bangla month starts on the same English date every year.
          Bangabda 1433 runs from 14 April 2026 to 13 April 2027:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Month</th>
                <th scope="col" className={headNum}>Days</th>
                <th scope="col" className={head}>Starts</th>
                <th scope="col" className={head}>Ends</th>
                <th scope="col" className={head}>Season</th>
              </tr>
            </thead>
            <tbody>
              {YEAR_1433.map(([month, monthBn, days, starts, ends, season]) => (
                <tr key={month}>
                  <th scope="row" className={`${cell} font-normal`}>
                    {month} (<span lang="bn">{monthBn}</span>)
                  </th>
                  <td className={num}>{days}</td>
                  <td className={cell}>{starts}</td>
                  <td className={cell}>{ends}</td>
                  <td className={cell}>{season}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The start dates stay the same in later years; only the last day of Falgun moves by a day in a leap
          year (see below).
        </p>
      </ContentSection>

      <ContentSection id="example" title="Worked example: what is the Bangla date today?">
        <p>Let’s find the Bangla date for 28 October 2026.</p>
        <ol>
          <li>It is after 14 April, so the year is 2026 − 593 = 1433.</li>
          <li>The table shows Kartik starts on 17 October, so 28 October is day 28 − 17 + 1 = 12 of Kartik.</li>
          <li>Kartik is a month of Hemonto, late autumn.</li>
        </ol>
        <p>
          Answer: 28 October 2026, a Wednesday, is <strong lang="bn">১২ কার্তিক ১৪৩৩ বঙ্গাব্দ</strong> (12 Kartik
          1433). The next day, 29 October, is 13 Kartik. Bangla dates are conventionally written with Bangla
          digits, as shown.
        </p>
        <p>
          Watch the year boundary: 13 April 2026 was 30 Chaitra 1432, the last day of the year, and the next
          day, 14 April, was 1 Boishakh 1433. So for any date from 1 January to 13 April, subtract 594, not 593;
          that is where most hand calculations go wrong.
        </p>
        <p>
          The other direction works the same way: which day is 31 Ashwin 1433? Ashwin starts on 16 September, so
          its 31st day is 16 October 2026. To see the Bangla date as soon as you open a page, go to the{" "}
          <Link href={converter} className={link}>
            Bangla Date Converter
          </Link>
          ; it shows today’s Bangla date, season and weekday from your device’s date.
        </p>
      </ContentSection>

      <ContentSection id="revision-2019" title="What the 2019 revision changed">
        <p>
          Under the old rules the first five months had 31 days and the other seven had 30. In 2015 a committee
          led by former Bangla Academy director general Shamsuzzaman Khan recommended a revision, and the new
          rules took effect in 2019: Ashwin also got 31 days, and Falgun got 29 (30 in a leap year). Ashwin had
          31 days for the first time in 2019.
        </p>
        <p>
          There were two aims: to keep in step with the English calendar, and to fix the national days to the
          Bangla dates they fell on in 1952 and 1971. Before, 21 February fell on 8 Falgun in some years and
          9 Falgun in others. For the same reason Pohela Falgun is now always 14 February, ending the habit of
          marking it on 13 February.
        </p>
        <p>
          West Bengal and other Indian states follow the traditional calendar, whose month lengths change from
          year to year with astronomical calculations, so the same day can have a different Bangla date in the
          two countries. A calendar printed before 2019 can also be a day different from today’s rules.
        </p>
      </ContentSection>

      <ContentSection id="leap-year" title="Why Falgun has 30 days in a leap year">
        <p>
          Falgun runs from 14 February to the middle of March, so 29 February always falls in it. In a year with
          29 February, Falgun gets an extra day. That way Chaitra still starts on 15 March and Pohela Boishakh
          stays on 14 April.
        </p>
        <ul>
          <li>Falgun 1433 (February–March 2027) has 29 days; there is no 30 Falgun 1433.</li>
          <li>
            Falgun 1434 runs from 14 February to 14 March 2028, 30 days. 29 February 2028 is{" "}
            <strong>16 Falgun 1434</strong>, and 15 March 2028 is 1 Chaitra.
          </li>
        </ul>
        <p>
          Press reports describe the rule as “every four years”. Our converter uses the full Gregorian rule (so
          2100 is not a leap year), because only that keeps the two calendars together for good.
        </p>
      </ContentSection>

      <ContentSection id="seasons-days" title="The six seasons and the national days’ Bangla dates">
        <p>
          Six seasons of two months each, starting from Boishakh: <strong>Grishma</strong> (summer: Boishakh,
          Joishtho), <strong>Borsha</strong> (monsoon: Asharh, Srabon), <strong>Shorot</strong> (autumn: Bhadro,
          Ashwin), <strong>Hemonto</strong> (late autumn: Kartik, Agrahayan), <strong>Sheet</strong> (winter:
          Poush, Magh) and <strong>Boshonto</strong> (spring: Falgun, Chaitra).
        </p>
        <p>Since the revision, the national days fall on the same Bangla date every year:</p>
        <ul>
          <li>21 February (Shaheed Dibosh, International Mother Language Day) = <strong>8 Falgun</strong></li>
          <li>26 March (Independence Day) = <strong>12 Chaitra</strong></li>
          <li>16 December (Victory Day) = <strong>1 Poush</strong></li>
          <li>14 April (Pohela Boishakh, Bangla New Year) = <strong>1 Boishakh</strong></li>
          <li>14 February = Pohela Falgun, the first day of spring</li>
        </ul>
        <p>
          By the same rules, Rabindra Jayanti (25 Boishakh) is always 8 May and Nazrul Jayanti (11 Joishtho) is
          25 May. Coming up: 16 December 2026 is 1 Poush 1433, 21 February 2027 is 8 Falgun 1433, and 14 April
          2027 is 1 Boishakh 1434. To count the days left until Pohela Boishakh or any other date, use the{" "}
          <Link href={localePath("en", calculatorPath("date-difference-calculator"))} className={link}>
            Date Difference Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <p>
          Month lengths, the leap-year Falgun and 21 February = 8 Falgun under the 2019 revision:{" "}
          <a
            href="https://www.dhakatribune.com/bangladesh/191106/ashshin-in-31-days-in-revised-bangla-calendar"
            target="_blank"
            rel="noopener"
            className={link}
          >
            Dhaka Tribune
          </a>{" "}
          (22 October 2019, quoting Bangla Academy secretary Mohammad Anwar Hossain). The fixed national-day
          dates (8 Falgun, 12 Chaitra, 1 Poush) and Pohela Falgun on 14 February:{" "}
          <a
            href="https://www.thedailystar.net/frontpage/news/two-days-24-hours-1867597"
            target="_blank"
            rel="noopener"
            className={link}
          >
            The Daily Star
          </a>{" "}
          (13 February 2020). Both checked again on 29 October 2026.
        </p>
      </ContentSection>
    </>
  );
}
