import { ContentSection } from "@/components/ui/content-section";

/** Bangla explanatory content for the Percentage Calculator page (Server Component, no JS). */
export function PercentageCalculatorContentBn() {
  return (
    <>
      <ContentSection id="how-it-works" title="শতকরার সূত্রগুলো">
        <p>
          “পার্সেন্ট” মানে “প্রতি একশতে”। আপনি কোন প্রশ্নের উত্তর চান তা বেছে নিলে ক্যালকুলেটর
          সংশ্লিষ্ট সূত্রটি ব্যবহার করে:
        </p>
        <ul>
          <li>
            <strong>Y-এর P% কত?</strong> P ÷ 100 × Y
          </li>
          <li>
            <strong>X, Y-এর কত শতাংশ?</strong> X ÷ Y × 100 (Y শূন্য হতে পারে না)
          </li>
          <li>
            <strong>A থেকে B-তে শতকরা পরিবর্তন:</strong> (B − A) ÷ A × 100, A-এর পরম মান ধরে (A শূন্য
            হতে পারে না)
          </li>
          <li>
            <strong>Y-কে P% বাড়ানো বা কমানো:</strong> বাড়াতে Y × (1 + P ÷ 100), কমাতে Y × (1 − P ÷
            100)
          </li>
          <li>
            <strong>X কোন সংখ্যার P%?</strong> X ÷ (P ÷ 100) (P শূন্য হতে পারে না)
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="ক্যালকুলেটরটি যেভাবে ব্যবহার করবেন">
        <ol>
          <li>কী বের করতে চান বেছে নিন। অপশনগুলোর নিচের বাক্যটিই আপনার প্রশ্ন।</li>
          <li>দুটি ঘর পূরণ করুন। যেখানে অর্থবহ, সেখানে দশমিক ও ঋণাত্মক সংখ্যাও চলে।</li>
          <li>“হিসাব করুন” চাপুন। নিচে উত্তর, একটি বাক্য আর পুরো হিসাবটা দেখা যাবে।</li>
        </ol>
        <p>
          কী বের করবেন তা বদলালে আগের উত্তরটি মুছে যায়, যাতে সেটি নতুন প্রশ্নের উত্তর বলে ভুল না হয়।
        </p>
      </ContentSection>

      <ContentSection id="examples" title="উদাহরণসহ হিসাব">
        <h3>সংখ্যার শতকরা</h3>
        <p>
          2,000-এর 15% = 15 ÷ 100 × 2,000 = <strong>300</strong>।
        </p>

        <h3>কত শতাংশ</h3>
        <p>
          60-এর মধ্যে 45 = 45 ÷ 60 × 100 = <strong>75%</strong>।
        </p>

        <h3>শতকরা পরিবর্তন</h3>
        <p>
          80 থেকে 100: (100 − 80) ÷ 80 × 100 = <strong>25% বৃদ্ধি</strong>। আবার 100 থেকে 80: (80 −
          100) ÷ 100 × 100 = <strong>20% হ্রাস</strong>। দুটি শতাংশ আলাদা, কারণ দুবার শুরুর সংখ্যা
          আলাদা।
        </p>

        <h3>শতকরা হারে বাড়ানো বা কমানো</h3>
        <p>
          1,000-কে 10% বাড়ালে = 1,000 × 1.10 = <strong>1,100</strong>। একই কারণে সেই 1,100-কে 10%
          কমালে হয় 990, 1,000 নয়।
        </p>

        <h3>পূর্ণ সংখ্যা খোঁজা</h3>
        <p>
          25 যদি কোনো সংখ্যার 20% হয়, তাহলে সংখ্যাটি 25 ÷ 0.20 = <strong>125</strong>।
        </p>
      </ContentSection>
    </>
  );
}
