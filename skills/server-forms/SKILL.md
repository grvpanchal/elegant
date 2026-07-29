---
name: server-forms
description: Form construction and submission — controlled inputs as the single source of truth, on-blur/on-submit validation, `preventDefault` submit handlers, disabled-while-submitting guards, field-level error wiring via `aria-invalid`/`aria-describedby`, multi-step wizards, and schema validation with React Hook Form + Zod/Yup. Use when building or reviewing a form, adding validation, or fixing duplicate submissions and inaccessible error messages.
when_to_use: Building or reviewing a form component; choosing controlled vs uncontrolled inputs; picking a validation strategy (on change / on blur / on submit); wiring accessible error messages and labels; preventing double submissions during an in-flight request; designing multi-step or dynamic field-array forms; deciding whether a form library is worth the bundle.
paths:
  - "**/ui/molecules/*Form*/**/*"
  - "**/*Form*.{jsx,tsx,vue,js,ts}"
  - "**/ui/atoms/{Input,Select,Textarea,Checkbox}/**/*"
---

# Forms

## What is a Controlled Form?

A form is the primary channel for user input, and it has two possible owners of truth. In an **uncontrolled** form the DOM holds the value and you read it on submit (via `event.target` or a ref). In a **controlled** form the framework holds the value — `value={x}` plus `onChange={e => setX(e.target.value)}` — so every keystroke round-trips through state. Controlled is the default for anything that needs real-time validation, computed values, conditional fields, or programmatic reset; uncontrolled (usually via React Hook Form) wins on re-render cost for large forms.

## Key Principles

1. **One Source of Truth**: Bind `value` to state and update it in `onChange`. When state drives the input, the UI can never drift from what you think the user typed — and you can clear, prefill, or transform the value at will.

2. **Client Validation Is UX, Server Validation Is Security**: Validate on blur for per-field feedback and on submit for the whole form, then re-validate on the server. Anyone can bypass the client, so the server owns data integrity.

3. **Guard the Submit**: Always `e.preventDefault()` in the handler (a real submit reloads the page and aborts your fetch), reject empty/whitespace input, and disable the submit control while the request is in flight so a fast double-click cannot create two records.

## Best Practices

✅ **DO**:
- Bind every input to state (or register it with a form library) rather than reading the DOM
- Call `e.preventDefault()` in `onSubmit` and submit from the `<form>`, not from a click handler
- Associate a `<label htmlFor>` with every control (visually hidden is fine)
- Wire errors with `aria-invalid` + `aria-describedby`, and form-level errors with `role="alert"`
- Disable the submit button and show progress text while submitting
- Trim and normalise values before validating or sending

❌ **DON'T**:
- Use `placeholder` as the only label
- Validate noisily on every keystroke for required fields (blur is calmer)
- Trust client validation for anything security- or integrity-relevant
- Leave the button enabled during an in-flight request
- Put a submit-side effect (fetch, dispatch, navigation) inside a presentational form component
- Reach for a form library for two fields — or hand-roll field arrays and async validation for twenty

## Code Patterns

### Controlled Field with Accessible Errors

```jsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<div className="form-group">
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    onBlur={() => setError(/\S+@\S+\.\S+/.test(email) ? '' : 'Email is invalid')}
    aria-invalid={error ? 'true' : 'false'}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && <span id="email-error" className="error">{error}</span>}
</div>
```

`aria-describedby` is what makes a screen reader read the message when focus lands on the field; the visual `<span>` alone does not.

### Submit Handler with Guards

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();                       // no page reload, no aborted fetch
  const errors = validate(values);
  if (Object.keys(errors).length) return setErrors(errors);

  setSubmitting(true);
  try {
    await onSave(values);                   // side effect owned by the caller
  } catch (err) {
    setErrors({ form: err.message });       // render with role="alert"
  } finally {
    setSubmitting(false);                   // always re-enable
  }
};

<button type="submit" disabled={submitting}>
  {submitting ? 'Saving…' : 'Save'}
</button>
```

### Schema Validation (React Hook Form + Zod)

```jsx
const schema = z.object({
  username: z.string().min(3, 'At least 3 characters'),
  email: z.string().email('Email must be valid'),
  password: z.string().min(8, 'At least 8 characters'),
});

const { register, handleSubmit, formState: { errors, isSubmitting } } =
  useForm({ resolver: zodResolver(schema), mode: 'onBlur' });

<form onSubmit={handleSubmit(onSubmit)} noValidate>
  <input id="email" {...register('email')} aria-invalid={!!errors.email} />
  {errors.email && <span className="error">{errors.email.message}</span>}
  <button type="submit" disabled={isSubmitting}>Create account</button>
</form>
```

One schema drives validation, types, and messages — and the same schema can run on the server. `mode: 'onBlur'` gives per-field feedback without validating on every keystroke.

### Multi-Step Forms

```jsx
const [step, setStep] = useState(1);
const [values, setValues] = useState(initialValues);   // one object for all steps

const next = () => { if (validateStep(step, values)) setStep((s) => s + 1); };
```

Model the wizard as a state machine with per-step validation over a *single* data object, persist a draft (localStorage or a draft endpoint) so a refresh doesn't destroy progress, and always offer back navigation plus visible progress.

### In the elegant templates

`ui/molecules/AddTodoForm/AddTodoForm.component.jsx` is the reference form and it stays purely presentational — it owns only the field's own state, never the submission side effect:

```jsx
const [inputValue, setInputValue] = useState(todoValue || '');

<form onSubmit={(e) => {
  e.preventDefault();
  if (!inputValue.trim()) return;              // whitespace guard
  todoValue ? onTodoUpdate(inputValue) : onTodoAdd(inputValue);
  setInputValue('');
}}>
  <Input value={inputValue} disabled={isLoading} placeholder={placeholder} onChange={handleChange} />
  <Button isLoading={isLoading} type="submit">{label}</Button>
</form>
```

The `onTodoAdd` / `onTodoUpdate` callbacks and `isLoading` arrive as props from `containers/TodoListContainer.jsx`, which dispatches `createTodo` / `updateTodo`. Keep it that way: no `useDispatch`, no `fetch`, no selector inside `src/ui/**`. The `Input` atom spreads props onto a real `<input>` and renders an `sr-only` `<label htmlFor>` so the control is always labelled — pass a `name` (and ideally an explicit `id`) so that label is meaningful, and pass `aria-invalid`/`aria-describedby` straight through when you add validation.

## Related Terminologies

- **Molecule** (UI) - Forms are molecules composed of Input and Button atoms
- **Atom** (UI) - `Input` wraps the native control and its label
- **Container** (Server) - Owns submission side effects and passes callbacks down
- **Events** (UI) - Forms emit `onSubmit`-style callbacks rather than acting directly
- **Accessibility** (UI) - Labels, `aria-invalid`, `role="alert"`, focus order
- **API** (Server) - Server-side re-validation of every submitted payload

## Quality Gates

- [ ] Every control has an associated `<label>` (visually hidden allowed)
- [ ] `onSubmit` calls `e.preventDefault()` and validates before sending
- [ ] Errors exposed via `aria-invalid` + `aria-describedby`; form errors use `role="alert"`
- [ ] Submit button disabled (with progress text) while a request is in flight
- [ ] Empty/whitespace-only input rejected before submit
- [ ] Form component stays presentational — the container owns the dispatch/fetch

**Source**: `/docs/server/forms.md`
