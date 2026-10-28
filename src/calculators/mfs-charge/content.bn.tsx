import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { BKASH_NEWS_SOURCE, MFS_CHARGE_PRESETS } from "./logic";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const P = MFS_CHARGE_PRESETS;

/** Bangla explanatory content for the MFS Cash Out Charge Calculator page (Server Component, no JS). */
export function MfsChargeCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="ক্যাশ আউট চার্জ যেভাবে হিসাব হয়">
        <p>
          বিকাশ, নগদ, রকেট ও উপায় ক্যাশ আউট চার্জ ঠিক করে প্রতি ৳1,000-এ কত টাকা, আর যেকোনো অঙ্কে সেই
          অনুপাতেই চার্জ কাটে:
        </p>
        <p>
          <strong>চার্জ = টাকার পরিমাণ × প্রতি ৳1,000-এর হার ÷ 1,000</strong>
        </p>
        <p>
          <strong>ব্যালেন্স থেকে কাটবে = টাকার পরিমাণ + চার্জ</strong>
        </p>
        <p>
          চার্জ নগদ টাকার ওপরে আলাদা করে ব্যালেন্স থেকে কাটে, তাই অ্যাকাউন্টে টাকা + চার্জ দুটোই থাকতে
          হবে। প্রতি ৳1,000-এর হারকে 10 দিয়ে ভাগ করলে শতকরা হার পাওয়া যায়: ৳18.50 মানে 1.85% (অন্য যেকোনো
          শতকরা হিসাবের জন্য{" "}
          <Link href={localePath("bn", calculatorPath("percentage-calculator"))} className={link}>
            শতকরা ক্যালকুলেটর
          </Link>{" "}
          দেখুন)।
        </p>

        <h3>উদাহরণ</h3>
        <ul>
          <li>
            <strong>বিকাশ প্রিয় এজেন্ট থেকে ৳1,000</strong>, ৳13.95 হারে: চার্জ ৳13.95, ব্যালেন্স থেকে কাটবে
            ৳1,013.95।
          </li>
          <li>
            <strong>বিকাশের অন্য এজেন্ট থেকে ৳5,000</strong>, ৳18.50 হারে: 5,000 × 18.50 ÷ 1,000 = ৳92.50,
            কাটবে ৳5,092.50।
          </li>
          <li>
            <strong>রকেট এজেন্ট থেকে ৳2,500</strong>, ৳16.70 (1.67%) হারে: চার্জ ৳41.75, মোট ৳2,541.75।
          </li>
          <li>
            <strong>নগদে USSD দিয়ে ৳3,000</strong>, ৳15 হারে: চার্জ ৳45, মোট ৳3,045।
          </li>
        </ul>

        <h3>ব্যালেন্স থেকে সর্বোচ্চ কত তুলতে পারব?</h3>
        <p>
          <strong>নগদ ≈ ব্যালেন্স ÷ (1 + হার ÷ 1,000)</strong>
        </p>
        <p>
          ৳10,000 ব্যালেন্সে ৳18.50 হারে: 10,000 ÷ 1.0185 ≈ <strong>৳9,818.36</strong>। এর চার্জ ৳181.64,
          মোট ঠিক ৳10,000। এজেন্ট নোটে টাকা দেন, তাই ক্যালকুলেটর পূর্ণ টাকায় সর্বোচ্চ অঙ্কও দেখায়: ৳9,818
          (চার্জ ৳181.63, ব্যালেন্সে থাকবে ৳0.37)।
        </p>
        <p>৳5,000 ব্যালেন্সে প্রিয় এজেন্টে (৳13.95): তোলা যাবে ৳4,931.21, চার্জ ৳68.79।</p>
      </ContentSection>

      <ContentSection id="rates" title="কোন প্রতিষ্ঠানে ক্যাশ আউট চার্জ কত">
        <p>প্রতি ৳1,000-এ হার, প্রতিটি প্রতিষ্ঠানের নিজস্ব ওয়েবসাইটে 28 অক্টোবর 2026-এ যাচাই করা:</p>
        <ul>
          <li>
            <strong>বিকাশ:</strong> আপনার 2টি প্রিয় এজেন্ট থেকে ৳{P["bkash-priyo"].ratePerThousand} (ক্যালেন্ডার
            মাসে ৳50,000 পর্যন্ত); অন্য যেকোনো এজেন্ট থেকে ৳{P["bkash-agent"].ratePerThousand.toFixed(2)} —
            অ্যাপ বা *247# দুটোতেই। ভ্যাটসহ।
          </li>
          <li>
            <strong>নগদ:</strong> USSD *167# ও নগদ ইসলামিক অ্যাপে ৳{P["nagad-ussd"].ratePerThousand.toFixed(2)}{" "}
            (৳13.05 + ভ্যাট)। সাধারণ নগদ অ্যাপের হার নগদের ইংরেজি ও বাংলা পেজে ভিন্ন ছিল, তাই সেই হার অ্যাপ
            দেখে আপনাকেই লিখতে বলা হয়।
          </li>
          <li>
            <strong>রকেট:</strong> সাধারণ অ্যাকাউন্টে এজেন্টে 1.67% (৳{P["rocket-agent"].ratePerThousand.toFixed(2)}),
            DBBL এটিএম বা শাখায় 0.9% (৳{P["rocket-atm"].ratePerThousand}) — ভ্যাট ও করসহ। বেতন ও উপবৃত্তি
            অ্যাকাউন্টে চার্জ কম।
          </li>
          <li>
            <strong>উপায়:</strong> প্রাইমারি অ্যাকাউন্টে এজেন্টে 1.40% (৳{P["upay-agent"].ratePerThousand}), UCB
            এটিএমে 0.8% (৳{P["upay-atm"].ratePerThousand})। উপায়ের পেজে ভ্যাট আলাদা কি না বলা নেই।
          </li>
        </ul>
        <p>
          বিকাশের এটিএম চার্জের বর্তমান অফিসিয়াল হার নিশ্চিত করা যায়নি, তাই সেখানেও আপনার হার লিখতে হবে।
          রেমিট্যান্স, বেতন বা অন্য বিশেষ অ্যাকাউন্টে প্রায়ই আলাদা হার থাকে।
        </p>
      </ContentSection>

      <ContentSection id="pay-less" title="কীভাবে কম চার্জ দেবেন">
        <ul>
          <li>
            <strong>বিকাশ প্রিয় এজেন্ট:</strong> অ্যাপে (ক্যাশ আউট → প্রিয় এজেন্ট) বা *247# ডায়াল করে (মাই
            বিকাশ → প্রিয় নম্বর) যেকোনো 2টি এজেন্ট নম্বর প্রিয় এজেন্ট করুন। তাদের কাছ থেকে মাসে ৳50,000
            পর্যন্ত ক্যাশ আউটে প্রতি ৳1,000-এ ৳18.50-এর বদলে ৳13.95। কোনো লেনদেনে মাসের ৳50,000 সীমা পার হলে
            সেই পুরো লেনদেনে ৳18.50 হারে চার্জ কাটে।
          </li>
          <li>
            <strong>এটিএম:</strong> রকেটে DBBL এটিএম (0.9%) আর উপায়ে UCB এটিএম (0.8%) তাদের এজেন্টের চেয়ে
            সস্তা।
          </li>
          <li>
            <strong>নগদ:</strong> USSD ও ইসলামিক অ্যাপের হার ওপরে দেওয়া; বেছে নেওয়ার আগে আপনার অ্যাপে
            সাধারণ অ্যাপের হার মিলিয়ে নিন।
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="send-money" title="সেন্ড মানির চার্জ ভিন্নভাবে কাটে">
        <p>
          সেন্ড মানির চার্জ ক্যাশ আউটের মতো প্রতি ৳1,000-এ নয়। রকেটের তালিকায় একই রকেট প্রোডাক্টে সেন্ড
          মানি ফ্রি, অন্য প্রোডাক্টে 0.90% (প্রাপক দেন); উপায়ে সেন্ড মানি ফ্রি; বিকাশে প্রতি লেনদেনে ছোট
          একটি নির্দিষ্ট চার্জ, তবে প্রিয় নম্বরে মাসিক একটি সীমা পর্যন্ত ফ্রি। বর্তমান চার্জ অ্যাপে দেখে
          নিন।
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটরটি যেভাবে ব্যবহার করবেন">
        <ol>
          <li>
            “কত টাকা তুলব” (অঙ্ক জানা আছে) বা “আমার ব্যালেন্স আছে” (সর্বোচ্চ কত তোলা যাবে জানতে চান) বেছে
            নিন।
          </li>
          <li>ক্যাশ আউটের পরিমাণ বা ব্যালেন্স টাকায় লিখুন। বাংলা অঙ্ক ও 1,00,000 লেখা চলবে।</li>
          <li>প্রতিষ্ঠান ও ক্যাশ আউটের ধরন বেছে নিন। প্রতি ৳1,000-এর চার্জ তারিখ ও সূত্রসহ বসে যাবে।</li>
          <li>অ্যাপে অন্য হার দেখালে “প্রতি ৳1,000-এ চার্জ” ঘরে সেটি লিখুন।</li>
          <li>“চার্জ হিসাব করুন” চাপুন: চার্জ, ব্যালেন্স থেকে মোট কত কাটবে আর কার্যকর শতকরা হার দেখাবে।</li>
        </ol>
        <p>
          অঙ্কগুলো নিকটতম পয়সায় রাউন্ড করা। প্রতিষ্ঠানগুলো কীভাবে রাউন্ড করে তা প্রকাশ করে না, তাই অ্যাপের
          চার্জে কয়েক পয়সা পার্থক্য হতে পারে। মোট টাকা কথায় লিখতে{" "}
          <Link href={localePath("bn", calculatorPath("amount-in-words"))} className={link}>
            টাকা কথায়
          </Link>{" "}
          আর কেনাকাটার ভ্যাট হিসাবে{" "}
          <Link href={localePath("bn", calculatorPath("vat-calculator"))} className={link}>
            ভ্যাট ক্যালকুলেটর
          </Link>{" "}
          ব্যবহার করুন।
        </p>
      </ContentSection>

      <ContentSection id="sources" title="সূত্র ও তারিখ">
        <p>
          প্রতিষ্ঠানগুলো মাঝে মাঝে চার্জ বদলায়, কখনো শুধু অ্যাপের নোটিশে। এখানকার প্রতিটি হার 28 অক্টোবর
          2026-এ যাচাই করা। প্রতিষ্ঠানের নিজস্ব অ্যাপ ও ওয়েবসাইটের হারই চূড়ান্ত।
        </p>
        <ul>
          <li>
            বিকাশ:{" "}
            <a href={P["bkash-priyo"].source.url} target="_blank" rel="noopener" className={link}>
              {P["bkash-priyo"].source.title}
            </a>
            ; সমর্থন করে{" "}
            <a href={BKASH_NEWS_SOURCE.url} target="_blank" rel="noopener" className={link}>
              {BKASH_NEWS_SOURCE.title}
            </a>
            ।
          </li>
          <li>
            নগদ:{" "}
            <a href={P["nagad-ussd"].source.url} target="_blank" rel="noopener" className={link}>
              {P["nagad-ussd"].source.title}
            </a>
            ।
          </li>
          <li>
            রকেট:{" "}
            <a href={P["rocket-agent"].source.url} target="_blank" rel="noopener" className={link}>
              {P["rocket-agent"].source.title}
            </a>
            ।
          </li>
          <li>
            উপায়:{" "}
            <a href={P["upay-agent"].source.url} target="_blank" rel="noopener" className={link}>
              {P["upay-agent"].source.title}
            </a>
            ।
          </li>
        </ul>
      </ContentSection>
    </>
  );
}
