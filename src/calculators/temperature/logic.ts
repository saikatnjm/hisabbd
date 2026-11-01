import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Temperature conversion and fever check (documented assumptions):
 *
 * 1. °C = (°F − 32) × 5 ÷ 9 and °F = °C × 9 ÷ 5 + 32 (exact).
 * 2. Fever: the NHS says a high temperature (fever) is 38 °C or above, for
 *    adults (page reviewed 19 Oct 2026) and children (reviewed 3 Jan 2024).
 *    That is 100.4 °F. We compare the reading in °C, unrounded, with 38.
 * 3. The fever line is shown only for a plausible body temperature,
 *    34–44 °C (93.2–111.2 °F); anything else is treated as an ordinary
 *    temperature (weather, cooking) with no health message.
 * 4. This is information, not a diagnosis; the page quotes the NHS advice on
 *    when to get help, especially for babies, and says to see a doctor.
 * 5. Limits: −273.15 °C (absolute zero) to 1,000 °C, or the same in °F.
 */

export const FEVER_C = 38;
export const BODY_MIN_C = 34;
export const BODY_MAX_C = 44;
export const MIN_C = -273.15;
export const MAX_C = 1000;

export type TemperatureUnit = "f" | "c";
export const TEMPERATURE_UNITS: readonly TemperatureUnit[] = ["f", "c"];

export type FeverStatus = "fever" | "no-fever" | "not-body";

export interface TemperatureError {
  field: "value";
  code: NumberErrorCode;
}

export interface TemperatureResult {
  from: TemperatureUnit;
  value: number;
  celsius: number;
  fahrenheit: number;
  fever: FeverStatus;
}

export type TemperatureCalculation = { ok: true; result: TemperatureResult } | { ok: false; errors: TemperatureError[] };

const clean = (value: number) => roundTo(value, 10);

export function fahrenheitToCelsius(f: number): number {
  return clean(((f - 32) * 5) / 9);
}

export function celsiusToFahrenheit(c: number): number {
  return clean((c * 9) / 5 + 32);
}

/** Fever by the NHS 38 °C rule, only for a plausible body temperature. */
export function feverStatus(celsius: number): FeverStatus {
  if (celsius < BODY_MIN_C || celsius > BODY_MAX_C) return "not-body";
  return celsius >= FEVER_C ? "fever" : "no-fever";
}

export function calculateTemperature(rawValue: string, from: TemperatureUnit): TemperatureCalculation {
  const limits = from === "c" ? { min: MIN_C, max: MAX_C } : { min: celsiusToFahrenheit(MIN_C), max: celsiusToFahrenheit(MAX_C) };
  const value = checkNumber(rawValue, limits);
  if (!value.ok) return { ok: false, errors: [{ field: "value", code: value.code }] };
  const celsius = from === "c" ? value.value : fahrenheitToCelsius(value.value);
  const fahrenheit = from === "f" ? value.value : celsiusToFahrenheit(value.value);
  return { ok: true, result: { from, value: value.value, celsius, fahrenheit, fever: feverStatus(celsius) } };
}
