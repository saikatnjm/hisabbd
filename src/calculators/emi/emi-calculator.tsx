"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { formatPercent, formatTaka, pluralize } from "@/lib/format";
import {
  calculateLoan,
  MAX_LOAN,
  MAX_TENURE_MONTHS,
  MAX_TENURE_YEARS,
  type EmiError,
  type EmiField,
  type EmiResult,
  type RateUnit,
  type TenureUnit,
} from "./logic";

const FIELD_IDS: Record<EmiField, string> = {
  amount: "emi-amount",
  rate: "emi-rate",
  tenure: "emi-tenure",
};

const RATE_UNITS: readonly { value: RateUnit; label: string }[] = [
  { value: "year", label: "per year" },
  { value: "month", label: "per month" },
];

const TENURE_UNITS: readonly { value: TenureUnit; label: string }[] = [
  { value: "years", label: "years" },
  { value: "months", label: "months" },
];

function percent(value: number): string {
  return formatPercent(value, { decimals: 1 });
}

function rateText(r: EmiResult): string {
  return `${formatPercent(r.rateInput, { decimals: 4 })} ${r.rateUnit === "year" ? "per year" : "per month"}`;
}

function tenureText(months: number): string {
  if (months % 12 === 0) return pluralize(months / 12, "year");
  return pluralize(months, "month");
}

function errorMessage(error: EmiError, tenureUnit: TenureUnit): string {
  switch (error.field) {
    case "amount":
      return numberErrorMessage(error.code, {
        label: "loan amount",
        min: "more than ৳0",
        max: `${formatTaka(MAX_LOAN)} or less`,
      });
    case "rate":
      return numberErrorMessage(error.code, { label: "interest rate", min: "0% or more", max: "100% or less" });
    case "tenure":
      return numberErrorMessage(error.code, {
        label: "loan tenure",
        min: tenureUnit === "years" ? "at least 1 year" : "at least 1 month",
        max:
          tenureUnit === "years"
            ? `${MAX_TENURE_YEARS} years or less`
            : `${MAX_TENURE_MONTHS} months (${MAX_TENURE_YEARS} years) or less`,
      });
  }
}

function shareText(r: EmiResult): string {
  return (
    `Loan of ${formatTaka(r.amount)} at ${rateText(r)} for ${tenureText(r.months)}: ` +
    `monthly EMI about ${formatTaka(r.emi)}, total interest ${formatTaka(r.totalInterest)}, ` +
    `total payment ${formatTaka(r.totalPayment)} (reducing-balance method). Calculated with HisabBD’s EMI Calculator.`
  );
}

export function EmiCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [rateUnit, setRateUnit] = useState<RateUnit>("year");
  const [tenure, setTenure] = useState("");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<EmiField, React.RefObject<HTMLInputElement | null>> = {
    amount: useRef<HTMLInputElement>(null),
    rate: useRef<HTMLInputElement>(null),
    tenure: useRef<HTMLInputElement>(null),
  };

  const inputs = { amount, rate, rateUnit, tenure, tenureUnit };
  const calc = submitted ? calculateLoan(inputs) : null;
  const errorFor = (field: EmiField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(error, tenureUnit) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateLoan(inputs);
    if (check.ok) {
      setRevealCount((n) => n + 1);
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onReset() {
    setAmount("");
    setRate("");
    setRateUnit("year");
    setTenure("");
    setTenureUnit("years");
    setSubmitted(false);
    setRevealCount(0);
    refs.amount.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate EMI">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2 sm:max-w-[calc(50%-0.75rem)]">
            <FormField id={FIELD_IDS.amount} label="Loan amount" error={errorFor("amount")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.amount}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  prefix="৳"
                  placeholder="e.g. 5,00,000"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              )}
            </FormField>
          </div>

          <div className="space-y-4">
            <SegmentedControl
              name="emi-rate-unit"
              legend="Interest rate is"
              options={RATE_UNITS}
              value={rateUnit}
              onChange={setRateUnit}
            />
            <FormField id={FIELD_IDS.rate} label="Interest rate" error={errorFor("rate")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.rate}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix="%"
                  placeholder="e.g. 9"
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                />
              )}
            </FormField>
          </div>

          <div className="space-y-4">
            <SegmentedControl
              name="emi-tenure-unit"
              legend="Tenure is in"
              options={TENURE_UNITS}
              value={tenureUnit}
              onChange={setTenureUnit}
            />
            <FormField
              id={FIELD_IDS.tenure}
              label="Loan tenure"
              hint="A whole number."
              error={errorFor("tenure")}
            >
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.tenure}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  suffix={tenureUnit}
                  placeholder={tenureUnit === "years" ? "e.g. 5" : "e.g. 60"}
                  value={tenure}
                  onChange={(event) => setTenure(event.target.value)}
                />
              )}
            </FormField>
          </div>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={
          result
            ? `Monthly EMI ${formatTaka(result.emi)}. Total interest ${formatTaka(result.totalInterest)}.`
            : ""
        }
        result={result && <EmiResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "Your monthly EMI will appear here"}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc
              ? "Fix the highlighted fields above and your EMI will show here."
              : "Enter the loan amount, interest rate and tenure, then select Calculate EMI."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function EmiResultView({ result: r }: { result: EmiResult }) {
  const stats = [
    { label: "Total interest", value: formatTaka(r.totalInterest) },
    { label: "Total payment", value: formatTaka(r.totalPayment) },
    { label: "Loan amount", value: formatTaka(r.amount) },
    { label: "Number of instalments", value: `${r.months} (${tenureText(r.months)})` },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title="Monthly EMI"
        titleId="emi-result-heading"
        value={
          <>
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {formatTaka(r.emi)}
            </p>
            <p className="mt-1 text-sm text-slate-600">per month, rounded to the nearest Taka</p>
          </>
        }
      >
        <ResultStats items={stats} />

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-800">Where your total payment goes</p>
          <div aria-hidden="true" className="mt-2 flex h-4 overflow-hidden rounded-full bg-slate-200">
            <div className="bg-brand-600" style={{ width: `${r.principalSharePercent}%` }} />
            <div className="bg-amber-500" style={{ width: `${r.interestSharePercent}%` }} />
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
            <li>
              <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-sm bg-brand-600" />
              Principal: <strong>{percent(r.principalSharePercent)}</strong>
            </li>
            <li>
              <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-sm bg-amber-500" />
              Interest: <strong>{percent(r.interestSharePercent)}</strong>
            </li>
          </ul>
        </div>

        <details className="mt-5 rounded-xl bg-white/70 px-4 py-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-slate-900">
            See year-by-year breakdown
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-right text-sm">
              <caption className="sr-only">Principal paid, interest paid and remaining balance for each loan year</caption>
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th scope="col" className="py-2 pr-3 text-left font-medium">Year</th>
                  <th scope="col" className="px-3 py-2 font-medium">Principal paid</th>
                  <th scope="col" className="px-3 py-2 font-medium">Interest paid</th>
                  <th scope="col" className="py-2 pl-3 font-medium">Remaining balance</th>
                </tr>
              </thead>
              <tbody>
                {r.schedule.map((row) => (
                  <tr key={row.year} className="border-b border-slate-200 last:border-0">
                    <th scope="row" className="py-2 pr-3 text-left font-medium text-slate-900">
                      {row.year}
                      {row.instalments < 12 && (
                        <span className="block text-xs font-normal text-slate-600">
                          {pluralize(row.instalments, "instalment")}
                        </span>
                      )}
                    </th>
                    <td className="px-3 py-2">{formatTaka(row.principalPaid)}</td>
                    <td className="px-3 py-2">{formatTaka(row.interestPaid)}</td>
                    <td className="py-2 pl-3">{formatTaka(row.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Whole Taka. Rounded figures in a row may differ from their sum by ৳1.
          </p>
        </details>

        <p className="mt-4 text-sm text-slate-600">
          Standard reducing-balance method with {r.months} equal monthly instalments. Actual bank EMIs can differ
          because of fees, insurance, rounding or rate type.
        </p>
      </ResultPanel>

      <ResultActions key={shareText(r)} text={shareText(r)} shareTitle="EMI calculated with HisabBD" />
    </div>
  );
}
