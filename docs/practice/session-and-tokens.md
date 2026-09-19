---
title: Where does the session actually live?
layout: question
slug: session-and-tokens
format: quiz
difficulty: hard
layer: server
topics: [session, authentication, protocol, app-shell]
skill: server-session
minutes: 12
summary: Four questions where the plausible answer is the insecure one.
---

Session handling is where frontend architecture meets security, and where the
convenient choice and the correct one usually disagree.

{% include quiz.html id="session-tokens-1"
   question="Your SPA stores its access token in localStorage so the app can read it after a reload. What is the concrete risk?"
   options="A|localStorage is slow;;B|Any script that runs on your origin can read it — one compromised dependency or one XSS and the token leaves with the attacker;;C|The token expires sooner;;D|It breaks on Safari"
   correct="B"
   explanation="localStorage has no protection against same-origin JavaScript, and your bundle runs a lot of code you did not write. An httpOnly cookie is unreadable from JavaScript, so the same XSS can make requests as the user but cannot walk away with a token that keeps working from anywhere." %}

{% include quiz.html id="session-tokens-2"
   question="You move to an httpOnly cookie. What does that NOT solve?"
   options="A|Token theft via XSS;;B|Cross-site request forgery — the browser now attaches the cookie automatically, including on requests a third-party site triggers;;C|Session expiry;;D|Nothing, cookies solve everything"
   correct="B"
   explanation="Automatic attachment is exactly what makes cookies convenient and what makes CSRF possible. You need SameSite=Lax or Strict, and for cross-site flows a token pattern or an Origin check. Trading XSS exfiltration for unguarded CSRF is not a win." %}

{% include quiz.html id="session-tokens-3"
   question="A server-rendered page needs the user's name on first paint. Where does the session check belong?"
   options="A|In a useEffect after hydration;;B|On the server, before the HTML is produced, with the result embedded in the response;;C|In a client-side route guard;;D|In localStorage"
   correct="B"
   explanation="Any client-side check means the first paint is either wrong or empty, and a route guard that runs after hydration is a flicker, not a boundary. The server already has the cookie; resolving the session there is the only way the first byte can be correct — and the only check an attacker cannot skip by disabling JavaScript." %}

{% include quiz.html id="session-tokens-4"
   question="Your access token lives 15 minutes and a refresh token renews it. Two tabs hit expiry at the same moment. What goes wrong, and what fixes it?"
   options="A|Nothing, refresh is idempotent;;B|Both tabs refresh; with refresh-token rotation the second presents a token the server has already retired, and the user is logged out. Serialise refresh across tabs;;C|The tokens merge;;D|The second tab waits automatically"
   correct="B"
   explanation="Rotation is the right security posture — a reused refresh token is the signal of theft — and it turns a race between tabs into a forced logout. Fix it by making one refresh happen at a time: a lock in a shared worker or via the storage event, with the other tabs awaiting the same in-flight promise." %}

## Related

- Reading: [Session](../server/session.html) · [Authentication](../server/authentication.html) · [SSR](../server/ssr.html)
- Playbook: [Frontend system design](../playbooks/system-design.html)
- Agent Skill: `server-session`
