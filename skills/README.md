# Elegant Agent Skills

![Agent Skills](https://img.shields.io/badge/Agent%20Skills-35-3F51B5)
![Standard](https://img.shields.io/badge/standard-agentskills.io-blue)

This folder contains the **Agent Skills** that document the architecture every
[`elegant`](../README.md) template implements. Each skill is a self-contained
folder with a `SKILL.md` written to the [Agent Skills open standard](https://agentskills.io) —
prose design guidance an AI agent (or a human) can load when authoring or
reviewing code in that area.

Skills can be published to [skills.sh](https://skills.sh) or dropped into
`~/.claude/skills/` to give an agent durable, on-demand knowledge of the
elegant front-end architecture.

## How a skill is structured

```
skills/<skill-name>/
└── SKILL.md      # YAML frontmatter (name, description, when_to_use, paths) + prose guidance
```

The frontmatter's `paths` globs let an agent auto-surface the right skill based
on the file being edited (e.g. `ui-atom` activates under `**/ui/atoms/**`).

## Skills

The 35 skills are grouped into three layers that mirror the template source
layout (`src/ui`, `src/state`, and the server/routing concerns).

### UI — `src/ui/{atoms,molecules,organisms,templates,skeletons}` and primitives

| Skill | What it covers |
| --- | --- |
| [`ui-atomic-design`](./ui-atomic-design/SKILL.md) | The five-level component hierarchy (Atoms → Molecules → Organisms → Templates → Pages) as a shared vocabulary and folder convention. |
| [`ui-atom`](./ui-atom/SKILL.md) | Atoms — the smallest single-purpose building blocks (buttons, inputs, icons, labels). |
| [`ui-molecule`](./ui-molecule/SKILL.md) | Molecules — functional groups of atoms (SearchBar, FormField) with one cohesive purpose. |
| [`ui-organism`](./ui-organism/SKILL.md) | Organisms — complex feature-level sections that compose molecules and connect to state. |
| [`ui-template`](./ui-template/SKILL.md) | Templates — page-level wireframes arranging organisms into layout slots, no data fetching. |
| [`ui-skeleton`](./ui-skeleton/SKILL.md) | Skeleton loading placeholders that mirror final content and prevent layout shift. |
| [`ui-component`](./ui-component/SKILL.md) | General component design — encapsulation, single-responsibility, props-in/events-out. |
| [`ui-element`](./ui-element/SKILL.md) | Component vs Element vs DOM node, and custom-element registration. |
| [`ui-dom`](./ui-dom/SKILL.md) | DOM manipulation essentials — querySelector, textContent vs innerHTML, fragment batching. |
| [`ui-events`](./ui-events/SKILL.md) | DOM event handling — capture/bubble, delegation, preventDefault vs stopPropagation, cleanup. |
| [`ui-attributes`](./ui-attributes/SKILL.md) | HTML attribute semantics — boolean attributes, attribute-vs-property, `data-*`, ARIA. |
| [`ui-props`](./ui-props/SKILL.md) | Component props design — read-only data, unidirectional flow, typed interfaces, defaults. |
| [`ui-accessibility`](./ui-accessibility/SKILL.md) | Web accessibility — semantic HTML, ARIA, keyboard nav, focus management, WCAG POUR. |
| [`ui-theme`](./ui-theme/SKILL.md) | Design-token systems — semantic CSS custom properties and light/dark theming. |
| [`ui-story`](./ui-story/SKILL.md) | Storybook story authoring — CSF, argTypes, play functions, edge-state coverage. |

### State — `src/state` (Redux / RTK / NgRx / Pinia)

| Skill | What it covers |
| --- | --- |
| [`state-state`](./state-state/SKILL.md) | State-management fundamentals — local vs lifted vs global vs server vs URL state. |
| [`state-store`](./state-store/SKILL.md) | Redux store architecture — configureStore, slices, normalised shape, typed hooks. |
| [`state-actions`](./state-actions/SKILL.md) | Action design — FSA-compliant events, request/success/failure patterns. |
| [`state-reducer`](./state-reducer/SKILL.md) | Reducer design — pure functions, immutable updates, combineReducers composition. |
| [`state-selectors`](./state-selectors/SKILL.md) | Selectors — Reselect memoisation, composition, parameterised factories. |
| [`state-middleware`](./state-middleware/SKILL.md) | Redux middleware — the `store => next => action` pipeline for side effects and async. |
| [`state-operations`](./state-operations/SKILL.md) | Async operations — status tracking, optimistic updates, race-condition handling. |
| [`state-ajax`](./state-ajax/SKILL.md) | Async data-fetching — Fetch vs Axios, cancellation, createAsyncThunk integration. |
| [`state-crud`](./state-crud/SKILL.md) | CRUD slice patterns — consistent action naming and normalised `{ byId, allIds }` shapes. |

### Server — routing, rendering, and deployment concerns

| Skill | What it covers |
| --- | --- |
| [`server-page`](./server-page/SKILL.md) | Page components — the thin data-fetching layer binding a route to a template. |
| [`server-container`](./server-container/SKILL.md) | Container/presentational split — smart containers vs dumb presentational children. |
| [`server-router`](./server-router/SKILL.md) | Client-side routing — route tables, dynamic segments, guards, lazy chunks, scroll/focus. |
| [`server-ssr`](./server-ssr/SKILL.md) | Server-Side Rendering — HTML generation, hydration, prefetching, mismatch debugging. |
| [`server-ssg`](./server-ssg/SKILL.md) | Static Site Generation — build-time pre-rendering, getStaticPaths, ISR revalidation. |
| [`server-app-shell`](./server-app-shell/SKILL.md) | App Shell architecture — cached skeleton served via Service Worker, offline fallbacks. |
| [`server-api`](./server-api/SKILL.md) | API service-layer — client with interceptors, domain services, token refresh, cancellation. |
| [`server-authentication`](./server-authentication/SKILL.md) | Authentication — JWT access+refresh flows, secure storage, route guards. |
| [`server-proxy`](./server-proxy/SKILL.md) | Proxy configuration — dev-server proxies for CORS and production reverse proxies. |
| [`server-protocol`](./server-protocol/SKILL.md) | HTTPS/TLS guidance — mandatory HTTPS, HSTS, certs, security headers. |
| [`server-mfe`](./server-mfe/SKILL.md) | Micro-frontend architecture — independently deployable modules, shared runtimes, event bus. |

## Using these skills

- **With Claude Code / agents:** copy a skill folder into `~/.claude/skills/`,
  or reference it from a project. The agent loads the `SKILL.md` when its
  `paths` match the file you're editing.
- **Publish:** push to [skills.sh](https://skills.sh) following the
  [Agent Skills standard](https://agentskills.io).
- **Read as docs:** every `SKILL.md` is plain Markdown — open it directly to
  learn the pattern it documents.
