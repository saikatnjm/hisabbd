"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField } from "@/components/ui/form";
import { TrendingIcon } from "@/components/ui/icons";
import { ResultPanel } from "@/components/ui/result";
import { formatPercent, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import {
  calculateProfitLoss,
  MAX_PRICE,
  type ProfitLossError,
  type ProfitLossField,
  type ProfitLossResult,
  type ProfitLossStatus,
} from "./logic";

const FIELD_IDS: Record<ProfitLossField, string> = {
  cost: "profit-loss-cost",
  selling: "profit-loss-selling",
};

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

function percent(value: number): string {
  return formatPercent(value, { decimals: 2 });
}

const STATUS_LABEL: Record<ProfitLossStatus, string> = {
  profit: "Profit",
  loss: "Loss",
  "break-even": "Break-even",
};

function errorMessage(error: ProfitLossError): string {
  const max = `${formatTaka(MAX_PRICE)} or less`;
  return error.field === "cost"
    ? numberErrorMessage(error.code, { label: "cost price", min: "at least ৳0.01", max })
    : numberErrorMessage(error.code, { label: "selling price", min: "৳0 or more", max });
}

/** Decorative; the status is always also written in words next to it. */
function StatusIcon({ status }: { status: ProfitLossStatus }) {
  if (status === "profit") return <TrendingIcon className="size-8" />;
  if (status === "loss") return <TrendingIcon className="size-8 -scale-y-100" />;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className="size-8"
    >
      <path d="M5 9h14M5 15h14" />
    </svg>
  );
}

function summary(r: ProfitLossResult): string {
  if (r.status === "break-even") return "Break-even: no profit and no loss.";
  return `${STATUS_LABEL[r.status]} of ${money(r.amount)} (${percent(r.percentOnCost)} of the cost price).`;
}

function shareText(r: ProfitLossResult): string {
  const margin =
    r.marginPercent === null ? "" : ` ${r.status === "loss" ? "Loss" : "Profit"} margin on selling price: ${percent(r.marginPercent)}.`;
  return (
    `Cost ${money(r.costPrice)}, selling price ${money(r.sellingPrice)}: ${summary(r)}${margin} ` +
    `Calculated with HisabBD’s Profit and Loss Calculator.`
  );
}

export function ProfitLossCalculator() {
  const [cost, setCost] = useState("");
  const [selling, setSelling] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<ProfitLossField, React.RefObject<HTMLInputElement | null>> = {
    cost: useRef<HTMLInputElement>(null),
    selling: useRef<HTMLInputElement>(null),
  };

  const calc = submitted ? calculateProfitLoss(cost, selling) : null;
  const errorFor = (field: ProfitLossField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateProfitLoss(cost, selling);
    if (check.ok) {
      setRevealCount((n) => n + 1);
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onReset() {
    setCost("");
    setSelling("");
    setSubmitted(false);
    setRevealCount(0);
    refs.cost.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate profit or loss">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.cost} label="Cost price" error={errorFor("cost")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.cost}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder="e.g. 800"
                value={cost}
                onChange={(event) => setCost(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.selling} label="Selling price" error={errorFor("selling")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.selling}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder="e.g. 1,000"
                value={selling}
                onChange={(event) => setSelling(event.target.value)}
              />
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? summary(result) : ""}
        result={result && <ProfitLossResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "Your profit or loss will appear here"}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc
              ? "Fix the highlighted fields above and the result will show here."
              : "Enter the cost price and the selling price, then select Calculate profit or loss."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function ProfitLossResultView({ result: r }: { result: ProfitLossResult }) {
  const isBreakEven = r.status === "break-even";
  const noun = r.status === "loss" ? "Loss" : "Profit";
  const stats = isBreakEven
    ? [
        { label: "Cost price", value: money(r.costPrice) },
        { label: "Selling price", value: money(r.sellingPrice) },
      ]
    : [
        { label: `${noun} % on cost price`, value: percent(r.percentOnCost) },
        {
          label: `${noun} margin on selling price`,
          value: r.marginPercent === null ? "Not defined when the selling price is ৳0" : percent(r.marginPercent),
        },
        { label: "Cost price", value: money(r.costPrice) },
        { label: "Selling price", value: money(r.sellingPrice) },
      ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title="Result"
        titleId="profit-loss-result-heading"
        value={
          <div>
            <p className="flex items-center gap-2 font-display text-2xl font-bold text-brand-800">
              <StatusIcon status={r.status} />
              <span>{STATUS_LABEL[r.status]}</span>
            </p>
            <p className="mt-1 font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {money(r.amount)}
            </p>
          </div>
        }
      >
        {isBreakEven && (
          <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">
            The selling price equals the cost price, so there is no profit and no loss.
          </p>
        )}
        <ResultStats items={stats} className={isBreakEven ? "mt-5" : undefined} />
        {!isBreakEven && (
          <p className="mt-4 text-sm text-slate-600">
            The percentage on cost (also called markup) divides by the cost price. The margin divides by the selling
            price, so it is a different number for the same deal.
          </p>
        )}
        <p className="mt-3 text-sm text-slate-600">Prices are rounded to the nearest paisa.</p>
      </ResultPanel>

      <ResultActions key={shareText(r)} text={shareText(r)} shareTitle="Profit or loss calculated with HisabBD" />
    </div>
  );
}
