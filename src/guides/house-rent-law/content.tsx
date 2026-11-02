import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { guidePath } from "@/guides/paths";
import { ACT_QUOTES as Q, HOUSE_RENT_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[20rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3 align-top";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Verbatim extract from the Act, in the original Bangla. */
function Quote({ children, section }: { children: string; section: string }) {
  return (
    <blockquote className="border-l-4 border-slate-300 pl-4 text-slate-700">
      <p lang="bn">“{children}৷”</p>
      <footer className="mt-1 text-sm">Section {section}, official text</footer>
    </blockquote>
  );
}

/** Topic, what the Act says in plain words, section. Every row is from the bdlaws text. */
const RULES: readonly [topic: string, says: string, section: string][] = [
  ["Rent above standard rent", "Cannot be recovered, whatever the agreement says.", "7"],
  ["Fixing standard rent", "The Rent Controller fixes it on an application by the landlord or the tenant, at 15% a year of the house’s market value, worked out by the method set in the rules.", "15"],
  ["Re-fixing standard rent", "On application, the Controller may re-fix it every two years.", "16(2)"],
  ["Salami, premium, deposit", "No one may demand or take a premium, salami, deposit (জামানত) or similar sum on top of the rent for letting, renewing or extending a tenancy (a 20-year development lease is the exception).", "10(ক), 11"],
  ["Advance rent", "Not more than one month’s rent without the Controller’s prior approval.", "10(খ)"],
  ["Furniture", "Buying the landlord’s furniture cannot be made a condition of the tenancy.", "12"],
  ["Rent receipt", "The landlord must sign and hand over a receipt at once, in the form set by the rules, and keep a counterfoil.", "13"],
  ["Money taken against the Act", "The Controller can order a refund if the tenant applies within six months of paying.", "14"],
  ["Eviction", "No court order to recover possession while the tenant pays the permitted rent in full and keeps the tenancy terms, except in the cases listed.", "18"],
  ["Repairs and utilities", "The Controller can direct a landlord who is bound to repair or to maintain water, electricity, drainage or lift to do so.", "21"],
  ["Penalties", "Fines for overcharging, taking more than a month’s advance, refusing a receipt and similar acts, on a written complaint to the Controller.", "23, 24, 26, 27, 28"],
  ["Appeal", "To the District Judge within 30 days of the Controller’s order.", "30"],
];

/** English guide: house rent law under the Premises Rent Control Act 1991 (Server Component, no JS). */
export function HouseRentLawGuideContent() {
  const pct = localePath("en", calculatorPath("percentage-calculator"));
  const split = localePath("en", calculatorPath("expense-split-calculator"));
  const salary = localePath("en", calculatorPath("salary-calculator"));
  const mess = localePath("en", calculatorPath("mess-meal-calculator"));
  const pctGuide = localePath("en", guidePath("percentage-calculation"));

  return (
    <>
      <ContentSection id="act" title="The law and who it covers">
        <p>
          The main law is the Premises Rent Control Act 1991 (বাড়ী ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১), Act No. 3 of 1991. It
          covers a “house” (বাড়ী) let separately for residential, non-residential or both uses: a building or part of one,
          or a kutcha house, with its attached garden and yard (section 2(গ)). It applies in the areas where the earlier
          Premises Rent Control Ordinance 1986 was in force on 26 March 1989, and the government can extend it to other
          areas or lift it by gazette notice (section 1(2)). Section 33 says it does not apply to houses occupied by the
          government and by RAJUK, CDA, KDA and RDA.
        </p>
        <p>
          Everything below is taken from the official text on bdlaws. Where a popular claim is not in the text, this page
          says so.
        </p>
      </ContentSection>

      <ContentSection id="summary" title="What the Act says, section by section">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Topic</th>
                <th scope="col" className={head}>What the Act says</th>
                <th scope="col" className={head}>Section</th>
              </tr>
            </thead>
            <tbody>
              {RULES.map(([topic, says, section]) => (
                <tr key={topic}>
                  <td className={`${cell} font-medium text-slate-900`}>{topic}</td>
                  <td className={cell}>{says}</td>
                  <td className={`${cell} whitespace-nowrap`}>{section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="standard-rent" title="Standard rent and rent increases">
        <p>Section 7 is the core rule:</p>
        <Quote section="7">{Q.s7}</Quote>
        <p>Standard rent (মানসম্মত ভাড়া) is the rent fixed by the Controller. Section 15 says how:</p>
        <Quote section="15">{Q.s15}</Quote>
        <p>
          The market value is “fixed in the manner prescribed by the rules”, so the Act itself gives no figure. As an
          illustration only: if a house’s market value were fixed at ৳50 lakh, 15% of it is ৳7,50,000 a year, or ৳62,500 a
          month.
        </p>
        <p>
          Section 16(1) says that if fixing standard rent changes the rent being paid, the new rent is payable from the month
          after the application. Section 16(2):
        </p>
        <Quote section="16(2)">{Q.s16_2}</Quote>
        <p>
          Note what this says: the Controller <em>may</em> re-fix standard rent every two years, on an application by either
          side. We found no section of the Act that sets a fixed percentage for annual rises, or that says a landlord may raise
          rent only once in two years. Sections 8 and 9 do allow extra rent in two cases: by agreement when the landlord pays
          for additions, improvements or furniture after letting, and where the tenant is to pay municipal rates or taxes and
          the landlord agrees to pay them.
        </p>
      </ContentSection>

      <ContentSection id="example" title="Worked example: how big is the rise?">
        <p>
          Your landlord asks you to pay ৳16,500 instead of ৳15,000. To see the rise as a percentage:
        </p>
        <ol>
          <li>Rise = ৳16,500 − ৳15,000 = ৳1,500.</li>
          <li>
            Rise as a share of the old rent = ৳1,500 ÷ ৳15,000 = 0.10, which is <strong>10%</strong>.
          </li>
        </ol>
        <p>
          The{" "}
          <Link href={pct} className={link}>
            Percentage Calculator
          </Link>{" "}
          does this in one step (percentage change), and our{" "}
          <Link href={pctGuide} className={link}>
            percentage calculation guide
          </Link>{" "}
          explains the formula. The percentage alone does not tell you whether the new rent is lawful: under section 7 the
          test is whether it is above a standard rent fixed for the house. If none has been fixed, the agreed rent is the
          rent that counts for section 18 (see section 18(6)).
        </p>
        <p>
          Once the rent is settled, the{" "}
          <Link href={split} className={link}>
            Expense Split Calculator
          </Link>{" "}
          can divide it between flatmates, and the{" "}
          <Link href={mess} className={link}>
            Mess Meal Calculator
          </Link>{" "}
          helps a shared mess keep rent and meal costs apart. To see what rent is of your pay, try the{" "}
          <Link href={salary} className={link}>
            Salary Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="advance" title="Advance rent, deposits and salami">
        <p>Section 10 has two limbs. The first bans extra money for letting, renewing or extending a tenancy:</p>
        <Quote section="10(ক)">{Q.s10a}</Quote>
        <p>The second limits advance rent:</p>
        <Quote section="10(খ)">{Q.s10b}</Quote>
        <p>
          So, on the text, the advance is capped at one month’s rent unless the Controller approves in advance, and a
          separate “জামানত” (deposit) on top of rent is listed among the banned payments. Section 23(খ) and (গ) fine a person
          who demands or takes such sums. If you paid more than the Act allows, section 14 lets the Controller order a refund
          or adjustment, if you apply within six months of paying. Section 12 adds:
        </p>
        <Quote section="12">{Q.s12}</Quote>
      </ContentSection>

      <ContentSection id="receipt" title="Rent receipts">
        <Quote section="13(1)">{Q.s13}</Quote>
        <p>
          Section 13(2) tells the landlord to keep a counterfoil of the receipt. If a landlord refuses or fails to give a
          receipt, section 27 provides a fine: <span lang="bn">“{Q.s27}”</span>, on the tenant’s complaint. Keep every receipt:
          a complaint under section 27 must be brought within six months of the offence (section 29).
        </p>
      </ContentSection>

      <ContentSection id="eviction" title="Eviction">
        <p>The central protection is in section 18(1):</p>
        <Quote section="18(1)">{Q.s18}</Quote>
        <p>
          The same sub-section lists exceptions where this protection does not apply: for example, the tenant breaks the
          conditions of the Transfer of Property Act section 108 (clauses (m), (c), (p)), sub-lets the house or part of it
          without the landlord’s written consent (unless the agreement says otherwise), behaves in a way that is a nuisance
          to neighbours, uses part of the house for business, or the landlord <span lang="bn">“প্রকৃতই প্রয়োজন”</span>{" "}
          (genuinely needs) it to build or rebuild or for own use. Section 18(2) adds that the end of the tenancy period or a
          transfer of the landlord’s interest is not, by itself, a satisfactory reason if the tenant is ready and willing to
          pay the full permitted rent. Section 18(5) removes the protection from a tenant who does not pay the full rent by the
          date in the agreement or, without one, within the 15 days of the following month.
        </p>
        <p>
          Notice periods: we did not find any notice period for ending a monthly tenancy in this Act. The Act speaks of court
          orders and decrees for possession, so if you receive a notice to leave, ask a lawyer how the rules on notice and on
          section 18 apply to you. Section 26 says a tenant who leaves must hand over vacant possession; section 24 fines a
          person who, while section 18 protects the tenant, wilfully cuts off a supply or facility under the tenancy.
        </p>
        <p>
          If a landlord refuses rent sent by postal money order, or there is a real dispute about who should receive it,
          section 19 lets the tenant deposit the rent with the Controller within the time it sets out.
        </p>
      </ContentSection>

      <ContentSection id="duties" title="Landlord’s duties: repairs and utilities">
        <p>
          Under section 21, where a landlord is bound by the tenancy terms or local custom to repair, or to maintain water,
          electricity, drainage or lift, the tenant can apply to the Controller, who can direct the landlord by notice. If the
          landlord does not act within 30 days of the notice, the tenant can ask the Controller’s permission to do the work
          and deduct the cost, capped each year at one-sixth of the rent payable that year. Section 21(5) says the landlord
          must in all cases do repairs without which living in the house is extremely hard. Section 32:
        </p>
        <Quote section="32">{Q.s32}</Quote>
      </ContentSection>

      <ContentSection id="controller" title="The Rent Controller and how to apply">
        <ul>
          <li>The government appoints a Controller (and additional or deputy controllers) for an area by gazette notice (section 3).</li>
          <li>Standard rent: a written application by the landlord or the tenant under section 15. The Controller must send both sides a registered-post notice before using a power under the Act (section 5).</li>
          <li>Hearing: within three months of the application, and within one month for a tenant’s application to repair at own cost under section 21(2); if that is not possible the reasons must be recorded (section 4).</li>
          <li>Complaints about fines (sections 23 to 27): in writing to the Controller (section 28).</li>
          <li>Appeal: to the District Judge within 30 days of the order (section 30).</li>
        </ul>
        <p>
          The forms, fees and the method of valuing the house are set by the rules (বিধি) made under section 34, which are
          not covered here. Check the government notification for your area to see who the Controller is.
        </p>
      </ContentSection>

      <ContentSection id="claims" title="Claims you hear that are not in the Act">
        <ul>
          <li>
            <strong>“Rent can rise only once in two years.”</strong> The two-year period in section 16(2) is for the Controller
            re-fixing standard rent on application. We found no section that stops a landlord asking for a rise earlier or
            fixes a yearly percentage.
          </li>
          <li>
            <strong>A notice period such as 15 or 30 days to vacate.</strong> None is in this Act.
          </li>
          <li>
            <strong>City corporation or local guidelines.</strong> These are separate from the Act and are not covered here.
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="amendments" title="Has the Act been amended?">
        <p>
          The bdlaws text we read shows no amendment notes. It repealed the Premises Rent Control Ordinance 1991 (Ordinance No.
          2 of 1991) in section 36 and saved the Ordinance of 1986’s rules, orders and pending cases in section 35. We did not
          check court judgments or other rules; laws and rules change, so confirm on bdlaws before relying on this page.
        </p>
      </ContentSection>

      <ContentSection id="note" title="Keep in mind">
        <p>
          This is general information, not legal advice. Your written tenancy agreement, the area you live in, the rules
          and court decisions all matter. For a dispute, talk to a lawyer or the Rent Controller for your area.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            <a href={S.act.url} target="_blank" rel="noopener" className={link} lang="bn">
              {S.act.title}
            </a>{" "}
            (Bangla)
          </li>
          <li>
            <a href={S.print.url} target="_blank" rel="noopener" className={link} lang="bn">
              {S.print.title}
            </a>{" "}
            (Bangla)
          </li>
        </ul>
        <p>Checked on 2 November 2026.</p>
      </ContentSection>
    </>
  );
}
