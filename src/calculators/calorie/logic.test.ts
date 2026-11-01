import { describe, expect, it } from "vitest";
import { roundTo } from "@/lib/number";
import { calculateCalories, mifflinStJeor, type CalorieCalculation } from "./logic";

function ok(calc: CalorieCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: CalorieCalculation) => (calc.ok ? [] : calc.errors);
const kcal = (n: number) => roundTo(n, 0);

describe("mifflinStJeor", () => {
  it("follows the 1990 equations", () => {
    expect(mifflinStJeor("male", 70, 170, 30)).toBe(1617.5);
    expect(mifflinStJeor("female", 55, 155, 30)).toBe(1207.75);
    // The sexes differ by 166 kcal for the same body.
    expect(mifflinStJeor("male", 60, 160, 40) - mifflinStJeor("female", 60, 160, 40)).toBe(166);
  });
});

describe("calculateCalories", () => {
  it("works out the page's examples", () => {
    const man = ok(calculateCalories("male", { age: "30", height: "170", weight: "70" }, "moderate"));
    expect(kcal(man.bmr)).toBe(1618);
    expect(kcal(man.daily)).toBe(2507);
    expect(Object.values(man.byActivity).map(kcal)).toEqual([1941, 2224, 2507, 2790, 3073]);
    const woman = ok(calculateCalories("female", { age: "30", height: "155", weight: "55" }, "light"));
    expect(kcal(woman.bmr)).toBe(1208);
    expect(kcal(woman.daily)).toBe(1661);
  });

  it("accepts Bangla digits", () => {
    expect(kcal(ok(calculateCalories("male", { age: "৩০", height: "১৭০", weight: "৭০" }, "sedentary")).daily)).toBe(1941);
  });

  it("is for adults 18–80 with whole-year ages", () => {
    expect(calculateCalories("female", { age: "18", height: "150", weight: "45" }, "light").ok).toBe(true);
    expect(calculateCalories("female", { age: "80", height: "150", weight: "45" }, "light").ok).toBe(true);
    expect(errors(calculateCalories("female", { age: "17", height: "150", weight: "45" }, "light"))).toEqual([
      { field: "age", code: "too-small" },
    ]);
    expect(errors(calculateCalories("female", { age: "30.5", height: "150", weight: "45" }, "light"))).toEqual([
      { field: "age", code: "not-integer" },
    ]);
  });

  it("reports every error together", () => {
    expect(errors(calculateCalories("male", { age: "", height: "99", weight: "301" }, "light"))).toEqual([
      { field: "age", code: "missing" },
      { field: "height", code: "too-small" },
      { field: "weight", code: "too-large" },
    ]);
  });
});
