import { describe, expect, it } from "vitest";
import {
  calculateSalary,
  deductionAmount,
  isEmptyRow,
  MAX_SALARY,
  type DeductionInput,
  type SalaryCalculation,
  type SalaryInputs,
} from "./logic";

function row(id: number, name: string, type: "percent" | "fixed", value: string): DeductionInput {
  return { id, name, type, value };
}

function inputs(overrides: Partial<SalaryInputs> = {}): SalaryInputs {
  return { gross: "50000", period: "month", deductions: [], ...overrides };
}

function ok(overrides: Partial<SalaryInputs> = {}) {
  const calc = calculateSalary(inputs(overrides));
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: SalaryCalculation) => (calc.ok ? [] : calc.errors);

describe("core functions", () => {
  it("deductionAmount handles percent and fixed", () => {
    expect(deductionAmount("percent", 10, 50000)).toBeCloseTo(5000, 10);
    expect(deductionAmount("percent", 0, 50000)).toBe(0);
    expect(deductionAmount("fixed", 1500, 50000)).toBe(1500);
  });

  it("isEmptyRow ignores blank rows only", () => {
    expect(isEmptyRow(row(1, "", "percent", ""))).toBeTruthy();
    expect(isEmptyRow(row(1, "  ", "fixed", " "))).toBeTruthy();
    expect(isEmptyRow(row(1, "Tax", "fixed", ""))).toBeFalsy();
    expect(isEmptyRow(row(1, "", "fixed", "0"))).toBeFalsy();
  });
});

describe("worked example", () => {
  const deductions = [
    row(1, "Provident fund", "percent", "10"),
    row(2, "Income tax (TDS)", "fixed", "1,500"),
    row(3, "Loan instalment", "fixed", "8000"),
  ];

  it("৳50,000 per month with 10% + ৳1,500 + ৳8,000", () => {
    const r = ok({ deductions });
    expect(r.monthlyGross).toBe(50000);
    expect(r.monthlyDeductions).toBeCloseTo(14500, 8);
    expect(r.monthlyNet).toBeCloseTo(35500, 8);
    expect(r.deductionsPercentOfGross).toBeCloseTo(29, 8);
    expect(r.annualGross).toBe(600000);
    expect(r.annualDeductions).toBeCloseTo(174000, 6);
    expect(r.annualNet).toBeCloseTo(426000, 6);
    expect(r.lines.map((l) => l.monthlyAmount)).toEqual([5000, 1500, 8000]);
    expect(r.lines.map((l) => l.id)).toEqual([1, 2, 3]);
    expect(r.lines[1]?.name).toBe("Income tax (TDS)");
  });

  it("the same salary entered per year gives the same result", () => {
    const monthly = ok({ deductions });
    const yearly = ok({ gross: "600000", period: "year", deductions });
    expect(yearly.monthlyGross).toBeCloseTo(50000, 8);
    expect(yearly.monthlyNet).toBeCloseTo(monthly.monthlyNet, 8);
    expect(yearly.annualGross).toBe(600000);
    expect(yearly.annualNet).toBeCloseTo(monthly.annualNet, 6);
  });
});

describe("gross and period", () => {
  it("no deductions: net equals gross", () => {
    const r = ok();
    expect(r.monthlyNet).toBe(50000);
    expect(r.monthlyDeductions).toBe(0);
    expect(r.deductionsPercentOfGross).toBe(0);
    expect(r.annualNet).toBe(600000);
    expect(r.lines).toHaveLength(0);
  });

  it("yearly gross that does not divide evenly keeps full precision", () => {
    const r = ok({ gross: "100000", period: "year" });
    expect(r.monthlyGross).toBeCloseTo(8333.333333, 5);
    expect(r.annualGross).toBe(100000);
    expect(r.annualNet).toBe(100000);
  });

  it("accepts commas, Bangla digits and decimals", () => {
    expect(ok({ gross: "৫০,০০০" }).monthlyGross).toBe(50000);
    expect(ok({ gross: "45,250.50" }).monthlyGross).toBeCloseTo(45250.5, 8);
  });

  it("percent deduction on a yearly salary is taken from the monthly gross", () => {
    const r = ok({ gross: "120000", period: "year", deductions: [row(1, "PF", "percent", "10")] });
    expect(r.monthlyGross).toBeCloseTo(10000, 8);
    expect(r.monthlyDeductions).toBeCloseTo(1000, 8);
    expect(r.annualDeductions).toBeCloseTo(12000, 8);
  });

  it("the maximum salary is accepted", () => {
    expect(ok({ gross: String(MAX_SALARY) }).monthlyNet).toBe(MAX_SALARY);
  });
});

describe("deduction rows", () => {
  it("ignores completely empty rows", () => {
    const r = ok({ deductions: [row(1, "", "percent", ""), row(2, "Tax", "fixed", "1000"), row(3, " ", "fixed", " ")] });
    expect(r.lines).toHaveLength(1);
    expect(r.lines[0]?.id).toBe(2);
    expect(r.monthlyNet).toBe(49000);
  });

  it("allows unnamed rows with a value and zero values", () => {
    const r = ok({ deductions: [row(1, "", "fixed", "500"), row(2, "Nothing", "percent", "0")] });
    expect(r.lines[0]?.name).toBe("");
    expect(r.monthlyDeductions).toBe(500);
    expect(r.lines[1]?.monthlyAmount).toBe(0);
  });

  it("a named row with no value is an error on that row", () => {
    expect(errors(calculateSalary(inputs({ deductions: [row(7, "Provident fund", "percent", "")] })))).toEqual([
      { field: "deduction", id: 7, code: "missing" },
    ]);
  });

  it("rejects negative, text, and percent above 100", () => {
    const calc = calculateSalary(
      inputs({
        deductions: [
          row(1, "a", "fixed", "-5"),
          row(2, "b", "percent", "abc"),
          row(3, "c", "percent", "100.5"),
          row(4, "d", "fixed", String(MAX_SALARY + 1)),
        ],
      }),
    );
    expect(errors(calc)).toEqual([
      { field: "deduction", id: 1, code: "too-small" },
      { field: "deduction", id: 2, code: "invalid" },
      { field: "deduction", id: 3, code: "too-large" },
      { field: "deduction", id: 4, code: "too-large" },
    ]);
  });

  it("fixed amounts may be above 100 but percent may be exactly 100", () => {
    expect(ok({ deductions: [row(1, "a", "fixed", "150")] }).monthlyDeductions).toBe(150);
    expect(ok({ deductions: [row(1, "a", "percent", "100")] }).monthlyNet).toBe(0);
  });

  it("row ids, not positions, identify errors", () => {
    const calc = calculateSalary(inputs({ deductions: [row(10, "", "fixed", ""), row(42, "x", "fixed", "bad")] }));
    expect(errors(calc)).toEqual([{ field: "deduction", id: 42, code: "invalid" }]);
  });
});

describe("total deductions limit", () => {
  it("deductions equal to gross give net 0", () => {
    const r = ok({ deductions: [row(1, "a", "percent", "60"), row(2, "b", "fixed", "20000")] });
    expect(r.monthlyNet).toBeCloseTo(0, 8);
    expect(r.deductionsPercentOfGross).toBeCloseTo(100, 8);
    expect(r.annualNet).toBeCloseTo(0, 6);
  });

  it("deductions above gross are rejected with a total error", () => {
    expect(errors(calculateSalary(inputs({ deductions: [row(1, "a", "percent", "60"), row(2, "b", "fixed", "20001")] })))).toEqual([
      { field: "total", code: "exceeds-gross" },
    ]);
    expect(errors(calculateSalary(inputs({ deductions: [row(1, "a", "percent", "70"), row(2, "b", "percent", "40")] })))).toEqual([
      { field: "total", code: "exceeds-gross" },
    ]);
  });

  it("float noise does not trigger the error", () => {
    const r = ok({ gross: "30000", deductions: [row(1, "a", "percent", "33.3"), row(2, "b", "percent", "33.3"), row(3, "c", "percent", "33.4")] });
    expect(r.monthlyNet).toBeCloseTo(0, 6);
  });

  it("field errors take priority over the total check", () => {
    const calc = calculateSalary(inputs({ deductions: [row(1, "a", "fixed", "999999"), row(2, "b", "fixed", "x")] }));
    expect(errors(calc)).toEqual([{ field: "deduction", id: 2, code: "invalid" }]);
  });
});

describe("invalid gross", () => {
  const codes = (gross: string) => errors(calculateSalary(inputs({ gross })));

  it("rejects missing, zero, negative, text and too large", () => {
    expect(codes("")).toEqual([{ field: "gross", code: "missing" }]);
    expect(codes("0")).toEqual([{ field: "gross", code: "too-small" }]);
    expect(codes("-100")).toEqual([{ field: "gross", code: "too-small" }]);
    expect(codes("fifty")).toEqual([{ field: "gross", code: "invalid" }]);
    expect(codes(String(MAX_SALARY + 1))).toEqual([{ field: "gross", code: "too-large" }]);
  });

  it("reports a bad gross together with bad deduction rows", () => {
    const calc = calculateSalary(inputs({ gross: "", deductions: [row(3, "x", "fixed", "")] }));
    expect(errors(calc)).toEqual([
      { field: "gross", code: "missing" },
      { field: "deduction", id: 3, code: "missing" },
    ]);
  });
});
