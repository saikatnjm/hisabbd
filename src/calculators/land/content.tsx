import { ContentSection } from "@/components/ui/content-section";

const TABLE_ROWS: readonly [unit: string, sqFt: string, decimal: string][] = [
  ["1 square foot (sq ft)", "1", "0.0023"],
  ["1 square yard (borgo goj)", "9", "0.0207"],
  ["1 square metre", "10.7639", "0.0247"],
  ["1 ojutangsho (অযুতাংশ)", "4.356", "0.01"],
  ["1 decimal (shotangsho / shotok)", "435.6", "1"],
  ["1 katha", "720", "1.6529"],
  ["1 bigha (20 katha)", "14,400", "33.0579"],
  ["1 acre (100 decimal)", "43,560", "100"],
  ["1 hectare (10,000 sq m)", "1,07,639.1", "247.1054"],
];

/** Explanatory content for the Land Area Calculator page (Server Component, no JS). */
export function LandCalculatorContent() {
  return (
    <>
      <ContentSection id="units" title="Land units in Bangladesh">
        <p>
          Land in Bangladesh is bought, sold and recorded in a mix of units: decimal (also called
          shotangsho or shotok), katha, bigha and acre, alongside square feet for flats and small
          plots. The calculator defines every unit in square feet using these standard values:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Unit</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Square feet</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Decimal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {TABLE_ROWS.map(([unit, sqFt, decimal]) => (
                <tr key={unit}>
                  <th scope="row" className="px-3 py-2 font-normal">{unit}</th>
                  <td className="px-3 py-2 text-right tabular-nums">{sqFt}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{decimal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Decimals in the table are rounded. Some handy figures:</p>
        <ul>
          <li>1 katha = 80 square yards ≈ 66.89 square metres ≈ 1.6529 decimal</li>
          <li>1 decimal ≈ 0.605 katha ≈ 40.47 square metres</li>
          <li>1 acre = 100 decimal = 60.5 katha = 3.025 bigha</li>
          <li>1 decimal = 100 ojutangsho</li>
        </ul>
      </ContentSection>

      <ContentSection id="bigha-33-decimal" title="Is a bigha 33 decimal?">
        <p>
          Almost, but not exactly. A standard bigha is 20 katha = 14,400 sq ft, and 14,400 ÷ 435.6 ={" "}
          <strong>33.0579 decimal</strong>. People often say “1 bigha = 33 decimal” because it is easy
          to remember, but 33 decimal is 14,374.8 sq ft, which is 25.2 sq ft short of a full bigha. On
          10 bigha that is 252 sq ft, about a third of a katha. The calculator always uses the exact
          figure.
        </p>
      </ContentSection>

      <ContentSection id="regional-katha" title="Katha and bigha vary by region">
        <p>
          The katha and bigha are traditional units, and their size has not always been the same from
          place to place. The calculator uses the standard Bangladesh values, <strong>1 katha = 720 sq
          ft</strong> and <strong>1 bigha = 20 katha = 14,400 sq ft</strong>, as its default.
        </p>
        <p>
          If your deed (dalil), khatian or local surveyor uses a different katha, type its size in
          square feet in the <strong>Size of 1 katha</strong> box (anything from 1 to 10,000 sq ft). A
          bigha is then 20 of those katha. Square feet, decimal, acre and the metric units don’t
          change, because they have fixed definitions.
        </p>
        <p>
          For example, with an illustrative katha of 1,000 sq ft, a 2,400 sq ft plot is 2.4 katha and
          0.12 bigha, while it stays 5.5096 decimal.
        </p>
      </ContentSection>

      <ContentSection id="how-to-measure" title="How to measure a plot">
        <ul>
          <li>
            <strong>Measure along the ground, in a straight line, corner to corner.</strong> On a slope,
            keep the tape level. Feet, haat (1 haat = 18 inches = 1.5 ft), goj (1 goj = 3 ft) and metres
            are all accepted; the calculator converts them to feet first.
          </li>
          <li>
            <strong>Rectangle:</strong> if the corners are square, area = length × width. To check, measure
            both diagonals: in a true rectangle they are equal.
          </li>
          <li>
            <strong>Four sides (approximate):</strong> for a plot that is roughly rectangular but whose
            opposite sides differ a little, the usual shortcut is (north + south) ÷ 2 × (east + west) ÷ 2.
            It is exact only when opposite sides are parallel and the corners are square, so treat it as
            an estimate. The further the plot is from a rectangle, the bigger the error.
          </li>
          <li>
            <strong>Triangle:</strong> with all three sides, the area comes from Heron’s formula. The
            longest side must be shorter than the other two added together, or the sides can’t meet.
          </li>
          <li>
            <strong>Irregular plots:</strong> measure one or more diagonals to split the plot into
            triangles, work out each triangle and add the areas. This is more accurate than the
            four-sides shortcut.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="examples" title="Worked examples">
        <h3>Converting units</h3>
        <p>
          5 katha = 5 × 720 = 3,600 sq ft = 3,600 ÷ 435.6 = <strong>8.2645 decimal</strong>, which is
          also 0.25 bigha.
        </p>
        <p>
          10 decimal = 10 × 435.6 = 4,356 sq ft = 4,356 ÷ 720 = <strong>6.05 katha</strong>.
        </p>

        <h3>Rectangle</h3>
        <p>
          A plot of 60 ft × 40 ft = 2,400 sq ft = <strong>5.5096 decimal</strong> = 3.3333 katha.
        </p>
        <p>
          Measured in haat, a plot of 40 × 30 haat is 60 × 45 ft = 2,700 sq ft = <strong>3.75
          katha</strong> = 6.1983 decimal.
        </p>

        <h3>Four sides</h3>
        <p>
          North 60 ft, south 64 ft, east 40 ft, west 44 ft: (60 + 64) ÷ 2 × (40 + 44) ÷ 2 = 62 × 42 ={" "}
          2,604 sq ft = about <strong>5.978 decimal</strong> = 3.6167 katha.
        </p>

        <h3>Triangle</h3>
        <p>
          Sides of 30, 40 and 50 ft give 600 sq ft = <strong>1.3774 decimal</strong> = 0.8333 katha.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>
            Choose <strong>Convert units</strong> to change an area from one unit to the others, or{" "}
            <strong>Area from measurements</strong> to work it out from the sides.
          </li>
          <li>
            To convert, enter the area and pick its unit. For measurements, pick the shape and the unit
            the sides were measured in, then enter each side.
          </li>
          <li>Leave the katha size at 720 sq ft unless your deed or surveyor uses a different katha.</li>
          <li>
            Select Calculate area. You’ll see the area in decimal, katha and square feet, and a table
            with every other unit.
          </li>
        </ol>
      </ContentSection>

      <ContentSection id="disclaimer" title="Use it for estimates">
        <p>
          This calculator is for estimates and for checking figures. Before buying, selling or
          registering land, <strong>confirm the area with a government surveyor and the deed (dalil)
          and khatian</strong>. Field measurements, local practice and the legal record can differ from
          a quick calculation.
        </p>
      </ContentSection>
    </>
  );
}
