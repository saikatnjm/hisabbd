"use client";

import { useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FieldMessage, Input, Label, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { AddRowButton, RemoveRowButton } from "@/calculators/education/row-controls";
import { rowsFromJson, rowsToJson, useRowList } from "@/calculators/education/use-row-list";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatPercent, formatTaka } from "@/lib/format";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import {
  calculateUnitPrice,
  isUnitId,
  MAX_OPTIONS,
  MAX_PRICE,
  MAX_QUANTITY,
  type OptionResult,
  type OptionRowInput,
  type UnitGroup,
  type UnitId,
  type UnitPriceError,
  type UnitPriceResult,
} from "./logic";

const INITIAL_ROWS = 2;
const DEFAULT_UNIT: UnitId = "kg";
const SAVED_FIELDS = ["name", "price", "quantity", "unit"] as const;
const fieldId = (rowId: number, field: "name" | "price" | "quantity" | "unit") => `unit-price-option-${rowId}-${field}`;
const firstFieldId = (rowId: number) => fieldId(rowId, "name");
const createRow = (id: number): OptionRowInput => ({ id, name: "", price: "", quantity: "", unit: DEFAULT_UNIT });

/** ৳ with paisa only when there is a fraction. */
function money(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? formatTaka(rounded) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

const STRINGS = {
  en: {
    submit: "Compare prices",
    intro: "Add each pack or size you are comparing: its price and how much you get. All options must be the same kind of unit (weight, volume or count).",
    optionsLabel: "Options",
    optionN: (n: number) => `Option ${n}`,
    nameOptional: "Name (optional)",
    namePlaceholder: (n: number) => `e.g. Pack ${n}`,
    price: "Price",
    quantity: "Quantity",
    unit: "Unit",
    groupWeight: "Weight",
    groupVolume: "Volume",
    groupCount: "Count",
    units: { g: "g", kg: "kg", ml: "ml", l: "litre", piece: "piece", dozen: "dozen (12)", hali: "hali (4)" } as Record<UnitId, string>,
    removeOption: (n: number) => `Remove option ${n}`,
    addOption: "Add option",
    limit: `Up to ${MAX_OPTIONS} options.`,
    errPrice: (n: number) => `price of option ${n}`,
    errQuantity: (n: number) => `quantity of option ${n}`,
    errMoreThanZero: "more than ৳0",
    errQtyMoreThanZero: "more than 0",
    errPriceMax: `${formatTaka(MAX_PRICE)} or less`,
    errQuantityMax: `${formatNumber(MAX_QUANTITY)} or less`,
    errBadUnit: "Choose a unit.",
    errTooFew: "Enter at least 2 options to compare.",
    errTooMany: `Enter up to ${MAX_OPTIONS} options.`,
    errMixed: "These units can’t be compared. Use only weight (g, kg), only volume (ml, litre) or only count (piece, dozen, hali) for every option.",
    resultTitle: "Cheapest option",
    perKg: "per kg",
    perLitre: "per litre",
    perPiece: "per piece",
    per100g: "per 100 g",
    per100ml: "per 100 ml",
    saving: (u: string) => `You save per ${u}`,
    savingPercent: "Cheaper than the dearest by",
    kgWord: "kg",
    litreWord: "litre",
    pieceWord: "piece",
    options: "Options",
    allSame: "Every option costs the same per unit, so pick whichever suits you.",
    cheapestBadge: "Cheapest",
    tableCaption: "Options ranked by unit price, cheapest first",
    rankCol: "Rank",
    optionCol: "Option",
    packCol: "Pack",
    priceCol: "Unit price",
    moreCol: "More than cheapest",
    same: "same",
    announcement: (name: string, price: string, per: string) => `${name} is cheapest at ${price} ${per}.`,
    placeholderTitleFirst: "The comparison will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter a price and quantity for at least 2 options, then select Compare prices.",
    placeholderFix: "Fix the highlighted fields above and the comparison will show here.",
    shareTitle: "Unit price comparison from HisabBD",
    shareHead: (name: string, price: string, per: string) => `Cheapest: ${name} at ${price} ${per}.`,
    shareSaving: (saving: string, per: string, pct: string) => `Saves ${saving} ${per} (${pct}) compared with the dearest.`,
    shareTail: "Compared with HisabBD’s Unit Price Calculator.",
  },
  bn: {
    submit: "দাম তুলনা করুন",
    intro: "যে প্যাক বা সাইজগুলো তুলনা করবেন সেগুলোর দাম আর কত পাচ্ছেন লিখুন। সব অপশনের একক একই ধরনের হতে হবে (ওজন, তরল বা গণনা)।",
    optionsLabel: "অপশন",
    optionN: (n: number) => `অপশন ${n}`,
    nameOptional: "নাম (ঐচ্ছিক)",
    namePlaceholder: (n: number) => `যেমন প্যাক ${n}`,
    price: "দাম",
    quantity: "পরিমাণ",
    unit: "একক",
    groupWeight: "ওজন",
    groupVolume: "তরল",
    groupCount: "গণনা",
    units: { g: "গ্রাম", kg: "কেজি", ml: "মিলি", l: "লিটার", piece: "পিস", dozen: "ডজন (12)", hali: "হালি (4)" } as Record<UnitId, string>,
    removeOption: (n: number) => `অপশন ${n} বাদ দিন`,
    addOption: "অপশন যোগ করুন",
    limit: `সর্বোচ্চ ${MAX_OPTIONS}টি অপশন।`,
    errPrice: (n: number) => `অপশন ${n}-এর দাম`,
    errQuantity: (n: number) => `অপশন ${n}-এর পরিমাণ`,
    errMoreThanZero: "৳0-র বেশি",
    errQtyMoreThanZero: "0-র বেশি",
    errPriceMax: `${formatTaka(MAX_PRICE)} বা তার কম`,
    errQuantityMax: `${formatNumber(MAX_QUANTITY)} বা তার কম`,
    errBadUnit: "একটি একক বেছে নিন।",
    errTooFew: "তুলনার জন্য অন্তত 2টি অপশন লিখুন।",
    errTooMany: `সর্বোচ্চ ${MAX_OPTIONS}টি অপশন লিখুন।`,
    errMixed: "এই এককগুলো তুলনা করা যায় না। সব অপশনে শুধু ওজন (গ্রাম, কেজি), শুধু তরল (মিলি, লিটার) বা শুধু গণনা (পিস, ডজন, হালি) ব্যবহার করুন।",
    resultTitle: "সবচেয়ে সস্তা অপশন",
    perKg: "কেজি প্রতি",
    perLitre: "লিটার প্রতি",
    perPiece: "পিস প্রতি",
    per100g: "100 গ্রাম প্রতি",
    per100ml: "100 মিলি প্রতি",
    saving: (u: string) => `${u} প্রতি সাশ্রয়`,
    savingPercent: "সবচেয়ে দামির চেয়ে সস্তা",
    kgWord: "কেজি",
    litreWord: "লিটার",
    pieceWord: "পিস",
    options: "অপশন",
    allSame: "সব অপশনের একক দাম সমান, তাই যেটা সুবিধা সেটাই নিন।",
    cheapestBadge: "সবচেয়ে সস্তা",
    tableCaption: "একক দামে সাজানো অপশন, সস্তা আগে",
    rankCol: "ক্রম",
    optionCol: "অপশন",
    packCol: "প্যাক",
    priceCol: "একক দাম",
    moreCol: "সস্তার চেয়ে বেশি",
    same: "সমান",
    announcement: (name: string, price: string, per: string) => `${name} সবচেয়ে সস্তা, ${per} ${price}।`,
    placeholderTitleFirst: "তুলনা এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "অন্তত 2টি অপশনের দাম আর পরিমাণ লিখে “দাম তুলনা করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই তুলনা এখানে দেখা যাবে।",
    shareTitle: "HisabBD-র একক দামের তুলনা",
    shareHead: (name: string, price: string, per: string) => `সবচেয়ে সস্তা: ${name}, ${per} ${price}।`,
    shareSaving: (saving: string, per: string, pct: string) => `সবচেয়ে দামিটির চেয়ে ${per} ${saving} (${pct}) সাশ্রয়।`,
    shareTail: "HisabBD-র একক দাম ক্যালকুলেটরে তুলনা করা।",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

const UNIT_GROUPS: { id: UnitGroup; units: readonly UnitId[] }[] = [
  { id: "weight", units: ["g", "kg"] },
  { id: "volume", units: ["ml", "l"] },
  { id: "count", units: ["piece", "dozen", "hali"] },
];

function groupLabel(t: Strings, group: UnitGroup): string {
  return group === "weight" ? t.groupWeight : group === "volume" ? t.groupVolume : t.groupCount;
}

/** "per kg" / "per litre" / "per piece" in the page language. */
function perMainText(t: Strings, group: UnitGroup): string {
  return group === "weight" ? t.perKg : group === "volume" ? t.perLitre : t.perPiece;
}

function mainWord(t: Strings, group: UnitGroup): string {
  return group === "weight" ? t.kgWord : group === "volume" ? t.litreWord : t.pieceWord;
}

function perSmallText(t: Strings, group: UnitGroup): string {
  return group === "weight" ? t.per100g : t.per100ml;
}

function errorMessage(t: Strings, locale: Locale, error: UnitPriceError, n: number): string {
  switch (error.code) {
    case "too-few":
      return t.errTooFew;
    case "too-many":
      return t.errTooMany;
    case "mixed-groups":
      return t.errMixed;
    case "bad-unit":
      return t.errBadUnit;
    default:
      return error.field === "price"
        ? numberErrorMessage(error.code, { label: t.errPrice(n), min: t.errMoreThanZero, max: t.errPriceMax }, locale)
        : numberErrorMessage(error.code, { label: t.errQuantity(n), min: t.errQtyMoreThanZero, max: t.errQuantityMax }, locale);
  }
}

function optionName(t: Strings, o: OptionResult): string {
  return o.name || t.optionN(o.position);
}

function packText(t: Strings, o: OptionResult): string {
  return `${formatNumber(o.quantity, { decimals: 3 })} ${t.units[o.unit]} · ${money(o.price)}`;
}

function cheapestOf(r: UnitPriceResult): OptionResult {
  return r.options[r.order[0]!]!;
}

function cheapestNames(t: Strings, r: UnitPriceResult): string {
  return r.options.filter((o) => o.isCheapest).map((o) => optionName(t, o)).join(", ");
}

function shareText(t: Strings, r: UnitPriceResult): string {
  const per = perMainText(t, r.group);
  const lines = [t.shareHead(cheapestNames(t, r), money(cheapestOf(r).perMain), per)];
  if (!r.allSame) lines.push(t.shareSaving(money(r.savingPerMain), per, formatPercent(r.savingPercent)));
  lines.push(t.shareTail);
  return lines.join("\n");
}

export function UnitPriceCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const list = useRowList<OptionRowInput>({ createRow, initialCount: INITIAL_ROWS, maxRows: MAX_OPTIONS, focusTargetId: firstFieldId });
  const { rows } = list;
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const { record } = useCalculationHistory();

  const calc = submitted ? calculateUnitPrice(rows) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const rowError = (rowId: number, field: "price" | "quantity" | "unit", n: number) => {
    const error = errorList.find((e) => e.rowId === rowId && e.field === field);
    return error ? errorMessage(t, locale, error, n) : undefined;
  };
  const listError = errorList.find((e) => e.rowId === null);
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateUnitPrice(rows);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ rows: rowsToJson(rows, SAVED_FIELDS) }, shareText(t, check.result));
      return;
    }
    const first = check.errors.find((e) => e.rowId !== null);
    const target = first?.rowId ?? rows[0]?.id;
    if (target !== undefined) document.getElementById(fieldId(target, first?.field === "unit" ? "unit" : first?.field === "quantity" ? "quantity" : "price"))?.focus();
  }

  /** Fills the form from a saved calculation and shows its result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const restored = rowsFromJson(saved.rows, SAVED_FIELDS).map((row) => ({ ...row, unit: isUnitId(row.unit) ? row.unit : DEFAULT_UNIT }));
    list.replaceRows(restored);
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  function onReset() {
    list.resetRows();
    setSubmitted(false);
    setRevealCount(0);
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <p className="mb-4 text-sm text-slate-600">{t.intro}</p>
        <ul className="space-y-3" aria-label={t.optionsLabel}>
          {rows.map((row, index) => {
            const n = index + 1;
            const priceError = rowError(row.id, "price", n);
            const quantityError = rowError(row.id, "quantity", n);
            const unitError = rowError(row.id, "unit", n);
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">{t.optionN(n)}</p>
                  <RemoveRowButton label={t.removeOption(n)} disabled={!list.canRemove} onClick={() => list.removeRow(row.id)} />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="col-span-2 min-w-0 sm:col-span-3">
                    <Label htmlFor={fieldId(row.id, "name")}>
                      <span className="sr-only">{t.optionN(n)} </span>
                      {t.nameOptional}
                    </Label>
                    <Input
                      id={fieldId(row.id, "name")}
                      type="text"
                      autoComplete="off"
                      maxLength={40}
                      placeholder={t.namePlaceholder(n)}
                      value={row.name}
                      onChange={(event) => list.updateRow(row.id, { name: event.target.value })}
                    />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "price")}>
                      <span className="sr-only">{t.optionN(n)} </span>
                      {t.price}
                    </Label>
                    <AffixInput
                      id={fieldId(row.id, "price")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      prefix="৳"
                      value={row.price}
                      aria-invalid={priceError ? true : undefined}
                      aria-describedby={priceError ? `${fieldId(row.id, "price")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { price: event.target.value })}
                    />
                    {priceError && (
                      <FieldMessage id={`${fieldId(row.id, "price")}-error`} error>
                        {priceError}
                      </FieldMessage>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "quantity")}>
                      <span className="sr-only">{t.optionN(n)} </span>
                      {t.quantity}
                    </Label>
                    <Input
                      id={fieldId(row.id, "quantity")}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={row.quantity}
                      aria-invalid={quantityError ? true : undefined}
                      aria-describedby={quantityError ? `${fieldId(row.id, "quantity")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { quantity: event.target.value })}
                    />
                    {quantityError && (
                      <FieldMessage id={`${fieldId(row.id, "quantity")}-error`} error>
                        {quantityError}
                      </FieldMessage>
                    )}
                  </div>
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label htmlFor={fieldId(row.id, "unit")}>
                      <span className="sr-only">{t.optionN(n)} </span>
                      {t.unit}
                    </Label>
                    <Select
                      id={fieldId(row.id, "unit")}
                      value={row.unit}
                      aria-invalid={unitError ? true : undefined}
                      aria-describedby={unitError ? `${fieldId(row.id, "unit")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { unit: event.target.value })}
                    >
                      {UNIT_GROUPS.map((group) => (
                        <optgroup key={group.id} label={groupLabel(t, group.id)}>
                          {group.units.map((unit) => (
                            <option key={unit} value={unit}>
                              {t.units[unit]}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Select>
                    {unitError && (
                      <FieldMessage id={`${fieldId(row.id, "unit")}-error`} error>
                        {unitError}
                      </FieldMessage>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {listError && (
          <div className="mt-3">
            <FieldMessage id="unit-price-rows-error" error>
              {errorMessage(t, locale, listError, 0)}
            </FieldMessage>
          </div>
        )}

        <AddRowButton label={t.addOption} limitMessage={t.limit} disabled={!list.canAdd} onClick={list.addRow} />
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(cheapestNames(t, result), money(cheapestOf(result).perMain), perMainText(t, result.group)) : ""}
        result={result && <UnitPriceResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">৳–</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function UnitPriceResultView({ result: r }: { result: UnitPriceResult }) {
  const t = STRINGS[useLocale()];
  const text = shareText(t, r);
  const best = cheapestOf(r);
  const perMain = perMainText(t, r.group);
  const stats = r.allSame
    ? [{ label: t.options, value: formatNumber(r.options.length) }]
    : [
        { label: t.saving(mainWord(t, r.group)), value: money(r.savingPerMain) },
        { label: t.savingPercent, value: formatPercent(r.savingPercent) },
      ];
  if (best.perSmall !== null) stats.push({ label: perSmallText(t, r.group), value: money(best.perSmall) });

  return (
    <div className="space-y-4">
      <ResultPanel
        title={`${t.resultTitle}: ${cheapestNames(t, r)}`}
        titleId="unit-price-result-heading"
        value={
          <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">
            {money(best.perMain)} <span className="text-2xl font-semibold sm:text-3xl">{perMain}</span>
          </p>
        }
      >
        {r.allSame && <p className="mb-3 text-slate-800">{t.allSame}</p>}
        <ResultStats items={stats} />
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[24rem] text-right text-sm">
            <caption className="sr-only">{t.tableCaption}</caption>
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2 pr-2 text-left font-medium">{t.rankCol}</th>
                <th scope="col" className="px-2 py-2 text-left font-medium">{t.optionCol}</th>
                <th scope="col" className="px-2 py-2 font-medium">{t.packCol}</th>
                <th scope="col" className="px-2 py-2 font-medium">{t.priceCol} ({perMain})</th>
                <th scope="col" className="py-2 pl-2 font-medium">{t.moreCol}</th>
              </tr>
            </thead>
            <tbody>
              {r.order.map((i) => {
                const o = r.options[i]!;
                return (
                  <tr key={o.rowId} className="border-b border-slate-200 last:border-0">
                    <td className="py-2 pr-2 text-left tabular-nums">{formatNumber(o.rank)}</td>
                    <th scope="row" className="px-2 py-2 text-left font-medium text-slate-900">
                      {optionName(t, o)}
                      {o.isCheapest && <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-900">{t.cheapestBadge}</span>}
                    </th>
                    <td className="px-2 py-2 tabular-nums">{packText(t, o)}</td>
                    <td className="px-2 py-2 font-semibold tabular-nums">{money(o.perMain)}</td>
                    <td className="py-2 pl-2 tabular-nums">{o.isCheapest ? t.same : formatPercent(o.morePercent)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}
