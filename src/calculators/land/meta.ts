import type { CalculatorMeta } from "@/calculators/types";

export const landCalculator: CalculatorMeta = {
  slug: "land-calculator",
  name: "Land Area Calculator",
  nameBn: "জমির পরিমাপ ক্যালকুলেটর",
  category: "everyday",
  icon: "land",
  summary:
    "Convert land between decimal (shotangsho), katha, bigha, acre and square feet, or work out a plot’s area from its side lengths in feet, haat or goj.",
  summaryBn:
    "শতাংশ, কাঠা, বিঘা, একর ও বর্গফুটে জমির হিসাব করুন, অথবা ফুট, হাত বা গজে জমির চার দিকের মাপ দিয়ে মোট জমি বের করুন।",
  keywords: [
    "land",
    "land area",
    "land calculator",
    "land measurement bangladesh",
    "land converter",
    "area converter",
    "plot area",
    "decimal",
    "decimal to katha",
    "katha to decimal",
    "decimal to sq ft",
    "katha",
    "bigha",
    "acre",
    "hectare",
    "square feet",
    "sq ft",
    "square metre",
    "square yard",
    "shotangsho",
    "shotok",
    "ojutangsho",
    "jomir hisab",
    "jomi mapar niyom",
    "haat",
    "goj",
    "জমির হিসাব",
    "জমির মাপ",
    "জমি পরিমাপ",
    "শতাংশ",
    "শতক",
    "ডেসিমাল",
    "কাঠা",
    "বিঘা",
    "একর",
    "হেক্টর",
    "বর্গফুট",
    "বর্গমিটার",
    "বর্গগজ",
    "অযুতাংশ",
    "হাত",
    "গজ",
    "শতাংশ থেকে কাঠা",
    "কাঠা থেকে শতাংশ",
  ],
  seo: {
    title: "Land Calculator Bangladesh (Decimal, Katha, Bigha, Acre)",
    description:
      "Convert land between decimal, katha, bigha, acre and sq ft, or find a plot’s area from its sides in feet, haat or goj. Katha size editable for your area.",
  },
  seoBn: {
    title: "জমির হিসাব ক্যালকুলেটর: শতাংশ, কাঠা, বিঘা, একর",
    description:
      "শতাংশ, কাঠা, বিঘা, একর ও বর্গফুটে জমির হিসাব করুন, অথবা ফুট, হাত বা গজে চার দিকের মাপ দিয়ে জমির পরিমাণ বের করুন। এলাকা অনুযায়ী কাঠার মাপ বদলানো যায়।",
  },
  addedOn: "2026-10-28",
  related: ["percentage-calculator"],
  faqs: [
    {
      question: "How many square feet are in 1 decimal (shotangsho)?",
      answer:
        "1 decimal (also called shotangsho or shotok) is 435.6 sq ft, which is 1/100 of an acre. So 10 decimal is 4,356 sq ft.",
    },
    {
      question: "How many decimal are in 1 katha?",
      answer:
        "With the standard 720 sq ft katha, 1 katha is 720 ÷ 435.6 = about 1.6529 decimal. The other way round, 1 decimal is about 0.605 katha, so 10 decimal is 6.05 katha.",
    },
    {
      question: "Is 1 bigha exactly 33 decimal?",
      answer:
        "No. A standard bigha is 20 katha = 14,400 sq ft, which is 14,400 ÷ 435.6 = about 33.0579 decimal. “33 decimal” is a handy round figure, but it is 25.2 sq ft short of a full bigha. The calculator uses the exact value.",
    },
    {
      question: "How many katha and decimal are in 1 acre?",
      answer:
        "1 acre is 100 decimal = 43,560 sq ft. With a 720 sq ft katha that is 60.5 katha, or 3.025 bigha.",
    },
    {
      question: "Why does the katha size vary?",
      answer:
        "The katha and bigha are traditional units, and their size has not always been the same everywhere. 720 sq ft (and 20 katha to the bigha) is the standard value in Bangladesh and the default here. If your deed or local surveyor uses a different katha, type its size in square feet in the katha size box. Only the katha and bigha figures change.",
    },
    {
      question: "How do I find the area of a plot from its four sides?",
      answer:
        "Choose “Area from measurements” and “Four sides”. The calculator averages the north and south sides, averages the east and west sides, and multiplies them. For north 60, south 64, east 40 and west 44 ft that is 62 × 42 = 2,604 sq ft, about 5.978 decimal. This is an approximation that works well for plots close to a rectangle.",
    },
    {
      question: "How do I measure a triangular or irregular plot?",
      answer:
        "For a triangle, enter its three sides and the calculator uses Heron’s formula. A 30, 40 and 50 ft triangle is 600 sq ft. An irregular plot can be split into triangles by measuring diagonals; work out each triangle and add the areas.",
    },
    {
      question: "What are haat and goj?",
      answer:
        "Traditional lengths still used when measuring land: 1 haat (cubit) is 18 inches = 1.5 ft, and 1 goj (yard) is 3 ft. A 40 by 30 haat plot is 60 by 45 ft = 2,700 sq ft, which is 3.75 katha.",
    },
    {
      question: "What is an ojutangsho (অযুতাংশ)?",
      answer:
        "One hundredth of a decimal: 1 ojutangsho = 4.356 sq ft, so 100 ojutangsho make 1 decimal. It is sometimes used in land records for small fractions of a decimal.",
    },
    {
      question: "Can I rely on this for buying or registering land?",
      answer:
        "Use it for estimates and to check figures. Before buying, selling or registering land, confirm the area with a government surveyor and the deed (dalil) and khatian. The calculator doesn’t know local practice or the legal record.",
    },
  ],
  faqsBn: [
    {
      question: "1 শতাংশে কত বর্গফুট?",
      answer:
        "1 শতাংশ (শতক বা ডেসিমাল) = 435.6 বর্গফুট, যা এক একরের 100 ভাগের 1 ভাগ। তাই 10 শতাংশ = 4,356 বর্গফুট।",
    },
    {
      question: "1 কাঠায় কত শতাংশ?",
      answer:
        "প্রচলিত 720 বর্গফুটের কাঠা ধরলে 1 কাঠা = 720 ÷ 435.6 = প্রায় 1.6529 শতাংশ। উল্টো দিকে, 1 শতাংশ প্রায় 0.605 কাঠা, তাই 10 শতাংশ = 6.05 কাঠা।",
    },
    {
      question: "1 বিঘা কি ঠিক 33 শতাংশ?",
      answer:
        "না। প্রচলিত এক বিঘা = 20 কাঠা = 14,400 বর্গফুট, যা 14,400 ÷ 435.6 = প্রায় 33.0579 শতাংশ। “33 শতাংশ” একটি সুবিধাজনক গোল হিসাব, তবে এতে পুরো বিঘার চেয়ে 25.2 বর্গফুট কম হয়। ক্যালকুলেটর সঠিক মানটি ব্যবহার করে।",
    },
    {
      question: "1 একরে কত শতাংশ ও কত কাঠা?",
      answer:
        "1 একর = 100 শতাংশ = 43,560 বর্গফুট। 720 বর্গফুটের কাঠা ধরলে তা 60.5 কাঠা, বা 3.025 বিঘা।",
    },
    {
      question: "কাঠার মাপ এলাকাভেদে আলাদা কেন?",
      answer:
        "কাঠা ও বিঘা প্রচলিত বা ঐতিহ্যগত একক, আর সব জায়গায় এদের মাপ সবসময় এক ছিল না। বাংলাদেশে প্রচলিত মান 720 বর্গফুটে এক কাঠা (আর 20 কাঠায় এক বিঘা), এখানে সেটিই ধরা আছে। আপনার দলিলে বা স্থানীয় আমিন যদি অন্য মাপের কাঠা ধরেন, “1 কাঠার মাপ” ঘরে বর্গফুটে সেটি লিখুন। শুধু কাঠা আর বিঘার হিসাব বদলাবে।",
    },
    {
      question: "চার দিকের মাপ দিয়ে জমির পরিমাণ কীভাবে বের করব?",
      answer:
        "“মাপ দিয়ে জমি” আর “চার দিক” বেছে নিন। ক্যালকুলেটর উত্তর ও দক্ষিণ দিকের গড়, আর পূর্ব ও পশ্চিম দিকের গড় নিয়ে গুণ করে। উত্তর 60, দক্ষিণ 64, পূর্ব 40 আর পশ্চিম 44 ফুট হলে 62 × 42 = 2,604 বর্গফুট, প্রায় 5.978 শতাংশ। এটি আনুমানিক হিসাব, প্রায়-আয়তাকার জমিতে ভালো কাজ করে।",
    },
    {
      question: "ত্রিভুজাকার বা অসমান জমি কীভাবে মাপব?",
      answer:
        "ত্রিভুজের তিন বাহুর মাপ দিলে ক্যালকুলেটর হেরনের সূত্রে ক্ষেত্রফল বের করে। 30, 40 ও 50 ফুটের ত্রিভুজ = 600 বর্গফুট। অসমান জমিকে কোনাকুনি মেপে কয়েকটি ত্রিভুজে ভাগ করুন, প্রতিটির ক্ষেত্রফল বের করে যোগ করুন।",
    },
    {
      question: "হাত আর গজ কত?",
      answer:
        "জমি মাপায় এখনো চলে এমন প্রচলিত দৈর্ঘ্যের একক: 1 হাত = 18 ইঞ্চি = 1.5 ফুট, আর 1 গজ = 3 ফুট। 40 হাত × 30 হাত জমি মানে 60 × 45 ফুট = 2,700 বর্গফুট, অর্থাৎ 3.75 কাঠা।",
    },
    {
      question: "অযুতাংশ কী?",
      answer:
        "এক শতাংশের 100 ভাগের 1 ভাগ: 1 অযুতাংশ = 4.356 বর্গফুট, তাই 100 অযুতাংশে 1 শতাংশ। জমির কাগজে শতাংশের ছোট ভগ্নাংশ বোঝাতে মাঝে মাঝে এটি ব্যবহার হয়।",
    },
    {
      question: "জমি কেনা বা রেজিস্ট্রির জন্য কি এই হিসাবের ওপর ভরসা করা যায়?",
      answer:
        "এটি আনুমানিক হিসাব ও যাচাইয়ের জন্য। জমি কেনা, বেচা বা রেজিস্ট্রির আগে সরকারি সার্ভেয়ার দিয়ে মাপ এবং দলিল ও খতিয়ান মিলিয়ে নিশ্চিত হোন। ক্যালকুলেটর স্থানীয় প্রথা বা আইনি রেকর্ড জানে না।",
    },
  ],
};
