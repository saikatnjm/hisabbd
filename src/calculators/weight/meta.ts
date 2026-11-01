import type { CalculatorMeta } from "@/calculators/types";

export const weightConverter: CalculatorMeta = {
  slug: "weight-converter",
  name: "Weight Converter: Maund, Seer, Chatak to kg",
  nameBn: "ওজন রূপান্তর: মণ, সের, ছটাক থেকে কেজি",
  category: "everyday",
  icon: "weight",
  summary:
    "Convert মণ, সের, ছটাক and তোলা to kilograms, grams and pounds and back, with both the 40 kg market মণ and the traditional 37.32 kg মণ.",
  summaryBn:
    "মণ, সের, ছটাক ও তোলা থেকে কেজি, গ্রাম ও পাউন্ডে, আর উল্টো দিকেও রূপান্তর করুন; বাজারের 40 কেজির মণ আর পুরোনো মাপের 37.32 কেজির মণ, দুটোই।",
  keywords: [
    "maund to kg",
    "mon to kg",
    "seer to kg",
    "chatak to gram",
    "tola to gram",
    "kg to pound",
    "weight converter bangladesh",
    "1 mon koto kg",
    "মণ থেকে কেজি",
    "১ মণ কত কেজি",
    "এক মণ কত কেজি",
    "সের থেকে কেজি",
    "এক সের কত গ্রাম",
    "ছটাক কত গ্রাম",
    "তোলা কত গ্রাম",
    "কেজি থেকে পাউন্ড",
    "ওজন রূপান্তর",
    "মণ সের ছটাক",
  ],
  seo: {
    title: "Maund to kg Converter: Mon, Seer, Chatak, Tola, Pound",
    description:
      "How many kg is 1 maund? 40 kg in Bangladesh’s markets, 37.32 kg on the old scale. Convert মণ, সের, ছটাক, তোলা, kg, gram and pound both ways.",
  },
  seoBn: {
    title: "1 মণ কত কেজি? মণ, সের, ছটাক, তোলা থেকে কেজি",
    description:
      "বাজারে 1 মণ = 40 কেজি, পুরোনো মাপে 37.32 কেজি। মণ, সের, ছটাক, তোলা থেকে কেজি, গ্রাম ও পাউন্ডে আর উল্টো দিকে রূপান্তর করুন, সূত্রসহ।",
  },
  addedOn: "2026-11-01",
  related: ["land-calculator", "height-converter", "gold-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "How many kg is 1 maund (মণ)?",
      answer:
        "In Bangladesh’s markets 1 মণ is 40 kg, so 2 মণ of rice is 80 kg. On the old (traditional) scale, 1 মণ = 40 সের = 37.32 kg, which you may still meet in old documents and maths books.",
    },
    {
      question: "How many grams is 1 seer (সের)?",
      answer:
        "On the traditional scale, 1 সের = 80 তোলা = 933.10 g, a little under 1 kg. 40 সের make 1 traditional মণ.",
    },
    {
      question: "How many grams is 1 chatak (ছটাক)?",
      answer: "1 ছটাক = 5 তোলা = 58.32 g on the traditional scale, and 16 ছটাক make 1 সের.",
    },
    {
      question: "How many grams is 1 tola (তোলা)?",
      answer:
        "1 তোলা = 11.6638 g, fixed in 1833 as 180 grains. It is the same weight as the bhori used for gold; for gold prices use the Gold Calculator.",
    },
    {
      question: "How many maund is 100 kg?",
      answer: "2.5 market মণ (100 ÷ 40). On the traditional scale it is 2.68 মণ, or 2 মণ 27 সের 2.71 ছটাক.",
    },
    {
      question: "How many pounds is 1 maund?",
      answer: "A 40 kg market মণ is 88.18 lb. The traditional মণ is exactly 82 2/7 lb (82.29 lb).",
    },
    {
      question: "Some markets weigh more than 40 kg for a মণ. Why?",
      answer:
        "Some markets used to take extra weight per মণ (ঢলন), for example for mangoes at Baneshwar, Rajshahi; in 2020 traders there agreed to use 40 kg. Always agree the weight in kg before you buy or sell.",
    },
  ],
  faqsBn: [
    {
      question: "1 মণ কত কেজি?",
      answer:
        "বাংলাদেশের বাজারে 1 মণ = 40 কেজি, তাই 2 মণ চাল মানে 80 কেজি। পুরোনো মাপে 1 মণ = 40 সের = 37.32 কেজি, যা পুরোনো দলিল বা অঙ্কের বইয়ে এখনো দেখা যায়।",
    },
    {
      question: "1 সের কত গ্রাম?",
      answer: "পুরোনো মাপে 1 সের = 80 তোলা = 933.10 গ্রাম, অর্থাৎ 1 কেজির একটু কম। 40 সেরে এক মণ (পুরোনো মাপ)।",
    },
    {
      question: "1 ছটাক কত গ্রাম?",
      answer: "পুরোনো মাপে 1 ছটাক = 5 তোলা = 58.32 গ্রাম, আর 16 ছটাকে 1 সের।",
    },
    {
      question: "1 তোলা কত গ্রাম?",
      answer:
        "1 তোলা = 11.6638 গ্রাম, 1833 সালে 180 গ্রেইন হিসেবে নির্দিষ্ট করা। সোনার এক ভরিও একই ওজন; সোনার দামের জন্য সোনার দাম ক্যালকুলেটর ব্যবহার করুন।",
    },
    {
      question: "100 কেজি কত মণ?",
      answer: "বাজারের হিসাবে 2.5 মণ (100 ÷ 40)। পুরোনো মাপে 2.68 মণ, অর্থাৎ 2 মণ 27 সের 2.71 ছটাক।",
    },
    {
      question: "1 মণ কত পাউন্ড?",
      answer: "40 কেজির বাজারের মণ 88.18 পাউন্ড। পুরোনো মাপের মণ ঠিক 82 2/7 পাউন্ড (82.29 পাউন্ড)।",
    },
    {
      question: "কোনো কোনো বাজারে মণ 40 কেজির বেশি ধরা হয় কেন?",
      answer:
        "কিছু বাজারে আগে মণপ্রতি বাড়তি ওজন (ঢলন) নেওয়া হতো, যেমন রাজশাহীর বানেশ্বরে আমের মণ; 2020 সালে সেখানে 40 কেজিতে মণ ধরার সিদ্ধান্ত হয়। কেনাবেচার আগে সবসময় কেজিতে ওজন ঠিক করে নিন।",
    },
  ],
};
