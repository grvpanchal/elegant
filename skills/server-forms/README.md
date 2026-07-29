# Server Forms

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-forms)

> `server-forms` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Form construction and submission — controlled inputs as the single source of truth, on-blur/on-submit validation, `preventDefault` submit handlers, disabled-while-submitting guards, field-level error wiring via `aria-invalid`/`aria-describedby`, multi-step wizards, and schema validation with React Hook Form + Zod/Yup. Use when building or reviewing a form, adding validation, or fixing duplicate submissions and inaccessible error messages.

## When to use

Building or reviewing a form component; choosing controlled vs uncontrolled inputs; picking a validation strategy (on change / on blur / on submit); wiring accessible error messages and labels; preventing double submissions during an in-flight request; designing multi-step or dynamic field-array forms; deciding whether a form library is worth the bundle.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-forms
```

Or copy the [`server-forms/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/molecules/*Form*/**/*`
- `**/*Form*.{jsx,tsx,vue,js,ts}`
- `**/ui/atoms/{Input,Select,Textarea,Checkbox}/**/*`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
