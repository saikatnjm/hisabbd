/*
 * Illustrative appliances for the electricity units guide. The watts are
 * round example figures, not any brand's rating; the guide tells readers to
 * use their own appliance's label. The bills in the guide's worked examples
 * are pinned by tests in src/calculators/electricity/logic.test.ts.
 */

/** Days in a month for the guide's monthly figures. */
export const DAYS_PER_MONTH = 30;

export const APPLIANCE_EXAMPLES = [
  { id: "led", watts: 10, hoursPerDay: 6 },
  { id: "fan", watts: 75, hoursPerDay: 10 },
  { id: "tv", watts: 100, hoursPerDay: 5 },
  { id: "rice-cooker", watts: 700, hoursPerDay: 1 },
  { id: "ac", watts: 1500, hoursPerDay: 8 },
] as const;

/** Units (kWh) a month: watts × hours a day × days ÷ 1,000. */
export function monthlyUnits(watts: number, hoursPerDay: number, days = DAYS_PER_MONTH): number {
  return (watts * hoursPerDay * days) / 1000;
}
