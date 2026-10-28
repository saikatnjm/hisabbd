import { describe, expect, it } from "vitest";
import {
  AREA_UNIT_ORDER,
  AREA_UNIT_SQ_FT,
  areaUnitSizes,
  calculateLand,
  convertAll,
  fourSidesArea,
  fromSquareFeet,
  heronArea,
  LENGTH_UNIT_FT,
  MAX_AREA_SQ_FT,
  rectangleArea,
  SQ_FT_PER_SQ_M,
  toSquareFeet,
  type AreaUnit,
  type LandCalculation,
  type LandShape,
  type LengthField,
  type LengthUnit,
} from "./logic";

const errors = (calc: LandCalculation) => (calc.ok ? [] : calc.errors);

function convert(amount: string, unit: AreaUnit, kathaSize = "720") {
  const calc = calculateLand({ mode: "convert", amount, unit, kathaSize });
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  if (calc.result.mode !== "convert") throw new Error("wrong mode");
  return calc.result;
}

function measure(
  shape: LandShape,
  lengths: Partial<Record<LengthField, string>>,
  lengthUnit: LengthUnit = "ft",
  kathaSize = "720",
) {
  const calc = calculateLand({ mode: "measure", shape, lengthUnit, lengths, kathaSize });
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  if (calc.result.mode !== "measure") throw new Error("wrong mode");
  return calc.result;
}

describe("unit factors", () => {
  it("defines every unit in square feet", () => {
    expect(AREA_UNIT_SQ_FT.sqft).toBe(1);
    expect(AREA_UNIT_SQ_FT.sqm).toBeCloseTo(10.7639104167, 10);
    expect(SQ_FT_PER_SQ_M).toBeCloseTo(1 / 0.3048 ** 2, 12);
    expect(AREA_UNIT_SQ_FT.sqyd).toBe(9);
    expect(AREA_UNIT_SQ_FT.decimal).toBe(435.6);
    expect(AREA_UNIT_SQ_FT.ojutangsho).toBe(4.356);
    expect(AREA_UNIT_SQ_FT.katha).toBe(720);
    expect(AREA_UNIT_SQ_FT.bigha).toBe(14_400);
    expect(AREA_UNIT_SQ_FT.acre).toBe(43_560);
    expect(AREA_UNIT_SQ_FT.hectare).toBeCloseTo(107_639.104167, 5);
  });

  it("1 katha = 720 sq ft = 1.65289 decimal", () => {
    const r = convert("1", "katha");
    expect(r.areaSqFt).toBe(720);
    expect(r.areas.decimal).toBeCloseTo(1.6528925620, 10);
    expect(r.areas.sqyd).toBe(80);
    expect(r.areas.sqm).toBeCloseTo(66.89018880, 8);
  });

  it("1 bigha = 20 katha = 14,400 sq ft ≈ 33.0579 decimal (not exactly 33)", () => {
    const r = convert("1", "bigha");
    expect(r.areaSqFt).toBe(14_400);
    expect(r.areas.katha).toBe(20);
    expect(r.areas.decimal).toBeCloseTo(33.0578512397, 10);
    expect(r.areas.decimal).not.toBe(33);
    // 33 decimal is 25.2 sq ft short of a bigha.
    expect(14_400 - toSquareFeet(33, "decimal")).toBeCloseTo(25.2, 10);
  });

  it("1 acre = 100 decimal = 43,560 sq ft = 60.5 katha", () => {
    const r = convert("1", "acre");
    expect(r.areaSqFt).toBe(43_560);
    expect(r.areas.decimal).toBeCloseTo(100, 10);
    expect(r.areas.katha).toBeCloseTo(60.5, 10);
    expect(r.areas.bigha).toBeCloseTo(3.025, 10);
  });

  it("1 decimal = 100 ojutangsho = 435.6 sq ft", () => {
    const r = convert("1", "decimal");
    expect(r.areaSqFt).toBe(435.6);
    expect(r.areas.ojutangsho).toBeCloseTo(100, 10);
    expect(r.areas.katha).toBeCloseTo(0.605, 10);
  });

  it("1 hectare = 10,000 sq m ≈ 2.4711 acres", () => {
    const r = convert("1", "hectare");
    expect(r.areas.sqm).toBeCloseTo(10_000, 8);
    expect(r.areas.acre).toBeCloseTo(2.4710538147, 9);
  });

  it("length units are in feet: haat 1.5, goj 3, metre 1 / 0.3048", () => {
    expect(LENGTH_UNIT_FT.ft).toBe(1);
    expect(LENGTH_UNIT_FT.haat).toBe(1.5);
    expect(LENGTH_UNIT_FT.yard).toBe(3);
    expect(LENGTH_UNIT_FT.m).toBeCloseTo(3.28083989501, 10);
  });
});

describe("custom katha size", () => {
  it("changes katha and bigha only", () => {
    const standard = areaUnitSizes();
    const custom = areaUnitSizes(1000);
    expect(custom.katha).toBe(1000);
    expect(custom.bigha).toBe(20_000);
    for (const unit of AREA_UNIT_ORDER) {
      if (unit !== "katha" && unit !== "bigha") expect(custom[unit]).toBe(standard[unit]);
    }
  });

  it("2,400 sq ft is 2.4 katha and 0.12 bigha with a 1,000 sq ft katha", () => {
    const r = convert("2400", "sqft", "1000");
    expect(r.kathaSqFt).toBe(1000);
    expect(r.standardKatha).toBe(false);
    expect(r.areas.katha).toBeCloseTo(2.4, 10);
    expect(r.areas.bigha).toBeCloseTo(0.12, 10);
    expect(r.areas.decimal).toBeCloseTo(convert("2400", "sqft").areas.decimal, 12);
  });

  it("converting from katha uses the custom size", () => {
    expect(convert("2", "katha", "1000").areaSqFt).toBe(2000);
    expect(convert("1", "bigha", "1000").areaSqFt).toBe(20_000);
  });

  it("reports standardKatha for 720", () => {
    expect(convert("1", "katha").standardKatha).toBe(true);
  });
});

describe("round trips", () => {
  it.each(AREA_UNIT_ORDER)("%s → sq ft → %s", (unit) => {
    for (const amount of [1, 2.5, 33, 12_345.678]) {
      expect(fromSquareFeet(toSquareFeet(amount, unit), unit)).toBeCloseTo(amount, 9);
      expect(fromSquareFeet(toSquareFeet(amount, unit, 999), unit, 999)).toBeCloseTo(amount, 9);
    }
  });

  it("every unit in convertAll converts back to the same area", () => {
    const all = convertAll(5000);
    for (const unit of AREA_UNIT_ORDER) expect(toSquareFeet(all[unit], unit)).toBeCloseTo(5000, 8);
  });
});

describe("convert mode (worked examples)", () => {
  it("5 katha = 3,600 sq ft = 8.2645 decimal", () => {
    const r = convert("5", "katha");
    expect(r.amount).toBe(5);
    expect(r.unit).toBe("katha");
    expect(r.areaSqFt).toBe(3600);
    expect(r.areas.decimal).toBeCloseTo(8.2644628099, 9);
    expect(r.areas.bigha).toBe(0.25);
  });

  it("10 decimal = 4,356 sq ft = 6.05 katha", () => {
    const r = convert("10", "decimal");
    expect(r.areaSqFt).toBeCloseTo(4356, 10);
    expect(r.areas.katha).toBeCloseTo(6.05, 10);
  });

  it("accepts Bangla digits and comma grouping", () => {
    expect(convert("১০", "decimal").areaSqFt).toBeCloseTo(4356, 10);
    expect(convert("1,00,000", "sqft").areaSqFt).toBe(100_000);
    expect(convert("2400", "sqft", "১,০০০").kathaSqFt).toBe(1000);
  });
});

describe("rectangle", () => {
  it("60 ft × 40 ft = 2,400 sq ft = 5.5096 decimal = 3.3333 katha", () => {
    expect(rectangleArea(60, 40)).toBe(2400);
    const r = measure("rectangle", { length: "60", width: "40" });
    expect(r.areaSqFt).toBe(2400);
    expect(r.areas.decimal).toBeCloseTo(5.5096418733, 9);
    expect(r.areas.katha).toBeCloseTo(3.3333333333, 9);
    expect(r.approximate).toBe(false);
    expect(r.lengths).toEqual({ length: 60, width: 40 });
  });

  it("40 haat × 30 haat = 60 ft × 45 ft = 2,700 sq ft = 3.75 katha", () => {
    const r = measure("rectangle", { length: "40", width: "30" }, "haat");
    expect(r.lengthsFt).toEqual({ length: 60, width: 45 });
    expect(r.areaSqFt).toBe(2700);
    expect(r.areas.katha).toBe(3.75);
    expect(r.areas.decimal).toBeCloseTo(6.1983471074, 9);
  });

  it("goj and metres are converted to feet first", () => {
    expect(measure("rectangle", { length: "20", width: "10" }, "yard").areaSqFt).toBe(1800);
    expect(measure("rectangle", { length: "100", width: "100" }, "m").areas.hectare).toBeCloseTo(1, 10);
  });

  it("accepts Bangla digits", () => {
    expect(measure("rectangle", { length: "৬০", width: "৪০" }).areaSqFt).toBe(2400);
  });
});

describe("four sides (approximate)", () => {
  it("is the average of opposite sides multiplied", () => {
    expect(fourSidesArea(60, 64, 40, 44)).toBe(2604);
    expect(fourSidesArea(60, 60, 40, 40)).toBe(rectangleArea(60, 40));
  });

  it("north 60, south 64, east 40, west 44 ft = 2,604 sq ft = 5.9780 decimal", () => {
    const r = measure("four-sides", { north: "60", south: "64", east: "40", west: "44" });
    expect(r.areaSqFt).toBe(2604);
    expect(r.areas.decimal).toBeCloseTo(5.9779614325, 9);
    expect(r.areas.katha).toBeCloseTo(3.6166666667, 9);
    expect(r.approximate).toBe(true);
  });
});

describe("triangle (Heron)", () => {
  it("3-4-5 has an area of 6", () => {
    expect(heronArea(3, 4, 5)).toBe(6);
    expect(heronArea(5, 3, 4)).toBe(6);
  });

  it("equilateral triangle", () => {
    expect(heronArea(2, 2, 2)).toBeCloseTo(Math.sqrt(3), 12);
  });

  it("30-40-50 ft = 600 sq ft = 1.3774 decimal", () => {
    const r = measure("triangle", { sideA: "30", sideB: "40", sideC: "50" });
    expect(r.areaSqFt).toBe(600);
    expect(r.areas.decimal).toBeCloseTo(1.3774104683, 9);
    expect(r.approximate).toBe(false);
  });

  it("rejects sides that break the triangle inequality, including flat ones", () => {
    expect(heronArea(1, 2, 3)).toBeNull();
    expect(heronArea(1, 2, 10)).toBeNull();
    expect(heronArea(0, 2, 2)).toBeNull();
  });

  it("reports not-a-triangle on the longest side", () => {
    const calc = (a: string, b: string, c: string) =>
      calculateLand({
        mode: "measure",
        shape: "triangle",
        lengthUnit: "ft",
        lengths: { sideA: a, sideB: b, sideC: c },
        kathaSize: "720",
      });
    expect(errors(calc("10", "3", "4"))).toEqual([{ field: "sideA", code: "not-a-triangle" }]);
    expect(errors(calc("3", "4", "7"))).toEqual([{ field: "sideC", code: "not-a-triangle" }]);
  });
});

describe("errors", () => {
  it("convert: missing, invalid, zero and negative amounts", () => {
    const err = (amount: string) => errors(calculateLand({ mode: "convert", amount, unit: "katha", kathaSize: "720" }));
    expect(err("")).toEqual([{ field: "amount", code: "missing" }]);
    expect(err("abc")).toEqual([{ field: "amount", code: "invalid" }]);
    expect(err("0")).toEqual([{ field: "amount", code: "too-small" }]);
    expect(err("-5")).toEqual([{ field: "amount", code: "too-small" }]);
  });

  it("convert: the area limit is 10^12 sq ft in any unit", () => {
    const err = (amount: string, unit: AreaUnit) =>
      errors(calculateLand({ mode: "convert", amount, unit, kathaSize: "720" }));
    expect(err(String(MAX_AREA_SQ_FT), "sqft")).toEqual([]);
    expect(err("1000000000001", "sqft")).toEqual([{ field: "amount", code: "area-too-large" }]);
    expect(err("1000000000", "acre")).toEqual([{ field: "amount", code: "area-too-large" }]);
    expect(err("22956841", "acre")).toEqual([]);
  });

  it("katha size must be 1 to 10,000 sq ft", () => {
    const err = (kathaSize: string) =>
      errors(calculateLand({ mode: "convert", amount: "1", unit: "sqft", kathaSize }));
    expect(err("")).toEqual([{ field: "kathaSize", code: "missing" }]);
    expect(err("x")).toEqual([{ field: "kathaSize", code: "invalid" }]);
    expect(err("0.5")).toEqual([{ field: "kathaSize", code: "too-small" }]);
    expect(err("10001")).toEqual([{ field: "kathaSize", code: "too-large" }]);
    expect(err("1")).toEqual([]);
    expect(err("10000")).toEqual([]);
  });

  it("reports the amount and katha size errors together, in form order", () => {
    expect(errors(calculateLand({ mode: "convert", amount: "", unit: "katha", kathaSize: "" }))).toEqual([
      { field: "amount", code: "missing" },
      { field: "kathaSize", code: "missing" },
    ]);
  });

  it("measure: every side must be a number greater than 0, all reported together", () => {
    const calc = calculateLand({
      mode: "measure",
      shape: "four-sides",
      lengthUnit: "ft",
      lengths: { north: "", south: "0", east: "abc", west: "-1" },
      kathaSize: "0",
    });
    expect(errors(calc)).toEqual([
      { field: "north", code: "missing" },
      { field: "south", code: "too-small" },
      { field: "east", code: "invalid" },
      { field: "west", code: "too-small" },
      { field: "kathaSize", code: "too-small" },
    ]);
  });

  it("measure: only the chosen shape's fields are read", () => {
    const r = measure("rectangle", { length: "10", width: "10", north: "abc" });
    expect(r.areaSqFt).toBe(100);
    const missing = calculateLand({ mode: "measure", shape: "triangle", lengthUnit: "ft", lengths: {}, kathaSize: "720" });
    expect(errors(missing).map((e) => e.field)).toEqual(["sideA", "sideB", "sideC"]);
  });

  it("measure: an area above 10^12 sq ft is rejected on the first side", () => {
    expect(measure("rectangle", { length: "1000000", width: "1000000" }).areaSqFt).toBe(MAX_AREA_SQ_FT);
    const calc = calculateLand({
      mode: "measure",
      shape: "rectangle",
      lengthUnit: "m",
      lengths: { length: "1000000", width: "1000000" },
      kathaSize: "720",
    });
    expect(errors(calc)).toEqual([{ field: "length", code: "area-too-large" }]);
  });
});
