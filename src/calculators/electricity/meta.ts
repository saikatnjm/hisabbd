import type { CalculatorMeta } from "@/calculators/types";

export const electricityCalculator: CalculatorMeta = {
  slug: "electricity-bill-calculator",
  name: "Electricity Bill Calculator",
  nameBn: "বিদ্যুৎ বিল ক্যালকুলেটর",
  category: "everyday",
  icon: "plug",
  summary:
    "Work out your home electricity bill from units or meter readings, slab by slab, with BERC’s June 2026 rates, demand charge, meter rent and VAT, or the units a prepaid recharge buys.",
  summaryBn:
    "ইউনিট বা মিটার রিডিং থেকে বাসার বিদ্যুৎ বিল হিসাব করুন — বিইআরসির জুন 2026-এর ধাপভিত্তিক দাম, ডিমান্ড চার্জ, মিটার ভাড়া ও ভ্যাটসহ; প্রিপেইড রিচার্জে কত ইউনিট পাবেন তা-ও।",
  keywords: [
    "electricity bill calculator bangladesh",
    "electricity bill calculator",
    "electric bill calculator bd",
    "bidyut bill calculator",
    "bidyut bill hisab",
    "electricity unit price bangladesh 2026",
    "per unit electricity price bd",
    "berc tariff 2026",
    "lt-a residential tariff",
    "prepaid meter bill calculation",
    "prepaid meter recharge units",
    "desco bill calculator",
    "dpdc bill calculator",
    "palli bidyut bill calculator",
    "nesco bill",
    "wzpdcl bill",
    "demand charge",
    "meter rent",
    "lifeline tariff",
    "বিদ্যুৎ বিল হিসাব",
    "বিদ্যুৎ বিল ক্যালকুলেটর",
    "বিদ্যুৎ বিল",
    "ইউনিট প্রতি বিদ্যুতের দাম 2026",
    "বিদ্যুতের দাম কত",
    "বিদ্যুতের নতুন দাম",
    "প্রিপেইড মিটার বিল হিসাব",
    "প্রিপেইড মিটার রিচার্জ",
    "ডিমান্ড চার্জ",
    "মিটার ভাড়া",
    "লাইফলাইন",
    "পল্লী বিদ্যুৎ বিল",
    "ডেসকো বিল",
    "ডিপিডিসি বিল",
  ],
  seo: {
    title: "Electricity Bill Calculator Bangladesh: 2026 Unit Price",
    description:
      "Work out your DESCO, DPDC or Palli Bidyut bill from units or meter readings, slab by slab, with BERC’s June 2026 per-unit rates, demand charge and VAT.",
  },
  seoBn: {
    title: "বিদ্যুৎ বিল হিসাব: ইউনিট প্রতি বিদ্যুতের দাম 2026",
    description:
      "বিদ্যুৎ বিল ক্যালকুলেটর: ইউনিট বা মিটার রিডিং দিন, বিইআরসির জুন 2026-এর ধাপভিত্তিক দাম, ডিমান্ড চার্জ, মিটার ভাড়া ও ভ্যাটসহ বিল দেখুন। প্রিপেইড রিচার্জে কত ইউনিট, তা-ও।",
  },
  addedOn: "2026-10-29",
  updatedOn: "2026-10-29",
  related: ["vat-calculator", "percentage-calculator", "salary-calculator"],
  faqs: [
    {
      question: "What is the electricity price per unit in Bangladesh in 2026?",
      answer:
        "For homes on a low-tension meter (BERC category LT-A), from the June 2026 billing month: lifeline (a month of 0–50 units) ৳4.63; 0–75 units ৳5.26; 76–200 ৳8.50; 201–300 ৳9.10; 301–400 ৳9.62; 401–600 ৳15.01; above 600 ৳17.35 per unit (kWh), before VAT. These come from BERC’s order of 3 June 2026 as revised on 4 June 2026, and apply to BPDB, Palli Bidyut (BREB), DPDC, DESCO, WZPDCL and NESCO.",
    },
    {
      question: "How is the electricity bill calculated?",
      answer:
        "Slab by slab: each rate applies only to the units inside its slab. For 200 units: 75 × ৳5.26 = ৳394.50 plus 125 × ৳8.50 = ৳1,062.50, so the energy charge is ৳1,457. Add the demand charge (2 kW × ৳42 = ৳84) and meter rent (৳40) to get ৳1,581, then 5% VAT (৳79.05): ৳1,660.05 in all on a postpaid meter.",
    },
    {
      question: "What is the lifeline rate and who gets it?",
      answer:
        "If your whole month’s use is 50 units or less, every unit is billed at the lifeline rate of ৳4.63, so 45 units cost ৳208.35 before other charges. BERC gives the lifeline rate to no one else: at 51 units the whole month moves to the slabs, and 51 × ৳5.26 = ৳268.26.",
    },
    {
      question: "What is the demand charge on an electricity bill?",
      answer:
        "A fixed monthly charge of ৳42 per kilowatt of your sanctioned (approved) load, whatever you use. With a 2 kW sanctioned load it is ৳84 a month; with 5 kW, ৳210. Your sanctioned load is printed on your bill or prepaid meter card. BERC left the demand charge unchanged in June 2026.",
    },
    {
      question: "How much is the electricity meter rent?",
      answer:
        "BERC’s 2026 order keeps the existing meter-rent rules but does not state an amount. DPDC said on 31 August 2026 that it charges ৳40 a month for a single-phase and ৳250 for a three-phase meter it supplied, and nothing if you bought your own meter. Other companies may differ, so check your bill and edit the figure in the calculator.",
    },
    {
      question: "Is VAT charged on the electricity bill?",
      answer:
        "Yes. BERC says VAT applies at the rate the government sets. Distribution companies and news reports give it as 5%, charged on the energy charge, demand charge and meter rent. In the example above, 5% of ৳1,581 is ৳79.05.",
    },
    {
      question: "How many units do I get for a ৳1,000 prepaid recharge?",
      answer:
        "With a 2 kW single-phase prepaid meter, if ৳1,000 is all you recharge that month, about 126.58 units: the meter first takes the month’s demand charge (৳84) and meter rent (৳40), and the bill for 126.58 units with 5% VAT and the 0.5% rebate comes to exactly ৳1,000. Choose “Recharge amount” in the calculator for any amount.",
    },
    {
      question: "What is the prepaid meter rebate?",
      answer:
        "BERC gives prepaid customers a rebate of 0.5% on the net bill, excluding VAT. For 200 units with 2 kW and a single-phase meter, that is 0.5% of ৳1,581 = ৳7.91, so the prepaid total is ৳1,652.14 instead of ৳1,660.05.",
    },
    {
      question: "Why is my actual bill different from the calculator?",
      answer:
        "Your company may add a 5% late-payment surcharge, arrears or adjustments, round the bill to whole Taka, charge a different meter rent, or split a billing period that spans a rate change. Prepaid meters also deduct the month’s fixed charges at the first recharge. Use your bill’s figures in “Edit tariff” to match it.",
    },
    {
      question: "When did the new electricity rates start?",
      answer:
        "From the June 2026 billing month. BERC raised retail tariffs on 3 June 2026, then on 4 June withdrew the increase for the lifeline (kept at ৳4.63) and the first step, 0–75 units (kept at ৳5.26). The other residential rates and the demand charge in this calculator are from those orders, checked on 29 October 2026.",
    },
  ],
  faqsBn: [
    {
      question: "2026 সালে ইউনিট প্রতি বিদ্যুতের দাম কত?",
      answer:
        "নিম্নচাপের আবাসিক গ্রাহকদের (বিইআরসির এলটি-এ শ্রেণি) জন্য জুন 2026 বিল মাস থেকে: লাইফলাইন (মাসে 0–50 ইউনিট) ৳4.63; 0–75 ইউনিট ৳5.26; 76–200 ৳8.50; 201–300 ৳9.10; 301–400 ৳9.62; 401–600 ৳15.01; 600-এর ওপরে ৳17.35 প্রতি ইউনিট (কিলোওয়াট-ঘণ্টা), ভ্যাট ছাড়া। হারগুলো বিইআরসির 3 জুন 2026-এর আদেশ ও 4 জুনের সংশোধনী থেকে নেওয়া; বিউবো, পল্লী বিদ্যুৎ, ডিপিডিসি, ডেসকো, ওজোপাডিকো ও নেসকো সবার জন্য প্রযোজ্য।",
    },
    {
      question: "বিদ্যুৎ বিল কীভাবে হিসাব করা হয়?",
      answer:
        "ধাপে ধাপে: প্রতিটি হার শুধু সেই ধাপের ভেতরের ইউনিটে বসে। 200 ইউনিটে: 75 × ৳5.26 = ৳394.50, আর 125 × ৳8.50 = ৳1,062.50, মোট এনার্জি চার্জ ৳1,457। এর সঙ্গে ডিমান্ড চার্জ (2 কিলোওয়াট × ৳42 = ৳84) ও মিটার ভাড়া (৳40) যোগে ৳1,581, তারপর 5% ভ্যাট (৳79.05) — পোস্টপেইড মিটারে মোট ৳1,660.05।",
    },
    {
      question: "লাইফলাইন রেট কী, কারা পান?",
      answer:
        "মাসের মোট ব্যবহার 50 ইউনিট বা তার কম হলে সব ইউনিটে লাইফলাইন রেট ৳4.63 বসে, তাই 45 ইউনিটে অন্যান্য চার্জ বাদে ৳208.35। বিইআরসি অন্য কাউকে এই রেট দেয় না: 51 ইউনিট হলেই পুরো মাস ধাপের হিসাবে যায়, 51 × ৳5.26 = ৳268.26।",
    },
    {
      question: "বিদ্যুৎ বিলে ডিমান্ড চার্জ কী?",
      answer:
        "অনুমোদিত লোডের প্রতি কিলোওয়াটে মাসে ৳42 — ব্যবহার যা-ই হোক, এটি নির্দিষ্ট। 2 কিলোওয়াট অনুমোদিত লোডে মাসে ৳84; 5 কিলোওয়াটে ৳210। অনুমোদিত লোড বিলের কাগজে বা প্রিপেইড মিটার কার্ডে লেখা থাকে। জুন 2026-এ বিইআরসি ডিমান্ড চার্জ বদলায়নি।",
    },
    {
      question: "বিদ্যুতের মিটার ভাড়া কত?",
      answer:
        "বিইআরসির 2026-এর আদেশে মিটার ভাড়ার প্রচলিত নিয়ম বহাল রাখা হয়েছে, কিন্তু অঙ্ক বলা নেই। ডিপিডিসি 31 আগস্ট 2026-এ জানিয়েছে, তাদের দেওয়া সিঙ্গেল ফেজ মিটারে মাসে ৳40 আর থ্রি ফেজে ৳250; নিজে মিটার কিনলে ভাড়া নেই। অন্য কোম্পানিতে ভিন্ন হতে পারে — বিল দেখে ক্যালকুলেটরে অঙ্কটি বদলে নিন।",
    },
    {
      question: "বিদ্যুৎ বিলে কি ভ্যাট দিতে হয়?",
      answer:
        "হ্যাঁ। বিইআরসি বলেছে সরকার-নির্ধারিত হারে ভ্যাট বসবে। বিতরণ কোম্পানি ও সংবাদ প্রতিবেদন অনুযায়ী হার 5%, এনার্জি চার্জ, ডিমান্ড চার্জ ও মিটার ভাড়ার ওপর। ওপরের উদাহরণে ৳1,581-এর 5% = ৳79.05।",
    },
    {
      question: "প্রিপেইড মিটারে ৳1,000 রিচার্জে কত ইউনিট পাব?",
      answer:
        "2 কিলোওয়াটের সিঙ্গেল ফেজ প্রিপেইড মিটারে মাসে শুধু ৳1,000 রিচার্জ করলে প্রায় 126.58 ইউনিট: মিটার আগে মাসের ডিমান্ড চার্জ (৳84) ও মিটার ভাড়া (৳40) কাটে, আর 126.58 ইউনিটের বিল 5% ভ্যাট ও 0.5% রিবেটসহ ঠিক ৳1,000 হয়। যেকোনো অঙ্কের জন্য ক্যালকুলেটরে “রিচার্জের টাকা” বেছে নিন।",
    },
    {
      question: "প্রিপেইড মিটারে রিবেট কত?",
      answer:
        "বিইআরসি প্রিপেইড গ্রাহকদের ভ্যাট ছাড়া নিট বিলের ওপর 0.5% রিবেট দেয়। 2 কিলোওয়াট, সিঙ্গেল ফেজ, 200 ইউনিটে তা ৳1,581-এর 0.5% = ৳7.91, তাই প্রিপেইডে মোট ৳1,652.14, পোস্টপেইডের ৳1,660.05-এর বদলে।",
    },
    {
      question: "আমার আসল বিল ক্যালকুলেটরের সঙ্গে মেলে না কেন?",
      answer:
        "আপনার কোম্পানি 5% বিলম্ব মাশুল, বকেয়া বা সমন্বয় যোগ করতে পারে, বিল পূর্ণ টাকায় রাউন্ড করতে পারে, ভিন্ন মিটার ভাড়া নিতে পারে, বা দাম বদলের মাসে বিল ভাগ করতে পারে। প্রিপেইড মিটার মাসের প্রথম রিচার্জে নির্দিষ্ট চার্জগুলো কাটে। মেলাতে “ট্যারিফ বদলান” অংশে বিলের অঙ্কগুলো দিন।",
    },
    {
      question: "বিদ্যুতের নতুন দাম কবে থেকে কার্যকর?",
      answer:
        "জুন 2026 বিল মাস থেকে। বিইআরসি 3 জুন 2026-এ খুচরা দাম বাড়ায়, তারপর 4 জুন লাইফলাইন (৳4.63 বহাল) ও প্রথম ধাপের (0–75 ইউনিট, ৳5.26 বহাল) বাড়তি দাম প্রত্যাহার করে। এই ক্যালকুলেটরের অন্য আবাসিক হার ও ডিমান্ড চার্জ ওই আদেশগুলো থেকে নেওয়া, 29 অক্টোবর 2026-এ যাচাই করা।",
    },
  ],
};
