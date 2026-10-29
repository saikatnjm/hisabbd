import type { CalculatorMeta } from "@/calculators/types";

export const zakatCalculator: CalculatorMeta = {
  slug: "zakat-calculator",
  name: "Zakat Calculator",
  nameBn: "যাকাত ক্যালকুলেটর",
  category: "finance",
  icon: "crescent",
  summary:
    "Add up your cash, savings, gold, silver and business stock, subtract debts due now, and see whether zakat is due on the silver or gold nisab, and how much (2.5%).",
  summaryBn:
    "নগদ টাকা, সঞ্চয়, সোনা, রুপা ও ব্যবসার পণ্য যোগ করে এখনকার ঋণ বাদ দিন, তারপর দেখুন রুপা বা সোনার নিসাব অনুযায়ী যাকাত ফরজ কি না এবং কত (2.5%)।",
  keywords: [
    "zakat calculator bangladesh",
    "zakat calculator",
    "zakat calculator bd",
    "zakat",
    "zakah",
    "zakat nisab",
    "nisab 2026",
    "nisab 2027",
    "nisab 1448",
    "zakat 2.5%",
    "zakat on gold",
    "zakat on silver",
    "zakat on savings",
    "silver nisab",
    "gold nisab",
    "jakat hisab",
    "jakat calculator",
    "zakat koto",
    "jakater nisab",
    "যাকাত",
    "জাকাত",
    "যাকাত ক্যালকুলেটর",
    "যাকাত হিসাব",
    "যাকাতের হিসাব",
    "যাকাত হিসাব করার নিয়ম",
    "যাকাতের নিসাব",
    "যাকাতের নিসাব 2026",
    "যাকাতের নিসাব 2027",
    "নিসাব পরিমাণ",
    "সাড়ে বায়ান্ন তোলা রুপা",
    "সাড়ে সাত ভরি সোনা",
    "সোনার যাকাত",
    "রুপার যাকাত",
    "কত টাকা থাকলে যাকাত দিতে হয়",
    "রমজান",
  ],
  seo: {
    title: "Zakat Calculator Bangladesh: Nisab and 2.5% Zakat",
    description:
      "Calculate zakat in Taka: add cash, savings, gold, silver and stock, subtract debts, and compare with the silver or gold nisab from today’s price. Free.",
  },
  seoBn: {
    title: "যাকাত ক্যালকুলেটর: যাকাতের হিসাব ও নিসাব (রুপা/সোনা)",
    description:
      "টাকায় যাকাত হিসাব করুন: নগদ, সঞ্চয়, সোনা, রুপা ও ব্যবসার পণ্য যোগ করে ঋণ বাদ দিন, আজকের দামে রুপা বা সোনার নিসাবের সাথে মিলিয়ে দেখুন। ফ্রি।",
  },
  addedOn: "2026-10-29",
  updatedOn: "2026-10-29",
  related: ["gold-calculator", "sanchayapatra-calculator", "dps-calculator"],
  faqs: [
    {
      question: "How is zakat calculated?",
      answer:
        "Add up your zakatable wealth (cash, bank savings, gold, silver, business stock and money you expect back), subtract debts and bills due now, and if the result is at least the nisab and you have held it for a lunar year, zakat is 2.5% (one-fortieth) of it. Example: ৳50,000 cash + ৳3,00,000 savings + 2 bhori of gold at an example ৳2,00,000 a bhori − ৳50,000 of debts = ৳7,00,000, so zakat is ৳17,500 on the silver nisab.",
    },
    {
      question: "What is the nisab?",
      answer:
        "The nisab is the minimum wealth on which zakat is due: 7.5 bhori (87.48 g) of gold or 52.5 bhori (612.36 g) of silver, with 1 bhori = 11.664 g. In Taka it is that weight × today’s price per bhori.",
    },
    {
      question: "What is the zakat nisab for 2026–27 (1448 AH) in Taka?",
      answer:
        "It depends on the silver or gold price on the day your zakat year completes, so no fixed figure fits everyone. We found no Islamic Foundation Bangladesh announcement of a nisab amount for 1447 or 1448 (checked 29 October 2026). At an example silver price of ৳4,000 a bhori, the silver nisab is 52.5 × 4,000 = ৳2,10,000; enter today’s BAJUS price to get yours.",
    },
    {
      question: "Should I use the silver or the gold nisab?",
      answer:
        "Scholars differ. The silver nisab is much lower, so more people pay zakat, and many zakat organisations in Bangladesh encourage it. Others prefer gold so that people with small savings aren’t made payers. The calculator lets you choose; ask a scholar you trust for your situation.",
    },
    {
      question: "Do I pay zakat on gold jewellery I wear?",
      answer:
        "Scholars differ: some count all gold and silver jewellery, others exempt jewellery worn in normal personal use. Ask a scholar. If you count it, enter its weight and today’s price per bhori; use the Gold Price & Bhori Calculator to convert ana and roti into bhori.",
    },
    {
      question: "Do DPS, FDR and Sanchayapatra count?",
      answer:
        "The calculator asks for the principal you hold in them, under bank balances and savings. How to treat profit that has built up but not been paid, and interest in general, are questions for a scholar.",
    },
    {
      question: "Which debts can I subtract?",
      answer:
        "Debts and bills you must pay now, such as an instalment that is due or an unpaid bill. Scholars differ on long-term loans like a home loan, so ask a scholar how much of those to subtract.",
    },
    {
      question: "Which gold and silver price should I use?",
      answer:
        "The price on the day your zakat year completes. BAJUS publishes selling prices per bhori for each purity; what a shop pays when buying back is lower. Which one to use is a question for your scholar.",
    },
    {
      question: "Is this calculation a fatwa?",
      answer:
        "No. It is a general calculation of the widely documented basics: 2.5% of net zakatable wealth above the nisab after a lunar year. Special cases such as personal jewellery, pension and provident funds, shares and property need a scholar’s advice.",
    },
    {
      question: "Is what I enter saved or sent anywhere?",
      answer:
        "Nothing is sent to any server; the calculation runs in your browser. Your recent calculations are kept only on this device, and you can turn that off or clear it.",
    },
  ],
  faqsBn: [
    {
      question: "যাকাত কীভাবে হিসাব করা হয়?",
      answer:
        "আপনার যাকাতযোগ্য সম্পদ (নগদ, ব্যাংকের সঞ্চয়, সোনা, রুপা, ব্যবসার পণ্য ও ফেরত পাওয়ার আশা আছে এমন পাওনা) যোগ করে এখন পরিশোধযোগ্য ঋণ ও বিল বাদ দিন। বাকিটা নিসাবের সমান বা বেশি হলে এবং এক চান্দ্র বছর মালিকানায় থাকলে তার 2.5% (চল্লিশ ভাগের এক ভাগ) যাকাত। উদাহরণ: ৳50,000 নগদ + ৳3,00,000 সঞ্চয় + উদাহরণ হিসেবে প্রতি ভরি ৳2,00,000 দরে 2 ভরি সোনা − ৳50,000 ঋণ = ৳7,00,000, রুপার নিসাবে যাকাত ৳17,500।",
    },
    {
      question: "নিসাব কী?",
      answer:
        "যে পরিমাণ সম্পদ থাকলে যাকাত ফরজ হয়: 7.5 ভরি (87.48 গ্রাম) সোনা বা 52.5 ভরি (612.36 গ্রাম) রুপা, যেখানে 1 ভরি = 11.664 গ্রাম। টাকায় নিসাব = এই ওজন × আজকের প্রতি ভরির দাম।",
    },
    {
      question: "2026–27 (1448 হিজরি) সালে যাকাতের নিসাব কত টাকা?",
      answer:
        "আপনার যাকাতের বছর যেদিন পূর্ণ হয় সেদিনের রুপা বা সোনার দামের ওপর নির্ভর করে, তাই সবার জন্য একটি নির্দিষ্ট অঙ্ক নেই। 1447 বা 1448 হিজরির জন্য ইসলামিক ফাউন্ডেশন বাংলাদেশের কোনো নিসাব-অঙ্ক ঘোষণা আমরা পাইনি (29 অক্টোবর 2026-এ যাচাই)। উদাহরণ হিসেবে রুপার দাম প্রতি ভরি ৳4,000 হলে নিসাব 52.5 × 4,000 = ৳2,10,000; আপনার হিসাবের জন্য বাজুস-এর আজকের দাম লিখুন।",
    },
    {
      question: "রুপার নিসাব নেব, না সোনার?",
      answer:
        "এ নিয়ে আলেমদের মতভেদ আছে। রুপার নিসাব অনেক কম, তাই বেশি মানুষ যাকাত দেন; বাংলাদেশের অনেক যাকাত সংস্থা এটি উৎসাহিত করে। অন্যরা সোনার নিসাব পছন্দ করেন, যাতে অল্প সঞ্চয়ের মানুষ যাকাতদাতা না হন। ক্যালকুলেটরে দুটোই বেছে নেওয়া যায়; নিজের অবস্থার জন্য আস্থাভাজন আলেমের কাছে জেনে নিন।",
    },
    {
      question: "পরার গয়নায় কি যাকাত দিতে হয়?",
      answer:
        "এ নিয়ে আলেমদের মতভেদ আছে: কেউ সব সোনা-রুপার গয়না হিসাবে ধরেন, কেউ স্বাভাবিক ব্যবহারের গয়না বাদ দেন। আলেমের কাছে জেনে নিন। হিসাবে ধরলে ওজন ও আজকের প্রতি ভরির দাম লিখুন; আনা-রতিকে ভরিতে নিতে সোনার দাম ও ভরি ক্যালকুলেটর ব্যবহার করুন।",
    },
    {
      question: "ডিপিএস, এফডিআর ও সঞ্চয়পত্র কি ধরতে হবে?",
      answer:
        "ক্যালকুলেটর এগুলোতে আপনার জমা আসল টাকা “ব্যাংকে জমা ও সঞ্চয়” ঘরে চায়। জমে থাকা কিন্তু এখনো না পাওয়া মুনাফা এবং সুদের বিষয়টি কীভাবে ধরবেন, তা আলেমের কাছে জেনে নিন।",
    },
    {
      question: "কোন ঋণ বাদ দেওয়া যায়?",
      answer:
        "যে ঋণ ও বিল এখনই শোধ করতে হবে, যেমন বকেয়া কিস্তি বা অপরিশোধিত বিল। বাড়ির ঋণের মতো দীর্ঘমেয়াদি ঋণ নিয়ে আলেমদের মতভেদ আছে, তাই কতটা বাদ দেবেন তা আলেমের কাছে জেনে নিন।",
    },
    {
      question: "সোনা ও রুপার কোন দাম ধরব?",
      answer:
        "যাকাতের বছর যেদিন পূর্ণ হয় সেদিনের দাম। বাজুস প্রতিটি মানের প্রতি ভরির বিক্রয়মূল্য প্রকাশ করে; দোকান ফেরত কেনার সময় এর চেয়ে কম দেয়। কোনটি ধরবেন তা আলেমের কাছে জেনে নিন।",
    },
    {
      question: "এই হিসাব কি ফতোয়া?",
      answer:
        "না। এটি বহুল প্রচলিত মূল নিয়মের সাধারণ হিসাব: এক চান্দ্র বছর পর নিসাবের ওপরে নিট যাকাতযোগ্য সম্পদের 2.5%। ব্যবহারের গয়না, পেনশন ও প্রভিডেন্ট ফান্ড, শেয়ার ও জমি-বাড়ির মতো বিশেষ ক্ষেত্রে আলেমের পরামর্শ নিন।",
    },
    {
      question: "আমি যা লিখি তা কি কোথাও সেভ বা পাঠানো হয়?",
      answer:
        "কোনো সার্ভারে কিছু পাঠানো হয় না; হিসাব আপনার ব্রাউজারেই হয়। সাম্প্রতিক হিসাবগুলো শুধু এই ডিভাইসে থাকে, চাইলে বন্ধ বা মুছে ফেলতে পারেন।",
    },
  ],
};
