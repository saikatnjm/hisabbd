import type { CalculatorMeta } from "@/calculators/types";

export const bmiCalculator: CalculatorMeta = {
  slug: "bmi-calculator",
  name: "BMI Calculator",
  nameBn: "বিএমআই ক্যালকুলেটর",
  category: "health",
  icon: "scale",
  summary: "Find your body mass index from your height and weight, and the healthy weight range for your height.",
  keywords: ["bmi", "body mass index", "weight", "height", "obesity", "overweight", "healthy weight", "ওজন", "উচ্চতা"],
  seo: {
    title: "BMI Calculator: Body Mass Index for Adults",
    description:
      "Calculate your BMI from height (cm or feet and inches) and weight (kg or lb). See your WHO adult category and the healthy weight range for your height.",
  },
  addedOn: "2026-10-05",
  related: ["age-calculator"],
  faqs: [
    {
      question: "How is BMI calculated?",
      answer:
        "BMI is your weight in kilograms divided by your height in metres squared. For example, 70 kg at 1.70 m gives 70 ÷ (1.70 × 1.70) = 24.2. If you enter pounds, feet or inches, they are first converted exactly (1 lb = 0.45359237 kg, 1 in = 2.54 cm).",
    },
    {
      question: "What are the BMI categories for adults?",
      answer:
        "The World Health Organization’s adult categories are: below 18.5 underweight, 18.5 to 24.9 healthy weight, 25 to 29.9 overweight, and 30 or more obesity. Obesity is further split into class I (30 to 34.9), class II (35 to 39.9) and class III (40 or more).",
    },
    {
      question: "Is BMI accurate?",
      answer:
        "BMI is a quick screening measure, not a diagnosis. It doesn’t measure body fat or where fat is carried, so it can be misleading for very muscular people, older adults and others. A doctor looks at more than BMI to judge health.",
    },
    {
      question: "Can I use this BMI calculator for children or teenagers?",
      answer:
        "No. These categories are for adults aged 18 and over. For children and teenagers, BMI is compared with growth charts for their age and sex, which this calculator doesn’t do. Ask a doctor or health worker instead.",
    },
    {
      question: "Are the BMI cut-offs different for South Asians?",
      answer:
        "A WHO expert consultation in 2004 noted that many Asian populations have a higher risk of health problems at a lower BMI than the standard cut-offs suggest, and proposed additional public-health cut-off points of 23 and 27.5. This calculator uses the standard WHO categories, so treat that as background and ask a doctor what it means for you.",
    },
    {
      question: "Why does the calculator reject some heights and weights?",
      answer:
        "To catch typing mistakes, it accepts heights from 50 to 272 cm and weights from 2 to 650 kg. These are limits for checking input, not medical limits. If you enter feet and inches, inches must be below 12.",
    },
  ],
};
