import type { Locale } from "./locales";

/**
 * UI strings for the site chrome and the shared calculator shell.
 * Calculator-specific labels live next to each calculator; long explanatory
 * content lives in each calculator's content files.
 */
export interface UiStrings {
  skipToContent: string;
  nav: {
    home: string;
    allCalculators: string;
    about: string;
    privacy: string;
    terms: string;
    categories: string;
    search: string;
    menu: string;
    /** Breadcrumb segment for the calculators index. */
    calculators: string;
    /** Label and text of the language switcher (names the OTHER language). */
    switchLocale: string;
    switchLocaleLabel: string;
  };
  search: {
    label: string;
    placeholder: string;
    noMatch: (query: string) => string;
    suggestionsStatus: (count: number) => string;
    suggestionsLabel: string;
    categoryDetail: string;
  };
  quickPicks: { try: string; yours: string; saved: string };
  card: { open: string };
  categoryList: { comingSoon: string; count: (n: number) => string };
  calculatorPage: {
    moreInCategory: (category: string) => string;
    faqHeading: string;
    tryNext: string;
    related: string;
  };
  actions: {
    copyResult: string;
    copied: string;
    copyFailed: string;
    share: string;
    shareFailed: string;
    save: string;
    saved: string;
    savedStatus: (name: string) => string;
    removedStatus: (name: string) => string;
    linkCopied: string;
    linkCopyFailed: (url: string) => string;
    shareThisCalculator: string;
  };
  form: { reset: string };
  footer: {
    calculators: string;
    categories: string;
    site: string;
    disclaimer: string;
    madeBy: string;
    hisabMeans: string;
  };
}

const en: UiStrings = {
  skipToContent: "Skip to content",
  nav: {
    home: "Home",
    allCalculators: "All calculators",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    categories: "Categories",
    search: "Search",
    menu: "Menu",
    calculators: "Calculators",
    switchLocale: "বাংলা",
    switchLocaleLabel: "বাংলায় দেখুন",
  },
  search: {
    label: "What do you want to calculate?",
    placeholder: "Try age, BMI, GPA or loan",
    noMatch: (query) => `Nothing matches “${query}” yet. Try another word.`,
    suggestionsStatus: (count) =>
      `${count} suggestion${count === 1 ? "" : "s"}. Use up and down arrows to choose.`,
    suggestionsLabel: "Suggestions",
    categoryDetail: "Category",
  },
  quickPicks: { try: "Try:", yours: "Your calculators:", saved: "Saved" },
  card: { open: "Open calculator" },
  categoryList: {
    comingSoon: "Coming soon",
    count: (n) => `${n} calculator${n === 1 ? "" : "s"}`,
  },
  calculatorPage: {
    moreInCategory: (category) => `More ${category} calculators`,
    faqHeading: "Frequently asked questions",
    tryNext: "Try next",
    related: "Related calculators",
  },
  actions: {
    copyResult: "Copy result",
    copied: "Copied to clipboard.",
    copyFailed: "Couldn’t copy automatically. Select the result and copy it manually.",
    share: "Share",
    shareFailed: "Sharing didn’t work here. Use “Copy result” instead.",
    save: "Save",
    saved: "Saved",
    savedStatus: (name) => `${name} saved to your calculators.`,
    removedStatus: (name) => `${name} removed from your calculators.`,
    linkCopied: "Link copied.",
    linkCopyFailed: (url) => `Couldn’t copy automatically. The link is ${url}`,
    shareThisCalculator: "this calculator",
  },
  form: { reset: "Reset" },
  footer: {
    calculators: "Calculators",
    categories: "Categories",
    site: "HisabBD",
    disclaimer:
      "Results are for general information. For important financial, health or academic decisions, confirm with the relevant institution or a qualified professional.",
    madeBy: "Made by",
    hisabMeans: "হিসাব = calculation.",
  },
};

const bn: UiStrings = {
  skipToContent: "মূল অংশে যান",
  nav: {
    home: "হোম",
    allCalculators: "সব ক্যালকুলেটর",
    about: "আমাদের সম্পর্কে",
    privacy: "গোপনীয়তা",
    terms: "শর্তাবলী",
    categories: "বিভাগ",
    search: "খুঁজুন",
    menu: "মেনু",
    calculators: "ক্যালকুলেটর",
    switchLocale: "English",
    switchLocaleLabel: "View in English",
  },
  search: {
    label: "কী হিসাব করতে চান?",
    placeholder: "যেমন: বয়স, বিএমআই, জিপিএ বা লোন",
    noMatch: (query) => `“${query}”-এর সাথে মেলে এমন কিছু পাওয়া যায়নি। অন্য শব্দ লিখে দেখুন।`,
    suggestionsStatus: (count) => `${count}টি সাজেশন। বেছে নিতে ওপরে-নিচে অ্যারো কী ব্যবহার করুন।`,
    suggestionsLabel: "সাজেশন",
    categoryDetail: "বিভাগ",
  },
  quickPicks: { try: "দেখুন:", yours: "আপনার ক্যালকুলেটর:", saved: "সেভ করা" },
  card: { open: "ক্যালকুলেটর খুলুন" },
  categoryList: {
    comingSoon: "শিগগির আসছে",
    count: (n) => `${n}টি ক্যালকুলেটর`,
  },
  calculatorPage: {
    moreInCategory: (category) => `${category} বিভাগের আরও ক্যালকুলেটর`,
    faqHeading: "সচরাচর জিজ্ঞাসা",
    tryNext: "এরপর দেখুন",
    related: "সম্পর্কিত ক্যালকুলেটর",
  },
  actions: {
    copyResult: "ফলাফল কপি করুন",
    copied: "ক্লিপবোর্ডে কপি হয়েছে।",
    copyFailed: "স্বয়ংক্রিয়ভাবে কপি করা যায়নি। ফলাফলটি সিলেক্ট করে নিজে কপি করুন।",
    share: "শেয়ার করুন",
    shareFailed: "এখানে শেয়ার করা গেল না। এর বদলে “ফলাফল কপি করুন” ব্যবহার করুন।",
    save: "সেভ করুন",
    saved: "সেভ করা",
    savedStatus: (name) => `${name} আপনার ক্যালকুলেটরে সেভ হয়েছে।`,
    removedStatus: (name) => `${name} আপনার ক্যালকুলেটর থেকে সরানো হয়েছে।`,
    linkCopied: "লিংক কপি হয়েছে।",
    linkCopyFailed: (url) => `স্বয়ংক্রিয়ভাবে কপি করা যায়নি। লিংকটি হলো ${url}`,
    shareThisCalculator: "এই ক্যালকুলেটরটি",
  },
  form: { reset: "রিসেট" },
  footer: {
    calculators: "ক্যালকুলেটর",
    categories: "বিভাগ",
    site: "হিসাবBD",
    disclaimer:
      "ফলাফলগুলো সাধারণ তথ্যের জন্য। গুরুত্বপূর্ণ আর্থিক, স্বাস্থ্য বা শিক্ষাসংক্রান্ত সিদ্ধান্তের আগে সংশ্লিষ্ট প্রতিষ্ঠান বা যোগ্য পেশাদারের কাছে যাচাই করে নিন।",
    madeBy: "তৈরি করেছেন",
    hisabMeans: "হিসাব মানে ক্যালকুলেশন।",
  },
};

export const ui: Record<Locale, UiStrings> = { en, bn };
