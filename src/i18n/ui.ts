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
    guides: string;
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
    /** e.g. "Last reviewed: 28 October 2026". */
    lastReviewed: (date: string) => string;
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
  guides: {
    hubTitle: string;
    hubIntro: string;
    /** Link on a calculator page to its guide. */
    readGuide: (title: string) => string;
    /** Call to action at the end of a guide. */
    useCalculator: (name: string) => string;
    published: (date: string) => string;
    updated: (date: string) => string;
    moreGuides: string;
  };
  history: {
    title: string;
    /** Under the list: where it is kept. */
    savedOnDevice: string;
    useAgain: string;
    /** Accessible name of an entry's remove button. */
    remove: (when: string) => string;
    clear: string;
    /** Checkbox: keep saving new calculations on this device. */
    saveToggle: string;
    offNote: string;
    restored: (when: string) => string;
    homeTitle: string;
    homeIntro: string;
    clearAll: string;
    clearedAll: string;
  };
  embed: {
    /** Summary of the "embed this calculator" disclosure on calculator pages. */
    summary: string;
    intro: string;
    codeLabel: string;
    /** Attribution link under an embedded calculator. */
    poweredBy: (name: string) => string;
  };
  footer: {
    calculators: string;
    categories: string;
    site: string;
    disclaimer: string;
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
    guides: "Guides",
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
    lastReviewed: (date) => `Rules last reviewed: ${date}`,
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
  guides: {
    hubTitle: "Guides",
    hubIntro: "Plain explanations of the rules behind everyday calculations in Bangladesh, each with a worked example and a calculator to try.",
    readGuide: (title) => `Read the guide: ${title}`,
    useCalculator: (name) => `Work it out with the ${name}`,
    published: (date) => `Published ${date}`,
    updated: (date) => `Updated ${date}`,
    moreGuides: "More guides",
  },
  history: {
    title: "Your recent calculations",
    savedOnDevice: "Saved only in this browser on this device. Nothing is sent to HisabBD.",
    useAgain: "Use again",
    remove: (when) => `Remove the calculation from ${when}`,
    clear: "Clear this history",
    saveToggle: "Save my calculations on this device",
    offNote: "Saving is off, so new calculations aren't remembered.",
    restored: (when) => `Filled in from your calculation ${when}.`,
    homeTitle: "Your recent calculations",
    homeIntro: "Pick up where you left off. Only this browser remembers these.",
    clearAll: "Clear everything saved on this device",
    clearedAll: "Cleared. Nothing from HisabBD is saved in this browser now.",
  },
  embed: {
    summary: "Add this calculator to your website",
    intro:
      "Copy this code into your page. It is free. The calculator runs inside your page, and nothing typed into it is sent to you or to HisabBD.",
    codeLabel: "Embed code",
    poweredBy: (name) => `${name} by HisabBD: open the full page with formula and FAQ`,
  },
  footer: {
    calculators: "Calculators",
    categories: "Categories",
    site: "HisabBD",
    disclaimer:
      "Results are for general information. For important financial, health or academic decisions, confirm with the relevant institution or a qualified professional.",
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
    guides: "গাইড",
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
    lastReviewed: (date) => `নিয়মগুলো সর্বশেষ যাচাই: ${date}`,
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
  guides: {
    hubTitle: "হিসাবের নিয়ম ও গাইড",
    hubIntro: "বাংলাদেশের দৈনন্দিন হিসাবগুলোর নিয়ম সহজ ভাষায়, প্রতিটিতে উদাহরণ আর হাতে-কলমে চেষ্টা করার জন্য একটি ক্যালকুলেটর।",
    readGuide: (title) => `গাইড পড়ুন: ${title}`,
    useCalculator: (name) => `${name} দিয়ে হিসাব করুন`,
    published: (date) => `প্রকাশ: ${date}`,
    updated: (date) => `হালনাগাদ: ${date}`,
    moreGuides: "আরও গাইড",
  },
  history: {
    title: "আপনার সাম্প্রতিক হিসাব",
    savedOnDevice: "শুধু এই ডিভাইসের এই ব্রাউজারে সংরক্ষিত। HisabBD-তে কিছুই পাঠানো হয় না।",
    useAgain: "আবার ব্যবহার করুন",
    remove: (when) => `${when}-এর হিসাবটি মুছুন`,
    clear: "এই ইতিহাস মুছুন",
    saveToggle: "এই ডিভাইসে আমার হিসাব সংরক্ষণ করুন",
    offNote: "সংরক্ষণ বন্ধ আছে, তাই নতুন হিসাব মনে রাখা হচ্ছে না।",
    restored: (when) => `আপনার ${when}-এর হিসাব থেকে ঘরগুলো পূরণ করা হয়েছে।`,
    homeTitle: "আপনার সাম্প্রতিক হিসাব",
    homeIntro: "যেখানে থেমেছিলেন সেখান থেকে শুরু করুন। শুধু এই ব্রাউজারই এগুলো মনে রাখে।",
    clearAll: "এই ডিভাইসে সংরক্ষিত সবকিছু মুছুন",
    clearedAll: "মুছে ফেলা হয়েছে। এই ব্রাউজারে এখন HisabBD-র কিছুই সংরক্ষিত নেই।",
  },
  embed: {
    summary: "আপনার ওয়েবসাইটে এই ক্যালকুলেটর যোগ করুন",
    intro:
      "এই কোডটি কপি করে আপনার পেজে বসান। এটি ফ্রি। ক্যালকুলেটরটি আপনার পেজের ভেতরেই চলে, আর এতে লেখা কোনো তথ্য আপনার বা HisabBD-র কাছে পাঠানো হয় না।",
    codeLabel: "এমবেড কোড",
    poweredBy: (name) => `HisabBD-র ${name}: সূত্র ও প্রশ্নোত্তরসহ পুরো পেজ দেখুন`,
  },
  footer: {
    calculators: "ক্যালকুলেটর",
    categories: "বিভাগ",
    site: "হিসাবBD",
    disclaimer:
      "ফলাফলগুলো সাধারণ তথ্যের জন্য। গুরুত্বপূর্ণ আর্থিক, স্বাস্থ্য বা শিক্ষাসংক্রান্ত সিদ্ধান্তের আগে সংশ্লিষ্ট প্রতিষ্ঠান বা যোগ্য পেশাদারের কাছে যাচাই করে নিন।",
    hisabMeans: "হিসাব মানে ক্যালকুলেশন।",
  },
};

export const ui: Record<Locale, UiStrings> = { en, bn };
