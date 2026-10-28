import { pageMetadata } from "@/calculators/metadata";
import { ProsePage } from "@/components/layout/prose-page";
import { ContentSection } from "@/components/ui/content-section";

export const metadata = pageMetadata({
  title: "ব্যবহারের শর্তাবলী",
  description:
    "HisabBD-র ফ্রি ক্যালকুলেটর ব্যবহারের শর্ত: ফলাফল সাধারণ তথ্যের জন্য, গুরুত্বপূর্ণ সিদ্ধান্তের আগে যাচাই করে নিন।",
  path: "/terms",
  locale: "bn",
});

export default function BanglaTermsPage() {
  return (
    <ProsePage
      locale="bn"
      title="ব্যবহারের শর্তাবলী"
      intro="HisabBD ব্যবহার করা মানে এই সহজ শর্তগুলো মেনে নেওয়া।"
      updated="৫ অক্টোবর ২০২৬"
    >
      <ContentSection id="information" title="ফলাফল তথ্যের জন্য">
        <p>
          HisabBD-র ক্যালকুলেটরগুলো যত্ন নিয়ে বানানো, আর প্রতিটির সূত্র তার পাতায় ব্যাখ্যা করা আছে —
          তবু ফলাফলগুলো সাধারণ তথ্যের জন্য আনুমানিক হিসাব। এগুলো কোনো আর্থিক, চিকিৎসা, আইনি, শিক্ষাগত
          বা পেশাদার পরামর্শ নয়।
        </p>
        <p>
          গুরুত্বপূর্ণ কিছুতে — যেমন লোন, স্বাস্থ্যের সিদ্ধান্ত, ভর্তি বা সরকারি কাগজপত্রে — কোনো
          ফলাফলের ওপর ভরসা করার আগে সংশ্লিষ্ট প্রতিষ্ঠান বা যোগ্য পেশাদারের কাছে তা নিশ্চিত করে নিন।
        </p>
      </ContentSection>
      <ContentSection id="as-is" title="কোনো নিশ্চয়তা নেই">
        <p>
          সাইটটি যেমন আছে তেমনই দেওয়া হয়েছে — ত্রুটিমুক্ত বা সবসময় চালু থাকার কোনো নিশ্চয়তা ছাড়া।
          কোনো হিসাবের ওপর ভরসা করে ক্ষতি হলে তার দায় HisabBD নেয় না।
        </p>
      </ContentSection>
      <ContentSection id="use" title="ন্যায্য ব্যবহার">
        <p>
          ব্যক্তিগত, পড়াশোনা বা কাজের প্রয়োজনে ক্যালকুলেটরগুলো ব্যবহার করতে ও ফলাফল শেয়ার করতে
          পারেন। দয়া করে সাইটটি বিঘ্নিত করার চেষ্টা করবেন না বা পুরোটা কপি করবেন না।
        </p>
      </ContentSection>
      <ContentSection id="changes" title="পরিবর্তন">
        <p>এই শর্তাবলী হালনাগাদ হতে পারে। ওপরের তারিখটিই সর্বশেষ সংস্করণ বোঝায়।</p>
      </ContentSection>
    </ProsePage>
  );
}
