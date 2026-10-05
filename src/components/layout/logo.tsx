import Link from "next/link";

/** Mark: a division sign (÷) on a green tile; the top dot nods to the flag's red circle. */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={className}>
      <rect width="32" height="32" rx="8" className="fill-brand-600" />
      <rect x="7" y="14.25" width="18" height="3.5" rx="1.75" fill="#fff" />
      <circle cx="16" cy="8.5" r="3" className="fill-coral-500" />
      <circle cx="16" cy="23.5" r="3" fill="#fff" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex min-h-11 items-center gap-2.5 rounded-xl font-display text-2xl font-bold tracking-tight text-slate-900"
    >
      <LogoMark className="size-9 transition-transform duration-200 motion-safe:group-hover:-rotate-12" />
      <span>
        Hisab<span className="text-brand-600">BD</span>
      </span>
    </Link>
  );
}
