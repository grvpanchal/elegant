# Doc reviewer state

`state.json` is the durable memory for the **doc-reviewer** subagent (defined in
`.claude/agents/doc-reviewer.md`). The agent reviews terminology docs under
`docs/{ui,server,state}/*.md` for readability + learner engagement, fixes small
issues in place, and flags larger ones for human follow-up.

## Schema

```json
{
  "version": 1,
  "docs": {
    "ui/atom": {
      "doc": "ui/atom",
      "last_sha": "<git hash-object output for docs/ui/atom.md>",
      "last_reviewed_at": "2026-04-25T16:00:00Z",
      "score": 24,
      "axes": {
        "hook": 4,
        "cadence": 4,
        "concreteness": 5,
        "common_mistakes": 4,
        "quiz_quality": 4,
        "engagement_glue": 3
      },
      "issues_fixed": [
        "Tightened the Detailed Description third paragraph from 78 to 42 words"
      ],
      "issues_reported": [
        "The Advanced Example assumes familiarity with React.memo without a one-line setup"
      ]
    }
  }
}
```

## Workflow

Before opening a PR that touches any doc under `docs/{ui,server,state}/*.md`:

1. List the docs you modified vs the previous commit.
2. For each modified doc, invoke the reviewer subagent:
   ```
   Agent({
     subagent_type: "doc-reviewer",
     prompt: "Review docs/ui/atom.md."
   })
   ```
3. The agent updates this `state.json` and either fixes-in-place or reports.
4. Commit the agent's fixes alongside your PR changes.
5. Address (or explicitly defer) any issues it reports in the PR description.

## Determining "modified docs"

```
# vs the merge-base with master
git diff --name-only "$(git merge-base HEAD origin/master)" HEAD -- docs/
```

A doc is "modified vs last review" if its current `git hash-object` output differs
from the `last_sha` recorded in `state.json` for that doc.

## Initial pass

The first run iterates every terminology doc to populate the memory. Subsequent
runs only re-review docs whose hash has changed. To force a re-review, delete
the doc's entry from `state.json`.
