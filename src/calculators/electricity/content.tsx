import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { guidePath } from "@/guides/paths";
import { localePath } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import {
  AMAR_DESH_METER_RENT,
  BERC_CONDITIONS,
  BERC_LIFELINE_REVISION,
  BERC_NOTIFICATIONS_PAGE,
  BERC_RETAIL_ORDER,
  DAILY_STAR_SLAB_EXAMPLE,
  DAILY_STAR_SLABS_KEPT,
  DEMAND_CHARGE,
  DPDC_TARIFF_PAGE,
  LT_A_RATES,
  RATE_IDS,
  TBS_DPDC_METER_CHARGES,
  type RateId,
  type TariffSource,
} from "./logic";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const cell = "px-3 py-2";

const SLAB_NAMES: Record<RateId, [string, string]> = {
  lifeline: ["Lifeline", "Whole month 0–50 units"],
  step1: ["Step 1", "0–75 units"],
  step2: ["Step 2", "76–200 units"],
  step3: ["Step 3", "201–300 units"],
  step4: ["Step 4", "301–400 units"],
  step5: ["Step 5", "401–600 units"],
  step6: ["Step 6", "Above 600 units"],
};

function SourceLink({ source }: { source: TariffSource }) {
  return (
    <a href={source.url} target="_blank" rel="noopener" className={link}>
      {source.title}
    </a>
  );
}

/** Explanatory content for the Electricity Bill Calculator page (Server Component, no JS). */
export function ElectricityCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How your electricity bill is calculated">
        <p>A home electricity bill in Bangladesh has four parts:</p>
        <p>
          <strong>
            Bill = energy charge (slab by slab) + demand charge + meter rent + VAT − prepaid rebate
          </strong>
        </p>
        <ul>
          <li>
            <strong>Energy charge:</strong> the units (kWh) you used, priced in slabs. Each rate applies only
            to the units inside its slab: the first 75 units at one rate, the next 125 at the next, and so on.
          </li>
          <li>
            <strong>Demand charge:</strong> sanctioned load (kW) × ৳42 a month, whatever you use.
          </li>
          <li>
            <strong>Meter rent:</strong> a fixed monthly rent for a meter the company supplied.
          </li>
          <li>
            <strong>VAT</strong> on all of the above, and a <strong>0.5% rebate</strong> if your meter is
            prepaid.
          </li>
        </ul>

        <h3>Worked example: 200 units, 2 kW, single-phase, postpaid</h3>
        <ol>
          <li>Step 1: 75 units × ৳5.26 = ৳394.50</li>
          <li>Step 2: the remaining 125 units × ৳8.50 = ৳1,062.50</li>
          <li>Energy charge: ৳394.50 + ৳1,062.50 = ৳1,457</li>
          <li>Demand charge: 2 kW × ৳42 = ৳84; meter rent ৳40; bill before VAT ৳1,581</li>
          <li>VAT at 5%: ৳1,581 × 5 ÷ 100 = ৳79.05</li>
          <li>
            <strong>Total: ৳1,660.05</strong>, about ৳8.30 a unit with everything included
          </li>
        </ol>
        <p>
          On a prepaid meter the same month gets a 0.5% rebate on the ৳1,581 before VAT (৳7.91), so the
          total is <strong>৳1,652.14</strong>. At 350 units the energy charge is ৳394.50 + ৳1,062.50 + 100
          × ৳9.10 + 50 × ৳9.62 = ৳2,848; at 700 units it is ৳8,066.
        </p>
        <p>
          Using 200 units does not put all 200 at ৳8.50: The Daily Star’s worked example of a 200-unit bill
          prices the first 75 units at the lower rate and only the remaining 125 at the higher one, and BERC
          rejected a proposal to abolish that slab benefit in June 2026.
        </p>
      </ContentSection>

      <ContentSection id="rates" title="Electricity price per unit 2026 (BERC residential tariff)">
        <p>
          These are the low-tension residential (LT-A) rates the Bangladesh Energy Regulatory Commission
          (BERC) set from the <strong>June 2026 billing month</strong> for every distribution company: BPDB,
          Palli Bidyut (BREB), DPDC, DESCO, WZPDCL and NESCO. Rates are per unit, before VAT.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <caption className="sr-only">BERC residential (LT-A) electricity rates per unit from June 2026</caption>
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className={`${cell} font-semibold`}>Slab</th>
                <th scope="col" className={`${cell} font-semibold`}>Units in the month</th>
                <th scope="col" className={`${cell} text-right font-semibold`}>৳ per unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {RATE_IDS.map((id) => (
                <tr key={id}>
                  <th scope="row" className={`${cell} font-normal`}>{SLAB_NAMES[id][0]}</th>
                  <td className={cell}>{SLAB_NAMES[id][1]}</td>
                  <td className={`${cell} text-right tabular-nums`}>
                    {formatNumber(LT_A_RATES[id].value, { decimals: 2, minDecimals: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The demand charge is <strong>৳{formatNumber(DEMAND_CHARGE.value)} per kW of sanctioned load a
          month</strong>, unchanged in 2026. BERC raised retail tariffs on 3 June 2026, then on 4 June kept
          the lifeline rate at ৳4.63 (instead of ৳5.32) and the first step at ৳5.26 (instead of ৳6.18).
          All the figures in this table are from those two official orders.
        </p>
      </ContentSection>

      <ContentSection id="lifeline" title="The lifeline rule (50 units or less)">
        <p>
          If your <strong>whole month’s use is 50 units or less</strong>, every unit is charged at the lifeline
          rate of ৳4.63: 45 units cost 45 × ৳4.63 = ৳208.35 and 50 units ৳231.50, before the other charges.
        </p>
        <p>
          BERC’s order says no other residential customer gets the lifeline rate. So at 51 units the whole
          month moves to the slabs and costs 51 × ৳5.26 = ৳268.26. If you are close to 50 units, a few units
          saved can cut the energy charge by more than ৳30.
        </p>
      </ContentSection>

      <ContentSection id="charges" title="Demand charge, meter rent and VAT">
        <ul>
          <li>
            <strong>Demand charge (official):</strong> ৳42 per kW of your sanctioned load each month, charged
            on the sanctioned load, not on what you use. It is on your bill or prepaid meter card. Using more
            than the sanctioned load is charged at double the demand rate (not modelled here).
          </li>
          <li>
            <strong>Meter rent (as reported):</strong> BERC’s 2026 conditions keep “the existing rules” on
            meter rent without stating an amount, and no rent is due on a meter you bought. DPDC said on 31
            August 2026 that its rent is ৳40 a month for a single-phase meter and ৳250 for three-phase. Other
            companies may differ, so the calculator pre-fills these and lets you change them.
          </li>
          <li>
            <strong>VAT (as reported):</strong> BERC says VAT applies at the government’s rate. DPDC and news
            reports give 5%, charged on the energy charge, demand charge and meter rent. For VAT on anything
            else, use the{" "}
            <Link href={localePath("en", calculatorPath("vat-calculator"))} className={link}>
              VAT calculator
            </Link>{" "}
            or read{" "}
            <Link href={localePath("en", guidePath("vat-calculation"))} className={link}>
              how VAT is calculated
            </Link>
            .
          </li>
          <li>
            <strong>Late payment (official, not modelled):</strong> a one-time 5% surcharge on an overdue
            bill.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="prepaid-postpaid" title="Prepaid vs postpaid meters">
        <p>
          The rates are the same. Two things differ on a <strong>prepaid</strong> meter:
        </p>
        <ul>
          <li>
            A <strong>rebate of 0.5%</strong> of the bill before VAT (BERC). In the worked example that is ৳7.91.
          </li>
          <li>
            The month’s <strong>demand charge and meter rent come off your first recharge</strong> of the month
            (and any months you skipped are deducted at the next recharge), so a small first recharge buys
            fewer units than you might expect.
          </li>
        </ul>
        <p>
          <strong>How many units for ৳1,000?</strong> With a 2 kW single-phase prepaid meter, a month in which
          you recharge ৳1,000 in all covers about <strong>126.58 units</strong>: ৳84 demand charge + ৳40 meter
          rent + the slab charges for 126.58 units, plus 5% VAT and minus the 0.5% rebate, comes to ৳1,000.
          Choose Recharge amount in the calculator for any amount. A recharge of less than ৳129.58 doesn’t
          cover that month’s fixed charges at all. Meters can split VAT slightly differently, so treat it as an
          estimate.
        </p>
      </ContentSection>

      <ContentSection id="read-meter" title="Tips for reading your meter">
        <ul>
          <li>
            <strong>Postpaid:</strong> note the kWh reading on the same day each month. This month’s reading
            minus last month’s is the units used; choose Meter readings in the calculator and enter both.
          </li>
          <li>
            Read only the kWh register (digits before any decimal point or red digits), not the voltage,
            current or kW display some digital meters cycle through.
          </li>
          <li>
            <strong>Prepaid:</strong> the meter shows the remaining balance and, through its display codes, this
            month’s units. The codes differ by meter brand; your company’s instruction manual lists them.
          </li>
          <li>
            Your sanctioned load and meter phase are printed on the bill or prepaid card. If your use keeps
            going over the sanctioned load, apply to your company to change it.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="bill-may-differ" title="Why your company’s bill may differ">
        <p>
          This calculator applies BERC’s published rates exactly. Your distribution company’s bill may still
          differ because of a late-payment surcharge, arrears, adjustments for an earlier estimated reading,
          rounding to whole Taka, a different meter rent, billing days that span a rate change, or prepaid
          meters splitting VAT and fixed charges across recharges. If your bill shows different figures, open
          Edit tariff and type them in.
        </p>
        <p>
          To see how much of your income goes on electricity, work out your take-home pay with the{" "}
          <Link href={localePath("en", calculatorPath("salary-calculator"))} className={link}>
            salary calculator
          </Link>{" "}
          and the share with the{" "}
          <Link href={localePath("en", calculatorPath("percentage-calculator"))} className={link}>
            percentage calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose Units used, Meter readings or Recharge amount (prepaid).</li>
          <li>Enter the units used this month, both readings, or the recharge amount. Bangla digits work.</li>
          <li>Enter your sanctioned load in kW (from the bill or prepaid card).</li>
          <li>Choose single-phase or three-phase, and postpaid or prepaid.</li>
          <li>Optional: open Edit tariff to change any rate, the demand charge, meter rent, VAT or rebate.</li>
          <li>Select Calculate bill to see the total, each slab line and every charge.</li>
        </ol>
        <p>
          The calculator remembers your meter type and sanctioned load in this browser, and nothing you type
          leaves your device.
        </p>
        <p>
          Wondering what a new AC or fridge will add? Work out its units from its watts and hours with{" "}
          <Link href={localePath("en", guidePath("electricity-units-appliances"))} className={link}>
            how many units an AC, fan or fridge uses
          </Link>
          , then add them to your usual units here.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources and dates">
        <p>All figures were checked on 29 October 2026.</p>
        <ul>
          <li>
            Official: <SourceLink source={BERC_RETAIL_ORDER} /> (slab rates from step 2 up, demand charge).
          </li>
          <li>
            Official: <SourceLink source={BERC_LIFELINE_REVISION} /> (lifeline ৳4.63 and step 1 ৳5.26).
          </li>
          <li>
            Official: <SourceLink source={BERC_CONDITIONS} /> (0.5% prepaid rebate, VAT at the government’s
            rate, meter-rent rules, 5% late-payment surcharge).
          </li>
          <li>
            Official listings: <SourceLink source={BERC_NOTIFICATIONS_PAGE} /> and{" "}
            <SourceLink source={DPDC_TARIFF_PAGE} />.
          </li>
          <li>
            As reported (meter rent ৳40/৳250, VAT 5%): <SourceLink source={TBS_DPDC_METER_CHARGES} /> and{" "}
            <SourceLink source={AMAR_DESH_METER_RENT} />.
          </li>
          <li>
            Slab method: <SourceLink source={DAILY_STAR_SLAB_EXAMPLE} /> and{" "}
            <SourceLink source={DAILY_STAR_SLABS_KEPT} />.
          </li>
        </ul>
      </ContentSection>
    </>
  );
}
