import type { CalculatorMeta } from "@/calculators/types";

export const amountInWordsCalculator: CalculatorMeta = {
  slug: "amount-in-words",
  name: "Taka Amount in Words",
  nameBn: "টাকা কথায় লেখার ক্যালকুলেটর",
  category: "finance",
  icon: "text",
  summary:
    "Write any Taka amount in words, in English and Bangla, using lakh and crore: ready to copy onto a cheque, invoice or money receipt.",
  summaryBn:
    "যেকোনো টাকার অঙ্ক লক্ষ-কোটি পদ্ধতিতে বাংলা ও ইংরেজি কথায় লিখুন — চেক, ইনভয়েস বা মানি রিসিটে সরাসরি কপি করে বসান।",
  keywords: [
    "amount in words",
    "taka in words",
    "number to words",
    "number to words bangla",
    "number to words english",
    "টাকা কথায়",
    "সংখ্যা কথায়",
    "কথায় লিখুন",
    "চেক লেখার নিয়ম",
    "চেক",
    "taka kothay",
    "kothay lekha",
    "lakh crore in words",
    "cheque writing",
    "cheque amount in words",
    "check writing",
    "money in words",
    "rupees in words",
    "paisa",
    "পয়সা",
    "লক্ষ",
    "কোটি",
    "million to crore",
  ],
  seo: {
    title: "Taka Amount in Words (English & Bangla) for Cheques",
    description:
      "Type a Taka amount to get it in words in English and Bangla, with lakh, crore and paisa, ending in “Only” / “মাত্র”. Copy it straight onto a cheque.",
  },
  seoBn: {
    title: "টাকা কথায় লেখা: বাংলা ও ইংরেজিতে চেকের অঙ্ক",
    description:
      "টাকার অঙ্ক লিখলেই বাংলা ও ইংরেজি কথায় পেয়ে যাবেন — লক্ষ, কোটি, পয়সাসহ, শেষে “মাত্র” / “Only”। চেকে লেখার জন্য সরাসরি কপি করুন।",
  },
  addedOn: "2026-10-28",
  related: ["discount-calculator", "salary-calculator", "mfs-cash-out-charge-calculator"],
  faqs: [
    {
      question: "How do I write ৳1,25,300.50 in words?",
      answer:
        "One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only. In Bangla: এক লক্ষ পঁচিশ হাজার তিনশত টাকা পঞ্চাশ পয়সা মাত্র.",
    },
    {
      question: "Why do cheques end the amount with “Only”?",
      answer:
        "“Only” (or “মাত্র” in Bangla) closes the amount so nobody can add words after it, for example turning “One Thousand Taka” into “One Thousand Five Hundred Taka”. Draw a line through any space left on the words line too.",
    },
    {
      question: "How do I write paisa on a cheque?",
      answer:
        "Write the Taka, then “and”, then the paisa in words: ৳10.50 is “Ten Taka and Fifty Paisa Only”. An amount under one Taka, like ৳0.05, is just “Five Paisa Only”. If there are no paisa, leave them out: “Two Thousand Five Hundred Taka Only”.",
    },
    {
      question: "What is a lakh and a crore in millions?",
      answer:
        "1 lakh = 1,00,000 = one hundred thousand. 10 lakh = 1 million. 1 crore = 1,00,00,000 = 10 million. 100 crore = 1 billion. The calculator also shows the international (million) wording for each amount.",
    },
    {
      question: "How are amounts of 1,000 crore or more written?",
      answer:
        "The number of crores is itself written with lakh and thousand, so “crore” repeats: ৳1,000 crore is “One Thousand Crore Taka Only”, and 1,00,000 crore would be “One Lakh Crore”. The calculator goes up to ৳9,99,99,99,99,999.99.",
    },
    {
      question: "Is it “lakh” or “lac”, and “লক্ষ” or “লাখ”?",
      answer:
        "All are used in Bangladesh. This calculator writes “Lakh” in English and “লক্ষ” in Bangla, the more formal form often seen on cheques. “লাখ” means exactly the same and is common in everyday writing.",
    },
    {
      question: "Should I write 21 as “Twenty-One” or “Twenty One”?",
      answer:
        "Both are understood. The calculator uses the hyphen (Twenty-One, Ninety-Nine), which is standard English for numbers from 21 to 99 and makes the words harder to change.",
    },
    {
      question: "Can I type the amount in Bangla digits?",
      answer:
        "Yes. ১,২৫,৩০০.৫০ and 1,25,300.50 both work, with or without commas. The result also shows the amount in Bangla digits (১,২৫,৩০০.৫০) and in Western digits (1,25,300.50) for the figures box.",
    },
    {
      question: "Why can I only enter two decimal places?",
      answer:
        "One Taka is 100 paisa, so two decimals is the smallest amount that can be written. An amount like 1.234 cannot be written on a cheque; round it to the paisa first.",
    },
    {
      question: "Is the amount I enter sent anywhere?",
      answer:
        "No. The words are worked out in your browser. The amount is not saved, sent or added to the page address.",
    },
  ],
  faqsBn: [
    {
      question: "৳1,25,300.50 কথায় কীভাবে লিখব?",
      answer:
        "এক লক্ষ পঁচিশ হাজার তিনশত টাকা পঞ্চাশ পয়সা মাত্র। ইংরেজিতে: One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only।",
    },
    {
      question: "চেকে টাকার অঙ্কের শেষে “মাত্র” লেখা হয় কেন?",
      answer:
        "“মাত্র” (ইংরেজিতে “Only”) দিয়ে অঙ্কটি শেষ করা হয়, যাতে কেউ পরে আরও শব্দ জুড়ে দিতে না পারে — যেমন “এক হাজার টাকা”-কে “এক হাজার পাঁচশত টাকা” বানানো। কথার লাইনে ফাঁকা জায়গা থাকলে সেখানে একটি দাগ টেনে দিন।",
    },
    {
      question: "চেকে পয়সা কীভাবে লিখব?",
      answer:
        "আগে টাকা, তারপর পয়সা কথায় লিখুন: ৳10.50 হলো “দশ টাকা পঞ্চাশ পয়সা মাত্র”। এক টাকার কম অঙ্ক, যেমন ৳0.05, শুধু “পাঁচ পয়সা মাত্র”। পয়সা না থাকলে বাদ দিন: “দুই হাজার পাঁচশত টাকা মাত্র”।",
    },
    {
      question: "লক্ষ আর কোটি মিলিয়নে কত?",
      answer:
        "1 লক্ষ = 1,00,000 = 100 হাজার (hundred thousand)। 10 লক্ষ = 1 মিলিয়ন। 1 কোটি = 1,00,00,000 = 10 মিলিয়ন। 100 কোটি = 1 বিলিয়ন। ক্যালকুলেটর প্রতিটি অঙ্কের আন্তর্জাতিক (মিলিয়ন) পদ্ধতির ইংরেজি রূপও দেখায়।",
    },
    {
      question: "1,000 কোটি বা তার বেশি অঙ্ক কীভাবে লেখা হয়?",
      answer:
        "কত কোটি, সেই সংখ্যাটিও লক্ষ-হাজার দিয়ে লেখা হয়, তাই “কোটি” আবার আসে: ৳1,000 কোটি হলো “এক হাজার কোটি টাকা মাত্র”, আর 1,00,000 কোটি হতো “এক লক্ষ কোটি”। ক্যালকুলেটর ৳9,99,99,99,99,999.99 পর্যন্ত লিখতে পারে।",
    },
    {
      question: "“লক্ষ” না “লাখ” — কোনটা ঠিক?",
      answer:
        "দুটোই ঠিক এবং একই অর্থ। এই ক্যালকুলেটর “লক্ষ” লেখে, যা চেকসহ আনুষ্ঠানিক লেখায় বেশি দেখা যায়। দৈনন্দিন লেখায় “লাখ” খুবই প্রচলিত। ইংরেজিতে “Lakh” আর “Lac” দুটোই চলে।",
    },
    {
      question: "“একশত” না “একশো” লিখব?",
      answer:
        "কথ্য ভাষায় “একশো” বা “একশ” বেশি বলা হয়, তবে চেক ও দলিলে সাধারণত “একশত”, “দুইশত” লেখা হয়। এই ক্যালকুলেটর “শত” ব্যবহার করে।",
    },
    {
      question: "বাংলা অঙ্কে টাকার পরিমাণ লেখা যাবে?",
      answer:
        "হ্যাঁ। ১,২৫,৩০০.৫০ আর 1,25,300.50 দুটোই চলবে, কমা দিয়ে বা ছাড়া। ফলাফলে অঙ্কটি বাংলা সংখ্যায় (১,২৫,৩০০.৫০) আর ইংরেজি সংখ্যায় (1,25,300.50) দেখানো হয়, যা চেকের অঙ্কের ঘরে লেখার কাজে লাগে।",
    },
    {
      question: "দশমিকের পর দুই ঘরের বেশি লেখা যায় না কেন?",
      answer:
        "এক টাকা = 100 পয়সা, তাই দুই দশমিক ঘরই সবচেয়ে ছোট অঙ্ক যা লেখা যায়। 1.234-এর মতো অঙ্ক চেকে লেখা যায় না; আগে পয়সায় রাউন্ড করে নিন।",
    },
    {
      question: "আমার লেখা অঙ্ক কি কোথাও পাঠানো হয়?",
      answer:
        "না। কথাগুলো আপনার ব্রাউজারেই তৈরি হয়। অঙ্কটি কোথাও সেভ, পাঠানো বা পেজের ঠিকানায় যোগ করা হয় না।",
    },
  ],
};
