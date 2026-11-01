import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { DIAMETERS_MM, kgPerMetre, METRES_PER_FOOT } from "./logic";
import { ROD_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";
const three = (value: number) => formatNumber(value, { decimals: 3, minDecimals: 3 });

/** Explanatory content for the Rod Weight Calculator (Server Component, no JS). */
export function RodCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="The rod weight formula">
        <p>
          <strong>Weight per metre (kg) = d² ÷ 162</strong>, where d is the rod’s diameter in mm. Per foot it is{" "}
          <strong>d² ÷ 532</strong>.
        </p>
        <p>
          The formula comes from the rod’s cross-section (π/4 × d²) and the density of steel (7,850 kg/m³); the exact
          constant is 162.2. The calculator uses the full formula.
        </p>
        <h3>Example: 40 rods of 12 mm, 40 ft each</h3>
        <ol>
          <li>Weight per foot: 12² ÷ 532 = 144 ÷ 532 = about 0.271 kg.</li>
          <li>Total length: 40 × 40 = 1,600 ft (487.68 m).</li>
          <li>Total weight: about <strong>432.97 kg</strong>, or 0.433 tonne.</li>
          <li>At ৳1,00,000 a tonne (an example only): 0.433 × 1,00,000 = about ৳43,297.</li>
        </ol>
      </ContentSection>

      <ContentSection id="table" title="Rod weight by size">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={headNum}>Diameter (mm)</th>
                <th scope="col" className={headNum}>kg per metre</th>
                <th scope="col" className={headNum}>kg per foot</th>
              </tr>
            </thead>
            <tbody>
              {DIAMETERS_MM.map((d) => (
                <tr key={d}>
                  <td className={num}>{d}</td>
                  <td className={num}>{three(kgPerMetre(d))}</td>
                  <td className={num}>{three(kgPerMetre(d) * METRES_PER_FOOT)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>These are theoretical weights; real rods can weigh slightly more or less within the maker’s tolerance.</p>
      </ContentSection>

      <ContentSection id="buying" title="Before you buy">
        <ul>
          <li>Rod prices change and differ by brand and dealer, so none is built in. Enter the price you were quoted.</li>
          <li>Check the weighed weight on the bill and at delivery.</li>
          <li>How much rod you need depends on the design; take lengths and numbers from your engineer’s bar bending schedule.</li>
          <li>
            To write a Taka amount in words, use{" "}
            <Link href={localePath("en", calculatorPath("amount-in-words"))} className={link}>
              Taka Amount in Words
            </Link>
            ; for land, the{" "}
            <Link href={localePath("en", calculatorPath("land-calculator"))} className={link}>
              Land Area Calculator
            </Link>
            .
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose the rod size (diameter) and whether you give lengths in feet or metres.</li>
          <li>Enter the length of one rod and the number of rods. Bangla digits work.</li>
          <li>For the cost, enter the price per tonne; otherwise leave it blank.</li>
          <li>Select Calculate weight to see the total in kg and tonnes, the weight per metre and foot, and the cost.</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            <a href={S.bangla.url} target="_blank" rel="noopener" className={link} lang="bn">
              {S.bangla.title}
            </a>{" "}
            (Bangla).
          </li>
          <li>
            Nominal weights by size:{" "}
            <a href={S.table.url} target="_blank" rel="noopener" className={link}>
              {S.table.title}
            </a>
            .
          </li>
        </ul>
        <p>Checked on 1 November 2026.</p>
      </ContentSection>
    </>
  );
}
