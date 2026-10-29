import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { LT_A_RATES, SLAB_IDS, TARIFF_EFFECTIVE, VAT_PERCENT, type SlabId } from "@/calculators/electricity/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { APPLIANCE_EXAMPLES, DAYS_PER_MONTH, monthlyUnits } from "./examples";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

const APPLIANCE_NAMES: Record<(typeof APPLIANCE_EXAMPLES)[number]["id"], string> = {
  led: "LED bulb",
  fan: "Ceiling fan",
  tv: "TV",
  "rice-cooker": "Rice cooker",
  ac: "Air conditioner",
};

const SLAB_RANGES: Record<SlabId, string> = {
  step1: "1–75",
  step2: "76–200",
  step3: "201–300",
  step4: "301–400",
  step5: "401–600",
  step6: "Above 600",
};

/** ৳ for one more unit in a slab, VAT included. */
function perUnitWithVat(id: SlabId): string {
  return formatNumber(roundTo(LT_A_RATES[id].value * (1 + VAT_PERCENT.value / 100), 2), { decimals: 2, minDecimals: 2 });
}

/** English guide: appliance units from watts and hours, and what they add to a bill (Server Component, no JS). */
export function ElectricityUnitsAppliancesGuideContent() {
  const calculator = localePath("en", calculatorPath("electricity-bill-calculator"));

  return (
    <>
      <ContentSection id="unit" title="What one unit of electricity means">
        <p>
          One unit on your bill is one kilowatt-hour (kWh): the electricity a 1,000-watt appliance uses running for
          one hour. So one formula covers every appliance:
        </p>
        <p>
          <strong>Units = watts × hours of use ÷ 1,000</strong>
        </p>
        <p>
          For a month, multiply the daily units by the number of days; this guide uses {DAYS_PER_MONTH}. A 75 W fan
          running 10 hours a day uses 75 × 10 ÷ 1,000 = 0.75 units a day, or 0.75 × 30 = 22.5 units a month.
        </p>
      </ContentSection>

      <ContentSection id="watts" title="Where to find an appliance’s watts">
        <p>
          Use the “Rated power” or “Power input” in watts on the appliance’s label or in its manual. For an air
          conditioner, use the power input in watts, not the cooling capacity in BTU or tons.
        </p>
        <p>
          The label shows what the appliance draws at full power. AC and fridge compressors cycle on and off once the
          room or cabinet is cool, and an inverter AC draws less then, so this formula gives an upper limit; real use
          is usually lower. If a fridge label gives kWh per year, divide it by 12 for the monthly units.
        </p>
      </ContentSection>

      <ContentSection id="examples" title="Units a month: examples">
        <p>The watts below are examples only; check your own appliance’s label before you work it out.</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Appliance</th>
                <th scope="col" className={headNum}>Watts</th>
                <th scope="col" className={headNum}>Hours a day</th>
                <th scope="col" className={headNum}>Units a month</th>
              </tr>
            </thead>
            <tbody>
              {APPLIANCE_EXAMPLES.map((a) => (
                <tr key={a.id}>
                  <td className={cell}>{APPLIANCE_NAMES[a.id]}</td>
                  <td className={num}>{formatNumber(a.watts)}</td>
                  <td className={num}>{formatNumber(a.hoursPerDay)}</td>
                  <td className={num}>{formatNumber(monthlyUnits(a.watts, a.hoursPerDay))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          One air conditioner can use several times as many units as everything else together. An hour less of AC
          saves far more than switching off bulbs or fans.
        </p>
      </ContentSection>

      <ContentSection id="bill" title="What it adds to the bill: extra units land in higher slabs">
        <p>
          Home electricity is priced in slabs. A new appliance’s units are added on top of what you already use, so
          they are charged at the higher slabs’ rates, not at your average rate. From the {TARIFF_EFFECTIVE} billing
          month, BERC’s price for each extra unit, with {VAT_PERCENT.value}% VAT:
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Units in the month</th>
                <th scope="col" className={headNum}>Per unit (৳)</th>
                <th scope="col" className={headNum}>With VAT (৳)</th>
              </tr>
            </thead>
            <tbody>
              {SLAB_IDS.map((id) => (
                <tr key={id}>
                  <td className={cell}>{SLAB_RANGES[id]}</td>
                  <td className={num}>{formatNumber(LT_A_RATES[id].value, { decimals: 2, minDecimals: 2 })}</td>
                  <td className={num}>{perUnitWithVat(id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>Example: an AC in a 150-unit home</h3>
        <p>
          A home uses 150 units a month without an AC (2 kW sanctioned load, single-phase, postpaid meter, ৳40 meter
          rent, 5% VAT). Its bill is ৳1,213.80. Add a 1,500 W AC running 8 hours a day, which is 360 more units, 510 in
          all, and the bill becomes <strong>৳5,359.31</strong>.
        </p>
        <p>
          So the AC adds ৳4,145.51, about ৳11.52 for each of its units. Its units are numbers 151 to 510 in the month,
          and many of them fall in the 401–600 slab at ৳15.01 a unit. The same AC in a home that uses less would cost
          less per unit.
        </p>
        <h3>Example: a fan in a lifeline home</h3>
        <p>
          A home that uses 40 units a month pays the lifeline rate (৳4.63) on all of them: a bill of ৳324.66. Add a fan
          using 22.5 units and the month comes to 62.5 units. That is over 50, so the whole month moves to the normal
          slabs and the bill becomes ৳475.39: ৳150.73 more for the fan’s 22.5 units. Near the lifeline limit a single
          unit matters: 50 units cost ৳373.28 and 51 units cost ৳411.87.
        </p>
      </ContentSection>

      <ContentSection id="save" title="Where cutting back saves the most">
        <ul>
          <li>
            <strong>Above 400 units a month</strong>, each unit costs about ৳{perUnitWithVat("step5")} with VAT, and ৳
            {perUnitWithVat("step6")} above 600. Every unit cut there saves almost three times as much as a unit in the
            first slab (৳{perUnitWithVat("step1")}).
          </li>
          <li>
            <strong>Cut the hours of big appliances.</strong> Running a 1,500 W AC one hour less a day saves 1.5 units
            a day, 45 units a month.
          </li>
          <li>
            <strong>Near the lifeline limit, try to stay at 50 units or less</strong>: at 51 units every unit is billed
            at the higher rate.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="steps" title="Work out your own bill in a minute">
        <ol>
          <li>Take the watts from the appliance’s label and decide how many hours a day it runs.</li>
          <li>Monthly units = watts × hours ÷ 1,000 × 30.</li>
          <li>
            In the{" "}
            <Link href={calculator} className={link}>
              Electricity Bill Calculator
            </Link>
            , enter your usual month’s units, then add the appliance’s units and calculate again. The difference
            between the two bills is what the appliance really costs.
          </li>
        </ol>
        <p>
          The calculator comes pre-filled with BERC’s rates, the demand charge, meter rent and VAT, each with its date
          and source, and you can change any figure that differs on your company’s bill. The numbers you enter never
          leave your device.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources and dates">
        <p>
          Electricity rates are from BERC’s order of 3 June 2026 and its 4 June 2026 revision, checked on 29 October
          2026. The 5% VAT and ৳40 meter rent are as reported; the full list of sources is on the{" "}
          <Link href={`${calculator}#sources-heading`} className={link}>
            calculator page
          </Link>
          . The appliance watts are examples, not any brand’s or model’s rating.
        </p>
      </ContentSection>
    </>
  );
}
