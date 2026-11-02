import type { CalculatorMeta } from "@/calculators/types";

export const timeAddCalculator: CalculatorMeta = {
  slug: "time-calculator",
  name: "Hours and Minutes Calculator (Add and Subtract Time)",
  nameBn: "ঘণ্টা-মিনিট যোগ-বিয়োগ ক্যালকুলেটর",
  category: "date-time",
  icon: "clock",
  summary:
    "Add or subtract hours and minutes, such as 2 h 45 min + 3 h 30 min, and see the total in hours and minutes, decimal hours and minutes.",
  summaryBn:
    "ঘণ্টা ও মিনিট যোগ বা বিয়োগ করুন, যেমন 2 ঘণ্টা 45 মিনিট + 3 ঘণ্টা 30 মিনিট। মোট সময় দেখুন ঘণ্টা-মিনিটে, দশমিক ঘণ্টায় আর মিনিটে।",
  keywords: [
    "time calculator",
    "hours and minutes calculator",
    "add hours and minutes",
    "time duration calculator",
    "minutes to decimal hours",
    "ghonta minute jog",
    "ঘণ্টা মিনিট যোগ",
    "সময় যোগ বিয়োগ",
    "ঘণ্টা মিনিট হিসাব",
    "মিনিটকে ঘণ্টায় রূপান্তর",
    "সময়ের হিসাব",
  ],
  seo: {
    title: "Time Calculator: Add and Subtract Hours and Minutes",
    description:
      "Add or subtract hours and minutes and get the total as hours and minutes, decimal hours and minutes. Free, fast on any phone, and nothing you type is sent anywhere.",
  },
  seoBn: {
    title: "সময় যোগ-বিয়োগ: ঘণ্টা ও মিনিটের হিসাব",
    description:
      "ঘণ্টা ও মিনিট যোগ বা বিয়োগ করে মোট সময় দেখুন ঘণ্টা-মিনিটে, দশমিক ঘণ্টায় ও মিনিটে। ফ্রি, যেকোনো ফোনে চলে, আপনার তথ্য কোথাও পাঠানো হয় না।",
  },
  addedOn: "2026-11-02",
  related: ["work-hours-calculator", "date-difference-calculator", "overtime-calculator", "age-calculator"],
  faqs: [
    {
      question: "How do I add hours and minutes?",
      answer:
        "Add the hours and the minutes separately, then turn every 60 minutes into 1 hour. Example: 2 h 45 min + 3 h 30 min + 1 h 50 min = 6 h 125 min = 8 h 5 min.",
    },
    {
      question: "How do I convert minutes to decimal hours?",
      answer:
        "Divide the minutes by 60. 30 minutes = 0.5 hours, 15 minutes = 0.25, 45 minutes = 0.75, and 5 minutes ≈ 0.08. So 8 h 5 min is about 8.08 hours. Payslips and overtime sheets often use decimal hours.",
    },
    {
      question: "How do I subtract time?",
      answer:
        "Choose − for the row to take away. If the minutes are not enough, borrow 1 hour as 60 minutes: 8 h 0 min − 1 h 15 min = 7 h 60 min − 1 h 15 min = 6 h 45 min.",
    },
    {
      question: "Can I enter more than 59 minutes?",
      answer:
        "Yes. 90 minutes is read as 1 hour 30 minutes, so you can add up times written only in minutes, such as call or class durations.",
    },
    {
      question: "How do I work out hours between a start and finish time?",
      answer:
        "Use the work hours calculator: it takes clock times such as 08:00 and 19:00, handles shifts past midnight and breaks, and shows overtime beyond 8 hours a day. This page adds durations, not clock times.",
    },
    {
      question: "Is anything I enter saved or sent?",
      answer:
        "Nothing is sent. The sum runs in your browser, and recent calculations are kept only on this device if you leave that on.",
    },
  ],
  faqsBn: [
    {
      question: "ঘণ্টা ও মিনিট কীভাবে যোগ করব?",
      answer:
        "ঘণ্টা আর মিনিট আলাদা করে যোগ করুন, তারপর প্রতি 60 মিনিটকে 1 ঘণ্টা বানান। উদাহরণ: 2 ঘণ্টা 45 মিনিট + 3 ঘণ্টা 30 মিনিট + 1 ঘণ্টা 50 মিনিট = 6 ঘণ্টা 125 মিনিট = 8 ঘণ্টা 5 মিনিট।",
    },
    {
      question: "মিনিটকে দশমিক ঘণ্টায় কীভাবে বদলাব?",
      answer:
        "মিনিটকে 60 দিয়ে ভাগ করুন। 30 মিনিট = 0.5 ঘণ্টা, 15 মিনিট = 0.25, 45 মিনিট = 0.75, আর 5 মিনিট ≈ 0.08। তাই 8 ঘণ্টা 5 মিনিট প্রায় 8.08 ঘণ্টা। পে-স্লিপ ও ওভারটাইম শিটে প্রায়ই দশমিক ঘণ্টা লেখা হয়।",
    },
    {
      question: "সময় বিয়োগ কীভাবে করব?",
      answer:
        "যে সারি বাদ দেবেন সেখানে − বেছে নিন। মিনিটে না কুলালে 1 ঘণ্টাকে 60 মিনিট ধার নিন: 8 ঘণ্টা 0 মিনিট − 1 ঘণ্টা 15 মিনিট = 7 ঘণ্টা 60 মিনিট − 1 ঘণ্টা 15 মিনিট = 6 ঘণ্টা 45 মিনিট।",
    },
    {
      question: "59-এর বেশি মিনিট লেখা যাবে?",
      answer:
        "হ্যাঁ। 90 মিনিটকে 1 ঘণ্টা 30 মিনিট ধরা হয়, তাই শুধু মিনিটে লেখা সময়ও (যেমন কল বা ক্লাসের সময়) যোগ করতে পারবেন।",
    },
    {
      question: "শুরু আর শেষের সময়ের মাঝে কত ঘণ্টা, কীভাবে বের করব?",
      answer:
        "কর্মঘণ্টা ক্যালকুলেটর ব্যবহার করুন: সেখানে 08:00 ও 19:00-এর মতো ঘড়ির সময় দেওয়া যায়, মাঝরাত পার হওয়া শিফট ও বিরতি ধরা হয়, আর দিনে 8 ঘণ্টার বেশি ওভারটাইম দেখায়। এই পাতা সময়ের পরিমাণ যোগ করে, ঘড়ির সময় নয়।",
    },
    {
      question: "যা লিখি তা কি সংরক্ষিত বা পাঠানো হয়?",
      answer:
        "কিছুই পাঠানো হয় না। হিসাব আপনার ব্রাউজারেই হয়, আর সাম্প্রতিক হিসাব চালু রাখলে শুধু এই ডিভাইসে থাকে।",
    },
  ],
};
