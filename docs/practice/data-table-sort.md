---
title: Make a data table sortable
layout: question
slug: data-table-sort
format: ui-coding
difficulty: hard
layer: ui
topics: [organism, events, accessibility, rwd]
skill: ui-organism
minutes: 45
frameworks: [react, vue]
summary: Column sorting that is stable, announced, keyboard-operable and does not re-sort 5,000 rows on every render.
---

A table of 5,000 orders needs column sorting.

- Clicking a header sorts ascending, then descending, then returns to the
  unsorted order.
- The sorted column is announced to a screen reader, with its direction.
- Headers are operable by keyboard.
- Equal values keep their previous relative order (a stable sort), so sorting by
  status then by date gives a meaningful secondary order.
- Sorting does not run again when an unrelated piece of state changes.
- The table is readable on a phone.

Starter files are in `practice/workspace/data-table-sort/<framework>/`.

## Solution

### Approach 1: `aria-sort` on a native `<th>` with a button inside

```jsx
<th scope="col" aria-sort={sortAriaFor(column)}>
  <button type="button" className="th__sort" onClick={() => cycle(column)}>
    {column.label}
    <span aria-hidden="true">{glyphFor(column)}</span>
  </button>
</th>
```

`aria-sort` takes `ascending`, `descending` or `none`, and it belongs on the
`<th>`, not on the button. A screen reader then reads "Date, column header,
ascending" as the user moves through the header row — which is the entire
accessibility requirement, met by one attribute.

The button inside the header is what makes it keyboard-operable for free. A
`<th onClick>` with `tabindex="0"` and a manual `Enter`/`Space` handler is the
usual alternative and it reimplements a button, badly: `Space` scrolls the page
unless you preventDefault, and the element never announces itself as
interactive.

### Approach 2: sort in a memo, keyed on what actually matters

```jsx
const sorted = useMemo(() => {
  if (!sort.column) return rows;                 // third click: original order
  const indexed = rows.map((row, i) => [row, i]); // decorate with position
  indexed.sort(([a, ai], [b, bi]) => {
    const cmp = compare(a[sort.column], b[sort.column]);
    return cmp !== 0 ? (sort.direction === "asc" ? cmp : -cmp) : ai - bi;
  });
  return indexed.map(([row]) => row);
}, [rows, sort.column, sort.direction]);
```

Two things are doing work here. The memo's dependency list is `rows` and the
two sort fields — not the whole state object — so toggling an unrelated filter
does not re-sort 5,000 rows. And the decorate-sort-undecorate keeps ties in
their original order: `Array.prototype.sort` is specified as stable in modern
engines, but only with respect to the array you hand it, and reversing a
comparator for descending destroys that stability unless the tiebreak is
explicit.

Returning `rows` unchanged for the unsorted state matters too — a new array
every render defeats every downstream `memo` and virtualiser.

## Trade-offs

**Comparator correctness is where these break.** `"10" < "9"` is true as
strings. Dates as `DD/MM/YYYY` strings sort by day. `undefined` sorts
unpredictably. Type the column (`number | string | date`) and pick the
comparator from the type rather than inferring per value — and decide where
empty values go, because "nulls last" is almost always what a reader expects
and never what the default gives.

**Client vs server sorting.** Five thousand rows sort in milliseconds and the
question never comes up. Fifty thousand rows on a mid-range phone will drop
frames, and at that point sorting belongs in the query, the header becomes a
parameter in the URL, and the whole component gets simpler — at the cost of a
round trip per click.

**Three states, not two.** Returning to the unsorted order is the affordance
people forget, and without it a user who sorted by mistake cannot get back to
the order the server chose.

**Phone layout.** A five-column table does not shrink. Either let it scroll
horizontally inside a labelled region with `tabindex="0"` so it is keyboard
scrollable, or switch to a stacked card per row below the breakpoint — but do
not hide columns silently, which changes what the data says.

## Related

- Reading: [Organism](../ui/organism.html) · [Events](../ui/events.html) · [Accessibility](../ui/accessibility.html) · [RWD](../ui/rwd.html)
- Agent Skill: `ui-organism`
