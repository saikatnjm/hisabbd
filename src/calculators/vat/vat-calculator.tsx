"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatPlainDate, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { parsePlainDate } from "@/lib/plain-date";
import {
  calculateVat,
  MAX_AMOUNT,
  VAT_RATE_PRESETS,
  VAT_RATE_SOURCES,
  VAT_RATES_CHECKED_ON,
  type VatError,
  type VatField,
  type VatMode,
  type VatPresetId,
  type VatResult,
} from "./logic";

const FIELD_IDS: Record<VatField, string> = { amount: "vat-amount", rate: "vat-rate" };
const PRESET_ID = "vat-rate-preset";
const PRESET_IDS: readonly VatPresetId[] = ["standard", "reduced10", "reduced7_5", "reduced5", "custom"];
const MODE_ORDER: readonly VatMode[] = ["add", "remove"];

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

/** Rate as typed, up to 4 decimals, without the % sign (for formulas). */
function rateNumber(value: number): string {
  return formatNumber(value, { decimals: 4 });
}

const STRINGS = {
  en: {
    submit: "Calculate VAT",
    modeLegend: "What do you want to do?",
    modes: { add: "Add VAT", remove: "Remove VAT" },
    modeSentence: {
      add: "You have a price before VAT and want the VAT and the price including VAT.",
      remove: "You have a price that already includes VAT and want to split out the VAT.",
    },
    amount: { add: "Price excluding VAT", remove: "Price including VAT" },
    amountPlaceholder: { add: "e.g. 1,000", remove: "e.g. 1,150" },
    preset: "VAT rate",
    presets: {
      standard: "Standard 15%",
      reduced10: "Reduced 10%",
      reduced7_5: "Reduced 7.5%",
      reduced5: "Reduced 5%",
      custom: "Custom rate",
    },
    presetHints: {
      standard: "The standard rate for most goods and services.",
      reduced10: "Reduced rates apply only to some goods and services. Check NBR for your item.",
      reduced7_5: "Reduced rates apply only to some goods and services. Check NBR for your item.",
      reduced5: "Reduced rates apply only to some goods and services. Check NBR for your item.",
      custom: "Enter any rate from 0 to 100.",
    },
    customRate: "Custom VAT rate",
    customPlaceholder: "e.g. 15",
    sourcesLead: (date: string) => `Rates checked on ${date}. Sources:`,
    sourcesTail: "Rates can change with each budget.",
    announcement: (main: string, value: string, vat: string) => `${main} ${value}. VAT ${vat}.`,
    placeholderTitleFirst: "Your VAT will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Choose Add VAT or Remove VAT, enter the price and the rate, then select Calculate VAT.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    resultTitle: { add: "Price including VAT", remove: "Price excluding VAT" },
    statVat: (rate: string) => `VAT at ${rate}%`,
    statVatInside: (rate: string) => `VAT included (${rate}%)`,
    statNet: "Price excluding VAT",
    statGross: "Price including VAT",
    workedOutAs: "Worked out as:",
    vatWord: "VAT",
    removeMistake: (rate: string, gross: string, wrong: string, right: string) =>
      `Taking ${rate}% of ${gross} would give ${wrong}, which is wrong: the VAT inside it is ${right}.`,
    paisaNote: "Amounts are rounded to the nearest paisa.",
    scopeNote:
      "VAT only. Supplementary duty, advance tax, VAT deducted at source and other charges are not included.",
    errAmountLabel: { add: "price excluding VAT", remove: "price including VAT" },
    errAmountMin: "at least ৳0.01",
    errAmountMax: (max: string) => `${max} or less`,
    errRateLabel: "VAT rate",
    errRateMin: "0% or more",
    errRateMax: "100% or less",
    shareTitle: "VAT calculated with HisabBD",
    shareAdd: (net: string, rate: string, vat: string, gross: string) =>
      `${net} + ${rate}% VAT (${vat}) = ${gross}. Calculated with HisabBD’s VAT Calculator.`,
    shareRemove: (gross: string, rate: string, net: string, vat: string) =>
      `${gross} including ${rate}% VAT = ${net} + ${vat} VAT. Calculated with HisabBD’s VAT Calculator.`,
  },
  bn: {
    submit: "ভ্যাট হিসাব করুন",
    modeLegend: "কী করতে চান?",
    modes: { add: "ভ্যাট যোগ করুন", remove: "ভ্যাট বাদ দিন" },
    modeSentence: {
      add: "ভ্যাট ছাড়া দাম জানা আছে; ভ্যাট আর ভ্যাটসহ দাম বের করতে চান।",
      remove: "দামে ভ্যাট আগেই ধরা আছে; তার মধ্যে কত ভ্যাট তা আলাদা করতে চান।",
    },
    amount: { add: "ভ্যাট ছাড়া দাম", remove: "ভ্যাটসহ দাম" },
    amountPlaceholder: { add: "যেমন 1,000", remove: "যেমন 1,150" },
    preset: "ভ্যাটের হার",
    presets: {
      standard: "সাধারণ হার 15%",
      reduced10: "হ্রাসকৃত হার 10%",
      reduced7_5: "হ্রাসকৃত হার 7.5%",
      reduced5: "হ্রাসকৃত হার 5%",
      custom: "নিজের হার",
    },
    presetHints: {
      standard: "বেশিরভাগ পণ্য ও সেবার সাধারণ হার।",
      reduced10: "হ্রাসকৃত হার শুধু কিছু পণ্য ও সেবায় প্রযোজ্য। আপনার পণ্যের হার NBR থেকে মিলিয়ে নিন।",
      reduced7_5: "হ্রাসকৃত হার শুধু কিছু পণ্য ও সেবায় প্রযোজ্য। আপনার পণ্যের হার NBR থেকে মিলিয়ে নিন।",
      reduced5: "হ্রাসকৃত হার শুধু কিছু পণ্য ও সেবায় প্রযোজ্য। আপনার পণ্যের হার NBR থেকে মিলিয়ে নিন।",
      custom: "0 থেকে 100-এর মধ্যে যেকোনো হার লিখুন।",
    },
    customRate: "নিজের ভ্যাট হার",
    customPlaceholder: "যেমন 15",
    sourcesLead: (date: string) => `হারগুলো ${date}-এ যাচাই করা। সূত্র:`,
    sourcesTail: "প্রতি বাজেটে হার বদলাতে পারে।",
    announcement: (main: string, value: string, vat: string) => `${main} ${value}। ভ্যাট ${vat}।`,
    placeholderTitleFirst: "ভ্যাটের হিসাব এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "“ভ্যাট যোগ করুন” বা “ভ্যাট বাদ দিন” বেছে দাম ও হার লিখুন, তারপর “ভ্যাট হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    resultTitle: { add: "ভ্যাটসহ দাম", remove: "ভ্যাট ছাড়া দাম" },
    statVat: (rate: string) => `${rate}% হারে ভ্যাট`,
    statVatInside: (rate: string) => `দামের মধ্যে ভ্যাট (${rate}%)`,
    statNet: "ভ্যাট ছাড়া দাম",
    statGross: "ভ্যাটসহ দাম",
    workedOutAs: "যেভাবে হিসাব হলো:",
    vatWord: "ভ্যাট",
    removeMistake: (rate: string, gross: string, wrong: string, right: string) =>
      `${gross}-এর ${rate}% নিলে আসে ${wrong}, যা ভুল: এর ভেতরের ভ্যাট আসলে ${right}।`,
    paisaNote: "অঙ্কগুলো নিকটতম পয়সায় রাউন্ড করা।",
    scopeNote: "শুধু ভ্যাট। সম্পূরক শুল্ক, অগ্রিম কর, উৎসে ভ্যাট কর্তন বা অন্য কোনো চার্জ এতে ধরা নেই।",
    errAmountLabel: { add: "ভ্যাট ছাড়া দাম", remove: "ভ্যাটসহ দাম" },
    errAmountMin: "কমপক্ষে ৳0.01",
    errAmountMax: (max: string) => `${max} বা তার কম`,
    errRateLabel: "ভ্যাটের হার",
    errRateMin: "0% বা তার বেশি",
    errRateMax: "100% বা তার কম",
    shareTitle: "HisabBD দিয়ে ভ্যাট হিসাব",
    shareAdd: (net: string, rate: string, vat: string, gross: string) =>
      `${net} + ${rate}% ভ্যাট (${vat}) = ${gross}। HisabBD-র ভ্যাট ক্যালকুলেটরে হিসাব করা।`,
    shareRemove: (gross: string, rate: string, net: string, vat: string) =>
      `${rate}% ভ্যাটসহ ${gross} = ${net} + ভ্যাট ${vat}। HisabBD-র ভ্যাট ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

const link = "font-semibold text-brand-700 underline underline-offset-4";

function errorMessage(t: Strings, locale: Locale, mode: VatMode, error: VatError): string {
  switch (error.field) {
    case "amount":
      return numberErrorMessage(
        error.code,
        { label: t.errAmountLabel[mode], min: t.errAmountMin, max: t.errAmountMax(formatTaka(MAX_AMOUNT)) },
        locale,
      );
    case "rate":
      return numberErrorMessage(error.code, { label: t.errRateLabel, min: t.errRateMin, max: t.errRateMax }, locale);
  }
}

/** The formula with the numbers filled in, one step per line. */
function working(t: Strings, r: VatResult): string[] {
  const rate = rateNumber(r.rate);
  if (r.mode === "add") {
    return [
      `${t.vatWord} = ${money(r.net)} × ${rate} ÷ 100 = ${money(r.vat)}`,
      `${money(r.net)} + ${money(r.vat)} = ${money(r.gross)}`,
    ];
  }
  return [
    `${t.vatWord} = ${money(r.gross)} × ${rate} ÷ (100 + ${rate}) = ${money(r.vat)}`,
    `${money(r.gross)} − ${money(r.vat)} = ${money(r.net)}`,
  ];
}

function shareText(t: Strings, r: VatResult): string {
  const rate = rateNumber(r.rate);
  return r.mode === "add"
    ? t.shareAdd(money(r.net), rate, money(r.vat), money(r.gross))
    : t.shareRemove(money(r.gross), rate, money(r.net), money(r.vat));
}

function headline(r: VatResult): number {
  return r.mode === "add" ? r.gross : r.net;
}

export function VatCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [mode, setMode] = useState<VatMode>("add");
  const [amount, setAmount] = useState("");
  const [preset, setPreset] = useState<VatPresetId>("standard");
  const [customRate, setCustomRate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<VatField, React.RefObject<HTMLInputElement | null>> = {
    amount: useRef<HTMLInputElement>(null),
    rate: useRef<HTMLInputElement>(null),
  };

  const modeOptions = MODE_ORDER.map((value) => ({ value, label: t.modes[value] }));
  const rawRate = preset === "custom" ? customRate : String(VAT_RATE_PRESETS[preset].value);
  const calc = submitted ? calculateVat(mode, amount, rawRate) : null;
  const errorFor = (field: VatField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, mode, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;
  const checkedOn = parsePlainDate(VAT_RATES_CHECKED_ON);

  function changeMode(next: VatMode) {
    setMode(next);
    setSubmitted(false);
    setRevealCount(0);
  }

  function onPresetChange(value: string) {
    const next = PRESET_IDS.find((id) => id === value) ?? "standard";
    // Switching to Custom starts from the rate that was showing, if the box is empty.
    if (next === "custom" && preset !== "custom" && !customRate.trim()) {
      setCustomRate(String(VAT_RATE_PRESETS[preset].value));
    }
    setPreset(next);
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculateVat(mode, amount, rawRate);
    if (check.ok) {
      setRevealCount((n) => n + 1);
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onReset() {
    setMode("add");
    setAmount("");
    setPreset("standard");
    setCustomRate("");
    setSubmitted(false);
    setRevealCount(0);
    refs.amount.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <SegmentedControl name="vat-mode" legend={t.modeLegend} options={modeOptions} value={mode} onChange={changeMode} />
        <p className="mt-3 text-slate-700">{t.modeSentence[mode]}</p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <FormField id={FIELD_IDS.amount} label={t.amount[mode]} error={errorFor("amount")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.amount}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.amountPlaceholder[mode]}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            )}
          </FormField>
          <FormField id={PRESET_ID} label={t.preset} hint={t.presetHints[preset]}>
            {(control) => (
              <Select {...control} value={preset} onChange={(event) => onPresetChange(event.target.value)}>
                {PRESET_IDS.map((id) => (
                  <option key={id} value={id}>
                    {t.presets[id]}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          {preset === "custom" && (
            <div className="sm:col-start-2">
              <FormField id={FIELD_IDS.rate} label={t.customRate} error={errorFor("rate")}>
                {(control) => (
                  <AffixInput
                    {...control}
                    ref={refs.rate}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    suffix="%"
                    placeholder={t.customPlaceholder}
                    value={customRate}
                    onChange={(event) => setCustomRate(event.target.value)}
                  />
                )}
              </FormField>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-600">
          {t.sourcesLead(checkedOn ? formatPlainDate(checkedOn, { locale }) : VAT_RATES_CHECKED_ON)}{" "}
          {VAT_RATE_SOURCES.map((source, index) => (
            <span key={source.url}>
              {index > 0 && "; "}
              <a href={source.url} target="_blank" rel="noopener" className={link}>
                {source.title}
              </a>
            </span>
          ))}
          . {t.sourcesTail}
        </p>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={
          result ? t.announcement(t.resultTitle[result.mode], money(headline(result)), money(result.vat)) : ""
        }
        result={result && <VatResultView result={result} />}
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

function VatResultView({ result: r }: { result: VatResult }) {
  const t = STRINGS[useLocale()];
  const rate = rateNumber(r.rate);
  const stats =
    r.mode === "add"
      ? [
          { label: t.statVat(rate), value: money(r.vat) },
          { label: t.statNet, value: money(r.net) },
        ]
      : [
          { label: t.statVatInside(rate), value: money(r.vat) },
          { label: t.statGross, value: money(r.gross) },
        ];
  const wrongVat = roundTo((r.gross * r.rate) / 100, 2);
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle[r.mode]}
        titleId="vat-result-heading"
        value={
          <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{money(headline(r))}</p>
        }
      >
        <ResultStats items={stats} />
        <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-slate-800">
          <p className="text-sm text-slate-600">{t.workedOutAs}</p>
          {working(t, r).map((line) => (
            <p key={line} className="font-medium break-words">
              {line}
            </p>
          ))}
        </div>
        {r.mode === "remove" && r.rate > 0 && wrongVat !== r.vat && (
          <p className="mt-3 text-sm text-slate-700">
            {t.removeMistake(rate, money(r.gross), money(wrongVat), money(r.vat))}
          </p>
        )}
        <p className="mt-4 text-sm text-slate-600">{t.paisaNote}</p>
        <p className="mt-1 text-sm text-slate-600">{t.scopeNote}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}
