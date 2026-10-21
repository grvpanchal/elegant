# Healing feedback pool

16 entries: 6 open, 0 reworked and waiting for review, 0 resolved, 10 dropped. 4 subject(s) approved, 1 rejected.

## Per office

| office | entries | open | resolved | dropped | recurring themes |
|---|---|---|---|---|---|
| cmo | 6 | 1 | 0 | 5 | there (6), comparison (6), vibe (6), coding (6), creates (6) |
| coo | 4 | 2 | 0 | 2 | beta (4), regression (4), checks (4), score (4), change (4) |
| cto | 6 | 3 | 0 | 3 | change (4), call (3), beta (3), regression (3), checks (3) |

## Recurring themes across the organisation

- **change**: in 8 pieces of feedback
- **beta**: in 7 pieces of feedback
- **regression**: in 7 pieces of feedback
- **checks**: in 7 pieces of feedback
- **score**: in 7 pieces of feedback
- **workspace**: in 7 pieces of feedback
- **there**: in 6 pieces of feedback
- **comparison**: in 6 pieces of feedback

## What the framework should learn

Each line is a pattern a person had to correct by hand; a guardrail, a skill instruction or a bar should catch it before review next time.

- CTO: rework of `templates/chota-react-redux/src/containers/TodoListContainer.jsx` was dropped after 3 attempt(s) (provider_error): the cell could not answer the feedback; the skill needs the instruction the feedback implies
- CTO: rework of `docs/courses/state-layer/selectors.md` was dropped after 3 attempt(s) (provider_error): the cell could not answer the feedback; the skill needs the instruction the feedback implies
- COO: rework of `chg_f8d9e603` was dropped after 3 attempt(s) (max_attempts): the cell could not answer the feedback; the skill needs the instruction the feedback implies
- COO: rework of `chg_4200aee6` was dropped after 3 attempt(s) (max_attempts): the cell could not answer the feedback; the skill needs the instruction the feedback implies
- CTO: rework of `chg_ca2a2430` was dropped after 3 attempt(s) (max_attempts): the cell could not answer the feedback; the skill needs the instruction the feedback implies
- "change" recurs in 8 rejections: write it into the standard as a bar with a check
- "beta" recurs in 7 rejections: write it into the standard as a bar with a check
- "regression" recurs in 7 rejections: write it into the standard as a bar with a check

## Entries

| entry | office | subject | status | attempts | feedback |
|---|---|---|---|---|---|
| fb_c4a3ec3d | cmo | `.benzene/material/marketing/posts/linkedin-2026-10-26-vibe-to-production.md` | open | 0 | There is no comparison of vibe coding creates slop while elegant architecture buit slop resistant infrastructure |
| fb_01ca8a27 | cmo | `.benzene/material/marketing/posts/linkedin-2026-10-26-vibe-to-production.md` | dropped | 0 | There is no comparison of vibe coding creates slop while elegant architecture buit slop resistant infrastructure |
| fb_0deddd60 | cmo | `.benzene/material/marketing/posts/linkedin-2026-10-26-vibe-to-production.md` | dropped | 0 | There is no comparison of vibe coding creates slop while elegant architecture buit slop resistant infrastructure |
| fb_67d0641d | cmo | `.benzene/material/marketing/posts/linkedin-2026-10-26-vibe-to-production.md` | dropped | 0 | There is no comparison of vibe coding creates slop while elegant architecture buit slop resistant infrastructure |
| fb_f23c44ca | cmo | `.benzene/material/marketing/posts/linkedin-2026-10-26-vibe-to-production.md` | dropped | 0 | There is no comparison of vibe coding creates slop while elegant architecture buit slop resistant infrastructure |
| fb_facf988c | cmo | `.benzene/material/marketing/posts/linkedin-2026-10-26-vibe-to-production.md` | dropped | 0 | There is no comparison of vibe coding creates slop while elegant architecture buit slop resistant infrastructure |
| fb_a934bffa | cto | `chg_c0ef639b` | open | 0 | beta regression: checks score 0.68 in the change, 0.73 on the workspace |
| fb_deaf94a2 | cto | `chg_fe307766` | open | 1 | beta regression: checks score 0.68 in the change, 0.73 on the workspace |
| fb_988c69dc | cto | `chg_ca2a2430` | dropped | 3 | beta regression: checks score 0.68 in the change, 0.73 on the workspace |
| fb_ffe9cf54 | coo | `chg_5d176060` | reworking | 3 | beta regression: checks score 0.68 in the change, 0.73 on the workspace |
| fb_bfd530ae | coo | `chg_e5f8aa65` | reworking | 1 | beta regression: checks score 0.72 in the change, 0.75 on the workspace |
| fb_a6c9ac6d | coo | `chg_4200aee6` | dropped | 3 | beta regression: checks score 0.72 in the change, 0.77 on the workspace |
| fb_56fcdd6e | coo | `chg_f8d9e603` | dropped | 3 | beta regression: checks score 0.68 in the change, 0.74 on the workspace |
| fb_9afbc409 | cto | `docs/practice/memoized-selector.md` | reworking | 1 | The question's explanation says Reselect's cache holds only the last call. In Reselect 5 the default memoize (weakMapMemoize) keeps an entry |
| fb_9c2b1f03 | cto | `docs/courses/state-layer/selectors.md` | dropped | 3 | The lesson says Reselect's cache holds only the last call. In Reselect 5 (used by Redux Toolkit 2) the default memoize is weakMapMemoize, wh |
| fb_4726d950 | cto | `templates/chota-react-redux/src/containers/TodoListContainer.jsx` | dropped | 3 | The container's selector (getVisibleTodos) builds a new object on every call, so the todo list re-renders on every store update even when it |
