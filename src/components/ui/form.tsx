import { cn } from "@/lib/cn";
import { AlertIcon, ChevronDownIcon } from "@/components/ui/icons";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("mb-1.5 block text-sm font-medium text-slate-800", className)} {...props} />
  );
}

/** 16px+ text prevents iOS zoom on focus; 48px height for touch. */
export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "block h-12 w-full rounded-xl border-2 border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 hover:border-slate-400 focus-visible:border-brand-600 aria-invalid:border-red-600 aria-invalid:bg-red-50/40 disabled:cursor-not-allowed disabled:bg-slate-50",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Number/text input with a fixed prefix or suffix inside the box, e.g. "৳" or "%".
 * Pass `inputMode="decimal"` for numbers: it shows the numeric keypad on phones
 * while still allowing commas and Bangla digits (type="number" would not).
 */
export function AffixInput({
  prefix,
  suffix,
  className,
  ...props
}: React.ComponentProps<"input"> & { prefix?: string; suffix?: string }) {
  return (
    <div className="relative">
      {prefix && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-semibold text-slate-500"
        >
          {prefix}
        </span>
      )}
      <Input className={cn(prefix && "pl-9", suffix && "pr-14", className)} {...props} />
      {suffix && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-slate-500"
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

/** Native select with a custom chevron. */
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "block h-12 w-full appearance-none rounded-xl border-2 border-slate-300 bg-white pr-10 pl-3 text-base text-slate-900 hover:border-slate-400 focus-visible:border-brand-600 aria-invalid:border-red-600",
          className,
        )}
        {...props}
      />
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

/**
 * Pick one option from a few (units, modes). Native radio buttons styled as
 * pills, so it is keyboard and screen-reader friendly without extra script.
 */
export function SegmentedControl<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  hideLegend = false,
}: {
  name: string;
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  hideLegend?: boolean;
}) {
  return (
    <fieldset>
      <legend className={hideLegend ? "sr-only" : "mb-1.5 block text-sm font-medium text-slate-800"}>
        {legend}
      </legend>
      <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative inline-flex min-h-10 cursor-pointer items-center rounded-lg px-3 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900 has-[:checked]:bg-white has-[:checked]:text-brand-800 has-[:checked]:shadow-sm has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand-600"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Hint or error text under a field. Link it via the input's aria-describedby. */
export function FieldMessage({
  id,
  error = false,
  children,
}: {
  id: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  if (error) {
    return (
      <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
        <AlertIcon className="mt-0.5 size-4 shrink-0" />
        <span>{children}</span>
      </p>
    );
  }
  return (
    <p id={id} className="mt-1.5 text-sm text-slate-600">
      {children}
    </p>
  );
}

interface FormFieldControlProps {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

/**
 * Label + control + error + hint, with ids and ARIA wired up.
 * The error sits directly under the control, before the hint.
 *
 *   <FormField id="dob" label="Date of birth" error={msg}>
 *     {(control) => <Input type="date" {...control} />}
 *   </FormField>
 */
export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (control: FormFieldControlProps) => React.ReactNode;
}) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {error && (
        <FieldMessage id={errorId} error>
          {error}
        </FieldMessage>
      )}
      {hint && <FieldMessage id={hintId}>{hint}</FieldMessage>}
    </div>
  );
}
