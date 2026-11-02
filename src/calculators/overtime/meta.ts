import type { CalculatorMeta } from "@/calculators/types";

export const overtimeCalculator: CalculatorMeta = {
  slug: "overtime-calculator",
  name: "Overtime Pay Calculator (Bangladesh Labour Act)",
  nameBn: "ওভারটাইম হিসাব ক্যালকুলেটর",
  category: "work",
  icon: "briefcase",
  summary:
    "Work out overtime pay under section 108 of the Bangladesh Labour Act: twice the hourly rate of basic wage plus dearness allowance, for the hours you worked.",
  summaryBn:
    "শ্রম আইনের 108 ধারা অনুযায়ী ওভারটাইম হিসাব করুন: মূল মজুরি ও মহার্ঘভাতার ঘণ্টাপ্রতি হারের দ্বিগুণ, আপনার ওভারটাইম ঘণ্টা দিয়ে গুণ করে।",
  keywords: [
    "overtime calculator bangladesh",
    "overtime calculation bangladesh",
    "garments overtime",
    "garments overtime rate",
    "rmg overtime calculation",
    "overtime formula bangladesh",
    "labour act overtime",
    "overtime rate",
    "ওভারটাইম হিসাব",
    "ওভারটাইম রেট",
    "ওভারটাইমের হিসাব",
    "অধিকাল ভাতা",
    "অতিরিক্ত কর্মঘণ্টার মজুরি",
    "গার্মেন্টস ওভারটাইম হিসাব",
    "ওভারটাইম ক্যালকুলেটর",
    "overtime hisab",
  ],
  seo: {
    title: "Overtime Calculator Bangladesh: Labour Act Rate",
    description:
      "Calculate overtime pay in Taka: twice the hourly rate of basic wage plus dearness allowance (Labour Act, section 108). Free, private, with the formula shown.",
  },
  seoBn: {
    title: "ওভারটাইম হিসাব: শ্রম আইনের রেট ও সূত্র",
    description:
      "মূল মজুরি ও মহার্ঘভাতার ঘণ্টাপ্রতি হারের দ্বিগুণ হারে ওভারটাইম মজুরি হিসাব করুন (শ্রম আইন, ধারা 108)। ফ্রি, সূত্র ও উদাহরণসহ, আপনার তথ্য ডিভাইসেই থাকে।",
  },
  addedOn: "2026-11-02",
  updatedOn: "2026-11-02",
  related: ["salary-calculator", "job-exit-benefit-calculator", "earned-leave-calculator", "percentage-calculator", "emi-calculator"],
  faqs: [
    {
      question: "How is overtime calculated in Bangladesh?",
      answer:
        "Section 108 of the Bangladesh Labour Act 2006 pays overtime at twice the ordinary rate of basic wage, dearness allowance and ad hoc or interim wage, if any. Overtime pay = (basic + dearness) ÷ monthly hours × 2 × overtime hours. Example: (৳10,000 + ৳400) ÷ 208 = ৳50 an hour; overtime ৳100 an hour; 12.5 hours = ৳1,250.",
    },
    {
      question: "Why do I have to enter the monthly hours myself?",
      answer:
        "The Act sets the 2× rate, but the section we read does not say how a monthly wage becomes an hourly rate. Payroll guides often divide by 208, but we could not confirm that in an official text, so we do not guess. Use the figure on your payslip, contract or wage notice.",
    },
    {
      question: "Is house rent or medical allowance included in overtime pay?",
      answer:
        "Section 108 names basic wage, dearness allowance and ad hoc or interim wage. House rent, medical and other allowances are not named, so this calculator leaves them out. Your employer's payslip and the law decide in your case.",
    },
    {
      question: "How many hours can I work in a day and a week?",
      answer:
        "Section 100: normally 8 hours a day, up to 10 with overtime. Section 102: normally 48 hours a week, at most 60 in any week and 56 a week on average over a year. Meal and rest breaks are in section 101.",
    },
    {
      question: "What is the overtime rate for ৳12,500 basic?",
      answer:
        "It depends on the divisor you enter. With a divisor of 208 the ordinary rate is ৳12,500 ÷ 208 = ৳60.10 an hour, so the overtime rate is ৳120.19 an hour, before any dearness allowance.",
    },
    {
      question: "Does this work for piece-rate workers?",
      answer:
        "No. Section 108(2), added in 2018, says the 2× overtime rule does not apply to workers paid at piece rate. This calculator is for time-rated, monthly-paid workers.",
    },
    {
      question: "Are my figures sent anywhere?",
      answer:
        "No. The calculation runs in your browser. Recent calculations can be saved on your device only, and you can turn that off or clear it.",
    },
  ],
  faqsBn: [
    {
      question: "বাংলাদেশে ওভারটাইম কীভাবে হিসাব করা হয়?",
      answer:
        "শ্রম আইন 2006-এর 108 ধারায় ওভারটাইম পাওয়া যায় মূল মজুরি, মহার্ঘভাতা এবং এডহক বা অন্তর্বর্তী মজুরির (যদি থাকে) সাধারণ হারের দ্বিগুণ হারে। ওভারটাইম মজুরি = (মূল মজুরি + মহার্ঘভাতা) ÷ মাসের ঘণ্টা × 2 × ওভারটাইম ঘণ্টা। উদাহরণ: (৳10,000 + ৳400) ÷ 208 = ঘণ্টায় ৳50; ওভারটাইম ঘণ্টায় ৳100; 12.5 ঘণ্টায় ৳1,250।",
    },
    {
      question: "মাসের ঘণ্টা কেন নিজে লিখতে হবে?",
      answer:
        "আইনে দ্বিগুণ হারের কথা আছে, কিন্তু মাসিক মজুরি থেকে ঘণ্টাপ্রতি হার কীভাবে বের হবে তা আমরা পড়া ধারায় পাইনি। পে-রোল গাইডে প্রায়ই 208 দিয়ে ভাগ করা হয়, তবে সরকারি পাঠে তা যাচাই করতে পারিনি, তাই অনুমান করিনি। আপনার পে-স্লিপ, নিয়োগপত্র বা মজুরি বিজ্ঞপ্তির সংখ্যাটি দিন।",
    },
    {
      question: "বাড়িভাড়া বা চিকিৎসা ভাতা কি ওভারটাইমের হিসাবে ধরা হয়?",
      answer:
        "108 ধারায় শুধু মূল মজুরি, মহার্ঘভাতা এবং এডহক বা অন্তর্বর্তী মজুরির কথা আছে। বাড়িভাড়া, চিকিৎসা ও অন্য ভাতার নাম নেই, তাই এই ক্যালকুলেটর সেগুলো বাদ দেয়। আপনার ক্ষেত্রে মালিকের পে-স্লিপ আর আইনই চূড়ান্ত।",
    },
    {
      question: "দিনে ও সপ্তাহে কত ঘণ্টা কাজ করা যায়?",
      answer:
        "ধারা 100: সাধারণত দিনে 8 ঘণ্টা, ওভারটাইমসহ 10 ঘণ্টা পর্যন্ত। ধারা 102: সাধারণত সপ্তাহে 48 ঘণ্টা, কোনো সপ্তাহে সর্বোচ্চ 60 ঘণ্টা এবং বছরে গড়ে সপ্তাহে 56 ঘণ্টা। খাওয়া ও বিশ্রামের বিরতি 101 ধারায়।",
    },
    {
      question: "মূল মজুরি ৳12,500 হলে ওভারটাইম রেট কত?",
      answer:
        "এটি আপনার দেওয়া ভাজক সংখ্যার ওপর নির্ভর করে। ভাজক 208 ধরলে সাধারণ হার ৳12,500 ÷ 208 = ঘণ্টায় ৳60.10, তাই ওভারটাইম রেট ঘণ্টায় ৳120.19 (মহার্ঘভাতা ছাড়া)।",
    },
    {
      question: "ঠিকা-হার (পিস রেট) শ্রমিকের জন্য কি এটি চলবে?",
      answer:
        "না। 2018 সালে যোগ হওয়া 108(2) উপ-ধারা অনুযায়ী ঠিকা-হারে মজুরিপ্রাপ্ত শ্রমিকের ক্ষেত্রে দ্বিগুণ ওভারটাইমের বিধান প্রযোজ্য নয়। এই ক্যালকুলেটর মাসিক বেতনের সময়-হারের শ্রমিকদের জন্য।",
    },
    {
      question: "আমার তথ্য কি কোথাও পাঠানো হয়?",
      answer:
        "না। হিসাব আপনার ব্রাউজারেই হয়। সাম্প্রতিক হিসাব শুধু আপনার ডিভাইসে সংরক্ষিত থাকতে পারে; চাইলে বন্ধ বা মুছে ফেলতে পারেন।",
    },
  ],
};
