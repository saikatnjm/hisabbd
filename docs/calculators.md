# Calculator specifications

The exact behaviour of all 20 calculators. Each section mirrors the numbered rules block at the top of that calculator's `logic.ts`, which is authoritative. Tests in `logic.test.ts` pin the examples.

## Shared conventions

- **Entry point.** Every logic module exports a `calculateX(raw…)` function. It takes raw strings from the form and returns
  `{ ok: true, result } | { ok: false, errors: { field, code }[] }`. Errors are reported for **all** invalid fields at once, in field order.
- **Number parsing.** `checkNumber(raw, { min, minExclusive, max, integer })` from `src/lib/number.ts`. It accepts Bangla digits (`১২৫`), comma grouping (`1,00,000`), spaces and a leading sign. Shared error codes: `missing`, `invalid`, `too-small`, `too-large`, `not-integer`.
- **Messages.** Logic returns codes only. Widgets turn codes into English or Bangla text, usually with `numberErrorMessage(code, { label, min, max }, locale)`.
- **Rounding.** Logic keeps full precision unless stated (money calculators round to paisa). Display rounding happens in the widget via `src/lib/format.ts`. `roundTo` rounds half away from zero using the decimal representation (`1.005 → 1.01`).
- **Upper bound for money / large numbers.** `1_000_000_000_000` (10^12).
- **Dates.** `YYYY-MM-DD` strings parsed by `parsePlainDate`. Years 1–9999, proleptic Gregorian. No timezones.
- **Widget flow.** Nothing is validated until the first Calculate. After that, errors update live. On a failed submit, focus moves to the first invalid field. On success `revealCount` increments, which animates the result, scrolls it into view on small screens and fires `calculation_completed`. Reset clears everything and focuses the first field.

---

## Age Calculator

`src/calculators/age/` · slug `age-calculator` · category `date-time`

**Inputs:** date of birth (`<input type="date">`), calculation date (defaults to today via `useToday()`), and today (passed in by the widget).

**API:** `calculateAge(dateOfBirth, calculationDate, today): AgeCalculation`, `getAgeBreakdown(birth, asOf): AgeResult`.

**Rules:**
1. Count whole calendar months from the date of birth, then the remaining days. Never divide by 365.
2. A monthly anniversary that falls on a day the month doesn't have moves to that month's last day (born 31 Jan → 1 month old on 28/29 Feb).
3. Someone born on 29 February has their birthday on 28 February in non-leap years. This is stated in the FAQ.
4. If both dates are the same day, the age is 0 days.
5. The logic never reads the clock. "Today" is a parameter.

**Output (`AgeResult`):** `years`, `months`, `days`, `totalMonths`, `totalDays`, `totalWeeks`, `remainingDaysAfterWeeks`, `birthWeekday` (0 = Sunday), `nextBirthday { date, daysAway, turningAge }`.

**Errors:** `dateOfBirth`: `missing` | `invalid` | `birth-date-in-future` (after today). `calculationDate`: `missing` | `invalid` | `calculation-date-before-birth`.

---

## BMI Calculator

`src/calculators/bmi/` · slug `bmi-calculator` · category `health`

**Inputs:** height unit `cm` | `ftin`, then `heightCm` or `heightFeet` + `heightInches`; weight unit `kg` | `lb`, then `weight`. Defaults are cm and kg.

**API:** `calculateBmi(input: BmiInput): BmiCalculation`. Helpers: `bmiFromMetric`, `classifyBmi`, `healthyWeightRangeKg`, `feetInchesToCm`, `lbToKg`, `kgToLb`.

**Formula:** `BMI = kg ÷ (m)²`. Exact conversions: 1 in = 2.54 cm, 1 lb = 0.45359237 kg.

**Limits** (to catch typos; these are not medical limits):

| Field | Range |
| --- | --- |
| Height | 50–272 cm. For ft+in, feet is a whole number 1–8 and inches is 0 to under 12 (decimals allowed, blank = 0); the total must also be 50–272 cm. |
| Weight | 2–650 kg. Pounds are converted to kg before checking. |

**Category** (WHO adult cut-offs), chosen from the BMI **rounded to 1 decimal**, the same number that is shown, so the number and category always agree (24.96 → shown as 25.0 → Overweight):

| Rounded BMI | Category | Obesity class |
| --- | --- | --- |
| < 18.5 | `underweight` | – |
| 18.5 – < 25 | `healthy` | – |
| 25 – < 30 | `overweight` | – |
| 30 – < 35 | `obesity` | 1 |
| 35 – < 40 | `obesity` | 2 |
| ≥ 40 | `obesity` | 3 |

**Healthy weight range** = `18.5 × m²` to `24.9 × m²`, returned in the user's weight unit.

**Output:** `bmi`, `bmiRounded`, `category`, `obesityClass`, `heightCm`, `weightKg`, `weightUnit`, `healthyWeightRange { min, max, unit }`.

**Errors:** fields `heightCm` | `heightFeet` | `heightInches` | `weight`. Codes are the shared ones plus `height-range` (on `heightFeet`, when the ft+in total is out of range).

---

## GPA Calculator

`src/calculators/gpa/` · slug `gpa-calculator` · category `education`

**Inputs:** a list of course rows `{ id, name, grade, credits }`. It starts with 3 rows; rows can be added and removed (max 30). Grades are chosen from a `<select>` built from the grading scale.

**API:** `calculateGpa(rows, scale = DEFAULT_GRADING_SCALE): GpaCalculation`, `computeGpa(entries)`, `isBlankCourseRow(row)`.

**Formula:** `GPA = Σ(grade point × credits) ÷ Σ credits`. An F counts: it adds 0 points but its credits stay in the divisor.

**Grading scale** (`src/calculators/education/grading-scales.ts`, default `bd-ugc-4`, Bangladesh UGC uniform grading, 4.00 scale):

| Letter | Point | Marks % |
| --- | --- | --- |
| A+ | 4.00 | 80–100 |
| A | 3.75 | 75–79 |
| A- | 3.50 | 70–74 |
| B+ | 3.25 | 65–69 |
| B | 3.00 | 60–64 |
| B- | 2.75 | 55–59 |
| C+ | 2.50 | 50–54 |
| C | 2.25 | 45–49 |
| D | 2.00 | 40–44 |
| F | 0.00 | 0–39 |

Scales are data. To support another one, add a `GradingScale` object to `GRADING_SCALES`. SSC/HSC is a separate calculator (below) because the 4th-subject rule makes a weighted average misleading.

**Row rules:** a row with name, grade and credits all blank is ignored. Any other row needs a grade and credits. Credits must be > 0 and ≤ 30 (decimals allowed). At least one complete course is required.

**Rounding:** sums are rounded to 10 decimals only to remove float noise. The UI shows 2 decimals, rounding half up. The page explains that some institutions truncate instead.

**Output:** `gpa`, `totalCredits`, `totalGradePoints`, `courseCount`.

**Errors:** `{ rowId, field: "grade" | "credits" | "rows", code }`. List-level codes (with `rowId: null`) are `no-courses` and `too-many`.

---

## CGPA Calculator

`src/calculators/cgpa/` · slug `cgpa-calculator` · category `education`

**Inputs:** scale maximum `4` | `5` (default 4); term rows `{ id, name, gpa, credits }`. It starts with 2 rows, max 20.

**API:** `calculateCgpa(rows, scaleMax = 4): CgpaCalculation`, `computeCgpa(entries)`, `simpleAverageGpa(gpas)` (used only to show why a plain average is wrong).

**Formula:** `CGPA = Σ(term GPA × term credits) ÷ Σ term credits`. Entering an existing CGPA and its completed credits as one row, then adding new terms, gives exactly the same result.

**Limits:** each GPA is between 0 and `scaleMax` inclusive; credits are > 0 and ≤ 60; max 20 terms. Blank rows are ignored; partly filled rows need both GPA and credits.

**Output:** `cgpa`, `totalCredits`, `termCount`. **Errors:** fields `gpa` | `credits` | `rows`; list codes `no-terms` and `too-many`.

---

## Percentage Calculator

`src/calculators/percentage/` · slug `percentage-calculator` · category `everyday`

**Inputs:** `mode`, two boxes `a` and `b` (in the order they appear in the sentence), and `direction` (`increase` | `decrease`) for one mode. The default mode is `percent-of`.

**API:** `calculatePercentage(mode, rawA, rawB, { direction })`. Helpers: `percentOf`, `whatPercent`, `percentChange`, `applyPercentage`, `wholeFromPart`.

| Mode | Sentence | Result | Rejects |
| --- | --- | --- | --- |
| `percent-of` | What is A% of B? | `A ÷ 100 × B` | – |
| `what-percent` | A is what percent of B? | `A ÷ B × 100` | B = 0 (`zero`) |
| `change` | Percentage change from A to B | `(B − A) ÷ |A| × 100` | A = 0 (`zero`) |
| `increase-decrease` | Increase/decrease A by B% | `A × (1 ± B ÷ 100)` | B < 0 (`negative`) |
| `reverse` | A is B% of what number? | `A ÷ (B ÷ 100)` | B = 0 (`zero`) |

**Rules:**
1. Decimals and negatives are accepted wherever they mean something.
2. `change` divides by `|A|`, so −50 → −25 is +50%. The sign always matches the direction of the move.
3. If `B − A` rounds to 0 at 10 decimals, the direction is `none` and the percentage is exactly 0 (this hides float noise such as 0.1 + 0.2 vs 0.3).
4. Decreasing by more than 100% returns the negative result with `decreaseOverHundred: true`.
5. Inputs must satisfy |value| ≤ 10^12. Non-finite results are rejected as `out-of-range`.
6. No rounding in logic.

**Error codes:** `missing`, `invalid`, `out-of-range`, `zero`, `negative` on field `a` or `b`.

**Output:** a union discriminated by `mode`. `change` includes `difference` and `direction`; `increase-decrease` includes `amount` (always ≥ 0) and `decreaseOverHundred`.

---

## Discount Calculator

`src/calculators/discount/` · slug `discount-calculator` · category `finance`

**Inputs:** price (৳), discount %, and an optional extra discount % (checkbox "Add an extra discount"; pass `null` when it is off).

**API:** `calculateDiscount(rawPrice, rawDiscount, rawExtraDiscount | null)`. Helpers: `applyDiscounts(price, percents)`, `combinedDiscountPercent(percents)`.

**Rules:**
1. `final = price × (1 − d ÷ 100)`.
2. The extra discount applies to the **already reduced** price: `final = price × (1 − d1/100) × (1 − d2/100)`. Order doesn't matter.
3. Effective total % = `100 − (100 − d1)(100 − d2) ÷ 100`. It is always below `d1 + d2` unless either is 0 or 100. (20% + extra 10% = 28%, not 30%.)
4. Money is handled to the paisa: the price is rounded to 2 dp first, then the first-stage and final prices are rounded. `youSave` is the difference of the rounded amounts, so the figures always add up. The effective % comes from the percentages, never from rounded amounts.
5. Limits: price ৳0.01–10^12; each discount 0–100 inclusive.

**Output:** `originalPrice`, `discountPercent`, `extraDiscountPercent | null`, `priceAfterFirstDiscount`, `finalPrice`, `youSave`, `effectivePercent`, `simpleSumPercent`.

**Display:** whole-Taka amounts are shown without paisa (`৳800`); other amounts get exactly 2 decimals (`৳849.15`). The result explains why a stacked discount isn't additive, with special messages when either discount is 0% or the first is 100%.

**Example:** ৳1,000, 20% + extra 10% → ৳800 after the first discount, final ৳720, save ৳280, 28% total.

---

## Profit and Loss Calculator

`src/calculators/profit-loss/` · slug `profit-loss-calculator` · category `finance`

**Inputs:** cost price, selling price (৳).

**API:** `calculateProfitLoss(rawCost, rawSelling)`. Helpers: `getStatus`, `percentOnCost`, `marginOnSelling`.

**Rules:**
1. Profit/loss = selling − cost.
2. Both prices are rounded to paisa first, so float noise can never decide the status.
3. Status is `profit` (selling > cost), `loss` (selling < cost) or `break-even` (exactly equal after rounding).
4. % on cost (markup) = `(selling − cost) ÷ cost × 100`. This is the standard figure; it is −100% when selling is 0.
5. Margin on selling price = `(selling − cost) ÷ selling × 100`. It is `null` when selling is 0. Margin and markup differ: cost 80, selling 100 → 25% markup, 20% margin.
6. Limits: cost ৳0.01–10^12; selling 0–10^12 (0 means given away).

**Output:** `costPrice`, `sellingPrice`, `status`, `amount` (≥ 0), `percentOnCost` (≥ 0), `marginPercent` (≥ 0 or `null`). Signs are dropped from the numbers; `status` carries the direction.

---

## EMI / Loan Calculator

`src/calculators/emi/` · slug `emi-calculator` · category `finance`

**Inputs:** `amount` (৳), `rate` with `rateUnit` `year` | `month` (default year), `tenure` with `tenureUnit` `years` | `months` (default years).

**API:** `calculateLoan(raw: EmiInputs): EmiCalculation`. Helpers: `monthlyRate`, `tenureToMonths`, `calculateEmi(P, r, n)`, `yearlySchedule(P, r, n, emi)`.

**Method:** a standard **reducing-balance** loan with equal monthly instalments, paid at the end of each month, the first one month after disbursement.

```
r   = yearly% ÷ 12 ÷ 100   (or monthly% ÷ 100)
n   = months
EMI = P · r · (1+r)^n ÷ ((1+r)^n − 1)     when r > 0
EMI = P ÷ n                               when r = 0
```

This is computed as `P·r ÷ (1 − (1+r)^−n)` using `log1p`/`expm1`, which stays accurate for tiny rates and cannot overflow.

**Totals:** total payment = unrounded EMI × n; total interest = total payment − P; principal and interest shares as % of the total.

**Yearly schedule:** rows of `{ year, instalments, principalPaid, interestPaid, remainingBalance }`. It uses a closed form (principal part of instalment k = `(EMI − P·r)(1+r)^(k−1)`) so the principal parts always sum to P. The last year may have fewer than 12 instalments, and its closing balance is exactly 0.

**Assumptions:** a yearly rate is nominal, compounded monthly (not APR/APY). **Not modelled:** fees, insurance, flat-rate loans, floating rates, grace periods, part-payments, day-count conventions, lender rounding.

**Limits:** amount > 0 and ≤ 10^12; rate 0–100%; tenure is a whole number, 1–50 years or 1–600 months.

**Output:** `amount`, `rateInput`, `rateUnit`, `monthlyRatePercent`, `months`, `emi`, `totalInterest`, `totalPayment`, `principalSharePercent`, `interestSharePercent`, `schedule`.

---

## Salary Calculator

`src/calculators/salary/` · slug `salary-calculator` · category `finance`

**Inputs:** `gross` and `period` `month` | `year` (default month); any number of deduction rows `{ id, name, type: "percent" | "fixed", value }`. It starts with no rows. Quick-add name presets (`deduction-presets.ts`): Provident fund, Income tax (TDS), Loan instalment, Other. These are names only, with no rates.

**API:** `calculateSalary(raw: SalaryInputs)`. Helpers: `deductionAmount`, `isEmptyRow`.

**Rules:**
1. A percent deduction is a percentage of **gross monthly** salary. A fixed deduction is Taka per month.
2. There are 12 equal months: monthly = yearly ÷ 12. Bonuses, overtime and mid-year changes are not included.
3. Net monthly = monthly gross − total monthly deductions.
4. **No statutory rules.** Income tax, provident fund and the like are entered by the user from their payslip.
5. A row with both name and value blank is ignored. Otherwise the value must be valid: percent 0–100, fixed 0–10^12.
6. Total deductions may equal gross (net 0) but not exceed it. This is compared in whole paisa, giving the error `{ field: "total", code: "exceeds-gross" }`.
7. No rounding in logic.

**Output:** `monthlyGross`, `monthlyDeductions`, `monthlyNet`, `annualGross`, `annualDeductions`, `annualNet`, `deductionsPercentOfGross`, `lines[] { id, name, type, value, monthlyAmount }`.

**Errors:** `{ field: "gross", code }` | `{ field: "deduction", id, code }` | `{ field: "total", code: "exceeds-gross" }`.

---

## Date Difference Calculator

`src/calculators/date-difference/` · slug `date-difference-calculator` · category `date-time`

**Inputs:** start date, end date (defaults to today), and an "include end date" checkbox.

**API:** `calculateDateDifference(start, end, { includeEndDate })`, `getDateDifference(a, b, includeEndDate)`, `countDaysExcluding(first, count, excluded = [5, 6])`.

**Rules:**
1. By default the end date is not counted (1 Jan → 2 Jan = 1 day). With `includeEndDate`, the difference is measured to the day after the end (1 Jan → 2 Jan = 2 days).
2. Years, months and days are calendar units, with month-end clamping (same as Age).
3. Reversed dates are swapped and flagged with `swapped: true`. The result is never negative.
4. "Days excluding Fridays and Saturdays" counts Sunday–Thursday days, Bangladesh's usual working week. Public holidays are **not** excluded.
5. Plain dates only.

**Output:** `start`, `end`, `swapped`, `includeEndDate`, `years`, `months`, `days`, `totalMonths`, `totalDays`, `totalWeeks`, `remainingDaysAfterWeeks`, `daysExcludingWeekend`.

**Errors:** `startDate` / `endDate`: `missing` | `invalid`.

---

## Government Job Age Calculator

`src/calculators/job-age/` · slug `government-job-age-calculator` · category `date-time` · `updatedOn` set (rules are dated)

**Inputs:** date of birth; the circular's "age as on" date (default today); preset `BCS (21–32)`, `Other government jobs (18–32)` or `Custom` (min/max whole years 0–70); optional relaxation 0–10 extra years.

**API:** `calculateJobAge(input)`, `checkJobAge(birth, ref, limits)`, `JOB_AGE_PRESETS` (sourced, dated data).

**Rules:**
1. Age is counted like the Age Calculator (complete years, months, days; 29 Feb → 28 Feb in common years).
2. `effectiveMax = max + relaxation`.
3. Eligible when completed years ≥ min **and** completed years ≤ effectiveMax. Aged 32 years 11 months counts as 32, which meets a 32 maximum; the limit is passed on the 33rd birthday.
4. `borderline` when completed years equal effectiveMax. The page warns that some circulars read the limit as "must not have turned N" and that the circular's printed date-of-birth range wins. The official convention could not be verified.
5. The eligible date-of-birth window runs from (reference − (effectiveMax+1) years) + 1 day to reference − min years. Each end is adjusted by at most one day around 29 February so the window always agrees with rule 3.

**Example:** born 20 May 1994, age counted on 1 Nov 2026, BCS → 32 y 5 m 12 d, eligible (borderline), eligible if born 2 Nov 1993 – 1 Nov 2005.

**Sources:** maximum age 32 for direct recruitment (2026 act); BCS 21–32 as on the circular date. Links are in `logic.ts`.

---

## SSC & HSC GPA Calculator

`src/calculators/ssc-hsc-gpa/` · slug `ssc-hsc-gpa-calculator` · category `education`

**Inputs:** exam SSC | HSC (only changes the default row count, 9 or 6, and labels); main-subject rows (name optional + grade), max 15; one optional 4th-subject grade.

**Board scale (`BD_BOARD_5_SCALE`):** A+ 5 (80–100), A 4 (70–79), A- 3.5 (60–69), B 3 (50–59), C 2 (40–49), D 1 (33–39), F 0 (0–32).

**Rules:**
1. Each main subject adds its grade point. Two-paper subjects count once, with the combined grade.
2. The 4th subject adds `max(0, GP − 2)` (A+ +3, A +2, A- +1.5, B +1, else 0). It is not in the divisor, and failing it does not fail the student.
3. GPA = (Σ main GP + bonus) ÷ number of main subjects entered, capped at 5.00. The divisor is never hard-coded.
4. Any main subject F → fail, GPA 0.00, failed subjects listed.
5. Also returns the GPA without the 4th subject; the widget shows the difference after rounding both to 2 dp.

**Examples:** main points 26.5 over 6 subjects + A in the 4th → (26.5 + 2) ÷ 6 = 4.75 (4.42 without). Main 29 + A+ → 32 ÷ 6 = 5.33 → shown as 5.00 (`capped`).

**Caveat:** this matches widely published board practice; no official circular was found online. The page tells students to check their board's notice.

---

## Land Area Calculator

`src/calculators/land/` · slug `land-calculator` · category `everyday`

**Modes:** `convert` (amount + unit → all units) and `measure` (shape `rectangle` | four sides | `triangle`, length unit ft / হাত 1.5 ft / গজ 3 ft / metre).

**Units in sq ft:** sq ft 1; sq m 1/0.3048²; sq yd 9; decimal (শতাংশ) 435.6; ojutangsho (অযুতাংশ) 4.356; katha 720 (editable katha size 1–10,000); bigha = 20 × katha; acre 43,560; hectare 10,000 sq m.

**Rules:** four sides ≈ average(north, south) × average(east, west), labelled approximate. Triangle uses Heron's formula; an impossible triangle gives `not-a-triangle` on the longest side. Total area is ≤ 10^12 sq ft (`area-too-large`). Katha and bigha vary by region, so the page says so and tells users to confirm with a surveyor and the deed.

---

## Taka Amount in Words

`src/calculators/amount-in-words/` · slug `amount-in-words` · category `finance`

**Input:** a Taka amount from 0 to ৳9,99,99,99,99,999.99, with at most 2 decimals (`too-many-decimals`; trailing zeros are fine). Paisa is parsed from the string, never by float multiplication.

**Output:**
- English, Indian system: "One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only".
- English, international system (million).
- Bangla: "এক লক্ষ পঁচিশ হাজার তিনশত টাকা পঞ্চাশ পয়সা মাত্র". Words for 0–99 come from `BANGLA_NUMBERS_0_99` (tested); hundreds use শত; লক্ষ/কোটি; crore counts are worded recursively.
- Grouped digits in both scripts ("1,25,300.50" / "১,২৫,৩০০.৫০").

Each line has its own copy button.

---

## VAT Calculator

`src/calculators/vat/` · slug `vat-calculator` · category `finance` · `updatedOn` set (rates are dated)

**Inputs:** mode `add` (price excluding VAT → including) or `remove` (price including VAT → net + VAT inside); rate preset (Standard 15%, Reduced 10% / 7.5% / 5% for some goods and services, or Custom 0–100); amount ৳0.01–10^12.

**API:** `calculateVat(mode, rawAmount, rawRate)`, `vatOnNet`, `vatInGross`; data `VAT_RATE_PRESETS`, `VAT_RATE_SOURCES`, `VAT_RATES_CHECKED_ON`.

**Rules:**
- Add: VAT = net × r ÷ 100.
- Remove: VAT = gross × r ÷ (100 + r).
- Money is rounded to paisa (half away from zero) so that net + VAT = gross exactly.
- Supplementary duty, advance tax, VAT deducted at source and tariff values are **not** modelled.
- The result warns about the common mistake of taking r% of the gross: 15% of ৳1,150 is ৳172.50, but the VAT inside is ৳150.

**Examples:**
- ৳1,000 + 15% = ৳1,150.
- ৳1,150 including 15% → ৳1,000 + ৳150.
- ৳2,499.50 + 15% → VAT ৳374.93, total ৳2,874.43.
- ৳1,000 including 15% → ৳869.57 + ৳130.43.

**Sources (checked 28 Oct 2026):** NBR VAT FAQ (standard rate 15%); PwC Worldwide Tax Summaries, Bangladesh (reduced rates for specific goods and services). Review after each budget.

---

## Bangla Date Converter

`src/calculators/bangla-date/` · slug `bangla-date-converter` · category `date-time` · `updatedOn` set

**Modes:**
- Gregorian → Bangla (default; the date defaults to today).
- Bangla → Gregorian (year, month, day).

"Today's Bangla date" shows above the form after hydration.

**Rules (revised Bangladesh calendar, 2019):**
- 1 Boishakh = 14 April every year.
- Boishakh–Ashwin have 31 days each; Kartik–Magh and Chaitra have 30; Falgun has 29, or 30 when it contains 29 February (full Gregorian leap rule).
- Bangabda = Gregorian year − 593 from 14 April, otherwise − 594.
- Seasons: two months each, starting with গ্রীষ্ম.
- Valid range: Bangabda 1–8000.
- This calendar can differ from West Bengal's traditional calendar.

**Anchors (tested):**

| Gregorian | Bangla |
| --- | --- |
| 21 Feb | 8 Falgun |
| 26 Mar | 12 Chaitra |
| 16 Dec | 1 Poush |
| 28 Oct 2026 | 12 Kartik 1433 |
| 29 Feb 2028 | 16 Falgun 1434 |

Every day from 2020 to 2030 round-trips.

**Digits:** the main result uses Bangla digits ("১২ কার্তিক ১৪৩৩ বঙ্গাব্দ"), a documented exception; a Western-digit form is shown too.

**Sources:** Dhaka Tribune (22 Oct 2019, Bangla Academy on the revision) and The Daily Star (Feb 2020, fixed national-day dates). Links are in `logic.ts`.

---

## Sanchayapatra Profit Calculator

`src/calculators/sanchayapatra/` · slug `sanchayapatra-calculator` · category `finance` · `updatedOn` set

**Schemes:** 5-year Bangladesh (profit at maturity), 3-month profit-bearing (quarterly, 3 years), Paribar (monthly, 5 years) and Pensioner (monthly, 5 years). The scheme choice is remembered; the default is Paribar.

**Rates:** from IRD order 08.00.0000.000.041.22.0006.20.85 (effective 1 July 2025), confirmed unchanged for July–December 2026 (NSD scheme sheets; Bangla Tribune, 2 Jul 2026).
- Two tiers by the investor's total national-savings holding: up to ৳7.5 lakh, and above.
- The figure used is the rate held to maturity. The rate field is pre-filled and editable, with a "Use the official rate" link.

**Source tax:**
- Pre-filled at 10% (Income Tax Act 2023, s.105), editable.
- The 5% (up to ৳5 lakh) and Pensioner 0% figures conflict across FY2026-27 reports, so they are shown as information, not presets.

**Logic:** simple profit, not compounded, per payout period. Totals over the term: gross profit, tax, net, and amount received. Purchase limits are shown as information only.

**Example:** Paribar ৳1,00,000 at 11.93%, 10% tax → ৳994.17 a month gross, ৳894.75 net; ৳59,650 gross and ৳53,685 net over 5 years.

**Review:** every January and July, when the rates are reset.

---

## FDR Calculator

`src/calculators/fdr/` · slug `fdr-calculator` · category `finance`

**Inputs:**
- Principal and the rate the bank quotes (no rate presets, because banks differ).
- Term in months, with presets 3/6/12/24/36.
- Interest: simple (the default) or reinvested monthly/quarterly/yearly.
- Tax: 10%, or 15% for someone who must file a return but gives the bank no proof of return (Income Tax Act 2023 s.102/142), or another rate.
- Excise duty: estimate from the bands, enter a total, or leave out.

**Formulas:**
- Simple: P × (1 + r·months/12).
- Reinvested every p months: P × (1 + r·p/12)^⌊n/p⌋ × (1 + r·(n mod p)/12).
- Excise is charged once a year on the year-end balance, using the FY2026-27 bands in `fdr/deposit-tax.ts` (nil up to ৳4 lakh, then ৳150 / 500 / 3,000 / 5,000 / 10,000 / 20,000 / 50,000).

**Examples:**
- ৳1,00,000 at 9% for 12 months, simple, 10% tax → net ৳1,08,100.
- ৳5,00,000 at 10% for 36 months, quarterly → maturity ৳6,72,444.

## DPS Calculator

`src/calculators/dps/` · slug `dps-calculator` · category `finance`

**Inputs:** the monthly instalment, rate, tenure in years, compounding (monthly by default; quarterly or yearly simulated), and the same tax and excise options as FDR.

**Method:** an annuity-due. Each instalment is paid at the start of the month and the scheme matures one month after the last. M = A × ((1+i)^n − 1)/i × (1+i), where i = R/1200. A yearly breakdown table is shown.

**Example:** ৳5,000 a month at 9% for 5 years → maturity ৳3,79,949, interest ৳79,949, net ৳3,71,954.

## bKash & Nagad Cash Out Charge Calculator

`src/calculators/mfs-charge/` · slug `mfs-cash-out-charge-calculator` · category `finance` · `updatedOn` set

**Modes:**
- "Cash I want": charge = amount × rate ÷ 1000.
- "My balance": cash = balance ÷ (1 + rate/1000).

**Presets (৳ per ৳1,000, checked 28 Oct 2026, from the providers' own pages):**

| Provider and channel | Rate |
| --- | --- |
| bKash Priyo Agent (up to ৳50,000 a month) | 13.95 |
| bKash other agent | 18.50 |
| Nagad USSD / Islamic app | 15.00 |
| Rocket agent | 16.70 |
| Rocket DBBL ATM / branch | 9.00 |
| Upay agent | 14.00 |
| Upay UCB ATM | 8.00 |

Where a provider's own pages disagree (Nagad's regular app, bKash ATM), there is no preset and the user enters the rate. Amounts are rounded to 2 decimals; app charges may differ by a few paisa.

**Example:** ৳10,000 balance at 18.50 → ৳9,818.36 cash + ৳181.64 charge.

**Review:** quarterly.

---

## Per-calculator metadata (registry)

The original 10 have `addedOn: "2026-10-05"`; the 10 added since have `"2026-10-28"`. Related links:

| Slug | `related` |
| --- | --- |
| age-calculator | government-job-age-calculator, date-difference-calculator, bmi-calculator |
| bmi-calculator | age-calculator |
| gpa-calculator | cgpa-calculator, ssc-hsc-gpa-calculator, percentage-calculator |
| cgpa-calculator | gpa-calculator, percentage-calculator |
| percentage-calculator | discount-calculator, profit-loss-calculator, gpa-calculator |
| discount-calculator | percentage-calculator, profit-loss-calculator |
| profit-loss-calculator | discount-calculator, percentage-calculator |
| emi-calculator | salary-calculator, fdr-calculator, sanchayapatra-calculator, percentage-calculator |
| salary-calculator | emi-calculator, dps-calculator, sanchayapatra-calculator, percentage-calculator |
| date-difference-calculator | age-calculator |
| government-job-age-calculator | age-calculator, date-difference-calculator |
| ssc-hsc-gpa-calculator | gpa-calculator, cgpa-calculator |
| land-calculator | percentage-calculator |
| amount-in-words | discount-calculator, salary-calculator |
| vat-calculator | discount-calculator, profit-loss-calculator, percentage-calculator |
| bangla-date-converter | date-difference-calculator, age-calculator |
| sanchayapatra-calculator | fdr-calculator, dps-calculator, emi-calculator |
| fdr-calculator / dps-calculator | each other, sanchayapatra-calculator, emi-calculator |
| mfs-cash-out-charge-calculator | vat-calculator, percentage-calculator, amount-in-words |

Featured (home "Try:" chips and search suggestions), in order: age, bmi, gpa, emi, percentage, salary.

Each calculator has 8–12 FAQs in both `faqs` and `faqsBn`.
