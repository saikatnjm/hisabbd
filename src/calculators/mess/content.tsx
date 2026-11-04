import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-right text-sm";
const cell = "border-b border-slate-200 py-2 pr-3 tabular-nums";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** The page's worked example (same figures as the logic tests): ৳7,200 bazar, 180 meals, ৳2,000 fixed costs. */
const MEMBERS: readonly [name: string, meals: string, cost: string, deposit: string, balance: string][] = [
  ["Rahim", "60", "2,900", "3,000", "gets ৳100"],
  ["Karim", "45", "2,300", "2,500", "gets ৳200"],
  ["Jamal", "50", "2,500", "2,000", "owes ৳500"],
  ["Salam", "25", "1,500", "1,500", "settled"],
];

/** Explanatory content for the Mess Meal Calculator (Server Component, no JS). */
export function MessCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How a mess meal account works">
        <ol>
          <li>
            <strong>Meal rate = total bazar cost for the month ÷ everyone’s total meals</strong>
          </li>
          <li>
            <strong>A member’s cost = their meals × meal rate + their share of fixed costs</strong> (cook, gas, internet,
            split equally)
          </li>
          <li>
            <strong>Balance = deposit − cost.</strong> Positive means they get money back; negative means they owe.
          </li>
        </ol>
        <p>
          A deposit is everything a member paid into the mess, including bazar they did themselves. All the balances add
          up to total deposits − total costs: the cash left with the manager, or the shortfall.
        </p>
      </ContentSection>

      <ContentSection id="example" title="Example: a mess of 4">
        <p>
          The month’s bazar cost ৳7,200 and everyone ate 180 meals in total, so the meal rate is 7,200 ÷ 180 ={" "}
          <strong>৳40</strong>. The cook and gas come to ৳2,000 of fixed costs, ৳500 each.
        </p>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={`${head} text-left`}>Member</th>
                <th scope="col" className={head}>Meals</th>
                <th scope="col" className={head}>Cost (৳)</th>
                <th scope="col" className={head}>Deposit (৳)</th>
                <th scope="col" className={head}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map(([name, meals, cost, deposit, balance]) => (
                <tr key={name}>
                  <td className={`${cell} text-left`}>{name}</td>
                  <td className={cell}>{meals}</td>
                  <td className={cell}>{cost}</td>
                  <td className={cell}>{deposit}</td>
                  <td className={cell}>{balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Rahim’s cost: 60 × ৳40 = ৳2,400, plus ৳500 = ৳2,900; he deposited ৳3,000, so he gets ৳100 back. Deposits total
          ৳9,000 and costs ৳9,200, so the mess is ৳200 short: Jamal’s ৳500 minus the ৳300 owed to Rahim and Karim.
        </p>
      </ContentSection>

      <ContentSection id="tips" title="A few rules that prevent arguments">
        <ul>
          <li>Write down meals every day, in a notebook or the mess group; counting from memory at month end goes wrong.</li>
          <li>Add a guest’s meals to the member who brought them. Half meals can be counted as 0.5.</li>
          <li>Keep receipts for bazar members did themselves, and count it both in the bazar total and in their deposit.</li>
          <li>Agree at the start of the month how fixed costs are split (equally, or by meals).</li>
          <li>
            At month end, copy the result text and share it in the mess group. For percentages, use the{" "}
            <Link href={localePath("en", calculatorPath("percentage-calculator"))} className={link}>
              Percentage Calculator
            </Link>
            ; for the mess’s electricity bill, the{" "}
            <Link href={localePath("en", calculatorPath("electricity-bill-calculator"))} className={link}>
              Electricity Bill Calculator
            </Link>
            .
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter this month’s total bazar cost.</li>
          <li>Enter fixed costs to split equally, or leave the box blank.</li>
          <li>Enter each member’s name (optional), meals and deposit; select Add member if you need more rows.</li>
          <li>Select Calculate meals to see the meal rate, each member’s cost and balance, and the cash with the manager.</li>
        </ol>
        <p>Everything is worked out on your phone; names and amounts are never sent anywhere.</p>
      </ContentSection>
    </>
  );
}
