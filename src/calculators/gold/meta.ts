import type { CalculatorMeta } from "@/calculators/types";

/*
 * Category "everyday", not "finance": people use this when buying or selling
 * jewellery and converting bhori/ana/roti to grams, the same kind of
 * household unit conversion as the Land Area calculator (also "everyday").
 * The finance angle (zakat on gold) lives in the Zakat Calculator, which is
 * linked as related.
 */
export const goldCalculator: CalculatorMeta = {
  slug: "gold-calculator",
  name: "Gold Price & Bhori Calculator",
  nameBn: "সোনার দাম ও ভরি ক্যালকুলেটর",
  category: "everyday",
  icon: "gold-bar",
  summary:
    "Work out the price of gold from its weight in bhori, ana, roti or grams and today’s price per bhori, with making charge, or convert bhori to grams.",
  summaryBn:
    "ভরি, আনা, রতি বা গ্রামে ওজন আর আজকের প্রতি ভরির দাম দিয়ে মজুরিসহ সোনার দাম বের করুন, অথবা ভরি থেকে গ্রামে রূপান্তর করুন।",
  keywords: [
    "gold price calculator bangladesh",
    "gold price calculator",
    "gold calculator",
    "gold price bd",
    "gold price per bhori",
    "bhori to gram",
    "gram to bhori",
    "vori to gram",
    "1 bhori gold in gram",
    "tola to gram",
    "ana roti point",
    "22 carat gold price",
    "21 carat",
    "18 carat",
    "making charge",
    "bajus gold price",
    "sonar dam",
    "sonar dam koto",
    "vori ana roti",
    "ek vori sona koto gram",
    "সোনার দাম",
    "সোনার দাম ভরি",
    "আজকের সোনার দাম",
    "সোনার দাম হিসাব",
    "এক ভরি সোনা কত গ্রাম",
    "ভরি আনা রতি",
    "ভরি থেকে গ্রাম",
    "গ্রাম থেকে ভরি",
    "আনা রতি পয়েন্ট",
    "তোলা",
    "স্বর্ণের দাম",
    "গয়নার দাম",
    "মজুরি",
    "২২ ক্যারেট",
    "সনাতন পদ্ধতি সোনা",
    "বাজুস",
  ],
  seo: {
    title: "Gold Price Calculator BD: Bhori, Ana, Roti to Gram",
    description:
      "Find the price of gold in Taka from bhori, ana, roti or grams and today’s BAJUS rate, plus making charge. 1 bhori = 11.664 g. Free and private.",
  },
  seoBn: {
    title: "সোনার দাম ক্যালকুলেটর: ভরি, আনা, রতি ও গ্রাম হিসাব",
    description:
      "ভরি, আনা, রতি বা গ্রামে ওজন আর বাজুস-এর আজকের দাম দিয়ে মজুরিসহ সোনার দাম হিসাব করুন। এক ভরি সোনা = 11.664 গ্রাম। ফ্রি, তথ্য আপনার ফোনেই থাকে।",
  },
  addedOn: "2026-10-29",
  updatedOn: "2026-10-29",
  related: ["zakat-calculator", "percentage-calculator", "vat-calculator"],
  faqs: [
    {
      question: "How many grams is 1 bhori of gold?",
      answer:
        "1 bhori (also called a tola or vori) is 11.664 grams in Bangladesh, the weight BAJUS quotes every gold price against. 1 bhori = 16 ana = 96 roti = 960 point.",
    },
    {
      question: "How many grams are 1 ana, 1 roti and 1 point?",
      answer:
        "1 ana = 11.664 ÷ 16 = 0.729 g. 1 roti = 0.729 ÷ 6 = 0.1215 g. 1 point = 0.1215 ÷ 10 = 0.01215 g. 1 ana = 6 roti and 1 roti = 10 point.",
    },
    {
      question: "How do I convert grams to bhori, ana and roti?",
      answer:
        "Divide the grams by 11.664 to get bhori. 10 g = 0.8573 bhori, which jewellers write as 13 ana 4 roti 3.05 point. The other way, 2 bhori 5 ana 3 roti = 2.34375 bhori = 27.3375 g.",
    },
    {
      question: "How is the price of gold jewellery calculated?",
      answer:
        "Price = weight in bhori × price per bhori, plus the making charge, plus VAT only if your bill adds it. For example, 1 bhori 8 ana (1.5 bhori) at an example price of ৳2,20,000 a bhori is ৳3,30,000; an 8% making charge adds ৳26,400, for ৳3,56,400 in total.",
    },
    {
      question: "What is today’s gold price in Bangladesh?",
      answer:
        "We don’t fill one in, because BAJUS (the Bangladesh Jewellers Association) changes it often, sometimes several times a month. Check today’s price per bhori at bajus.org and enter the price for your gold’s purity.",
    },
    {
      question: "What is the difference between 22K, 21K, 18K and traditional gold?",
      answer:
        "Carat measures purity out of 24: 22K is about 91.7% gold, 21K 87.5% and 18K 75%. Traditional (sanatan) is the lowest of the four grades BAJUS prices. Each has its own price per bhori, so choose the purity and enter that price.",
    },
    {
      question: "Is VAT included in the BAJUS gold price?",
      answer:
        "Yes, as of our check on 29 October 2026. The FY2026-27 budget replaced the 5% VAT on gold with a fixed ৳2,500 per bhori (Finance Bill passed on 29 June 2026), and BAJUS has published VAT-inclusive prices since 18 June 2026, saying shops may not collect VAT separately. If your bill still adds VAT, choose the matching VAT option.",
    },
    {
      question: "What is the making charge (majuri)?",
      answer:
        "It is what the jeweller charges for making the piece, on top of the gold. It depends on the design and the shop, so nothing is filled in: enter it as a percentage of the gold price or as Taka per bhori, or leave it blank.",
    },
    {
      question: "Why does a shop pay less when I sell old gold?",
      answer:
        "Shops usually deduct a share for wastage (khad) and their margin when they buy gold back. That deduction varies by shop and is not part of this calculator; ask the shop before you sell.",
    },
    {
      question: "Is what I enter saved or sent anywhere?",
      answer:
        "Nothing is sent to any server; the calculation runs in your browser. Your recent calculations are kept only on this device, and you can turn that off or clear it.",
    },
  ],
  faqsBn: [
    {
      question: "এক ভরি সোনা কত গ্রাম?",
      answer:
        "বাংলাদেশে 1 ভরি (তোলা) = 11.664 গ্রাম; বাজুস প্রতিটি দাম এই ওজনের হিসাবেই দেয়। 1 ভরি = 16 আনা = 96 রতি = 960 পয়েন্ট।",
    },
    {
      question: "1 আনা, 1 রতি ও 1 পয়েন্ট কত গ্রাম?",
      answer:
        "1 আনা = 11.664 ÷ 16 = 0.729 গ্রাম। 1 রতি = 0.729 ÷ 6 = 0.1215 গ্রাম। 1 পয়েন্ট = 0.1215 ÷ 10 = 0.01215 গ্রাম। 1 আনা = 6 রতি, 1 রতি = 10 পয়েন্ট।",
    },
    {
      question: "গ্রাম থেকে ভরি, আনা, রতি কীভাবে বের করব?",
      answer:
        "গ্রামকে 11.664 দিয়ে ভাগ করলে ভরি পাবেন। 10 গ্রাম = 0.8573 ভরি, যা স্বর্ণকাররা লেখেন 13 আনা 4 রতি 3.05 পয়েন্ট। উল্টো দিকে, 2 ভরি 5 আনা 3 রতি = 2.34375 ভরি = 27.3375 গ্রাম।",
    },
    {
      question: "গয়নার দাম কীভাবে হিসাব হয়?",
      answer:
        "দাম = ভরিতে ওজন × প্রতি ভরির দাম, তার সাথে মজুরি, আর বিলে আলাদা ভ্যাট থাকলে শুধু তখনই ভ্যাট। যেমন, উদাহরণ হিসেবে প্রতি ভরি ৳2,20,000 ধরলে 1 ভরি 8 আনা (1.5 ভরি) = ৳3,30,000; 8% মজুরি ৳26,400 যোগ করে মোট ৳3,56,400।",
    },
    {
      question: "আজ বাংলাদেশে সোনার দাম কত?",
      answer:
        "আমরা কোনো দাম বসিয়ে রাখি না, কারণ বাজুস (বাংলাদেশ জুয়েলার্স সমিতি) দাম ঘন ঘন বদলায়, কখনো মাসে কয়েকবার। bajus.org-এ আজকের প্রতি ভরির দাম দেখে আপনার সোনার মানের দামটি লিখুন।",
    },
    {
      question: "22, 21, 18 ক্যারেট আর সনাতন সোনার পার্থক্য কী?",
      answer:
        "ক্যারেট হলো 24 ভাগের কত ভাগ খাঁটি সোনা: 22 ক্যারেটে প্রায় 91.7%, 21 ক্যারেটে 87.5%, 18 ক্যারেটে 75%। বাজুস-এর চারটি মানের মধ্যে সনাতন পদ্ধতি সবচেয়ে নিচের। প্রতিটির প্রতি ভরির দাম আলাদা, তাই মান বেছে সেই দামটি লিখুন।",
    },
    {
      question: "বাজুস-এর সোনার দামে কি ভ্যাট ধরা থাকে?",
      answer:
        "হ্যাঁ, 29 অক্টোবর 2026-এ আমাদের যাচাই অনুযায়ী। 2026-27 অর্থবছরের বাজেটে সোনায় 5% ভ্যাটের বদলে প্রতি ভরি নির্দিষ্ট ৳2,500 ভ্যাট করা হয় (অর্থ বিল পাস 29 জুন 2026), আর 18 জুন 2026 থেকে বাজুস ভ্যাটসহ দাম প্রকাশ করছে এবং বলেছে দোকান আলাদা করে ভ্যাট নিতে পারবে না। আপনার বিলে তবু ভ্যাট যোগ থাকলে মিলিয়ে ভ্যাটের অপশন বেছে নিন।",
    },
    {
      question: "মজুরি কী?",
      answer:
        "গয়না বানানোর জন্য স্বর্ণকার সোনার দামের ওপরে যে টাকা নেন। এটি ডিজাইন ও দোকানভেদে আলাদা, তাই আগে থেকে কিছু বসানো নেই: সোনার দামের শতকরা হারে বা প্রতি ভরিতে টাকায় লিখুন, অথবা ফাঁকা রাখুন।",
    },
    {
      question: "পুরোনো সোনা বিক্রি করলে দোকান কম দেয় কেন?",
      answer:
        "সোনা ফেরত কেনার সময় দোকান সাধারণত খাদ ও নিজের লাভের জন্য একটি অংশ কেটে রাখে। এই কাটা অংশ দোকানভেদে আলাদা এবং এই ক্যালকুলেটরে ধরা নেই; বিক্রির আগে দোকানে জেনে নিন।",
    },
    {
      question: "আমি যা লিখি তা কি কোথাও সেভ বা পাঠানো হয়?",
      answer:
        "কোনো সার্ভারে কিছু পাঠানো হয় না; হিসাব আপনার ব্রাউজারেই হয়। সাম্প্রতিক হিসাবগুলো শুধু এই ডিভাইসে থাকে, চাইলে বন্ধ বা মুছে ফেলতে পারেন।",
    },
  ],
};
