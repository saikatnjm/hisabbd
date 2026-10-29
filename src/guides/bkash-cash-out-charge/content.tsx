import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { BKASH_NEWS_SOURCE, MFS_CHARGE_PRESETS as P } from "@/calculators/mfs-charge/logic";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const num = "border-b border-slate-200 py-2 pr-3 text-right tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";
const headNum = "border-b-2 border-slate-300 py-2 pr-3 text-right font-semibold text-slate-900";

/** Official cash-out rates checked on 28 October 2026 (same figures as the calculator's presets). */
const RATES: readonly [channel: string, perThousand: string, percent: string, onTenThousand: string][] = [
  ["bKash, Priyo Agent", "13.95", "1.395%", "139.50"],
  ["bKash, any other agent", "18.50", "1.85%", "185.00"],
  ["Nagad, USSD *167# and Islamic app", "15.00", "1.5%", "150.00"],
  ["Rocket, agent", "16.70", "1.67%", "167.00"],
  ["Rocket, DBBL ATM or branch", "9.00", "0.9%", "90.00"],
  ["Upay, agent", "14.00", "1.4%", "140.00"],
  ["Upay, UCB ATM", "8.00", "0.8%", "80.00"],
];

/** bKash charge on common amounts: Priyo Agent (৳13.95) vs any other agent (৳18.50). */
const AMOUNTS: readonly [amount: string, priyo: string, other: string][] = [
  ["1,000", "13.95", "18.50"],
  ["2,000", "27.90", "37.00"],
  ["5,000", "69.75", "92.50"],
  ["10,000", "139.50", "185.00"],
  ["20,000", "279.00", "370.00"],
];

/** English guide: bKash, Nagad, Rocket and Upay cash-out charges (Server Component, no JS). */
export function BkashCashOutChargeGuideContent() {
  const calculator = localePath("en", calculatorPath("mfs-cash-out-charge-calculator"));

  return (
    <>
      <ContentSection id="rates" title="Cash out charges at a glance">
        <p>
          Mobile financial services price cash out as <strong>so many Taka per ৳1,000</strong>, and charge
          any amount in proportion. The rates below were checked on each provider’s own website on 28
          October 2026. The bKash, Nagad and Rocket rates include VAT; Upay’s page does not say whether VAT
          is extra.
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Provider and channel</th>
                <th scope="col" className={headNum}>Per ৳1,000 (৳)</th>
                <th scope="col" className={headNum}>Percent</th>
                <th scope="col" className={headNum}>On ৳10,000 (৳)</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map(([channel, perThousand, percent, onTenThousand]) => (
                <tr key={channel}>
                  <th scope="row" className={`${cell} font-normal`}>{channel}</th>
                  <td className={num}>{perThousand}</td>
                  <td className={num}>{percent}</td>
                  <td className={num}>{onTenThousand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          So the short answer: <strong>the bKash charge on ৳1,000 is ৳13.95 at a Priyo Agent and ৳18.50 at
          any other agent</strong>. The Rocket and Upay rates are for general (primary) accounts; salary,
          stipend and remittance money can have different rates. Nagad’s English and Bangla pages showed
          different rates for the regular Nagad app, and we could not confirm bKash’s current ATM rate, so
          neither is listed here; check the app.
        </p>
      </ContentSection>

      <ContentSection id="formula" title="How the charge is worked out">
        <p>
          <strong>Charge = amount × rate per ৳1,000 ÷ 1,000</strong>
        </p>
        <p>
          <strong>Deducted from your balance = amount + charge</strong>
        </p>
        <p>
          The charge is not taken out of the cash you receive; it comes off your balance on top. To get
          ৳5,000 in hand you need more than ৳5,000 in the account. Divide the rate per ৳1,000 by 10 to get
          a percentage: ৳18.50 is 1.85%. The other way round, Rocket and Upay quote a percentage; multiply
          it by 10 to get the charge per ৳1,000, so 1.67% is ৳16.70. For any other percentage sum, the{" "}
          <Link href={localePath("en", calculatorPath("percentage-calculator"))} className={link}>
            Percentage Calculator
          </Link>{" "}
          helps.
        </p>
        <h3>Examples</h3>
        <ul>
          <li>৳1,000 from a bKash Priyo Agent: charge ৳13.95, so ৳1,013.95 leaves your balance.</li>
          <li>৳5,000 from any other bKash agent: 5,000 × 18.50 ÷ 1,000 = ৳92.50, so ৳5,092.50 leaves it.</li>
          <li>৳2,500 from a Rocket agent at 1.67%: charge ৳41.75, total ৳2,541.75.</li>
          <li>৳3,000 from Nagad by USSD at ৳15: charge ৳45, total ৳3,045.</li>
        </ul>
        <p>The bKash charge on some common amounts:</p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Cash out (৳)</th>
                <th scope="col" className={headNum}>Priyo Agent (৳)</th>
                <th scope="col" className={headNum}>Other agent (৳)</th>
              </tr>
            </thead>
            <tbody>
              {AMOUNTS.map(([amount, priyo, other]) => (
                <tr key={amount}>
                  <th scope="row" className={`${cell} font-normal`}>{amount}</th>
                  <td className={num}>{priyo}</td>
                  <td className={num}>{other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          To see the charge on any amount with any provider, use the{" "}
          <Link href={calculator} className={link}>
            bKash and Nagad Cash Out Charge Calculator
          </Link>
          . The rates come pre-filled there with their source and date.
        </p>
      </ContentSection>

      <ContentSection id="from-balance" title="How much can I take out of my balance?">
        <p>The opposite question comes up often: after the charge, how much cash will my balance give me?</p>
        <p>
          <strong>Cash ≈ balance ÷ (1 + rate ÷ 1,000)</strong>
        </p>
        <ul>
          <li>
            ৳10,000 balance at any other bKash agent (৳18.50): 10,000 ÷ 1.0185 ≈ <strong>৳9,818.36</strong>.
            Its charge is ৳181.64, using exactly ৳10,000. Agents pay in notes, so in whole Taka take out
            ৳9,818 (charge ৳181.63, leaving ৳0.37).
          </li>
          <li>
            ৳5,000 balance at a Priyo Agent (৳13.95): 5,000 ÷ 1.01395 ≈ <strong>৳4,931.21</strong>, charge
            ৳68.79.
          </li>
        </ul>
        <p>
          Providers do not publish how they round charges, so the app may differ by a few paisa.
        </p>
      </ContentSection>

      <ContentSection id="priyo-agent" title="bKash Priyo Agent: what it is and how to set it">
        <p>
          You can set any <strong>2 agent numbers</strong> as Priyo Agents in the bKash app (Cash Out →
          Priyo Agent) or by dialling *247# (My bKash → Priyo Number). Cash out from them, up to a total of{" "}
          <strong>৳50,000 per calendar month</strong>, costs ৳13.95 per ৳1,000 instead of ৳18.50.
        </p>
        <p>
          Note the catch: if a transaction takes you over the month’s ৳50,000, <strong>that whole
          transaction</strong> is charged at ৳18.50, not just the part above the limit.
        </p>
        <h3>How much it saves in a year</h3>
        <p>
          Say you take out ৳20,000 every month. At another agent that costs ৳370 a month, at a Priyo Agent
          ৳279, so ৳91 less each month. Over 12 months that is <strong>৳1,092</strong>, just for setting two
          numbers once.
        </p>
        <h3>Example: close to the limit</h3>
        <p>Say you have already taken ৳45,000 from Priyo Agents this month and need another ৳10,000.</p>
        <ol>
          <li>
            All ৳10,000 at once from a Priyo Agent: the transaction crosses the limit, so the charge is
            10,000 × 18.50 ÷ 1,000 = ৳185.
          </li>
          <li>
            First exactly ৳5,000 from the Priyo Agent (reaching the limit, not crossing it): ৳69.75. Then
            the other ৳5,000: ৳92.50. Total ৳162.25, which is ৳22.75 less.
          </li>
        </ol>
        <p>If you are not sure how much you have taken this month, check the transaction history in the app.</p>
      </ContentSection>

      <ContentSection id="pay-less" title="Official ways to pay less">
        <ul>
          <li>
            <strong>bKash:</strong> make the 2 agents you use most your Priyo Agents. Up to ৳50,000 a month,
            you save ৳4.55 on every ৳1,000.
          </li>
          <li>
            <strong>Rocket:</strong> a DBBL ATM or branch costs 0.9% against 1.67% at an agent, a
            difference of ৳77 on ৳10,000.
          </li>
          <li>
            <strong>Upay:</strong> a UCB ATM costs 0.8% against 1.4% at an agent, ৳60 less on ৳10,000.
          </li>
          <li>
            <strong>Nagad:</strong> USSD *167# and the Nagad Islamic app cost ৳15 including VAT. Check the
            regular app’s rate in the app before choosing. Nagad says the charges on its website prevail.
          </li>
          <li>
            <strong>Send money is different:</strong> it is not charged like cash out; check the current fee
            in the app.
          </li>
        </ul>
        <p>
          Campaign discounts are temporary and are sometimes announced only in the app. Before a large cash
          out, check the charge the app shows, and if it shows a different rate, enter that rate in the{" "}
          <Link href={calculator} className={link}>
            cash out charge calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources and dates">
        <p>
          Every rate was checked on 28 October 2026. Providers change charges from time to time; the
          provider’s own app and website always prevail.
        </p>
        <ul>
          <li>
            bKash:{" "}
            <a href={P["bkash-priyo"].source.url} target="_blank" rel="noopener" className={link}>
              {P["bkash-priyo"].source.title}
            </a>
            ; Priyo Agent rate and limit confirmed by{" "}
            <a href={BKASH_NEWS_SOURCE.url} target="_blank" rel="noopener" className={link}>
              {BKASH_NEWS_SOURCE.title}
            </a>
            .
          </li>
          <li>
            Nagad:{" "}
            <a href={P["nagad-ussd"].source.url} target="_blank" rel="noopener" className={link}>
              {P["nagad-ussd"].source.title}
            </a>
            .
          </li>
          <li>
            Rocket:{" "}
            <a href={P["rocket-agent"].source.url} target="_blank" rel="noopener" className={link}>
              {P["rocket-agent"].source.title}
            </a>
            .
          </li>
          <li>
            Upay:{" "}
            <a href={P["upay-agent"].source.url} target="_blank" rel="noopener" className={link}>
              {P["upay-agent"].source.title}
            </a>
            .
          </li>
        </ul>
      </ContentSection>
    </>
  );
}
