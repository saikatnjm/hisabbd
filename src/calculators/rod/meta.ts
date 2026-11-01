import type { CalculatorMeta } from "@/calculators/types";

export const rodWeightCalculator: CalculatorMeta = {
  slug: "rod-weight-calculator",
  name: "Rod Weight Calculator: Rebar kg per Metre",
  nameBn: "রডের ওজন ক্যালকুলেটর",
  category: "everyday",
  icon: "ruler",
  summary:
    "Work out the weight of steel rods (rebar) from their diameter, length and number, in kg and tonnes, and the cost at your dealer’s price per tonne.",
  summaryBn:
    "রডের ব্যাস, দৈর্ঘ্য আর সংখ্যা দিয়ে মোট ওজন কেজি ও টনে বের করুন, আর আপনার ডিলারের টনপ্রতি দাম দিলে মোট খরচও।",
  keywords: [
    "rod weight calculator",
    "rebar weight calculator",
    "steel bar weight",
    "d2/162",
    "12mm rod weight per foot",
    "10mm rod weight per meter",
    "rod weight formula",
    "rod calculator bangladesh",
    "roder ojon",
    "রডের ওজন",
    "রডের ওজন হিসাব",
    "রডের ওজন বের করার সূত্র",
    "১২ মিমি রডের ওজন",
    "প্রতি ফুট রডের ওজন",
    "রড কত টন লাগবে",
    "রডের দাম হিসাব",
  ],
  seo: {
    title: "Rod Weight Calculator: Rebar kg per Metre and Foot",
    description:
      "Find the weight of steel rods from diameter, length and number with d²/162: kg per metre and foot, total kg and tonnes, and cost at your price per tonne.",
  },
  seoBn: {
    title: "রডের ওজন হিসাব: প্রতি ফুট ও মিটারে কত কেজি",
    description:
      "রডের ব্যাস, দৈর্ঘ্য আর সংখ্যা দিন: d²/162 সূত্রে প্রতি মিটার ও ফুটে ওজন, মোট কেজি ও টন, আর টনপ্রতি দাম দিলে মোট খরচ। ফ্রি ও দ্রুত।",
  },
  addedOn: "2026-11-01",
  related: ["weight-converter", "land-calculator", "amount-in-words"],
  faqs: [
    {
      question: "What is the formula for rod weight?",
      answer:
        "Weight in kg per metre = d² ÷ 162, where d is the diameter in mm (more exactly d² ÷ 162.2, from the density of steel, 7,850 kg/m³). Per foot it is d² ÷ 532.",
    },
    {
      question: "How much does a 12 mm rod weigh per foot?",
      answer: "About 0.271 kg per foot (0.888 kg per metre). A 40 ft bar of 12 mm weighs about 10.8 kg.",
    },
    {
      question: "What does a 10 mm rod weigh per metre?",
      answer:
        "About 0.617 kg. Other common sizes: 8 mm 0.395, 16 mm 1.578, 20 mm 2.466 and 25 mm 3.853 kg per metre.",
    },
    {
      question: "How many tonnes are 40 bars of 12 mm, 40 ft long?",
      answer:
        "The total length is 40 × 40 = 1,600 ft (487.68 m), so the weight is about 432.97 kg, or 0.433 tonne. At ৳1,00,000 a tonne (an example price) that is about ৳43,297.",
    },
    {
      question: "Why does the weighed rod differ from the calculator?",
      answer:
        "The formula gives the theoretical weight. Real bars can be slightly heavier or lighter within the maker’s rolling tolerance, so for buying and billing, go by the weighed or certified weight.",
    },
    {
      question: "Does the calculator know today’s rod price?",
      answer:
        "No. Prices change and differ between dealers and brands, so enter the price per tonne you were quoted. Leave it blank to see the weight only.",
    },
  ],
  faqsBn: [
    {
      question: "রডের ওজন বের করার সূত্র কী?",
      answer:
        "প্রতি মিটারে কেজি = d² ÷ 162, যেখানে d হলো মিলিমিটারে ব্যাস (আরও ঠিকভাবে d² ÷ 162.2, ইস্পাতের ঘনত্ব 7,850 কেজি/ঘনমিটার থেকে)। প্রতি ফুটে d² ÷ 532।",
    },
    {
      question: "12 মিমি রডের প্রতি ফুটে ওজন কত?",
      answer: "প্রায় 0.271 কেজি (প্রতি মিটারে 0.888 কেজি)। 40 ফুটের একটি 12 মিমি রডের ওজন প্রায় 10.8 কেজি।",
    },
    {
      question: "10 মিমি রডের প্রতি মিটারে ওজন কত?",
      answer: "প্রায় 0.617 কেজি। অন্য সাধারণ মাপ: 8 মিমি 0.395, 16 মিমি 1.578, 20 মিমি 2.466 আর 25 মিমি 3.853 কেজি প্রতি মিটারে।",
    },
    {
      question: "40 ফুটের 40টি 12 মিমি রড কত টন?",
      answer:
        "মোট দৈর্ঘ্য 40 × 40 = 1,600 ফুট (487.68 মিটার), তাই ওজন প্রায় 432.97 কেজি, অর্থাৎ 0.433 টন। টনপ্রতি ৳1,00,000 ধরলে (উদাহরণের দাম) খরচ প্রায় ৳43,297।",
    },
    {
      question: "মেপে পাওয়া ওজন ক্যালকুলেটরের সঙ্গে মেলে না কেন?",
      answer:
        "সূত্রটি তাত্ত্বিক ওজন দেয়। উৎপাদনের সহনশীলতার কারণে আসল রড সামান্য ভারী বা হালকা হতে পারে, তাই কেনা আর বিলের জন্য মেপে পাওয়া বা প্রত্যয়িত ওজনই ধরুন।",
    },
    {
      question: "ক্যালকুলেটর কি আজকের রডের দাম জানে?",
      answer: "না। দাম বদলায় আর ডিলার ও ব্র্যান্ডভেদে আলাদা, তাই যে টনপ্রতি দাম জেনেছেন সেটি লিখুন। শুধু ওজন দেখতে দামের ঘর ফাঁকা রাখুন।",
    },
  ],
};
