"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField, SegmentedControl, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { formatNumber, formatPercent, formatPlainDate, formatTaka } from "@/lib/format";
import { parseNumberInput, roundTo } from "@/lib/number";
import { parsePlainDate } from "@/lib/plain-date";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  calculateMfsCharge,
  MAX_AMOUNT,
  MAX_RATE,
  MFS_CHARGE_PRESETS,
  MFS_PRESET_KEYS,
  MFS_PROVIDERS,
  presetsForProvider,
  type MfsChargeError,
  type MfsChargeField,
  type MfsChargeResult,
  type MfsMode,
  type MfsPresetId,
  type MfsProvider,
} from "./logic";

const SLUG = "mfs-cash-out-charge-calculator";
const FIELD_IDS: Record<MfsChargeField, string> = { amount: "mfs-amount", rate: "mfs-rate" };
const PROVIDER_ID = "mfs-provider";
const CHANNEL_ID = "mfs-channel";
type ProviderChoice = MfsProvider | "other";
const PROVIDER_ORDER: readonly ProviderChoice[] = [...MFS_PROVIDERS, "other"];
const PRESET_IDS: readonly MfsPresetId[] = [...MFS_PRESET_KEYS, "custom"];
const MODE_ORDER: readonly MfsMode[] = ["cash-out", "balance"];
/** bKash's Priyo Agent rate applies up to this much cash out per calendar month. */
const PRIYO_MONTHLY_LIMIT = 50_000;
/**
 * The mode and the provider + channel (one preset id) are remembered in this
 * browser. Amounts and a typed rate are not (they go to history only).
 */
const MODE_PREF = choicePreference(SLUG, "mode", MODE_ORDER, "cash-out");
const PRESET_PREF = choicePreference(SLUG, "preset", PRESET_IDS, "bkash-priyo");

function providerOf(preset: MfsPresetId): ProviderChoice {
  return preset === "custom" ? "other" : MFS_CHARGE_PRESETS[preset].provider;
}

/** The preset's rate as the rate box shows it, or "" when it has none. */
function presetRateText(preset: MfsPresetId): string {
  if (preset === "custom") return "";
  const rate = MFS_CHARGE_PRESETS[preset].ratePerThousand;
  return rate === null ? "" : rate.toFixed(2);
}

/** Whole Taka are shown without paisa; anything else with exactly 2 decimals. */
function money(value: number): string {
  return Number.isInteger(roundTo(value, 2)) ? formatTaka(value) : formatTaka(value, { decimals: 2, minDecimals: 2 });
}

/** Rate per ৳1,000 for text, e.g. "13.95" or "15". */
function rateNumber(value: number): string {
  return formatNumber(value, { decimals: 4 });
}

const STRINGS = {
  en: {
    submit: "Calculate charge",
    modeLegend: "What do you know?",
    modes: { "cash-out": "Cash I want", balance: "My balance" },
    modeSentence: {
      "cash-out": "You know how much cash you want and need the charge and the balance it takes.",
      balance: "You have a balance and want the most cash you can take out after the charge.",
    },
    amount: { "cash-out": "Cash out amount", balance: "Balance in your account" },
    amountPlaceholder: { "cash-out": "e.g. 1,000", balance: "e.g. 10,000" },
    provider: "Provider",
    providers: { bkash: "bKash", nagad: "Nagad", rocket: "Rocket", upay: "Upay", other: "Other" },
    channel: "How you cash out",
    channels: {
      "bkash-priyo": "Priyo Agent (up to ৳50,000 a month)",
      "bkash-agent": "Any other agent",
      "bkash-atm": "ATM (enter your rate)",
      "nagad-app": "Nagad app (enter your rate)",
      "nagad-ussd": "USSD *167#",
      "nagad-islamic-app": "Nagad Islamic app",
      "rocket-agent": "Agent",
      "rocket-atm": "DBBL ATM",
      "rocket-branch": "DBBL branch",
      "upay-agent": "Agent",
      "upay-atm": "UCB ATM",
      custom: "Your own rate",
    },
    channelHints: {
      "bkash-priyo":
        "From your 2 Priyo Agents, app or *247#. A cash out that takes the month over ৳50,000 is charged ৳18.50 per ৳1,000.",
      "bkash-agent": "Any agent other than your Priyo Agents, from the app or *247#.",
      "bkash-atm": "We couldn’t confirm bKash’s current ATM rate. Enter the rate the app shows.",
      "nagad-app": "Nagad’s own pages showed different app rates. Enter the rate the app shows.",
      "nagad-ussd": "Regular and Islamic accounts. ৳13.05 plus VAT.",
      "nagad-islamic-app": "৳13.05 plus VAT.",
      "rocket-agent": "General account, 1.67%. Salary and stipend accounts pay 0.9%.",
      "rocket-atm": "General account, 0.9%. Free for salary accounts.",
      "rocket-branch": "General account, 0.9%.",
      "upay-agent": "Primary account, 1.40%. Remittance money: 1%.",
      "upay-atm": "Primary account, 0.8%. At least ৳500 per ATM withdrawal.",
      custom: "Enter the charge per ৳1,000 your provider shows.",
    },
    rate: "Charge per ৳1,000",
    ratePlaceholder: "e.g. 18.50",
    rateHint: "Change it if your app shows a different rate.",
    asOf: (date: string) => `Rate as of ${date}`,
    vatIncluded: "VAT included",
    vatUnknown: "VAT not stated",
    sourceWord: "Source",
    noConfirmed: (date: string) => `No confirmed official rate as of ${date}. Check:`,
    edited: (listed: string) => `You changed the rate (listed: ${listed}).`,
    customRateNote: "Rate entered by you.",
    announcement: (main: string, value: string, totalLabel: string, total: string) =>
      `${main} ${value}. ${totalLabel} ${total}.`,
    placeholderTitleFirst: "Your charge will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter the amount, check the provider and rate, then select Calculate charge.",
    placeholderFix: "Fix the highlighted fields above and the result will show here.",
    resultTitle: { "cash-out": "Cash-out charge", balance: "Most cash you can take out" },
    statTotal: "Deducted from balance",
    statCash: "Cash in hand",
    statCharge: "Charge",
    statEffective: "Effective charge",
    statLeftover: "Left in balance",
    statWhole: "In whole Taka",
    wholeLine: (cash: string, charge: string, total: string) => `${cash} cash + ${charge} charge = ${total}`,
    workedOutAs: "Worked out as:",
    chargeWord: "Charge",
    priyoOver:
      "This is more than ৳50,000. At a Priyo Agent, a cash out that takes the month over ৳50,000 is charged ৳18.50 per ৳1,000 for the whole transaction.",
    paisaNote: "Rounded to the nearest paisa. The charge shown in the app may differ by a few paisa.",
    changeNote: "Providers change charges from time to time. Check the app before a large cash out.",
    errAmountLabel: { "cash-out": "cash out amount", balance: "balance" },
    errAmountMin: "at least ৳0.01",
    errAmountMax: (max: string) => `${max} or less`,
    errRateLabel: "charge per ৳1,000",
    errRateMin: "0 or more",
    errRateMax: (max: string) => `${max} or less`,
    shareTitle: "Cash-out charge calculated with HisabBD",
    shareCashOut: (cash: string, rate: string, charge: string, total: string) =>
      `Cash out ${cash} at ৳${rate} per ৳1,000: charge ${charge}, ${total} deducted from the balance. Calculated with HisabBD’s Cash Out Charge Calculator.`,
    shareBalance: (balance: string, rate: string, cash: string, charge: string) =>
      `From a ${balance} balance at ৳${rate} per ৳1,000 you can cash out ${cash} (charge ${charge}). Calculated with HisabBD’s Cash Out Charge Calculator.`,
  },
  bn: {
    submit: "চার্জ হিসাব করুন",
    modeLegend: "কোনটি জানা আছে?",
    modes: { "cash-out": "কত টাকা তুলব", balance: "আমার ব্যালেন্স আছে" },
    modeSentence: {
      "cash-out": "কত টাকা তুলতে চান জানেন; চার্জ আর ব্যালেন্সে কত লাগবে তা দেখতে চান।",
      balance: "ব্যালেন্স জানেন; চার্জ বাদে সর্বোচ্চ কত টাকা তোলা যাবে তা দেখতে চান।",
    },
    amount: { "cash-out": "ক্যাশ আউটের পরিমাণ", balance: "অ্যাকাউন্টের ব্যালেন্স" },
    amountPlaceholder: { "cash-out": "যেমন 1,000", balance: "যেমন 10,000" },
    provider: "প্রতিষ্ঠান",
    providers: { bkash: "বিকাশ", nagad: "নগদ", rocket: "রকেট", upay: "উপায়", other: "অন্য" },
    channel: "যেভাবে ক্যাশ আউট করবেন",
    channels: {
      "bkash-priyo": "প্রিয় এজেন্ট (মাসে ৳50,000 পর্যন্ত)",
      "bkash-agent": "অন্য যেকোনো এজেন্ট",
      "bkash-atm": "এটিএম (নিজের হার দিন)",
      "nagad-app": "নগদ অ্যাপ (নিজের হার দিন)",
      "nagad-ussd": "USSD *167#",
      "nagad-islamic-app": "নগদ ইসলামিক অ্যাপ",
      "rocket-agent": "এজেন্ট",
      "rocket-atm": "DBBL এটিএম",
      "rocket-branch": "DBBL শাখা",
      "upay-agent": "এজেন্ট",
      "upay-atm": "UCB এটিএম",
      custom: "নিজের হার",
    },
    channelHints: {
      "bkash-priyo":
        "আপনার 2টি প্রিয় এজেন্ট থেকে, অ্যাপ বা *247#-এ। মাসে ৳50,000 পার হওয়া লেনদেনে প্রতি ৳1,000-এ ৳18.50 কাটে।",
      "bkash-agent": "প্রিয় এজেন্ট ছাড়া অন্য যেকোনো এজেন্ট, অ্যাপ বা *247#-এ।",
      "bkash-atm": "বিকাশের এটিএম চার্জের বর্তমান হার নিশ্চিত করা যায়নি। অ্যাপে যে হার দেখায় তা লিখুন।",
      "nagad-app": "নগদের নিজস্ব পেজগুলোতে অ্যাপের হার ভিন্ন ছিল। অ্যাপে যে হার দেখায় তা লিখুন।",
      "nagad-ussd": "রেগুলার ও ইসলামিক অ্যাকাউন্ট। ৳13.05 + ভ্যাট।",
      "nagad-islamic-app": "৳13.05 + ভ্যাট।",
      "rocket-agent": "সাধারণ অ্যাকাউন্ট, 1.67%। বেতন ও উপবৃত্তি অ্যাকাউন্টে 0.9%।",
      "rocket-atm": "সাধারণ অ্যাকাউন্ট, 0.9%। বেতন অ্যাকাউন্টে ফ্রি।",
      "rocket-branch": "সাধারণ অ্যাকাউন্ট, 0.9%।",
      "upay-agent": "প্রাইমারি অ্যাকাউন্ট, 1.40%। রেমিট্যান্সের টাকায় 1%।",
      "upay-atm": "প্রাইমারি অ্যাকাউন্ট, 0.8%। এটিএমে একবারে কমপক্ষে ৳500।",
      custom: "আপনার প্রতিষ্ঠান প্রতি ৳1,000-এ যে চার্জ দেখায় তা লিখুন।",
    },
    rate: "প্রতি ৳1,000-এ চার্জ",
    ratePlaceholder: "যেমন 18.50",
    rateHint: "অ্যাপে অন্য হার দেখালে এটি বদলে দিন।",
    asOf: (date: string) => `${date} পর্যন্ত হার`,
    vatIncluded: "ভ্যাটসহ",
    vatUnknown: "ভ্যাটের উল্লেখ নেই",
    sourceWord: "সূত্র",
    noConfirmed: (date: string) => `${date} পর্যন্ত নিশ্চিত অফিসিয়াল হার পাওয়া যায়নি। দেখে নিন:`,
    edited: (listed: string) => `আপনি হার বদলেছেন (তালিকায়: ${listed})।`,
    customRateNote: "হারটি আপনার দেওয়া।",
    announcement: (main: string, value: string, totalLabel: string, total: string) =>
      `${main} ${value}। ${totalLabel} ${total}।`,
    placeholderTitleFirst: "চার্জের হিসাব এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "টাকার পরিমাণ লিখুন, প্রতিষ্ঠান ও হার মিলিয়ে নিন, তারপর “চার্জ হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই ফলাফল এখানে দেখা যাবে।",
    resultTitle: { "cash-out": "ক্যাশ আউট চার্জ", balance: "সর্বোচ্চ যত টাকা তুলতে পারবেন" },
    statTotal: "ব্যালেন্স থেকে কাটবে",
    statCash: "হাতে পাবেন",
    statCharge: "চার্জ",
    statEffective: "কার্যকর চার্জ",
    statLeftover: "ব্যালেন্সে থাকবে",
    statWhole: "পূর্ণ টাকায়",
    wholeLine: (cash: string, charge: string, total: string) => `${cash} নগদ + ${charge} চার্জ = ${total}`,
    workedOutAs: "যেভাবে হিসাব হলো:",
    chargeWord: "চার্জ",
    priyoOver:
      "এটি ৳50,000-এর বেশি। প্রিয় এজেন্টে কোনো লেনদেনে মাসের ৳50,000 সীমা পার হলে পুরো লেনদেনে প্রতি ৳1,000-এ ৳18.50 কাটে।",
    paisaNote: "নিকটতম পয়সায় রাউন্ড করা। অ্যাপে দেখানো চার্জে কয়েক পয়সা পার্থক্য হতে পারে।",
    changeNote: "প্রতিষ্ঠানগুলো মাঝে মাঝে চার্জ বদলায়। বড় অঙ্ক তোলার আগে অ্যাপে দেখে নিন।",
    errAmountLabel: { "cash-out": "ক্যাশ আউটের পরিমাণ", balance: "ব্যালেন্স" },
    errAmountMin: "কমপক্ষে ৳0.01",
    errAmountMax: (max: string) => `${max} বা তার কম`,
    errRateLabel: "প্রতি ৳1,000-এ চার্জ",
    errRateMin: "0 বা তার বেশি",
    errRateMax: (max: string) => `${max} বা তার কম`,
    shareTitle: "HisabBD দিয়ে ক্যাশ আউট চার্জের হিসাব",
    shareCashOut: (cash: string, rate: string, charge: string, total: string) =>
      `প্রতি ৳1,000-এ ৳${rate} হারে ${cash} ক্যাশ আউট: চার্জ ${charge}, ব্যালেন্স থেকে কাটবে ${total}। HisabBD-র ক্যাশ আউট চার্জ ক্যালকুলেটরে হিসাব করা।`,
    shareBalance: (balance: string, rate: string, cash: string, charge: string) =>
      `${balance} ব্যালেন্স থেকে প্রতি ৳1,000-এ ৳${rate} হারে তোলা যাবে ${cash} (চার্জ ${charge})। HisabBD-র ক্যাশ আউট চার্জ ক্যালকুলেটরে হিসাব করা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

const link = "font-semibold text-brand-700 underline underline-offset-4";

function errorMessage(t: Strings, locale: Locale, mode: MfsMode, error: MfsChargeError): string {
  switch (error.field) {
    case "amount":
      return numberErrorMessage(
        error.code,
        { label: t.errAmountLabel[mode], min: t.errAmountMin, max: t.errAmountMax(formatTaka(MAX_AMOUNT)) },
        locale,
      );
    case "rate":
      return numberErrorMessage(
        error.code,
        { label: t.errRateLabel, min: t.errRateMin, max: t.errRateMax(formatTaka(MAX_RATE)) },
        locale,
      );
  }
}

/** The formula with the numbers filled in, one step per line. */
function working(t: Strings, r: MfsChargeResult): string[] {
  const rate = rateNumber(r.ratePerThousand);
  const chargeLine = `${t.chargeWord} = ${money(r.cash)} × ${rate} ÷ 1,000 = ${money(r.charge)}`;
  if (r.mode === "cash-out") return [chargeLine, `${money(r.cash)} + ${money(r.charge)} = ${money(r.total)}`];
  return [
    `${money(r.balance ?? r.total)} ÷ (1 + ${rate} ÷ 1,000) ≈ ${money(r.cash)}`,
    chargeLine,
    `${money(r.cash)} + ${money(r.charge)} = ${money(r.total)}`,
  ];
}

function shareText(t: Strings, r: MfsChargeResult): string {
  const rate = rateNumber(r.ratePerThousand);
  return r.mode === "cash-out"
    ? t.shareCashOut(money(r.cash), rate, money(r.charge), money(r.total))
    : t.shareBalance(money(r.balance ?? r.total), rate, money(r.cash), money(r.charge));
}

function headline(r: MfsChargeResult): number {
  return r.mode === "cash-out" ? r.charge : r.cash;
}

/** The "Rate as of … · Source" line for the chosen preset and typed rate. */
function RateSource({ preset, rateText }: { preset: MfsPresetId; rateText: string }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  if (preset === "custom") return <>{t.customRateNote}</>;
  const data = MFS_CHARGE_PRESETS[preset];
  const checked = parsePlainDate(data.checkedOn);
  const date = checked ? formatPlainDate(checked, { locale }) : data.checkedOn;
  const source = (
    <a href={data.source.url} target="_blank" rel="noopener" className={link}>
      {data.source.title}
    </a>
  );
  if (data.ratePerThousand === null) {
    return (
      <>
        {t.noConfirmed(date)} {source}
      </>
    );
  }
  const listed = `৳${rateNumber(data.ratePerThousand)}`;
  const vat = data.provider === "upay" ? t.vatUnknown : t.vatIncluded;
  const typed = parseNumberInput(rateText);
  const edited = typed !== null && typed !== data.ratePerThousand ? `${t.edited(listed)} ` : "";
  return (
    <>
      {edited}
      {t.asOf(date)} ({listed}, {vat}) · {t.sourceWord}: {source}
    </>
  );
}

export function MfsChargeCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [mode, setMode] = usePreference(MODE_PREF);
  const [preset, setPreset] = usePreference(PRESET_PREF);
  const [amount, setAmount] = useState("");
  /** What the user typed in the rate box; null means "use the preset's rate". */
  const [typedRate, setTypedRate] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<MfsChargeField, React.RefObject<HTMLInputElement | null>> = {
    amount: useRef<HTMLInputElement>(null),
    rate: useRef<HTMLInputElement>(null),
  };
  const { record } = useCalculationHistory();

  const provider = providerOf(preset);
  const channelOptions: readonly MfsPresetId[] = provider === "other" ? ["custom"] : presetsForProvider(provider);
  const rateText = typedRate ?? presetRateText(preset);
  const modeOptions = MODE_ORDER.map((value) => ({ value, label: t.modes[value] }));
  const calc = submitted ? calculateMfsCharge(mode, amount, rateText) : null;
  const errorFor = (field: MfsChargeField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, mode, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function changeMode(next: MfsMode) {
    setMode(next);
    setSubmitted(false);
    setRevealCount(0);
  }

  /** A new provider starts at its first channel; the rate box follows the preset. */
  function onProviderChange(value: string) {
    const next = PROVIDER_ORDER.find((p) => p === value) ?? "bkash";
    setPreset(next === "other" ? "custom" : (presetsForProvider(next)[0] ?? "custom"));
    setTypedRate(null);
  }

  function onChannelChange(value: string) {
    setPreset(PRESET_IDS.find((id) => id === value) ?? "custom");
    setTypedRate(null);
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculateMfsCharge(mode, amount, rateText);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record({ mode, amount, preset, rate: rateText }, shareText(t, check.result));
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  /** Fills the form from a saved calculation and shows its result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const text = (key: string) => (typeof saved[key] === "string" ? saved[key] : "");
    const savedMode = MODE_ORDER.find((m) => m === saved.mode);
    const savedPreset = PRESET_IDS.find((id) => id === saved.preset);
    if (savedMode) setMode(savedMode);
    if (savedPreset) setPreset(savedPreset);
    setAmount(text("amount"));
    setTypedRate(text("rate"));
    setSubmitted(true);
    setRevealCount((n) => n + 1);
  }

  /** Clears what was typed; the remembered mode, provider and channel stay. */
  function onReset() {
    setAmount("");
    setTypedRate(null);
    setSubmitted(false);
    setRevealCount(0);
    refs.amount.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <SegmentedControl name="mfs-mode" legend={t.modeLegend} options={modeOptions} value={mode} onChange={changeMode} />
        <p className="mt-3 text-slate-700">{t.modeSentence[mode]}</p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField id={FIELD_IDS.amount} label={t.amount[mode]} error={errorFor("amount")}>
              {(control) => (
                <AffixInput
                  {...control}
                  ref={refs.amount}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  prefix="৳"
                  placeholder={t.amountPlaceholder[mode]}
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              )}
            </FormField>
          </div>
          <FormField id={PROVIDER_ID} label={t.provider}>
            {(control) => (
              <Select {...control} value={provider} onChange={(event) => onProviderChange(event.target.value)}>
                {PROVIDER_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {t.providers[id]}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField id={CHANNEL_ID} label={t.channel} hint={t.channelHints[preset]}>
            {(control) => (
              <Select {...control} value={preset} onChange={(event) => onChannelChange(event.target.value)}>
                {channelOptions.map((id) => (
                  <option key={id} value={id}>
                    {t.channels[id]}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField id={FIELD_IDS.rate} label={t.rate} hint={t.rateHint} error={errorFor("rate")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.rate}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.ratePlaceholder}
                value={rateText}
                onChange={(event) => setTypedRate(event.target.value)}
              />
            )}
          </FormField>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          <RateSource preset={preset} rateText={rateText} />
        </p>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={
          result
            ? t.announcement(t.resultTitle[result.mode], money(headline(result)), t.statTotal, money(result.total))
            : ""
        }
        result={result && <MfsChargeResultView result={result} preset={preset} rateText={rateText} />}
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

function MfsChargeResultView({
  result: r,
  preset,
  rateText,
}: {
  result: MfsChargeResult;
  preset: MfsPresetId;
  rateText: string;
}) {
  const t = STRINGS[useLocale()];
  const effective = { label: t.statEffective, value: formatPercent(r.effectivePercent, { decimals: 4 }) };
  const stats =
    r.mode === "cash-out"
      ? [{ label: t.statTotal, value: money(r.total) }, { label: t.statCash, value: money(r.cash) }, effective]
      : [
          { label: t.statCharge, value: money(r.charge) },
          { label: t.statTotal, value: money(r.total) },
          { label: t.statLeftover, value: money(r.leftover ?? 0) },
          effective,
        ];
  const text = shareText(t, r);
  const showPriyoWarning = preset === "bkash-priyo" && r.cash > PRIYO_MONTHLY_LIMIT;

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle[r.mode]}
        titleId="mfs-result-heading"
        value={
          <p className="font-display text-5xl font-bold tracking-tight break-words sm:text-6xl">{money(headline(r))}</p>
        }
      >
        <ResultStats items={stats} />
        {r.wholeTaka && (
          <p className="mt-3 text-slate-800">
            <span className="font-medium">{t.statWhole}:</span>{" "}
            {t.wholeLine(money(r.wholeTaka.cash), money(r.wholeTaka.charge), money(r.wholeTaka.total))}
          </p>
        )}
        <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-slate-800">
          <p className="text-sm text-slate-600">{t.workedOutAs}</p>
          {working(t, r).map((line) => (
            <p key={line} className="font-medium break-words">
              {line}
            </p>
          ))}
        </div>
        {showPriyoWarning && <p className="mt-3 text-sm font-medium text-slate-800">{t.priyoOver}</p>}
        <p className="mt-4 text-sm text-slate-600">
          <RateSource preset={preset} rateText={rateText} />
        </p>
        <p className="mt-1 text-sm text-slate-600">{t.paisaNote}</p>
        <p className="mt-1 text-sm text-slate-600">{t.changeNote}</p>
      </ResultPanel>

      <ResultActions key={text} text={text} shareTitle={t.shareTitle} />
    </div>
  );
}
