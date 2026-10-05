import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/ui/container";

/** Simple text page (About, Privacy, Terms): breadcrumb, H1, readable body. */
export function ProsePage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  /** e.g. "5 October 2026" */
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-brand-100 bg-brand-50 bg-graph">
        <Container className="py-5 sm:py-8">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title }]} />
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:mt-6 sm:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-3 max-w-2xl text-lg text-slate-700">{intro}</p>}
          {updated && <p className="mt-2 text-sm text-slate-600">Last updated {updated}</p>}
        </Container>
      </div>
      <Container className="py-8 sm:py-12">
        <div className="max-w-3xl space-y-10">{children}</div>
      </Container>
    </>
  );
}
