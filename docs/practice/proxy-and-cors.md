---
title: Proxy it or fix CORS?
layout: question
slug: proxy-and-cors
format: quiz
difficulty: medium
layer: server
topics: [proxy, api, protocol, authentication]
skill: server-proxy
minutes: 10
summary: When a dev proxy is the right tool, when it hides a problem you will meet in production, and what CORS actually protects.
---

Every frontend team hits this in week one and half of them ship the workaround.

{% include quiz.html id="proxy-cors-1"
   question="Your browser blocks a request to api.example.com with a CORS error. Where is the fix?"
   options="A|Add a header to your fetch() call;;B|On the API server, which must send Access-Control-Allow-Origin;;C|Disable CORS in the browser;;D|Use XMLHttpRequest instead of fetch"
   correct="B"
   explanation="CORS is enforced by the browser and granted by the server. Nothing you add to the request can grant your own origin permission — that is the entire point. A browser flag 'fixes' it on one machine and nowhere else." %}

{% include quiz.html id="proxy-cors-2"
   question="A dev-server proxy forwarding /api to api.example.com makes the error disappear. What just happened?"
   options="A|The proxy added the CORS headers;;B|The request is now same-origin, so the browser never applies CORS at all;;C|CORS was disabled;;D|The proxy cached the response"
   correct="B"
   explanation="The browser sees a request to your own origin. The proxy makes the cross-origin call server-to-server, where CORS does not apply. This is a genuine fix — and it is also why the problem returns in production if the real deployment does not proxy the same way." %}

{% include quiz.html id="proxy-cors-3"
   question="Your app sends a JSON body with an Authorization header. The browser makes an OPTIONS request first. Why?"
   options="A|A bug in the fetch polyfill;;B|It is a preflight: a custom header makes the request non-simple, so the browser asks permission before sending it;;C|The server requested it;;D|It is checking whether the server is alive"
   correct="B"
   explanation="A request with a custom header or a non-simple content type is preflighted. The server must answer OPTIONS with the allowed origin, methods and headers — and it must answer it fast, because every such call is now two round trips unless Access-Control-Max-Age lets the browser cache the permission." %}

{% include quiz.html id="proxy-cors-4"
   question="You want cookies sent to the API on a different origin. What is required?"
   options="A|credentials: 'include' on the request only;;B|credentials: 'include', plus Access-Control-Allow-Credentials: true and an explicit origin — the wildcard is rejected — plus SameSite=None; Secure on the cookie;;C|Nothing, cookies always go;;D|Move the cookie to localStorage"
   correct="B"
   explanation="Every piece has to line up, and the wildcard origin is specifically disallowed with credentials. This is the moment most teams switch to a same-origin proxy: it turns four coordinated settings into none, and it keeps the token out of JavaScript's reach." %}

## Related

- Reading: [Proxy](../server/proxy.html) · [API](../server/api.html) · [Protocol](../server/protocol.html) · [Authentication](../server/authentication.html)
- Agent Skill: `server-proxy`
