import { cloneElement, useId } from "react";
import "./FormField.style.css";

/**
 * FormField molecule.
 * - the label is associated with the control (htmlFor / id)
 * - hint and error are BOTH referenced from aria-describedby (space separated)
 * - an invalid control gets aria-invalid="true", not just a red border
 * - ids are generated so two fields on a page cannot collide
 * - a required field says "(required)" in the label text
 */
export default function FormField({ label, hint, error, required = false, children }) {
  const id = useId();
  // Your code here.
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, { id })}
    </div>
  );
}
