import type { CalculatorMeta } from "@/calculators/types";

export const cashCounter: CalculatorMeta = {
  slug: "cash-counter",
  name: "Cash Counter: Count Taka Notes and Coins",
  nameBn: "টাকা গণনা: নোট ও কয়েন হিসাব",
  category: "everyday",
  icon: "wallet",
  summary:
    "Type how many ৳1000, ৳500, ৳200, ৳100, ৳50, ৳20, ৳10, ৳5 and ৳2 notes and ৳5, ৳2 and ৳1 coins you have, and get the total and a table by denomination.",
  summaryBn:
    "1000, 500, 200, 100, 50, 20, 10, 5 ও 2 টাকার নোট আর 5, 2 ও 1 টাকার কয়েন কয়টি আছে লিখুন; মোট টাকা আর প্রতিটি মূল্যমানের হিসাবের টেবিল পেয়ে যাবেন।",
  keywords: [
    "cash counter",
    "money counter bangladesh",
    "taka counter",
    "note counter",
    "taka note counting",
    "cash count calculator",
    "denomination calculator taka",
    "টাকা গণনা ক্যালকুলেটর",
    "নোট গণনা",
    "টাকা গোনা",
    "ক্যাশ গণনা",
    "নোট ও কয়েন হিসাব",
  ],
  seo: {
    title: "Cash Counter: Count Taka Notes and Coins",
    description:
      "Count your cash: enter how many ৳1000, ৳500, ৳200, ৳100 notes and other notes and coins you have, and see the total and a table by denomination.",
  },
  seoBn: {
    title: "টাকা গণনা ক্যালকুলেটর: নোট ও কয়েন হিসাব",
    description:
      "1000, 500, 200, 100 টাকাসহ সব নোট আর কয়েন কয়টি আছে লিখুন; মোট টাকা, নোট ও কয়েনের সংখ্যা আর মূল্যমান অনুযায়ী টেবিল দেখুন।",
  },
  addedOn: "2026-11-02",
  related: ["amount-in-words", "expense-split-calculator", "discount-calculator", "profit-loss-calculator"],
  faqs: [
    {
      question: "How do I count cash with this calculator?",
      answer:
        "Type how many notes or coins you have of each value, leave the rest blank, and select Count cash. You get the total in ৳, a table of value × count = subtotal, and the number of notes and coins.",
    },
    {
      question: "Which notes and coins does it include?",
      answer:
        "Notes of ৳1000, ৳500, ৳200, ৳100, ৳50, ৳20, ৳10, ৳5 and ৳2, and coins of ৳5, ৳2 and ৳1. Old and new-design notes of the same value are counted together.",
    },
    {
      question: "How much is 3 × ৳1000 + 4 × ৳500 + 7 × ৳100 + 5 × ৳20?",
      answer: "৳3,000 + ৳2,000 + ৳700 + ৳100 = ৳5,800, made up of 19 notes.",
    },
    {
      question: "Can it tell me if a note is fake?",
      answer:
        "No. It only adds up the counts you type. It cannot check notes, so look at the security features of a note yourself or ask your bank if you are unsure.",
    },
    {
      question: "How do I enter whole bundles of notes?",
      answer:
        "Multiply the bundles by the notes in each. If your bundles hold 100 notes, 5 bundles of ৳500 notes are 500 notes: type 500 in the ৳500 notes field to get 500 × ৳500 = ৳2,50,000.",
    },
    {
      question: "How do I write the total in words?",
      answer:
        "Use the Amount in Words calculator on HisabBD. Copy the total from here, and it writes it in English and Bangla for cheques and receipts.",
    },
  ],
  faqsBn: [
    {
      question: "এই ক্যালকুলেটরে টাকা কীভাবে গুনব?",
      answer:
        "প্রতিটি মূল্যমানের নোট বা কয়েন কয়টি আছে লিখুন, বাকিগুলো ফাঁকা রাখুন, তারপর “টাকা গুনুন” চাপুন। মোট টাকা, মূল্যমান × সংখ্যা = উপমোট টেবিল এবং নোট ও কয়েনের সংখ্যা পাবেন।",
    },
    {
      question: "কোন কোন নোট ও কয়েন এতে আছে?",
      answer:
        "1000, 500, 200, 100, 50, 20, 10, 5 ও 2 টাকার নোট, আর 5, 2 ও 1 টাকার কয়েন। একই মূল্যমানের পুরোনো ও নতুন নকশার নোট একসঙ্গে গোনা হয়।",
    },
    {
      question: "3টি 1000 + 4টি 500 + 7টি 100 + 5টি 20 টাকার নোটে কত হয়?",
      answer: "৳3,000 + ৳2,000 + ৳700 + ৳100 = ৳5,800, মোট 19টি নোট।",
    },
    {
      question: "এটি দিয়ে কি জাল নোট চেনা যায়?",
      answer:
        "না। আপনি যা লিখবেন এটি শুধু তা যোগ করে। নোট যাচাই করতে পারে না, তাই সন্দেহ হলে নোটের নিরাপত্তা চিহ্ন নিজে দেখুন বা ব্যাংকে জিজ্ঞেস করুন।",
    },
    {
      question: "পুরো বান্ডিল কীভাবে লিখব?",
      answer:
        "বান্ডিলের সংখ্যাকে প্রতি বান্ডিলের নোট দিয়ে গুণ করুন। প্রতি বান্ডিলে 100টি নোট হলে 500 টাকার 5 বান্ডিল মানে 500টি নোট: 500 টাকার ঘরে 500 লিখুন, 500 × ৳500 = ৳2,50,000।",
    },
    {
      question: "মোট টাকা কথায় কীভাবে লিখব?",
      answer:
        "HisabBD-র “টাকা কথায়” ক্যালকুলেটর ব্যবহার করুন। এখানকার মোট টাকা সেখানে দিলে ইংরেজি ও বাংলায় কথায় লেখা পাবেন, চেক বা রসিদের জন্য কাজে লাগবে।",
    },
  ],
};
