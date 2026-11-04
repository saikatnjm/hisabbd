import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the Unit Price Calculator (Server Component, no JS). */
export function UnitPriceCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How the comparison works">
        <ol>
          <li>
            <strong>Unit price = price ÷ quantity</strong>, shown per kg, per litre or per piece. For weight and volume it
            also shows the price per 100 g or per 100 ml.
          </li>
          <li>The option with the lowest unit price is the cheapest. Options with the same unit price tie.</li>
          <li>
            <strong>Saving = dearest unit price − cheapest unit price</strong>, and as a percentage of the dearest unit price.
          </li>
        </ol>
        <h3>Example: 1 kg or 5 kg of rice</h3>
        <p>
          A 1 kg pack costs ৳78 and a 5 kg bag costs ৳370. The 1 kg pack is ৳78 ÷ 1 = ৳78 per kg. The 5 kg bag is ৳370 ÷ 5 ={" "}
          <strong>৳74 per kg</strong>, so it is cheaper. You save ৳4 per kg, which is ৳4 ÷ ৳78 = <strong>5.13%</strong> of the
          dearest price. The 1 kg pack costs 5.41% more than the bag.
        </p>
      </ContentSection>

      <ContentSection id="units" title="Units and what they mean">
        <ul>
          <li>
            <strong>Weight:</strong> g and kg. 1 kg = 1,000 g.
          </li>
          <li>
            <strong>Volume:</strong> ml and litre. 1 litre = 1,000 ml.
          </li>
          <li>
            <strong>Count:</strong> piece, dozen and hali. <strong>1 dozen = 12 pieces</strong> and{" "}
            <strong>1 hali = 4 pieces</strong>. These are the usual counting words in Bangladesh for eggs, bananas and oranges.
          </li>
        </ul>
        <p>
          Every option must be in the same group. A kilo of rice and a litre of oil can’t be compared fairly, so the calculator
          asks you to fix the units instead of guessing. Traditional units such as sher and maund are not included: convert to
          kg first.
        </p>
      </ContentSection>

      <ContentSection id="assumptions" title="What it does not know">
        <ul>
          <li>It compares price only, not brand, quality or freshness.</li>
          <li>A cheaper unit price is only a saving if you use the whole pack. Food that spoils costs more than it saves.</li>
          <li>Prices are the ones you type. Shop prices change, so check the label on the day.</li>
          <li>
            If a pack is on offer, work out the price first with the{" "}
            <Link href={localePath("en", calculatorPath("discount-calculator"))} className={link}>
              Discount Calculator
            </Link>
            , then enter it here. To see how much dearer one option is, the{" "}
            <Link href={localePath("en", calculatorPath("percentage-calculator"))} className={link}>
              Percentage Calculator
            </Link>{" "}
            helps, and for a shared mess bazar the{" "}
            <Link href={localePath("en", calculatorPath("mess-meal-calculator"))} className={link}>
              Mess Meal Calculator
            </Link>{" "}
            divides the cost by meals.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter an optional name, the price, the quantity and the unit for each option.</li>
          <li>Select Add option for more packs (up to 10), or the remove button to drop one.</li>
          <li>Select Compare prices to see the cheapest option, the unit price of each, and how much you save.</li>
        </ol>
        <p>Everything is worked out on your phone; prices are never sent anywhere.</p>
      </ContentSection>
    </>
  );
}
