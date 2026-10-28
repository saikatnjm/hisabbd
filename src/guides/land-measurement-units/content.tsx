import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

const ROWS: readonly [unit: string, sqFt: string, decimal: string, katha: string][] = [
  ["1 square foot", "1", "0.0023", "0.0014"],
  ["1 square yard (borgo goj)", "9", "0.0207", "0.0125"],
  ["1 ojutangsho (অযুতাংশ)", "4.356", "0.01", "0.0061"],
  ["1 decimal (shotangsho / shotok)", "435.6", "1", "0.605"],
  ["1 katha", "720", "1.6529", "1"],
  ["1 bigha (20 katha)", "14,400", "33.0579", "20"],
  ["1 acre (100 decimal)", "43,560", "100", "60.5"],
];

/** English guide: Bangladesh land units and how to measure a plot (Server Component, no JS). */
export function LandMeasurementUnitsGuideContent() {
  const calculator = localePath("en", calculatorPath("land-calculator"));

  return (
    <>
      <ContentSection id="units" title="The land units at a glance">
        <p>
          Several land units are used side by side in Bangladesh. Deeds and khatians often give area in
          decimal (shotangsho or shotok) and acres, village sales often use katha and bigha, and city
          plots and flats use square feet. The key to all of them is the square foot: once you know
          how many square feet each unit is, you can get from any unit to any other.
        </p>
        <ul>
          <li>
            <strong>1 decimal = 435.6 sq ft</strong>, which is one hundredth of an acre.
          </li>
          <li>
            <strong>1 ojutangsho = one hundredth of a decimal</strong> = 4.356 sq ft. It is sometimes
            used in records for very small fractions.
          </li>
          <li>
            <strong>1 katha = 720 sq ft</strong> (the standard value; it can vary by region).
          </li>
          <li>
            <strong>1 bigha = 20 katha = 14,400 sq ft</strong> ≈ 33 decimal (33.0579 exactly).
          </li>
          <li>
            <strong>1 acre = 100 decimal = 43,560 sq ft.</strong>
          </li>
        </ul>
        <p>
          To enter an amount in one unit and see it in all the others, use the{" "}
          <Link href={calculator} className={link}>
            Land Area Calculator
          </Link>
          . Below is how the same sums work by hand.
        </p>
      </ContentSection>

      <ContentSection id="conversion-table" title="Conversion table: square feet, decimal and katha">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[20rem] text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className={head}>Unit</th>
                <th scope="col" className={headNum}>Sq ft</th>
                <th scope="col" className={headNum}>Decimal</th>
                <th scope="col" className={headNum}>Katha</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([unit, sqFt, decimal, katha]) => (
                <tr key={unit}>
                  <th scope="row" className={`${cell} font-normal`}>{unit}</th>
                  <td className={num}>{sqFt}</td>
                  <td className={num}>{decimal}</td>
                  <td className={num}>{katha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The katha column uses the 720 sq ft katha, and decimals are rounded. The rule is always the
          same: <strong>convert to square feet, then divide by the square feet in the unit you want.</strong>
        </p>
        <h3>Is 1 bigha exactly 33 decimal?</h3>
        <p>
          No, only nearly. 14,400 ÷ 435.6 = 33.0579 decimal. “1 bigha = 33 decimal” is easy to say, but 33
          decimal is 14,374.8 sq ft, which is 25.2 sq ft short of a full bigha. Over 10 bigha the gap
          grows to 252 sq ft. For larger plots, work in square feet rather than the round figure.
        </p>
      </ContentSection>

      <ContentSection id="measure" title="How to work out area from measurements">
        <p>
          Measure along the ground, in a straight line, corner to corner. Whether you measure in feet,
          metres, haat or goj, convert everything to feet first: <strong>1 haat = 18 inches = 1.5 ft</strong>{" "}
          and <strong>1 goj = 3 ft</strong>.
        </p>
        <ul>
          <li>
            <strong>Rectangular plot:</strong> area = length × width. To check that the corners really
            are square, measure both diagonals; in a rectangle they are equal.
          </li>
          <li>
            <strong>Four unequal sides:</strong> for a plot that is roughly four-cornered but whose
            opposite sides differ a little, the usual shortcut is (north + south) ÷ 2 × (east + west) ÷
            2. It is <strong>approximate</strong>; the further the plot is from a rectangle, the bigger
            the error.
          </li>
          <li>
            <strong>Triangle:</strong> with sides a, b and c, first find s = (a + b + c) ÷ 2, then area =
            √(s × (s − a) × (s − b) × (s − c)). This is Heron’s formula.
          </li>
          <li>
            <strong>Irregular plot:</strong> measure diagonals to split it into triangles, work out each
            triangle and add them up. This is more reliable than averaging four sides.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="example" title="Worked examples">
        <h3>Converting units</h3>
        <p>
          5 katha = 5 × 720 = 3,600 sq ft. In decimal: 3,600 ÷ 435.6 = <strong>8.2645 decimal</strong>. In
          bigha: 3,600 ÷ 14,400 = 0.25 bigha.
        </p>
        <p>
          The other way round, 10 decimal = 10 × 435.6 = 4,356 sq ft = 4,356 ÷ 720 ={" "}
          <strong>6.05 katha</strong>.
        </p>
        <h3>A rectangular plot, in feet and in haat</h3>
        <ol>
          <li>60 ft × 40 ft = 2,400 sq ft.</li>
          <li>
            2,400 ÷ 435.6 = <strong>5.5096 decimal</strong>; 2,400 ÷ 720 = 3.3333 katha.
          </li>
        </ol>
        <p>
          A plot measured as 40 × 30 haat is 60 × 45 ft = 2,700 sq ft = <strong>3.75 katha</strong> =
          6.1983 decimal.
        </p>
        <h3>Four unequal sides</h3>
        <p>
          North 60, south 64, east 40 and west 44 ft. The north–south average is (60 + 64) ÷ 2 = 62 and
          the east–west average is (40 + 44) ÷ 2 = 42. The area is 62 × 42 = 2,604 sq ft, about{" "}
          <strong>5.978 decimal</strong> or 3.6167 katha.
        </p>
        <h3>Triangle</h3>
        <p>
          Sides of 30, 40 and 50 ft. s = 120 ÷ 2 = 60, so area = √(60 × 30 × 20 × 10) = √3,60,000 = 600
          sq ft = <strong>1.3774 decimal</strong> = 0.8333 katha.
        </p>
      </ContentSection>

      <ContentSection id="steps" title="Step by step: measure your own plot">
        <ol>
          <li>Look at the plot’s shape: rectangle, four unequal sides, triangle, or something more complex.</li>
          <li>Measure every side and write them all down in the same unit.</li>
          <li>If you measured in haat or goj, convert to feet (haat × 1.5, goj × 3).</li>
          <li>Work out the area in square feet using the rules above.</li>
          <li>Divide by 435.6 for decimal, 720 for katha, 14,400 for bigha or 43,560 for acres.</li>
          <li>Compare the result with the area in your deed or khatian.</li>
        </ol>
      </ContentSection>

      <ContentSection id="mistakes" title="Common mistakes">
        <ul>
          <li>
            <strong>Treating a bigha as exactly 33 decimal.</strong> On a small plot the gap is tiny; on a
            large one it adds up to hundreds of square feet.
          </li>
          <li>
            <strong>Assuming the katha is the same everywhere.</strong> Katha and bigha are traditional
            units, and their size has not always been the same in every area. If your deed or local
            surveyor uses a different size, go by that. Decimal and acre are fixed and do not change.
          </li>
          <li>
            <strong>Multiplying haat or goj as if they were feet.</strong> Taking 40 × 30 haat as 40 × 30
            ft makes the plot look less than half its real size.
          </li>
          <li>
            <strong>Multiplying just two sides of an uneven plot.</strong> Measure all four sides, and
            split very uneven plots into triangles.
          </li>
          <li>
            <strong>Letting the tape sag on a slope.</strong> Keep it tight and level.
          </li>
        </ul>
        <p>
          These sums are for estimates and checking figures. Before buying, selling or registering
          land, <strong>have it measured by a government surveyor and confirm the area against the deed
          (dalil) and khatian</strong>. For quick sums, enter an amount or the sides in the{" "}
          <Link href={calculator} className={link}>
            Land Area Calculator
          </Link>{" "}
          to see the result in decimal, katha, bigha, acres and every other unit, with the katha size
          adjustable if you need it.
        </p>
      </ContentSection>
    </>
  );
}
