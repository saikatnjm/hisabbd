import type { CalculatorMeta } from "@/calculators/types";

export const interestCalculator: CalculatorMeta = {
  slug: "interest-calculator",
  name: "Simple and Compound Interest Calculator",
  nameBn: "সরল ও চক্রবৃদ্ধি মুনাফা ক্যালকুলেটর",
  category: "finance",
  icon: "trending",
  summary:
    "Work out simple and compound interest (profit) on any amount in Taka: the interest, the amount, the difference between the two and a year-by-year table.",
  summaryBn:
    "আসল, মুনাফার হার আর সময় দিয়ে সরল ও চক্রবৃদ্ধি মুনাফা হিসাব করুন: মুনাফা, মুনাফা-আসল, দুইয়ের পার্থক্য আর বছরওয়ারি টেবিল।",
  keywords: [
    "simple interest calculator",
    "compound interest calculator",
    "compound interest formula",
    "simple interest formula",
    "simple vs compound interest",
    "compound interest bangladesh",
    "interest calculator bdt",
    "sorol sud",
    "chokrobriddhi munafa",
    "সরল সুদ",
    "চক্রবৃদ্ধি সুদ",
    "সরল মুনাফা",
    "চক্রবৃদ্ধি মুনাফা",
    "চক্রবৃদ্ধি মুনাফা নির্ণয়",
    "সরল মুনাফার সূত্র",
    "চক্রবৃদ্ধি মূলধন",
    "মুনাফা-আসল",
    "সুদ কষার নিয়ম",
    "মুনাফা",
  ],
  seo: {
    title: "Simple and Compound Interest Calculator (৳) with Formula",
    description:
      "Calculate simple and compound interest in Taka with the textbook formulas I = Pnr and C = P(1 + r)ⁿ. See the amount, the difference and a yearly table.",
  },
  seoBn: {
    title: "সরল ও চক্রবৃদ্ধি মুনাফা ক্যালকুলেটর: সূত্র ও উদাহরণসহ",
    description:
      "আসল, হার ও সময় দিয়ে সরল ও চক্রবৃদ্ধি মুনাফা (সুদ) হিসাব করুন। পাঠ্যবইয়ের সূত্র I = Pnr ও C = P(1 + r)ⁿ, মুনাফা-আসল, পার্থক্য আর বছরওয়ারি টেবিল।",
  },
  addedOn: "2026-11-01",
  related: ["fdr-calculator", "dps-calculator", "emi-calculator"],
  faqs: [
    {
      question: "What is the formula for simple interest?",
      answer:
        "Simple interest I = P × r × n, where P is the principal, r the yearly rate as a decimal and n the number of years. The amount is P + I. ৳200 at 10% for 3 years: 200 × 0.10 × 3 = ৳60, so the amount is ৳260.",
    },
    {
      question: "What is the formula for compound interest?",
      answer:
        "The compound amount C = P(1 + r)ⁿ, and the compound interest is C − P. ৳200 at 10% for 3 years: 200 × 1.1³ = ৳266.20, so the compound interest is ৳66.20, ৳6.20 more than simple interest.",
    },
    {
      question: "What is the difference between simple and compound interest?",
      answer:
        "Simple interest is earned only on the principal. Compound interest is also earned on the interest already added, so it grows faster. ৳1,00,000 at 9% for 5 years earns ৳45,000 simple interest but ৳53,862.40 compounded yearly.",
    },
    {
      question: "How much is compound interest on ৳1 lakh at 9% for 5 years?",
      answer:
        "Compounded yearly: 1,00,000 × 1.09⁵ = ৳1,53,862.40, so the interest is ৳53,862.40. Compounded half-yearly it is ৳55,296.94, quarterly ৳56,050.92 and monthly ৳56,568.10, before any tax.",
    },
    {
      question: "How do I work out half-yearly or monthly compounding?",
      answer:
        "Divide the yearly rate by the number of periods in a year and multiply the years by it: C = P(1 + r/m)^(m × n), with m = 2 for half-yearly, 4 for quarterly and 12 for monthly. Choose the option under “Compounding”.",
    },
    {
      question: "What is মুনাফা-আসল?",
      answer:
        "It is the amount: the principal plus the interest (মুনাফা) at the end of the time. Bangladeshi textbooks say মুনাফা for interest and আসল for principal; সুদ is the everyday word.",
    },
    {
      question: "Is a bank FDR or DPS simple or compound?",
      answer:
        "It depends on the bank and the scheme, and banks deduct source tax from the interest. For those, use the FDR or DPS calculator, which include the tax; this calculator shows interest before any tax.",
    },
  ],
  faqsBn: [
    {
      question: "সরল মুনাফার সূত্র কী?",
      answer:
        "সরল মুনাফা I = P × r × n, যেখানে P আসল, r বার্ষিক মুনাফার হার দশমিকে, আর n বছর। মুনাফা-আসল = P + I। ৳200-এর 10% হারে 3 বছরে মুনাফা: 200 × 0.10 × 3 = ৳60, মুনাফা-আসল ৳260।",
    },
    {
      question: "চক্রবৃদ্ধি মুনাফার সূত্র কী?",
      answer:
        "চক্রবৃদ্ধি মূলধন C = P(1 + r)ⁿ, আর চক্রবৃদ্ধি মুনাফা = C − P। ৳200-এর 10% হারে 3 বছরে: 200 × 1.1³ = ৳266.20, তাই চক্রবৃদ্ধি মুনাফা ৳66.20, সরল মুনাফার চেয়ে ৳6.20 বেশি।",
    },
    {
      question: "সরল ও চক্রবৃদ্ধি মুনাফার পার্থক্য কী?",
      answer:
        "সরল মুনাফা শুধু আসলের ওপর হয়। চক্রবৃদ্ধিতে আগে যোগ হওয়া মুনাফার ওপরও মুনাফা হয়, তাই তা দ্রুত বাড়ে। ৳1,00,000-এর 9% হারে 5 বছরে সরল মুনাফা ৳45,000, কিন্তু বার্ষিক চক্রবৃদ্ধিতে ৳53,862.40।",
    },
    {
      question: "১ লাখ টাকার ৯% হারে ৫ বছরের চক্রবৃদ্ধি মুনাফা কত?",
      answer:
        "বার্ষিক চক্রবৃদ্ধিতে 1,00,000 × 1.09⁵ = ৳1,53,862.40, তাই মুনাফা ৳53,862.40। ষাণ্মাসিকে ৳55,296.94, ত্রৈমাসিকে ৳56,050.92, মাসিকে ৳56,568.10, কর বাদের আগে।",
    },
    {
      question: "ষাণ্মাসিক বা মাসিক চক্রবৃদ্ধি কীভাবে হিসাব করব?",
      answer:
        "বার্ষিক হারকে বছরে যতবার চক্রবৃদ্ধি হয় তা দিয়ে ভাগ করুন, আর বছরকে তা দিয়ে গুণ করুন: C = P(1 + r/m)^(m × n); ষাণ্মাসিকে m = 2, ত্রৈমাসিকে 4, মাসিকে 12। “চক্রবৃদ্ধি” ঘর থেকে বেছে নিন।",
    },
    {
      question: "মুনাফা-আসল কী?",
      answer: "সময় শেষে আসল আর মুনাফা মিলিয়ে মোট টাকা। পাঠ্যবইয়ে সুদকে মুনাফা আর মূল টাকাকে আসল বলা হয়; সুদ হলো প্রচলিত শব্দ।",
    },
    {
      question: "ব্যাংকের এফডিআর বা ডিপিএস কি সরল না চক্রবৃদ্ধি?",
      answer:
        "ব্যাংক আর স্কিমভেদে আলাদা, আর ব্যাংক মুনাফা থেকে উৎসে কর কাটে। সেগুলোর জন্য করসহ হিসাব দেখায় এমন এফডিআর বা ডিপিএস ক্যালকুলেটর ব্যবহার করুন; এই ক্যালকুলেটর কর বাদের আগের মুনাফা দেখায়।",
    },
  ],
};
