import { ContentSection } from "@/components/ui/content-section";
import { VAT_RATE_PRESETS } from "./logic";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the VAT Calculator page (Server Component, no JS). */
export function VatCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How VAT is calculated">
        <h3>Adding VAT to a price</h3>
        <p>
          <strong>VAT = price excluding VAT × rate ÷ 100</strong>
        </p>
        <p>
          <strong>Price including VAT = price excluding VAT + VAT</strong>
        </p>
        <p>
          At 15%: ৳1,000 × 15 ÷ 100 = ৳150 of VAT, so the price including VAT is <strong>৳1,150</strong>.
          In one step, multiply by 1.15.
        </p>

        <h3>Removing VAT from a VAT-inclusive price</h3>
        <p>
          <strong>VAT = price including VAT × rate ÷ (100 + rate)</strong>
        </p>
        <p>
          <strong>Price excluding VAT = price including VAT − VAT</strong>
        </p>
        <p>
          At 15%: ৳1,150 × 15 ÷ 115 = ৳150 of VAT, so the price before VAT is <strong>৳1,000</strong>.
          In one step, divide by 1.15.
        </p>

        <h3>An example with paisa</h3>
        <p>
          Adding 15% to ৳2,499.50: 2,499.50 × 0.15 = 374.925, which rounds to ৳374.93 of VAT, so the
          price including VAT is <strong>৳2,874.43</strong>.
        </p>
        <p>
          Removing 15% from ৳1,000: 1,000 × 15 ÷ 115 = 130.434…, which rounds to ৳130.43 of VAT, so the
          price before VAT is <strong>৳869.57</strong>.
        </p>
      </ContentSection>

      <ContentSection id="common-mistake" title="Common mistake: taking 15% of the total">
        <p>
          To remove VAT, many people take 15% of the price including VAT. That gives the wrong answer,
          because the 15% was charged on the price <em>before</em> VAT, which is smaller.
        </p>
        <p>
          15% of ৳1,150 is ৳172.50, but the VAT inside ৳1,150 is only <strong>৳150</strong>. Subtracting
          ৳172.50 would leave ৳977.50, not the real ৳1,000. Divide by 115 (100 + rate), not by 100.
        </p>
      </ContentSection>

      <ContentSection id="rates" title="VAT rates in Bangladesh">
        <p>
          The standard VAT (মূসক) rate is <strong>{VAT_RATE_PRESETS.standard.value}%</strong> under the
          Value Added Tax and Supplementary Duty Act, 2012. It applies to most goods and services.
        </p>
        <p>
          Some goods and services have reduced rates, such as 10%, 7.5% or 5% (lower rates also exist).
          Which rate applies depends on the item, so check NBR or your VAT invoice (challan). Choose
          “Custom rate” to enter any rate from 0 to 100.
        </p>
        <p>
          This calculator only adds or removes VAT at one rate. It does not include supplementary duty
          (SD), advance tax, VAT deducted at source, fixed per-unit VAT, or VAT worked out on a tariff
          or truncated value instead of the price. Some products carry SD or use a different base.
          Businesses should follow NBR rules and their accountant.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose Add VAT (you have a price before VAT) or Remove VAT (the price already includes VAT).</li>
          <li>Enter the price excluding VAT or the price including VAT, in Taka.</li>
          <li>Choose the VAT rate: Standard 15%, a reduced rate, or Custom rate.</li>
          <li>Select Calculate VAT to see the VAT, both prices and the formula with your numbers.</li>
        </ol>
        <p>
          Amounts are rounded to the nearest paisa (half away from zero). The VAT is rounded first and
          the other figure is worked out from it, so the price excluding VAT plus the VAT always equals
          the price including VAT. Whole-Taka amounts are shown without paisa.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <p>
          Standard rate of 15%:{" "}
          <a href={VAT_RATE_PRESETS.standard.source.url} target="_blank" rel="noopener" className={link}>
            NBR VAT FAQ
          </a>
          . Reduced rates of 1.5%, 2%, 2.4%, 4.5%, 5%, 7.5% and 10% for specific goods and services:{" "}
          <a href={VAT_RATE_PRESETS.reduced10.source.url} target="_blank" rel="noopener" className={link}>
            PwC Worldwide Tax Summaries, Bangladesh
          </a>{" "}
          (last reviewed 31 July 2026). Both checked on 28 October 2026. Rates can change with each
          budget; NBR’s current rules always decide.
        </p>
      </ContentSection>
    </>
  );
}
