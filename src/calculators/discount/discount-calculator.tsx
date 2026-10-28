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
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
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

const STRINGS = {
  en: {
    submit: "Calculate discount",
    originalPrice: "Original price",
    discount: "Discount",
    extraToggle: "Add an extra discount",
    extraLabel: "Extra discount",
    extraHint: "Taken off the price after the first discount, like “extra 10% off”.",
    pricePlaceholder: "e.g. 2,500",
    discountPlaceholder: "e.g. 20",
    extraPlaceholder: "e.g. 10",
    announcement: (final: string, save: string) => `Final price ${final}. You save ${save}.`,
    placeholderTitleFirst: "Your final price will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the price and the discount, then select Calculate discount.",
    placeholderFix: "Fix the highlighted fields above and the final price will show here.",
    resultTitle: "Final price after discount",
    youSave: "You save",
    totalDiscount: "Total discount",
    statOriginalPrice: "Original price",
    afterFirst: (p: string) => `After the first ${p}`,
    paisaNote: "Amounts are rounded to the nearest paisa.",
    stackedZero: (zero: string) =>
      `The first discount already makes the price ${zero}, so the extra discount has nothing left to take off.`,
    stackedFirstZero: "The first discount is 0%, so the extra discount is the only one that counts.",
    stackedExtraZero: "The extra discount is 0%, so it changes nothing.",
    stackedMain: (p1: string, p2: string, eff: string, sum: string) =>
      `${p1} then ${p2} is ${eff} in total, not ${sum}.`,
    stackedDetail: (p2: string, reduced: string, original: string) =>
      `The extra ${p2} comes off the reduced price of ${reduced}, not off the original ${original}.`,
    errPriceLabel: "original price",
    errPriceMin: "at least ৳0.01",
    errPriceMax: (max: string) => `${max} or less`,
    errDiscountLabel: "discount",
    errExtraLabel: "extra discount",
    errPercentMin: "0% or more",
    errPercentMax: "100% or less",
    shareTitle: "Discount calculated with HisabBD",
    shareText: (original: string, discounts: string, final: string, save: string, eff: string) =>
      `${original} with ${discounts}: pay ${final}, save ${save} (${eff} in total). Calculated with HisabBD’s Discount Calculator.`,
    shareOneDiscount: (p: string) => `${p} off`,
    shareTwoDiscounts: (p1: string, p2: string) => `${p1} off, then an extra ${p2} off`,
  },
  bn: {
    submit: "ডিসকাউন্ট হিসাব করুন",
    originalPrice: "আসল দাম",
    discount: "ডিসকাউন্ট",
    extraToggle: "অতিরিক্ত ছাড় যোগ করুন",
    extraLabel: "অতিরিক্ত ছাড়",
    extraHint: "প্রথম ছাড়ের পরের দামের ওপর ধরা হয়, যেমন “আরও 10% ছাড়”।",
    pricePlaceholder: "যেমন 2,500",
    discountPlaceholder: "যেমন 20",
    extraPlaceholder: "যেমন 10",
    announcement: (final: string, save: string) => `চূড়ান্ত দাম ${final}। আপনার সাশ্রয় ${save}।`,
    placeholderTitleFirst: "চূড়ান্ত দাম এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "দাম আর ডিসকাউন্ট লিখে “ডিসকাউন্ট হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই চূড়ান্ত দাম এখানে দেখা যাবে।",
    resultTitle: "ছাড়ের পর চূড়ান্ত দাম",
    youSave: "আপনার সাশ্রয়",
    totalDiscount: "মোট ছাড়",
    statOriginalPrice: "আসল দাম",
    afterFirst: (p: string) => `প্রথম ${p} ছাড়ের পর`,
    paisaNote: "অঙ্কগুলো নিকটতম পয়সায় রাউন্ড করা।",
    stackedZero: (zero: string) =>
      `প্রথম ছাড়েই দাম ${zero} হয়ে যায়, তাই অতিরিক্ত ছাড়ের আর কিছু কমানোর থাকে না।`,
    stackedFirstZero: "প্রথম ছাড় 0%, তাই শুধু অতিরিক্ত ছাড়টাই কাজ করে।",
    stackedExtraZero: "অতিরিক্ত ছাড় 0%, তাই কিছুই বদলায় না।",
    stackedMain: (p1: string, p2: string, eff: string, sum: string) =>
      `${p1} তারপর ${p2} মিলিয়ে মোট ${eff}, ${sum} নয়।`,
    stackedDetail: (p2: string, reduced: string, original: string) =>
      `অতিরিক্ত ${p2} ধরা হয় কমে আসা ${reduced} দামের ওপর, আসল ${original}-এর ওপর নয়।`,
    errPriceLabel: "আসল দাম",
    errPriceMin: "কমপক্ষে ৳0.01",
    errPriceMax: (max: string) => `${max} বা তার কম`,
    errDiscountLabel: "ডিসকাউন্ট",
    errExtraLabel: "অতিরিক্ত ছাড়",
    errPercentMin: "0% বা তার বেশি",
    errPercentMax: "100% বা তার কম",
    shareTitle: "HisabBD দিয়ে ডিসকাউন্ট হিসাব",
    shareText: (original: string, discounts: string, final: string, save: string, eff: string) =>
      `${original} দামে ${discounts}: দিতে হবে ${final}, সাশ্রয় ${save} (মোট ${eff})। HisabBD-র ডিসকাউন্ট ক্যালকুলেটরে হিসাব করা।`,
    shareOneDiscount: (p: string) => `${p} ছাড়`,
    shareTwoDiscounts: (p1: string, p2: string) => `${p1} ছাড়, তারপর আরও ${p2} ছাড়`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: DiscountError): string {
  switch (error.field) {
    case "price":
      return numberErrorMessage(
        error.code,
        { label: t.errPriceLabel, min: t.errPriceMin, max: t.errPriceMax(formatTaka(MAX_PRICE)) },
        locale,
      );
    case "discount":
      return numberErrorMessage(
        error.code,
        { label: t.errDiscountLabel, min: t.errPercentMin, max: t.errPercentMax },
        locale,
      );
    case "extraDiscount":
      return numberErrorMessage(
        error.code,
        { label: t.errExtraLabel, min: t.errPercentMin, max: t.errPercentMax },
        locale,
      );
  }
}

function shareText(t: Strings, r: DiscountResult): string {
  const discounts =
    r.extraDiscountPercent === null
      ? t.shareOneDiscount(percent(r.discountPercent))
      : t.shareTwoDiscounts(percent(r.discountPercent), percent(r.extraDiscountPercent));
  return t.shareText(money(r.originalPrice), discounts, money(r.finalPrice), money(r.youSave), percent(r.effectivePercent));
}

export function DiscountCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
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
    return error ? errorMessage(t, locale, error) : undefined;
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
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.price} label={t.originalPrice} error={errorFor("price")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.price}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.pricePlaceholder}
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={FIELD_IDS.discount} label={t.discount} error={errorFor("discount")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.discount}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix="%"
                placeholder={t.discountPlaceholder}
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
            {t.extraToggle}
          </label>
          {extraOn && (
            <div className="mt-2 sm:max-w-[calc(50%-0.625rem)]">
              <FormField
                id={FIELD_IDS.extraDiscount}
                label={t.extraLabel}
                hint={t.extraHint}
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
                    placeholder={t.extraPlaceholder}
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
        announcement={result ? t.announcement(money(result.finalPrice), money(result.youSave)) : ""}
        result={result && <DiscountResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function StackedExplanation({ result: r }: { result: DiscountResult }) {
  const t = STRINGS[useLocale()];
  if (r.extraDiscountPercent === null) return null;
  const extra = r.extraDiscountPercent;

  if (r.priceAfterFirstDiscount === 0) {
    return <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">{t.stackedZero(money(0))}</p>;
  }
  if (Math.abs(r.simpleSumPercent - r.effectivePercent) < 1e-9) {
    return (
      <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">
        {r.discountPercent === 0 ? t.stackedFirstZero : t.stackedExtraZero}
      </p>
    );
  }
  return (
    <p className="rounded-xl bg-white/70 px-4 py-3 text-slate-800">
      <strong>
        {t.stackedMain(percent(r.discountPercent), percent(extra), percent(r.effectivePercent), percent(r.simpleSumPercent))}
      </strong>{" "}
      {t.stackedDetail(percent(extra), money(r.priceAfterFirstDiscount), money(r.originalPrice))}
    </p>
  );
}

function DiscountResultView({ result: r }: { result: DiscountResult }) {
  const t = STRINGS[useLocale()];
  const stats = [
    { label: t.youSave, value: money(r.youSave) },
    { label: t.totalDiscount, value: percent(r.effectivePercent) },
    { label: t.statOriginalPrice, value: money(r.originalPrice) },
    ...(r.extraDiscountPercent === null
      ? []
      : [{ label: t.afterFirst(percent(r.discountPercent)), value: money(r.priceAfterFirstDiscount) }]),
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="discount-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{money(r.finalPrice)}</p>}
      >
        <StackedExplanation result={r} />
        <ResultStats items={stats} className="mt-5" />
        <p className="mt-4 text-sm text-slate-600">{t.paisaNote}</p>
      </ResultPanel>

      <ResultActions key={shareText(t, r)} text={shareText(t, r)} shareTitle={t.shareTitle} />
    </div>
  );
}
