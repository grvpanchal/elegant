# Tickets: decisions only a person can make

The offices of the elegant organisation prepare work, build it and check it. They never commit, push, publish, pay, or sign up for an account. Sometimes an office's work waits on something only a person can do:

- a login that only the CEO holds (Supabase, GitHub, LinkedIn, Facebook, PayPal);
- a decision about money or the law;
- a manual step that has no API.

When that happens, the COO writes a ticket in this folder and the CEO owns it. Anything an office can do itself goes to Linear as an ordinary issue, not here.

## Format

Each decision gets its own Markdown file, named `<verb>-<object>.md`, with this YAML front matter:

| field | value |
|---|---|
| `title` | The action or decision, in the imperative. |
| `owner` | `ceo`. This is always a person, never an office. |
| `status` | `todo`, `doing`, `done` or `declined`. |
| `office` | The office that raised the ticket and that acts once it is done: `cto`, `coo`, `cmo`, `cxo`, `cfo` or `cio`. |
| `acceptance` | A list of statements that anyone can check, such as a URL that answers 200, a check that prints `ok`, or a value recorded under `## Decision`. The ticket is done when every statement holds. |
| `created` | `YYYY-MM-DD`. |
| `unblocks` | The [ROADMAP.md](../../../../ROADMAP.md) rows that wait on this ticket. |

The body has four sections:

- `## Why only a person can do this`: the login, the legal or money decision, or the missing API.
- `## Steps`: what to click or run, in order. Steps name the menu paths and files, not secrets.
- `## Decision`: the CEO fills this in. It records the date, the choice, and any value the offices need, such as a URL, a name or a price. It never records a secret.
- `## After`: what the owning office does once the ticket is done.

## Rules

- **Never put a secret in a ticket.** Passwords, API keys and client secrets live in Supabase, PayPal or the daemon's environment. A ticket records that a secret has been set, never its value.
- **One owner.** The CEO owns every ticket, and the `office` field names who acts next.
- **Mirrored in Linear.** The COO mirrors each `todo` ticket as a Linear issue in team ELT, assigned to the CEO. The COO checks the acceptance list at the end of every two-week cycle.
- **Closing.** A ticket is `done` when every acceptance statement holds. It is `declined` when the CEO decides against it, and the reason goes under `## Decision`. Tickets are never deleted, because they are the record of who decided what, and when.
- **The roadmap follows.** When a ticket closes, the COO updates the row in ROADMAP.md, and its "Waiting on a decision" entry, on the same day.

## Open tickets (2026-10-17)

| ticket | office | unblocks |
|---|---|---|
| [Merge and deploy the dashboard, courses and pricing](deploy-dashboard-courses-pricing.md) | coo | Dashboard, courses and pricing live on the site |
| [Run the progress migration in Supabase](run-progress-migration.md) | cto | Progress synced across browsers |
| [Enable GitHub sign-in in Supabase](enable-github-sign-in.md) | cto | Sign in with GitHub |
| [Set up custom SMTP for auth emails](configure-auth-email-smtp.md) | cto | Emails that reach every learner |
| [Approve the CFO's proposed prices](approve-cfo-prices.md) | cfo | Prices inside the market band |
| [Create the LinkedIn newsletter](create-linkedin-newsletter.md) | cmo | The weekly LinkedIn newsletter |
| [Confirm the Facebook and LinkedIn Page URLs](confirm-facebook-linkedin-pages.md) | cmo | All five brand accounts linked |
| [Decide when the PayPal sandbox goes live](decide-paypal-go-live.md) | cfo | Live payments |
