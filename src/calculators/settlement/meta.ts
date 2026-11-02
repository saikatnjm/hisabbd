import type { CalculatorMeta } from "@/calculators/types";

export const settlementCalculator: CalculatorMeta = {
  slug: "job-exit-benefit-calculator",
  name: "Job Exit Benefit Calculator (Labour Act)",
  nameBn: "চাকরি ছাড়লে কত টাকা পাবেন: শ্রম আইন হিসাব",
  category: "finance",
  icon: "briefcase",
  summary:
    "Estimate what the Bangladesh Labour Act gives a permanent worker who resigns or is retrenched, discharged or terminated: compensation per year of service, gratuity and notice pay.",
  summaryBn:
    "ইস্তফা, ছাঁটাই, ডিসচার্জ বা মালিকের চাকরি অবসানে স্থায়ী শ্রমিক শ্রম আইন অনুযায়ী কত পান তার আনুমানিক হিসাব: প্রতি বছরের ক্ষতিপূরণ, গ্র্যাচুইটি ও নোটিশের মজুরি।",
  keywords: [
    "gratuity calculator bangladesh",
    "resignation benefit labour act",
    "retrenchment compensation bangladesh",
    "labour act compensation per year of service",
    "job termination benefit bangladesh",
    "final settlement calculator bangladesh",
    "notice pay calculator bangladesh",
    "চাকরি ছাড়লে কত টাকা পাব",
    "গ্র্যাচুইটি হিসাব",
    "অব্যাহতি সুবিধা",
    "ছাঁটাই ক্ষতিপূরণ হিসাব",
    "ইস্তফা দিলে কত টাকা পাব",
    "শ্রম আইন চাকরি অবসান ক্ষতিপূরণ",
    "চাকরির পাওনা হিসাব",
    "gratuity hisab",
    "chakri chharle koto taka pabo",
  ],
  seo: {
    title: "Job Exit Benefit Calculator: Resignation, Gratuity",
    description:
      "Work out what you get when you resign or are retrenched, discharged or terminated under the Bangladesh Labour Act: compensation, gratuity and notice pay.",
  },
  seoBn: {
    title: "চাকরি ছাড়লে কত টাকা পাবেন: শ্রম আইন হিসাব",
    description:
      "ইস্তফা, ছাঁটাই, ডিসচার্জ বা চাকরির অবসানে শ্রম আইন অনুযায়ী ক্ষতিপূরণ, গ্র্যাচুইটি ও নোটিশের মজুরি হিসাব করুন। ফ্রি, প্রাইভেট, ফোনে চলে।",
  },
  addedOn: "2026-11-02",
  related: ["overtime-calculator", "salary-calculator", "date-difference-calculator"],
  faqs: [
    {
      question: "How much do I get if I resign under the Labour Act?",
      answer:
        "Section 27(4), as replaced in 2026, pays a permanent worker for each completed year of service: 7 days’ wages if you served up to 3 years, 15 days’ wages if more than 3 but less than 10 years, and 30 days’ wages (or gratuity, if payable and higher) from 10 years. For example, with a basic wage of ৳20,000, a day’s wage of ৳666.67 (divided by 30) and 4 years 8 months of service, the rate is 15 days for 4 completed years: ৳40,000.",
    },
    {
      question: "How much compensation do I get if I am retrenched?",
      answer:
        "Under section 20(2), if you have at least one year of continuous service you get one month’s written notice (or a month’s wages instead) and 30 days’ wages for each year of service, or gratuity if payable, whichever is higher. With a wage of ৳15,000 (basic ৳14,000 plus dearness allowance ৳1,000), 8 years 7 months and gratuity payable, the 30-day figure is ৳120,000 and gratuity is ৳135,000, so ৳135,000 applies, plus ৳15,000 if no notice was given.",
    },
    {
      question: "Which wage is used: basic only, or the whole salary?",
      answer:
        "Section 14(3) says the wage is the last monthly basic wage, dearness allowance and ad hoc or interim wage, if any, before the exit. House rent, medical, conveyance and other allowances are not in it. This calculator uses basic plus an optional dearness or ad hoc amount.",
    },
    {
      question: "How is a day’s wage worked out from a monthly wage?",
      answer:
        "The Act does not say for these sections, so we do not assume a number. You enter the days in a month used by your employer, often 30 or 26. Check your payslip, contract or HR. A different divisor changes every amount except the one-month notice in a retrenchment.",
    },
    {
      question: "What is gratuity and how is it counted?",
      answer:
        "Section 2(10) defines gratuity as at least 30 days’ wages (45 days’ wages if service is over 10 years) at the last wage rate for each full year of service, or for service of more than six months beyond it. Whether you are entitled to it depends on your employer’s rules, so you tick it yourself. When ticked, it is compared with the compensation and the higher amount is used.",
    },
    {
      question: "What if I leave without serving notice?",
      answer:
        "If you resign without notice, section 27(3) lets you do so by paying your employer wages for the notice period, 60 days for a permanent worker. This calculator subtracts that amount in the total as an estimate. If the employer ends your job without notice, section 26(3) lets them pay wages for the notice period instead, 120 days for a monthly-paid permanent worker.",
    },
    {
      question: "Does this cover dismissal, temporary workers or government jobs?",
      answer:
        "No. Dismissal for misconduct (section 23) depends on a proven process and can mean no compensation. Temporary workers have different notice rules, and government employees and workers under other laws are outside the Labour Act. Pay for unused leave (section 11), provident fund and bonuses are not included.",
    },
    {
      question: "When must my final dues be paid, and is this legal advice?",
      answer:
        "Section 30 says all dues must be paid within 30 working days after the job ends. This calculator is an estimate, not legal advice. Your appointment letter, service rules, any settlement and the courts decide the real amount. If you think you are owed more, talk to your union or the labour office.",
    },
  ],
  faqsBn: [
    {
      question: "শ্রম আইনে ইস্তফা দিলে কত টাকা পাব?",
      answer:
        "২০২৬ সালে প্রতিস্থাপিত ২৭(৪) ধারায় স্থায়ী শ্রমিক প্রতি সম্পূর্ণ চাকরি বছরের জন্য পান: 3 বছর পর্যন্ত চাকরিতে 7 দিনের মজুরি, 3 বছরের বেশি কিন্তু 10 বছরের কম হলে 15 দিনের মজুরি, আর 10 বছর বা তার বেশি হলে 30 দিনের মজুরি (বা প্রদেয় হলে গ্র্যাচুইটি, যেটি বেশি)। যেমন মূল মজুরি ৳20,000, দৈনিক মজুরি ৳666.67 (30 দিয়ে ভাগ) আর 4 বছর 8 মাস চাকরিতে 4 সম্পূর্ণ বছরের জন্য 15 দিন হারে ৳40,000।",
    },
    {
      question: "ছাঁটাই হলে কত ক্ষতিপূরণ পাব?",
      answer:
        "২০(২) ধারায় কমপক্ষে এক বছর অবিচ্ছিন্ন চাকরি থাকলে এক মাসের লিখিত নোটিশ (বা তার বদলে এক মাসের মজুরি) এবং প্রতি বছরের জন্য 30 দিনের মজুরি বা প্রদেয় হলে গ্র্যাচুইটি, যেটি বেশি, পাওয়া যায়। মজুরি ৳15,000 (মূল ৳14,000 ও মহার্ঘভাতা ৳1,000), 8 বছর 7 মাস চাকরি আর গ্র্যাচুইটি প্রদেয় হলে 30 দিনের হিসাবে ৳120,000, গ্র্যাচুইটি ৳135,000; তাই ৳135,000 ধরা হয়, নোটিশ না দিলে আরও ৳15,000।",
    },
    {
      question: "কোন মজুরি ধরা হয়: শুধু মূল মজুরি, না পুরো বেতন?",
      answer:
        "১৪(৩) ধারা অনুযায়ী চাকরি শেষ হওয়ার আগের সর্বশেষ মাসিক মূল মজুরি, মহার্ঘ ভাতা এবং এডহক বা অন্তর্বর্তী মজুরি (যদি থাকে) ধরা হয়। বাড়িভাড়া, চিকিৎসা, যাতায়াত ও অন্য ভাতা এতে নেই। এই ক্যালকুলেটর মূল মজুরির সঙ্গে ঐচ্ছিক মহার্ঘ বা এডহক অংশ ধরে।",
    },
    {
      question: "মাসিক মজুরি থেকে দৈনিক মজুরি কীভাবে বের হয়?",
      answer:
        "এই ধারাগুলোতে আইনে তা বলা নেই, তাই আমরা কোনো সংখ্যা ধরে নিই না। আপনার মালিক মাসে যত দিন ধরে হিসাব করেন (প্রায়ই 30 বা 26) তা লিখুন। পে-স্লিপ, নিয়োগপত্র বা এইচআর থেকে জেনে নিন। ভাজক বদলালে ছাঁটাইয়ের এক মাসের নোটিশ বাদে সব অঙ্ক বদলে যায়।",
    },
    {
      question: "গ্র্যাচুইটি কী এবং কীভাবে গোনা হয়?",
      answer:
        "২(১০) ধারায় গ্র্যাচুইটি হলো সর্বশেষ মজুরি হারে প্রতি পূর্ণ বছর চাকরির জন্য, বা তার ওপর ছয় মাসের বেশি চাকরির জন্য, ন্যূনতম 30 দিনের মজুরি (চাকরি 10 বছরের বেশি হলে 45 দিনের মজুরি)। এটি পাবেন কি না তা মালিকের নিয়মের ওপর নির্ভর করে, তাই আপনি নিজে টিক দেন। টিক দিলে ক্ষতিপূরণের সঙ্গে তুলনা করে বেশিটি ধরা হয়।",
    },
    {
      question: "নোটিশ না দিয়ে চাকরি ছাড়লে কী হবে?",
      answer:
        "নোটিশ ছাড়া ইস্তফা দিলে ২৭(৩) ধারায় নোটিশ মেয়াদের মজুরির সমান অর্থ মালিককে দিতে হয়, স্থায়ী শ্রমিকের জন্য 60 দিন। এই ক্যালকুলেটর মোট অঙ্ক থেকে আনুমানিকভাবে তা বাদ দেয়। মালিক নোটিশ ছাড়া চাকরি শেষ করলে ২৬(৩) ধারায় নোটিশ মেয়াদের মজুরি দিতে পারেন, মাসিক মজুরির স্থায়ী শ্রমিকের জন্য 120 দিন।",
    },
    {
      question: "বরখাস্ত, অস্থায়ী শ্রমিক বা সরকারি চাকরি কি এতে আছে?",
      answer:
        "না। অসদাচরণে বরখাস্ত (ধারা ২৩) প্রমাণিত প্রক্রিয়ার ওপর নির্ভর করে এবং কখনো ক্ষতিপূরণ নাও থাকতে পারে। অস্থায়ী শ্রমিকের নোটিশের নিয়ম আলাদা, আর সরকারি কর্মচারী ও অন্য আইনের অধীন শ্রমিকরা শ্রম আইনের বাইরে। অব্যয়িত ছুটির মজুরি (ধারা ১১), ভবিষ্য তহবিল ও বোনাস ধরা হয়নি।",
    },
    {
      question: "চূড়ান্ত পাওনা কবে মিটিয়ে দিতে হয়, এটি কি আইনি পরামর্শ?",
      answer:
        "৩০ ধারা অনুযায়ী চাকরি শেষ হওয়ার পর সর্বোচ্চ 30 কর্মদিবসের মধ্যে সব পাওনা পরিশোধ করতে হয়। এই ক্যালকুলেটর আনুমানিক হিসাব, আইনি পরামর্শ নয়। প্রকৃত অঙ্ক ঠিক হবে আপনার নিয়োগপত্র, চাকরি বিধি, কোনো মীমাংসা আর আদালতের মাধ্যমে। আরও পাওনা আছে মনে হলে ইউনিয়ন বা শ্রম অফিসের সঙ্গে কথা বলুন।",
    },
  ],
};
