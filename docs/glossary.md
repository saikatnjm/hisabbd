# Glossary

## Bangladesh and language terms

| Term | Meaning |
| --- | --- |
| **Hisab (হিসাব)** | "Calculation" or "account" in Bangla. HisabBD = calculations for Bangladesh. |
| **Bangla / Bengali (বাংলা)** | The national language. Locale code `bn`; hreflang `bn-BD`. |
| **Taka (৳, BDT)** | Bangladeshi currency. Shown as a `৳` prefix: `৳2,500`. |
| **Paisa (পয়সা)** | 1/100 of a Taka. Money calculators round to the nearest paisa (2 dp). |
| **Lakh (লাখ)** | 1,00,000 = 100,000. Numbers are grouped `1,00,000` (South Asian grouping, `en-IN` locale). |
| **Crore (কোটি)** | 1,00,00,000 = 10,000,000. |
| **Bangla digits** | ০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯. Accepted as input everywhere; output uses Western digits. |
| **Banglish** | Bangla written in Latin letters (e.g. "chhar" for ছাড়, discount). Used in search keywords. |
| **Weekend** | Friday and Saturday in Bangladesh. The working week is Sunday–Thursday (used by Date Difference). |
| **Asia/Dhaka** | The site's timezone (UTC+6, no DST). Calculations use plain dates, so the timezone never affects results. |

## Education

| Term | Meaning |
| --- | --- |
| **UGC** | University Grants Commission of Bangladesh. It publishes the uniform grading system (A+ = 4.00 … F = 0.00) used by many universities. Default scale `bd-ugc-4`. |
| **GPA** | Grade Point Average for one semester/term: credit-weighted average of grade points. |
| **CGPA** | Cumulative GPA across terms: credit-weighted average of term GPAs. |
| **Credit / credit hour** | Weight of a course. Can be fractional (0.75, 1.5). |
| **SSC / HSC** | Secondary / Higher Secondary Certificate (school-leaving exams). 5.00 board scale; the optional (4th) subject adds max(0, GP − 2) and is not in the divisor; capped at 5.00. Handled by the SSC & HSC GPA Calculator, not the university GPA calculator. |
| **Circular / "age as on" date** | A government job advertisement and the date on which candidates' age is counted. Maximum age for direct recruitment is 32 (2026 law). |
| **Shotangsho / decimal (শতাংশ), katha (কাঠা), bigha (বিঘা)** | Land units: 1 decimal = 435.6 sq ft, 1 katha = 720 sq ft (standard; varies by region), 1 bigha = 20 katha ≈ 33 decimal, 1 acre = 100 decimal. |
| **Truncation vs rounding** | Some institutions cut off at 2 decimals instead of rounding. HisabBD rounds and explains the difference on the page. |

## Finance

| Term | Meaning |
| --- | --- |
| **EMI** | Equated Monthly Instalment: the fixed monthly payment on a reducing-balance loan. |
| **Reducing balance** | Interest is charged on the outstanding principal each month (as opposed to flat rate, which is not modelled). |
| **Tenure** | Loan duration, in months or years. |
| **Nominal annual rate** | Yearly rate ÷ 12 = monthly rate. Not APR/APY. |
| **Gross / net salary** | Before / after deductions. |
| **TDS** | Tax Deducted at Source: income tax withheld by the employer. It is a deduction preset name only; no rates are built in. |
| **Provident fund (PF)** | Retirement savings deducted from salary. Preset name only; the user enters the amount or %. |
| **Markup (% on cost)** | (selling − cost) ÷ cost × 100. The standard "profit %". |
| **Margin (% on selling price)** | (selling − cost) ÷ selling × 100. |
| **Stacked / extra discount** | A second discount applied to the already-reduced price (20% + 10% = 28%). |

## Health

| Term | Meaning |
| --- | --- |
| **BMI** | Body Mass Index = kg ÷ m². Classified with WHO adult cut-offs (18.5 / 25 / 30 / 35 / 40). |

## Project terms

| Term | Meaning |
| --- | --- |
| **Registry** | `src/calculators/registry.ts`: the list of published calculators' metadata. The source of truth for listings, search, sitemap and more. |
| **Page registry** | `src/calculators/page-registry.tsx`: slug → widget and content components. Drives `/bn/calculators/[slug]`. |
| **Meta** | A calculator's `CalculatorMeta` object in `meta.ts`. |
| **Logic** | A calculator's pure `logic.ts`. |
| **Widget** | A calculator's client component `<name>-calculator.tsx`. |
| **Content** | `content.tsx` / `content.bn.tsx`: explanatory Server Components. |
| **Slug** | URL id such as `age-calculator`; also the only thing stored in localStorage and sent to analytics. |
| **Featured** | Editor-picked slugs in `featured.ts` (not usage data). |
| **Recent / Favourites** | Per-browser lists of slugs in localStorage. |
| **Locale shell** | `LocaleShell`: skip link, header, main and footer for one locale. |
| **Plain date** | `{year, month, day}` with no time or timezone (`src/lib/plain-date.ts`). |
| **revealKey / revealCount** | A counter incremented on each successful Calculate; it drives the result animation, scroll and analytics. |
