"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  calculateHeight,
  HEIGHT_MODES,
  MAX_CM,
  MAX_FEET,
  type HeightError,
  type HeightField,
  type HeightMode,
  type HeightResult,
} from "./logic";

const SLUG = "height-converter";
/** Remembered in this browser: which way the user converts. */
const MODE_PREF = choicePreference(SLUG, "mode", HEIGHT_MODES, "ft-in");

const FIELD_IDS: Record<HeightField, string> = {
  feet: "height-feet",
  inches: "height-inches",
  cm: "height-cm",
};

const num = (value: number, decimals = 2) => formatNumber(value, { decimals });

const STRINGS = {
  en: {
    submit: "Convert height",
    modeLegend: "Convert from",
    modes: { "ft-in": "Feet and inches", cm: "Centimetres" } satisfies Record<HeightMode, string>,
    feet: "Feet",
    inches: "Inches",
    inchesHint: "Leave blank for 0.",
    cm: "Height in cm",
    ftSuffix: "ft",
    inSuffix: "in",
    cmSuffix: "cm",
    errFeet: "feet",
    errInches: "inches",
    errCm: "height",
    errFeetMin: "0 or more",
    errFeetMax: `${MAX_FEET} or less`,
    errInchesMin: "0 or more",
    errInchesMax: "less than 12 (use the feet box for whole feet)",
    errCmMin: "more than 0 cm",
    errCmMax: `${MAX_CM} cm or less`,
    errZero: "Enter a height above 0.",
    feetInches: (f: string, i: string) => `${f} ft ${i} in`,
    resultTitle: (input: string) => `${input} is`,
    metres: "Metres",
    totalInches: "Total inches",
    haat: "হাত (18 in each)",
    goj: "গজ (yard, 36 in)",
    note: "1 inch = 2.54 cm exactly. Inches are shown to 1 decimal.",
    announcement: (cm: string, ftIn: string) => `${cm} cm, which is ${ftIn}.`,
    placeholderTitleFirst: "The conversion will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter a height, then select Convert height.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    shareTitle: "Height converted with HisabBD",
    shareText: (ftIn: string, cm: string, m: string) =>
      `${ftIn} = ${cm} cm = ${m} m. Converted with HisabBD’s Height Converter.`,
  },
  bn: {
    submit: "উচ্চতা রূপান্তর করুন",
    modeLegend: "কোন একক থেকে",
    modes: { "ft-in": "ফুট-ইঞ্চি", cm: "সেন্টিমিটার" } satisfies Record<HeightMode, string>,
    feet: "ফুট",
    inches: "ইঞ্চি",
    inchesHint: "না থাকলে ফাঁকা রাখুন।",
    cm: "উচ্চতা সেমিতে",
    ftSuffix: "ফুট",
    inSuffix: "ইঞ্চি",
    cmSuffix: "সেমি",
    errFeet: "ফুট",
    errInches: "ইঞ্চি",
    errCm: "উচ্চতা",
    errFeetMin: "0 বা তার বেশি",
    errFeetMax: `${MAX_FEET} বা তার কম`,
    errInchesMin: "0 বা তার বেশি",
    errInchesMax: "12-এর কম (পূর্ণ ফুট ফুটের ঘরে লিখুন)",
    errCmMin: "0 সেমির বেশি",
    errCmMax: `${MAX_CM} সেমি বা তার কম`,
    errZero: "0-এর বেশি উচ্চতা লিখুন।",
    feetInches: (f: string, i: string) => `${f} ফুট ${i} ইঞ্চি`,
    resultTitle: (input: string) => `${input} সমান`,
    metres: "মিটার",
    totalInches: "মোট ইঞ্চি",
    haat: "হাত (প্রতি হাত 18 ইঞ্চি)",
    goj: "গজ (36 ইঞ্চি)",
    note: "1 ইঞ্চি = ঠিক 2.54 সেমি। ইঞ্চি দেখানো হয় এক দশমিক পর্যন্ত।",
    announcement: (cm: string, ftIn: string) => `${cm} সেমি, অর্থাৎ ${ftIn}।`,
    placeholderTitleFirst: "রূপান্তর এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "উচ্চতা লিখে “উচ্চতা রূপান্তর করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে উচ্চতা রূপান্তর",
    shareText: (ftIn: string, cm: string, m: string) =>
      `${ftIn} = ${cm} সেমি = ${m} মিটার। HisabBD-র উচ্চতা রূপান্তরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: HeightError): string {
  if (error.code === "zero") return t.errZero;
  switch (error.field) {
    case "feet":
      return numberErrorMessage(error.code, { label: t.errFeet, min: t.errFeetMin, max: t.errFeetMax }, locale);
    case "inches":
      return numberErrorMessage(error.code, { label: t.errInches, min: t.errInchesMin, max: t.errInchesMax }, locale);
    case "cm":
      return numberErrorMessage(error.code, { label: t.errCm, min: t.errCmMin, max: t.errCmMax }, locale);
  }
}

function ftInText(t: Strings, r: HeightResult): string {
  return t.feetInches(num(r.feet), num(r.inches, 1));
}

function inputText(t: Strings, r: HeightResult): string {
  return r.mode === "cm" ? `${num(r.cm)} ${t.cmSuffix}` : ftInText(t, r);
}

function shareText(t: Strings, r: HeightResult): string {
  return t.shareText(ftInText(t, r), num(r.cm), num(r.m, 4));
}

export function HeightCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [mode, setMode] = usePreference(MODE_PREF);
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [cm, setCm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const refs = {
    feet: useRef<HTMLInputElement>(null),
    inches: useRef<HTMLInputElement>(null),
    cm: useRef<HTMLInputElement>(null),
  };

  const raw = { feet, inches, cm };
  const calc = submitted ? calculateHeight(mode, raw) : null;
  const errorFor = (field: HeightField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateHeight(mode, raw);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record(mode === "cm" ? { mode, cm } : { mode, feet, inches }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedMode = text("mode");
    if (MODE_PREF.isValid(savedMode)) setMode(savedMode);
    setFeet(text("feet"));
    setInches(text("inches"));
    setCm(text("cm"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    setFeet("");
    setInches("");
    setCm("");
    setSubmitted(false);
    setRevealCount(0);
    (mode === "cm" ? refs.cm : refs.feet).current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="space-y-5">
          <SegmentedControl
            name="height-mode"
            legend={t.modeLegend}
            options={HEIGHT_MODES.map((value) => ({ value, label: t.modes[value] }))}
            value={mode}
            onChange={setMode}
          />
          {mode === "ft-in" ? (
            <div className="grid grid-cols-2 gap-5">
              <FormField id={FIELD_IDS.feet} label={t.feet} error={errorFor("feet")}>
                {(control) => (
                  <AffixInput
                    {...control}
                    ref={refs.feet}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    suffix={t.ftSuffix}
                    placeholder="5"
                    value={feet}
                    onChange={(event) => setFeet(event.target.value)}
                  />
                )}
              </FormField>
              <FormField id={FIELD_IDS.inches} label={t.inches} hint={t.inchesHint} error={errorFor("inches")}>
                {(control) => (
                  <AffixInput
                    {...control}
                    ref={refs.inches}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    suffix={t.inSuffix}
                    placeholder="4"
                    value={inches}
                    onChange={(event) => setInches(event.target.value)}
                  />
                )}
              </FormField>
            </div>
          ) : (
            <FormField id={FIELD_IDS.cm} label={t.cm} error={errorFor("cm")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.cm}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix={t.cmSuffix}
                  placeholder="165"
                  value={cm}
                  onChange={(event) => setCm(event.target.value)}
                />
              )}
            </FormField>
          )}
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(num(result.cm), ftInText(t, result)) : ""}
        result={result && <HeightResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">– {t.cmSuffix}</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function HeightResultView({ result: r }: { result: HeightResult }) {
  const t = STRINGS[useLocale()];
  const big = r.mode === "cm" ? ftInText(t, r) : `${num(r.cm)} ${t.cmSuffix}`;
  const stats = [
    ...(r.mode === "cm" ? [] : [{ label: t.modes.cm, value: num(r.cm) }]),
    { label: t.metres, value: num(r.m, 4) },
    { label: t.totalInches, value: num(r.totalInches) },
    { label: t.haat, value: num(r.haat, 3) },
    { label: t.goj, value: num(r.goj, 3) },
  ];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        actions={<ResultActions key={text} text={text} shareTitle={t.shareTitle} />}
        title={t.resultTitle(inputText(t, r))}
        titleId="height-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{big}</p>}
      >
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.note}</p>
      </ResultPanel>
    </div>
  );
}
