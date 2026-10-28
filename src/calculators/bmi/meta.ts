import type { CalculatorMeta } from "@/calculators/types";

export const bmiCalculator: CalculatorMeta = {
  slug: "bmi-calculator",
  name: "BMI Calculator",
  nameBn: "বিএমআই ক্যালকুলেটর",
  category: "health",
  icon: "scale",
  summary: "Find your body mass index from your height and weight, and the healthy weight range for your height.",
  summaryBn: "উচ্চতা ও ওজন থেকে আপনার বিএমআই আর উচ্চতা অনুযায়ী স্বাস্থ্যকর ওজনের সীমা জানুন।",
  keywords: ["bmi", "body mass index", "weight", "height", "obesity", "overweight", "healthy weight", "ওজন", "উচ্চতা", "body weight", "weight for height", "ideal weight", "ojon", "bmi calculator bd"],
  seo: {
    title: "BMI Calculator: Body Mass Index for Adults",
    description:
      "Calculate your BMI from height (cm or feet and inches) and weight (kg or lb). See your WHO adult category and the healthy weight range for your height.",
  },
  seoBn: {
    title: "বিএমআই ক্যালকুলেটর: প্রাপ্তবয়স্কদের বডি মাস ইনডেক্স",
    description:
      "উচ্চতা (সেমি বা ফুট-ইঞ্চি) ও ওজন (কেজি বা পাউন্ড) থেকে বিএমআই বের করুন। WHO-র প্রাপ্তবয়স্ক ক্যাটাগরি আর আপনার উচ্চতার স্বাস্থ্যকর ওজনের সীমা দেখুন।",
  },
  addedOn: "2026-10-05",
  related: ["age-calculator"],
  faqs: [
    {
      question: "How is BMI calculated?",
      answer:
        "BMI is your weight in kilograms divided by your height in metres squared. For example, 70 kg at 1.70 m gives 70 ÷ (1.70 × 1.70) = 24.2. If you enter pounds, feet or inches, they are first converted exactly (1 lb = 0.45359237 kg, 1 in = 2.54 cm).",
    },
    {
      question: "What are the BMI categories for adults?",
      answer:
        "The World Health Organization’s adult categories are: below 18.5 underweight, 18.5 to 24.9 healthy weight, 25 to 29.9 overweight, and 30 or more obesity. Obesity is further split into class I (30 to 34.9), class II (35 to 39.9) and class III (40 or more).",
    },
    {
      question: "Is BMI accurate?",
      answer:
        "BMI is a quick screening measure, not a diagnosis. It doesn’t measure body fat or where fat is carried, so it can be misleading for very muscular people, older adults and others. A doctor looks at more than BMI to judge health.",
    },
    {
      question: "Can I use this BMI calculator for children or teenagers?",
      answer:
        "No. These categories are for adults aged 18 and over. For children and teenagers, BMI is compared with growth charts for their age and sex, which this calculator doesn’t do. Ask a doctor or health worker instead.",
    },
    {
      question: "Are the BMI cut-offs different for South Asians?",
      answer:
        "A WHO expert consultation in 2004 noted that many Asian populations have a higher risk of health problems at a lower BMI than the standard cut-offs suggest, and proposed additional public-health cut-off points of 23 and 27.5. This calculator uses the standard WHO categories, so treat that as background and ask a doctor what it means for you.",
    },
    {
      question: "Why does the calculator reject some heights and weights?",
      answer:
        "To catch typing mistakes, it accepts heights from 50 to 272 cm and weights from 2 to 650 kg. These are limits for checking input, not medical limits. If you enter feet and inches, inches must be below 12.",
    },
  ],
  faqsBn: [
    {
      question: "বিএমআই কীভাবে হিসাব করা হয়?",
      answer:
        "কেজিতে ওজনকে মিটারে উচ্চতার বর্গ দিয়ে ভাগ করা হয়। যেমন, 1.70 মিটারে 70 কেজি হলে 70 ÷ (1.70 × 1.70) = 24.2। পাউন্ড, ফুট বা ইঞ্চিতে লিখলে আগে নির্ভুলভাবে রূপান্তর করা হয় (1 পাউন্ড = 0.45359237 কেজি, 1 ইঞ্চি = 2.54 সেমি)।",
    },
    {
      question: "প্রাপ্তবয়স্কদের বিএমআই ক্যাটাগরিগুলো কী?",
      answer:
        "বিশ্ব স্বাস্থ্য সংস্থার প্রাপ্তবয়স্ক ক্যাটাগরি: 18.5-এর নিচে কম ওজন, 18.5 থেকে 24.9 স্বাস্থ্যকর ওজন, 25 থেকে 29.9 বাড়তি ওজন, আর 30 বা বেশি স্থূলতা। স্থূলতা আবার ক্লাস I (30–34.9), ক্লাস II (35–39.9) ও ক্লাস III (40 বা বেশি)-তে ভাগ করা হয়।",
    },
    {
      question: "বিএমআই কি নির্ভুল?",
      answer:
        "বিএমআই দ্রুত যাচাইয়ের একটি মাপ, রোগনির্ণয় নয়। এটি শরীরের চর্বি বা চর্বি কোথায় জমেছে তা মাপে না, তাই খুব পেশিবহুল মানুষ, বয়স্কসহ অনেকের ক্ষেত্রে বিভ্রান্তিকর হতে পারে। স্বাস্থ্য বিচারে ডাক্তার বিএমআই-এর চেয়ে অনেক বেশি কিছু দেখেন।",
    },
    {
      question: "শিশু বা কিশোরদের জন্য কি এই বিএমআই ক্যালকুলেটর ব্যবহার করা যাবে?",
      answer:
        "না। এই ক্যাটাগরিগুলো ১৮ বছর বা তার বেশি বয়সীদের জন্য। শিশু-কিশোরদের বিএমআই তাদের বয়স ও লিঙ্গের গ্রোথ চার্টের সাথে মিলিয়ে দেখা হয়, যা এই ক্যালকুলেটর করে না। সেক্ষেত্রে ডাক্তার বা স্বাস্থ্যকর্মীর পরামর্শ নিন।",
    },
    {
      question: "দক্ষিণ এশীয়দের জন্য বিএমআই-এর সীমারেখা কি আলাদা?",
      answer:
        "২০০৪ সালের এক WHO বিশেষজ্ঞ পরামর্শসভায় বলা হয়, অনেক এশীয় জনগোষ্ঠীতে প্রচলিত সীমার চেয়ে কম বিএমআইতেই স্বাস্থ্য-ঝুঁকি বেশি থাকে, আর জনস্বাস্থ্যের জন্য 23 ও 27.5 — এই বাড়তি সীমারেখা প্রস্তাব করা হয়। এই ক্যালকুলেটর প্রচলিত WHO ক্যাটাগরিই ব্যবহার করে; এটি পটভূমি হিসেবে জেনে আপনার ক্ষেত্রে কী প্রযোজ্য, তা ডাক্তারকে জিজ্ঞেস করুন।",
    },
    {
      question: "কিছু উচ্চতা বা ওজন ক্যালকুলেটর নেয় না কেন?",
      answer:
        "লেখার ভুল ধরতে এটি 50 থেকে 272 সেমি উচ্চতা আর 2 থেকে 650 কেজি ওজন নেয়। এগুলো ইনপুট যাচাইয়ের সীমা, কোনো চিকিৎসাগত সীমা নয়। ফুট-ইঞ্চিতে লিখলে ইঞ্চি 12-র কম হতে হবে।",
    },
  ],
};
