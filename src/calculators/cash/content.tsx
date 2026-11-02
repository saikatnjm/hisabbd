import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { CASH_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Explanatory content for the Cash Counter (Server Component, no JS). */
export function CashCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How the cash counter works">
        <p>
          For each note or coin, the calculator multiplies its value by how many you have (value × count = subtotal).
          The total is the sum of the subtotals, and it also counts your notes and coins separately. Blank counts are
          treated as 0.
        </p>
        <h3>Example</h3>
        <p>You have 3 notes of ৳1000, 4 of ৳500, 7 of ৳100 and 5 of ৳20.</p>
        <ol>
          <li>3 × ৳1000 = ৳3,000</li>
          <li>4 × ৳500 = ৳2,000</li>
          <li>7 × ৳100 = ৳700</li>
          <li>5 × ৳20 = ৳100</li>
          <li>Total: ৳3,000 + ৳2,000 + ৳700 + ৳100 = ৳5,800, made up of 19 notes.</li>
        </ol>
        <p>
          To write the total on a cheque or receipt, use the{" "}
          <Link href={localePath("en", calculatorPath("amount-in-words"))} className={link}>
            Taka Amount in Words calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="denominations" title="Notes and coins it covers">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Type</th>
                <th scope="col" className={head}>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>Notes</td><td className={cell}>৳1000, ৳500, ৳200, ৳100, ৳50, ৳20, ৳10, ৳5, ৳2</td></tr>
              <tr><td className={cell}>Coins</td><td className={cell}>৳5, ৳2, ৳1</td></tr>
            </tbody>
          </table>
        </div>
        <ul>
          <li>
            Bangladesh Bank issues notes from ৳5 to ৳1000, including the ৳200 note.
          </li>
          <li>
            Notes in the redesigned series issued from 2025 are legal tender alongside the old ones, so enter old and
            new notes of the same value in the same box.
          </li>
          <li>This calculator does not detect fake notes. It only adds up what you type.</li>
        </ul>
      </ContentSection>

      <ContentSection id="tips" title="Tips for counting cash">
        <ul>
          <li>
            Count notes in bundles of 100. For 5 bundles of ৳500 notes, type 500 in the ৳500 notes field: 500 × ৳500 =
            ৳2,50,000.
          </li>
          <li>Count each value on its own, highest first, so you do not lose your place.</li>
          <li>Count twice if the amount matters, and compare the two totals.</li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Type how many notes you have in each box, such as “৳1000 notes” or “৳500 notes”. Bangla digits work.</li>
          <li>Type how many coins you have in “৳5 coins”, “৳2 coins” and “৳1 coins”. Leave empty boxes blank.</li>
          <li>Select Count cash to see the total, the number of notes and coins, and a table by value.</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            Notes:{" "}
            <a href={S.notes.url} target="_blank" rel="noopener" className={link}>
              {S.notes.title}
            </a>{" "}
            and{" "}
            <a href={S.twoHundred.url} target="_blank" rel="noopener" className={link}>
              {S.twoHundred.title}
            </a>
            .
          </li>
          <li>
            Coins:{" "}
            <a href={S.coins.url} target="_blank" rel="noopener" className={link}>
              {S.coins.title}
            </a>
            .
          </li>
          <li>
            New-design notes:{" "}
            <a href={S.newDesign.url} target="_blank" rel="noopener" className={link}>
              {S.newDesign.title}
            </a>
            .
          </li>
        </ul>
        <p>Checked on 2 November 2026.</p>
      </ContentSection>
    </>
  );
}
