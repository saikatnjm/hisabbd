import type { CalculatorMeta } from "@/calculators/types";

export const pregnancyCalculator: CalculatorMeta = {
  slug: "pregnancy-calculator",
  name: "Pregnancy Due Date Calculator",
  nameBn: "প্রেগন্যান্সি ক্যালকুলেটর",
  category: "health",
  icon: "heart",
  summary:
    "Find your due date from the first day of your last period, or how many weeks pregnant you are from your doctor’s due date, with trimester and term dates.",
  summaryBn:
    "শেষ মাসিকের প্রথম দিন থেকে সম্ভাব্য ডেলিভারির তারিখ বের করুন, অথবা ডাক্তারের দেওয়া তারিখ থেকে দেখুন এখন কত সপ্তাহ চলছে, কোন ত্রৈমাসিক।",
  keywords: [
    "pregnancy calculator",
    "due date calculator",
    "edd calculator",
    "pregnancy week calculator",
    "how many weeks pregnant am i",
    "delivery date calculator",
    "lmp calculator",
    "gestational age calculator",
    "trimester calculator",
    "pregnancy calculator bangla",
    "delivery date ber korar niyom",
    "delivery date calculator bangla",
    "pregnancy due date calculator",
    "প্রেগন্যান্সি ক্যালকুলেটর",
    "ডেলিভারির তারিখ",
    "ডেলিভারি ডেট",
    "সম্ভাব্য প্রসবের তারিখ",
    "গর্ভাবস্থার সপ্তাহ",
    "কত সপ্তাহ চলছে",
    "শেষ মাসিকের তারিখ",
    "গর্ভকালীন বয়স",
    "ডেলিভারির তারিখ বের করার নিয়ম",
    "গর্ভের বয়স হিসাব",
    "প্রেগন্যান্সি কত সপ্তাহ",
    "ত্রৈমাসিক",
  ],
  seo: {
    title: "Pregnancy Due Date Calculator: How Many Weeks? (EDD)",
    description:
      "Find your due date from the first day of your last period, or how many weeks pregnant you are from your doctor’s due date. Free, private and in Bangla.",
  },
  seoBn: {
    title: "ডেলিভারির তারিখ ক্যালকুলেটর: প্রেগন্যান্সি কত সপ্তাহ",
    description:
      "শেষ মাসিকের প্রথম দিন থেকে সম্ভাব্য ডেলিভারির তারিখ, এখন কত সপ্তাহ চলছে আর কোন ত্রৈমাসিক জেনে নিন। ফ্রি, আর আপনার তথ্য আপনার ফোনেই থাকে।",
  },
  addedOn: "2026-11-01",
  related: ["date-difference-calculator", "age-calculator", "temperature-converter", "bmi-calculator"],
  faqs: [
    {
      question: "How is the due date calculated?",
      answer:
        "By convention, the due date is 280 days (40 weeks) after the first day of your last menstrual period, as in ACOG’s guidance on estimating the due date. For example, a last period that started on 1 June 2026 gives a due date of 8 March 2027.",
    },
    {
      question: "How many weeks pregnant am I?",
      answer:
        "Count the days from the first day of your last period and divide by 7. With a last period on 1 June 2026, on 1 November 2026 that is 153 days: 21 weeks and 6 days, in the second trimester, with 127 days to the due date.",
    },
    {
      question: "My doctor gave a different due date. Which is right?",
      answer:
        "Go by your doctor’s date. A first-trimester ultrasound is more accurate than the period date, and ACOG says a due date set by early ultrasound (or by IVF dates) should be used. Choose “Due date from my doctor” to see your weeks from that date.",
    },
    {
      question: "Why is pregnancy counted from the last period, not from conception?",
      answer:
        "Because the first day of the last period is usually known, while conception isn’t. In a typical 28-day cycle conception happens about two weeks later, so the count includes about two weeks before conception. Doctors and this calculator count the same way.",
    },
    {
      question: "What are the trimesters?",
      answer:
        "The first trimester runs to 13 weeks 6 days, the second from 14 weeks to 27 weeks 6 days, and the third from 28 weeks until birth.",
    },
    {
      question: "Will the baby be born on the due date?",
      answer:
        "The due date is an estimate, not an appointment. ACOG calls birth from 37 weeks “early term”, from 39 weeks to 40 weeks 6 days “full term”, 41 weeks “late term” and from 42 weeks “post-term”. The calculator shows the date each one starts.",
    },
    {
      question: "My periods are irregular. Will this still work?",
      answer:
        "Less well. The 280-day rule assumes a regular cycle, and we don’t adjust for cycle length because we found no authoritative rule for it. An early ultrasound gives a more reliable date; enter that date with “Due date from my doctor”.",
    },
    {
      question: "Is what I enter saved anywhere?",
      answer:
        "No. The dates stay on your phone or computer and are never sent anywhere. Unlike our other calculators, this one doesn’t keep a list of recent calculations, so nothing about a pregnancy is left on a shared device.",
    },
  ],
  faqsBn: [
    {
      question: "ডেলিভারির তারিখ কীভাবে হিসাব হয়?",
      answer:
        "প্রচলিত নিয়মে সম্ভাব্য ডেলিভারির তারিখ হলো শেষ মাসিকের প্রথম দিন থেকে 280 দিন (40 সপ্তাহ) পর, যেমনটি এসিওজির (ACOG) নির্দেশনায় আছে। যেমন শেষ মাসিক 1 জুন 2026-এ শুরু হলে সম্ভাব্য তারিখ 8 মার্চ 2027।",
    },
    {
      question: "আমার এখন কত সপ্তাহ চলছে?",
      answer:
        "শেষ মাসিকের প্রথম দিন থেকে দিন গুনে 7 দিয়ে ভাগ করুন। শেষ মাসিক 1 জুন 2026 হলে 1 নভেম্বর 2026-এ 153 দিন: 21 সপ্তাহ 6 দিন, দ্বিতীয় ত্রৈমাসিক, ডেলিভারির তারিখ পর্যন্ত বাকি 127 দিন।",
    },
    {
      question: "ডাক্তার অন্য তারিখ দিয়েছেন। কোনটা ঠিক?",
      answer:
        "ডাক্তারের তারিখই মানুন। প্রথম ত্রৈমাসিকের আলট্রাসনোগ্রাম মাসিকের তারিখের চেয়ে বেশি নির্ভুল, আর এসিওজির মতে আগের আলট্রাসনোগ্রাম (বা আইভিএফের তারিখ) থেকে পাওয়া তারিখই ব্যবহার করা উচিত। সেই তারিখ থেকে সপ্তাহ দেখতে “ডাক্তারের দেওয়া তারিখ” বেছে নিন।",
    },
    {
      question: "গর্ভধারণের দিন থেকে না গুনে শেষ মাসিক থেকে কেন গোনা হয়?",
      answer:
        "কারণ শেষ মাসিকের প্রথম দিন সাধারণত জানা থাকে, গর্ভধারণের দিন থাকে না। 28 দিনের নিয়মিত চক্রে গর্ভধারণ হয় মোটামুটি দুই সপ্তাহ পরে, তাই এই গোনায় গর্ভধারণের আগের প্রায় দুই সপ্তাহও ধরা থাকে। ডাক্তাররা আর এই ক্যালকুলেটর একইভাবে গোনেন।",
    },
    {
      question: "ত্রৈমাসিকগুলো কী কী?",
      answer: "প্রথম ত্রৈমাসিক 13 সপ্তাহ 6 দিন পর্যন্ত, দ্বিতীয় 14 সপ্তাহ থেকে 27 সপ্তাহ 6 দিন, আর তৃতীয় 28 সপ্তাহ থেকে প্রসব পর্যন্ত।",
    },
    {
      question: "বাচ্চা কি ঠিক ওই তারিখেই হবে?",
      answer:
        "সম্ভাব্য তারিখ একটি আনুমানিক হিসাব, নির্দিষ্ট দিন নয়। এসিওজির শ্রেণি অনুযায়ী 37 সপ্তাহ থেকে প্রসব “আর্লি টার্ম”, 39 সপ্তাহ থেকে 40 সপ্তাহ 6 দিন “ফুল টার্ম”, 41 সপ্তাহ “লেট টার্ম”, আর 42 সপ্তাহ থেকে “পোস্ট-টার্ম”। ক্যালকুলেটর প্রতিটি কবে শুরু, সেই তারিখ দেখায়।",
    },
    {
      question: "মাসিক অনিয়মিত হলে কি এটা কাজ করবে?",
      answer:
        "কম নির্ভুল হবে। 280 দিনের নিয়ম নিয়মিত চক্র ধরে নেয়, আর চক্রের দৈর্ঘ্য অনুযায়ী সমন্বয়ের কোনো নির্ভরযোগ্য নিয়ম আমরা পাইনি বলে তা করি না। আগের আলট্রাসনোগ্রামের তারিখ বেশি নির্ভরযোগ্য; সেটি “ডাক্তারের দেওয়া তারিখ” দিয়ে লিখুন।",
    },
    {
      question: "আমার দেওয়া তথ্য কি কোথাও জমা থাকে?",
      answer:
        "না। তারিখগুলো আপনার ফোন বা কম্পিউটারেই থাকে, কোথাও পাঠানো হয় না। আমাদের অন্য ক্যালকুলেটরের মতো এটি সাম্প্রতিক হিসাবের তালিকাও রাখে না, তাই শেয়ার করা ডিভাইসে গর্ভাবস্থার কোনো চিহ্ন থাকে না।",
    },
  ],
};
