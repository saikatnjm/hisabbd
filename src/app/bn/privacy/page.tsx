import { pageMetadata } from "@/calculators/metadata";
import { ProsePage } from "@/components/layout/prose-page";
import { ContentSection } from "@/components/ui/content-section";
import { analyticsEnabled, gaEnabled, umamiEnabled } from "@/config/analytics";

export const metadata = pageMetadata({
  title: "গোপনীয়তা",
  description:
    "HisabBD আপনার তথ্য কীভাবে সামলায়: হিসাব চলে আপনার ব্রাউজারে, আপনি যা লেখেন তা সংরক্ষণ বা পাঠানো হয় না, কোনো অ্যাকাউন্ট বা ট্র্যাকিং কুকি নেই।",
  path: "/privacy",
  locale: "bn",
});

export default function BanglaPrivacyPage() {
  return (
    <ProsePage
      locale="bn"
      title="গোপনীয়তা"
      intro="HisabBD-তে আপনার তথ্যের কী হয়, তার সংক্ষিপ্ত ও সহজ ব্যাখ্যা।"
      updated="৫ অক্টোবর ২০২৬"
    >
      <ContentSection id="inputs" title="ক্যালকুলেটরে আপনি যা লেখেন">
        <p>
          হিসাব চলে আপনার ব্রাউজারে। আপনার লেখা সংখ্যা ও তারিখ HisabBD-র সার্ভারে পাঠানো হয় না,
          HisabBD সেগুলো সংরক্ষণও করে না। ক্যালকুলেটর রিসেট করলে বা পাতা ছেড়ে গেলে সেগুলো মুছে যায়।
        </p>
        <p>
          <strong>ফলাফল কপি</strong> বা <strong>শেয়ার</strong> করলে ফলাফলটি যায় আপনার ক্লিপবোর্ডে বা
          আপনার বেছে নেওয়া অ্যাপে — তারপর তা আপনার হাতে।
        </p>
      </ContentSection>
      <ContentSection id="saved" title="সেভ করা ও সম্প্রতি ব্যবহৃত ক্যালকুলেটর">
        <p>
          হোমপেজে “আপনার ক্যালকুলেটর” দেখাতে আপনার ব্রাউজার মনে রাখে কোন ক্যালকুলেটরগুলো আপনি সম্প্রতি
          খুলেছেন আর কোনগুলো সেভ করেছেন। শুধু ক্যালকুলেটরের নামটিই (যেমন “age-calculator”) আপনার
          ব্রাউজারের লোকাল স্টোরেজে রাখা হয়। ক্যালকুলেটরে আপনি যা লেখেন তার কিছুই রাখা হয় না, আর এই
          তালিকা কখনো HisabBD-তে পাঠানো হয় না। ব্রাউজারের সাইট ডেটা মুছলে এটিও মুছে যায়।
        </p>
      </ContentSection>

      <ContentSection id="accounts" title="অ্যাকাউন্ট, কুকি ও ট্র্যাকিং">
        <ul>
          <li>কোনো অ্যাকাউন্ট বা সাইন-আপ নেই।</li>
          <li>
            {gaEnabled
              ? "HisabBD বিজ্ঞাপনের কুকি ব্যবহার করে না। Google Analytics কিছু অ্যানালিটিক্স কুকি বসায়, যা নিচে ব্যাখ্যা করা আছে।"
              : "HisabBD বিজ্ঞাপন বা ট্র্যাকিংয়ের কুকি ব্যবহার করে না।"}
          </li>
          <li>ফন্ট এই ওয়েবসাইট থেকেই আসে, কোনো থার্ড-পার্টি ফন্ট সার্ভিস থেকে নয়।</li>
        </ul>
        {analyticsEnabled ? (
          <p>
            পাতা দেখার সংখ্যা আর কয়েকটি বেনামি অ্যাকশন গুনতে HisabBD ব্যবহার করে{" "}
            {gaEnabled ? <strong>Google Analytics</strong> : null}
            {gaEnabled && umamiEnabled ? " এবং " : null}
            {umamiEnabled ? <strong>Umami</strong> : null}
            {gaEnabled
              ? " (Google Analytics ভিজিট আলাদা করতে কুকি বসায়; বিজ্ঞাপনের ফিচার বন্ধ)"
              : ", একটি গোপনীয়তা-বান্ধব অ্যানালিটিক্স সার্ভিস যা কুকি ব্যবহার করে না"}
            : ক্যালকুলেটর খোলা, হিসাব সম্পন্ন করা, সার্চ (শুধু ফলাফলের সংখ্যা, আপনি কী লিখেছেন তা নয়),
            সার্চ ফলাফল বা সম্পর্কিত ক্যালকুলেটরে ক্লিক, ক্যালকুলেটর সেভ, আর ফলাফল কপি বা শেয়ার।
            প্রতিটি ইভেন্টে শুধু কোন ক্যালকুলেটর ছিল সেটিই রেকর্ড হয়।{" "}
            <strong>আপনার লেখা মান আর পাওয়া ফলাফল কখনোই পাঠানো হয় না।</strong> আপনার ব্রাউজার “Do
            Not Track” সংকেত পাঠালে Umami কিছুই সংগ্রহ করে না।
          </p>
        ) : (
          <p>HisabBD এখন কোনো অ্যানালিটিক্স ব্যবহার করছে না।</p>
        )}
      </ContentSection>

      <ContentSection id="hosting" title="হোস্টিং">
        <p>
          যেকোনো ওয়েবসাইটের মতো, পাতা লোডের সময় হোস্টিং প্রোভাইডার সাইট চালু রাখা ও সুরক্ষার জন্য
          প্রচলিত কারিগরি তথ্য রেকর্ড করতে পারে — যেমন আপনার আইপি ঠিকানা, ব্রাউজারের ধরন আর কোন
          পাতাগুলো দেখা হয়েছে।
        </p>
      </ContentSection>
      <ContentSection id="changes" title="পরিবর্তন">
        <p>
          HisabBD-র রীতিনীতি বদলালে পরিবর্তন কার্যকর হওয়ার আগেই এই পাতাটি হালনাগাদ করা হবে, ওপরে নতুন
          তারিখসহ।
        </p>
      </ContentSection>
    </ProsePage>
  );
}
