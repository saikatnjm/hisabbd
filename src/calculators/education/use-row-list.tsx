"use client";

import { useEffect, useRef, useState } from "react";

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

  return {
    rows,
    updateRow,
    addRow,
    removeRow,
    resetRows,
    canAdd: rows.length < maxRows,
    canRemove: rows.length > 1,
  };
}
