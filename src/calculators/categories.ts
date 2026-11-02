import type { Category, CategoryId } from "./types";

export const categories: readonly Category[] = [
  {
    id: "health",
    name: "Health",
    nameBn: "স্বাস্থ্য",
    description: "BMI, daily calories, pregnancy due date, ovulation days and fever temperature.",
    descriptionBn: "বিএমআই, দৈনিক ক্যালরি, প্রেগন্যান্সির ডেলিভারির তারিখ, ওভুলেশনের দিন আর জ্বরের তাপমাত্রা।",
    seo: {
      title: "Health Calculators: BMI, Pregnancy, Calories, Fever",
      description:
        "Free health calculators in English and Bangla: BMI, daily calories, pregnancy due date, ovulation days and fever °F to °C, each with its medical source.",
    },
    seoBn: {
      title: "স্বাস্থ্য ক্যালকুলেটর: বিএমআই, প্রেগন্যান্সি, ক্যালরি, জ্বর",
      description:
        "ফ্রি স্বাস্থ্য ক্যালকুলেটর: বিএমআই, দৈনিক ক্যালরি, প্রেগন্যান্সির ডেলিভারির তারিখ, ওভুলেশনের দিন আর জ্বরের তাপমাত্রা, প্রতিটির চিকিৎসা-সূত্রসহ।",
    },
    about:
      "These are estimates and screening numbers, not a diagnosis. Each page names its medical source (WHO, NHS, ACOG or the published formula), and the pregnancy and ovulation calculators keep no history on your device.",
    aboutBn:
      "এগুলো আনুমানিক হিসাব ও প্রাথমিক মাপ, রোগনির্ণয় নয়। প্রতিটি পাতায় তার চিকিৎসা-সূত্র (WHO, NHS, ACOG বা প্রকাশিত সূত্র) দেওয়া আছে, আর প্রেগন্যান্সি ও ওভুলেশন ক্যালকুলেটর আপনার ডিভাইসে কোনো হিসাব রাখে না।",
  },
  {
    id: "education",
    name: "Education",
    nameBn: "শিক্ষা",
    description: "SSC and HSC GPA with the 4th subject, university GPA and CGPA.",
    descriptionBn: "চতুর্থ বিষয়সহ এসএসসি-এইচএসসি জিপিএ, বিশ্ববিদ্যালয়ের জিপিএ ও সিজিপিএ।",
    seo: {
      title: "GPA & CGPA Calculators: SSC, HSC and University",
      description:
        "Free education calculators for Bangladesh: SSC and HSC GPA with the 4th subject on the 5.00 scale, and university GPA and CGPA on the UGC 4.00 scale.",
    },
    seoBn: {
      title: "জিপিএ ও সিজিপিএ ক্যালকুলেটর: এসএসসি, এইচএসসি, বিশ্ববিদ্যালয়",
      description:
        "ফ্রি শিক্ষা ক্যালকুলেটর: ৫.০০ স্কেলে চতুর্থ বিষয়সহ এসএসসি-এইচএসসি জিপিএ, আর ইউজিসি ৪.০০ স্কেলে বিশ্ববিদ্যালয়ের জিপিএ ও সিজিপিএ।",
    },
    about:
      "Board and university rules differ, so each calculator states its scale and rules, shows the working, and tells you when to check your board's result notice or your university's handbook.",
    aboutBn:
      "বোর্ড আর বিশ্ববিদ্যালয়ের নিয়ম আলাদা, তাই প্রতিটি ক্যালকুলেটর তার স্কেল ও নিয়ম জানায়, হিসাবটি দেখায়, আর কখন বোর্ডের ফলাফল বিজ্ঞপ্তি বা বিশ্ববিদ্যালয়ের হ্যান্ডবুক দেখতে হবে তা বলে দেয়।",
  },
  {
    id: "finance",
    name: "Finance",
    nameBn: "অর্থ",
    description: "Loans, savings, interest, VAT, zakat, discounts and mobile money charges in Taka.",
    descriptionBn: "টাকায় লোন, সঞ্চয়, মুনাফা, ভ্যাট, যাকাত, ডিসকাউন্ট আর মোবাইল ব্যাংকিংয়ের চার্জ।",
    seo: {
      title: "Finance Calculators Bangladesh: Loan, Savings, VAT",
      description:
        "Free money calculators in Taka: loan EMI, Sanchayapatra, FDR and DPS, interest, VAT, zakat, discount, profit and bKash charges, with dated sources.",
    },
    seoBn: {
      title: "অর্থের ক্যালকুলেটর: লোন, সঞ্চয়, ভ্যাট, যাকাত",
      description:
        "টাকায় ফ্রি হিসাব: লোনের ইএমআই, সঞ্চয়পত্র, এফডিআর-ডিপিএস, মুনাফা, ভ্যাট, যাকাত, ডিসকাউন্ট, লাভ-ক্ষতি আর বিকাশ চার্জ, তারিখসহ সূত্রে।",
    },
    about:
      "Rates and rules that change, such as savings certificate rates, source tax, VAT or mobile money charges, come from official sources with the date they were checked, and you can always type your own figure.",
    aboutBn:
      "যে হার ও নিয়ম বদলায়, যেমন সঞ্চয়পত্রের মুনাফা, উৎসে কর, ভ্যাট বা মোবাইল ব্যাংকিংয়ের চার্জ, সেগুলো যাচাইয়ের তারিখসহ অফিশিয়াল সূত্র থেকে নেওয়া, আর চাইলে নিজের সংখ্যাও লিখতে পারবেন।",
  },
  {
    id: "work",
    name: "Work & Wages",
    nameBn: "চাকরি ও মজুরি",
    description: "Salary, overtime, earned leave, job exit benefits and government job age limits.",
    descriptionBn: "বেতন, ওভারটাইম, অর্জিত ছুটি, চাকরি ছাড়লে পাওনা আর সরকারি চাকরির বয়সসীমা।",
    seo: {
      title: "Salary & Labour Act Calculators: Overtime, Leave, Gratuity",
      description:
        "Free work calculators for Bangladesh: take-home salary, overtime pay, earned leave and job exit benefits under the Labour Act 2006, and BCS age limits.",
    },
    seoBn: {
      title: "চাকরি ও মজুরির ক্যালকুলেটর: ওভারটাইম, ছুটি, গ্র্যাচুইটি",
      description:
        "চাকরির ফ্রি হিসাব: হাতে পাওয়া বেতন, ওভারটাইম, অর্জিত ছুটি আর চাকরি ছাড়লে শ্রম আইন অনুযায়ী পাওনা, সঙ্গে বিসিএস ও সরকারি চাকরির বয়সসীমা।",
    },
    about:
      "Labour Act figures are read from the official text on bdlaws, with the date checked and the 2026 amendment included. Where the law leaves something open, such as how a monthly wage becomes a daily or hourly rate, you enter it. Your appointment letter, service rules and the courts decide.",
    aboutBn:
      "শ্রম আইনের সংখ্যাগুলো bdlaws-এর অফিশিয়াল পাঠ থেকে, যাচাইয়ের তারিখ আর 2026 সালের সংশোধনীসহ নেওয়া। আইনে যা খোলা রাখা, যেমন মাসিক মজুরি থেকে দৈনিক বা ঘণ্টাপ্রতি হার কীভাবে হবে, তা আপনি নিজে লেখেন। আপনার নিয়োগপত্র, চাকরিবিধি আর আদালতই চূড়ান্ত।",
  },
  {
    id: "everyday",
    name: "Everyday",
    nameBn: "দৈনন্দিন",
    description: "Mess meals, expense splits, cash counting, land, weight and height units, bills and other daily sums.",
    descriptionBn: "মেসের মিল, খরচ ভাগাভাগি, টাকা গণনা, জমি, ওজন ও উচ্চতার একক, বিল আর দৈনন্দিন নানা হিসাব।",
    seo: {
      title: "Everyday Calculators: Mess Meal, Land, Weight, Bill Split",
      description:
        "Free everyday calculators for Bangladesh: mess meal rate, expense split, cash counter, land in katha and bigha, মণ to kg, height, electricity bill and more.",
    },
    seoBn: {
      title: "দৈনন্দিন ক্যালকুলেটর: মেসের মিল, জমি, ওজন, খরচ ভাগ",
      description:
        "দৈনন্দিন ফ্রি ক্যালকুলেটর: মেসের মিল রেট, খরচ ভাগাভাগি, টাকা গণনা, কাঠা-বিঘায় জমি, মণ থেকে কেজি, উচ্চতা, বিদ্যুৎ বিল আর আরও অনেক কিছু।",
    },
    about:
      "Built for the units people actually use in Bangladesh: Bangla digits and lakh-crore grouping work in every number box, and local units like katha, bigha, মণ and bhori are explained with worked examples.",
    aboutBn:
      "বাংলাদেশে মানুষ যে একক ব্যবহার করে, সেভাবেই তৈরি: প্রতিটি ঘরে বাংলা অঙ্ক ও লাখ-কোটির কমা চলে, আর কাঠা, বিঘা, মণ, ভরির মতো স্থানীয় একক উদাহরণসহ ব্যাখ্যা করা।",
  },
  {
    id: "date-time",
    name: "Date & Time",
    nameBn: "তারিখ ও সময়",
    description: "Exact age, days between dates and today's Bangla date.",
    descriptionBn: "সঠিক বয়স, দুই তারিখের ব্যবধান আর আজকের বাংলা তারিখ।",
    seo: {
      title: "Date Calculators: Age, Days Between Dates, Bangla Date",
      description:
        "Free date calculators for Bangladesh: exact age from date of birth, days between two dates with or without the end date, and today's Bangla date.",
    },
    seoBn: {
      title: "তারিখের ক্যালকুলেটর: বয়স, তারিখের ব্যবধান, বাংলা তারিখ",
      description:
        "ফ্রি তারিখের ক্যালকুলেটর: জন্ম তারিখ দিয়ে সঠিক বয়স, শেষ দিনসহ বা ছাড়া দুই তারিখের ব্যবধান, আর আজকের বাংলা তারিখ।",
    },
    about:
      "Dates are counted as calendar dates, never by dividing days by 365, so leap years and month lengths are always exact, and the result is the same on any phone in any time zone.",
    aboutBn:
      "তারিখ গোনা হয় ক্যালেন্ডার ধরে, দিনকে 365 দিয়ে ভাগ করে নয়, তাই অধিবর্ষ আর মাসের দৈর্ঘ্য সবসময় নির্ভুল, আর যেকোনো ফোনে যেকোনো টাইম জোনে ফল একই।",
  },
];

export function getCategory(id: CategoryId): Category {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}
