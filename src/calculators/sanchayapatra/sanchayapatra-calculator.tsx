"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatPlainDate, formatTaka } from "@/lib/format";
import { parseNumberInput, roundTo } from "@/lib/number";
import { parsePlainDate } from "@/lib/plain-date";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  calculateSanchayapatra,
  DEFAULT_TAX_RATE,
  IRD_RATE_ORDER,
  MAX_AMOUNT,
  MIN_AMOUNT,
  maturityRate,
  RATES_EFFECTIVE_FROM,
  rateTierFor,
  SANCHAYAPATRA_CHECKED_ON,
  SANCHAYAPATRA_SCHEMES,
  SCHEME_IDS,
  yearlyProfit,
  type Payout,
  type RateTier,
  type SanchayapatraError,
  type SanchayapatraField,
  type SanchayapatraResult,
} from "./logic";

const FIELD_IDS: Record<SanchayapatraField, string> = {
  amount: "sanchayapatra-amount",
  rate: "sanchayapatra-rate",
  tax: "sanchayapatra-tax",
};
const SCHEME_FIELD_ID = "sanchayapatra-scheme";
const TIERS: readonly RateTier[] = ["upTo", "above"];
/** The scheme is remembered in this browser; amounts, rates and tax are not. */
const SCHEME_PREF = choicePreference("sanchayapatra-calculator", "scheme", SCHEME_IDS, "paribar");

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

/** A rate as typed, up to 4 decimals, without the % sign. */
function pct(value: number): string {
  return formatNumber(value, { decimals: 4 });
}

const STRINGS = {
  en: {
    submit: "Calculate profit",
    scheme: "Savings certificate",
    schemeNames: {
      paribar: "Paribar (Family) Sanchayapatra",
      bangladesh: "5-year Bangladesh Sanchayapatra",
      threeMonth: "3-month profit-bearing Sanchayapatra",
      pensioner: "Pensioner Sanchayapatra",
    },
    schemeHint: (years: number, payout: string, from: string, limit: string) =>
      `${years} years · profit paid ${payout} · certificates from ${from} · up to ${limit} in a single name.`,
    payoutWords: { monthly: "every month", quarterly: "every 3 months", maturity: "at maturity" },
    amount: "Investment amount",
    amountPlaceholder: "e.g. 1,00,000",
    tierLegend: "Your total in all savings certificates, including this one",
    tiers: { upTo: "Up to ৳7,50,000", above: "Above ৳7,50,000" },
    tierForced: "Your amount alone is above ৳7,50,000, so the higher-tier rate applies.",
    tierHint: "The rate tier depends on your total investment across all national savings schemes.",
    rate: "Profit rate (per year)",
    rateHintOfficial: (date: string) =>
      `Official rate if held to maturity, for certificates bought from ${date}. Change it if your certificate shows a different rate.`,
    rateHintEdited: (rate: string) => `You changed the rate. The official rate is ${rate}%.`,
    useOfficialRate: "Use the official rate",
    tax: "Source tax on profit",
    taxHint:
      "10% is pre-filled (Income Tax Act 2023, s.105). Before the 2026-27 budget, a total of up to ৳5 lakh paid 5%, and Pensioner up to ৳5 lakh paid 0%. Enter what your office deducts.",
    sourcesLead: (effective: string, checked: string) =>
      `Rates as of ${effective} (still in force when checked on ${checked}) · Source:`,
    sourceScheme: "NSD scheme sheet",
    sourceOrder: "IRD rate order",
    placeholderTitleFirst: "Your profit will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Choose the certificate, enter the amount, then select Calculate profit.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    resultTitle: {
      monthly: "Monthly profit after tax",
      quarterly: "Profit every 3 months after tax",
      maturity: "You receive at maturity",
    },
    headlineSub: {
      monthly: (gross: string, tax: string) => `${gross} before tax, minus ${tax} source tax`,
      quarterly: (gross: string, tax: string) => `${gross} before tax, minus ${tax} source tax`,
      maturity: (gross: string, tax: string) => `Principal plus ${gross} profit, minus ${tax} source tax`,
    },
    statTotalGross: "Total profit before tax",
    statTotalTax: "Total source tax",
    statTotalNet: "Total profit after tax",
    statTotalReceived: "Total received over the term",
    statPayments: "Number of profit payments",
    statPrincipalBack: "Principal returned at maturity",
    statRate: "Rate used",
    workedOutAs: "Worked out as:",
    lineYearly: (amount: string, rate: string, yearly: string) => `Profit per year = ${amount} × ${rate} ÷ 100 = ${yearly}`,
    linePerPayment: { monthly: "Per month", quarterly: "Per quarter", maturity: "At maturity" },
    lineDivide: { monthly: "÷ 12", quarterly: "÷ 4", maturity: "" },
    lineYears: (years: number) => `× ${years} years`,
    lineTax: (gross: string, tax: string, value: string) => `Source tax = ${gross} × ${tax} ÷ 100 = ${value}`,
    noteSimple:
      "Simple profit, assuming you keep the certificate to maturity. Encashing early pays a lower rate for the years completed.",
    notePrinted: "Check the rate printed on your certificate: it keeps the rate of the day it was bought.",
    notePaisa: "Amounts are rounded to the paisa for display.",
    announcement: (title: string, value: string, net: string) => `${title} ${value}. Total profit after tax ${net}.`,
    errAmountLabel: "investment amount",
    errAmountMin: `at least ${formatTaka(MIN_AMOUNT)}`,
    errAmountMax: `${formatTaka(MAX_AMOUNT)} or less`,
    errRateLabel: "profit rate",
    errTaxLabel: "source tax",
    errPctMin: "0% or more",
    errPctMax: "100% or less",
    years: (n: number) => `${n} years`,
    shareTitle: "Sanchayapatra profit calculated with HisabBD",
    share: (scheme: string, amount: string, rate: string, tax: string, payout: string, net: string, total: string, years: number) =>
      `${amount} in ${scheme} at ${rate}% with ${tax}% source tax: ${payout}; ${net} net profit over ${years} years (${total} received in all). Calculated with HisabBD’s Sanchayapatra Profit Calculator.`,
    sharePayout: {
      monthly: (v: string) => `${v} a month after tax`,
      quarterly: (v: string) => `${v} every 3 months after tax`,
      maturity: (v: string) => `${v} at maturity`,
    },
  },
  bn: {
    submit: "মুনাফা হিসাব করুন",
    scheme: "সঞ্চয়পত্র",
    schemeNames: {
      paribar: "পরিবার সঞ্চয়পত্র",
      bangladesh: "5 বছর মেয়াদি বাংলাদেশ সঞ্চয়পত্র",
      threeMonth: "তিন মাস অন্তর মুনাফাভিত্তিক সঞ্চয়পত্র",
      pensioner: "পেনশনার সঞ্চয়পত্র",
    },
    schemeHint: (years: number, payout: string, from: string, limit: string) =>
      `মেয়াদ ${years} বছর · মুনাফা ${payout} · ${from} থেকে সঞ্চয়পত্র · একক নামে সর্বোচ্চ ${limit}।`,
    payoutWords: { monthly: "প্রতি মাসে", quarterly: "প্রতি 3 মাসে", maturity: "মেয়াদ শেষে" },
    amount: "বিনিয়োগের পরিমাণ",
    amountPlaceholder: "যেমন 1,00,000",
    tierLegend: "এটিসহ সব সঞ্চয়পত্রে আপনার মোট বিনিয়োগ",
    tiers: { upTo: "৳7,50,000 পর্যন্ত", above: "৳7,50,000-এর বেশি" },
    tierForced: "শুধু এই অঙ্কই ৳7,50,000-এর বেশি, তাই ঊর্ধ্ব ধাপের হার প্রযোজ্য।",
    tierHint: "হারের ধাপ সব জাতীয় সঞ্চয় স্কিমে আপনার মোট বিনিয়োগের ওপর নির্ভর করে।",
    rate: "মুনাফার হার (বার্ষিক)",
    rateHintOfficial: (date: string) =>
      `${date} থেকে কেনা সঞ্চয়পত্রে মেয়াদ পূর্ণ করলে সরকারি হার। আপনার সঞ্চয়পত্রে অন্য হার থাকলে বদলে দিন।`,
    rateHintEdited: (rate: string) => `আপনি হার বদলেছেন। সরকারি হার ${rate}%।`,
    useOfficialRate: "সরকারি হার ব্যবহার করুন",
    tax: "মুনাফার ওপর উৎসে কর",
    taxHint:
      "10% আগে থেকে বসানো (আয়কর আইন 2023, ধারা 105)। 2026-27 বাজেটের আগে মোট ৳5 লাখ পর্যন্ত হলে 5%, আর পেনশনার সঞ্চয়পত্রে ৳5 লাখ পর্যন্ত 0% ছিল। আপনার অফিস যে হারে কাটে সেটি লিখুন।",
    sourcesLead: (effective: string, checked: string) =>
      `হার ${effective} থেকে কার্যকর (${checked}-এ যাচাই করে বহাল পাওয়া গেছে) · সূত্র:`,
    sourceScheme: "NSD-র স্কিম তথ্যপত্র",
    sourceOrder: "IRD-র হার প্রজ্ঞাপন",
    placeholderTitleFirst: "আপনার মুনাফা এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "সঞ্চয়পত্র বেছে বিনিয়োগের পরিমাণ লিখুন, তারপর “মুনাফা হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    resultTitle: {
      monthly: "কর বাদে মাসিক মুনাফা",
      quarterly: "কর বাদে প্রতি 3 মাসের মুনাফা",
      maturity: "মেয়াদ শেষে পাবেন",
    },
    headlineSub: {
      monthly: (gross: string, tax: string) => `কর বাদের আগে ${gross}, উৎসে কর ${tax} বাদে`,
      quarterly: (gross: string, tax: string) => `কর বাদের আগে ${gross}, উৎসে কর ${tax} বাদে`,
      maturity: (gross: string, tax: string) => `আসল টাকা + মুনাফা ${gross}, উৎসে কর ${tax} বাদে`,
    },
    statTotalGross: "কর বাদের আগে মোট মুনাফা",
    statTotalTax: "মোট উৎসে কর",
    statTotalNet: "কর বাদে মোট মুনাফা",
    statTotalReceived: "পুরো মেয়াদে মোট প্রাপ্তি",
    statPayments: "মুনাফা প্রদানের সংখ্যা",
    statPrincipalBack: "মেয়াদ শেষে আসল ফেরত",
    statRate: "ব্যবহৃত হার",
    workedOutAs: "যেভাবে হিসাব হলো:",
    lineYearly: (amount: string, rate: string, yearly: string) => `বছরে মুনাফা = ${amount} × ${rate} ÷ 100 = ${yearly}`,
    linePerPayment: { monthly: "প্রতি মাসে", quarterly: "প্রতি 3 মাসে", maturity: "মেয়াদ শেষে" },
    lineDivide: { monthly: "÷ 12", quarterly: "÷ 4", maturity: "" },
    lineYears: (years: number) => `× ${years} বছর`,
    lineTax: (gross: string, tax: string, value: string) => `উৎসে কর = ${gross} × ${tax} ÷ 100 = ${value}`,
    noteSimple: "সরল মুনাফা, মেয়াদ পূর্ণ করবেন ধরে। আগে ভাঙালে পূর্ণ হওয়া বছরের জন্য কম হারে মুনাফা দেওয়া হয়।",
    notePrinted: "আপনার সঞ্চয়পত্রে ছাপা হার মিলিয়ে নিন: কেনার দিনের হারই পুরো মেয়াদে থাকে।",
    notePaisa: "দেখানোর সময় অঙ্কগুলো পয়সা পর্যন্ত রাউন্ড করা।",
    announcement: (title: string, value: string, net: string) => `${title} ${value}। কর বাদে মোট মুনাফা ${net}।`,
    errAmountLabel: "বিনিয়োগের পরিমাণ",
    errAmountMin: `কমপক্ষে ${formatTaka(MIN_AMOUNT)}`,
    errAmountMax: `${formatTaka(MAX_AMOUNT)} বা তার কম`,
    errRateLabel: "মুনাফার হার",
    errTaxLabel: "উৎসে কর",
    errPctMin: "0% বা তার বেশি",
    errPctMax: "100% বা তার কম",
    years: (n: number) => `${n} বছর`,
    shareTitle: "HisabBD দিয়ে সঞ্চয়পত্রের মুনাফা হিসাব",
    share: (scheme: string, amount: string, rate: string, tax: string, payout: string, net: string, total: string, years: number) =>
      `${scheme}-এ ${amount}, হার ${rate}%, উৎসে কর ${tax}%: ${payout}; ${years} বছরে কর বাদে মোট মুনাফা ${net} (সব মিলিয়ে ${total})। HisabBD-র সঞ্চয়পত্রের মুনাফা ক্যালকুলেটরে হিসাব করা।`,
    sharePayout: {
      monthly: (v: string) => `কর বাদে মাসে ${v}`,
      quarterly: (v: string) => `কর বাদে প্রতি 3 মাসে ${v}`,
      maturity: (v: string) => `মেয়াদ শেষে ${v}`,
    },
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

const link = "font-semibold text-brand-700 underline underline-offset-4";

function errorMessage(t: Strings, locale: Locale, error: SanchayapatraError): string {
  switch (error.field) {
    case "amount":
      return numberErrorMessage(
        error.code,
        { label: t.errAmountLabel, min: t.errAmountMin, max: t.errAmountMax },
        locale,
      );
    case "rate":
      return numberErrorMessage(error.code, { label: t.errRateLabel, min: t.errPctMin, max: t.errPctMax }, locale);
    case "tax":
      return numberErrorMessage(error.code, { label: t.errTaxLabel, min: t.errPctMin, max: t.errPctMax }, locale);
  }
}

/** The headline figure: net profit per payment, or everything paid at maturity. */
function headline(r: SanchayapatraResult): number {
  return r.payout === "maturity" ? r.receivedAtMaturity : r.netPerPayment;
}

function shareText(t: Strings, r: SanchayapatraResult): string {
  return t.share(
    t.schemeNames[r.scheme],
    money(r.amount),
    pct(r.rate),
    pct(r.taxRate),
    t.sharePayout[r.payout](money(headline(r))),
    money(r.totalNet),
    money(r.totalReceived),
    r.tenureMonths / 12,
  );
}

function dateText(iso: string, locale: Locale): string {
  const date = parsePlainDate(iso);
  return date ? formatPlainDate(date, { locale }) : iso;
}

export function SanchayapatraCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [scheme, setScheme] = usePreference(SCHEME_PREF);
  const [amount, setAmount] = useState("");
  const [holding, setHolding] = useState<RateTier>("upTo");
  /** null = use the official rate / default tax for the current choices. */
  const [rateOverride, setRateOverride] = useState<string | null>(null);
  const [taxOverride, setTaxOverride] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<SanchayapatraField, React.RefObject<HTMLInputElement | null>> = {
    amount: useRef<HTMLInputElement>(null),
    rate: useRef<HTMLInputElement>(null),
    tax: useRef<HTMLInputElement>(null),
  };
  const { record } = useCalculationHistory();

  const data = SANCHAYAPATRA_SCHEMES[scheme];
  const parsedAmount = parseNumberInput(amount);
  const tier = rateTierFor(parsedAmount, holding);
  const tierForced = tier !== holding;
  const officialRate = maturityRate(scheme, tier);
  const rate = rateOverride ?? String(officialRate);
  const tax = taxOverride ?? String(DEFAULT_TAX_RATE);
  const rateEdited = parseNumberInput(rate) !== officialRate;

  const inputs = { scheme, amount, rate, tax };
  const calc = submitted ? calculateSanchayapatra(inputs) : null;
  const errorFor = (field: SanchayapatraField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;
  const tierOptions = TIERS.map((value) => ({ value, label: t.tiers[value] }));
  const effective = dateText(RATES_EFFECTIVE_FROM, locale);

  function onSchemeChange(value: string) {
    const next = SCHEME_IDS.find((id) => id === value) ?? "paribar";
    setScheme(next);
    setRateOverride(null);
  }

  function onTierChange(next: RateTier) {
    setHolding(next);
    setRateOverride(null);
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculateSanchayapatra(inputs);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ scheme, amount, holding, rate, tax }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedScheme = text("scheme");
    const savedHolding = TIERS.find((value) => value === saved.holding);
    if (SCHEME_PREF.isValid(savedScheme)) setScheme(savedScheme);
    setHolding(savedHolding ?? "upTo");
    setAmount(text("amount"));
    setRateOverride(text("rate"));
    setTaxOverride(text("tax"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed and goes back to the official rate and default tax; the remembered scheme stays. */
  function onReset() {
    setAmount("");
    setHolding("upTo");
    setRateOverride(null);
    setTaxOverride(null);
    setSubmitted(false);
    setRevealCount(0);
    refs.amount.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField
              id={SCHEME_FIELD_ID}
              label={t.scheme}
              hint={t.schemeHint(
                data.tenureMonths / 12,
                t.payoutWords[data.payout],
                formatTaka(data.minDenomination),
                formatTaka(data.singleNameLimit),
              )}
            >
              {(control) => (
                <Select {...control} value={scheme} onChange={(event) => onSchemeChange(event.target.value)}>
                  {SCHEME_IDS.map((id) => (
                    <option key={id} value={id}>
                      {t.schemeNames[id]}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </div>

          <FormField id={FIELD_IDS.amount} label={t.amount} error={errorFor("amount")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.amount}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.amountPlaceholder}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            )}
          </FormField>

          <div>
            <SegmentedControl
              name="sanchayapatra-tier"
              legend={t.tierLegend}
              options={tierOptions}
              value={tier}
              onChange={onTierChange}
            />
            <p className="mt-1.5 text-sm text-slate-600">{tierForced ? t.tierForced : t.tierHint}</p>
          </div>

          <div>
            <FormField
              id={FIELD_IDS.rate}
              label={t.rate}
              hint={rateEdited ? t.rateHintEdited(pct(officialRate)) : t.rateHintOfficial(effective)}
              error={errorFor("rate")}
            >
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.rate}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix="%"
                  value={rate}
                  onChange={(event) => setRateOverride(event.target.value)}
                />
              )}
            </FormField>
            {rateEdited && (
              <button type="button" className={`mt-2 text-sm ${link}`} onClick={() => setRateOverride(null)}>
                {t.useOfficialRate}
              </button>
            )}
          </div>

          <FormField id={FIELD_IDS.tax} label={t.tax} hint={t.taxHint} error={errorFor("tax")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.tax}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix="%"
                value={tax}
                onChange={(event) => setTaxOverride(event.target.value)}
              />
            )}
          </FormField>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          {t.sourcesLead(effective, dateText(SANCHAYAPATRA_CHECKED_ON, locale))}{" "}
          <a href={data.source.url} target="_blank" rel="noopener" className={link}>
            {t.sourceScheme}
          </a>
          {"; "}
          <a href={IRD_RATE_ORDER.url} target="_blank" rel="noopener" className={link}>
            {t.sourceOrder}
          </a>
          .
        </p>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={
          result ? t.announcement(t.resultTitle[result.payout], money(headline(result)), money(result.totalNet)) : ""
        }
        result={result && <SanchayapatraResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

/** The formula with the numbers filled in, one step per line. */
function working(t: Strings, r: SanchayapatraResult): string[] {
  const yearly = yearlyProfit(r.amount, r.rate);
  const years = r.tenureMonths / 12;
  const payout: Payout = r.payout;
  const perPayment =
    payout === "maturity"
      ? `${t.linePerPayment[payout]} = ${money(yearly)} ${t.lineYears(years)} = ${money(r.grossPerPayment)}`
      : `${t.linePerPayment[payout]} = ${money(yearly)} ${t.lineDivide[payout]} = ${money(r.grossPerPayment)}`;
  return [
    t.lineYearly(money(r.amount), pct(r.rate), money(yearly)),
    perPayment,
    t.lineTax(money(r.grossPerPayment), pct(r.taxRate), money(r.taxPerPayment)),
  ];
}

function SanchayapatraResultView({ result: r }: { result: SanchayapatraResult }) {
  const t = STRINGS[useLocale()];
  const years = r.tenureMonths / 12;
  const stats = [
    { label: t.statTotalGross, value: money(r.totalGross) },
    { label: t.statTotalTax, value: money(r.totalTax) },
    { label: t.statTotalNet, value: money(r.totalNet) },
    { label: t.statTotalReceived, value: `${money(r.totalReceived)} (${t.years(years)})` },
    ...(r.payout === "maturity"
      ? []
      : [
          { label: t.statPayments, value: formatNumber(r.payments) },
          { label: t.statPrincipalBack, value: money(r.receivedAtMaturity) },
        ]),
    { label: t.statRate, value: `${pct(r.rate)}%` },
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle[r.payout]}
        titleId="sanchayapatra-result-heading"
        value={
          <>
            <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
              {money(headline(r))}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {t.headlineSub[r.payout](money(r.grossPerPayment), money(r.taxPerPayment))}
            </p>
          </>
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
        <p className="mt-4 text-sm text-slate-600">{t.noteSimple}</p>
        <p className="mt-1 text-sm text-slate-600">{t.notePrinted}</p>
        <p className="mt-1 text-sm text-slate-600">{t.notePaisa}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}
