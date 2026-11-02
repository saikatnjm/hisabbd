import type { CalculatorMeta } from "@/calculators/types";

export const expenseSplitCalculator: CalculatorMeta = {
  slug: "expense-split-calculator",
  name: "Expense Split Calculator: Who Owes Whom",
  nameBn: "খরচ ভাগাভাগি: কে কাকে কত দেবে",
  category: "everyday",
  icon: "wallet",
  summary:
    "Split a trip, picnic or shared shopping equally: enter what each person paid and see everyone’s share and exactly who should pay whom to settle up.",
  summaryBn:
    "ট্যুর, পিকনিক বা একসঙ্গে কেনাকাটার খরচ সমান ভাগ করুন: কে কত দিয়েছেন লিখুন, দেখুন প্রত্যেকের ভাগ আর হিসাব মেটাতে কে কাকে কত দেবেন।",
  keywords: [
    "expense split calculator",
    "split bill calculator",
    "trip expense calculator",
    "who owes whom",
    "group expense",
    "picnic cost split",
    "khoroch vag",
    "খরচ ভাগাভাগি",
    "ট্যুরের খরচ হিসাব",
    "পিকনিকের খরচ ভাগ",
    "বিল ভাগ করা",
    "কে কত টাকা দেবে",
    "চাঁদার হিসাব",
  ],
  seo: {
    title: "Expense Split Calculator: Trip and Picnic Costs, Who Owes",
    description:
      "Enter what each person paid for a trip, picnic or shared shopping and get everyone’s equal share and a short list of payments that settles everyone up.",
  },
  seoBn: {
    title: "খরচ ভাগাভাগি ক্যালকুলেটর: ট্যুর, পিকনিকের হিসাব",
    description:
      "ট্যুর, পিকনিক বা একসঙ্গে কেনাকাটায় কে কত দিয়েছেন লিখুন: প্রত্যেকের সমান ভাগ আর হিসাব মেটাতে কে কাকে কত দেবেন, এক নজরে। ফ্রি।",
  },
  addedOn: "2026-11-02",
  related: ["mess-meal-calculator", "cash-counter", "percentage-calculator"],
  faqs: [
    {
      question: "How do I split a trip’s cost equally?",
      answer:
        "Add up what everyone paid and divide by the number of people. A ৳12,000 trip for 4 is ৳3,000 each. Anyone who paid more than ৳3,000 gets money back; anyone who paid less pays the difference.",
    },
    {
      question: "How does the calculator decide who pays whom?",
      answer:
        "The person who owes the most pays the person owed the most, and so on until everyone is even. In the example, Salam pays Rahim ৳3,000 and Jamal pays Karim ৳1,000: two payments instead of everyone paying everyone.",
    },
    {
      question: "What if the total doesn’t divide evenly?",
      answer:
        "The calculator works in paisa. ৳100 among 3 people is ৳33.34 for the first person and ৳33.33 for the others, so the payments add up exactly.",
    },
    {
      question: "Someone didn’t pay anything. Do they still share the cost?",
      answer: "Yes. Enter their name and leave the amount blank or 0: they share the cost equally and owe their full share.",
    },
    {
      question: "Can I split unequally, for example by days?",
      answer:
        "This calculator splits equally. For a mess where people eat different numbers of meals, use the Mess Meal Calculator, which charges by meals.",
    },
    {
      question: "Is my list saved?",
      answer:
        "Only on your device, in “Your recent calculations”, which you can clear or turn off. Names and amounts are never sent anywhere.",
    },
  ],
  faqsBn: [
    {
      question: "ট্যুরের খরচ সমান ভাগ কীভাবে করব?",
      answer:
        "সবাই যা দিয়েছেন যোগ করে মানুষের সংখ্যা দিয়ে ভাগ করুন। 4 জনের ৳12,000-এর ট্যুরে জনপ্রতি ৳3,000। কেউ ৳3,000-এর বেশি দিলে ফেরত পাবেন, কম দিলে বাকিটা দেবেন।",
    },
    {
      question: "কে কাকে কত দেবে, ক্যালকুলেটর কীভাবে ঠিক করে?",
      answer:
        "যিনি সবচেয়ে বেশি দেবেন তিনি সবচেয়ে বেশি পাওনাদারকে দেন, এভাবে সবার হিসাব মেটা পর্যন্ত। উদাহরণে সালাম রহিমকে ৳3,000 আর জামাল করিমকে ৳1,000 দেবেন: সবাই সবাইকে না দিয়ে মাত্র দুটি লেনদেন।",
    },
    {
      question: "মোট টাকা সমান ভাগে না মিললে?",
      answer: "ক্যালকুলেটর পয়সায় হিসাব করে। ৳100 তিনজনে ভাগ হলে প্রথমজনের ৳33.34, বাকিদের ৳33.33, তাই লেনদেন একদম মিলে যায়।",
    },
    {
      question: "কেউ কিছুই দেননি। তিনি কি খরচের ভাগ পাবেন?",
      answer: "হ্যাঁ। তাঁর নাম লিখে টাকার ঘর ফাঁকা বা 0 রাখুন: তিনিও সমান ভাগে খরচ বহন করবেন, পুরো ভাগটা দেবেন।",
    },
    {
      question: "দিন অনুযায়ী বা অসমান ভাগ করা যায়?",
      answer: "এই ক্যালকুলেটর সমান ভাগ করে। মেসে যাঁরা আলাদা সংখ্যক মিল খান, তাঁদের জন্য মিল অনুযায়ী হিসাব করে মেসের মিল ক্যালকুলেটর।",
    },
    {
      question: "আমার তালিকা কি জমা থাকে?",
      answer: "শুধু আপনার ডিভাইসে, “আপনার সাম্প্রতিক হিসাব”-এ, যা মুছে ফেলা বা বন্ধ করা যায়। নাম বা টাকার অঙ্ক কোথাও পাঠানো হয় না।",
    },
  ],
};
