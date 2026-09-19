import { useMemo, useState } from "react";
import "./DataTable.style.css";

/**
 * DataTable with sortable columns.
 * - click cycles asc -> desc -> unsorted (original order)
 * - the <th> carries aria-sort="ascending|descending|none"
 * - the header contains a real <button> so the keyboard works for free
 * - the sort is STABLE: equal values keep their previous relative order
 * - sorting is memoised on [rows, column, direction] only
 */
export default function DataTable({ rows = [], columns = [] }) {
  const [sort, setSort] = useState({ column: null, direction: "asc" });

  const sorted = useMemo(() => {
    // Your code here.
    return rows;
  }, [rows, sort.column, sort.direction]);

  return (
    <table className="data-table">
      <thead>
        <tr>{columns.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row.id}>{columns.map((c) => <td key={c.key}>{row[c.key]}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}
