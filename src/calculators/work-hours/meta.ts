import type { CalculatorMeta } from "@/calculators/types";

export const workHoursCalculator: CalculatorMeta = {
  slug: "work-hours-calculator",
  name: "Work Hours and Overtime Hours Calculator",
  nameBn: "কর্মঘণ্টা ও ওভারটাইম ঘণ্টা হিসাব",
  category: "work",
  icon: "briefcase",
  summary:
    "Enter when you start and finish each day, minus breaks, and see the hours you worked and the overtime hours beyond 8 a day under the Bangladesh Labour Act.",
  summaryBn:
    "প্রতিদিন কখন ঢুকলেন আর কখন বের হলেন, বিরতি বাদে, লিখুন। দেখুন কত ঘণ্টা কাজ করলেন আর শ্রম আইন অনুযায়ী দিনে 8 ঘণ্টার বেশি কত ঘণ্টা ওভারটাইম হলো।",
  keywords: [
    "work hours calculator",
    "overtime hours calculator",
    "duty hours calculator",
    "time card calculator",
    "garments working hours",
    "working hours bangladesh labour law",
    "kaj er ghonta hisab",
    "কর্মঘণ্টা হিসাব",
    "ডিউটির ঘণ্টা হিসাব",
    "ওভারটাইম ঘণ্টা হিসাব",
    "দৈনিক কর্মঘণ্টা",
    "শ্রম আইনে কর্মঘণ্টা",
    "গার্মেন্টস ডিউটি টাইম",
  ],
  seo: {
    title: "Work Hours Calculator: Duty Time and Overtime Hours",
    description:
      "Turn your start and finish times into hours worked and overtime beyond 8 hours a day (Labour Act s.100). Night shifts and breaks handled. Free and private.",
  },
  seoBn: {
    title: "কর্মঘণ্টা হিসাব: ডিউটি টাইম ও ওভারটাইম ঘণ্টা",
    description:
      "ঢোকা ও বের হওয়ার সময় থেকে মোট কর্মঘণ্টা আর দিনে 8 ঘণ্টার বেশি ওভারটাইম ঘণ্টা বের করুন (শ্রম আইন, ধারা 100)। রাতের শিফট ও বিরতিসহ, ফ্রি, তথ্য ডিভাইসেই থাকে।",
  },
  addedOn: "2026-11-02",
  updatedOn: "2026-11-02",
  related: ["overtime-calculator", "time-calculator", "earned-leave-calculator", "salary-calculator", "date-difference-calculator"],
  faqs: [
    {
      question: "How do I calculate my working hours for a day?",
      answer:
        "Hours worked = finish time − start time − break. Example: 8:00 to 19:00 is 11 hours; take off a 1-hour lunch break and you worked 10 hours. Anything over 8 hours that day is overtime: 2 hours.",
    },
    {
      question: "How many hours a day can a worker work in Bangladesh?",
      answer:
        "Section 100 of the Bangladesh Labour Act 2006: an adult worker normally works no more than 8 hours a day, and may work up to 10 hours a day with overtime under section 108. The calculator flags any day over 10 hours.",
    },
    {
      question: "How many working hours are allowed in a week?",
      answer:
        "Section 102: normally no more than 48 hours a week. With overtime, no more than 60 hours in any week, and an average of no more than 56 a week over a year. Enter up to 7 days and the calculator compares your week with 48 and 60.",
    },
    {
      question: "How does it handle a night shift?",
      answer:
        "If the finish time is earlier than the start time, the shift is counted as running past midnight. 20:00 to 04:00 is 8 hours, and with a 30-minute break, 7 hours 30 minutes.",
    },
    {
      question: "Is the break deducted automatically?",
      answer:
        "No. Enter your actual break in minutes, or leave it blank for none. Section 101 sets the breaks an employer must give (for example 1 hour for work over 6 hours), but whether a break is paid time depends on your workplace, so we do not guess.",
    },
    {
      question: "How do I turn overtime hours into taka?",
      answer:
        "Copy the overtime hours in decimal form (for example 12.5) into the overtime pay calculator, with your basic wage. Section 108 pays overtime at twice the ordinary rate of basic wage and dearness allowance.",
    },
    {
      question: "Are my times saved or sent anywhere?",
      answer:
        "No. Everything is worked out in your browser. Recent calculations can be kept on this device only, and you can turn that off or clear it.",
    },
  ],
  faqsBn: [
    {
      question: "এক দিনের কর্মঘণ্টা কীভাবে হিসাব করব?",
      answer:
        "কর্মঘণ্টা = বের হওয়ার সময় − ঢোকার সময় − বিরতি। উদাহরণ: সকাল 8টা থেকে সন্ধ্যা 7টা = 11 ঘণ্টা; 1 ঘণ্টা দুপুরের বিরতি বাদ দিলে কাজ হলো 10 ঘণ্টা। সেদিন 8 ঘণ্টার বেশি অংশ, অর্থাৎ 2 ঘণ্টা, ওভারটাইম।",
    },
    {
      question: "বাংলাদেশে একজন শ্রমিক দিনে কত ঘণ্টা কাজ করতে পারেন?",
      answer:
        "বাংলাদেশ শ্রম আইন 2006-এর 100 ধারা: প্রাপ্তবয়স্ক শ্রমিক সাধারণত দিনে 8 ঘণ্টার বেশি কাজ করবেন না, তবে 108 ধারা অনুযায়ী ওভারটাইমসহ দিনে 10 ঘণ্টা পর্যন্ত করতে পারেন। 10 ঘণ্টার বেশি কোনো দিন থাকলে ক্যালকুলেটর তা দেখায়।",
    },
    {
      question: "সপ্তাহে কত ঘণ্টা কাজ করা যায়?",
      answer:
        "102 ধারা: সাধারণত সপ্তাহে 48 ঘণ্টার বেশি নয়। ওভারটাইমসহ কোনো সপ্তাহে 60 ঘণ্টার বেশি নয়, আর বছরে গড়ে সপ্তাহে 56 ঘণ্টার বেশি নয়। 7 দিন পর্যন্ত লিখলে ক্যালকুলেটর আপনার সপ্তাহকে 48 ও 60 ঘণ্টার সঙ্গে মিলিয়ে দেখায়।",
    },
    {
      question: "রাতের শিফট কীভাবে হিসাব হয়?",
      answer:
        "বের হওয়ার সময় ঢোকার সময়ের চেয়ে আগে হলে শিফটটি মাঝরাত পার হয়েছে ধরা হয়। রাত 8টা (20:00) থেকে ভোর 4টা (04:00) = 8 ঘণ্টা; 30 মিনিট বিরতি বাদ দিলে 7 ঘণ্টা 30 মিনিট।",
    },
    {
      question: "বিরতি কি নিজে থেকে বাদ যায়?",
      answer:
        "না। আপনার আসল বিরতি মিনিটে লিখুন, না থাকলে ফাঁকা রাখুন। 101 ধারায় মালিককে কী বিরতি দিতে হবে তা আছে (যেমন 6 ঘণ্টার বেশি কাজে 1 ঘণ্টা), তবে বিরতি কাজের সময় হিসেবে গণ্য হবে কি না তা কর্মস্থলভেদে আলাদা, তাই আমরা অনুমান করি না।",
    },
    {
      question: "ওভারটাইম ঘণ্টা থেকে টাকা কীভাবে বের করব?",
      answer:
        "দশমিকে দেখানো ওভারটাইম ঘণ্টা (যেমন 12.5) আপনার মূল মজুরিসহ ওভারটাইম মজুরি ক্যালকুলেটরে লিখুন। 108 ধারায় ওভারটাইম মজুরি মূল মজুরি ও মহার্ঘভাতার সাধারণ হারের দ্বিগুণ।",
    },
    {
      question: "আমার সময়গুলো কি কোথাও সংরক্ষিত বা পাঠানো হয়?",
      answer:
        "না। সব হিসাব আপনার ব্রাউজারেই হয়। সাম্প্রতিক হিসাব শুধু এই ডিভাইসে রাখা যায়; চাইলে বন্ধ বা মুছে ফেলতে পারেন।",
    },
  ],
};
