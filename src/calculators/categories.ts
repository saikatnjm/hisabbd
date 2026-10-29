import type { Category, CategoryId } from "./types";

export const categories: readonly Category[] = [
  {
    id: "health",
    name: "Health",
    nameBn: "স্বাস্থ্য",
    description: "Check your BMI and the healthy weight range for your height.",
    descriptionBn: "আপনার বিএমআই আর উচ্চতা অনুযায়ী স্বাস্থ্যকর ওজনের সীমা দেখে নিন।",
    seo: {
      title: "Health Calculators: BMI and Healthy Weight",
      description:
        "Free health calculators for Bangladesh: work out your BMI in cm or feet and inches, kg or lb, and see the healthy weight range for your height.",
    },
    seoBn: {
      title: "স্বাস্থ্য ক্যালকুলেটর: বিএমআই ও সঠিক ওজন",
      description:
        "ফ্রি স্বাস্থ্য ক্যালকুলেটর: সেমি বা ফুট-ইঞ্চি, কেজি বা পাউন্ডে বিএমআই বের করুন, আর আপনার উচ্চতায় স্বাস্থ্যকর ওজনের সীমা দেখুন।",
    },
    about:
      "These are screening numbers for adults, not a diagnosis. Each page explains the formula, the WHO categories and what the number can and can't tell you.",
    aboutBn:
      "এগুলো প্রাপ্তবয়স্কদের জন্য প্রাথমিক মাপ, রোগনির্ণয় নয়। প্রতিটি পাতায় সূত্র, WHO-র শ্রেণি আর সংখ্যাটি কী বলে ও কী বলে না, তা ব্যাখ্যা করা আছে।",
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
    description: "Loans, savings, salary, VAT, zakat, discounts and mobile money charges in Taka.",
    descriptionBn: "টাকায় লোন, সঞ্চয়, বেতন, ভ্যাট, যাকাত, ডিসকাউন্ট আর মোবাইল ব্যাংকিংয়ের চার্জ।",
    seo: {
      title: "Finance Calculators Bangladesh: Loan, Savings, VAT",
      description:
        "Free money calculators in Taka: loan EMI, Sanchayapatra, FDR and DPS, salary, VAT, zakat, discount, profit and bKash charges, with dated sources.",
    },
    seoBn: {
      title: "অর্থের ক্যালকুলেটর: লোন, সঞ্চয়, ভ্যাট, যাকাত",
      description:
        "টাকায় ফ্রি হিসাব: লোনের ইএমআই, সঞ্চয়পত্র, এফডিআর-ডিপিএস, বেতন, ভ্যাট, যাকাত, ডিসকাউন্ট, লাভ-ক্ষতি আর বিকাশ চার্জ, তারিখসহ সূত্রে।",
    },
    about:
      "Rates and rules that change, such as savings certificate rates, source tax, VAT or mobile money charges, come from official sources with the date they were checked, and you can always type your own figure.",
    aboutBn:
      "যে হার ও নিয়ম বদলায়, যেমন সঞ্চয়পত্রের মুনাফা, উৎসে কর, ভ্যাট বা মোবাইল ব্যাংকিংয়ের চার্জ, সেগুলো যাচাইয়ের তারিখসহ অফিশিয়াল সূত্র থেকে নেওয়া, আর চাইলে নিজের সংখ্যাও লিখতে পারবেন।",
  },
  {
    id: "everyday",
    name: "Everyday",
    nameBn: "দৈনন্দিন",
    description: "Percentages, land measurement, gold by the bhori and other daily sums.",
    descriptionBn: "শতকরা, জমির মাপ, ভরিতে সোনার হিসাবসহ দৈনন্দিন নানা হিসাব।",
    seo: {
      title: "Everyday Calculators: Percent, Land, Gold Bhori",
      description:
        "Free everyday calculators for Bangladesh: percentages, land in decimal, katha and bigha, gold by bhori, ana and roti, and more, in English and Bangla.",
    },
    seoBn: {
      title: "দৈনন্দিন ক্যালকুলেটর: শতকরা, জমির মাপ, সোনার ভরি",
      description:
        "দৈনন্দিন ফ্রি ক্যালকুলেটর: শতকরা হিসাব, শতাংশ-কাঠা-বিঘায় জমির মাপ, ভরি-আনা-রতিতে সোনার হিসাব আর আরও অনেক কিছু, বাংলা ও ইংরেজিতে।",
    },
    about:
      "Built for the units people actually use in Bangladesh: Bangla digits and lakh-crore grouping work in every number box, and local units like katha, bigha and bhori are explained with worked examples.",
    aboutBn:
      "বাংলাদেশে মানুষ যে একক ব্যবহার করে, সেভাবেই তৈরি: প্রতিটি ঘরে বাংলা অঙ্ক ও লাখ-কোটির কমা চলে, আর কাঠা, বিঘা, ভরির মতো স্থানীয় একক উদাহরণসহ ব্যাখ্যা করা।",
  },
  {
    id: "date-time",
    name: "Date & Time",
    nameBn: "তারিখ ও সময়",
    description: "Exact age, government job age limits, days between dates and today's Bangla date.",
    descriptionBn: "সঠিক বয়স, সরকারি চাকরির বয়সসীমা, দুই তারিখের ব্যবধান আর আজকের বাংলা তারিখ।",
    seo: {
      title: "Date Calculators: Age, Job Age Limit, Bangla Date",
      description:
        "Free date calculators for Bangladesh: exact age from date of birth, BCS and government job age limits, days between dates, and today's Bangla date.",
    },
    seoBn: {
      title: "তারিখের ক্যালকুলেটর: বয়স, চাকরির বয়স, বাংলা তারিখ",
      description:
        "ফ্রি তারিখের ক্যালকুলেটর: জন্ম তারিখ দিয়ে সঠিক বয়স, বিসিএস ও সরকারি চাকরির বয়সসীমা, দুই তারিখের ব্যবধান আর আজকের বাংলা তারিখ।",
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
