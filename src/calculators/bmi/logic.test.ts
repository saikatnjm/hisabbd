import { describe, expect, it } from "vitest";
import {
  bmiFromMetric,
  calculateBmi,
  classifyBmi,
  feetInchesToCm,
  healthyWeightRangeKg,
  kgToLb,
  lbToKg,
  type BmiCalculation,
  type BmiInput,
} from "./logic";

const BASE: BmiInput = {
  heightUnit: "cm",
  heightCm: "170",
  heightFeet: "",
  heightInches: "",
  weightUnit: "kg",
  weight: "70",
};

function run(overrides: Partial<BmiInput> = {}) {
  return calculateBmi({ ...BASE, ...overrides });
}

function ok(overrides: Partial<BmiInput> = {}) {
  const calc = run(overrides);
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: BmiCalculation) => (calc.ok ? [] : calc.errors);

describe("unit conversions", () => {
  it("uses the exact inch and pound factors", () => {
    expect(feetInchesToCm(5, 7)).toBeCloseTo(170.18, 10);
    expect(feetInchesToCm(6, 0)).toBeCloseTo(182.88, 10);
    expect(feetInchesToCm(0, 1)).toBeCloseTo(2.54, 10);
    expect(lbToKg(1)).toBe(0.45359237);
    expect(lbToKg(100)).toBeCloseTo(45.359237, 10);
    expect(kgToLb(0.45359237)).toBeCloseTo(1, 12);
    expect(kgToLb(lbToKg(154))).toBeCloseTo(154, 10);
  });
});

describe("bmiFromMetric", () => {
  it("is kg divided by metres squared", () => {
    expect(bmiFromMetric(70, 170)).toBeCloseTo(24.2214532872, 8);
    expect(bmiFromMetric(50, 160)).toBeCloseTo(19.53125, 8);
    expect(bmiFromMetric(100, 200)).toBeCloseTo(25, 10);
    expect(bmiFromMetric(100, 175)).toBeCloseTo(32.6530612245, 8);
  });

  it("rejects zero and negative values", () => {
    expect(() => bmiFromMetric(0, 170)).toThrow();
    expect(() => bmiFromMetric(70, 0)).toThrow();
    expect(() => bmiFromMetric(-70, 170)).toThrow();
  });
});

describe("classifyBmi", () => {
  it("classifies each WHO band", () => {
    expect(classifyBmi(15)).toEqual({ category: "underweight", obesityClass: null });
    expect(classifyBmi(18.4)).toEqual({ category: "underweight", obesityClass: null });
    expect(classifyBmi(18.5)).toEqual({ category: "healthy", obesityClass: null });
    expect(classifyBmi(24.9)).toEqual({ category: "healthy", obesityClass: null });
    expect(classifyBmi(25)).toEqual({ category: "overweight", obesityClass: null });
    expect(classifyBmi(29.9)).toEqual({ category: "overweight", obesityClass: null });
    expect(classifyBmi(30)).toEqual({ category: "obesity", obesityClass: 1 });
    expect(classifyBmi(34.9)).toEqual({ category: "obesity", obesityClass: 1 });
    expect(classifyBmi(35)).toEqual({ category: "obesity", obesityClass: 2 });
    expect(classifyBmi(39.9)).toEqual({ category: "obesity", obesityClass: 2 });
    expect(classifyBmi(40)).toEqual({ category: "obesity", obesityClass: 3 });
    expect(classifyBmi(60)).toEqual({ category: "obesity", obesityClass: 3 });
  });
});

describe("healthyWeightRangeKg", () => {
  it("is 18.5 and 24.9 times height squared", () => {
    const range = healthyWeightRangeKg(170);
    expect(range.min).toBeCloseTo(53.465, 8);
    expect(range.max).toBeCloseTo(71.961, 8);
    const at100 = healthyWeightRangeKg(100);
    expect(at100.min).toBeCloseTo(18.5, 10);
    expect(at100.max).toBeCloseTo(24.9, 10);
  });
});

describe("calculateBmi in metric", () => {
  it("calculates a healthy BMI", () => {
    const r = ok();
    expect(r.bmi).toBeCloseTo(24.2214532872, 8);
    expect(r.bmiRounded).toBe(24.2);
    expect(r.category).toBe("healthy");
    expect(r.obesityClass).toBeNull();
    expect(r.heightCm).toBe(170);
    expect(r.weightKg).toBe(70);
  });

  it("calculates underweight", () => {
    const r = ok({ heightCm: "170", weight: "50" });
    expect(r.bmiRounded).toBe(17.3);
    expect(r.category).toBe("underweight");
  });

  it("calculates obesity class I", () => {
    const r = ok({ heightCm: "175", weight: "100" });
    expect(r.bmiRounded).toBe(32.7);
    expect(r.category).toBe("obesity");
    expect(r.obesityClass).toBe(1);
  });

  it("calculates obesity class II and III", () => {
    expect(ok({ heightCm: "170", weight: "105" }).obesityClass).toBe(2);
    expect(ok({ heightCm: "170", weight: "130" }).obesityClass).toBe(3);
  });

  it("accepts decimals, commas and Bangla digits", () => {
    expect(ok({ heightCm: "170.5", weight: "70.5" }).bmiRounded).toBe(24.3);
    expect(ok({ heightCm: "১৭০", weight: "৭০" }).bmiRounded).toBe(24.2);
  });

  it("returns the healthy weight range in kg", () => {
    const range = ok().healthyWeightRange;
    expect(range.unit).toBe("kg");
    expect(range.min).toBeCloseTo(53.465, 8);
    expect(range.max).toBeCloseTo(71.961, 8);
  });
});

describe("rounding and category agree", () => {
  it("classifies on the rounded BMI", () => {
    // 24.95 / 1² = 24.95 → shown as 25.0 → Overweight
    const high = ok({ heightCm: "100", weight: "24.95" });
    expect(high.bmiRounded).toBe(25);
    expect(high.category).toBe("overweight");
    // 24.94 → shown as 24.9 → Healthy
    const low = ok({ heightCm: "100", weight: "24.94" });
    expect(low.bmiRounded).toBe(24.9);
    expect(low.category).toBe("healthy");
  });

  it("puts the exact edges in the upper band", () => {
    expect(ok({ heightCm: "100", weight: "18.5" }).category).toBe("healthy");
    expect(ok({ heightCm: "200", weight: "100" }).category).toBe("overweight");
    expect(ok({ heightCm: "100", weight: "30" }).obesityClass).toBe(1);
    expect(ok({ heightCm: "100", weight: "18.44" }).bmiRounded).toBe(18.4);
    expect(ok({ heightCm: "100", weight: "18.44" }).category).toBe("underweight");
  });
});

describe("imperial input", () => {
  it("converts feet, inches and pounds", () => {
    const r = ok({ heightUnit: "ftin", heightFeet: "5", heightInches: "7", weightUnit: "lb", weight: "154" });
    expect(r.heightCm).toBeCloseTo(170.18, 8);
    expect(r.weightKg).toBeCloseTo(69.85322498, 8);
    expect(r.bmiRounded).toBe(24.1);
    expect(r.category).toBe("healthy");
  });

  it("treats empty inches as 0", () => {
    const r = ok({ heightUnit: "ftin", heightFeet: "6", heightInches: "", weight: "90" });
    expect(r.heightCm).toBeCloseTo(182.88, 8);
    expect(r.bmiRounded).toBe(26.9);
  });

  it("shows the healthy range in pounds", () => {
    const r = ok({ heightUnit: "ftin", heightFeet: "5", heightInches: "7", weightUnit: "lb", weight: "154" });
    expect(r.healthyWeightRange.unit).toBe("lb");
    expect(r.healthyWeightRange.min).toBeCloseTo(118.1199, 3);
    expect(r.healthyWeightRange.max).toBeCloseTo(158.983, 3);
  });

  it("ignores the cm field when ft + in is selected", () => {
    const r = ok({ heightUnit: "ftin", heightCm: "", heightFeet: "5", heightInches: "0" });
    expect(r.heightCm).toBeCloseTo(152.4, 8);
  });
});

describe("height validation", () => {
  it("requires a height", () => {
    expect(errors(run({ heightCm: "" }))).toEqual([{ field: "heightCm", code: "missing" }]);
    expect(errors(run({ heightUnit: "ftin", heightFeet: "" }))).toEqual([{ field: "heightFeet", code: "missing" }]);
  });

  it("rejects text and negatives", () => {
    expect(errors(run({ heightCm: "tall" }))).toEqual([{ field: "heightCm", code: "invalid" }]);
    expect(errors(run({ heightCm: "-170" }))).toEqual([{ field: "heightCm", code: "too-small" }]);
  });

  it("enforces 50 to 272 cm", () => {
    expect(run({ heightCm: "50", weight: "5" }).ok).toBe(true);
    expect(run({ heightCm: "272" }).ok).toBe(true);
    expect(errors(run({ heightCm: "49.9" }))).toEqual([{ field: "heightCm", code: "too-small" }]);
    expect(errors(run({ heightCm: "272.1" }))).toEqual([{ field: "heightCm", code: "too-large" }]);
    expect(errors(run({ heightCm: "0" }))).toEqual([{ field: "heightCm", code: "too-small" }]);
  });

  it("enforces feet 1 to 8 as a whole number", () => {
    expect(errors(run({ heightUnit: "ftin", heightFeet: "0", heightInches: "5" }))).toEqual([
      { field: "heightFeet", code: "too-small" },
    ]);
    expect(errors(run({ heightUnit: "ftin", heightFeet: "9", heightInches: "0" }))).toEqual([
      { field: "heightFeet", code: "too-large" },
    ]);
    expect(errors(run({ heightUnit: "ftin", heightFeet: "5.5", heightInches: "0" }))).toEqual([
      { field: "heightFeet", code: "not-integer" },
    ]);
  });

  it("requires inches from 0 up to but not including 12", () => {
    const ftin = { heightUnit: "ftin" as const, heightFeet: "5" };
    expect(run({ ...ftin, heightInches: "0" }).ok).toBe(true);
    expect(run({ ...ftin, heightInches: "11.9" }).ok).toBe(true);
    expect(errors(run({ ...ftin, heightInches: "12" }))).toEqual([{ field: "heightInches", code: "too-large" }]);
    expect(errors(run({ ...ftin, heightInches: "-1" }))).toEqual([{ field: "heightInches", code: "too-small" }]);
    expect(errors(run({ ...ftin, heightInches: "abc" }))).toEqual([{ field: "heightInches", code: "invalid" }]);
  });

  it("checks the total ft + in height against the cm range", () => {
    // 1 ft 0 in = 30.48 cm, below 50 cm
    expect(errors(run({ heightUnit: "ftin", heightFeet: "1", heightInches: "0" }))).toEqual([
      { field: "heightFeet", code: "height-range" },
    ]);
    // 1 ft 7.7 in = 50.04 cm, allowed
    expect(run({ heightUnit: "ftin", heightFeet: "1", heightInches: "7.7", weight: "5" }).ok).toBe(true);
    // 8 ft 11 in = 271.78 cm, allowed; 8 ft 11.9 in = 274.07 cm, too tall
    expect(run({ heightUnit: "ftin", heightFeet: "8", heightInches: "11" }).ok).toBe(true);
    expect(errors(run({ heightUnit: "ftin", heightFeet: "8", heightInches: "11.9" }))).toEqual([
      { field: "heightFeet", code: "height-range" },
    ]);
  });
});

describe("weight validation", () => {
  it("requires a number", () => {
    expect(errors(run({ weight: "" }))).toEqual([{ field: "weight", code: "missing" }]);
    expect(errors(run({ weight: "heavy" }))).toEqual([{ field: "weight", code: "invalid" }]);
  });

  it("enforces 2 to 650 kg", () => {
    expect(run({ heightCm: "50", weight: "2" }).ok).toBe(true);
    expect(run({ heightCm: "272", weight: "650" }).ok).toBe(true);
    expect(errors(run({ weight: "1.9" }))).toEqual([{ field: "weight", code: "too-small" }]);
    expect(errors(run({ weight: "0" }))).toEqual([{ field: "weight", code: "too-small" }]);
    expect(errors(run({ weight: "-60" }))).toEqual([{ field: "weight", code: "too-small" }]);
    expect(errors(run({ weight: "650.1" }))).toEqual([{ field: "weight", code: "too-large" }]);
  });

  it("converts pounds before checking the range", () => {
    // 4.4 lb = 1.996 kg (too small); 4.41 lb = 2.0004 kg (ok)
    expect(errors(run({ weightUnit: "lb", weight: "4.4" }))).toEqual([{ field: "weight", code: "too-small" }]);
    expect(run({ heightCm: "50", weightUnit: "lb", weight: "4.41" }).ok).toBe(true);
    // 1433 lb = 649.998 kg (ok); 1433.1 lb = 650.04 kg (too large)
    expect(run({ heightCm: "272", weightUnit: "lb", weight: "1433" }).ok).toBe(true);
    expect(errors(run({ weightUnit: "lb", weight: "1433.1" }))).toEqual([{ field: "weight", code: "too-large" }]);
  });
});

describe("multiple errors", () => {
  it("reports every invalid field", () => {
    expect(errors(run({ heightCm: "", weight: "" }))).toEqual([
      { field: "heightCm", code: "missing" },
      { field: "weight", code: "missing" },
    ]);
    expect(
      errors(run({ heightUnit: "ftin", heightFeet: "", heightInches: "13", weight: "x" })).map((e) => e.field),
    ).toEqual(["heightFeet", "heightInches", "weight"]);
  });

  it("never returns NaN or Infinity for valid input", () => {
    const r = ok({ heightCm: "50", weight: "650" });
    expect(Number.isFinite(r.bmi)).toBe(true);
    expect(r.bmiRounded).toBe(2600);
    expect(r.obesityClass).toBe(3);
  });
});
