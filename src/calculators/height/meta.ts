import type { CalculatorMeta } from "@/calculators/types";

export const heightConverter: CalculatorMeta = {
  slug: "height-converter",
  name: "Height Converter: Feet and Inches to cm",
  nameBn: "উচ্চতা রূপান্তর: ফুট-ইঞ্চি থেকে সেমি",
  category: "everyday",
  icon: "ruler",
  summary:
    "Convert a height in feet and inches to centimetres and metres, or centimetres back to feet and inches, with হাত and গজ too.",
  summaryBn:
    "ফুট-ইঞ্চিতে উচ্চতা সেন্টিমিটার ও মিটারে, অথবা সেন্টিমিটার থেকে ফুট-ইঞ্চিতে রূপান্তর করুন; সঙ্গে হাত আর গজও।",
  keywords: [
    "feet to cm",
    "height converter",
    "feet and inches to cm",
    "cm to feet",
    "5 feet 4 inches in cm",
    "5 feet 6 inch in cm",
    "height in cm",
    "5 feet koto cm",
    "ফুট থেকে সেমি",
    "ফুট ইঞ্চি থেকে সেন্টিমিটার",
    "5 ফুট 4 ইঞ্চি কত সেমি",
    "উচ্চতা কত সেমি",
    "সেন্টিমিটার থেকে ফুট",
    "এক হাত কত ইঞ্চি",
    "এক গজ কত ফুট",
    "উচ্চতা রূপান্তর",
  ],
  seo: {
    title: "Feet and Inches to cm: Height Converter (5 ft 4 in)",
    description:
      "Convert height in feet and inches to cm and metres, or cm to feet and inches. 5 ft 4 in = 162.56 cm. With হাত and গজ, free and in Bangla too.",
  },
  seoBn: {
    title: "ফুট-ইঞ্চি থেকে সেমি: উচ্চতা কত সেন্টিমিটার",
    description:
      "ফুট-ইঞ্চিতে উচ্চতা সেন্টিমিটার ও মিটারে, বা সেমি থেকে ফুট-ইঞ্চিতে বদলান। 5 ফুট 4 ইঞ্চি = 162.56 সেমি। হাত ও গজসহ, ফ্রি।",
  },
  addedOn: "2026-11-01",
  related: ["bmi-calculator", "calorie-calculator", "weight-converter", "government-job-age-calculator"],
  faqs: [
    {
      question: "How many cm is 5 feet 4 inches?",
      answer: "162.56 cm. 5 ft 4 in is 5 × 12 + 4 = 64 inches, and 64 × 2.54 = 162.56 cm, or 1.6256 m.",
    },
    {
      question: "How do I convert feet and inches to cm?",
      answer:
        "Turn the height into inches (feet × 12 + inches), then multiply by 2.54. 5 ft 6 in = 66 in = 167.64 cm; 5 ft 2 in = 62 in = 157.48 cm.",
    },
    {
      question: "How do I convert cm to feet and inches?",
      answer:
        "Divide by 2.54 to get inches, then divide by 12: the whole number is the feet and the rest is inches. 165 cm = 64.96 in, which is about 5 ft 5 in.",
    },
    {
      question: "How many inches is 1 হাত (haat)?",
      answer:
        "18 inches (1.5 ft, 45.72 cm), the same value our land calculator uses. 2 হাত make 1 গজ. Local usage can vary, so for anything official use feet or metres.",
    },
    {
      question: "How many feet is 1 গজ (goj)?",
      answer: "3 feet, which is 36 inches or 91.44 cm. A গজ is the same as an English yard.",
    },
    {
      question: "Do job circulars give height in feet or cm?",
      answer:
        "Bangladeshi circulars for jobs such as the police and BGB usually state height in feet and inches. Read the exact figure in the circular you are applying for; this converter helps if a medical report gives it in cm.",
    },
  ],
  faqsBn: [
    {
      question: "5 ফুট 4 ইঞ্চি কত সেমি?",
      answer: "162.56 সেমি। 5 ফুট 4 ইঞ্চি = 5 × 12 + 4 = 64 ইঞ্চি, আর 64 × 2.54 = 162.56 সেমি, অর্থাৎ 1.6256 মিটার।",
    },
    {
      question: "ফুট-ইঞ্চি থেকে সেমি কীভাবে বের করব?",
      answer:
        "উচ্চতাকে ইঞ্চিতে নিন (ফুট × 12 + ইঞ্চি), তারপর 2.54 দিয়ে গুণ করুন। 5 ফুট 6 ইঞ্চি = 66 ইঞ্চি = 167.64 সেমি; 5 ফুট 2 ইঞ্চি = 62 ইঞ্চি = 157.48 সেমি।",
    },
    {
      question: "সেমি থেকে ফুট-ইঞ্চি কীভাবে বের করব?",
      answer:
        "2.54 দিয়ে ভাগ করে ইঞ্চি নিন, তারপর 12 দিয়ে ভাগ করুন: পূর্ণ সংখ্যাটি ফুট, বাকিটা ইঞ্চি। 165 সেমি = 64.96 ইঞ্চি, প্রায় 5 ফুট 5 ইঞ্চি।",
    },
    {
      question: "1 হাত কত ইঞ্চি?",
      answer:
        "18 ইঞ্চি (1.5 ফুট, 45.72 সেমি); আমাদের জমির ক্যালকুলেটরও এই মান ধরে। 2 হাতে 1 গজ। এলাকাভেদে ব্যবহার আলাদা হতে পারে, তাই দাপ্তরিক কাজে ফুট বা মিটার ব্যবহার করুন।",
    },
    {
      question: "1 গজ কত ফুট?",
      answer: "3 ফুট, অর্থাৎ 36 ইঞ্চি বা 91.44 সেমি। গজ আর ইংরেজি ইয়ার্ড একই।",
    },
    {
      question: "চাকরির সার্কুলারে উচ্চতা ফুটে না সেমিতে থাকে?",
      answer:
        "পুলিশ, বিজিবির মতো চাকরির সার্কুলারে সাধারণত ফুট-ইঞ্চিতে উচ্চতা লেখা থাকে। যে সার্কুলারে আবেদন করছেন তার ঠিক সংখ্যাটি দেখুন; মেডিকেল রিপোর্টে সেমিতে লেখা থাকলে এই রূপান্তর কাজে লাগবে।",
    },
  ],
};
