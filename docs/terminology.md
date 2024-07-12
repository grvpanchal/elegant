---
title: The State Side
layout: default
---
# Terminology
List of all terminology used by the Elegant package to build the Front End Architecture. These terminologies are universal in nature and do not correspond to any specific framework.

| Term | Section | Desciption | Responsibility | Reference
|----------|---------|------------------------------------------|-------------------------------------------------------|-----------|
| Element | UI | a single purpose entity of HTML | building blocks of page | https://html.spec.whatwg.org/ |
| DOM | UI | Document Object Model (DOM), a set of APIs for controlling HTML and styling information that makes heavy use of the Document object | TBD | https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents |
| Component | UI | an interactive unit of element comprising of HTML, CSS and JS | JS framework element to delivery reactivity with html tags, JS and CSS | https://medium.com/@adityaa803/components-in-javascript-1f5c66042fa5 https://react.dev/learn/your-first-component https://developer.mozilla.org/en-US/docs/Web/API/Web_components |
| Attributes | UI | information entity of HTML elements | HTML attributes provide additional information about HTML elements adjust their behavior | https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes |
| Props | UI | Props are arguments passed into JS components | deliver structural information that unlike attributes, can be used by JS within components | https://www.freecodecamp.org/news/how-to-use-props-in-reactjs/<br/> https://javascript.works-hub.com/learn/web-components-api-definition-attributes-and-props-886c0 |
| Events | UI | a single purpose component | deliver display or interactiveness with single action | https://developer.mozilla.org/en-US/docs/Web/Events |
| Atom | UI | a single purpose component | deliver display or interactiveness with single action | https://atomicdesign.bradfrost.com/chapter-2/#atoms |
| Molecule | UI | comprised of multiple atoms or molecules | populates a grouped or assembled sections of UI | https://atomicdesign.bradfrost.com/chapter-2/#molecules |
| Skeleton | UI | Loading state | Provide place holder while API or component is lazy loading | https://www.nngroup.com/articles/skeleton-screens/ |
| Organism | UI | UI connector to state | deliver UX scaffolding to UI | https://atomicdesign.bradfrost.com/chapter-2/#organisms |
| Widget | UI | Framework agnostic entity with built-in API capabilities | Serve a common entity between various framework | TBD |
| Layout / Template | UI | Structural compartment of a page | serves structural responsiveness to page | TBD |
| Story | UI | A description of interactiveness of a component | a guide to the existing feature of a component | https://storybook.js.org/docs/react/writing-stories/introduction |
| Theme | UI | A Styling conduct of site | provides unique identity and branding | https://binyamin.medium.com/styled-components-vs-css-sass-css-in-jsx-c3c9268e8945 |
| Atomic Design | UI | details all that goes into creating and maintaining robust design systems | It allowing you to roll out higher quality, more consistent UIs faster than ever before | https://atomicdesign.bradfrost.com/ |
| RWD | UI | The layout changes based on the size and capabilities of the device | allow reusability of UI on all platforms | https://web.dev/articles/responsive-web-design-basics |
| Accessibility | UI | The Web is fundamentally designed to work for all people, whatever their hardware, software, language, location, or ability. | Making the web accessible benefits individuals, businesses, and society | https://www.w3.org/WAI/fundamentals/accessibility-intro/ |
| Container | Server | Server Component thats provides loading, content and error state | connects the UI from the design system to state management | https://www.section.io/engineering-education/container-components-in-react/ |
| Page | Server | specific instances of templates that show what a UI looks like with real representative content in place. | serves a single entry of a website | https://atomicdesign.bradfrost.com/chapter-2/#pages |
| App Shell | Server | provides a starting point for SPA to run | supports rendering and hydration | https://blog.saeloun.com/2021/12/16/hydration/ |
| Index | Server | a starting HTML point of any page | serves base HTML with all essential tags | https://blog.grvpanchal.ml/2019/01/standard-way-to-approach-webpage.html |
| SSR | Server | Generation of HTML content on body from server's end | better page experience and provides content to Search engine for quicker indexing | https://medium.com/bucharestjs/adding-state-management-with-redux-in-a-cra-srr-project-9798d74dbb3b |
| SSG | Server | prebuilt HTML file to consume on site | Fast page rendering for non dynamic pages | https://www.digitalocean.com/community/conceptual-articles/introduction-to-static-site-generators |
| Proxy | Server | an intermediate layer hosted on same site to deliver content from true APIs | provide security layer to business API | https://blog.logrocket.com/why-you-should-use-proxy-server-create-react-app/ |
| Router | Server | provide navigation to diffrent pages of site | organises page client or server side rendering for site | https://bholmes.dev/blog/spas-clientside-routing/ |
| Protocol | Server | set of rules that governs the communication and exchange of data over the internet | to manage the flow control of data, and access control of the link being shared in the communication channel | https://www.geeksforgeeks.org/types-of-internet-protocols/# |
| Micro Frontend | Server | An architectural style where independently deliverable frontend applications are composed into a greater whole | provides ability to deploy decoupled, independent frontend apps on same site developed by autonomous teams | https://martinfowler.com/articles/micro-frontends.html |
| Headers | Server | lets the client and the server pass additional information with an HTTP request or response | provides security, caching, authentication and redirect mechanism between client and server | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers |
| SEO | Server | The process of improving your website to increase its visibility in search engines | TBD | https://developers.google.com/search/docs/fundamentals/seo-starter-guide |
| API | Server | an intermediate software agent that allows dependent applications to communicate with each other | APIs provide a set of protocols, routines, and developer tools enabling software developers to extract and share information and let applications interact in an accessible manner | https://blog.postman.com/understanding-api-basics-beginners/ |
| Authentication | Server | TBD | TBD | https://zivukushingai.medium.com/everything-you-need-to-know-about-frontend-and-backend-authentication-ultimate-guide-7142a752249c |
| Session | Server | TBD | TBD | https://auth0.com/blog/application-session-management-best-practices/ |
| Forms | Server | TBD | TBD | https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form https://cloudfour.com/thinks/autofill-what-web-devs-should-know-but-dont/ |
| Links | Server | TBD | TBD | TBD |
| Images | Server | TBD | TBD | TBD |
| Localization | Server | TBD | TBD | TBD |
| PWA | Server | TBD | TBD | https://web.dev/explore/progressive-web-apps |
| Page Unit testing | Server | TBD | TBD | TBD |
| State | UX | keeping track of how an application's data changes over time. | ensure that changes reflect real-world context and business processes | https://deadsimplechat.com/blog/react-state-management-modern-guide/ https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/ |
| Actions | UX | the ways the state of an application could change in response to user inputs | | TBD |
| CRUD | UX | Create, Read, Update, Delete is a memorable framework for reminding developers of how to construct full, usable models | It standardize the state interactions with the model arriving from server | https://www.codecademy.com/article/what-is-crud |
| AJAX | UX | | | https://www.w3schools.com/js/js_ajax_intro.asp https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data |
| Reducer | UX | a pure function that determines changes to an application’s state | serves state change by return state in the reducer function | https://www.geeksforgeeks.org/explain-reducers-in-redux/# |
| Operations | UX | TBD | TBD | TBD |
| Selectors | UX | function to provide date from state tree | Reduce  | https://redux.js.org/usage/deriving-data-selectors |
| Analytics | UX | TBD | TBD | TBD |
| Third Party State Interaction | UX | TBD | TBD | TBD |
