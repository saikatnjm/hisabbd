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
import { formatNumber, formatTaka } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import {
  calculateLeave,
  DEFAULT_LEAVE_RULE,
  LEAVE_RULES,
  leaveRule,
  MAX_DAYS,
  MAX_DAYS_WORKED,
  MAX_WAGE,
  MAX_WAGE_DAYS,
  type LeaveError,
  type LeaveField,
  type LeaveResult,
  type LeaveRuleId,
} from "./logic";

const FIELD_IDS: Record<LeaveField, string> = {
  daysWorked: "leave-days-worked",
  carried: "leave-carried",
  refused: "leave-refused",
  taken: "leave-taken",
  wage: "leave-wage",
  wageDays: "leave-wage-days",
};
const RULE_ID = "leave-rule";
const ELIGIBLE_NAME = "leave-eligible";

type Eligible = "yes" | "no";

/** ৳ with paisa only when there is a fraction: ৳55,200 or ৳1,234.50. */
function money(value: number): string {
  const rounded = roundTo(value, 2);
  return Number.isInteger(rounded) ? formatTaka(rounded) : formatTaka(rounded, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Calculate leave",
    rule: "Where do you work?",
    ruleHint: "Adult workers only. The rate and the limit come from section 117 of the Labour Act.",
    rules: {
      "shop-factory": "Shop, commercial or industrial establishment (1 day per 18, limit 60)",
      factory: "Factory or road transport establishment (1 day per 18, limit 40)",
      tea: "Tea plantation (1 day per 22, limit 60)",
      newspaper: "Newspaper worker (1 day per 11, no limit named)",
    } satisfies Record<LeaveRuleId, string>,
    eligibleLegend: "Completed one year of continuous service?",
    eligibleYes: "Yes",
    eligibleNo: "Not yet",
    daysWorked: "Days worked in the last 12 months",
    daysWorkedHint: "Count paid leave, holidays, sick leave and other days the Act treats as worked (section 117(8)).",
    daysWorkedPlaceholder: "e.g. 300",
    daysSuffix: "days",
    carried: "Earned leave carried forward",
    carriedHint: "Unused earned leave from before. It cannot be more than the limit.",
    carriedPlaceholder: "e.g. 50",
    refused: "Leave refused by your employer (optional)",
    refusedHint: "Leave you applied for and was refused is added above the limit (section 117(7)).",
    refusedPlaceholder: "e.g. 0",
    taken: "Earned leave already taken",
    takenPlaceholder: "e.g. 14",
    encashTitle: "Value of unused leave (optional)",
    encashHint: "Fill both boxes to see what unused leave is worth if you leave the job (sections 11 and 119).",
    wage: "Wage paid for the last month worked",
    wageHint: "Wage plus dearness and ad hoc pay for the days you worked. Do not include overtime or bonus.",
    wagePlaceholder: "e.g. 31,200",
    wageDays: "Days worked in that month",
    wageDaysHint: "The days the wage above was paid for.",
    wageDaysPlaceholder: "e.g. 26",
    errDaysWorked: "days worked",
    errCarried: "carried forward leave",
    errRefused: "refused leave",
    errTaken: "leave taken",
    errWage: "wage",
    errWageDays: "days worked in the month",
    errZeroMin: "0 or more",
    errAmountMin: "more than ৳0",
    errPositive: "more than 0",
    errMax: (max: string) => `${max} or less`,
    errDaysMax: (max: number) => `${max} days or less`,
    errExceeds: "The leave taken is more than the leave available. Check the days taken.",
    resultTitle: "Earned leave left",
    daysUnit: (n: string) => `${n} ${n === "1" ? "day" : "days"}`,
    earned: "Earned this period (s.117(1))",
    earnedNotYet: "Earned this period: none yet, under one year of service (s.117(1))",
    available: (cap: string) => `Available with carry-forward${cap ? ` and ${cap} limit` : ""} (s.117(4), (5))`,
    capNone: "",
    capLimit: (n: string) => `the ${n} day`,
    refusedStat: "Refused leave added (s.117(7))",
    takenStat: "Already taken",
    dailyWage: "Daily wage (s.119(1))",
    encashment: "Value of unused leave (s.11)",
    capped: (n: string) => `${n} days are lost to the limit in section 117(5).`,
    remainder: (n: string, interval: number) => `${n} more days worked would make the next day (1 per ${interval}).`,
    formula: (earned: string, carried: string, available: string, taken: string, remaining: string) =>
      `${carried} carried + ${earned} earned → ${available} available − ${taken} taken = ${remaining}`,
    note: "General information from the Bangladesh Labour Act 2006, not legal advice. Your appointment letter, service rules and your employer's leave records decide your balance. Government employees follow different rules.",
    announcement: (remaining: string) => `${remaining} of earned leave left.`,
    placeholderTitleFirst: "Your earned leave will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the days you worked, any leave carried forward and leave taken, then select Calculate leave.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    shareTitle: "Earned leave calculated with HisabBD",
    shareText: (remaining: string, formula: string) =>
      `Earned leave left: ${remaining} (${formula}). Calculated with HisabBD’s Earned Leave Calculator.`,
  },
  bn: {
    submit: "ছুটি হিসাব করুন",
    rule: "আপনি কোথায় কাজ করেন?",
    ruleHint: "শুধু প্রাপ্তবয়স্ক শ্রমিকের জন্য। হার ও সীমা শ্রম আইনের ১১৭ ধারা থেকে নেওয়া।",
    rules: {
      "shop-factory": "দোকান, বাণিজ্য বা শিল্প প্রতিষ্ঠান (প্রতি 18 দিনে 1 দিন, সীমা 60)",
      factory: "কারখানা বা সড়ক পরিবহন প্রতিষ্ঠান (প্রতি 18 দিনে 1 দিন, সীমা 40)",
      tea: "চা বাগান (প্রতি 22 দিনে 1 দিন, সীমা 60)",
      newspaper: "সংবাদপত্র শ্রমিক (প্রতি 11 দিনে 1 দিন, সীমার উল্লেখ নেই)",
    } satisfies Record<LeaveRuleId, string>,
    eligibleLegend: "এক বছর অবিচ্ছিন্ন চাকরি পূর্ণ হয়েছে?",
    eligibleYes: "হ্যাঁ",
    eligibleNo: "এখনো না",
    daysWorkedHint: "মজুরীসহ ছুটি, বন্ধের দিন, অসুস্থতার ছুটি ও আইনে কাজ বলে গণ্য অন্য দিনগুলো ধরুন (ধারা ১১৭(৮))।",
    daysWorked: "গত 12 মাসে কাজের দিন",
    daysWorkedPlaceholder: "যেমন 300",
    daysSuffix: "দিন",
    carried: "জমা থাকা অর্জিত ছুটি",
    carriedHint: "আগের বছরগুলোর অব্যবহৃত অর্জিত ছুটি। এটি সীমার বেশি হতে পারে না।",
    carriedPlaceholder: "যেমন 50",
    refused: "মালিক নামঞ্জুর করেছেন এমন ছুটি (ঐচ্ছিক)",
    refusedHint: "আবেদন করেও না পাওয়া ছুটি সীমার অতিরিক্ত যুক্ত হয় (ধারা ১১৭(৭))।",
    refusedPlaceholder: "যেমন 0",
    taken: "ইতিমধ্যে ভোগ করা অর্জিত ছুটি",
    takenPlaceholder: "যেমন 14",
    encashTitle: "অব্যয়িত ছুটির টাকা (ঐচ্ছিক)",
    encashHint: "চাকরি ছাড়লে অব্যয়িত ছুটির টাকা দেখতে দুটি ঘরই পূরণ করুন (ধারা ১১ ও ১১৯)।",
    wage: "শেষ কাজের মাসে প্রাপ্ত মজুরি",
    wageHint: "যে দিনগুলো কাজ করেছেন তার মজুরি, মহার্ঘ ও এডহক ভাতাসহ। ওভারটাইম ও বোনাস ধরবেন না।",
    wagePlaceholder: "যেমন 31,200",
    wageDays: "সেই মাসে কাজের দিন",
    wageDaysHint: "ওপরের মজুরি যে দিনগুলোর জন্য পেয়েছেন।",
    wageDaysPlaceholder: "যেমন 26",
    errDaysWorked: "কাজের দিন",
    errCarried: "জমা ছুটি",
    errRefused: "নামঞ্জুর ছুটি",
    errTaken: "ভোগ করা ছুটি",
    errWage: "মজুরি",
    errWageDays: "মাসে কাজের দিন",
    errZeroMin: "0 বা তার বেশি",
    errAmountMin: "৳0-এর বেশি",
    errPositive: "0-এর বেশি",
    errMax: (max: string) => `${max} বা তার কম`,
    errDaysMax: (max: number) => `${max} দিন বা তার কম`,
    errExceeds: "ভোগ করা ছুটি পাওনার চেয়ে বেশি। ভোগ করা দিন দেখে নিন।",
    resultTitle: "অর্জিত ছুটি বাকি",
    daysUnit: (n: string) => `${n} দিন`,
    earned: "এই সময়ে অর্জিত (ধারা ১১৭(১))",
    earnedNotYet: "এই সময়ে অর্জিত: এখনো নেই, এক বছরের কম চাকরি (ধারা ১১৭(১))",
    available: (cap: string) => `জমা ছুটিসহ পাওনা${cap ? `, ${cap} সীমা প্রযোজ্য` : ""} (ধারা ১১৭(৪), (৫))`,
    capNone: "",
    capLimit: (n: string) => `${n} দিনের`,
    refusedStat: "নামঞ্জুর ছুটি যুক্ত (ধারা ১১৭(৭))",
    takenStat: "ইতিমধ্যে ভোগ করা",
    dailyWage: "দৈনিক মজুরি (ধারা ১১৯(১))",
    encashment: "অব্যয়িত ছুটির টাকা (ধারা ১১)",
    capped: (n: string) => `১১৭(৫) ধারার সীমার কারণে ${n} দিন বাদ গেছে।`,
    remainder: (n: string, interval: number) => `আরও ${n} দিন কাজ করলে পরের 1 দিন পূর্ণ হবে (প্রতি ${interval} দিনে 1)।`,
    formula: (earned: string, carried: string, available: string, taken: string, remaining: string) =>
      `${carried} জমা + ${earned} অর্জিত → ${available} পাওনা − ${taken} ভোগ = ${remaining}`,
    note: "বাংলাদেশ শ্রম আইন ২০০৬ থেকে সাধারণ তথ্য, আইনি পরামর্শ নয়। আপনার ছুটির হিসাব নিয়োগপত্র, চাকরি বিধি আর মালিকের ছুটির রেকর্ড অনুযায়ী হবে। সরকারি কর্মচারীদের নিয়ম আলাদা।",
    announcement: (remaining: string) => `অর্জিত ছুটি বাকি ${remaining}।`,
    placeholderTitleFirst: "অর্জিত ছুটির হিসাব এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "কাজের দিন, জমা ছুটি আর ভোগ করা ছুটি লিখে “ছুটি হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে অর্জিত ছুটির হিসাব",
    shareText: (remaining: string, formula: string) =>
      `অর্জিত ছুটি বাকি: ${remaining} (${formula})। HisabBD-র অর্জিত ছুটি ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function isRuleId(value: string): value is LeaveRuleId {
  return LEAVE_RULES.some((rule) => rule.id === value);
}

function errorMessage(t: Strings, locale: Locale, error: LeaveError, ruleId: LeaveRuleId): string {
  if (error.code === "exceeds-available") return t.errExceeds;
  const code = error.code;
  const cap = leaveRule(ruleId).cap;
  switch (error.field) {
    case "daysWorked":
      return numberErrorMessage(code, { label: t.errDaysWorked, min: t.errZeroMin, max: t.errDaysMax(MAX_DAYS_WORKED) }, locale);
    case "carried":
      return numberErrorMessage(code, { label: t.errCarried, min: t.errZeroMin, max: t.errDaysMax(cap ?? MAX_DAYS) }, locale);
    case "refused":
      return numberErrorMessage(code, { label: t.errRefused, min: t.errZeroMin, max: t.errDaysMax(MAX_DAYS) }, locale);
    case "taken":
      return numberErrorMessage(code, { label: t.errTaken, min: t.errZeroMin, max: t.errDaysMax(MAX_DAYS) }, locale);
    case "wage":
      return numberErrorMessage(code, { label: t.errWage, min: t.errAmountMin, max: t.errMax(formatTaka(MAX_WAGE)) }, locale);
    case "wageDays":
      return numberErrorMessage(code, { label: t.errWageDays, min: t.errPositive, max: t.errDaysMax(MAX_WAGE_DAYS) }, locale);
  }
}

function formulaText(t: Strings, r: LeaveResult): string {
  const n = (v: number) => formatNumber(v);
  return t.formula(n(r.earned), n(r.carried), n(r.available), n(r.taken), n(r.remaining));
}

function shareText(t: Strings, r: LeaveResult): string {
  return t.shareText(t.daysUnit(formatNumber(r.remaining)), formulaText(t, r));
}

export function LeaveCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [rule, setRule] = useState<LeaveRuleId>(DEFAULT_LEAVE_RULE);
  const [eligible, setEligible] = useState<Eligible>("yes");
  const [daysWorked, setDaysWorked] = useState("");
  const [carried, setCarried] = useState("");
  const [refused, setRefused] = useState("");
  const [taken, setTaken] = useState("");
  const [wage, setWage] = useState("");
  const [wageDays, setWageDays] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = {
    daysWorked: useRef<HTMLInputElement>(null),
    carried: useRef<HTMLInputElement>(null),
    refused: useRef<HTMLInputElement>(null),
    taken: useRef<HTMLInputElement>(null),
    wage: useRef<HTMLInputElement>(null),
    wageDays: useRef<HTMLInputElement>(null),
  };

  const values = () => ({ rule, eligible: eligible === "yes", daysWorked, carried, refused, taken, wage, wageDays });
  const calc = submitted ? calculateLeave(values()) : null;
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateLeave(values());
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record(
        { rule, eligible, daysWorked, carried, refused, taken, wage, wageDays },
        shareText(t, check.result),
      );
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    setRule(isRuleId(text("rule")) ? (text("rule") as LeaveRuleId) : DEFAULT_LEAVE_RULE);
    setEligible(text("eligible") === "no" ? "no" : "yes");
    setDaysWorked(text("daysWorked"));
    setCarried(text("carried"));
    setRefused(text("refused"));
    setTaken(text("taken"));
    setWage(text("wage"));
    setWageDays(text("wageDays"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    setRule(DEFAULT_LEAVE_RULE);
    setEligible("yes");
    setDaysWorked("");
    setCarried("");
    setRefused("");
    setTaken("");
    setWage("");
    setWageDays("");
    setSubmitted(false);
    setRevealCount(0);
    refs.daysWorked.current?.focus();
  }

  const daysInput = (
    field: "daysWorked" | "carried" | "refused" | "taken" | "wageDays",
    value: string,
    set: (value: string) => void,
    placeholder: string,
    label: string,
    hint?: string,
  ) => (
    <FormField id={FIELD_IDS[field]} label={label} hint={hint} error={errorForField(field)}>
      {(control) => (
        <AffixInput
          {...control}
          ref={refs[field]}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          suffix={t.daysSuffix}
          placeholder={placeholder}
          value={value}
          onChange={(event) => set(event.target.value)}
        />
      )}
    </FormField>
  );

  function errorForField(field: LeaveField): string | undefined {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error, rule) : undefined;
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField id={RULE_ID} label={t.rule} hint={t.ruleHint}>
              {(control) => (
                <Select
                  {...control}
                  value={rule}
                  onChange={(event) => {
                    if (isRuleId(event.target.value)) setRule(event.target.value);
                  }}
                >
                  {LEAVE_RULES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {t.rules[r.id]}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <SegmentedControl
              name={ELIGIBLE_NAME}
              legend={t.eligibleLegend}
              value={eligible}
              onChange={setEligible}
              options={[
                { value: "yes", label: t.eligibleYes },
                { value: "no", label: t.eligibleNo },
              ]}
            />
          </div>
          {daysInput("daysWorked", daysWorked, setDaysWorked, t.daysWorkedPlaceholder, t.daysWorked, t.daysWorkedHint)}
          {daysInput("carried", carried, setCarried, t.carriedPlaceholder, t.carried, t.carriedHint)}
          {daysInput("taken", taken, setTaken, t.takenPlaceholder, t.taken)}
          {daysInput("refused", refused, setRefused, t.refusedPlaceholder, t.refused, t.refusedHint)}

          <div className="sm:col-span-2">
            <h3 className="font-display text-base font-semibold text-slate-900">{t.encashTitle}</h3>
            <p className="mt-1 text-sm text-slate-600">{t.encashHint}</p>
          </div>
          <FormField id={FIELD_IDS.wage} label={t.wage} hint={t.wageHint} error={errorForField("wage")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.wage}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.wagePlaceholder}
                value={wage}
                onChange={(event) => setWage(event.target.value)}
              />
            )}
          </FormField>
          {daysInput("wageDays", wageDays, setWageDays, t.wageDaysPlaceholder, t.wageDays, t.wageDaysHint)}
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(t.daysUnit(formatNumber(result.remaining))) : ""}
        result={result && <LeaveResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function LeaveResultView({ result: r }: { result: LeaveResult }) {
  const t = STRINGS[useLocale()];
  const n = (v: number) => formatNumber(v);
  const days = (v: number) => t.daysUnit(n(v));
  const stats = [
    { label: r.eligible ? t.earned : t.earnedNotYet, value: days(r.earned) },
    { label: t.available(r.rule.cap === null ? t.capNone : t.capLimit(n(r.rule.cap))), value: days(r.available) },
    { label: t.takenStat, value: days(r.taken) },
    ...(r.refused > 0 ? [{ label: t.refusedStat, value: days(r.refused) }] : []),
    ...(r.encashment
      ? [
          { label: t.dailyWage, value: money(r.encashment.dailyWage) },
          { label: t.encashment, value: money(r.encashment.value) },
        ]
      : []),
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="leave-result-heading"
        value={<p className="font-display text-4xl font-bold tracking-tight break-words sm:text-5xl">{days(r.remaining)}</p>}
      >
        <p className="text-sm text-slate-700">{formulaText(t, r)}</p>
        <ResultStats items={stats} className="mt-4" />
        {r.overCap > 0 && <p className="mt-4 text-sm font-medium text-slate-800">{t.capped(n(r.overCap))}</p>}
        {r.eligible && r.remainderDays > 0 && (
          <p className="mt-2 text-sm text-slate-600">{t.remainder(n(r.rule.interval - r.remainderDays), r.rule.interval)}</p>
        )}
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}
