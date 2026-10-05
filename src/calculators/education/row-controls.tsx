import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@/components/ui/icons";

/** Icon button to remove one row. `label` is the accessible name, e.g. "Remove course 2". */
export function RemoveRowButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="size-11 shrink-0 px-0 text-slate-600"
    >
      <TrashIcon className="size-5" />
    </Button>
  );
}

/** "Add course" style button; explains itself when the row limit is reached. */
export function AddRowButton({
  label,
  limitMessage,
  disabled,
  onClick,
}: {
  label: string;
  limitMessage: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Button variant="secondary" onClick={onClick} disabled={disabled}>
        <PlusIcon className="size-5" />
        {label}
      </Button>
      {disabled && <p className="text-sm text-slate-600">{limitMessage}</p>}
    </div>
  );
}
