import { LazyLink as Link } from "@/components/ui/lazy-link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { SETTLEMENT_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";

/** Explanatory content for the Job Exit Benefit Calculator (Server Component, no JS). Figures match logic.test.ts. */
export function SettlementCalculatorContent() {
  const en = (slug: string) => localePath("en", calculatorPath(slug));

  return (
    <>
      <ContentSection id="how-it-works" title="How the job exit benefit is worked out">
        <p>
          <strong>
            Benefit = completed years of service × days of wages per year × a day’s wage. Add or subtract notice wages if
            notice was not given.
          </strong>
        </p>
        <ul>
          <li>Wage = last monthly basic wage + dearness or ad hoc allowance (section 14(3)).</li>
          <li>A day’s wage = that wage ÷ the days in a month you enter.</li>
          <li>Days per year depend on how the job ended: 30 for retrenchment, discharge and termination by the employer; 7, 15 or 30 for resignation.</li>
          <li>If gratuity is payable, the higher of gratuity and compensation is used.</li>
        </ul>
        <h3>Worked example: resignation</h3>
        <p>Basic ৳20,000, no dearness allowance, 4 years 8 months of service, 30 days in a month, full notice served:</p>
        <ol>
          <li>A day’s wage: ৳20,000 ÷ 30 = ৳666.67.</li>
          <li>Completed years: 4. Service is more than 3 but less than 10 years, so the rate is 15 days a year.</li>
          <li>Benefit: 4 × 15 × ৳666.67 = ৳40,000.</li>
        </ol>
        <h3>Worked example: retrenchment</h3>
        <p>
          Basic ৳14,000 plus dearness allowance ৳1,000, 8 years 7 months, 30 days in a month, gratuity payable, no notice
          given:
        </p>
        <ol>
          <li>Wage: ৳15,000. A day’s wage: ৳15,000 ÷ 30 = ৳500.</li>
          <li>Compensation: 8 completed years × 30 days × ৳500 = ৳120,000.</li>
          <li>Gratuity: 7 months is more than six, so 9 years × 30 days × ৳500 = ৳135,000, which is higher.</li>
          <li>Notice: one month’s wage, ৳15,000, in place of notice.</li>
          <li>Total: ৳135,000 + ৳15,000 = ৳150,000.</li>
        </ol>
        <p>
          Planning your next job and pay? The{" "}
          <Link href={en("salary-calculator")} className={link}>
            salary calculator
          </Link>{" "}
          shows take-home pay, and the{" "}
          <Link href={en("overtime-calculator")} className={link}>
            overtime calculator
          </Link>{" "}
          works out overtime under section 108. To count service between two dates, use the{" "}
          <Link href={en("date-difference-calculator")} className={link}>
            date difference calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="wages" title="Which wage counts">
        <p>
          Section 14(3) of the Bangladesh Labour Act 2006, as shown on the government’s site on 2 November 2026 after the
          2026 amendment, says:
        </p>
        <blockquote>
          “মজুরি” বলিতে কোনো শ্রমিকের ছাঁটাই, বরখাস্ত, অপসারণ, ডিসচার্জ, অবসর গ্রহণ বা চাকুরির অবসানের পূর্ববর্তী সর্বশেষ
          মাসিক মূল মজুরি ও মহার্ঘ ভাতা এবং এডহক বা অন্তবর্তী মজুরি, যদি থাকে, উহাকে বুঝাইবে।
        </blockquote>
        <p>
          That is the last monthly basic wage plus dearness allowance and ad hoc or interim wage, if any. House rent,
          medical and conveyance allowances are not named, so they are left out. Enter only the dearness or ad hoc part in
          the optional field.
        </p>
        <h3>Why you enter the days in a month yourself</h3>
        <p>
          The Act does not say how to turn a monthly wage into a day’s wage for sections 20, 22, 26 and 27. (Section 48(2)
          divides by 26, but only for maternity benefit.) Employers commonly use 30 or 26, and we do not guess: take the
          number from your payslip, contract or HR. A retrenchment notice of one month is the monthly wage itself, so it
          does not depend on this number.
        </p>
      </ContentSection>

      <ContentSection id="resignation" title="Resignation (section 27)">
        <p>
          Section 27(4), replaced by the Labour (Amendment) Act 2026 as shown on bdlaws, says the employer pays a permanent
          worker who resigns, as compensation, for each completed year of service:
        </p>
        <blockquote>
          (ক) 3 (তিন) বৎসর পর্যন্ত অবিচ্ছিন্নভাবে মালিকের অধীন চাকুরি করিয়া থাকেন তাহা হইলে, 7 (সাত) দিনের মজুরি; (খ) 3
          (তিন) বৎসরের বেশি কিন্তু 10 (দশ) বছরের কম মেয়াদে … তাহা হইলে, 15 (পনের) দিনের মজুরি; (গ) 10 (দশ) বৎসর বা তদূর্ধ্ব
          সময় … তাহা হইলে, 30 (ত্রিশ) দিনের মজুরি, অথবা গ্রাচ্যুইটি, যদি প্রদেয় হয়, যাহা অধিক হইবে
        </blockquote>
        <ul>
          <li>Up to 3 years of service: 7 days’ wages for each completed year.</li>
          <li>More than 3 but less than 10 years: 15 days’ wages for each completed year.</li>
          <li>10 years or more: 30 days’ wages for each completed year, or gratuity if payable and higher.</li>
        </ul>
        <p>
          We apply the rate for your total service to every completed year; the text does not say the rates are marginal.
          The amount is “in addition to other benefits payable under this Act”.
        </p>
        <p>
          Notice: section 27(1) lets a permanent worker resign by giving 60 days’ written notice (<em>“ষাট দিনের লিখিত
          নোটিশ”</em>). Section 27(3) lets a worker leave without notice by paying the employer{" "}
          <em>“নোটিশ মেয়াদের জন্য মজুরীর সমপরিমাণ অর্থ”</em>, wages for the notice period. If you tick that you did not
          serve notice, 60 days’ wages are subtracted in the total as an estimate.
        </p>
      </ContentSection>

      <ContentSection id="termination" title="Termination by the employer (section 26)">
        <p>
          Section 26 covers a permanent worker whose job the employer ends other than by dismissal or the other methods
          elsewhere in the chapter. Section 26(1)(ক) allows it with a written notice of 120 days for a worker employed on a
          monthly wage (<em>“একশত বিশ দিনের”</em>), and 26(3) lets the employer pay wages for the notice period instead.
          Section 26(4) says:
        </p>
        <blockquote>
          মালিক শ্রমিককে তাহার প্রত্যেক সম্পূর্ণ বৎসরের চাকুরীর জন্য ক্ষতিপূরণ হিসাবে ত্রিশ দিনের মজুরী, অথবা গ্রাচ্যুইটি, যদি
          প্রদেয় হয়, যাহা অধিক হইবে, প্রদান করিবেন
        </blockquote>
        <p>
          So 30 days’ wages for each completed year, or gratuity if payable and higher, on top of other benefits. If you
          tick that no notice was given, 120 days’ wages are added.
        </p>
      </ContentSection>

      <ContentSection id="retrenchment" title="Retrenchment (section 20)">
        <p>
          Retrenchment (ছাঁটাই) is ending a job because the worker is no longer needed (section 2(11)). Section 20(2) applies
          to a worker with at least one year of continuous service. The employer must give one month’s written notice
          stating the reason, <em>“অথবা নোটিশ মেয়াদের জন্য নোটিশের পরিবর্তে মজুরী প্রদান”</em>, and, under 20(2)(গ):
        </p>
        <blockquote>
          তাহাকে ক্ষতিপূরণ বাবদ তাহার প্রত্যেক বৎসর চাকুরীর জন্য ত্রিশ দিনের মজুরী বা গ্রাচ্যুইটি যদি প্রদেয় হয়, যাহা অধিক
          হইবে, প্রদান করিতে হইবে
        </blockquote>
        <p>
          Section 20(3) adds 15 days’ wages for a retrenchment that follows a lay-off under section 16(7); that case is not
          modelled. The notice must also be copied to the Chief Inspector and the collective bargaining representative.
        </p>
      </ContentSection>

      <ContentSection id="discharge" title="Discharge for ill health (section 22)">
        <p>
          A discharge (ডিসচার্জ) is the employer ending a job because of physical or mental incapacity or continued ill
          health certified by a registered doctor (sections 2(17) and 22(1)). Section 22(2) says:
        </p>
        <blockquote>
          ডিসচার্জকৃত কোন শ্রমিক অনূ্যন এক বৎসর অবিচ্ছিন্ন চাকুরী সম্পূর্ণ করিলে তাহাকে মালিক তাহার প্রত্যেক বৎসর চাকুরীর জন্য
          ক্ষতিপূরণ হিসাবে ত্রিশ দিনের মজুরী অথবা গ্রাচ্যুইটি, যদি প্রদেয় হয়, যাহা অধিক হইবে, প্রদান করিবেন
        </blockquote>
        <p>Section 22 states no notice period, so the calculator shows no notice line for a discharge.</p>
      </ContentSection>

      <ContentSection id="gratuity" title="Gratuity and the six-month rule">
        <p>Section 2(10) defines gratuity:</p>
        <blockquote>
          কোন শ্রমিকের প্রতি পূর্ণ বৎসর চাকুরী অথবা ছয় মাসের অতিরিক্ত সময়ের চাকুরীর জন্য তাহার সর্বশেষ প্রাপ্ত মজুরী হারে
          ন্যূনতম 30 দিনের মজুরী অথবা 10 বৎসরের অধিককাল চাকুরীর ক্ষেত্রে তাহার সর্বশেষ প্রাপ্ত মজুরী হারে 45 দিনের মজুরী
        </blockquote>
        <p>In plain words, and how this calculator reads it:</p>
        <ul>
          <li>Each full year counts, and so does a part year of more than six months. 6 months exactly does not; 6 months and a day does.</li>
          <li>At least 30 days’ wages a year, or 45 days’ wages a year when service is more than 10 years. We apply 45 days to every year in that case, not only to the years after the tenth.</li>
          <li>Gratuity is paid “if payable”, which depends on your employer’s rules, so you tick it yourself. It is compared with the compensation and the higher is used.</li>
          <li>We count gratuity only from one completed year, and under resignation only from 10 years, as section 27(4)(গ) says.</li>
        </ul>
        <p>
          Your employer’s scheme may pay more than the Act’s minimum. This calculator does not model schemes, only the
          Act’s figures. Compensation for completed years does not count the extra part-year; only gratuity does.
        </p>
      </ContentSection>

      <ContentSection id="not-covered" title="What is not covered, and why">
        <ul>
          <li>
            Dismissal for misconduct (section 23): it follows a proven misconduct process. Under 23(3) a worker removed or
            dismissed with at least a year of service gets 15 days’ wages for each completed year, but nothing for some
            offences. We leave it out because the result depends on the finding, not on arithmetic.
          </li>
          <li>Death (section 19), retirement (section 28), closure after a disaster (28A) and lay-off: different rules.</li>
          <li>Temporary workers, probationers and workers not paid monthly: different notice periods and no section 26(4) or 27(4) compensation.</li>
          <li>Pay for unused annual leave (section 11), provident fund, bonuses, tax and other allowances.</li>
          <li>
            The test for counting “one year” or “six months” in section 14(1): the Act counts a year as at least 240 days
            actually worked in the last 12 months. We assume your service was continuous.
          </li>
          <li>Government employees and workers under other laws or contracts are outside the Labour Act.</li>
        </ul>
        <p>
          Section 30 says all dues must be paid within 30 working days after the job ends (<em>“সর্বোচ্চ ত্রিশ কর্ম দিবসের
          মধ্যে”</em>).
        </p>
      </ContentSection>

      <ContentSection id="rules-checked" title="Rules checked on 2 November 2026">
        <p>
          We read sections 2, 11, 14, 20, 22, 23, 26, 27 and 30 of the Bangladesh Labour Act 2006 on the government’s Laws
          of Bangladesh site on 2 November 2026. That text showed the Labour (Amendment) Act 2026 (Act 43 of 2026) in
          sections 14 and 27(4) and the 2013 and 2018 amendments elsewhere. We did not check when each change came into
          force, so if your job ended some time ago the earlier wording may apply.
        </p>
        <p>
          This page is general information, not legal advice. Your appointment letter, service rules, any settlement and the
          courts decide what you are paid. If you think you are owed more, talk to your union or the labour office.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Choose how the job ended.</li>
          <li>Enter your last monthly basic wage, and any dearness or ad hoc allowance.</li>
          <li>Enter your years of continuous service, and extra months and days if any.</li>
          <li>Enter the days in a month your employer uses for a day’s wage.</li>
          <li>Tick gratuity if your employer pays it, and untick the notice box if notice was not given or served.</li>
          <li>Select Calculate job exit benefit to see each line with its section number.</li>
        </ol>
        <p>
          Your figures stay in your browser. They are saved only in your recent calculations on this device, which you can
          turn off.
        </p>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          {[S.section2, S.section14, S.section20, S.section22, S.section23, S.section26, S.section27, S.section30, S.section11].map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {source.title}
              </a>
            </li>
          ))}
        </ul>
        <p>All checked on 2 November 2026.</p>
      </ContentSection>
    </>
  );
}
