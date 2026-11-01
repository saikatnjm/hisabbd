"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { AffixInput, FormField, SegmentedControl } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber } from "@/lib/format";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import { calculateTemperature, TEMPERATURE_UNITS, type TemperatureResult, type TemperatureUnit } from "./logic";

const SLUG = "temperature-converter";
/** Remembered in this browser: the unit the thermometer reads. */
const UNIT_PREF = choicePreference(SLUG, "from", TEMPERATURE_UNITS, "f");

const VALUE_ID = "temperature-value";
const deg = (value: number) => formatNumber(value, { decimals: 2 });

const STRINGS = {
  en: {
    submit: "Convert",
    unitLegend: "Thermometer reads in",
    units: { f: "°F (Fahrenheit)", c: "°C (Celsius)" } satisfies Record<TemperatureUnit, string>,
    value: "Temperature",
    placeholder: { f: "e.g. 102", c: "e.g. 38.5" } satisfies Record<TemperatureUnit, string>,
    errLabel: "temperature",
    errMin: "above absolute zero (−273.15 °C, −459.67 °F)",
    errMax: "1,000 °C (1,832 °F) or less",
    resultTitle: (v: string) => `${v} is`,
    fever: "38 °C (100.4 °F) or above: a high temperature (fever) by the NHS definition.",
    noFever: "Below 38 °C (100.4 °F): not a high temperature by the NHS definition. You can still feel feverish below it.",
    babyNote: "For a baby under 3 months at 38 °C or more, or 3–6 months at 39 °C or more, get medical help straight away (NHS).",
    disclaimer: "This converts and compares with the NHS line; it is not a diagnosis. If you are worried, see a doctor.",
    announcement: (from: string, to: string) => `${from} is ${to}.`,
    placeholderTitleFirst: "The conversion will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter a temperature, then select Convert.",
    placeholderFix: "Fix the highlighted temperature above and the result will show here.",
    shareTitle: "Temperature converted with HisabBD",
    shareText: (from: string, to: string) => `${from} = ${to}. Converted with HisabBD’s Fever Temperature Converter.`,
  },
  bn: {
    submit: "রূপান্তর করুন",
    unitLegend: "থার্মোমিটারের একক",
    units: { f: "°F (ফারেনহাইট)", c: "°C (সেলসিয়াস)" } satisfies Record<TemperatureUnit, string>,
    value: "তাপমাত্রা",
    placeholder: { f: "যেমন 102", c: "যেমন 38.5" } satisfies Record<TemperatureUnit, string>,
    errLabel: "তাপমাত্রা",
    errMin: "পরম শূন্যের (−273.15 °C, −459.67 °F) বেশি",
    errMax: "1,000 °C (1,832 °F) বা তার কম",
    resultTitle: (v: string) => `${v} সমান`,
    fever: "38 °C (100.4 °F) বা বেশি: এনএইচএসের সংজ্ঞায় উচ্চ তাপমাত্রা (জ্বর)।",
    noFever: "38 °C (100.4 °F)-এর কম: এনএইচএসের সংজ্ঞায় উচ্চ তাপমাত্রা নয়। এর কমেও জ্বর-জ্বর লাগতে পারে।",
    babyNote: "3 মাসের কম বয়সী শিশুর 38 °C বা বেশি, কিংবা 3–6 মাসের শিশুর 39 °C বা বেশি হলে দেরি না করে চিকিৎসকের সাহায্য নিন (এনএইচএস)।",
    disclaimer: "এটি শুধু তাপমাত্রা বদলায় আর এনএইচএসের সীমার সঙ্গে মেলায়; রোগনির্ণয় নয়। দুশ্চিন্তা হলে ডাক্তার দেখান।",
    announcement: (from: string, to: string) => `${from} সমান ${to}।`,
    placeholderTitleFirst: "রূপান্তর এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "তাপমাত্রা লিখে “রূপান্তর করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত তাপমাত্রাটি ঠিক করলেই ফল এখানে দেখা যাবে।",
    shareTitle: "HisabBD দিয়ে তাপমাত্রা রূপান্তর",
    shareText: (from: string, to: string) => `${from} = ${to}। HisabBD-র জ্বরের তাপমাত্রা রূপান্তরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function fromText(r: TemperatureResult): string {
  return r.from === "f" ? `${deg(r.fahrenheit)} °F` : `${deg(r.celsius)} °C`;
}

function toText(r: TemperatureResult): string {
  return r.from === "f" ? `${deg(r.celsius)} °C` : `${deg(r.fahrenheit)} °F`;
}

function shareText(t: Strings, r: TemperatureResult): string {
  return t.shareText(fromText(r), toText(r));
}

export function TemperatureCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [unit, setUnit] = usePreference(UNIT_PREF);
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();
  const valueRef = useRef<HTMLInputElement>(null);

  const calc = submitted ? calculateTemperature(value, unit) : null;
  const error = calc && !calc.ok ? calc.errors[0] : undefined;
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateTemperature(value, unit);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ value, unit }, shareText(t, check.result));
    } else {
      valueRef.current?.focus();
    }
  }

  /** Fills the form from a saved calculation (values come from storage, so each is checked) and shows the result. */
  function restore(saved: Readonly<Record<string, string>>) {
    setValue(typeof saved.value === "string" ? saved.value : "");
    const savedUnit = typeof saved.unit === "string" ? saved.unit : "";
    if (UNIT_PREF.isValid(savedUnit)) setUnit(savedUnit);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    setValue("");
    setSubmitted(false);
    setRevealCount(0);
    valueRef.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="space-y-5">
          <SegmentedControl
            name="temperature-unit"
            legend={t.unitLegend}
            options={TEMPERATURE_UNITS.map((u) => ({ value: u, label: t.units[u] }))}
            value={unit}
            onChange={setUnit}
          />
          <FormField
            id={VALUE_ID}
            label={t.value}
            error={error ? numberErrorMessage(error.code, { label: t.errLabel, min: t.errMin, max: t.errMax }, locale) : undefined}
          >
            {(control) => (
              <AffixInput
                {...control}
                ref={valueRef}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                suffix={unit === "f" ? "°F" : "°C"}
                placeholder={t.placeholder[unit]}
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(fromText(result), toText(result)) : ""}
        result={result && <TemperatureResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">– {unit === "f" ? "°C" : "°F"}</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function TemperatureResultView({ result: r }: { result: TemperatureResult }) {
  const t = STRINGS[useLocale()];
  const text = shareText(t, r);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle(fromText(r))}
        titleId="temperature-result-heading"
        value={<p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{toText(r)}</p>}
      >
        {r.fever !== "not-body" && (
          <div className="space-y-2 rounded-xl bg-white/70 px-4 py-3 text-slate-800">
            <p className="font-semibold">{r.fever === "fever" ? t.fever : t.noFever}</p>
            <p className="text-sm">{t.babyNote}</p>
          </div>
        )}
        <p className="mt-4 text-sm text-slate-600">{t.disclaimer}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}
