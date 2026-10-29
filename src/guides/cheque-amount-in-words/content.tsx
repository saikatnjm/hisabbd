import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Amounts as figures, English words and Bangla words (all match the Taka Amount in Words logic). */
const AMOUNTS: readonly [figures: string, english: string, bangla: string][] = [
  ["1,000", "One Thousand Taka Only", "এক হাজার টাকা মাত্র"],
  ["50,000", "Fifty Thousand Taka Only", "পঞ্চাশ হাজার টাকা মাত্র"],
  ["1,00,000", "One Lakh Taka Only", "এক লক্ষ টাকা মাত্র"],
  ["10,00,000", "Ten Lakh Taka Only", "দশ লক্ষ টাকা মাত্র"],
  ["1,00,00,000", "One Crore Taka Only", "এক কোটি টাকা মাত্র"],
  ["10,05,00,200", "Ten Crore Five Lakh Two Hundred Taka Only", "দশ কোটি পাঁচ লক্ষ দুইশত টাকা মাত্র"],
];

/** English guide: writing a Taka amount in words on a cheque (Server Component, no JS). */
export function ChequeAmountInWordsGuideContent() {
  const calculator = localePath("en", calculatorPath("amount-in-words"));

  return (
    <>
      <ContentSection id="rule" title="The rule: crore, lakh, thousand, hundred, then “Taka … Only”">
        <p>
          To write a cheque amount in words, split the number into the groups used in Bangladesh, from the left:{" "}
          <strong>crore, lakh, thousand, hundred</strong>, then the last two digits. Write each group in words,
          then “Taka”, the paisa if there are any, and finally <strong>“Only”</strong> (<strong>“মাত্র”</strong> in
          Bangla). Any group that is zero is simply left out.
        </p>
        <p>
          So <strong>1 lakh Taka</strong> (1,00,000) is <strong>One Lakh Taka Only</strong>, or in Bangla{" "}
          <strong lang="bn">এক লক্ষ টাকা মাত্র</strong>. To get any amount in English and Bangla words at once, use
          the{" "}
          <Link href={calculator} className={link}>
            Taka Amount in Words
          </Link>{" "}
          calculator. It follows the rules below, and you can copy the result straight onto the cheque.
        </p>
      </ContentSection>

      <ContentSection id="example" title="Worked example: ৳1,25,300.50 in words">
        <p>Split the amount into its groups:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Group</th>
                <th scope="col" className={headNum}>Digits</th>
                <th scope="col" className={head}>In words</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>Lakh</td><td className={num}>1</td><td className={cell}>One Lakh</td></tr>
              <tr><td className={cell}>Thousand</td><td className={num}>25</td><td className={cell}>Twenty-Five Thousand</td></tr>
              <tr><td className={cell}>Hundred</td><td className={num}>3</td><td className={cell}>Three Hundred</td></tr>
              <tr><td className={cell}>Last two digits</td><td className={num}>00</td><td className={cell}>(left out)</td></tr>
              <tr><td className={cell}>Paisa</td><td className={num}>50</td><td className={cell}>Fifty Paisa</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          In English: <strong>One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only</strong>. The
          “and” goes between the Taka and the paisa, not inside the number: 101 is “One Hundred One”. Numbers
          from 21 to 99 take a hyphen, as in Twenty-Five.
        </p>
        <p>
          In Bangla: <strong lang="bn">এক লক্ষ পঁচিশ হাজার তিনশত টাকা পঞ্চাশ পয়সা মাত্র</strong>. In Bangla digits
          the figure is <span lang="bn">১,২৫,৩০০.৫০</span>. If you think in millions, the same amount is One
          Hundred Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only.
        </p>
      </ContentSection>

      <ContentSection id="lakh-crore" title="Lakh and crore amounts in words">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={headNum}>৳</th>
                <th scope="col" className={head}>English</th>
                <th scope="col" className={head}>Bangla</th>
              </tr>
            </thead>
            <tbody>
              {AMOUNTS.map(([figures, english, bangla]) => (
                <tr key={figures}>
                  <td className={num}>{figures}</td>
                  <td className={cell}>{english}</td>
                  <td className={cell} lang="bn">{bangla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          In the last row the thousands group is zero, so “Thousand” doesn’t appear at all. “Lakh” and “Lac” are
          both used in English; in Bangla, “লক্ষ” and “লাখ” mean the same, though cheques and deeds more often
          use “লক্ষ” and write hundreds as “একশত, দুইশত … নয়শত”.
        </p>
        <p>
          From a thousand crore upwards, the number of crores is itself written in lakh and thousand: ৳1,000
          crore is <strong>One Thousand Crore Taka Only</strong>.
        </p>
        <h3>Lakh and crore vs million and billion</h3>
        <p>
          Foreign invoices and English news give amounts in millions, so keep these in mind: 1 lakh = 1,00,000 =
          one hundred thousand; <strong>10 lakh = 1 million</strong>; <strong>1 crore = 10 million</strong>; 100
          crore = 1 billion. Convert a million figure into lakh and crore first, then write it in words.
        </p>
      </ContentSection>

      <ContentSection id="steps" title="Step by step: any amount in words">
        <ol>
          <li>Write the figure with lakh and crore commas, such as 10,05,00,200, so each group is easy to see.</li>
          <li>Read the groups from the left: crore, lakh, thousand, hundred, then the last two digits.</li>
          <li>Put each group’s name after it (Crore, Lakh, Thousand, Hundred). Skip any group that is zero.</li>
          <li>Add “Taka”. If there are digits after the point, write them in words and add “Paisa”, joined with “and”.</li>
          <li>Finish with “Only” (or “মাত্র”) and draw a line through the rest of the line.</li>
          <li>Read your words back into figures and check they match before you write the cheque.</li>
        </ol>
      </ContentSection>

      <ContentSection id="paisa" title="How to write paisa">
        <ul>
          <li>
            The two digits after the point are paisa. ৳10.50 is <strong>Ten Taka and Fifty Paisa Only</strong>{" "}
            (<span lang="bn">দশ টাকা পঞ্চাশ পয়সা মাত্র</span>). Written as 10.5, it is still 50 paisa, not 5.
          </li>
          <li>
            Under one Taka, write only the paisa: ৳0.05 is <strong>Five Paisa Only</strong> and ৳0.29 is{" "}
            <strong>Twenty-Nine Paisa Only</strong>.
          </li>
          <li>
            With no paisa, leave them out: ৳2,500.00 is <strong>Two Thousand Five Hundred Taka Only</strong>.
          </li>
          <li>One Taka is 100 paisa, so a cheque can’t show more than two decimals; round to the paisa first.</li>
        </ul>
      </ContentSection>

      <ContentSection id="on-the-cheque" title="Filling in the cheque: words line and figures box">
        <ol>
          <li>
            <strong>Words line:</strong> start right at the beginning of the line, with no extra gaps between
            words. If “Taka” is printed at the start, write the words after it.
          </li>
          <li>
            <strong>End with “Only” or “মাত্র”</strong>, then draw a line through any space left, so nobody can
            turn “One Thousand Taka” into “One Thousand Five Hundred Taka”.
          </li>
          <li>
            <strong>Figures box:</strong> write the amount right next to the printed ৳ or “Tk.”, with lakh and
            crore commas, for example 1,25,300.50. For whole Taka many people add “/-” (1,25,300/-).
          </li>
          <li>
            <strong>Check that words and figures match.</strong> A bank can return a cheque where they differ.
          </li>
        </ol>
        <p>
          On questions such as which language to use, whether Bangla digits are accepted, or how to correct a
          mistake, <strong>your bank’s own instructions decide</strong>. The points here are general practice;
          where your bank says otherwise, follow your bank.
        </p>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Mixing up million and lakh.</strong> 1,000,000 is 10,00,000, which is ten lakh, not one lakh.
            Using lakh and crore commas in the figures box avoids this.
          </li>
          <li>
            <strong>Spelling slips.</strong> It is “Forty”, not “Fourty”, and “Ninety”, not “Ninty”. In Bangla,
            watch 29 <span lang="bn">ঊনত্রিশ</span>, 45 <span lang="bn">পঁয়তাল্লিশ</span> and 99{" "}
            <span lang="bn">নিরানব্বই</span>.
          </li>
          <li>
            <strong>Leaving off “Only”, or leaving a gap.</strong> Both leave room for words to be added later.
          </li>
          <li>
            <strong>Misreading paisa.</strong> .5 means 50 paisa, and an amount like 1.234 can’t go on a cheque.
          </li>
          <li>
            <strong>Overwriting a mistake.</strong> Rather than scratching out or writing over, ask your bank or
            write a fresh cheque.
          </li>
          <li>
            <strong>Writing a total before checking the VAT.</strong> If a bill or invoice adds VAT, check the
            total with the{" "}
            <Link href={localePath("en", calculatorPath("vat-calculator"))} className={link}>
              VAT Calculator
            </Link>{" "}
            first, then write that total in words.
          </li>
        </ul>
        <p>
          Before you write the cheque, type the amount into{" "}
          <Link href={calculator} className={link}>
            Taka Amount in Words
          </Link>
          . You get the English and Bangla words, the million-system wording, and the figures in Western and
          Bangla digits, ready to copy. It is free, needs no signup, and the amount never leaves your device.
        </p>
      </ContentSection>
    </>
  );
}
