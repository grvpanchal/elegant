# Server Proxy

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-proxy)

> `server-proxy` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Proxy configuration — dev-server proxies (Vite, webpack, CRA setupProxy) to dodge CORS, plus production reverse proxies (Nginx, Cloudflare) for SSL termination, load balancing, and WebSocket forwarding. Use when wiring /api forwarding in local dev, debugging CORS, or writing Nginx configs for deployment.

## When to use

Configuring Vite/webpack/CRA dev proxies to avoid CORS; writing Nginx/Cloudflare reverse-proxy rules; forwarding WebSocket upgrades; separating dev-time vs production proxy strategies.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-proxy
```

Or copy the [`server-proxy/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/proxy/**/*.{js,ts}`
- `**/vite.config*.{js,ts}`
- `**/webpack.config*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
