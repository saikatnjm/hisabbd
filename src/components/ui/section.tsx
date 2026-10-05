import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";

interface SectionProps {
  id: string;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

/** Page section with an h2 heading; labelled for assistive tech. */
export function Section({ id, title, description, className, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-4 py-10 sm:py-14", className)}>
      <Container>
        <div className="mb-6 max-w-2xl sm:mb-8">
          <h2 id={headingId} className="font-display text-3xl font-bold tracking-tight text-balance text-slate-900 sm:text-4xl">
            {title}
          </h2>
          {description && <p className="mt-2 text-lg text-pretty text-slate-600">{description}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}
