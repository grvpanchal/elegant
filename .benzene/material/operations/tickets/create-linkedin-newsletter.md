---
title: Create the LinkedIn newsletter and publish each issue by hand
owner: ceo
status: todo
office: cmo
created: 2026-10-17
unblocks:
  - 'A weekly LinkedIn newsletter, with one edition every week'
acceptance:
  - 'The newsletter exists on LinkedIn. Its URL, name, description and fixed publishing weekday are recorded under ## Decision.'
  - 'The CEO commits to publishing one edition every ISO week, or names the person who will. LinkedIn has no API for it.'
  - 'The first edition is prepared by the CMO under .benzene/material/marketing/newsletter/, approved by the CEO in the marketing room, published on LinkedIn within its ISO week, and its URL is recorded under ## Decision.'
---

# Create the LinkedIn newsletter and publish each issue by hand

The CMO's newsletter cell prepares one issue a week about evolving frontend practice. Its bar (`.benzene/standards/cmo.md`, bar 11) asks for:

- exactly one edition per ISO week;
- a 1920 × 1080 cover and a 300 × 300 logo;
- four sections: a lead story, a bottom line, 3 to 5 links, and one practice question as the call to action.

## Why only a person can do this

The research found that LinkedIn has **no newsletter or native-article endpoint** (cmo.md, Channels). The API's "Article" type is only a link share. A person has to create the newsletter and publish every edition in LinkedIn's editor. Any member can create a newsletter. A Page has to have more than 150 followers and recent original content before LinkedIn will evaluate it (evidence E171). So the newsletter starts on the CEO's member profile and can move to the Page later.

## Steps

1. On LinkedIn, from the CEO's member profile, go to **Write article > Create a newsletter**, and set:
   - the name;
   - a one-line description of who it is for: frontend developers rebuilding their careers around AI;
   - a weekly cadence;
   - the 300 × 300 logo.
2. Pick one fixed weekday and keep it. LinkedIn asks authors to "maintain the publishing cadence that you chose".
3. Each week:
   1. Open the edition the CMO prepared under `.benzene/material/marketing/newsletter/`.
   2. Approve or reject it in the marketing room.
   3. Paste the approved edition into LinkedIn's editor, add the cover, and publish it.
   4. Record the edition's URL.

## Decision

- Newsletter URL:
- Name:
- Publishing weekday:
- Who publishes each week:
- First edition URL and date:

## After

The CMO prepares one edition for each ISO week, with no gaps. It also records `newsletter_subscribers` and `linkedin_page_followers` every week (cmo.md bar 12). When the Page passes 150 followers, the CMO raises a new ticket to decide whether the newsletter moves to the Page.
