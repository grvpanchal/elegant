import { useId, useState } from "react";

/**
 * Combobox.
 * - typing filters `options` and opens the listbox
 * - ArrowDown / ArrowUp move the active option and wrap
 * - Enter selects, Escape closes without clearing the query
 * - the input is role="combobox" with aria-expanded, aria-controls and
 *   aria-activedescendant pointing at the active option's id
 */
export default function Combobox({ options = [], onSelect }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Your code here.
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
