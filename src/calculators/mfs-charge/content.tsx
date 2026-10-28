import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { BKASH_NEWS_SOURCE, MFS_CHARGE_PRESETS } from "./logic";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const P = MFS_CHARGE_PRESETS;

/** Explanatory content for the MFS Cash Out Charge Calculator page (Server Component, no JS). */
export function MfsChargeCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How the cash out charge is calculated">
        <p>
          bKash, Nagad, Rocket and Upay set the cash-out charge as an amount per ৳1,000, and apply it
          proportionally to any amount:
        </p>
        <p>
          <strong>Charge = amount × rate per ৳1,000 ÷ 1,000</strong>
        </p>
        <p>
          <strong>Deducted from your balance = amount + charge</strong>
        </p>
        <p>
          The charge comes out of your balance on top of the cash, so you need the amount plus the charge
          in your account. A rate per ৳1,000 is the same as a percentage divided by 10: ৳18.50 per ৳1,000
          is 1.85% (use the{" "}
          <Link href={localePath("en", calculatorPath("percentage-calculator"))} className={link}>
            percentage calculator
          </Link>{" "}
          for any other percentage of an amount).
        </p>

        <h3>Worked examples</h3>
        <ul>
          <li>
            <strong>৳1,000 from a bKash Priyo Agent</strong> at ৳13.95: charge ৳13.95, so ৳1,013.95 leaves
            your balance.
          </li>
          <li>
            <strong>৳5,000 from any other bKash agent</strong> at ৳18.50: 5,000 × 18.50 ÷ 1,000 = ৳92.50,
            so ৳5,092.50 leaves your balance.
          </li>
          <li>
            <strong>৳2,500 from a Rocket agent</strong> at ৳16.70 (1.67%): charge ৳41.75, total ৳2,541.75.
          </li>
          <li>
            <strong>৳3,000 from Nagad by USSD</strong> at ৳15: charge ৳45, total ৳3,045.
          </li>
        </ul>

        <h3>How much cash can I take out from my balance?</h3>
        <p>
          <strong>Cash ≈ balance ÷ (1 + rate ÷ 1,000)</strong>
        </p>
        <p>
          With ৳10,000 and a ৳18.50 rate: 10,000 ÷ 1.0185 ≈ <strong>৳9,818.36</strong>. The charge on that
          is ৳181.64, which uses up exactly ৳10,000. Agents pay in notes, so the calculator also shows the
          largest whole-Taka amount: ৳9,818 (charge ৳181.63, ৳0.37 left in the balance).
        </p>
        <p>
          With ৳5,000 at a Priyo Agent (৳13.95): you can take out ৳4,931.21, and the charge is ৳68.79.
        </p>
      </ContentSection>

      <ContentSection id="rates" title="Cash out charges by provider">
        <p>Rates per ৳1,000 as checked on 28 October 2026 on each provider’s own website:</p>
        <ul>
          <li>
            <strong>bKash:</strong> ৳{P["bkash-priyo"].ratePerThousand} from your 2 Priyo Agents (up to
            ৳50,000 a calendar month); ৳{P["bkash-agent"].ratePerThousand.toFixed(2)} from any other agent,
            in the app or by *247#. VAT included.
          </li>
          <li>
            <strong>Nagad:</strong> ৳{P["nagad-ussd"].ratePerThousand.toFixed(2)} (৳13.05 plus VAT) by USSD
            *167# and in the Nagad Islamic app. Nagad’s English and Bangla pages showed different rates for
            the regular Nagad app, so the calculator asks you to enter that rate from the app.
          </li>
          <li>
            <strong>Rocket:</strong> 1.67% (৳{P["rocket-agent"].ratePerThousand.toFixed(2)}) at an agent and
            0.9% (৳{P["rocket-atm"].ratePerThousand}) at a DBBL ATM or branch, for general accounts,
            including VAT and tax. Salary and stipend accounts have lower charges.
          </li>
          <li>
            <strong>Upay:</strong> 1.40% (৳{P["upay-agent"].ratePerThousand}) at an agent and 0.8% (৳
            {P["upay-atm"].ratePerThousand}) at a UCB ATM, for primary accounts. Upay’s page does not say
            whether VAT is extra.
          </li>
        </ul>
        <p>
          We couldn’t confirm a current official ATM rate for bKash, so that channel also asks for your
          rate. Remittance, salary and other special accounts often have their own rates.
        </p>
      </ContentSection>

      <ContentSection id="pay-less" title="How to pay a lower charge">
        <ul>
          <li>
            <strong>bKash Priyo Agent:</strong> set any 2 agent numbers as Priyo Agents in the app (Cash Out →
            Priyo Agent) or by dialling *247# (My bKash → Priyo Number). Cash out from them costs ৳13.95
            instead of ৳18.50 per ৳1,000, up to ৳50,000 a month. If one cash out takes the month over
            ৳50,000, that whole transaction is charged ৳18.50 per ৳1,000.
          </li>
          <li>
            <strong>ATMs:</strong> Rocket at a DBBL ATM (0.9%) and Upay at a UCB ATM (0.8%) are cheaper than
            their agents.
          </li>
          <li>
            <strong>Nagad:</strong> the USSD and Islamic-app rates are listed above; compare the regular app
            rate shown in your app before you choose.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="send-money" title="Send money is charged differently">
        <p>
          Send money is not priced per ৳1,000 the way cash out is. Rocket’s schedule shows send money free
          to the same Rocket product and 0.90% to another product (paid by the receiver); Upay lists send
          money as no charge; bKash charges a small flat fee per transaction, with free sends to Priyo
          numbers up to a monthly limit. Check the current fee in your app.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose Cash I want (you know the amount) or My balance (you want the most you can take out).</li>
          <li>Enter the cash out amount or your balance, in Taka. Bangla digits and 1,00,000 work.</li>
          <li>Choose the provider and how you cash out. The charge per ৳1,000 fills in with its date and source.</li>
          <li>If your app shows a different rate, type it into Charge per ৳1,000.</li>
          <li>Select Calculate charge to see the charge, the total deducted and the effective percentage.</li>
        </ol>
        <p>
          Amounts are rounded to the nearest paisa. Providers don’t publish how they round, so the charge
          in the app may differ by a few paisa. To write the total in words on a form, use{" "}
          <Link href={localePath("en", calculatorPath("amount-in-words"))} className={link}>
            Amount in Words
          </Link>
          ; for VAT on a purchase, see the{" "}
          <Link href={localePath("en", calculatorPath("vat-calculator"))} className={link}>
            VAT calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources and dates">
        <p>
          Providers change charges from time to time, sometimes with only an in-app notice. Every rate here
          was checked on 28 October 2026. The provider’s own app and website always decide.
        </p>
        <ul>
          <li>
            bKash:{" "}
            <a href={P["bkash-priyo"].source.url} target="_blank" rel="noopener" className={link}>
              {P["bkash-priyo"].source.title}
            </a>
            , confirmed by{" "}
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
