---
title: Design an offline-first task list
layout: question
slug: offline-first-list
format: system-design
difficulty: medium
layer: state
topics: [crud, ajax, operations, store]
skill: state-crud
minutes: 35
summary: Writes that happen without a network, a sync that resolves conflicts, and a UI that never lies about what is saved.
---

A field-work task list runs on phones with unreliable connectivity. Users add,
edit and complete tasks while offline, sometimes for hours. When the network
returns, everything syncs.

Design the state layer. Be explicit about what is stored, what is optimistic,
how conflicts resolve, and what the user sees at each stage.

## Solution

### Three stores, not one

**Durable local store** (IndexedDB) — the source of truth while offline. Every
task carries a client-generated id, a `updatedAt`, and a `syncState` of
`synced`, `pending` or `conflict`.

**In-memory store** — what components read, hydrated from IndexedDB on start.
[Selectors](../state/selectors.html) build the screen's shape from it.

**Outbox** — an ordered, durable queue of *operations*, not of resulting state:
`{ id, op: 'create' | 'update' | 'complete', taskId, fields, at }`. This is the
decision the design hangs on. Queueing the resulting task means a later sync
overwrites concurrent server changes wholesale; queueing the operation lets the
server apply just the field the user actually touched.

### Ids, because the server has not seen this task yet

Generate a UUID on the client at creation time and keep it as the permanent id.
The alternative — a temporary id swapped for the server's on sync — means every
reference to that task (the outbox, an open detail screen, a pending edit) has
to be rewritten at an unpredictable moment. Client-generated ids also make
`create` idempotent: a retried create with the same id is a no-op server-side
rather than a duplicate row.

### Optimistic UI with honest state

Apply every operation locally and immediately; the user must never wait for a
network to see their own edit. But do not pretend it is saved. Each row shows
its `syncState`, and the list header shows "3 changes waiting to sync" when the
outbox is non-empty. The rule is: optimistic about the *result*, honest about
the *status*.

### Sync and conflicts

On reconnect, drain the outbox in order with a bounded retry and exponential
backoff. Send `updatedAt` with each operation; the server rejects an update
whose base is older than its current record, and the client marks that task
`conflict`.

For resolution, pick per field rather than per record. Completion is a
monotonic flag — once complete, stay complete, so last-write-wins is safe. Free
text is not: silently discarding someone's notes is the failure users remember,
so surface both versions and let them choose. Saying "last write wins" for the
whole record is the answer that sounds decisive and loses data.

### What you measure

| Signal | Why |
|---|---|
| Outbox depth, p95 | How far behind reality the server is |
| Time from reconnect to empty outbox | Whether sync actually drains |
| Conflict rate per 1,000 operations | Whether the granularity is right |
| Operations dropped after max retries | Silent data loss, the one that must be zero |

## Trade-offs

**Operations vs state in the outbox.** Operations preserve intent and survive
concurrent edits; they cost you a server that understands each operation type.
Shipping whole records is simpler and loses the other person's work.

**IndexedDB vs localStorage.** localStorage is synchronous, string-only and
small, and it blocks the main thread — fine for a flag, wrong for a task list.

**Sync on reconnect vs a background sync worker.** A service worker's Background
Sync keeps draining after the tab closes, which is what field users expect, and
it adds a second runtime with its own deployment story and its own bugs. Ship
the in-page sync first and add the worker when the data says users close the
tab before the queue drains.

The thing that most often sinks this design is unbounded retry: an operation the
server will never accept retries forever, the outbox never empties, and every
later change is stuck behind it. Cap the attempts, move the failure into a
visible "could not sync" state, and let the user act on it.

## Related

- Reading: [CRUD](../state/crud.html) · [AJAX](../state/ajax.html) · [Operations](../state/operations.html) · [PWA](../server/pwa.html)
- Playbook: [State management](../playbooks/state-management.html)
- Agent Skill: `state-crud`
