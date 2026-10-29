import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Residential electricity bill (BERC tariff LT-A) rules and assumptions:
 *
 * 1. Tariff: BERC "Retail electricity tariff 2026" for low-tension residential
 *    customers (LT-A), order of 3 June 2026 (memo 28.01.0000.012.04.003.26.2521),
 *    as revised on 4 June 2026 (memo …2569), which kept the lifeline (0–50
 *    units) rate at ৳4.63 and the first step (0–75 units) at ৳5.26 per kWh.
 *    Effective from the June 2026 billing month for BPDB, the rural electricity
 *    co-operatives (BREB), DPDC, DESCO, WZPDCL and NESCO. Rates are ৳ per kWh
 *    (1 unit = 1 kWh) and exclude VAT. The tariff is DATA below with sources
 *    and dates; every rate is pre-filled in the widget and the user can edit it.
 * 2. Lifeline: if the month's total use is 50 units or less, every unit is
 *    billed at the lifeline rate. BERC's footnote: no other residential
 *    customer gets the lifeline rate, so at 51 units the whole month moves to
 *    the stepped slabs (51 units cost more than 50).
 * 3. Above the lifeline the slabs are progressive (telescopic): each rate
 *    applies only to the units inside its slab (first 75 at the step-1 rate,
 *    the next 125 at the step-2 rate, …). Confirmed by The Daily Star's worked
 *    example (16 May 2026: "200 units … first 75 units at Tk 5.26 and the
 *    remaining 125 units at …") and its report that BERC rejected the proposal
 *    to abolish that slab benefit (4 June 2026). The slab boundaries are fixed
 *    by the order and are not editable; only the rates are.
 * 4. Demand charge = sanctioned load (kW) × ৳42 per kW per month (BERC; LT
 *    customers are charged on the sanctioned load, not on recorded demand).
 *    Exceeding the sanctioned load (charged at double rate) is not modelled.
 * 5. Meter rent: BERC's 2026 conditions say the existing meter-rent rules
 *    continue and give no amount, and no rent is due on a meter the customer
 *    bought. The pre-filled ৳40 (single-phase) and ৳250 (three-phase) a month
 *    are AS REPORTED by DPDC for meters it supplied (The Business Standard,
 *    31 August 2026). Other companies may charge differently; it is editable.
 * 6. VAT: BERC says VAT applies "at the rate set by the government from time
 *    to time" without a figure. The pre-filled 5% is AS REPORTED (DPDC via The
 *    Business Standard, 31 Aug 2026; Amar Desh, 19 Sep 2026, which says VAT is
 *    charged on the energy charge, demand charge and meter rent). We apply it
 *    to energy + demand charge + meter rent.
 * 7. Prepaid rebate: 0.5% of the net bill excluding VAT (BERC 2026 conditions
 *    §9(k) and the 3 June order). We take "net bill" as energy + demand charge
 *    + meter rent, and compute VAT on that amount before the rebate.
 * 8. Rounding: each slab line, the demand charge, meter rent, VAT and rebate
 *    are rounded to the nearest paisa (half away from zero); the total is
 *    their sum. Companies may round the bill to whole Taka.
 * 9. Inverse ("units for a recharge of ৳X", prepaid): the largest use, to
 *    0.01 kWh, whose full monthly bill (energy + demand charge + meter rent +
 *    VAT − rebate) is ৳X or less. It treats X as everything recharged in the
 *    month, from which the meter takes the month's demand charge and meter
 *    rent. Meters may split VAT differently (e.g. 5% of each recharge), so
 *    the real figure can differ slightly.
 * 10. Limits: units 0 to 1,00,000 a month (decimals allowed); sanctioned load
 *    above 0 up to 7.5 kW single-phase or 80 kW three-phase (BERC LT limits);
 *    rates 0–100 ৳/kWh; demand charge 0–1,000 ৳/kW; meter rent 0–10,000;
 *    VAT and rebate 0–100%; recharge ৳1 to ৳1 crore.
 * 11. Deliberately NOT modelled: the 5% late-payment surcharge, arrears,
 *    adjustments, power-factor surcharge (LT loads above 20 kW), meter
 *    roll-over, emergency balance, part-month billing, and other categories
 *    (commercial, irrigation, MT-1 residential).
 */

/** Date every figure below was last checked against its source. */
export const TARIFF_CHECKED_ON = "2026-10-29";
/** Billing month from which the tariff applies. */
export const TARIFF_EFFECTIVE = "June 2026";

export interface TariffSource {
  title: string;
  url: string;
  /** Publication or issue date (YYYY-MM-DD). */
  date: string;
}

export const BERC_NOTIFICATIONS_PAGE: TariffSource = {
  title: "BERC: Tariff notifications (electricity)",
  url: "https://berc.org.bd/pages/static-pages/tariff-notification-electricity-51fe10-6922e140933eb65569e2b1c3",
  date: "2026-10-27",
};

export const BERC_RETAIL_ORDER: TariffSource = {
  title: "BERC: Retail electricity tariff 2026 (notification, 3 June 2026)",
  url: "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-berc/2026/9/dc423416-bb3d-4766-b7ed-88af9106ef26.pdf",
  date: "2026-06-03",
};

export const BERC_LIFELINE_REVISION: TariffSource = {
  title: "BERC: Revision of the lifeline and first-step residential rates (4 June 2026)",
  url: "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-berc/2026/9/37cc1bb8-6f54-4b8d-b443-ba337516b3d5.pdf",
  date: "2026-06-04",
};

export const BERC_CONDITIONS: TariffSource = {
  title: "BERC: Conditions, applicability and miscellaneous charges of the retail tariff 2026 (3 June 2026)",
  url: "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-berc/2026/9/0d1f3b91-fb88-4938-8dba-644ead407a1b.pdf",
  date: "2026-06-03",
};

export const DPDC_TARIFF_PAGE: TariffSource = {
  title: "DPDC: Tariff rates (from the June 2026 billing month)",
  url: "https://dpdc.gov.bd/pages/static-pages/6922de6f933eb65569e1a9c4",
  date: "2026-06-07",
};

export const TBS_DPDC_METER_CHARGES: TariffSource = {
  title: "The Business Standard: DPDC clarifies prepaid meter charges (31 August 2026)",
  url: "https://www.tbsnews.net/bangladesh/energy/dpdc-clarifies-prepaid-meter-charges-ghost-bills-urges-customers-call-16116",
  date: "2026-08-31",
};

export const AMAR_DESH_METER_RENT: TariffSource = {
  title: "Amar Desh: Questions on meter rent and demand charge (19 September 2026)",
  url: "https://www.dailyamardesh.com/national/amd54tg214z71",
  date: "2026-09-19",
};

export const DAILY_STAR_SLAB_EXAMPLE: TariffSource = {
  title: "The Daily Star: Consumers stare at higher power bills (16 May 2026)",
  url: "https://www.thedailystar.net/news/bangladesh/news/consumers-stare-higher-power-bills-4176806",
  date: "2026-05-16",
};

export const DAILY_STAR_SLABS_KEPT: TariffSource = {
  title: "The Daily Star: Power prices up 16.7% on average (4 June 2026)",
  url: "https://www.thedailystar.net/news/bangladesh/news/power-prices-167-average-4190281",
  date: "2026-06-04",
};

/** Every source, for "Sources" lists. */
export const TARIFF_SOURCES: readonly TariffSource[] = [
  BERC_RETAIL_ORDER,
  BERC_LIFELINE_REVISION,
  BERC_CONDITIONS,
  BERC_NOTIFICATIONS_PAGE,
  DPDC_TARIFF_PAGE,
  TBS_DPDC_METER_CHARGES,
  AMAR_DESH_METER_RENT,
  DAILY_STAR_SLAB_EXAMPLE,
  DAILY_STAR_SLABS_KEPT,
];

export const SLAB_IDS = ["step1", "step2", "step3", "step4", "step5", "step6"] as const;
export type SlabId = (typeof SLAB_IDS)[number];
export type RateId = "lifeline" | SlabId;
export const RATE_IDS: readonly RateId[] = ["lifeline", ...SLAB_IDS];

export interface SlabBand {
  id: SlabId;
  /** Last unit in the slab (inclusive); null for the open top slab. */
  upTo: number | null;
}

/** LT-A slab boundaries (fixed by the BERC order). */
export const SLAB_BANDS: readonly SlabBand[] = [
  { id: "step1", upTo: 75 },
  { id: "step2", upTo: 200 },
  { id: "step3", upTo: 300 },
  { id: "step4", upTo: 400 },
  { id: "step5", upTo: 600 },
  { id: "step6", upTo: null },
];

/** A month's use at or below this many units is billed entirely at the lifeline rate. */
export const LIFELINE_MAX_UNITS = 50;

export type Phase = "single" | "three";
export type Payment = "postpaid" | "prepaid";
export const PHASES: readonly Phase[] = ["single", "three"];
export const PAYMENTS: readonly Payment[] = ["postpaid", "prepaid"];

/** How sure we are of a figure: in an official order, or reported by a dated source. */
export type FigureStatus = "official" | "reported";

export interface TariffFigure {
  value: number;
  status: FigureStatus;
  source: TariffSource;
}

/** Every rate, pre-filled from BERC (৳ per kWh, excluding VAT). */
export const LT_A_RATES: Readonly<Record<RateId, TariffFigure>> = {
  lifeline: { value: 4.63, status: "official", source: BERC_LIFELINE_REVISION },
  step1: { value: 5.26, status: "official", source: BERC_LIFELINE_REVISION },
  step2: { value: 8.5, status: "official", source: BERC_RETAIL_ORDER },
  step3: { value: 9.1, status: "official", source: BERC_RETAIL_ORDER },
  step4: { value: 9.62, status: "official", source: BERC_RETAIL_ORDER },
  step5: { value: 15.01, status: "official", source: BERC_RETAIL_ORDER },
  step6: { value: 17.35, status: "official", source: BERC_RETAIL_ORDER },
};

/** ৳ per kW of sanctioned load per month (BERC; unchanged in 2026). */
export const DEMAND_CHARGE: TariffFigure = { value: 42, status: "official", source: BERC_RETAIL_ORDER };

/** Monthly meter rent for a company-supplied meter, as reported for DPDC. ৳0 if you bought the meter. */
export const METER_RENT: Readonly<Record<Phase, TariffFigure>> = {
  single: { value: 40, status: "reported", source: TBS_DPDC_METER_CHARGES },
  three: { value: 250, status: "reported", source: TBS_DPDC_METER_CHARGES },
};

/** VAT on electricity bills, as reported (BERC defers to the government's rate). */
export const VAT_PERCENT: TariffFigure = { value: 5, status: "reported", source: TBS_DPDC_METER_CHARGES };

/** Prepaid rebate on the net bill excluding VAT (BERC 2026 conditions §9(k)). */
export const PREPAID_REBATE_PERCENT: TariffFigure = { value: 0.5, status: "official", source: BERC_CONDITIONS };

/** BERC's low-tension sanctioned-load limits in kW. */
export const MAX_LOAD_KW: Readonly<Record<Phase, number>> = { single: 7.5, three: 80 };

export const MAX_UNITS = 100_000;
export const MAX_READING = 10_000_000;
export const MAX_RATE = 100;
export const MAX_DEMAND_RATE = 1_000;
export const MAX_METER_RENT = 10_000;
export const MAX_PERCENT = 100;
export const MIN_RECHARGE = 1;
export const MAX_RECHARGE = 10_000_000;

/** A complete tariff, as numbers (after the user's edits). */
export interface Tariff {
  rates: Readonly<Record<RateId, number>>;
  demandChargePerKw: number;
  meterRent: number;
  vatPercent: number;
  rebatePercent: number;
}

/** The pre-filled tariff for a meter phase. */
export function defaultTariff(phase: Phase): Tariff {
  const rates = Object.fromEntries(RATE_IDS.map((id) => [id, LT_A_RATES[id].value])) as Record<RateId, number>;
  return {
    rates,
    demandChargePerKw: DEMAND_CHARGE.value,
    meterRent: METER_RENT[phase].value,
    vatPercent: VAT_PERCENT.value,
    rebatePercent: PREPAID_REBATE_PERCENT.value,
  };
}

export interface SlabLine {
  id: RateId;
  /** First unit of the slab (1-based), e.g. 76 for step 2. */
  from: number;
  /** Last unit of the slab, or null for the open top slab (and for the lifeline line, its 50-unit cap). */
  to: number | null;
  /** Units billed in this slab. */
  units: number;
  rate: number;
  /** units × rate, rounded to paisa. */
  amount: number;
}

/**
 * The energy charge split into slab lines. Lifeline (≤ 50 units): one line,
 * every unit at the lifeline rate. Otherwise each slab rate applies only to
 * the units inside that slab.
 */
export function slabLines(units: number, rates: Readonly<Record<RateId, number>>): SlabLine[] {
  if (units <= LIFELINE_MAX_UNITS) {
    return [{ id: "lifeline", from: 1, to: LIFELINE_MAX_UNITS, units, rate: rates.lifeline, amount: roundTo(units * rates.lifeline, 2) }];
  }
  const lines: SlabLine[] = [];
  let previousTop = 0;
  for (const band of SLAB_BANDS) {
    if (units <= previousTop) break;
    const top = band.upTo ?? Infinity;
    const inSlab = Math.min(units, top) - previousTop;
    const rate = rates[band.id];
    lines.push({ id: band.id, from: previousTop + 1, to: band.upTo, units: roundTo(inSlab, 6), rate, amount: roundTo(inSlab * rate, 2) });
    previousTop = top;
  }
  return lines;
}

export interface BillBreakdown {
  units: number;
  lines: SlabLine[];
  energyCharge: number;
  loadKw: number;
  /** ৳ per kW per month used. */
  demandChargePerKw: number;
  demandCharge: number;
  meterRent: number;
  /** Energy + demand charge + meter rent (the net bill before VAT). */
  subtotal: number;
  vatPercent: number;
  vat: number;
  /** 0 for postpaid. */
  rebatePercent: number;
  rebate: number;
  total: number;
  /** total ÷ units (৳ per unit, everything included); null at 0 units. */
  averagePerUnit: number | null;
}

/** The full monthly bill for already-validated numbers. */
export function billFor(units: number, loadKw: number, payment: Payment, tariff: Tariff): BillBreakdown {
  const lines = slabLines(units, tariff.rates);
  const energyCharge = roundTo(lines.reduce((sum, line) => sum + line.amount, 0), 2);
  const demandCharge = roundTo(loadKw * tariff.demandChargePerKw, 2);
  const meterRent = roundTo(tariff.meterRent, 2);
  const subtotal = roundTo(energyCharge + demandCharge + meterRent, 2);
  const vat = roundTo((subtotal * tariff.vatPercent) / 100, 2);
  const rebatePercent = payment === "prepaid" ? tariff.rebatePercent : 0;
  const rebate = roundTo((subtotal * rebatePercent) / 100, 2);
  const total = roundTo(subtotal + vat - rebate, 2);
  return {
    units,
    lines,
    energyCharge,
    loadKw,
    demandChargePerKw: tariff.demandChargePerKw,
    demandCharge,
    meterRent,
    subtotal,
    vatPercent: tariff.vatPercent,
    vat,
    rebatePercent,
    rebate,
    total,
    averagePerUnit: units > 0 ? total / units : null,
  };
}

/**
 * The most units (to 0.01 kWh) a month's recharge of `amount` pays for, or
 * null if it does not even cover the fixed charges (demand charge, meter rent
 * and their VAT). Searches the lifeline range and the stepped range
 * separately, because crossing 50 units makes the bill jump.
 */
export function maxUnitsFor(amount: number, loadKw: number, payment: Payment, tariff: Tariff): number | null {
  const fits = (centiUnits: number) => billFor(centiUnits / 100, loadKw, payment, tariff).total <= amount;
  /** Largest c in [lo, hi] with fits(c), assuming fits is monotone there and fits(lo). */
  const search = (lo: number, hi: number) => {
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (fits(mid)) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };
  const lifelineTop = LIFELINE_MAX_UNITS * 100;
  const stepStart = lifelineTop + 1;
  if (fits(stepStart)) return search(stepStart, MAX_UNITS * 100) / 100;
  if (fits(0)) return search(0, lifelineTop) / 100;
  return null;
}

export type ElectricityMode = "units" | "readings" | "recharge";
export const MODES: readonly ElectricityMode[] = ["units", "readings", "recharge"];

export type TariffField = "rate-lifeline" | `rate-${SlabId}` | "demand-rate" | "meter-rent" | "vat" | "rebate";
export type ElectricityField = "units" | "previous" | "current" | "amount" | "load" | TariffField;

export type ElectricityErrorCode = NumberErrorCode | "below-previous" | "too-many-units" | "below-fixed-charges";

export interface ElectricityError {
  field: ElectricityField;
  code: ElectricityErrorCode;
  /** "below-fixed-charges" only: the smallest recharge that covers the month's fixed charges. */
  minimum?: number;
}

/** Raw text for every tariff box, keyed like the fields. */
export type TariffInput = Readonly<Record<TariffField, string>>;

export interface ElectricityInput {
  mode: ElectricityMode;
  units: string;
  previous: string;
  current: string;
  amount: string;
  load: string;
  phase: Phase;
  payment: Payment;
  tariff: TariffInput;
}

export interface ElectricityResult {
  mode: ElectricityMode;
  phase: Phase;
  payment: Payment;
  bill: BillBreakdown;
  /** Recharge mode: the amount entered and what is left after the bill. */
  recharge: { amount: number; leftover: number } | null;
}

export type ElectricityCalculation = { ok: true; result: ElectricityResult } | { ok: false; errors: ElectricityError[] };

export function rateField(id: RateId): TariffField {
  return `rate-${id}`;
}

/** The tariff boxes as pre-filled for a phase (rates as plain decimal text). */
export function defaultTariffInput(phase: Phase): TariffInput {
  const t = defaultTariff(phase);
  const entries: [TariffField, string][] = RATE_IDS.map((id) => [rateField(id), String(t.rates[id])]);
  return Object.fromEntries([
    ...entries,
    ["demand-rate", String(t.demandChargePerKw)],
    ["meter-rent", String(t.meterRent)],
    ["vat", String(t.vatPercent)],
    ["rebate", String(t.rebatePercent)],
  ]) as Record<TariffField, string>;
}

/** Validates every relevant field (collecting all errors) and works out the bill. */
export function calculateElectricityBill(input: ElectricityInput): ElectricityCalculation {
  const errors: ElectricityError[] = [];
  const check = (field: ElectricityField, raw: string, rule: Parameters<typeof checkNumber>[1]) => {
    const result = checkNumber(raw, rule);
    if (!result.ok) {
      errors.push({ field, code: result.code });
      return null;
    }
    return result.value;
  };

  let units: number | null = null;
  let amount: number | null = null;
  if (input.mode === "units") {
    units = check("units", input.units, { min: 0, max: MAX_UNITS });
  } else if (input.mode === "readings") {
    const previous = check("previous", input.previous, { min: 0, max: MAX_READING });
    const current = check("current", input.current, { min: 0, max: MAX_READING });
    if (previous !== null && current !== null) {
      if (current < previous) errors.push({ field: "current", code: "below-previous" });
      else if (current - previous > MAX_UNITS) errors.push({ field: "current", code: "too-many-units" });
      else units = roundTo(current - previous, 6);
    }
  } else {
    amount = check("amount", input.amount, { min: MIN_RECHARGE, max: MAX_RECHARGE });
  }

  const loadKw = check("load", input.load, { min: 0, minExclusive: true, max: MAX_LOAD_KW[input.phase] });

  const rates = {} as Record<RateId, number>;
  for (const id of RATE_IDS) {
    const value = check(rateField(id), input.tariff[rateField(id)], { min: 0, max: MAX_RATE });
    if (value !== null) rates[id] = value;
  }
  const demandChargePerKw = check("demand-rate", input.tariff["demand-rate"], { min: 0, max: MAX_DEMAND_RATE });
  const meterRent = check("meter-rent", input.tariff["meter-rent"], { min: 0, max: MAX_METER_RENT });
  const vatPercent = check("vat", input.tariff.vat, { min: 0, max: MAX_PERCENT });
  const rebatePercent = check("rebate", input.tariff.rebate, { min: 0, max: MAX_PERCENT });

  if (
    errors.length > 0 ||
    loadKw === null ||
    demandChargePerKw === null ||
    meterRent === null ||
    vatPercent === null ||
    rebatePercent === null
  ) {
    return { ok: false, errors };
  }

  const tariff: Tariff = { rates, demandChargePerKw, meterRent, vatPercent, rebatePercent };

  if (input.mode === "recharge") {
    const paid = roundTo(amount ?? 0, 2);
    const best = maxUnitsFor(paid, loadKw, input.payment, tariff);
    if (best === null) {
      const minimum = fixedChargesTotal(loadKw, input.payment, tariff);
      return { ok: false, errors: [{ field: "amount", code: "below-fixed-charges", minimum }] };
    }
    const bill = billFor(best, loadKw, input.payment, tariff);
    return {
      ok: true,
      result: {
        mode: input.mode,
        phase: input.phase,
        payment: input.payment,
        bill,
        recharge: { amount: paid, leftover: roundTo(paid - bill.total, 2) },
      },
    };
  }

  const bill = billFor(units ?? 0, loadKw, input.payment, tariff);
  return { ok: true, result: { mode: input.mode, phase: input.phase, payment: input.payment, bill, recharge: null } };
}

/** The bill for the fixed charges alone (0 units), e.g. to tell the user the minimum recharge. */
export function fixedChargesTotal(loadKw: number, payment: Payment, tariff: Tariff): number {
  return billFor(0, loadKw, payment, tariff).total;
}
