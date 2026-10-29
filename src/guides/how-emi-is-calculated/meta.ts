import type { GuideMeta } from "@/guides/types";

export const howEmiIsCalculatedGuide: GuideMeta = {
  slug: "how-emi-is-calculated",
  title: "How EMI Is Calculated: Formula, Interest and Principal",
  titleBn: "ইএমআই কীভাবে হিসাব হয়: সূত্র ও উদাহরণ",
  summary:
    "The reducing-balance EMI formula step by step, how each instalment splits into interest and principal, and why a flat rate costs more, with a full worked example.",
  summaryBn:
    "রিডিউসিং-ব্যালান্স পদ্ধতিতে ইএমআইয়ের সূত্র ধাপে ধাপে, প্রতিটি কিস্তিতে সুদ ও আসলের ভাগ, আর একই হারে ফ্ল্যাট রেট কেন বেশি খরচের, একটি পুরো উদাহরণসহ।",
  answer:
    "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where r is the yearly rate ÷ 12 ÷ 100 and n the number of months. A ৳5,00,000 loan at 9% for 5 years costs ৳10,379 a month and ৳1,22,751 in interest; the same 9% as a flat rate costs ৳12,083 a month.",
  answerBn:
    "ইএমআই = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), যেখানে r = বার্ষিক সুদ ÷ 12 ÷ 100 আর n = মাসের সংখ্যা। ৳5,00,000 ঋণ 9% সুদে 5 বছরে মাসে ৳10,379, মোট সুদ ৳1,22,751; একই 9% ফ্ল্যাট রেটে হলে মাসে ৳12,083।",
  seo: {
    title: "How EMI Is Calculated: Formula and Worked Example",
    description:
      "How loan EMI is calculated: the reducing-balance formula, a ৳5,00,000 worked example, the interest and principal split, and flat vs reducing rates.",
  },
  seoBn: {
    title: "ইএমআই কীভাবে হিসাব হয়: সূত্র ও উদাহরণ",
    description:
      "লোনের ইএমআই কীভাবে হিসাব হয়: রিডিউসিং-ব্যালান্স সূত্র, ৳5,00,000 লোনের পুরো উদাহরণ, প্রতি কিস্তিতে সুদ ও আসলের ভাগ আর ফ্ল্যাট রেটের সঙ্গে পার্থক্য।",
  },
  calculator: "emi-calculator",
  publishedOn: "2026-10-28",
};
