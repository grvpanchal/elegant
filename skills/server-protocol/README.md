# Server Protocol

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-protocol)

> `server-protocol` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

HTTPS/TLS protocol guidance — mandatory HTTPS, HSTS headers, cert management (Let's Encrypt, mkcert for dev), security headers (CSP, X-Frame-Options), and HTTP→HTTPS redirects. Use when hardening a deployment, fixing mixed-content warnings, or setting up trusted local-dev certificates.

## When to use

Setting up HTTPS in production or local dev (mkcert, Vite https); configuring HSTS and security headers; choosing a cert type (DV/OV/EV) or automating renewal; eliminating mixed-content warnings.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-protocol
```

Or copy the [`server-protocol/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/server/**/*.{js,ts}`
- `**/*ssl*.{js,ts}`
- `**/*https*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
