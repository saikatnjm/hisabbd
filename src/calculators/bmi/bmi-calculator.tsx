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
import { formatNumber } from "@/lib/format";
import {
  calculateBmi,
  kgToLb,
  WEIGHT_RANGE_KG,
  type BmiCategoryId,
  type BmiError,
  type BmiField,
  type BmiResult,
  type HeightUnit,
  type WeightUnit,
} from "./logic";

const FIELD_IDS: Record<BmiField, string> = {
  heightCm: "bmi-height-cm",
  heightFeet: "bmi-height-feet",
  heightInches: "bmi-height-inches",
  weight: "bmi-weight",
};

const HEIGHT_UNITS: readonly { value: HeightUnit; label: string }[] = [
  { value: "cm", label: "cm" },
  { value: "ftin", label: "ft + in" },
];
const WEIGHT_UNITS: readonly { value: WeightUnit; label: string }[] = [
  { value: "kg", label: "kg" },
  { value: "lb", label: "lb" },
];

const CATEGORY_NAMES: Record<BmiCategoryId, string> = {
  underweight: "Underweight",
  healthy: "Healthy weight",
  overweight: "Overweight",
  obesity: "Obesity",
};

const CATEGORY_NOTES: Record<BmiCategoryId, string> = {
  underweight:
    "This is below the adult healthy range. Some people are naturally slim, but if you have lost weight without trying or feel unwell, it’s worth talking to a doctor.",
  healthy:
    "This is within the adult healthy range. BMI doesn’t measure body fat, fitness or overall health, so it is only one piece of the picture.",
  overweight:
    "This is above the adult healthy range. BMI alone doesn’t show body fat or health, so look at it together with things like waist size, diet and activity, and ask a doctor if you’re unsure.",
  obesity:
    "On average, a higher BMI goes with a higher risk of some health problems, but BMI alone is not a diagnosis. A doctor can look at your whole health and suggest next steps.",
};

/** The visual scale runs from BMI 15 to 40; values outside are pinned to the ends. */
const SCALE_MIN = 15;
const SCALE_MAX = 40;
const SCALE_BANDS: readonly { id: BmiCategoryId; from: number; to: number; color: string; range: string }[] = [
  { id: "underweight", from: 15, to: 18.5, color: "bg-sky-400", range: "below 18.5" },
  { id: "healthy", from: 18.5, to: 25, color: "bg-emerald-500", range: "18.5 to 24.9" },
  { id: "overweight", from: 25, to: 30, color: "bg-amber-400", range: "25 to 29.9" },
  { id: "obesity", from: 30, to: 40, color: "bg-rose-500", range: "30 and above" },
];

const OBESITY_CLASS_NAMES = { 1: "class I", 2: "class II", 3: "class III" } as const;

function categoryLabel(r: BmiResult): string {
  const name = CATEGORY_NAMES[r.category];
  return r.obesityClass ? `${name} (${OBESITY_CLASS_NAMES[r.obesityClass]})` : name;
}

function scalePercent(bmi: number): number {
  const clamped = Math.min(Math.max(bmi, SCALE_MIN), SCALE_MAX);
  return ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
}

/** Weight limits as shown in messages, in the chosen unit (rounded inwards so they are valid). */
function weightLimits(unit: WeightUnit): { min: string; max: string } {
  if (unit === "kg") return { min: `at least ${WEIGHT_RANGE_KG.min} kg`, max: `${WEIGHT_RANGE_KG.max} kg or less` };
  const min = Math.ceil(kgToLb(WEIGHT_RANGE_KG.min) * 100) / 100;
  const max = Math.floor(kgToLb(WEIGHT_RANGE_KG.max) * 100) / 100;
  return { min: `at least ${formatNumber(min)} lb`, max: `${formatNumber(max)} lb or less` };
}

function errorMessage(error: BmiError, weightUnit: WeightUnit): string {
  switch (error.field) {
    case "heightCm":
      return numberErrorMessage(error.code === "height-range" ? "invalid" : error.code, {
        label: "height in centimetres",
        min: "at least 50 cm",
        max: "272 cm or less",
      });
    case "heightFeet":
      if (error.code === "height-range") {
        return "The total height must be between about 50 cm and 272 cm (roughly 1 ft 8 in to 8 ft 11 in).";
      }
      return numberErrorMessage(error.code, { label: "feet", min: "at least 1", max: "8 or less" });
    case "heightInches":
      return numberErrorMessage(error.code === "height-range" ? "invalid" : error.code, {
        label: "inches",
        min: "0 or more",
        max: "less than 12 (put whole feet in the feet box)",
      });
    case "weight":
      return numberErrorMessage(error.code === "height-range" ? "invalid" : error.code, {
        label: "weight",
        ...weightLimits(weightUnit),
      });
  }
}

function shareText(r: BmiResult): string {
  const range = r.healthyWeightRange;
  return (
    `BMI ${formatNumber(r.bmiRounded, { decimals: 1, minDecimals: 1 })} (${categoryLabel(r)}) ` +
    `at ${formatNumber(r.heightCm, { decimals: 1 })} cm and ${formatNumber(r.weightKg, { decimals: 1 })} kg. ` +
    `Healthy weight range for this height: ${formatNumber(range.min, { decimals: 1 })} to ` +
    `${formatNumber(range.max, { decimals: 1 })} ${range.unit}. BMI is a screening measure, not a diagnosis. ` +
    `Calculated with HisabBD’s BMI Calculator.`
  );
}

export function BmiCalculator() {
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [heightCm, setHeightCm] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [weight, setWeight] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<BmiField, React.RefObject<HTMLInputElement | null>> = {
    heightCm: useRef<HTMLInputElement>(null),
    heightFeet: useRef<HTMLInputElement>(null),
    heightInches: useRef<HTMLInputElement>(null),
    weight: useRef<HTMLInputElement>(null),
  };

  const input = { heightUnit, heightCm, heightFeet, heightInches, weightUnit, weight };
  const calc = submitted ? calculateBmi(input) : null;
  const errorFor = (field: BmiField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(error, weightUnit) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateBmi(input);
    if (check.ok) {
      setRevealCount((n) => n + 1);
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onReset() {
    setHeightUnit("cm");
    setHeightCm("");
    setHeightFeet("");
    setHeightInches("");
    setWeightUnit("kg");
    setWeight("");
    setSubmitted(false);
    setRevealCount(0);
    refs.heightCm.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel="Calculate BMI">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <SegmentedControl
              name="bmi-height-unit"
              legend="Height unit"
              options={HEIGHT_UNITS}
              value={heightUnit}
              onChange={setHeightUnit}
            />
            {heightUnit === "cm" ? (
              <FormField id={FIELD_IDS.heightCm} label="Height" error={errorFor("heightCm")}>
                {(control) => (
                  <AffixInput
                    {...control}
                    ref={refs.heightCm}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    suffix="cm"
                    placeholder="e.g. 165"
                    value={heightCm}
                    onChange={(event) => setHeightCm(event.target.value)}
                  />
                )}
              </FormField>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <FormField id={FIELD_IDS.heightFeet} label="Feet" error={errorFor("heightFeet")}>
                  {(control) => (
                    <AffixInput
                      {...control}
                      ref={refs.heightFeet}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      suffix="ft"
                      placeholder="5"
                      value={heightFeet}
                      onChange={(event) => setHeightFeet(event.target.value)}
                    />
                  )}
                </FormField>
                <FormField id={FIELD_IDS.heightInches} label="Inches" error={errorFor("heightInches")}>
                  {(control) => (
                    <AffixInput
                      {...control}
                      ref={refs.heightInches}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      suffix="in"
                      placeholder="7"
                      value={heightInches}
                      onChange={(event) => setHeightInches(event.target.value)}
                    />
                  )}
                </FormField>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <SegmentedControl
              name="bmi-weight-unit"
              legend="Weight unit"
              options={WEIGHT_UNITS}
              value={weightUnit}
              onChange={setWeightUnit}
            />
            <FormField id={FIELD_IDS.weight} label="Weight" error={errorFor("weight")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.weight}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  suffix={weightUnit}
                  placeholder={weightUnit === "kg" ? "e.g. 62" : "e.g. 137"}
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                />
              )}
            </FormField>
          </div>
        </div>
        <p className="mt-5 text-sm text-slate-600">For adults aged 18 and over.</p>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? `Your BMI is ${formatNumber(result.bmiRounded, { decimals: 1, minDecimals: 1 })}: ${categoryLabel(result)}.` : ""}
        result={result && <BmiResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? "Almost there" : "Your BMI will appear here"}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–.–</p>}
          >
            {calc
              ? "Fix the highlighted fields above and your BMI will show here."
              : "Enter your height and weight, then select Calculate BMI."}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function BmiResultView({ result: r }: { result: BmiResult }) {
  const range = r.healthyWeightRange;
  const stats = [
    { label: "Category", value: categoryLabel(r) },
    {
      label: "Height and weight used",
      value: `${formatNumber(r.heightCm, { decimals: 1 })} cm, ${formatNumber(r.weightKg, { decimals: 1 })} kg`,
    },
    {
      label: "Healthy weight range for your height",
      value: `${formatNumber(range.min, { decimals: 1 })} to ${formatNumber(range.max, { decimals: 1 })} ${range.unit}`,
      wide: true,
    },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title="Your body mass index"
        titleId="bmi-result-heading"
        value={
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              {formatNumber(r.bmiRounded, { decimals: 1, minDecimals: 1 })}
            </span>
            <span className="text-xl font-semibold text-slate-800">{categoryLabel(r)}</span>
          </p>
        }
      >
        <BmiScale bmi={r.bmiRounded} current={r.category} />
        <p className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-slate-800">{CATEGORY_NOTES[r.category]}</p>
        <ResultStats items={stats} className="mt-5" />
        <p className="mt-4 text-sm text-slate-600">
          BMI is a screening measure for adults, not a diagnosis. It isn’t meant for children, teenagers, pregnancy
          or very muscular people.
        </p>
      </ResultPanel>

      <ResultActions key={shareText(r)} text={shareText(r)} shareTitle="BMI calculated with HisabBD" />
    </div>
  );
}

/** Decorative colour scale; the category is always also written as text. */
function BmiScale({ bmi, current }: { bmi: number; current: BmiCategoryId }) {
  return (
    <div>
      <div aria-hidden="true" className="relative pt-3 pb-1">
        <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
          {SCALE_BANDS.map((band) => (
            <div
              key={band.id}
              className={band.color}
              style={{ width: `${((band.to - band.from) / (SCALE_MAX - SCALE_MIN)) * 100}%` }}
            />
          ))}
        </div>
        <div
          className="absolute top-0 bottom-0 -translate-x-1/2"
          style={{ left: `${scalePercent(bmi)}%` }}
        >
          <div className="mx-auto h-full w-1 rounded-full bg-slate-900 ring-2 ring-white" />
        </div>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
        {SCALE_BANDS.map((band) => (
          <li key={band.id} className="flex items-center gap-2">
            <span aria-hidden="true" className={`size-3 shrink-0 rounded-full ${band.color}`} />
            <span className={band.id === current ? "font-semibold text-slate-900" : undefined}>
              {CATEGORY_NAMES[band.id]}: {band.range}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
