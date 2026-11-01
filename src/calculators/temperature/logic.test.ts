import { describe, expect, it } from "vitest";
import { roundTo } from "@/lib/number";
import { calculateTemperature, celsiusToFahrenheit, fahrenheitToCelsius, feverStatus, type TemperatureCalculation } from "./logic";

function ok(calc: TemperatureCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const r2 = (n: number) => roundTo(n, 2);

describe("conversions", () => {
  it("converts the readings on the page", () => {
    expect(r2(fahrenheitToCelsius(100))).toBe(37.78);
    expect(r2(fahrenheitToCelsius(102))).toBe(38.89);
    expect(fahrenheitToCelsius(98.6)).toBe(37);
    expect(fahrenheitToCelsius(104)).toBe(40);
    expect(celsiusToFahrenheit(38)).toBe(100.4);
    expect(celsiusToFahrenheit(39)).toBe(102.2);
    expect(fahrenheitToCelsius(-40)).toBe(-40);
  });
});

describe("feverStatus", () => {
  it("uses 38 °C as the line, only for body temperatures", () => {
    expect(feverStatus(37.9)).toBe("no-fever");
    expect(feverStatus(38)).toBe("fever");
    expect(feverStatus(fahrenheitToCelsius(100))).toBe("no-fever");
    expect(feverStatus(fahrenheitToCelsius(100.4))).toBe("fever");
    expect(feverStatus(33.9)).toBe("not-body");
    expect(feverStatus(44.1)).toBe("not-body");
  });
});

describe("calculateTemperature", () => {
  it("works out the page's example: 102 °F", () => {
    const t = ok(calculateTemperature("102", "f"));
    expect(r2(t.celsius)).toBe(38.89);
    expect(t.fahrenheit).toBe(102);
    expect(t.fever).toBe("fever");
  });

  it("converts weather and cooking temperatures without a fever line", () => {
    const hot = ok(calculateTemperature("30", "c"));
    expect(hot.fahrenheit).toBe(86);
    expect(hot.fever).toBe("not-body");
    expect(ok(calculateTemperature("-273.15", "c")).fever).toBe("not-body");
  });

  it("accepts Bangla digits", () => {
    expect(ok(calculateTemperature("১০৪", "f")).celsius).toBe(40);
  });

  it("checks the limits", () => {
    expect(calculateTemperature("", "c")).toEqual({ ok: false, errors: [{ field: "value", code: "missing" }] });
    expect(calculateTemperature("-274", "c")).toEqual({ ok: false, errors: [{ field: "value", code: "too-small" }] });
    expect(calculateTemperature("1001", "c")).toEqual({ ok: false, errors: [{ field: "value", code: "too-large" }] });
    expect(calculateTemperature("1832", "f").ok).toBe(true);
    expect(calculateTemperature("1833", "f")).toEqual({ ok: false, errors: [{ field: "value", code: "too-large" }] });
  });
});
