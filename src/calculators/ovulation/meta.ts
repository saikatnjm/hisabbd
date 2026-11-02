import type { CalculatorMeta } from "@/calculators/types";

export const ovulationCalculator: CalculatorMeta = {
  slug: "ovulation-calculator",
  name: "Ovulation Calculator: Fertile Days and Next Period",
  nameBn: "ওভুলেশন ক্যালকুলেটর: উর্বর সময় ও পরের মাসিক",
  category: "health",
  icon: "calendar-day",
  summary:
    "From the first day of your last period and your cycle length, see the days you are likely to ovulate and your next three period dates.",
  summaryBn:
    "শেষ মাসিকের প্রথম দিন আর চক্রের দৈর্ঘ্য দিয়ে দেখুন কোন দিনগুলোতে ডিম্বস্ফোটনের (ওভুলেশন) সম্ভাবনা বেশি, আর পরের তিনটি মাসিকের তারিখ।",
  keywords: [
    "ovulation calculator",
    "fertile days calculator",
    "fertile window",
    "next period date calculator",
    "period calculator",
    "menstrual cycle calculator",
    "ovulation calculator bangla",
    "ওভুলেশন ক্যালকুলেটর",
    "ডিম্বস্ফোটন",
    "উর্বর সময়",
    "পরের মাসিক কবে",
    "মাসিকের তারিখ হিসাব",
    "মাসিক চক্র",
    "গর্ভধারণের সম্ভাব্য সময়",
  ],
  seo: {
    title: "Ovulation Calculator: Fertile Days and Next Period Date",
    description:
      "See the days you are likely to ovulate (10–16 days before your next period, per the NHS) and your next three period dates. Private: nothing is saved.",
  },
  seoBn: {
    title: "ওভুলেশন ক্যালকুলেটর: উর্বর সময় ও পরের মাসিক কবে",
    description:
      "শেষ মাসিক আর চক্রের দৈর্ঘ্য দিয়ে ডিম্বস্ফোটনের সম্ভাব্য দিন (এনএইচএসের মতে পরের মাসিকের 10–16 দিন আগে) আর পরের তিনটি মাসিকের তারিখ দেখুন। কিছুই জমা থাকে না।",
  },
  addedOn: "2026-11-02",
  related: ["pregnancy-calculator", "date-difference-calculator", "temperature-converter"],
  faqs: [
    {
      question: "When do I ovulate?",
      answer:
        "The NHS says ovulation happens around 10 to 16 days before the next period in most women. With a 28-day cycle that is days 13 to 19, around day 14. With a 20 October period and a 28-day cycle, the likely days are 1 to 7 November.",
    },
    {
      question: "When am I most likely to get pregnant?",
      answer:
        "Around ovulation. Sperm can survive up to 7 days, so sex in the days before ovulation can also lead to pregnancy. The NHS suggests sex every 2 to 3 days if you are trying for a baby, rather than aiming for one day.",
    },
    {
      question: "How is my next period date worked out?",
      answer: "First day of your last period + your cycle length. A period on 20 October with a 28-day cycle means the next is due on 17 November.",
    },
    {
      question: "What cycle length is normal?",
      answer:
        "The NHS says cycles of 21 to 35 days are normal. If yours is outside that, or changes a lot from month to month, the dates here are less reliable; talk to a doctor if your periods are very irregular.",
    },
    {
      question: "Can I use this as contraception?",
      answer:
        "No. Ovulation can come earlier or later than expected, and this is only an estimate from dates. Use a reliable method of contraception and ask a doctor or family planning service.",
    },
    {
      question: "Is what I enter saved?",
      answer:
        "No. The dates stay on your phone or computer and are never sent anywhere, and this calculator keeps no list of recent calculations.",
    },
  ],
  faqsBn: [
    {
      question: "ডিম্বস্ফোটন (ওভুলেশন) কবে হয়?",
      answer:
        "এনএইচএসের মতে বেশিরভাগ নারীর ক্ষেত্রে পরের মাসিকের মোটামুটি 10 থেকে 16 দিন আগে। 28 দিনের চক্রে তা 13 থেকে 19তম দিন, 14তম দিনের আশপাশে। 20 অক্টোবর মাসিক আর 28 দিনের চক্র হলে সম্ভাব্য দিন 1 থেকে 7 নভেম্বর।",
    },
    {
      question: "কখন গর্ভধারণের সম্ভাবনা সবচেয়ে বেশি?",
      answer:
        "ডিম্বস্ফোটনের আশপাশে। শুক্রাণু 7 দিন পর্যন্ত বাঁচতে পারে, তাই ডিম্বস্ফোটনের আগের কয়েক দিনের মিলনেও গর্ভধারণ হতে পারে। সন্তান নিতে চাইলে এনএইচএস একটি নির্দিষ্ট দিন না ধরে প্রতি 2–3 দিন অন্তর মিলনের পরামর্শ দেয়।",
    },
    {
      question: "পরের মাসিকের তারিখ কীভাবে বের হয়?",
      answer: "শেষ মাসিকের প্রথম দিন + চক্রের দৈর্ঘ্য। 20 অক্টোবর মাসিক আর 28 দিনের চক্র হলে পরের মাসিক 17 নভেম্বর।",
    },
    {
      question: "চক্রের দৈর্ঘ্য কত হলে স্বাভাবিক?",
      answer:
        "এনএইচএসের মতে 21 থেকে 35 দিনের চক্র স্বাভাবিক। এর বাইরে হলে বা মাসে মাসে অনেক বদলালে এখানের তারিখ কম নির্ভরযোগ্য; মাসিক খুব অনিয়মিত হলে ডাক্তারের সঙ্গে কথা বলুন।",
    },
    {
      question: "এটা কি জন্মনিয়ন্ত্রণ হিসেবে ব্যবহার করা যায়?",
      answer:
        "না। ডিম্বস্ফোটন প্রত্যাশার আগে বা পরে হতে পারে, আর এটি শুধু তারিখের আনুমানিক হিসাব। নির্ভরযোগ্য জন্মনিয়ন্ত্রণ পদ্ধতি ব্যবহার করুন, আর ডাক্তার বা পরিবার পরিকল্পনা কেন্দ্রের পরামর্শ নিন।",
    },
    {
      question: "আমার দেওয়া তথ্য কি জমা থাকে?",
      answer: "না। তারিখগুলো আপনার ফোন বা কম্পিউটারেই থাকে, কোথাও পাঠানো হয় না, আর এই ক্যালকুলেটর কোনো হিসাবের তালিকাও রাখে না।",
    },
  ],
};
