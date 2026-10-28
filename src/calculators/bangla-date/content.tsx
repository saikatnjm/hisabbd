import { ContentSection } from "@/components/ui/content-section";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Month, Bangla name, days, first day in the Gregorian calendar, season. Pinned by logic.test.ts. */
const MONTH_ROWS = [
  ["Boishakh", "বৈশাখ", "31", "14 April", "Grishma (summer)"],
  ["Joishtho", "জ্যৈষ্ঠ", "31", "15 May", "Grishma (summer)"],
  ["Asharh", "আষাঢ়", "31", "15 June", "Borsha (monsoon)"],
  ["Srabon", "শ্রাবণ", "31", "16 July", "Borsha (monsoon)"],
  ["Bhadro", "ভাদ্র", "31", "16 August", "Shorot (autumn)"],
  ["Ashwin", "আশ্বিন", "31", "16 September", "Shorot (autumn)"],
  ["Kartik", "কার্তিক", "30", "17 October", "Hemonto (late autumn)"],
  ["Agrahayan", "অগ্রহায়ণ", "30", "16 November", "Hemonto (late autumn)"],
  ["Poush", "পৌষ", "30", "16 December", "Sheet (winter)"],
  ["Magh", "মাঘ", "30", "15 January", "Sheet (winter)"],
  ["Falgun", "ফাল্গুন", "29 (30 in a leap year)", "14 February", "Boshonto (spring)"],
  ["Chaitra", "চৈত্র", "30", "15 March", "Boshonto (spring)"],
] as const;

/** Explanatory content for the Bangla Date Converter page (Server Component, no JS). */
export function BanglaDateCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How the Bangla calendar works">
        <p>
          Bangladesh uses a revised Bangla calendar (Bangabda, বঙ্গাব্দ), last revised by Bangla
          Academy in 2019 so that it stays in step with the English (Gregorian) calendar. The rules
          are simple and the same every year:
        </p>
        <ul>
          <li>
            The year starts on <strong>14 April</strong>, which is 1 Boishakh (Pohela Boishakh).
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
        </ul>
        <p>
          Because the month lengths are fixed, every month starts on the same English date each year:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Month</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Days</th>
                <th scope="col" className="px-3 py-2 font-semibold">Starts on</th>
                <th scope="col" className="px-3 py-2 font-semibold">Season</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {MONTH_ROWS.map(([name, nameBn, days, starts, season]) => (
                <tr key={name}>
                  <th scope="row" className="px-3 py-2 font-normal">
                    {name} (<span lang="bn">{nameBn}</span>)
                  </th>
                  <td className="px-3 py-2 text-right tabular-nums">{days}</td>
                  <td className="px-3 py-2">{starts}</td>
                  <td className="px-3 py-2">{season}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Leap years</h3>
        <p>
          Falgun runs from 14 February to the middle of March, so it is the month that contains 29
          February. In a year with 29 February, Falgun gets a 30th day and Chaitra still starts on 15
          March. For example, Falgun 1434 runs from 14 February to 14 March 2028 and has 30 days;
          29 February 2028 is <strong>16 Falgun 1434</strong>. The leap years are the English leap
          years, so the two calendars never drift apart.
        </p>

        <h3>The Bangla year (Bangabda)</h3>
        <p>
          <strong>Bangla year = English year − 593</strong> on or after 14 April, and{" "}
          <strong>English year − 594</strong> before it. So 14 April 2026 starts 1433 (2026 − 593),
          and 1 January 2027 is still 1433 (2027 − 594). The next year, 1434, starts on 14 April 2027.
        </p>

        <h3>Seasons</h3>
        <p>
          The Bangla year has six seasons (ঋতু) of two months each, starting from Boishakh: Grishma
          (summer), Borsha (monsoon), Shorot (autumn), Hemonto (late autumn), Sheet (winter) and
          Boshonto (spring).
        </p>
      </ContentSection>

      <ContentSection id="national-days" title="National days on the Bangla calendar">
        <p>
          One aim of the 2019 revision was to fix the national days to the Bangla dates on which the
          events happened in 1952 and 1971. They now fall on the same Bangla date every year:
        </p>
        <ul>
          <li>
            21 February (Shaheed Dibosh, International Mother Language Day) ={" "}
            <strong>8 Falgun</strong>
          </li>
          <li>
            26 March (Independence Day) = <strong>12 Chaitra</strong>
          </li>
          <li>
            16 December (Victory Day) = <strong>1 Poush</strong>
          </li>
          <li>
            14 April (Pohela Boishakh, Bangla New Year) = <strong>1 Boishakh</strong>
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="example" title="A worked example">
        <p>What is the Bangla date on 28 October 2026?</p>
        <ol>
          <li>It is after 14 April, so the year is 2026 − 593 = 1433.</li>
          <li>Kartik starts on 17 October, so 28 October is day 28 − 17 + 1 = 12 of Kartik.</li>
          <li>Kartik and Agrahayan are Hemonto, the late-autumn season.</li>
        </ol>
        <p>
          So 28 October 2026, a Wednesday, is <strong lang="bn">১২ কার্তিক ১৪৩৩ বঙ্গাব্দ</strong>{" "}
          (12 Kartik 1433).
        </p>
        <p>
          Bangla dates are usually written with Bangla digits, so that is the main form shown. The
          converter also shows the same date with English digits for forms and messages.
        </p>
      </ContentSection>

      <ContentSection id="west-bengal" title="Bangladesh and West Bengal calendars differ">
        <p>
          West Bengal and other Indian states use the traditional Bangla calendar, whose month lengths
          are set each year by astronomical calculations, so Pohela Boishakh there does not always fall
          on 14 April. Bangladesh uses the fixed rules above. The same day can therefore have a
          different Bangla date in the two calendars, for example a day apart. This converter follows
          the Bangladesh calendar only.
        </p>
        <p>
          Dates long before 2019 are converted with today’s rules too, so they can be a day different
          from what was printed in a calendar at the time. The converter works from 1 Boishakh 1 (14
          April 594) to 30 Chaitra 8000 (13 April 8594).
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use it">
        <ol>
          <li>Today’s Bangla date is shown at the top as soon as the page loads.</li>
          <li>
            To convert another date, keep <strong>English → Bangla</strong> selected and pick the
            English (Gregorian) date.
          </li>
          <li>
            To go the other way, choose <strong>Bangla → English</strong> and enter the Bangla year,
            month and day.
          </li>
          <li>
            Select <strong>Convert date</strong>. The result updates as you change the date.
          </li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <p>
          Month lengths and the leap-year Falgun of the 2019 revision:{" "}
          <a
            href="https://www.dhakatribune.com/bangladesh/191106/ashshin-in-31-days-in-revised-bangla-calendar"
            target="_blank"
            rel="noopener"
            className={link}
          >
            Dhaka Tribune
          </a>{" "}
          (October 2019, quoting Bangla Academy). The fixed national-day dates (8 Falgun, 12 Chaitra,
          1 Poush):{" "}
          <a
            href="https://www.thedailystar.net/frontpage/news/two-days-24-hours-1867597"
            target="_blank"
            rel="noopener"
            className={link}
          >
            The Daily Star
          </a>{" "}
          (February 2020).
        </p>
      </ContentSection>
    </>
  );
}
