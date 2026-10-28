"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Rows as saved in the calculation history: one array of the given text
 * fields per row (ids are not kept), as JSON.
 */
export function rowsToJson<K extends string>(rows: readonly Record<K, string>[], fields: readonly K[]): string {
  return JSON.stringify(rows.map((row) => fields.map((field) => row[field])));
}

/**
 * Saved rows (from rowsToJson) back as field values. The JSON comes from
 * storage, so anything malformed is dropped: a bad row, or everything if it doesn't parse.
 */
export function rowsFromJson<K extends string>(json: string | undefined, fields: readonly K[]): Record<K, string>[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json ?? "");
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((row: unknown) => {
    if (!Array.isArray(row) || row.length !== fields.length || !row.every((v) => typeof v === "string")) return [];
    const values: readonly string[] = row;
    return [Object.fromEntries(fields.map((field, i) => [field, values[i] ?? ""])) as Record<K, string>];
  });
}

/**
 * State for a list of input rows (courses, semesters) that can be added and
 * removed. Rows get stable incrementing ids, so React keys and input ids never
 * depend on the array index. After add / remove / reset, focus moves to the
 * first field of the relevant row so keyboard and screen-reader users don't lose their place.
 *
 * @param createRow Builds an empty row for a new id.
 * @param focusTargetId DOM id of the first field of a row.
 */
export function useRowList<T extends { id: number }>({
  createRow,
  initialCount,
  maxRows,
  focusTargetId,
}: {
  createRow: (id: number) => T;
  initialCount: number;
  maxRows: number;
  focusTargetId: (rowId: number) => string;
}) {
  const nextId = useRef(initialCount + 1);
  const pendingFocus = useRef<number | null>(null);
  const [rows, setRows] = useState<T[]>(() => Array.from({ length: initialCount }, (_, i) => createRow(i + 1)));

  useEffect(() => {
    const id = pendingFocus.current;
    if (id === null) return;
    pendingFocus.current = null;
    document.getElementById(focusTargetId(id))?.focus();
  }, [rows, focusTargetId]);

  function takeId(): number {
    const id = nextId.current;
    nextId.current += 1;
    return id;
  }

  function updateRow(id: number, patch: Partial<T>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function addRow() {
    if (rows.length >= maxRows) return;
    const row = createRow(takeId());
    pendingFocus.current = row.id;
    setRows((current) => [...current, row]);
  }

  function removeRow(id: number) {
    if (rows.length <= 1) return;
    const index = rows.findIndex((row) => row.id === id);
    const neighbour = rows[index + 1] ?? rows[index - 1];
    pendingFocus.current = neighbour ? neighbour.id : null;
    setRows((current) => current.filter((row) => row.id !== id));
  }

  /** Back to the initial number of empty rows (fresh ids); focuses the first. */
  function resetRows() {
    const fresh = Array.from({ length: initialCount }, () => createRow(takeId()));
    pendingFocus.current = fresh[0]?.id ?? null;
    setRows(fresh);
  }

  /**
   * Replaces every row at once (fresh ids), e.g. when restoring a saved
   * calculation. Keeps at most maxRows; an empty list means the initial empty
   * rows. Focus stays where it is.
   */
  function replaceRows(values: readonly Partial<Omit<T, "id">>[]) {
    const fresh =
      values.length > 0
        ? values.slice(0, maxRows).map((value) => ({ ...createRow(takeId()), ...value }))
        : Array.from({ length: initialCount }, () => createRow(takeId()));
    pendingFocus.current = null;
    setRows(fresh);
  }

  return {
    rows,
    updateRow,
    addRow,
    removeRow,
    resetRows,
    replaceRows,
    canAdd: rows.length < maxRows,
    canRemove: rows.length > 1,
  };
}
