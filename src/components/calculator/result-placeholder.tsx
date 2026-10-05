/** Where the result will appear: shown before the first result and while inputs need fixing. */
export function ResultPlaceholder({
  title,
  children,
  preview,
}: {
  title: string;
  children: React.ReactNode;
  /** Optional muted preview of the result's shape. */
  preview?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-5 sm:p-6">
      {preview && (
        <div aria-hidden="true" className="mb-3 text-slate-300 select-none">
          {preview}
        </div>
      )}
      <p className="font-display text-lg font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{children}</p>
    </div>
  );
}
