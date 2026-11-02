import type { CalculatorMeta } from "@/calculators/types";

export const unitPriceCalculator: CalculatorMeta = {
  slug: "unit-price-calculator",
  name: "Unit Price Calculator: Which Pack Is Cheaper?",
  nameBn: "কোন প্যাকটা সস্তা: কেজি প্রতি দাম তুলনা",
  category: "everyday",
  icon: "scale",
  summary:
    "Compare packs and sizes of rice, oil, eggs or anything else: enter each price and quantity and see the price per kg, litre or piece, the cheapest option and how much you save.",
  summaryBn:
    "চাল, তেল, ডিম বা যেকোনো জিনিসের কয়েকটা প্যাকের দাম আর পরিমাণ লিখুন: কেজি, লিটার বা পিস প্রতি দাম, কোনটা সস্তা আর কত সাশ্রয় হবে দেখুন।",
  keywords: [
    "unit price calculator",
    "price per kg calculator",
    "which pack is cheaper",
    "compare prices",
    "best value calculator",
    "price per litre",
    "kon ta shosta",
    "dam tulona",
    "কোনটা সস্তা",
    "কেজি প্রতি দাম",
    "দাম তুলনা",
    "লিটার প্রতি দাম",
    "হালি ডজন দাম",
  ],
  seo: {
    title: "Unit Price Calculator: Which Pack Is Cheaper?",
    description:
      "Compare 2 to 10 packs by price per kg, litre or piece. Enter each price and quantity, see the cheapest option and your saving. Free, private, works in Bangla.",
  },
  seoBn: {
    title: "কোনটা সস্তা: কেজি, লিটার, পিস প্রতি দাম তুলনা",
    description:
      "কয়েকটা প্যাকের দাম আর পরিমাণ লিখুন: কেজি, লিটার বা পিস প্রতি দাম, কোনটা সস্তা আর কত টাকা বাঁচবে এক নজরে দেখুন। ফ্রি, ফোনেই হিসাব হয়, তথ্য কোথাও যায় না।",
  },
  addedOn: "2026-11-02",
  related: ["discount-calculator", "percentage-calculator", "mess-meal-calculator"],
  faqs: [
    {
      question: "How do I know which pack is cheaper?",
      answer:
        "Divide each price by its quantity to get the price per kg, litre or piece, then pick the lowest. 1 kg of rice at ৳78 costs ৳78 per kg; 5 kg at ৳370 costs ৳370 ÷ 5 = ৳74 per kg, so the 5 kg bag is cheaper.",
    },
    {
      question: "Is the bigger pack always cheaper per kg?",
      answer:
        "No. Many shops price big packs lower, but not always. Compare the unit prices instead of guessing: enter every size and the calculator ranks them from cheapest to dearest.",
    },
    {
      question: "How much do I save by buying the cheaper pack?",
      answer:
        "The calculator shows the difference per kg, litre or piece and as a percentage of the dearest option. In the rice example you save ৳4 per kg, which is 5.13% of ৳78.",
    },
    {
      question: "What is a hali, and how many pieces is a dozen?",
      answer:
        "A hali is 4 pieces and a dozen is 12 pieces. These are the usual counting words for eggs, bananas and oranges in Bangladesh, so you can enter a price per hali and compare it with a price per dozen or per piece.",
    },
    {
      question: "Can I compare kg with litre, or eggs with rice?",
      answer:
        "No. Every option must be in the same group: weight (g, kg), volume (ml, litre) or count (piece, hali, dozen). A litre of oil and a kilo of rice cannot be converted fairly, so the calculator asks you to fix the units.",
    },
    {
      question: "Does the cheapest unit price always mean the best buy?",
      answer:
        "Not always. The calculator compares price only. If you will not finish a big pack before it spoils, or the brand or quality differs, a cheaper unit price may not save you money.",
    },
  ],
  faqsBn: [
    {
      question: "কোন প্যাকটা সস্তা তা কীভাবে বুঝব?",
      answer:
        "প্রতিটা দামকে তার পরিমাণ দিয়ে ভাগ করে কেজি, লিটার বা পিস প্রতি দাম বের করুন, যেটা সবচেয়ে কম সেটাই সস্তা। 1 kg চাল ৳78 হলে কেজি প্রতি ৳78; 5 kg ৳370 হলে ৳370 ÷ 5 = ৳74, তাই 5 kg-এর বস্তাই সস্তা।",
    },
    {
      question: "বড় প্যাক কি সবসময় কেজি প্রতি সস্তা হয়?",
      answer:
        "না। অনেক দোকানে বড় প্যাকের দাম কম হয়, কিন্তু সবসময় নয়। আন্দাজ না করে সব সাইজ লিখুন, ক্যালকুলেটর সস্তা থেকে দামি ক্রমে সাজিয়ে দেবে।",
    },
    {
      question: "সস্তা প্যাক কিনলে কত টাকা বাঁচবে?",
      answer:
        "ক্যালকুলেটর কেজি, লিটার বা পিস প্রতি পার্থক্য দেখায়, সবচেয়ে দামি অপশনের শতাংশেও। চালের উদাহরণে কেজি প্রতি ৳4 বাঁচে, যা ৳78-এর 5.13%।",
    },
    {
      question: "হালি কী, আর এক ডজনে কত পিস?",
      answer:
        "এক হালি মানে 4 পিস, এক ডজন মানে 12 পিস। ডিম, কলা, কমলার হিসাবে বাংলাদেশে এই শব্দগুলোই চলে, তাই হালি প্রতি দামকে ডজন বা পিস প্রতি দামের সঙ্গে তুলনা করতে পারবেন।",
    },
    {
      question: "কেজির সঙ্গে লিটার, বা ডিমের সঙ্গে চাল তুলনা করা যায়?",
      answer:
        "না। সব অপশন একই ধরনের হতে হবে: ওজন (g, kg), তরল (ml, লিটার) বা গণনা (পিস, হালি, ডজন)। এক লিটার তেল আর এক কেজি চাল ন্যায্যভাবে বদলানো যায় না, তাই ক্যালকুলেটর একক ঠিক করতে বলে।",
    },
    {
      question: "কেজি প্রতি দাম কম মানেই কি সবচেয়ে ভালো কেনা?",
      answer:
        "সবসময় নয়। ক্যালকুলেটর শুধু দাম তুলনা করে। বড় প্যাক নষ্ট হওয়ার আগে শেষ করতে না পারলে, বা ব্র্যান্ড ও মান আলাদা হলে, কম ইউনিট দামেও টাকা বাঁচে না।",
    },
  ],
};
