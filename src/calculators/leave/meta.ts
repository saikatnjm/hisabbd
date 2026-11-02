import type { CalculatorMeta } from "@/calculators/types";

export const leaveCalculator: CalculatorMeta = {
  slug: "earned-leave-calculator",
  name: "Earned Leave Calculator (Labour Act)",
  nameBn: "অর্জিত ছুটি হিসাব ক্যালকুলেটর",
  category: "work",
  icon: "calendar-range",
  summary:
    "Work out earned (annual) leave under section 117 of the Bangladesh Labour Act: days earned, the 40 or 60 day limit, what is left, and what unused leave is worth in Taka.",
  summaryBn:
    "শ্রম আইনের 117 ধারা অনুযায়ী অর্জিত (বাৎসরিক) ছুটি হিসাব করুন: কত দিন অর্জিত হলো, 40 বা 60 দিনের সীমা, কত বাকি আর অব্যয়িত ছুটির টাকার অঙ্ক।",
  keywords: [
    "earned leave calculator bangladesh",
    "annual leave labour act",
    "annual leave calculation bangladesh",
    "earned leave encashment bangladesh",
    "leave encashment calculator",
    "labour act 2006 leave",
    "অর্জিত ছুটি হিসাব",
    "ছুটি নগদায়ন",
    "বাৎসরিক ছুটি হিসাব",
    "অর্জিত ছুটির টাকা",
    "শ্রম আইন ছুটি",
    "অব্যয়িত ছুটির মজুরী",
    "orjito chuti hisab",
  ],
  seo: {
    title: "Earned Leave Calculator Bangladesh: Labour Act",
    description:
      "Calculate earned leave under section 117 of the Labour Act: days earned, the 40 or 60 day cap, balance and encashment in Taka. Free, private, sources shown.",
  },
  seoBn: {
    title: "অর্জিত ছুটি হিসাব: শ্রম আইন ও নগদায়ন",
    description:
      "শ্রম আইনের 117 ধারা অনুযায়ী অর্জিত ছুটি, 40 বা 60 দিনের সীমা, বাকি ছুটি আর নগদায়নের টাকা হিসাব করুন। ফ্রি, ধারার উদ্ধৃতিসহ, তথ্য ডিভাইসেই থাকে।",
  },
  addedOn: "2026-11-02",
  updatedOn: "2026-11-02",
  related: ["overtime-calculator", "salary-calculator", "date-difference-calculator"],
  faqs: [
    {
      question: "How is earned leave calculated under the Bangladesh Labour Act?",
      answer:
        "Section 117(1) gives an adult worker who has completed one year of continuous service one day of leave for every 18 days worked in a shop, commercial or industrial establishment, factory or road transport establishment, one for every 22 days in a tea plantation, and one for every 11 days for a newspaper worker. The leave is for the previous 12 months of work and is taken in the next 12 months.",
    },
    {
      question: "What is the maximum earned leave I can keep?",
      answer:
        "Section 117(5): for an adult worker the entitlement stops growing at 40 days in a factory or road transport establishment, and at 60 days in a tea plantation, shop, commercial or industrial establishment. If your employer refuses leave you applied for, section 117(7) adds those days on top of the limit.",
    },
    {
      question: "Does unused earned leave carry forward?",
      answer:
        "Yes. Section 117(4) adds leave you did not take to the leave due in the next 12 months, up to the limit in section 117(5). Casual leave (section 115) and sick leave (section 116) do not carry forward.",
    },
    {
      question: "Is unused earned leave paid when I leave the job?",
      answer:
        "Yes. Section 11 says that if your employment ends for any reason (retrenchment, discharge, removal, dismissal, retirement or resignation) and annual leave is due, the employer pays the wages you would have received during that leave.",
    },
    {
      question: "Which daily wage is used to pay for leave?",
      answer:
        "Section 119(1): the daily average of your full-time wage plus dearness allowance and any ad hoc or interim wage, for the days you worked in the month just before the leave. Overtime allowance and bonus are left out. Example: ৳31,200 paid for 26 days worked is ৳1,200 a day, so 46 days of leave is ৳55,200.",
    },
    {
      question: "How much earned leave do I get for 300 days of work?",
      answer:
        "At 1 day for every 18 days worked, 300 days give 16 whole days (300 ÷ 18 = 16.67; the Act does not mention part-days, so only whole days are counted). With 50 days carried forward that is 66, but a 60 day limit leaves 60. Taking 14 days leaves 46.",
    },
    {
      question: "Does this calculator work for government employees or adolescent workers?",
      answer:
        "No. Government employees follow their own service rules. Adolescent (কিশোর) workers have different rates and limits in section 117(2) and (6), which this calculator does not cover. Your appointment letter, service rules and your employer's leave records decide your actual balance; this is not legal advice.",
    },
    {
      question: "Are my figures sent anywhere?",
      answer:
        "No. The calculation runs in your browser. Recent calculations can be saved on your device only, and you can turn that off or clear it.",
    },
  ],
  faqsBn: [
    {
      question: "বাংলাদেশ শ্রম আইনে অর্জিত ছুটি কীভাবে হিসাব হয়?",
      answer:
        "117(1) ধারা অনুযায়ী এক বছর অবিচ্ছিন্ন চাকরি পূর্ণ করা প্রাপ্তবয়স্ক শ্রমিক দোকান, বাণিজ্য বা শিল্প প্রতিষ্ঠান, কারখানা ও সড়ক পরিবহন প্রতিষ্ঠানে প্রতি 18 দিন কাজের জন্য 1 দিন, চা বাগানে প্রতি 22 দিনের জন্য 1 দিন, আর সংবাদপত্র শ্রমিক প্রতি 11 দিনের জন্য 1 দিন ছুটি পান। এই ছুটি আগের 12 মাসের কাজের জন্য, পরের 12 মাসে ভোগ করতে হয়।",
    },
    {
      question: "অর্জিত ছুটি সর্বোচ্চ কত দিন জমা রাখা যায়?",
      answer:
        "117(5) ধারা: প্রাপ্তবয়স্ক শ্রমিকের পাওনা ছুটি কারখানা বা সড়ক পরিবহন প্রতিষ্ঠানে 40 দিন আর চা বাগান, দোকান, বাণিজ্য বা শিল্প প্রতিষ্ঠানে 60 দিন হলে আর বাড়ে না। আবেদন করা ছুটি মালিক নামঞ্জুর করলে 117(7) ধারায় সেই দিনগুলো সীমার অতিরিক্ত পাওনা হিসাবে যুক্ত হয়।",
    },
    {
      question: "ভোগ না করা অর্জিত ছুটি কি পরের বছরে জমা থাকে?",
      answer:
        "হ্যাঁ। 117(4) ধারা অনুযায়ী ভোগ না করা ছুটি পরবর্তী 12 মাসের পাওনা ছুটির সঙ্গে যুক্ত হয়, তবে 117(5) ধারার সীমা পর্যন্ত। নৈমিত্তিক ছুটি (ধারা 115) ও পীড়া ছুটি (ধারা 116) জমা থাকে না।",
    },
    {
      question: "চাকরি ছাড়লে বা শেষ হলে কি অর্জিত ছুটির টাকা পাওয়া যায়?",
      answer:
        "হ্যাঁ। 11 ধারা অনুযায়ী ছাঁটাই, ডিসচার্জ, অপসারণ, বরখাস্ত, অবসর, পদত্যাগ বা অন্য যেকোনো কারণে চাকরি শেষ হলে এবং বাৎসরিক ছুটি পাওনা থাকলে মালিক সেই ছুটির সময়ে যে মজুরি প্রাপ্য হতো তা দেবেন।",
    },
    {
      question: "ছুটির টাকা কোন দৈনিক মজুরিতে ধরা হয়?",
      answer:
        "119(1) ধারা: ছুটির ঠিক আগের মাসে যে দিনগুলোতে কাজ করেছেন, সেই দিনগুলোর পূর্ণ সময়ের মজুরি, মহার্ঘভাতা এবং এডহক বা অন্তর্বর্তী মজুরির (যদি থাকে) দৈনিক গড়। অধিকাল ভাতা ও বোনাস বাদ। উদাহরণ: 26 দিন কাজের জন্য ৳31,200 মানে দিনে ৳1,200, তাই 46 দিনের ছুটির টাকা ৳55,200।",
    },
    {
      question: "300 দিন কাজ করলে কত দিন অর্জিত ছুটি পাওয়া যায়?",
      answer:
        "প্রতি 18 দিনে 1 দিন ধরলে 300 দিনে 16 পূর্ণ দিন (300 ÷ 18 = 16.67; আইনে আংশিক দিনের কথা নেই, তাই শুধু পূর্ণ দিন ধরা হয়)। আগের 50 দিন জমা থাকলে মোট 66, কিন্তু 60 দিনের সীমায় দাঁড়ায় 60। 14 দিন ভোগ করলে বাকি থাকে 46।",
    },
    {
      question: "সরকারি কর্মচারী বা কিশোর শ্রমিকের জন্য কি এটি চলবে?",
      answer:
        "না। সরকারি কর্মচারীরা নিজেদের চাকরি বিধি অনুসরণ করেন। কিশোর শ্রমিকদের হার ও সীমা 117(2) ও (6) ধারায় আলাদা, যা এই ক্যালকুলেটরে নেই। আপনার প্রকৃত ছুটির হিসাব নিয়োগপত্র, চাকরি বিধি আর মালিকের ছুটির রেকর্ড অনুযায়ী হবে; এটি আইনি পরামর্শ নয়।",
    },
    {
      question: "আমার তথ্য কি কোথাও পাঠানো হয়?",
      answer:
        "না। হিসাব আপনার ব্রাউজারেই হয়। সাম্প্রতিক হিসাব শুধু আপনার ডিভাইসে সংরক্ষিত থাকতে পারে; চাইলে বন্ধ বা মুছে ফেলতে পারেন।",
    },
  ],
};
