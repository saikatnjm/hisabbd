import type { CalculatorMeta } from "@/calculators/types";

export const vatCalculator: CalculatorMeta = {
  slug: "vat-calculator",
  name: "VAT Calculator",
  nameBn: "ভ্যাট ক্যালকুলেটর",
  category: "finance",
  icon: "receipt",
  summary:
    "Add 15% VAT to a price or take the VAT out of a VAT-inclusive price, to the paisa, with the rate you choose.",
  summaryBn:
    "দামের ওপর 15% ভ্যাট যোগ করুন, অথবা ভ্যাটসহ দাম থেকে ভ্যাট আলাদা করুন — পয়সা পর্যন্ত নির্ভুল, যেকোনো হারে।",
  keywords: [
    "vat calculator bangladesh",
    "vat",
    "vat bd",
    "15% vat",
    "vat inclusive",
    "vat exclusive",
    "price including vat",
    "price excluding vat",
    "add vat",
    "remove vat",
    "reverse vat",
    "value added tax",
    "mushak",
    "ভ্যাট",
    "ভ্যাট হিসাব",
    "ভ্যাট ক্যালকুলেটর",
    "মূসক",
    "মূল্য সংযোজন কর",
    "ভ্যাটসহ দাম",
    "vat hisab",
  ],
  seo: {
    title: "VAT Calculator Bangladesh (15%): Add or Remove VAT",
    description:
      "Add 15% VAT to a price or find the VAT inside a VAT-inclusive price in Taka, to the paisa. Change the rate, see the formula, and check the NBR source.",
  },
  seoBn: {
    title: "ভ্যাট ক্যালকুলেটর: 15% ভ্যাট হিসাব (যোগ ও বাদ)",
    description:
      "দামের ওপর 15% ভ্যাট যোগ করুন বা ভ্যাটসহ দাম থেকে ভ্যাট ও আসল দাম বের করুন, টাকা-পয়সায়। হার বদলানো যায়, সূত্র ও NBR-এর সূত্রসহ।",
  },
  addedOn: "2026-10-28",
  updatedOn: "2026-10-28",
  related: ["discount-calculator", "profit-loss-calculator", "mfs-cash-out-charge-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "What is the VAT rate in Bangladesh?",
      answer:
        "The standard VAT rate is 15% under the Value Added Tax and Supplementary Duty Act, 2012 (checked on 28 October 2026 against the NBR VAT FAQ). Some goods and services have reduced rates such as 10%, 7.5% or 5%; check NBR for the rate that applies to a specific item.",
    },
    {
      question: "How do I add 15% VAT to a price?",
      answer:
        "Multiply the price by 15 ÷ 100 to get the VAT, then add it: on ৳1,000, the VAT is ৳150 and the price including VAT is ৳1,150. In one step, multiply by 1.15.",
    },
    {
      question: "How do I find the VAT inside a price that already includes VAT?",
      answer:
        "Use VAT = price including VAT × rate ÷ (100 + rate). For ৳1,150 at 15%: 1,150 × 15 ÷ 115 = ৳150, so the price before VAT is ৳1,000.",
    },
    {
      question: "Why is 15% of the VAT-inclusive price the wrong answer?",
      answer:
        "The 15% was charged on the price before VAT, not on the total. 15% of ৳1,150 is ৳172.50, which is more than the ৳150 of VAT actually inside it. Divide by 115 instead of 100.",
    },
    {
      question: "How do I get the price before VAT from a VAT-inclusive price?",
      answer:
        "Divide by (1 + rate ÷ 100). At 15%, divide by 1.15: ৳1,000 including VAT is ৳869.57 before VAT, with ৳130.43 of VAT.",
    },
    {
      question: "Can I use a rate other than 15%?",
      answer:
        "Yes. Choose a reduced rate (10%, 7.5% or 5%) or Custom and enter any rate from 0 to 100. Reduced rates apply only to some goods and services, so check NBR or your VAT challan.",
    },
    {
      question: "How are paisa rounded?",
      answer:
        "The amount you enter is rounded to the nearest paisa, then the VAT is rounded to the nearest paisa (half away from zero). The other figure is worked out from the rounded VAT, so net price + VAT always equals the price including VAT exactly.",
    },
    {
      question: "Does this include supplementary duty or advance tax?",
      answer:
        "No. It only adds or removes VAT at one rate. Some products also carry supplementary duty (SD), advance tax or VAT deducted at source, or use a fixed or tariff value instead of the price. Businesses should follow NBR rules and their accountant.",
    },
    {
      question: "Is a shop allowed to add VAT on top of the MRP?",
      answer:
        "This calculator does not decide that. Whether a printed price already includes VAT depends on the product and NBR rules. If a price already includes VAT, use Remove VAT to see how much of it is VAT.",
    },
    {
      question: "Is what I enter saved or sent anywhere?",
      answer:
        "No. The calculation runs in your browser. Your amounts and results are not stored or sent to any server.",
    },
  ],
  faqsBn: [
    {
      question: "বাংলাদেশে ভ্যাটের হার কত?",
      answer:
        "মূল্য সংযোজন কর ও সম্পূরক শুল্ক আইন, 2012 অনুযায়ী ভ্যাটের (মূসক) সাধারণ হার 15% (NBR-এর ভ্যাট FAQ দেখে 28 অক্টোবর 2026-এ যাচাই করা)। কিছু পণ্য ও সেবায় 10%, 7.5% বা 5%-এর মতো হ্রাসকৃত হার আছে; নির্দিষ্ট পণ্যের হার NBR থেকে মিলিয়ে নিন।",
    },
    {
      question: "দামের ওপর 15% ভ্যাট কীভাবে যোগ করব?",
      answer:
        "দামকে 15 ÷ 100 দিয়ে গুণ করলে ভ্যাট পাবেন, তারপর দামের সাথে যোগ করুন: ৳1,000-এ ভ্যাট ৳150, ভ্যাটসহ দাম ৳1,150। এক ধাপে করতে চাইলে 1.15 দিয়ে গুণ করুন।",
    },
    {
      question: "ভ্যাটসহ দামের ভেতরে কত ভ্যাট আছে কীভাবে বের করব?",
      answer:
        "সূত্র: ভ্যাট = ভ্যাটসহ দাম × হার ÷ (100 + হার)। 15% হারে ৳1,150-এ: 1,150 × 15 ÷ 115 = ৳150, তাই ভ্যাট ছাড়া দাম ৳1,000।",
    },
    {
      question: "ভ্যাটসহ দামের 15% নিলে ভুল হয় কেন?",
      answer:
        "15% ধরা হয়েছিল ভ্যাট ছাড়া দামের ওপর, মোট দামের ওপর নয়। ৳1,150-এর 15% হলো ৳172.50, যা ভেতরের আসল ভ্যাট ৳150-এর চেয়ে বেশি। তাই 100 নয়, 115 দিয়ে ভাগ করতে হয়।",
    },
    {
      question: "ভ্যাটসহ দাম থেকে ভ্যাট ছাড়া দাম কীভাবে পাব?",
      answer:
        "(1 + হার ÷ 100) দিয়ে ভাগ করুন। 15% হলে 1.15 দিয়ে ভাগ: ভ্যাটসহ ৳1,000 মানে ভ্যাট ছাড়া দাম ৳869.57, আর ভ্যাট ৳130.43।",
    },
    {
      question: "15% ছাড়া অন্য হার ব্যবহার করা যাবে?",
      answer:
        "হ্যাঁ। হ্রাসকৃত হার (10%, 7.5% বা 5%) বেছে নিন, অথবা “নিজের হার” বেছে 0 থেকে 100-এর মধ্যে যেকোনো হার লিখুন। হ্রাসকৃত হার শুধু কিছু পণ্য ও সেবায় প্রযোজ্য, তাই NBR বা ভ্যাট চালান দেখে নিন।",
    },
    {
      question: "পয়সা কীভাবে রাউন্ড করা হয়?",
      answer:
        "যে অঙ্ক লেখেন তা প্রথমে নিকটতম পয়সায় রাউন্ড হয়, তারপর ভ্যাটও নিকটতম পয়সায় (অর্ধেক হলে শূন্য থেকে দূরে) রাউন্ড হয়। অন্য অঙ্কটি রাউন্ড করা ভ্যাট থেকে বের করা হয়, তাই ভ্যাট ছাড়া দাম + ভ্যাট সবসময় ঠিক ভ্যাটসহ দামের সমান।",
    },
    {
      question: "এতে কি সম্পূরক শুল্ক বা অগ্রিম কর ধরা আছে?",
      answer:
        "না। এটি শুধু একটি হারে ভ্যাট যোগ বা বাদ করে। কিছু পণ্যে সম্পূরক শুল্ক (SD), অগ্রিম কর বা উৎসে ভ্যাট কর্তন থাকে, কিংবা দামের বদলে নির্দিষ্ট বা ট্যারিফ মূল্যের ওপর ভ্যাট ধরা হয়। ব্যবসার ক্ষেত্রে NBR-এর নিয়ম ও নিজের হিসাবরক্ষকের পরামর্শ মানুন।",
    },
    {
      question: "দোকান কি MRP-র ওপর আলাদা ভ্যাট নিতে পারে?",
      answer:
        "এই ক্যালকুলেটর তা ঠিক করে না। ছাপা দামে ভ্যাট ধরা আছে কি না তা পণ্য ও NBR-এর নিয়মের ওপর নির্ভর করে। দামে ভ্যাট আগেই ধরা থাকলে “ভ্যাট বাদ দিন” বেছে দেখুন তার মধ্যে কত ভ্যাট।",
    },
    {
      question: "আমি যা লিখি তা কি কোথাও সেভ বা পাঠানো হয়?",
      answer: "না। হিসাব আপনার ব্রাউজারেই হয়। আপনার অঙ্ক বা ফলাফল কোথাও সংরক্ষণ করা হয় না, কোনো সার্ভারেও পাঠানো হয় না।",
    },
  ],
};
