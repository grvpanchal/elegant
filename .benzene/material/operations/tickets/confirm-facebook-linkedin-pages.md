---
title: Confirm the real Facebook Page and LinkedIn Page URLs
owner: ceo
status: todo
office: cmo
created: 2026-10-17
unblocks:
  - 'All five brand accounts linked from every page'
  - 'A weekly LinkedIn newsletter, with one edition every week'
acceptance:
  - 'The Facebook Page URL and the LinkedIn Page URL are recorded under ## Decision.'
  - 'Each URL opens the brand''s own Page. The CMO confirms this by fetching it: the Page name is ours, and the Page links to https://elegantfrontend.training.'
  - 'The display name the Pages use is recorded under ## Decision.'
  - 'The CMO has copied both URLs into .benzene/material/marketing/profile.md, so the CTO can link all five accounts in the site footer and in the Organization JSON-LD sameAs.'
---

# Confirm the real Facebook Page and LinkedIn Page URLs

The CMO's charter names the LinkedIn and Facebook Pages "Elegant Architecture". The research fetched both on 2026-10-17 (`.benzene/standards/cmo.md`, evidence E9 and E10):

- **Facebook:** `facebook.com/elegantarchitecture` belongs to a different business, "Elegant Architecture + Interior. 45 followers". The name collides with ours.
- **LinkedIn:** `linkedin.com/company/elegant-architecture` returns **HTTP 404**.

The other three accounts are known: `instagram.com/elegantfrontend`, `x.com/elegantfrontend` and `youtube.com/@elegantfrontend`. Until the two Page URLs are confirmed:

- the CMO cannot address Facebook or LinkedIn Page posts;
- the CTO cannot add the footer links or the JSON-LD `sameAs` (cmo.md bar 19).

## Why only a person can do this

- A Facebook Page and a LinkedIn Page are created and administered from a personal account, which the CEO holds.
- Only an admin can see a Page's real URL, its vanity name and the admin roles that posting needs.
- Choosing the brand's public name is the CEO's call.

## Steps

1. In Facebook and in LinkedIn, open the Pages you administer and copy each Page's public URL. If a Page does not exist yet, create it. A LinkedIn Page needs a member account and a company name.
2. Choose the display name. "Elegant Architecture" collides with the architecture-and-interiors business on Facebook. "Elegant Frontend" matches the `@elegantfrontend` handles and the domain. Record your choice below.
3. On each Page, set the website field to `https://elegantfrontend.training`.
4. Optional: give the posting tool the admin role it needs on each Page (cmo.md, Channels).

## Decision

- Facebook Page URL:
- LinkedIn Page URL:
- Display name:
- Date:

## After

The CMO fetches both URLs and confirms each Page is ours. The CMO then writes both into `profile.md`, and from then on addresses Facebook and LinkedIn posts to these Pages. The CTO adds all five accounts to the footer and to the `sameAs` list.
