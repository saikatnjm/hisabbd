import type { CalculatorMeta } from "@/calculators/types";

export const ageCalculator: CalculatorMeta = {
  slug: "age-calculator",
  name: "Age Calculator",
  nameBn: "বয়স ক্যালকুলেটর",
  category: "date-time",
  icon: "calendar",
  summary: "Calculate your exact age in years, months and days.",
  summaryBn: "বছর, মাস ও দিনে আপনার সঠিক বয়স বের করুন।",
  keywords: ["age", "date of birth", "birthday", "how old", "dob", "বয়স", "জন্ম তারিখ", "age calculator bd", "boyos", "boyosh", "jonmo tarikh", "birth date", "exact age"],
  seo: {
    title: "Age Calculator: Exact Age in Years, Months and Days",
    description:
      "Find your exact age in years, months and days on any date. See total days and weeks lived and your next birthday. Free and works on any phone.",
  },
  seoBn: {
    title: "বয়স ক্যালকুলেটর: জন্ম তারিখ দিয়ে সঠিক বয়স বের করুন",
    description:
      "জন্ম তারিখ দিয়ে যেকোনো দিনে আপনার সঠিক বয়স বের করুন বছর, মাস ও দিনে। মোট দিন, সপ্তাহ আর পরের জন্মদিনও দেখুন। ফ্রি, যেকোনো ফোনে চলে।",
  },
  addedOn: "2026-10-05",
  related: ["government-job-age-calculator", "date-difference-calculator", "bmi-calculator", "bangla-date-converter"],
  faqs: [
    {
      question: "How is age calculated?",
      answer:
        "By counting complete years, then complete months, then the remaining days on the calendar, from the date of birth to the “as of” date. If a month is too short for the birth day (for example the 31st), that month’s last day is used.",
    },
    {
      question: "Can I calculate my age on a past or future date?",
      answer:
        "Yes. Change “Calculate age as of” to any date on or after the date of birth. Only the date of birth can’t be later than today.",
    },
    {
      question: "How are leap years handled?",
      answer:
        "Exactly. 29 February is counted in every leap year, so each year is 365 or 366 days long, just like the real calendar, and the totals always match it.",
    },
    {
      question: "What happens if I was born on 29 February?",
      answer:
        "In years without a 29 February, your birthday is taken as 28 February, so your age goes up on that day. Some organisations may count it differently; if the exact date matters for something official, check their rules.",
    },
    {
      question: "Can I calculate someone else's age?",
      answer:
        "Yes. Enter their date of birth. Nothing you enter is saved or sent anywhere: the calculation runs in your browser.",
    },
    {
      question: "Why is my age different from dividing days by 365?",
      answer:
        "Because leap days add up: roughly one every four years. Dividing total days by 365 ignores them, so it can show you a year older a few days before your actual birthday.",
    },
  ],
  faqsBn: [
    {
      question: "বয়স কীভাবে হিসাব করা হয়?",
      answer:
        "জন্ম তারিখ থেকে নির্ধারিত তারিখ পর্যন্ত ক্যালেন্ডার ধরে প্রথমে পূর্ণ বছর, তারপর পূর্ণ মাস, তারপর বাকি দিন গোনা হয়। কোনো মাসে জন্মের দিনটি না থাকলে (যেমন 31 তারিখ) সেই মাসের শেষ দিন ধরা হয়।",
    },
    {
      question: "অতীত বা ভবিষ্যতের কোনো তারিখে বয়স বের করা যাবে?",
      answer:
        "যাবে। “যে তারিখে বয়স হিসাব হবে” ঘরে জন্ম তারিখ বা তার পরের যেকোনো তারিখ দিন। শুধু জন্ম তারিখটাই আজকের পরে হতে পারবে না।",
    },
    {
      question: "অধিবর্ষ (লিপ ইয়ার) কীভাবে ধরা হয়?",
      answer:
        "নির্ভুলভাবে। প্রতিটি অধিবর্ষে 29 ফেব্রুয়ারি গোনা হয়, তাই প্রতিটি বছর বাস্তব ক্যালেন্ডারের মতোই 365 বা 366 দিনের, আর মোট হিসাব সবসময় মিলে যায়।",
    },
    {
      question: "জন্ম 29 ফেব্রুয়ারিতে হলে কী হবে?",
      answer:
        "যে বছর 29 ফেব্রুয়ারি নেই, সে বছর 28 ফেব্রুয়ারিকে জন্মদিন ধরা হয়, তাই সেদিনই বয়স বাড়ে। কোনো কোনো প্রতিষ্ঠান অন্যভাবে গুনতে পারে; সরকারি কোনো কাজে সঠিক তারিখটি গুরুত্বপূর্ণ হলে তাদের নিয়ম দেখে নিন।",
    },
    {
      question: "অন্য কারও বয়স কি বের করা যাবে?",
      answer:
        "যাবে। তাঁর জন্ম তারিখ লিখুন। আপনি যা লেখেন তার কিছুই সেভ হয় না বা কোথাও পাঠানো হয় না: হিসাবটা আপনার ব্রাউজারেই হয়।",
    },
    {
      question: "মোট দিনকে 365 দিয়ে ভাগ করলে বয়স আলাদা আসে কেন?",
      answer:
        "কারণ লিপ-দিনগুলো জমে: মোটামুটি প্রতি চার বছরে একটা। মোট দিনকে 365 দিয়ে ভাগ করলে সেগুলো বাদ পড়ে, তাই আসল জন্মদিনের কয়েক দিন আগেই এক বছর বেশি দেখাতে পারে।",
    },
  ],
};
