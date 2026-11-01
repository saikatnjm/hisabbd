import Link from "next/link";
import { calculatorPath } from "@/calculators/paths";
import { ContentSection } from "@/components/ui/content-section";
import { localePath } from "@/i18n/locales";
import { WEIGHT_SOURCES as S } from "./sources";

const link = "font-semibold text-brand-700 underline underline-offset-4";
const table = "w-full min-w-[18rem] text-left text-sm";
const cell = "border-b border-slate-200 py-2 pr-3";
const head = "border-b-2 border-slate-300 py-2 pr-3 font-semibold text-slate-900";

/** Explanatory content for the Weight Converter (Server Component, no JS). */
export function WeightCalculatorContent() {
  return (
    <>
      <ContentSection id="how-it-works" title="How many kg is 1 maund: two kinds of মণ">
        <ul>
          <li>
            <strong>Market মণ = 40 kg.</strong> Markets across Bangladesh, for rice, paddy, onions and more, use this. 2
            মণ = 80 kg, and 100 kg = 2.5 মণ.
          </li>
          <li>
            <strong>Old-scale মণ = 40 সের = 37.32 kg.</strong> This traditional scale is built on the tola and still
            appears in old documents and maths books.
          </li>
        </ul>
        <h3>Example: 100 kg</h3>
        <ol>
          <li>In market মণ: 100 ÷ 40 = 2.5 মণ.</li>
          <li>On the old scale: 100 ÷ 37.32 = 2.68 মণ, or 2 মণ 27 সের 2.71 ছটাক.</li>
          <li>In pounds: 100 ÷ 0.4536 = 220.46 lb.</li>
        </ol>
      </ContentSection>

      <ContentSection id="units" title="The old-scale units">
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col" className={head}>Unit</th>
                <th scope="col" className={head}>Equals</th>
                <th scope="col" className={head}>In grams</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={cell}>1 tola (তোলা)</td><td className={cell}>180 grains</td><td className={cell}>11.66 g</td></tr>
              <tr><td className={cell}>1 chatak (ছটাক)</td><td className={cell}>5 tola</td><td className={cell}>58.32 g</td></tr>
              <tr><td className={cell}>1 seer (সের)</td><td className={cell}>16 chatak = 80 tola</td><td className={cell}>933.10 g</td></tr>
              <tr><td className={cell}>1 maund (মণ)</td><td className={cell}>40 seer</td><td className={cell}>37.32 kg</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The tola was fixed in 1833 at 180 grains (11.6638 g), and the other units are multiples of it. A bhori of gold
          is the same weight as a tola, so for gold use the{" "}
          <Link href={localePath("en", calculatorPath("gold-calculator"))} className={link}>
            Gold Price &amp; Bhori Calculator
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection id="market-practice" title="A few things about weights in markets">
        <ul>
          <li>
            Some markets used to take extra weight per মণ (ঢলন). At Baneshwar in Rajshahi a মণ of mangoes was counted as
            46–48 kg; in 2020 traders there agreed to use 40 kg.
          </li>
          <li>
            Old units can vary by area, as land units do; for land, use the{" "}
            <Link href={localePath("en", calculatorPath("land-calculator"))} className={link}>
              Land Area Calculator
            </Link>
            .
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="how-to-use" title="How to use the calculator">
        <ol>
          <li>Enter the weight. Bangla digits work.</li>
          <li>Choose its unit: market মণ, old-scale মণ, seer, chatak, tola, kg, gram or pound.</li>
          <li>Select Convert to see kg, market মণ, the old-scale মণ-সের-ছটাক and a table of every unit.</li>
        </ol>
      </ContentSection>

      <ContentSection id="sources" title="Sources">
        <ul>
          <li>
            The 40 kg market মণ:{" "}
            <a href={S.market.url} target="_blank" rel="noopener" className={link} lang="bn">
              {S.market.title}
            </a>{" "}
            and{" "}
            <a href={S.baneshwar.url} target="_blank" rel="noopener" className={link} lang="bn">
              {S.baneshwar.title}
            </a>{" "}
            (Bangla).
          </li>
          <li>
            The old scale (tola, seer, maund):{" "}
            <a href={S.traditional.url} target="_blank" rel="noopener" className={link}>
              {S.traditional.title}
            </a>
            .
          </li>
        </ul>
        <p>Checked on 1 November 2026.</p>
      </ContentSection>
    </>
  );
}
