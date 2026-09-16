# The agents that build this site

`frontend-harness.yaml` is a [Benzene](https://github.com/grvpanchal/benezene-agent)
genome: the definition of an agent whose whole purpose is to grow and maintain
the training site under `docs/` against the guardrail in `harness/`.

It lives here, not in the framework repository, because it is **about this
site**. Its verifiers run `harness/check_harness.py`, its skills reference
`docs/practice/`, `docs/_data/plans.yml` and `harness/capabilities.yml`, and
its model roster was chosen by measuring what those checks need. A genome that
names this repository's paths belongs in this repository's history — when a
capability is renamed, the genome that answers to it should move in the same
commit.

Benzene is the engine. This is the thing it runs.

## Run it

```bash
pip install benzene-agent            # or: pip install -e ../benezene-agent
export OPENROUTER_API_KEY=sk-or-...  # every role uses a free model
bza agents/frontend-harness.yaml .   # the workspace is this repository
```

`bza` discovers work by running the agent's own verifiers against the
workspace: `harness/check_harness.py --next` prints the single
highest-priority deficit, that becomes the instruction, the cell writes files,
and the checker runs again. Nothing in that loop needs a person.

Colony state lives in `.benzene/` (git-ignored), so repeated runs continue the
same lineage.

## What is in here

| Path | What it is |
|---|---|
| `frontend-harness.yaml` | the genome: system prompt, skills, model roster, guardrail, homeostasis thresholds |
| `skills/author-question/` | write one practice question, with its runnable workspace files |
| `skills/author-plan/` | add a study plan whose minutes actually add up |
| `skills/author-playbook/` | write a long-form guide |
| `skills/fix-site-health/` | repair front matter, links, alt text, heading order |
| `skills/fix-functional/` | repair a capability a browser proved broken |
| `skills/build-capability/` | implement a declared `frontier` capability that was never built |

`AgentManifest.load` resolves `skills: [name]` against `agents/skills/<name>/SKILL.md`
first, so the genome and its skills travel together.

These are **not** the Agent Skills under `/skills/`. Those are content —
`ui-atom`, `server-ssr` — published for learners and for any agent working on a
frontend. These are operating instructions for the cell that maintains this
site, and they are deliberately kept out of that registry so the skill download
widget never offers one.

## The two verifiers

```yaml
- name: verify:capabilities      # the site-wide target — finds the work
  command: [python3, harness/check_harness.py, --sync, --next]
  required: false                # no single contribution closes a volume target
- name: verify:contribution      # what this task wrote — judges the work
  command: [python3, harness/check_harness.py, --sync, --scope, incremental,
            --failures-only, --changed, "{touched}"]
  required: true
```

That split is the design. `--next` hands out one deficit; `--changed` restricts
the judgement to the files this task wrote; `required: false` on the first means
a cell is never scored down for a target no single task could close.

`harness.agent_manifest` checks that this file keeps naming skills that exist
and keeps pointing its verifiers at `harness/check_harness.py` — a genome that
drifts off the guardrail is an agent nobody is measuring.

## Why there is no `strategy:` block

A Benzene cell leaves the heal stage only when a `strategy:` names a real-world
metric it needs humans to report. This one never does, because the `functional`
group checks behaviour in a real browser: the Run button executes a question's
tests, the quiz grades, progress survives a reload. Those were the capabilities
that used to need someone to click them. With them measured, the lineage stays
in healing indefinitely and grows against scripts alone.
