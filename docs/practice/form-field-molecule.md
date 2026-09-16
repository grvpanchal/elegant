---
title: Build an accessible form field
layout: question
slug: form-field-molecule
format: ui-coding
difficulty: medium
layer: ui
topics: [molecule, props, accessibility]
skill: ui-molecule
minutes: 30
frameworks: [react, angular]
summary: Label, control, hint and error wired together by id so a screen reader reads the whole field, not just the box.
---

Build a `FormField` molecule that composes a label, a control, an optional hint
and an optional error into one unit.

- The label is associated with the control (clicking the label focuses it).
- The hint and the error are announced when the control is focused.
- An invalid control is marked invalid programmatically, not just in red.
- The error replaces nothing — the hint stays readable.
- Ids are generated; two fields on one page must not collide.
- A required field says so in text, not only with an asterisk.

Starter files are in `practice/workspace/form-field-molecule/<framework>/`.

## Solution

### Approach 1: generated ids and `aria-describedby`

```jsx
export default function FormField({ label, hint, error, required = false, children }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`field${error ? " field--invalid" : ""}`}>
      <label className="field__label" htmlFor={id}>
        {label}{required && <span className="field__required"> (required)</span>}
      </label>
      {hint && <p className="field__hint" id={hintId}>{hint}</p>}
      {cloneElement(children, {
        id,
        required,
        "aria-describedby": describedBy,
        "aria-invalid": error ? "true" : undefined,
      })}
      {error && <p className="field__error" id={errorId} role="alert">{error}</p>}
    </div>
  );
}
```

`aria-describedby` takes a **space-separated list**, which is what lets the hint
and the error both be read. Most implementations get this wrong by overwriting
the hint's id with the error's, so the hint becomes unreachable at exactly the
moment the user needs it most.

### Approach 2: a render prop, so the field never touches the control

`cloneElement` is convenient and silently fails on a fragment or a wrapped
child. Handing the ids back instead is explicit:

```jsx
<FormField label="Email" hint="Work address" error={error}>
  {({ id, describedBy, invalid }) => (
    <input id={id} type="email" aria-describedby={describedBy} aria-invalid={invalid} />
  )}
</FormField>
```

More typing at every call site, and it works with any control — a native
`<input>`, a third-party combobox, a group of radios where the "control" is a
`<fieldset>` and the label is a `<legend>`. Angular's equivalent is content
projection plus an exported template context, which is why the Angular starter
looks like this version rather than the first.

## Trade-offs

**`aria-describedby` vs `aria-errormessage`.** The dedicated attribute is the
semantically correct home for an error, and support is still thin enough that
`describedby` is the pragmatic choice. Using both is safe and is what most
component libraries settled on.

**`role="alert"` on the error.** It announces a validation failure the moment it
appears, which is right on submit and noisy on every keystroke. Validate on
blur and on submit, not on input, or the alert fires while the user is still
typing their email address.

**Colour is not a state.** `aria-invalid` is what a screen reader and an
automated test can both observe; a red border is what a sighted user sees.
Shipping only the second is the most common accessibility failure in forms, and
the cheapest to fix.

**Required.** An asterisk is a convention, not a word. Put "(required)" in the
label text and let `required` on the control carry the programmatic meaning —
then a screen reader reads the field once, correctly, instead of announcing
"star".

## Related

- Reading: [Molecule](../ui/molecule.html) · [Props](../ui/props.html) · [Accessibility](../ui/accessibility.html) · [Forms](../server/forms.html)
- Agent Skill: `ui-molecule`
