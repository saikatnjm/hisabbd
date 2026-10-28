import { ContentSection } from "@/components/ui/content-section";

const cell = "px-3 py-2";

/** Explanatory content for the Taka Amount in Words page (Server Component, no JS). */
export function AmountInWordsContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How a Taka amount is written in words">
        <p>
          The amount is split into the groups used in Bangladesh, from the left:{" "}
          <strong>crore, lakh, thousand, hundred</strong>, then the last two digits. Each group is
          written in words, then come “Taka”, the paisa (if any) and “Only”.
        </p>
        <p>
          <strong>1,25,300.50 = 1 lakh + 25 thousand + 3 hundred, and 50 paisa</strong>
        </p>
        <p>
          In words: <strong>One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only</strong>.
          In Bangla: <strong lang="bn">এক লক্ষ পঁচিশ হাজার তিনশত টাকা পঞ্চাশ পয়সা মাত্র</strong>.
        </p>

        <h3>Worked examples</h3>
        <ul>
          <li>৳0: Zero Taka Only (শূন্য টাকা মাত্র)</li>
          <li>৳21: Twenty-One Taka Only (একুশ টাকা মাত্র)</li>
          <li>৳101: One Hundred One Taka Only (একশত এক টাকা মাত্র)</li>
          <li>৳999: Nine Hundred Ninety-Nine Taka Only (নয়শত নিরানব্বই টাকা মাত্র)</li>
          <li>৳1,00,000: One Lakh Taka Only (এক লক্ষ টাকা মাত্র)</li>
          <li>৳1,00,00,000: One Crore Taka Only (এক কোটি টাকা মাত্র)</li>
          <li>৳0.29: Twenty-Nine Paisa Only (ঊনত্রিশ পয়সা মাত্র)</li>
          <li>৳0.05: Five Paisa Only (পাঁচ পয়সা মাত্র)</li>
        </ul>
        <p>
          The paisa are read exactly from the digits you type, so 0.29 is always 29 paisa. English
          numbers from 21 to 99 are hyphenated (Twenty-Five), and no “and” is used inside the
          number itself.
        </p>
      </ContentSection>

      <ContentSection id="cheque" title="How to write the amount on a Bangladeshi cheque">
        <ol>
          <li>
            <strong>Words line:</strong> start writing right at the beginning of the line, with no
            gaps between words. If the line already has “Taka” printed at the start, write the words
            after it; otherwise include “Taka” as the calculator does.
          </li>
          <li>
            <strong>End with “Only”</strong> (or “মাত্র” in Bangla), then draw a line through any
            space left, so nothing can be added later.
          </li>
          <li>
            <strong>Figures box:</strong> write the amount close to the printed ৳ or “Tk.”, with
            lakh/crore commas, for example 1,25,300.50. For whole Taka many people add “/-” after the
            number (1,25,300/-) to close it off.
          </li>
          <li>
            <strong>Words and figures must match.</strong> Banks can refuse a cheque where they
            differ, so copy both from the same result.
          </li>
        </ol>
        <p>
          Your bank may have its own instructions (for example on which language to use); follow
          them where they differ from this general practice.
        </p>
      </ContentSection>

      <ContentSection id="lakh-crore-million" title="Lakh and crore vs million and billion">
        <p>
          Bangladesh groups digits as 1,00,00,000 (lakh and crore), while the international system
          groups them as 10,000,000 (thousand and million). The calculator shows both wordings.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
            <thead className="border-b-2 border-slate-300 text-slate-900">
              <tr>
                <th scope="col" className={`${cell} font-semibold`}>Bangladesh</th>
                <th scope="col" className={`${cell} font-semibold`}>In figures</th>
                <th scope="col" className={`${cell} font-semibold`}>International</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className={cell}>1 thousand (হাজার)</td><td className={cell}>1,000</td><td className={cell}>1 thousand</td></tr>
              <tr><td className={cell}>1 lakh (লক্ষ / লাখ)</td><td className={cell}>1,00,000</td><td className={cell}>100 thousand</td></tr>
              <tr><td className={cell}>10 lakh</td><td className={cell}>10,00,000</td><td className={cell}>1 million</td></tr>
              <tr><td className={cell}>1 crore (কোটি)</td><td className={cell}>1,00,00,000</td><td className={cell}>10 million</td></tr>
              <tr><td className={cell}>10 crore</td><td className={cell}>10,00,00,000</td><td className={cell}>100 million</td></tr>
              <tr><td className={cell}>100 crore</td><td className={cell}>1,00,00,00,000</td><td className={cell}>1 billion</td></tr>
              <tr><td className={cell}>1,000 crore</td><td className={cell}>10,00,00,00,000</td><td className={cell}>10 billion</td></tr>
              <tr><td className={cell}>1 lakh crore</td><td className={cell}>10,00,00,00,00,000</td><td className={cell}>1 trillion</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Above a crore, the number of crores is itself written with lakh and thousand, so “crore”
          repeats: ৳1,000 crore is <strong>One Thousand Crore Taka Only</strong>. The calculator goes up
          to ৳9,99,99,99,99,999.99, just under one lakh crore.
        </p>
        <p>
          In Bangla, this calculator writes “লক্ষ”, the formal form often seen on cheques. “লাখ” means
          the same and is just as common. Hundreds are written “একশত, দুইশত … নয়শত”.
        </p>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the amount in Taka, with up to 2 decimals for paisa. Bangla digits and commas are fine.</li>
          <li>Select Write in words.</li>
          <li>
            Copy the English or Bangla words with the Copy button next to each, or copy both with
            Copy result.
          </li>
          <li>Use “In figures” or “In Bangla digits” for the figures box.</li>
        </ol>
      </ContentSection>
    </>
  );
}
