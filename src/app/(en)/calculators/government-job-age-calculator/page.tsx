import { JobAgeCalculator } from "@/calculators/job-age/job-age-calculator";
import { JobAgeCalculatorContent } from "@/calculators/job-age/content";
import { jobAgeCalculator } from "@/calculators/job-age/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(jobAgeCalculator);

export default function GovernmentJobAgeCalculatorPage() {
  return (
    <CalculatorPage calculator={jobAgeCalculator} content={<JobAgeCalculatorContent />}>
      <JobAgeCalculator />
    </CalculatorPage>
  );
}
