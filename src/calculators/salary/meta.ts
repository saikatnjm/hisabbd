import type { CalculatorMeta } from "@/calculators/types";

export const salaryCalculator: CalculatorMeta = {
  slug: "salary-calculator",
  name: "Salary Calculator",
  nameBn: "বেতন ক্যালকুলেটর",
  category: "finance",
  icon: "wallet",
  summary: "Turn your gross salary and deductions into an estimated net, take-home salary.",
  summaryBn: "গ্রস বেতন ও কর্তন থেকে আনুমানিক নিট (হাতে পাওয়া) বেতন বের করুন।",
  keywords: [
    "salary",
    "take home",
    "take-home salary",
    "net salary",
    "gross salary",
    "gross to net",
    "payslip",
    "monthly salary",
    "yearly salary",
    "বেতন", "beton", "net pay", "in hand salary", "salary after deduction", "monthly to yearly"],
  seo: {
    title: "Salary Calculator BD: Gross to Net Take-Home Pay",
    description:
      "Estimate your net monthly and yearly take-home salary from your gross pay and the deductions you enter. Free, private and works on any phone.",
  },
  seoBn: {
    title: "বেতন ক্যালকুলেটর: গ্রস থেকে নিট হাতে পাওয়া বেতন",
    description:
      "গ্রস বেতন আর আপনার দেওয়া কর্তনগুলো থেকে মাসিক ও বাৎসরিক নিট বেতনের আনুমানিক হিসাব করুন। ফ্রি, প্রাইভেট, যেকোনো ফোনে চলে।",
  },
  addedOn: "2026-10-05",
  related: ["emi-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "What is the difference between gross and net salary?",
      answer:
        "Gross salary is the total before anything is taken off. Net salary, or take-home pay, is what you receive after deductions such as tax, provident fund or loan instalments are subtracted.",
    },
    {
      question: "Does this calculator work out my income tax?",
      answer:
        "No. It does not compute Bangladesh income tax or any other statutory deduction, because rules and rates change and depend on your situation. Enter the amounts from your payslip or employer as deductions.",
    },
    {
      question: "Where do I find my deduction amounts?",
      answer:
        "Your payslip or employer’s HR or accounts team lists them. Enter each one either as a percentage of gross salary or as a fixed Taka amount per month, whichever matches how it is applied.",
    },
    {
      question: "How is the yearly figure calculated?",
      answer:
        "Yearly figures are the monthly figures multiplied by 12, assuming 12 equal months. Festival bonuses, overtime, raises during the year and other irregular payments are not included.",
    },
    {
      question: "What if I know my yearly salary only?",
      answer:
        "Choose “per year” beside the gross salary. It is divided by 12 to get the monthly amount, and percentage deductions are applied to that monthly gross.",
    },
    {
      question: "Why do I get an error about total deductions?",
      answer:
        "Your deductions add up to more than your gross salary, which would make take-home pay negative. Check the percentages and amounts, or remove a row that does not apply.",
    },
  ],
  faqsBn: [
    {
      question: "গ্রস আর নিট বেতনের পার্থক্য কী?",
      answer:
        "গ্রস বেতন হলো কিছু কাটার আগের মোট বেতন। নিট বা হাতে পাওয়া বেতন হলো ট্যাক্স, প্রভিডেন্ট ফান্ড বা লোনের কিস্তির মতো কর্তন বাদ দেওয়ার পর আপনি যা পান।",
    },
    {
      question: "এই ক্যালকুলেটর কি আমার আয়কর হিসাব করে?",
      answer:
        "না। এটি বাংলাদেশের আয়কর বা অন্য কোনো বিধিবদ্ধ কর্তন হিসাব করে না, কারণ নিয়ম ও হার বদলায় আর আপনার পরিস্থিতির ওপর নির্ভর করে। পে-স্লিপ বা নিয়োগকর্তার কাছ থেকে পাওয়া অঙ্কগুলো কর্তন হিসেবে লিখুন।",
    },
    {
      question: "কর্তনের অঙ্কগুলো কোথায় পাব?",
      answer:
        "আপনার পে-স্লিপে বা অফিসের এইচআর/অ্যাকাউন্টস টিমের কাছে। প্রতিটি কর্তন যেভাবে ধরা হয় সেভাবে লিখুন — গ্রস বেতনের শতাংশ হিসেবে, বা মাসে নির্দিষ্ট টাকায়।",
    },
    {
      question: "বাৎসরিক অঙ্ক কীভাবে হিসাব হয়?",
      answer:
        "বাৎসরিক অঙ্ক = মাসিক অঙ্ক × 12, 12টি সমান মাস ধরে। উৎসব বোনাস, ওভারটাইম, বছরের মাঝের বেতন বৃদ্ধি বা অন্য অনিয়মিত আয় ধরা হয় না।",
    },
    {
      question: "আমি শুধু বাৎসরিক বেতন জানলে কী করব?",
      answer:
        "গ্রস বেতনের পাশে “বছরে” বেছে নিন। সেটিকে 12 দিয়ে ভাগ করে মাসিক অঙ্ক বের করা হয়, আর শতাংশের কর্তনগুলো সেই মাসিক গ্রসের ওপর ধরা হয়।",
    },
    {
      question: "মোট কর্তন নিয়ে এরর আসছে কেন?",
      answer:
        "আপনার কর্তনগুলোর যোগফল গ্রস বেতনের চেয়ে বেশি, যাতে হাতে পাওয়া বেতন ঋণাত্মক হয়ে যেত। শতাংশ ও অঙ্কগুলো মিলিয়ে দেখুন, বা যে সারি প্রযোজ্য নয় তা সরিয়ে দিন।",
    },
  ],
};
