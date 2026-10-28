import type { CalculatorMeta } from "@/calculators/types";

export const banglaDateCalculator: CalculatorMeta = {
  slug: "bangla-date-converter",
  name: "Bangla Date Converter",
  nameBn: "বাংলা তারিখ রূপান্তর",
  category: "date-time",
  icon: "calendar-day",
  summary: "See today’s Bangla date and convert any English date to Bangla (Bangabda) or back.",
  summaryBn: "আজকের বাংলা তারিখ দেখুন, আর যেকোনো ইংরেজি তারিখকে বাংলা (বঙ্গাব্দ) তারিখে বা উল্টোভাবে রূপান্তর করুন।",
  keywords: [
    "aajker bangla tarikh",
    "ajker bangla tarikh",
    "আজকের বাংলা তারিখ",
    "বাংলা তারিখ",
    "বঙ্গাব্দ",
    "bangla date today",
    "bangla date",
    "english to bangla date",
    "bangla to english date",
    "bangla calendar",
    "বাংলা ক্যালেন্ডার",
    "বাংলা সন",
    "পহেলা বৈশাখ",
    "pohela boishakh",
    "bongabdo",
    "bangabda",
    "bengali date",
    "bengali calendar",
    "bangla mash",
    "বাংলা মাস",
    "ঋতু",
  ],
  seo: {
    title: "Bangla Date Today: English to Bangla Date Converter",
    description:
      "See today’s Bangla date (Bangabda) and convert any English date to Bangla or back, using Bangladesh’s revised Bangla calendar. Month, season and weekday included.",
  },
  seoBn: {
    title: "আজকের বাংলা তারিখ: ইংরেজি থেকে বাংলা তারিখ রূপান্তর",
    description:
      "আজকের বাংলা তারিখ (বঙ্গাব্দ) দেখুন, আর বাংলাদেশের সংশোধিত বাংলা ক্যালেন্ডার অনুযায়ী যেকোনো ইংরেজি তারিখ বাংলায় বা বাংলা তারিখ ইংরেজিতে রূপান্তর করুন। মাস, ঋতু ও বারসহ।",
  },
  addedOn: "2026-10-28",
  updatedOn: "2026-10-28",
  related: ["date-difference-calculator", "age-calculator"],
  faqs: [
    {
      question: "What is today’s Bangla date?",
      answer:
        "The converter shows it at the top of the page, worked out from your device’s date. For example, 28 October 2026 is 12 Kartik 1433 (১২ কার্তিক ১৪৩৩ বঙ্গাব্দ), a Wednesday in Hemonto (late autumn).",
    },
    {
      question: "Which Bangla calendar does this use?",
      answer:
        "The revised Bangla calendar used officially in Bangladesh, as revised by Bangla Academy in 2019. The year starts on 14 April, the first six months have 31 days, Kartik to Magh and Chaitra have 30, and Falgun has 29 (30 in a leap year).",
    },
    {
      question: "How do I work out the Bangla year (Bangabda)?",
      answer:
        "Subtract 593 from the English year on or after 14 April, or 594 before it. So 14 April 2026 starts 1433, and 1 January 2027 is still in 1433.",
    },
    {
      question: "When is Pohela Boishakh?",
      answer:
        "Always on 14 April in Bangladesh. 1 Boishakh is the first day of the Bangla year, so 14 April 2027 is 1 Boishakh 1434.",
    },
    {
      question: "What are the Bangla dates of the national days?",
      answer:
        "The 2019 revision fixed them: 21 February is always 8 Falgun, 26 March is 12 Chaitra and 16 December is 1 Poush, the same Bangla dates as in 1952 and 1971.",
    },
    {
      question: "How are leap years handled?",
      answer:
        "Falgun gets a 30th day in the Bangla year whose Falgun contains 29 February. Falgun 1434 runs from 14 February to 14 March 2028, so it has 30 days, and 29 February 2028 is 16 Falgun 1434.",
    },
    {
      question: "Why is my Bangla date different from a West Bengal calendar?",
      answer:
        "West Bengal and other Indian states follow the traditional calendar, whose month lengths change from year to year with astronomical calculations. Bangladesh uses fixed month lengths, so the two can show different dates for the same day.",
    },
    {
      question: "Why is the date shown in Bangla digits?",
      answer:
        "Bangla dates are usually written with Bangla digits, like ১২ কার্তিক ১৪৩৩. The converter also shows the same date with English digits (12 Kartik 1433) for forms and messages.",
    },
    {
      question: "What are the six seasons?",
      answer:
        "Two months each, starting from Boishakh: Grishma (summer), Borsha (monsoon), Shorot (autumn), Hemonto (late autumn), Sheet (winter) and Boshonto (spring).",
    },
    {
      question: "Which dates can I convert?",
      answer:
        "Any date from 1 Boishakh 1 (14 April 594) to 30 Chaitra 8000 (13 April 8594). Dates long before 2019 are shown by today’s rules, so they can be a day off from what was printed at the time.",
    },
  ],
  faqsBn: [
    {
      question: "আজকের বাংলা তারিখ কত?",
      answer:
        "পাতার একদম ওপরে আপনার ডিভাইসের তারিখ থেকে তা দেখানো হয়। যেমন, 28 অক্টোবর 2026 হলো ১২ কার্তিক ১৪৩৩ বঙ্গাব্দ, বুধবার, হেমন্ত ঋতু।",
    },
    {
      question: "এখানে কোন বাংলা ক্যালেন্ডার ব্যবহার করা হয়?",
      answer:
        "বাংলাদেশে সরকারিভাবে প্রচলিত সংশোধিত বাংলা ক্যালেন্ডার, যা বাংলা একাডেমি 2019 সালে সংশোধন করে। বছর শুরু হয় 14 এপ্রিল, প্রথম ছয় মাস 31 দিনের, কার্তিক থেকে মাঘ আর চৈত্র 30 দিনের, আর ফাল্গুন 29 দিনের (অধিবর্ষে 30 দিন)।",
    },
    {
      question: "বঙ্গাব্দ কীভাবে বের করব?",
      answer:
        "14 এপ্রিল বা তার পরে ইংরেজি সাল থেকে 593 বিয়োগ করুন, তার আগে হলে 594। তাই 14 এপ্রিল 2026 থেকে 1433 শুরু, আর 1 জানুয়ারি 2027-ও 1433 বঙ্গাব্দেই পড়ে।",
    },
    {
      question: "পহেলা বৈশাখ কবে?",
      answer:
        "বাংলাদেশে প্রতি বছর 14 এপ্রিল। ১ বৈশাখ বাংলা বছরের প্রথম দিন, তাই 14 এপ্রিল 2027 হলো ১ বৈশাখ ১৪৩৪।",
    },
    {
      question: "জাতীয় দিবসগুলোর বাংলা তারিখ কী?",
      answer:
        "2019 সালের সংশোধনে এগুলো স্থির করা হয়েছে: 21 ফেব্রুয়ারি সবসময় ৮ ফাল্গুন, 26 মার্চ ১২ চৈত্র, আর 16 ডিসেম্বর ১ পৌষ — 1952 ও 1971 সালের সেই বাংলা তারিখগুলোই।",
    },
    {
      question: "অধিবর্ষ (লিপ ইয়ার) কীভাবে ধরা হয়?",
      answer:
        "যে বাংলা বছরের ফাল্গুনে 29 ফেব্রুয়ারি পড়ে, সেই ফাল্গুন হয় 30 দিনের। ফাল্গুন ১৪৩৪ চলবে 14 ফেব্রুয়ারি থেকে 14 মার্চ 2028 পর্যন্ত, তাই এটি 30 দিনের, আর 29 ফেব্রুয়ারি 2028 হলো ১৬ ফাল্গুন ১৪৩৪।",
    },
    {
      question: "পশ্চিমবঙ্গের পঞ্জিকার সাথে তারিখ মেলে না কেন?",
      answer:
        "পশ্চিমবঙ্গ ও ভারতের অন্যান্য রাজ্যে প্রচলিত ঐতিহ্যবাহী পঞ্জিকায় মাসের দৈর্ঘ্য জ্যোতির্বিজ্ঞানের হিসাবে বছরে বছরে বদলায়। বাংলাদেশে মাসের দৈর্ঘ্য নির্দিষ্ট, তাই একই দিনে দুই ক্যালেন্ডারে আলাদা তারিখ হতে পারে।",
    },
    {
      question: "তারিখটি বাংলা অঙ্কে দেখানো হয় কেন?",
      answer:
        "বাংলা তারিখ সাধারণত বাংলা অঙ্কেই লেখা হয়, যেমন ১২ কার্তিক ১৪৩৩। ফর্ম বা মেসেজের জন্য একই তারিখ ইংরেজি অঙ্কেও (12 কার্তিক 1433) দেখানো হয়।",
    },
    {
      question: "ছয় ঋতু কী কী?",
      answer:
        "বৈশাখ থেকে শুরু করে দুই মাস করে: গ্রীষ্ম, বর্ষা, শরৎ, হেমন্ত, শীত ও বসন্ত।",
    },
    {
      question: "কোন কোন তারিখ রূপান্তর করা যায়?",
      answer:
        "১ বৈশাখ ১ (14 এপ্রিল 594) থেকে ৩০ চৈত্র ৮০০০ (13 এপ্রিল 8594) পর্যন্ত যেকোনো তারিখ। 2019 সালের অনেক আগের তারিখ আজকের নিয়মে দেখানো হয়, তাই তখনকার ছাপা পঞ্জিকা থেকে এক দিন আলাদা হতে পারে।",
    },
  ],
};
