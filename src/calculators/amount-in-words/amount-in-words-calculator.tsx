"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { Button } from "@/components/ui/button";
import { AffixInput, FormField } from "@/components/ui/form";
import { CopyIcon } from "@/components/ui/icons";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import { formatTaka } from "@/lib/format";
import {
  calculateAmountInWords,
  MAX_AMOUNT,
  type AmountInWordsError,
  type AmountInWordsField,
  type AmountInWordsResult,
} from "./logic";

const FIELD_IDS: Record<AmountInWordsField, string> = {
  amount: "amount-in-words-amount",
};

const STRINGS = {
  en: {
    submit: "Write in words",
    amount: "Amount",
    amountHint: "Up to 2 decimals for paisa. Bangla digits and commas are fine, e.g. ১,২৫,৩০০.৫০.",
    amountPlaceholder: "e.g. 1,25,300.50",
    announcement: (words: string) => `In words: ${words}`,
    placeholderTitleFirst: "The amount in words will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Enter a Taka amount, then select Write in words.",
    placeholderFix: "Fix the highlighted field above and the words will show here.",
    placeholderPreview: "… Taka Only",
    resultTitle: "Amount in words (English)",
    otherTitle: "In Bangla",
    internationalTitle: "International (million) format",
    digitsWestern: "In figures",
    digitsBangla: "In Bangla digits",
    copy: "Copy",
    copyEnglish: "Copy the English words",
    copyBangla: "Copy the Bangla words",
    copyInternational: "Copy the international format",
    errAmountLabel: "amount",
    errAmountMin: "0 or more",
    errAmountMax: (max: string) => `${max} or less`,
    errTooManyDecimals: "Use at most 2 decimal places (paisa), for example 1250.50.",
    shareTitle: "Taka amount in words with HisabBD",
    shareText: (digits: string, english: string, bangla: string) =>
      `৳${digits} in words:\nEnglish: ${english}\nBangla: ${bangla}\nWritten with HisabBD’s Taka Amount in Words.`,
  },
  bn: {
    submit: "কথায় লিখুন",
    amount: "টাকার পরিমাণ",
    amountHint: "পয়সার জন্য দশমিকের পর সর্বোচ্চ 2 ঘর। বাংলা অঙ্ক ও কমা চলবে, যেমন ১,২৫,৩০০.৫০।",
    amountPlaceholder: "যেমন 1,25,300.50",
    announcement: (words: string) => `কথায়: ${words}`,
    placeholderTitleFirst: "টাকার অঙ্ক কথায় এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "টাকার পরিমাণ লিখে “কথায় লিখুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরটি ঠিক করলেই কথায় লেখা এখানে দেখা যাবে।",
    placeholderPreview: "… টাকা মাত্র",
    resultTitle: "টাকা কথায় (বাংলা)",
    otherTitle: "ইংরেজিতে",
    internationalTitle: "আন্তর্জাতিক (মিলিয়ন) পদ্ধতিতে",
    digitsWestern: "ইংরেজি অঙ্কে",
    digitsBangla: "বাংলা অঙ্কে",
    copy: "কপি",
    copyEnglish: "ইংরেজি কথাগুলো কপি করুন",
    copyBangla: "বাংলা কথাগুলো কপি করুন",
    copyInternational: "আন্তর্জাতিক পদ্ধতির লেখা কপি করুন",
    errAmountLabel: "টাকার পরিমাণ",
    errAmountMin: "0 বা তার বেশি",
    errAmountMax: (max: string) => `${max} বা তার কম`,
    errTooManyDecimals: "দশমিকের পর সর্বোচ্চ 2 ঘর (পয়সা) লিখুন, যেমন 1250.50।",
    shareTitle: "HisabBD দিয়ে টাকা কথায়",
    shareText: (digits: string, english: string, bangla: string) =>
      `৳${digits} কথায়:\nবাংলা: ${bangla}\nইংরেজি: ${english}\nHisabBD-র টাকা কথায় লেখার ক্যালকুলেটরে লেখা।`,
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, locale: Locale, error: AmountInWordsError): string {
  if (error.code === "too-many-decimals") return t.errTooManyDecimals;
  return numberErrorMessage(
    error.code,
    { label: t.errAmountLabel, min: t.errAmountMin, max: t.errAmountMax(formatTaka(MAX_AMOUNT, { decimals: 2 })) },
    locale,
  );
}

function shareText(t: Strings, r: AmountInWordsResult): string {
  return t.shareText(r.digits, r.english, r.bangla);
}

export function AmountInWordsCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs: Record<AmountInWordsField, React.RefObject<HTMLInputElement | null>> = {
    amount: useRef<HTMLInputElement>(null),
  };

  const calc = submitted ? calculateAmountInWords(amount) : null;
  const errorFor = (field: AmountInWordsField) => {
    const error = calc && !calc.ok ? calc.errors.find((e) => e.field === field) : undefined;
    return error ? errorMessage(t, locale, error) : undefined;
  };
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateAmountInWords(amount);
    if (check.ok) {
      setRevealCount((n) => n + 1);
    } else {
      const first = check.errors[0];
      if (first) refs[first.field].current?.focus();
    }
  }

  function onReset() {
    setAmount("");
    setSubmitted(false);
    setRevealCount(0);
    refs.amount.current?.focus();
  }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <div className="sm:max-w-[calc(50%-0.625rem)]">
          <FormField id={FIELD_IDS.amount} label={t.amount} hint={t.amountHint} error={errorFor("amount")}>
            {(control) => (
              <AffixInput
                {...control}
                ref={refs.amount}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                prefix="৳"
                placeholder={t.amountPlaceholder}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? t.announcement(locale === "bn" ? result.bangla : result.english) : ""}
        result={result && <AmountInWordsResultView result={result} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-2xl font-bold tracking-tight">{t.placeholderPreview}</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

/**
 * Copies one line of words (without the page link, unlike ResultActions),
 * so it can be pasted straight into a cheque template or invoice.
 */
function CopyLineButton({ text, label }: { text: string; label: string }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const actions = ui[locale].actions;
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(actions.copied);
    } catch {
      setStatus(actions.copyFailed);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3">
      <Button variant="secondary" onClick={copy} aria-label={label}>
        <CopyIcon className="size-5" />
        {t.copy}
      </Button>
      <p role="status" className="min-h-5 text-sm text-slate-700">
        {status}
      </p>
    </div>
  );
}

/** One worded line with its own heading and copy button. */
function WordsBlock({
  title,
  text,
  lang,
  copyLabel,
}: {
  title: string;
  text: string;
  lang: Locale;
  copyLabel: string;
}) {
  return (
    <div className="rounded-xl bg-white/70 px-4 py-3">
      <h3 className="text-sm text-slate-600">{title}</h3>
      <p lang={lang} className="mt-1 text-lg font-semibold break-words text-slate-900">
        {text}
      </p>
      <CopyLineButton key={text} text={text} label={copyLabel} />
    </div>
  );
}

function AmountInWordsResultView({ result: r }: { result: AmountInWordsResult }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  // The page's own language comes first; the other language follows.
  const primary = locale === "bn" ? { text: r.bangla, copy: t.copyBangla } : { text: r.english, copy: t.copyEnglish };
  const other =
    locale === "bn"
      ? { text: r.english, copy: t.copyEnglish, lang: "en" as const }
      : { text: r.bangla, copy: t.copyBangla, lang: "bn" as const };
  const stats = [
    { label: t.digitsWestern, value: <span lang="en">৳{r.digits}</span> },
    { label: t.digitsBangla, value: <span lang="bn">৳{r.digitsBangla}</span> },
  ];

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle}
        titleId="amount-in-words-result-heading"
        value={
          <>
            <p className="font-display text-2xl font-bold tracking-tight break-words sm:text-3xl">{primary.text}</p>
            <CopyLineButton key={primary.text} text={primary.text} label={primary.copy} />
          </>
        }
      >
        <div className="space-y-3">
          <WordsBlock title={t.otherTitle} text={other.text} lang={other.lang} copyLabel={other.copy} />
          <WordsBlock
            title={t.internationalTitle}
            text={r.englishInternational}
            lang="en"
            copyLabel={t.copyInternational}
          />
        </div>
        <ResultStats items={stats} className="mt-5" />
      </ResultPanel>

      <ResultActions key={shareText(t, r)} text={shareText(t, r)} shareTitle={t.shareTitle} />
    </div>
  );
}
