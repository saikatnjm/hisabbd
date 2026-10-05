"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { formatPercent, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { calculateDiscount, MAX_PRICE, type DiscountError, type DiscountField, type DiscountResult } from "./logic";

const FIELD_IDS: Record<DiscountField, string> = {
  price: "discount-price",
  discount: "discount-percent",
  extraDiscount: "discount-extra-percent",
};

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

function percent(value: number): string {
  return formatPercent(value, { decimals: 2 });
}

function errorMessage(error: DiscountError): string {
  switch (error.field) {
    case "price":
      return numberErrorMessage(error.code, {
        label: "original price",
        min: "at least ৳0.01",
        max: `${formatTaka(MAX_PRICE)} or less`,
      });
    case "discount":
      return numberErrorMessage(error.code, { label: "discount", min: "0% or more", max: "100% or less" });
    case "extraDiscount":
      return numberErrorMessage(error.code, { label: "extra discount", min: "0% or more", max: "100% or less" });
  }
}

function shareText(r: DiscountResult): string {
  const discounts =
    r.extraDiscountPercent === null
      ? `${percent(r.discountPercent)} off`
      : `${percent(r.discountPercent)} off, then an extra ${percent(r.extraDiscountPercent)} off`;
  return (
    `${money(r.originalPrice)} with ${discounts}: pay ${money(r.finalPrice)}, save ${money(r.youSave)} ` +
    `(${percent(r.effectivePercent)} in total). Calculated with HisabBD’s Discount Calculator.`
  );
}

export function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [extraOn, setExtraOn] = useState(false);
  const [extraDiscount, setExtraDiscount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<DiscountField, React.RefObject<HTMLInputElement | null>> = {
    price: useRef<HTMLInputElement>(null),
    discount: useRef<HTMLInputElement>(null),
    extraDiscount: useRef<HTMLInputElement>(null),
  };

  const rawExtra = extraOn ? extraDiscount : null;
  const calc = submitted ? calculateDiscount(price, discount, rawExtra) : null;
  const errorFor = (field: DiscountField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateDiscount(price, discount, rawExtra);
    if (check.ok) {
      setRevealCount((n) => n + 1);
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onReset() {
    setPrice("");
    setDiscount("");
    setExtraOn(false);
    setExtraDiscount("");
    setSubmitted(false);
    setRevealCount(0);
    refs.price.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate discount">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.price} label="Original price" error={errorFor("price")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.price}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder="e.g. 2,500"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.discount} label="Discount" error={errorFor("discount")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.discount}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix="%"
                placeholder="e.g. 20"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
              />
            )}
          </FormField>
        </div>

        <div className="mt-4">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-base font-medium text-slate-800">
            <input
              type="checkbox"
              checked={extraOn}
              onChange={(event) => setExtraOn(event.target.checked)}
              className="size-5 accent-brand-600"
            />
            Add an extra discount
          </label>
          {extraOn && (
            <div className="mt-2 sm:max-w-[calc(50%-0.625rem)]">
              <FormField
                id={FIELD_IDS.extraDiscount}
                label="Extra discount"
                hint="Taken off the price after the first discount, like “extra 10% off”."
                error={errorFor("extraDiscount")}
              >
                {(control) => (
                  <AffixInput
                    {...control}
                    ref={refs.extraDiscount}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    suffix="%"
                    placeholder="e.g. 10"
                    value={extraDiscount}
                    onChange={(event) => setExtraDiscount(event.target.value)}
                  />
                )}
              </FormField>
            </div>
          )}
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? `Final price ${money(result.finalPrice)}. You save ${money(result.youSave)}.` : ""}
        result={result && <DiscountResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "Your final price will appear here"}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc
              ? "Fix the highlighted fields above and the final price will show here."
              : "Enter the price and the discount, then select Calculate discount."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function StackedExplanation({ result: r }: { result: DiscountResult }) {
  if (r.extraDiscountPercent === null) return null;
  const extra = r.extraDiscountPercent;

  if (r.priceAfterFirstDiscount === 0) {
    return (
      <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">
        The first discount already makes the price {money(0)}, so the extra discount has nothing left to take off.
      </p>
    );
  }
  if (Math.abs(r.simpleSumPercent - r.effectivePercent) < 1e-9) {
    return (
      <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">
        {r.discountPercent === 0
          ? "The first discount is 0%, so the extra discount is the only one that counts."
          : "The extra discount is 0%, so it changes nothing."}
      </p>
    );
  }
  return (
    <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">
      <strong>
        {percent(r.discountPercent)} then {percent(extra)} is {percent(r.effectivePercent)} in total, not{" "}
        {percent(r.simpleSumPercent)}.
      </strong>{" "}
      The extra {percent(extra)} comes off the reduced price of {money(r.priceAfterFirstDiscount)}, not off the
      original {money(r.originalPrice)}.
    </p>
  );
}

function DiscountResultView({ result: r }: { result: DiscountResult }) {
  const stats = [
    { label: "You save", value: money(r.youSave) },
    { label: "Total discount", value: percent(r.effectivePercent) },
    { label: "Original price", value: money(r.originalPrice) },
    ...(r.extraDiscountPercent === null
      ? []
      : [{ label: `After the first ${percent(r.discountPercent)}`, value: money(r.priceAfterFirstDiscount) }]),
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title="Final price after discount"
        titleId="discount-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{money(r.finalPrice)}</p>}
      >
        <StackedExplanation result={r} />
        <ResultStats items={stats} className="mt-5" />
        <p className="mt-4 text-sm text-slate-600">Amounts are rounded to the nearest paisa.</p>
      </ResultPanel>

      <ResultActions key={shareText(r)} text={shareText(r)} shareTitle="Discount calculated with HisabBD" />
    </div>
  );
}
