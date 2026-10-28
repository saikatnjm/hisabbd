import Link from "next/link";
import { pageMetadata } from "@/calculators/metadata";
import { CALCULATORS_PATH } from "@/calculators/paths";
import { ProsePage } from "@/components/layout/prose-page";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";

export const metadata = pageMetadata({
  title: "আমাদের সম্পর্কে",
  description:
    "HisabBD হলো বাংলাদেশের দৈনন্দিন জীবনের জন্য একগুচ্ছ ফ্রি, সহজ অনলাইন ক্যালকুলেটর: এটি কী করে, হিসাবগুলো কীভাবে কাজ করে আর এর সীমা কী।",
  path: "/about",
  locale: "bn",
});

export default function BanglaAboutPage() {
  return (
    <ProsePage
      locale="bn"
      title="HisabBD সম্পর্কে"
      intro="হিসাব মানে ক্যালকুলেশন। HisabBD হলো বাংলাদেশের দৈনন্দিন জীবনের জন্য একগুচ্ছ ফ্রি, সহজ ক্যালকুলেটর।"
    >
      <ContentSection id="what" title="HisabBD যা করে">
        <p>
          প্রতিটি ক্যালকুলেটর একটিই কাজ করে: আপনার সঠিক বয়স, বিএমআই, সেমিস্টারের জিপিএ, লোনের কিস্তি,
          টাকায় ডিসকাউন্ট — এমন সব হিসাব। আপনি পাবেন পরিষ্কার উত্তর, সাথে হিসাবটা কীভাবে হলো তার ছোট
          ব্যাখ্যা।
        </p>
        <p>
          <Link
            href={localePath("bn", CALCULATORS_PATH)}
            className="font-semibold text-brand-700 underline underline-offset-4"
          >
            সব ক্যালকুলেটর দেখুন
          </Link>
        </p>
      </ContentSection>
      <ContentSection id="how" title="হিসাবগুলো যেভাবে কাজ করে">
        <ul>
          <li>হিসাব চলে আপনার ব্রাউজারে। আপনি যা লেখেন তা কোনো সার্ভারে পাঠানো হয় না।</li>
          <li>প্রতিটি ক্যালকুলেটর তার সূত্র ও অনুমানগুলো নিজের পাতায় জানিয়ে দেয়।</li>
          <li>
            সময়ের সাথে বদলায় এমন নিয়ম — যেমন ট্যাক্সের হার বা কোনো বিশ্ববিদ্যালয়ের গ্রেডিং নীতি —
            আন্দাজ করা হয় না। যেখানে দরকার, সেখানে আপনি নিজে মানগুলো দেন, বা পাতাটি জানিয়ে দেয় কী
            ধরা হয়েছে।
          </li>
        </ul>
      </ContentSection>
      <ContentSection id="limits" title="সীমাবদ্ধতা">
        <p>
          ফলাফলগুলো সাধারণ তথ্যের জন্য। টাকা-পয়সা, স্বাস্থ্য, ভর্তি বা কোনো সরকারি-আনুষ্ঠানিক
          সিদ্ধান্তের আগে সংশ্লিষ্ট প্রতিষ্ঠান বা যোগ্য পেশাদারের কাছে অঙ্কগুলো যাচাই করে নিন।
        </p>
      </ContentSection>
    </ProsePage>
  );
}
