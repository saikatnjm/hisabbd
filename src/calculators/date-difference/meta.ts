import type { CalculatorMeta } from "@/calculators/types";

export const dateDifferenceCalculator: CalculatorMeta = {
  slug: "date-difference-calculator",
  name: "Date Difference Calculator",
  nameBn: "তারিখের পার্থক্য ক্যালকুলেটর",
  category: "date-time",
  icon: "calendar-range",
  summary: "Find the time between two dates in years, months, weeks and days.",
  summaryBn: "দুটি তারিখের মধ্যে বছর, মাস, সপ্তাহ ও দিনের ব্যবধান বের করুন।",
  keywords: [
    "days between dates",
    "how many days",
    "date duration",
    "days until",
    "days since",
    "count days",
    "working days",
    "তারিখ",
    "দিন গণনা", "day counter", "date calculator", "duration", "days left", "koto din", "days between"],
  seo: {
    title: "Date Difference Calculator: Days Between Two Dates",
    description:
      "Count the days, weeks, months and years between two dates. Include or exclude the end date and see days excluding Fridays and Saturdays.",
  },
  seoBn: {
    title: "তারিখের ব্যবধান ক্যালকুলেটর: দুই তারিখের মাঝে কত দিন",
    description:
      "দুটি তারিখের মধ্যে দিন, সপ্তাহ, মাস ও বছর গণনা করুন। শেষ দিন ধরে বা বাদ দিয়ে, আর শুক্র-শনিবার বাদে দিনের হিসাবও দেখুন।",
  },
  addedOn: "2026-10-05",
  related: ["age-calculator"],
  faqs: [
    {
      question: "Is the end date counted?",
      answer:
        "Not by default: from 1 January to 2 January is 1 day. Turn on “Include the end date” to count both the first and last day, so the same dates give 2 days. That’s useful for leave, events or rental periods.",
    },
    {
      question: "How are months counted when they have different lengths?",
      answer:
        "Months are counted on the calendar, not as 30 days. From 15 March to 15 April is 1 month. If the start day doesn’t exist in a later month (for example the 31st), that month’s last day is used.",
    },
    {
      question: "What if I enter the dates in the wrong order?",
      answer:
        "The calculator swaps them and tells you, so you always get the positive time between the two dates.",
    },
    {
      question: "What does “excluding Fridays and Saturdays” mean?",
      answer:
        "It counts only the days from Sunday to Thursday, the usual working week in Bangladesh. Public holidays and other days off aren’t known to the calculator, so subtract them yourself if you need exact working days.",
    },
    {
      question: "Are leap years included?",
      answer:
        "Yes. The calculator uses the real calendar, so 29 February is counted whenever it falls between your dates.",
    },
  ],
  faqsBn: [
    {
      question: "শেষ তারিখ কি গোনা হয়?",
      answer:
        "সাধারণত না: ১ জানুয়ারি থেকে ২ জানুয়ারি মানে 1 দিন। “শেষ তারিখও ধরুন” চালু করলে প্রথম ও শেষ — দুই দিনই গোনা হয়, তখন একই তারিখে হয় 2 দিন। ছুটি, অনুষ্ঠান বা ভাড়ার মেয়াদের জন্য এটি কাজে লাগে।",
    },
    {
      question: "মাসগুলোর দৈর্ঘ্য আলাদা — তাহলে মাস কীভাবে গোনা হয়?",
      answer:
        "মাস গোনা হয় ক্যালেন্ডার ধরে, 30 দিন ধরে নয়। ১৫ মার্চ থেকে ১৫ এপ্রিল মানে 1 মাস। শুরুর দিনটি পরের কোনো মাসে না থাকলে (যেমন ৩১ তারিখ) সেই মাসের শেষ দিন ধরা হয়।",
    },
    {
      question: "তারিখ দুটি উল্টো ক্রমে দিলে কী হবে?",
      answer:
        "ক্যালকুলেটর সেগুলো অদল-বদল করে নেয় আর আপনাকে জানায়, তাই সবসময় দুই তারিখের মধ্যকার ধনাত্মক সময়টাই পাবেন।",
    },
    {
      question: "“শুক্র ও শনিবার বাদে” মানে কী?",
      answer:
        "শুধু রবি থেকে বৃহস্পতিবারের দিনগুলো গোনা হয় — বাংলাদেশের প্রচলিত কর্মসপ্তাহ। সরকারি ছুটি বা অন্য বন্ধের দিন ক্যালকুলেটরের জানা নেই, তাই সঠিক কর্মদিবস দরকার হলে সেগুলো নিজে বাদ দিন।",
    },
    {
      question: "অধিবর্ষ (লিপ ইয়ার) কি ধরা হয়?",
      answer:
        "হ্যাঁ। ক্যালকুলেটর বাস্তব ক্যালেন্ডার ব্যবহার করে, তাই আপনার দুই তারিখের মধ্যে ২৯ ফেব্রুয়ারি পড়লেই তা গোনা হয়।",
    },
  ],
};
