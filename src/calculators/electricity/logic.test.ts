import { describe, expect, it } from "vitest";
import { APPLIANCE_EXAMPLES, monthlyUnits } from "@/guides/electricity-units-appliances/examples";
import { roundTo } from "@/lib/number";
import {
  billFor,
  calculateElectricityBill,
  DEMAND_CHARGE,
  defaultTariff,
  defaultTariffInput,
  LT_A_RATES,
  maxUnitsFor,
  METER_RENT,
  PREPAID_REBATE_PERCENT,
  RATE_IDS,
  slabLines,
  TARIFF_SOURCES,
  VAT_PERCENT,
  type ElectricityInput,
} from "./logic";

const single = defaultTariff("single");

function input(overrides: Partial<ElectricityInput> = {}): ElectricityInput {
  const phase = overrides.phase ?? "single";
  return {
    mode: "units",
    units: "200",
    previous: "",
    current: "",
    amount: "",
    load: "2",
    phase,
    payment: "postpaid",
    tariff: defaultTariffInput(phase),
    ...overrides,
  };
}

function ok(i: ElectricityInput) {
  const calc = calculateElectricityBill(i);
  if (!calc.ok) throw new Error(JSON.stringify(calc.errors));
  return calc.result;
}

describe("tariff data", () => {
  it("matches the BERC LT-A order of 3 June 2026 as revised on 4 June 2026", () => {
    expect(RATE_IDS.map((id) => LT_A_RATES[id].value)).toEqual([4.63, 5.26, 8.5, 9.1, 9.62, 15.01, 17.35]);
    expect(RATE_IDS.every((id) => LT_A_RATES[id].status === "official")).toBe(true);
    expect(DEMAND_CHARGE.value).toBe(42);
    expect(PREPAID_REBATE_PERCENT.value).toBe(0.5);
  });

  it("labels the meter rent and VAT figures as reported, not official", () => {
    expect(METER_RENT.single).toMatchObject({ value: 40, status: "reported" });
    expect(METER_RENT.three).toMatchObject({ value: 250, status: "reported" });
    expect(VAT_PERCENT).toMatchObject({ value: 5, status: "reported" });
  });

  it("has dated https sources", () => {
    for (const source of TARIFF_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.date).toMatch(/^2026-\d\d-\d\d$/);
    }
  });
});

describe("slabLines", () => {
  it("bills 50 units or less entirely at the lifeline rate", () => {
    expect(slabLines(45, single.rates)).toEqual([{ id: "lifeline", from: 1, to: 50, units: 45, rate: 4.63, amount: 208.35 }]);
    expect(slabLines(50, single.rates)[0]?.amount).toBe(231.5);
    expect(slabLines(0, single.rates)[0]?.amount).toBe(0);
  });

  it("loses the lifeline rate entirely at 51 units", () => {
    expect(slabLines(51, single.rates)).toEqual([{ id: "step1", from: 1, to: 75, units: 51, rate: 5.26, amount: 268.26 }]);
  });

  it("applies each rate only to the units inside its slab (200 units)", () => {
    const lines = slabLines(200, single.rates);
    expect(lines.map((l) => [l.id, l.units, l.amount])).toEqual([
      ["step1", 75, 394.5],
      ["step2", 125, 1062.5],
    ]);
  });

  it("works out 350 and 700 units slab by slab", () => {
    const sum = (u: number) => slabLines(u, single.rates).reduce((s, l) => s + l.amount, 0);
    expect(slabLines(350, single.rates).map((l) => l.units)).toEqual([75, 125, 100, 50]);
    expect(sum(350)).toBeCloseTo(2848, 10);
    expect(slabLines(700, single.rates).map((l) => [l.from, l.to, l.units])).toEqual([
      [1, 75, 75],
      [76, 200, 125],
      [201, 300, 100],
      [301, 400, 100],
      [401, 600, 200],
      [601, null, 100],
    ]);
    expect(sum(700)).toBeCloseTo(8066, 10);
  });

  it("handles slab edges and decimal units", () => {
    expect(slabLines(75, single.rates).map((l) => l.units)).toEqual([75]);
    expect(slabLines(76, single.rates).map((l) => l.units)).toEqual([75, 1]);
    expect(slabLines(600, single.rates).map((l) => l.units)).toEqual([75, 125, 100, 100, 200]);
    expect(slabLines(75.5, single.rates).map((l) => [l.units, l.amount])).toEqual([
      [75, 394.5],
      [0.5, 4.25],
    ]);
  });
});

describe("billFor", () => {
  it("worked example: 200 units, 2 kW, single-phase, postpaid", () => {
    const bill = billFor(200, 2, "postpaid", single);
    expect(bill).toMatchObject({
      energyCharge: 1457,
      demandCharge: 84,
      meterRent: 40,
      subtotal: 1581,
      vat: 79.05,
      rebate: 0,
      rebatePercent: 0,
      total: 1660.05,
    });
    expect(bill.averagePerUnit).toBeCloseTo(8.30025, 10);
  });

  it("worked example: the same month on a prepaid meter gets the 0.5% rebate", () => {
    const bill = billFor(200, 2, "prepaid", single);
    expect(bill.rebate).toBe(7.91);
    expect(bill.total).toBe(1652.14);
  });

  it("three-phase, 5 kW, 700 units", () => {
    const bill = billFor(700, 5, "postpaid", defaultTariff("three"));
    expect(bill).toMatchObject({ energyCharge: 8066, demandCharge: 210, meterRent: 250, subtotal: 8526, vat: 426.3, total: 8952.3 });
  });

  it("charges the fixed parts even at 0 units", () => {
    const bill = billFor(0, 2, "postpaid", single);
    expect(bill.total).toBe(130.2);
    expect(bill.averagePerUnit).toBeNull();
  });

  it("uses edited figures", () => {
    const bill = billFor(200, 2, "postpaid", { ...single, meterRent: 0, vatPercent: 0, demandChargePerKw: 0 });
    expect(bill.total).toBe(1457);
  });
});

describe("maxUnitsFor (prepaid recharge)", () => {
  it("finds the most units a ৳1,000 recharge covers (2 kW, single-phase)", () => {
    const units = maxUnitsFor(1000, 2, "prepaid", single);
    expect(units).toBe(126.58);
    expect(billFor(126.58, 2, "prepaid", single).total).toBeLessThanOrEqual(1000);
    expect(billFor(126.59, 2, "prepaid", single).total).toBeGreaterThan(1000);
  });

  it("matches other amounts", () => {
    expect(maxUnitsFor(500, 2, "prepaid", single)).toBe(67.39);
    expect(maxUnitsFor(2000, 2, "prepaid", single)).toBe(236.58);
  });

  it("stops at 50 units when crossing the lifeline would cost more than the recharge", () => {
    expect(billFor(50, 2, "prepaid", single).total).toBe(371.5);
    expect(maxUnitsFor(400, 2, "prepaid", single)).toBe(50);
  });

  it("returns 0 when the recharge only just covers the fixed charges, and null below that", () => {
    expect(billFor(0, 2, "prepaid", single).total).toBe(129.58);
    expect(maxUnitsFor(129.58, 2, "prepaid", single)).toBe(0);
    expect(maxUnitsFor(129.57, 2, "prepaid", single)).toBeNull();
  });
});

describe("calculateElectricityBill", () => {
  it("calculates from units", () => {
    const r = ok(input());
    expect(r.bill.total).toBe(1660.05);
    expect(r.recharge).toBeNull();
  });

  it("calculates from meter readings", () => {
    const r = ok(input({ mode: "readings", previous: "12,345", current: "12545" }));
    expect(r.bill.units).toBe(200);
    expect(r.bill.total).toBe(1660.05);
  });

  it("accepts Bangla digits and comma grouping", () => {
    expect(ok(input({ units: "২০০", load: "২" })).bill.total).toBe(1660.05);
    expect(ok(input({ mode: "readings", previous: "১২,৩৪৫", current: "১২,৫৪৫" })).bill.units).toBe(200);
  });

  it("works out a recharge", () => {
    const r = ok(input({ mode: "recharge", amount: "1,000", payment: "prepaid" }));
    expect(r.bill.units).toBe(126.58);
    expect(r.recharge).toEqual({ amount: 1000, leftover: 0 });
  });

  it("reports a recharge below the fixed charges, with the minimum", () => {
    const calc = calculateElectricityBill(input({ mode: "recharge", amount: "100", payment: "prepaid" }));
    expect(calc).toEqual({ ok: false, errors: [{ field: "amount", code: "below-fixed-charges", minimum: 129.58 }] });
  });

  it("rejects a current reading below the previous one, or more than 1,00,000 units apart", () => {
    const calc = calculateElectricityBill(input({ mode: "readings", previous: "500", current: "400" }));
    expect(calc).toEqual({ ok: false, errors: [{ field: "current", code: "below-previous" }] });
    const far = calculateElectricityBill(input({ mode: "readings", previous: "0", current: "100001" }));
    expect(far).toEqual({ ok: false, errors: [{ field: "current", code: "too-many-units" }] });
    expect(ok(input({ mode: "readings", previous: "500", current: "500" })).bill.units).toBe(0);
  });

  it("checks unit and load boundaries", () => {
    expect(ok(input({ units: "0" })).bill.total).toBe(130.2);
    expect(ok(input({ units: "100000" })).bill.units).toBe(100000);
    expect(calculateElectricityBill(input({ units: "100000.5" }))).toEqual({ ok: false, errors: [{ field: "units", code: "too-large" }] });
    expect(calculateElectricityBill(input({ units: "-1" }))).toEqual({ ok: false, errors: [{ field: "units", code: "too-small" }] });
    expect(calculateElectricityBill(input({ load: "0" }))).toEqual({ ok: false, errors: [{ field: "load", code: "too-small" }] });
    expect(ok(input({ load: "7.5" })).bill.demandCharge).toBe(315);
    expect(calculateElectricityBill(input({ load: "7.6" }))).toEqual({ ok: false, errors: [{ field: "load", code: "too-large" }] });
    expect(ok(input({ phase: "three", load: "80" })).bill.demandCharge).toBe(3360);
  });

  it("reports every missing or invalid field together", () => {
    const tariff = { ...defaultTariffInput("single"), "rate-step2": "abc", vat: "" };
    const calc = calculateElectricityBill(input({ units: "", load: "x", tariff }));
    expect(calc).toEqual({
      ok: false,
      errors: [
        { field: "units", code: "missing" },
        { field: "load", code: "invalid" },
        { field: "rate-step2", code: "invalid" },
        { field: "vat", code: "missing" },
      ],
    });
  });

  it("validates the readings fields", () => {
    const calc = calculateElectricityBill(input({ mode: "readings", previous: "", current: "" }));
    expect(calc).toEqual({
      ok: false,
      errors: [
        { field: "previous", code: "missing" },
        { field: "current", code: "missing" },
      ],
    });
  });

  it("uses an edited tariff", () => {
    const tariff = { ...defaultTariffInput("single"), "meter-rent": "0", "rate-step2": "9" };
    const r = ok(input({ tariff }));
    expect(r.bill.lines[1]?.amount).toBe(1125);
    // 394.50 + 1,125 + 84 = 1,603.50; VAT 80.18 (80.175 rounded half up)
    expect(r.bill.total).toBe(1683.68);
  });
});

// The worked examples in the appliance units guide (src/guides/electricity-units-appliances).
describe("appliance units guide examples", () => {
  const total = (units: number) => billFor(units, 2, "postpaid", single).total;

  it("a 1,500 W AC for 8 hours a day adds 360 units: 150 → 510 units is ৳1,213.80 → ৳5,359.31", () => {
    expect(monthlyUnits(1500, 8)).toBe(360);
    expect(total(150)).toBe(1213.8);
    expect(total(510)).toBe(5359.31);
    expect(roundTo(total(510) - total(150), 2)).toBe(4145.51);
    expect(roundTo((total(510) - total(150)) / 360, 2)).toBe(11.52);
  });

  it("a 75 W fan for 10 hours a day takes a 40-unit lifeline home out of the lifeline", () => {
    expect(monthlyUnits(75, 10)).toBe(22.5);
    expect(total(40)).toBe(324.66);
    expect(total(62.5)).toBe(475.39);
    expect(roundTo(total(62.5) - total(40), 2)).toBe(150.73);
    expect(total(50)).toBe(373.28);
    expect(total(51)).toBe(411.87);
  });

  it("the example table's monthly units", () => {
    expect(APPLIANCE_EXAMPLES.map((a) => monthlyUnits(a.watts, a.hoursPerDay))).toEqual([1.8, 22.5, 15, 21, 360]);
  });
});
