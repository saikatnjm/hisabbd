import type { CalculatorMeta } from "@/calculators/types";

export const sscHscGpaCalculator: CalculatorMeta = {
  slug: "ssc-hsc-gpa-calculator",
  name: "SSC & HSC GPA Calculator",
  nameBn: "এসএসসি ও এইচএসসি জিপিএ ক্যালকুলেটর",
  category: "education",
  icon: "certificate",
  summary:
    "Work out your SSC or HSC GPA on the Bangladesh board 5.00 scale, including the 4th (optional) subject bonus and the 5.00 cap.",
  summaryBn:
    "বাংলাদেশের বোর্ডের ৫.০০ স্কেলে এসএসসি বা এইচএসসি জিপিএ বের করুন — চতুর্থ (ঐচ্ছিক) বিষয়ের বোনাস ও ৫.০০ সীমাসহ।",
  keywords: [
    "ssc gpa",
    "hsc gpa",
    "hsc gpa calculator",
    "ssc gpa calculator",
    "ssc result",
    "hsc result",
    "board result",
    "gpa 5",
    "golden a+",
    "4th subject",
    "fourth subject",
    "optional subject",
    "dakhil",
    "alim",
    "dakhil gpa",
    "alim gpa",
    "gpa ber korar niyom",
    "4th subject gpa",
    "board challenge",
    "rescrutiny",
    "re-evaluation",
    "খাতা চ্যালেঞ্জ",
    "পুনঃনিরীক্ষা",
    "grading system",
    "grade point table",
    "কত নম্বর পেলে A+",
    "গ্রেডিং পদ্ধতি",
    "এসএসসি জিপিএ",
    "এইচএসসি জিপিএ",
    "জিপিএ",
    "চতুর্থ বিষয়",
    "ঐচ্ছিক বিষয়",
    "জিপিএ বের করার নিয়ম",
    "জিপিএ ৫",
    "গোল্ডেন এ প্লাস",
    "দাখিল",
    "আলিম",
    "রেজাল্ট",
  ],
  seo: {
    title: "SSC & HSC GPA Calculator: With 4th Subject (5.00 Scale)",
    description:
      "Calculate your SSC or HSC GPA from letter grades on the Bangladesh board 5.00 scale. Adds the 4th subject bonus, applies the 5.00 cap and the F rule. Free.",
  },
  seoBn: {
    title: "এসএসসি ও এইচএসসি জিপিএ ক্যালকুলেটর: চতুর্থ বিষয়সহ",
    description:
      "লেটার গ্রেড থেকে বোর্ডের ৫.০০ স্কেলে এসএসসি বা এইচএসসি জিপিএ হিসাব করুন। চতুর্থ বিষয়ের বোনাস, ৫.০০ সীমা ও F-এর নিয়ম মেনে। ফ্রি ও দ্রুত।",
  },
  addedOn: "2026-10-28",
  related: ["gpa-calculator", "cgpa-calculator"],
  faqs: [
    {
      question: "How is SSC or HSC GPA calculated?",
      answer:
        "Add the grade points of your main (compulsory and group) subjects, add the 4th subject bonus, and divide by the number of main subjects. The result is capped at 5.00. For example, 26.5 main points over 6 HSC subjects plus an A in the 4th subject (+2) gives 28.5 ÷ 6 = 4.75.",
    },
    {
      question: "What are the board grade points?",
      answer:
        "A+ = 5.00 (80–100 marks), A = 4.00 (70–79), A- = 3.50 (60–69), B = 3.00 (50–59), C = 2.00 (40–49), D = 1.00 (33–39) and F = 0.00 (0–32).",
    },
    {
      question: "How does the 4th (optional) subject work?",
      answer:
        "Only the part of its grade point above 2.00 is added as a bonus: A+ adds 3, A adds 2, A- adds 1.5, B adds 1, and C, D or F add nothing. The 4th subject is not counted when dividing, so it can only raise your GPA, never lower it.",
    },
    {
      question: "Do I fail if I get an F in the 4th subject?",
      answer:
        "No. Under the widely published board rule, an F in the 4th subject simply adds no bonus. An F in any main subject, however, means the overall result is a fail with GPA 0.00.",
    },
    {
      question: "Can my GPA go above 5.00?",
      answer:
        "No. The maximum is 5.00. If your main points plus the 4th subject bonus work out to more than 5.00, the GPA is capped. For example, 29 main points over 6 subjects plus an A+ in the 4th subject (+3) gives 32 ÷ 6 = 5.33, shown as 5.00.",
    },
    {
      question: "Can I get GPA 5.00 without A+ in every subject?",
      answer:
        "Yes. A strong 4th subject can make up for a lower grade elsewhere. In the example above the student has an A in English but still reaches 5.00 thanks to the A+ in the 4th subject. The calculator tells you separately when every main subject is A+.",
    },
    {
      question: "What is Golden A+?",
      answer:
        "It is an informal term, not an official grade. It usually means A+ in every subject, including the 4th subject. The board result shows only the GPA and the subject grades.",
    },
    {
      question: "How many subjects should I enter?",
      answer:
        "Enter every main subject that counts towards your GPA: typically 6 for HSC (Bangla, English, ICT and three group subjects) and more for SSC. A two-paper subject such as Bangla 1st and 2nd paper counts once, with its combined grade. The calculator divides by however many main subjects you enter.",
    },
    {
      question: "Does it work for Dakhil, Alim and vocational results?",
      answer:
        "If your board uses the same 5.00 letter grades and 4th subject rule, yes. Subject lists differ, so enter your own subjects, and check your board’s result notice for the official rules.",
    },
    {
      question: "Why might my official GPA be different?",
      answer:
        "This calculator follows widely published board practice; we could not find an official circular stating the rules online. It shows 2 decimals, rounded half up. Your board’s published result is the one that counts.",
    },
    {
      question: "How much would a board challenge raise my GPA?",
      answer:
        "One grade higher in a main subject adds the difference in grade points divided by your number of main subjects: with 6 HSC subjects, A to A+ adds about 0.17 and A- to A about 0.08. An F that becomes a D turns a fail into a pass. A GPA of 5.00 can’t rise, and a 4th subject that only reaches C adds nothing. Change one grade above to see your own case.",
    },
  ],
  faqsBn: [
    {
      question: "এসএসসি বা এইচএসসি জিপিএ কীভাবে হিসাব হয়?",
      answer:
        "মূল (আবশ্যিক ও বিভাগভিত্তিক) বিষয়গুলোর গ্রেড পয়েন্ট যোগ করুন, চতুর্থ বিষয়ের বোনাস যোগ করুন, তারপর মূল বিষয়ের সংখ্যা দিয়ে ভাগ করুন। ফল সর্বোচ্চ 5.00 পর্যন্ত ধরা হয়। যেমন, এইচএসসির 6টি বিষয়ে 26.5 পয়েন্ট আর চতুর্থ বিষয়ে A (+2) হলে 28.5 ÷ 6 = 4.75।",
    },
    {
      question: "বোর্ডের গ্রেড পয়েন্ট কত?",
      answer:
        "A+ = 5.00 (80–100 নম্বর), A = 4.00 (70–79), A- = 3.50 (60–69), B = 3.00 (50–59), C = 2.00 (40–49), D = 1.00 (33–39) এবং F = 0.00 (0–32)।",
    },
    {
      question: "চতুর্থ (ঐচ্ছিক) বিষয় কীভাবে কাজ করে?",
      answer:
        "এর গ্রেড পয়েন্টের 2.00-এর ওপরের অংশটুকুই বোনাস হিসেবে যোগ হয়: A+ হলে 3, A হলে 2, A- হলে 1.5, B হলে 1, আর C, D বা F হলে কিছুই না। ভাগ করার সময় চতুর্থ বিষয় গোনা হয় না, তাই এটি জিপিএ শুধু বাড়াতে পারে, কমাতে পারে না।",
    },
    {
      question: "চতুর্থ বিষয়ে F পেলে কি ফেল?",
      answer:
        "না। বহুল প্রচলিত বোর্ডের নিয়মে চতুর্থ বিষয়ে F পেলে শুধু কোনো বোনাস যোগ হয় না। তবে কোনো মূল বিষয়ে F পেলে পুরো ফল ফেল, জিপিএ 0.00।",
    },
    {
      question: "জিপিএ কি 5.00-এর বেশি হতে পারে?",
      answer:
        "না, সর্বোচ্চ 5.00। মূল পয়েন্ট আর চতুর্থ বিষয়ের বোনাস মিলে 5.00-এর বেশি হলে জিপিএ 5.00 ধরা হয়। যেমন, 6টি বিষয়ে 29 পয়েন্ট আর চতুর্থ বিষয়ে A+ (+3) হলে 32 ÷ 6 = 5.33, দেখানো হয় 5.00।",
    },
    {
      question: "সব বিষয়ে A+ না পেয়েও কি জিপিএ 5.00 পাওয়া যায়?",
      answer:
        "হ্যাঁ। চতুর্থ বিষয়ের ভালো গ্রেড অন্য বিষয়ের কম গ্রেড পুষিয়ে দিতে পারে। ওপরের উদাহরণে ইংরেজিতে A থাকলেও চতুর্থ বিষয়ে A+ থাকায় জিপিএ 5.00 হয়েছে। সব মূল বিষয়ে A+ থাকলে ক্যালকুলেটর আলাদা করে তা জানায়।",
    },
    {
      question: "গোল্ডেন A+ কী?",
      answer:
        "এটি একটি প্রচলিত কথা, আনুষ্ঠানিক কোনো গ্রেড নয়। সাধারণত চতুর্থ বিষয়সহ সব বিষয়ে A+ পাওয়াকে বোঝায়। বোর্ডের ফলাফলে শুধু জিপিএ আর বিষয়ভিত্তিক গ্রেড থাকে।",
    },
    {
      question: "কয়টি বিষয় লিখব?",
      answer:
        "জিপিএ-তে গণনা হয় এমন সব মূল বিষয় লিখুন: এইচএসসিতে সাধারণত 6টি (বাংলা, ইংরেজি, আইসিটি ও বিভাগের তিনটি বিষয়), এসএসসিতে আরও বেশি। বাংলা ১ম ও ২য় পত্রের মতো দুই পত্রের বিষয় একবারই গোনা হয়, সম্মিলিত গ্রেডে। আপনি যতগুলো মূল বিষয় দেবেন, ক্যালকুলেটর ততগুলো দিয়েই ভাগ করবে।",
    },
    {
      question: "দাখিল, আলিম বা কারিগরি ফলাফলেও কি চলবে?",
      answer:
        "আপনার বোর্ড যদি একই ৫.০০ লেটার গ্রেড ও চতুর্থ বিষয়ের নিয়ম মানে, তাহলে হ্যাঁ। বিষয়ের তালিকা আলাদা, তাই নিজের বিষয়গুলো লিখুন, আর আনুষ্ঠানিক নিয়মের জন্য বোর্ডের ফলাফল বিজ্ঞপ্তি দেখে নিন।",
    },
    {
      question: "আমার আনুষ্ঠানিক জিপিএ ভিন্ন হতে পারে কেন?",
      answer:
        "এই ক্যালকুলেটর বহুল প্রচলিত বোর্ডের নিয়ম মেনে চলে; নিয়মগুলো জানিয়ে কোনো আনুষ্ঠানিক প্রজ্ঞাপন আমরা অনলাইনে পাইনি। এটি ২ দশমিকে দেখায় (হাফ-আপ রাউন্ড)। আপনার বোর্ডের প্রকাশিত ফলাফলই চূড়ান্ত।",
    },
    {
      question: "খাতা চ্যালেঞ্জে জিপিএ কত বাড়তে পারে?",
      answer:
        "কোনো মূল বিষয়ে এক গ্রেড বাড়লে গ্রেড পয়েন্টের পার্থক্যকে মূল বিষয়ের সংখ্যা দিয়ে ভাগ করলে যা হয়, জিপিএ ততটা বাড়ে: এইচএসসির 6টি বিষয়ে A থেকে A+ হলে প্রায় 0.17, A- থেকে A হলে প্রায় 0.08। মূল বিষয়ের F বদলে D হলে ফেল থেকে পাস হয়। জিপিএ 5.00 হলে আর বাড়ে না, আর চতুর্থ বিষয় বড়জোর C পর্যন্ত উঠলে কিছুই যোগ হয় না। ওপরে একটি গ্রেড বদলে নিজের হিসাব দেখুন।",
    },
  ],
};
