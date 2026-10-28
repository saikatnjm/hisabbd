import { describe, expect, it } from "vitest";
import { choicePreference, numberPreference, preferenceValue, sanitizePrefs, withPreference } from "./preferences";

const unit = choicePreference("bmi-calculator", "heightUnit", ["cm", "ftin"] as const, "cm");
const katha = numberPreference("land-calculator", "kathaSize", { min: 1, max: 10_000 }, "720");

describe("sanitizePrefs", () => {
  it("keeps scope → key → short string values", () => {
    expect(sanitizePrefs({ "bmi-calculator": { heightUnit: "ftin" } })).toEqual({ "bmi-calculator": { heightUnit: "ftin" } });
  });

  it("drops anything malformed", () => {
    expect(sanitizePrefs(null)).toEqual({});
    expect(sanitizePrefs(["x"])).toEqual({});
    expect(sanitizePrefs({ "bad scope!": { a: "b" } })).toEqual({});
    expect(sanitizePrefs({ ok: { n: 5, long: "x".repeat(41), good: "v" } })).toEqual({ ok: { good: "v" } });
    expect(sanitizePrefs({ ok: "not an object" })).toEqual({});
  });
});

describe("choicePreference", () => {
  it("returns the stored value only when it is an allowed choice", () => {
    expect(preferenceValue({}, unit)).toBe("cm");
    expect(preferenceValue({ "bmi-calculator": { heightUnit: "ftin" } }, unit)).toBe("ftin");
    expect(preferenceValue({ "bmi-calculator": { heightUnit: "inches" } }, unit)).toBe("cm");
  });

  it("ignores invalid values when setting", () => {
    const data = withPreference({}, unit, "ftin");
    expect(preferenceValue(data, unit)).toBe("ftin");
    expect(withPreference(data, unit, "furlongs" as "cm")).toBe(data);
  });

  it("keeps other scopes and keys", () => {
    const data = withPreference({ other: { a: "b" }, "bmi-calculator": { weightUnit: "lb" } }, unit, "ftin");
    expect(data).toEqual({ other: { a: "b" }, "bmi-calculator": { weightUnit: "lb", heightUnit: "ftin" } });
  });
});

describe("numberPreference", () => {
  it("accepts plain numbers in range only", () => {
    expect(preferenceValue({ "land-calculator": { kathaSize: "1000" } }, katha)).toBe("1000");
    expect(preferenceValue({ "land-calculator": { kathaSize: "720.5" } }, katha)).toBe("720.5");
    for (const bad of ["0", "10001", "-5", "abc", "1e3", ""]) {
      expect(preferenceValue({ "land-calculator": { kathaSize: bad } }, katha), bad).toBe("720");
    }
  });
});
