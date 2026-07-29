# Server PWA

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-pwa)

> `server-pwa` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Progressive Web Apps — web app manifest fields and icon sizes, service-worker lifecycle (register/install/activate/fetch) with `skipWaiting`/`clients.claim`, cache strategies (cache-first, network-first, stale-while-revalidate), offline fallbacks and cache trimming, Background Sync via IndexedDB, Push + Notifications with VAPID, `beforeinstallprompt`, and the PRPL pattern. Use when making a site installable, adding or debugging a service worker, choosing a cache strategy, or shipping offline/push behaviour.

## When to use

Writing or reviewing a `manifest.json`/`manifest.webmanifest`; registering or versioning a service worker; picking a cache strategy per resource type; adding an offline fallback page; queueing offline form submissions with Background Sync; wiring web push with VAPID keys; building a custom install button; diagnosing why the install prompt never fires or why users are stuck on a stale worker.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-pwa
```

Or copy the [`server-pwa/`](.) folder into your agent's skills directory.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/manifest.{json,webmanifest}`
- `**/{sw,service-worker,serviceWorker}.{js,ts}`
- `**/workbox-config.{js,cjs,mjs}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
