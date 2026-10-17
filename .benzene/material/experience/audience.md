---
week: 2026-W42
combined_audience: 2637
threshold_audience: 5000
threshold_people_30d: 30
people_giving_feedback_30d: 0
steering: false
source: .benzene/material/experience/analytics/2026-W42.json, .benzene/material/experience/feedback-log.md
---

# Audience threshold

When user feedback starts to steer the roadmap, and where we stand. The rule is the proposal in
`.benzene/standards/cxo.md` (`### Audience threshold`); the reading is taken from the weekly snapshot and the
feedback log.

## The threshold

Feedback **steers the roadmap** at whichever comes first:

- **30 distinct people giving substantive feedback in a rolling 30-day window**, counted from `feedback-log.md`; or
- **5,000 combined audience**: followers on Instagram, Facebook, the LinkedIn page, X and YouTube (Upload-Post),
  plus personal LinkedIn followers (ConnectSafely), plus registered learners and community members, from the weekly
  snapshot.

Once steering, a request goes onto the roadmap when **at least 3 distinct people raised it on at least 2 channels**,
or when **1 paying learner reports it as a blocker**. Below the threshold every item is still logged and answered
(cxo.md bars 1 to 3 apply from day one), and the roadmap follows the competitor bar rather than single requests. At
5,000 a weekly public ritual starts (an office hour or a "you asked, we shipped" post); at 10,000 a quarterly survey.

Why these numbers (cxo.md): about 30 testers shaped a premium CSS course before launch; Frontend Mentor was steered
by feedback from a 32-point Show HN and a Slack group; Scrimba took nine months to reach 5,000 users and a pre-sale
of almost 5,000 copies changed another course. Our audience is small and urgent, which favours the 30-people
trigger over waiting for scale.

## Today's reading

Week **2026-W42** (snapshot captured 2026-10-17T21:04:01Z):

| Trigger | Reading | Threshold | Status |
|---|---|---|---|
| Combined audience | **2637** (personal LinkedIn 2626, Instagram 9, LinkedIn page 2, Facebook 0, X 0, YouTube 0) | 5,000 | 52.7%, 2363 short (computed) |
| People giving feedback, last 30 days | **0** (the feedback log has no items yet) | 30 | Not reached |

**Steering: no.** Neither trigger is met, so the roadmap follows the competitor bar and every item that does arrive
is logged and answered.

Caveats on the reading:

- The snapshot's combined audience counts followers only. Registered learners and community members are not in it
  yet: there is no community channel, and the count of email accounts is not instrumented.
- The audience is almost entirely the personal LinkedIn profile (99.6%, computed); the brand accounts hold 11 followers.
- No trend yet: this is the first snapshot. From 2026-W43 this section reads the change week on week.
- The feedback trigger cannot move until feedback has a way in: the site has no feedback link, and the brand
  accounts reported 0 comments this week (Facebook's count is null) (`ux-model.md`, Where it breaks, item 4).
