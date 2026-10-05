import { ContentSection } from "@/components/ui/content-section";

/** Explanatory content for the Discount Calculator page (Server Component, no JS). */
export function DiscountCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How a discount is calculated">
        <p>
          <strong>Final price = original price × (1 − discount ÷ 100)</strong>
        </p>
        <p>
          <strong>You save = original price − final price</strong>
        </p>

        <h3>Worked example</h3>
        <p>
          A shirt costs ৳2,500 with 20% off: 2,500 × (1 − 0.20) = <strong>৳2,000</strong>. You save
          ৳500.
        </p>
      </ContentSection>

      <ContentSection id="extra-discount" title="Two discounts: why 20% + 10% is not 30%">
        <p>
          With an extra discount, the second percentage is taken off the price that is already
          reduced:
        </p>
        <p>
          <strong>Final price = original × (1 − first ÷ 100) × (1 − extra ÷ 100)</strong>
        </p>
        <p>
          On ৳1,000, 20% off leaves ৳800. An extra 10% off is 10% of ৳800, which is ৳80, so you pay{" "}
          <strong>৳720</strong>. You save ৳280, which is <strong>28%</strong> of ৳1,000, not 30%.
        </p>
        <p>
          The total discount is always a little below the two percentages added together. The order
          doesn’t matter: 10% then 20% gives the same ৳720.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the original price in Taka.</li>
          <li>Enter the discount percentage, from 0 to 100.</li>
          <li>If the offer has a second discount, tick “Add an extra discount” and enter it.</li>
          <li>Select Calculate discount to see the final price, the amount saved and the total discount.</li>
        </ol>
        <p>
          Amounts are rounded to the nearest paisa. Whole-Taka amounts are shown without paisa, and
          other amounts with two decimals.
        </p>
      </ContentSection>
    </>
  );
}
