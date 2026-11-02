import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the Expense Split Calculator (Server Component, no JS). */
export function SplitCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How the split works">
        <ol>
          <li>
            <strong>Share each = total spent ÷ number of people.</strong>
          </li>
          <li>
            <strong>Balance = what someone paid − their share.</strong> Positive means they get money back; negative means
            they owe.
          </li>
          <li>The person who owes the most pays the person owed the most, and so on until everyone is even.</li>
        </ol>
        <h3>Example: a ৳12,000 trip for 4</h3>
        <p>
          Rahim paid ৳6,000, Karim ৳4,000 and Jamal ৳2,000; Salam paid nothing. The share is ৳12,000 ÷ 4 = ৳3,000 each.
          Rahim gets ৳3,000 back and Karim ৳1,000; Jamal owes ৳1,000 and Salam ৳3,000. Two payments settle it:{" "}
          <strong>Salam pays Rahim ৳3,000 and Jamal pays Karim ৳1,000.</strong>
        </p>
      </ContentSection>

      <ContentSection id="tips" title="Keeping it simple">
        <ul>
          <li>Agree before the trip which costs everyone shares equally.</li>
          <li>Note who paid for what as it happens, on your phone or in a notebook.</li>
          <li>So shares add up to the paisa, any leftover paisa are added one each to the first people in the list.</li>
          <li>
            For a mess where people eat different numbers of meals, the{" "}
            <Link href={localePath("en", calculatorPath("mess-meal-calculator"))} className={link}>
              Mess Meal Calculator
            </Link>{" "}
            charges by meals; to count cash, use the{" "}
            <Link href={localePath("en", calculatorPath("cash-counter"))} className={link}>
              Cash Counter
            </Link>
            .
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter each person’s name (optional) and what they paid; leave the amount blank for someone who paid nothing.</li>
          <li>Select Add person for more people.</li>
          <li>Select Split the cost to see the share, everyone’s balance and who pays whom; copy the text to your group.</li>
        </ol>
        <p>Everything is worked out on your phone; names and amounts are never sent anywhere.</p>
      </ContentSection>
    </>
  );
}
