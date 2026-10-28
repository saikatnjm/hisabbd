import type { CalculatorMeta } from "@/calculators/types";

export const mfsChargeCalculator: CalculatorMeta = {
  slug: "mfs-cash-out-charge-calculator",
  name: "bKash & Nagad Cash Out Charge Calculator",
  nameBn: "বিকাশ ও নগদ ক্যাশ আউট চার্জ ক্যালকুলেটর",
  category: "finance",
  icon: "mobile-money",
  summary:
    "Work out the bKash, Nagad, Rocket or Upay cash-out charge on any amount, or the most cash your balance covers, with sourced, dated rates per ৳1,000.",
  summaryBn:
    "বিকাশ, নগদ, রকেট বা উপায়ে যেকোনো টাকা ক্যাশ আউটে কত চার্জ কাটবে, বা ব্যালেন্স থেকে সর্বোচ্চ কত তোলা যাবে — প্রতি ৳1,000-এর সূত্রসহ, তারিখসহ হারে।",
  keywords: [
    "bkash cash out charge",
    "bkash charge calculator",
    "bkash cash out charge calculator",
    "bkash priyo agent charge",
    "nagad cash out charge",
    "nagad charge calculator",
    "rocket cash out charge",
    "upay cash out charge",
    "mfs charge",
    "mobile banking charge",
    "cash out fee",
    "send money charge",
    "1000 taka bkash charge",
    "বিকাশ ক্যাশ আউট চার্জ",
    "বিকাশ চার্জ",
    "নগদ ক্যাশ আউট চার্জ",
    "রকেট ক্যাশ আউট চার্জ",
    "উপায় ক্যাশ আউট চার্জ",
    "প্রিয় এজেন্ট",
    "হাজারে কত টাকা চার্জ",
    "1000 টাকায় বিকাশ চার্জ কত",
    "মোবাইল ব্যাংকিং চার্জ",
    "ক্যাশ আউট চার্জ হিসাব",
    "bkash charge koto",
    "bikash cash out charge",
    "nogod charge",
    "cash out charge hisab",
  ],
  seo: {
    title: "bKash & Nagad Cash Out Charge Calculator (per ৳1,000)",
    description:
      "bKash cash out charge on any amount: ৳13.95 per ৳1,000 at a Priyo Agent, ৳18.50 elsewhere. Also Nagad, Rocket and Upay, with sources and dates.",
  },
  seoBn: {
    title: "বিকাশ ও নগদ ক্যাশ আউট চার্জ ক্যালকুলেটর: হাজারে কত",
    description:
      "1000 টাকায় বিকাশ চার্জ কত? প্রিয় এজেন্টে ৳13.95, অন্য এজেন্টে ৳18.50। নগদ, রকেট ও উপায়ের চার্জও হিসাব করুন, সূত্র ও তারিখসহ।",
  },
  addedOn: "2026-10-28",
  updatedOn: "2026-10-28",
  related: ["vat-calculator", "percentage-calculator", "amount-in-words"],
  faqs: [
    {
      question: "What is the bKash cash out charge per ৳1,000?",
      answer:
        "As checked on 28 October 2026: ৳13.95 per ৳1,000 from your two Priyo Agents (up to ৳50,000 a calendar month) and ৳18.50 per ৳1,000 from any other agent, from the app or *247#. Both include VAT. bKash changes charges from time to time, so check the app before a large cash out.",
    },
    {
      question: "How much is the bKash charge on ৳1,000?",
      answer:
        "৳13.95 at a Priyo Agent, so ৳1,013.95 leaves your balance. At any other agent it is ৳18.50, so ৳1,018.50 leaves your balance. The charge is proportional: ৳5,000 at ৳18.50 per ৳1,000 costs ৳92.50.",
    },
    {
      question: "How is the cash out charge calculated?",
      answer:
        "Charge = amount × rate per ৳1,000 ÷ 1,000. It is taken from your balance on top of the cash, so you need amount + charge in your account. For example, cashing out ৳2,500 with Rocket at ৳16.70 per ৳1,000 costs ৳41.75, and ৳2,541.75 leaves the account.",
    },
    {
      question: "How much cash can I take out from my balance?",
      answer:
        "Divide the balance by 1 + rate ÷ 1,000. With ৳10,000 and a ৳18.50 rate: 10,000 ÷ 1.0185 ≈ ৳9,818.36, and the charge on that is ৳181.64, using up exactly ৳10,000. Choose “I have a balance” in the calculator to get this, plus the largest whole-Taka amount (৳9,818).",
    },
    {
      question: "What is a bKash Priyo Agent and how do I save on the charge?",
      answer:
        "You can set any 2 agent numbers as Priyo Agents in the bKash app (Cash Out → Priyo Agent) or by dialling *247# (My bKash → Priyo Number). Cash out from them costs ৳13.95 per ৳1,000 up to ৳50,000 in a calendar month. If a transaction takes you over ৳50,000, that whole transaction is charged ৳18.50 per ৳1,000.",
    },
    {
      question: "What is the Nagad cash out charge?",
      answer:
        "Nagad's own cash-out page listed ৳15.00 per ৳1,000 including VAT (৳13.05 plus VAT) for USSD *167# and the Nagad Islamic app on 28 October 2026. Its English and Bangla pages showed different figures for the regular Nagad app, so we leave that rate for you to enter from the app. Nagad says the charges on its website prevail.",
    },
    {
      question: "What are the Rocket and Upay cash out charges?",
      answer:
        "Rocket (Dutch-Bangla Bank) lists 1.67% at an agent (৳16.70 per ৳1,000) and 0.9% at a DBBL ATM or branch (৳9), all including VAT and tax, for general accounts. Upay lists 1.40% at an agent (৳14 per ৳1,000) and 0.8% at a UCB ATM (৳8) for primary accounts. Both checked on 28 October 2026.",
    },
    {
      question: "Is VAT included in the cash out charge?",
      answer:
        "For bKash, Rocket and the Nagad figures above, yes: the rates shown include VAT. Upay's charges page does not say whether VAT is extra. If your app shows a different total, type its rate into the calculator.",
    },
    {
      question: "Is send money charged the same way?",
      answer:
        "No. Send money is priced differently from cash out: Rocket's schedule shows it free to the same Rocket product and 0.90% to another product (paid by the receiver), and Upay lists send money as no charge. bKash charges a small flat fee per transaction, with free sends to Priyo numbers up to a monthly limit. Check the provider's app for the current send-money fee; this calculator is for cash out.",
    },
    {
      question: "Why is the charge in my app a few paisa different?",
      answer:
        "Providers don't publish how they round charges. This calculator rounds to the nearest paisa, so the charge in the app may differ by a few paisa. Charges also change, so if the app shows a different rate, enter that rate here.",
    },
  ],
  faqsBn: [
    {
      question: "বিকাশে প্রতি হাজারে ক্যাশ আউট চার্জ কত?",
      answer:
        "28 অক্টোবর 2026-এ যাচাই করা হার: আপনার দুটি প্রিয় এজেন্ট থেকে প্রতি ৳1,000-এ ৳13.95 (মাসে ৳50,000 পর্যন্ত), আর অন্য যেকোনো এজেন্ট থেকে ৳18.50 — অ্যাপ বা *247# দুটোতেই। দুটো হারেই ভ্যাট ধরা। বিকাশ মাঝে মাঝে চার্জ বদলায়, তাই বড় অঙ্ক তোলার আগে অ্যাপে দেখে নিন।",
    },
    {
      question: "1000 টাকায় বিকাশ চার্জ কত?",
      answer:
        "প্রিয় এজেন্টে ৳13.95, অর্থাৎ ব্যালেন্স থেকে কাটবে ৳1,013.95। অন্য এজেন্টে ৳18.50, অর্থাৎ কাটবে ৳1,018.50। চার্জ টাকার অনুপাতে বাড়ে: ৳5,000 তুলতে ৳18.50 হারে চার্জ ৳92.50।",
    },
    {
      question: "ক্যাশ আউট চার্জ কীভাবে হিসাব করা হয়?",
      answer:
        "চার্জ = টাকার পরিমাণ × প্রতি ৳1,000-এর হার ÷ 1,000। চার্জ নগদ টাকার ওপরে আলাদা করে ব্যালেন্স থেকে কাটে, তাই অ্যাকাউন্টে টাকা + চার্জ থাকতে হবে। যেমন, রকেটে ৳16.70 হারে ৳2,500 তুললে চার্জ ৳41.75, অ্যাকাউন্ট থেকে কাটবে ৳2,541.75।",
    },
    {
      question: "আমার ব্যালেন্স থেকে সর্বোচ্চ কত টাকা তুলতে পারব?",
      answer:
        "ব্যালেন্সকে 1 + হার ÷ 1,000 দিয়ে ভাগ করুন। ৳10,000 ব্যালেন্সে ৳18.50 হারে: 10,000 ÷ 1.0185 ≈ ৳9,818.36, এর চার্জ ৳181.64 — মোট ঠিক ৳10,000। ক্যালকুলেটরে “আমার ব্যালেন্স আছে” বেছে নিলে এটি আর পূর্ণ টাকায় সর্বোচ্চ অঙ্ক (৳9,818) দুটোই দেখাবে।",
    },
    {
      question: "বিকাশ প্রিয় এজেন্ট কী, আর কীভাবে চার্জ কম দেব?",
      answer:
        "বিকাশ অ্যাপে (ক্যাশ আউট → প্রিয় এজেন্ট) বা *247# ডায়াল করে (মাই বিকাশ → প্রিয় নম্বর) যেকোনো 2টি এজেন্ট নম্বর প্রিয় এজেন্ট করা যায়। তাদের কাছ থেকে ক্যালেন্ডার মাসে ৳50,000 পর্যন্ত ক্যাশ আউটে চার্জ প্রতি ৳1,000-এ ৳13.95। কোনো লেনদেনে ৳50,000 সীমা পার হলে সেই পুরো লেনদেনে ৳18.50 হারে চার্জ কাটে।",
    },
    {
      question: "নগদে ক্যাশ আউট চার্জ কত?",
      answer:
        "28 অক্টোবর 2026-এ নগদের নিজস্ব ক্যাশ আউট পেজে USSD *167# ও নগদ ইসলামিক অ্যাপে প্রতি ৳1,000-এ ভ্যাটসহ ৳15.00 (৳13.05 + ভ্যাট) দেখানো ছিল। সাধারণ নগদ অ্যাপের হার নগদের ইংরেজি ও বাংলা পেজে ভিন্ন ছিল, তাই সেই হার অ্যাপ দেখে আপনাকেই লিখতে হবে। নগদ বলে, তাদের ওয়েবসাইটের চার্জই চূড়ান্ত।",
    },
    {
      question: "রকেট আর উপায়ে ক্যাশ আউট চার্জ কত?",
      answer:
        "রকেট (ডাচ্-বাংলা ব্যাংক) সাধারণ অ্যাকাউন্টে এজেন্টে 1.67% (প্রতি ৳1,000-এ ৳16.70) আর DBBL এটিএম বা শাখায় 0.9% (৳9) — ভ্যাট ও করসহ। উপায় প্রাইমারি অ্যাকাউন্টে এজেন্টে 1.40% (৳14) আর UCB এটিএমে 0.8% (৳8)। দুটোই 28 অক্টোবর 2026-এ যাচাই করা।",
    },
    {
      question: "ক্যাশ আউট চার্জে কি ভ্যাট ধরা থাকে?",
      answer:
        "বিকাশ, রকেট ও ওপরের নগদের হারে হ্যাঁ, ভ্যাট ধরা আছে। উপায়ের চার্জ পেজে ভ্যাট আলাদা কি না বলা নেই। আপনার অ্যাপে অন্য অঙ্ক দেখালে সেই হারটিই ক্যালকুলেটরে লিখুন।",
    },
    {
      question: "সেন্ড মানিতেও কি একইভাবে চার্জ কাটে?",
      answer:
        "না, সেন্ড মানির চার্জ ক্যাশ আউটের মতো নয়। রকেটের তালিকায় একই রকেট প্রোডাক্টে সেন্ড মানি ফ্রি, অন্য প্রোডাক্টে 0.90% (প্রাপক দেন); উপায়ে সেন্ড মানি ফ্রি। বিকাশে প্রতি লেনদেনে ছোট একটি নির্দিষ্ট চার্জ, তবে প্রিয় নম্বরে মাসিক একটি সীমা পর্যন্ত ফ্রি। সেন্ড মানির বর্তমান চার্জ অ্যাপে দেখে নিন; এই ক্যালকুলেটর ক্যাশ আউটের জন্য।",
    },
    {
      question: "অ্যাপের চার্জের সঙ্গে কয়েক পয়সা পার্থক্য কেন?",
      answer:
        "প্রতিষ্ঠানগুলো চার্জ কীভাবে রাউন্ড করে তা প্রকাশ করে না। এই ক্যালকুলেটর নিকটতম পয়সায় রাউন্ড করে, তাই অ্যাপে কয়েক পয়সা পার্থক্য হতে পারে। চার্জও বদলায় — অ্যাপে অন্য হার দেখালে সেটিই এখানে লিখুন।",
    },
  ],
};
