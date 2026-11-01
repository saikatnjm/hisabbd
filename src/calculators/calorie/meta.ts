import type { CalculatorMeta } from "@/calculators/types";

export const calorieCalculator: CalculatorMeta = {
  slug: "calorie-calculator",
  name: "Calorie Calculator: BMR and Daily Calories",
  nameBn: "ক্যালরি ক্যালকুলেটর: দৈনিক কত ক্যালরি দরকার",
  category: "health",
  icon: "flame",
  summary:
    "Estimate your resting energy (BMR) with the Mifflin–St Jeor equation and the calories a day that keep your weight steady at your activity level.",
  summaryBn:
    "মিফলিন–সেন্ট জিওর সূত্রে বিশ্রামে শরীরের শক্তি (বিএমআর), আর আপনার কাজকর্মের মাত্রায় ওজন ঠিক রাখতে দিনে কত ক্যালরি লাগে, তার আনুমানিক হিসাব।",
  keywords: [
    "calorie calculator",
    "bmr calculator",
    "tdee calculator",
    "daily calorie needs",
    "maintenance calories",
    "mifflin st jeor",
    "calorie calculator bangla",
    "koto calorie dorkar",
    "ক্যালরি ক্যালকুলেটর",
    "দৈনিক কত ক্যালরি দরকার",
    "বিএমআর ক্যালকুলেটর",
    "ক্যালরি হিসাব",
    "শরীরের ক্যালরি চাহিদা",
    "ওজন ঠিক রাখতে কত ক্যালরি",
  ],
  seo: {
    title: "Calorie Calculator: BMR and Daily Calories (TDEE)",
    description:
      "Estimate your BMR with the Mifflin–St Jeor equation and the calories a day that keep your weight steady at your activity level. Free, private, in Bangla.",
  },
  seoBn: {
    title: "ক্যালরি ক্যালকুলেটর: দৈনিক কত ক্যালরি দরকার (বিএমআর)",
    description:
      "মিফলিন–সেন্ট জিওর সূত্রে বিএমআর আর আপনার কাজকর্মের মাত্রায় ওজন ঠিক রাখতে দিনে কত ক্যালরি লাগে, তার হিসাব। ফ্রি, আর তথ্য আপনার ফোনেই থাকে।",
  },
  addedOn: "2026-11-01",
  related: ["bmi-calculator", "height-converter", "weight-converter"],
  faqs: [
    {
      question: "How many calories do I need a day?",
      answer:
        "It depends on your body and how active you are. A 30-year-old man, 170 cm and 70 kg, has a BMR of about 1,618 kcal; with moderate activity he needs about 2,507 kcal a day to keep his weight steady. Enter your own details for your estimate.",
    },
    {
      question: "What is BMR?",
      answer:
        "Basal metabolic rate: the energy your body uses at rest in a day, for breathing, circulation and keeping warm. This calculator estimates it with the Mifflin–St Jeor equation (1990).",
    },
    {
      question: "What is the Mifflin–St Jeor formula?",
      answer:
        "BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years), plus 5 for men or minus 161 for women. It was worked out from 498 healthy adults aged 19 to 78.",
    },
    {
      question: "Where do the activity levels come from?",
      answer:
        "Daily calories are BMR × an activity factor: 1.2 (sedentary), 1.375 (light), 1.55 (moderate), 1.725 (very active) and 1.9 (extra active). These factors are a widely used convention, not part of the 1990 study, so treat the result as an estimate.",
    },
    {
      question: "Can I use it for children or during pregnancy?",
      answer:
        "No. The equation is for adults, and energy needs in childhood, pregnancy and breastfeeding are different. Ask a doctor or nutritionist.",
    },
    {
      question: "Does it tell me how much to eat to lose weight?",
      answer:
        "No. It shows the calories that keep your weight about the same. For a weight-loss or weight-gain plan, especially with a health condition, talk to a doctor or nutritionist.",
    },
  ],
  faqsBn: [
    {
      question: "দিনে কত ক্যালরি দরকার?",
      answer:
        "শরীর আর কাজকর্মের মাত্রার ওপর নির্ভর করে। 30 বছরের একজন পুরুষ, 170 সেমি আর 70 কেজি হলে বিএমআর প্রায় 1,618 কিলোক্যালরি; মাঝারি কাজকর্মে ওজন ঠিক রাখতে দিনে প্রায় 2,507 কিলোক্যালরি লাগে। নিজের তথ্য দিয়ে নিজের হিসাব দেখুন।",
    },
    {
      question: "বিএমআর কী?",
      answer:
        "বেসাল মেটাবলিক রেট: বিশ্রামে থাকলেও শ্বাস নেওয়া, রক্ত চলাচল আর শরীর গরম রাখতে দিনে যে শক্তি লাগে। এই ক্যালকুলেটর তা মিফলিন–সেন্ট জিওর সূত্রে (1990) হিসাব করে।",
    },
    {
      question: "মিফলিন–সেন্ট জিওর সূত্র কী?",
      answer:
        "বিএমআর = 10 × ওজন (কেজি) + 6.25 × উচ্চতা (সেমি) − 5 × বয়স (বছর), পুরুষের জন্য তার সঙ্গে 5 যোগ, নারীর জন্য 161 বিয়োগ। 19 থেকে 78 বছর বয়সী 498 জন সুস্থ প্রাপ্তবয়স্কের তথ্য থেকে এটি তৈরি।",
    },
    {
      question: "কাজকর্মের মাত্রাগুলো কোথা থেকে এসেছে?",
      answer:
        "দৈনিক ক্যালরি = বিএমআর × কাজকর্মের গুণক: 1.2 (প্রায় বসে থাকা), 1.375 (হালকা), 1.55 (মাঝারি), 1.725 (বেশি সক্রিয়) আর 1.9 (খুব বেশি সক্রিয়)। এই গুণকগুলো বহুল প্রচলিত রীতি, 1990 সালের গবেষণার অংশ নয়, তাই ফলটিকে আনুমানিক ধরুন।",
    },
    {
      question: "শিশু বা গর্ভাবস্থায় কি এটা ব্যবহার করা যায়?",
      answer: "না। সূত্রটি প্রাপ্তবয়স্কদের জন্য; শৈশব, গর্ভাবস্থা আর বুকের দুধ খাওয়ানোর সময় শক্তির চাহিদা আলাদা। ডাক্তার বা পুষ্টিবিদের পরামর্শ নিন।",
    },
    {
      question: "ওজন কমাতে কত খেতে হবে, এটা কি বলে দেয়?",
      answer:
        "না। এটি শুধু ওজন মোটামুটি একই রাখার ক্যালরি দেখায়। ওজন কমানো বা বাড়ানোর পরিকল্পনার জন্য, বিশেষ করে কোনো রোগ থাকলে, ডাক্তার বা পুষ্টিবিদের সঙ্গে কথা বলুন।",
    },
  ],
};
