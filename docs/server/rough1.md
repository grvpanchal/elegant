

## Container

```js
const { loading, success, error } = state;
```
 - Skeleton
 - UI Lazy loading
 - HOC Component

 ## App Shell

 - Providers
    - UI
    - State
    - Third Party
    - Session
    - Auth Guard
    - Router
 - Service worker
 - Polyfill

 ## Index

 https://blog.grvpanchal.ml/2019/01/standard-way-to-approach-webpage.html

 https://validator.w3.org/#validate_by_input

 ## SSR

 - Image Optimization

Standardize way that SSR works with State management
 - NextJs: https://github.com/vercel/next.js/tree/v14.0.0/examples/with-redux-saga
 - Ng Universal
 - Nuxt

Session and User related info needs to be CSR in case of enterprise cache mechanism (akamai, cloudflare)

## SSG

 - Image Optimization

Explain SSG with Gatsby
https://www.digitalocean.com/community/conceptual-articles/introduction-to-static-site-generators

## Proxy
- Basic Expalination
- Nomenclature for Endpoint (REST)
- Secure Cookies
- DAO??
- Status Codes
- https://blog.logrocket.com/why-you-should-use-proxy-server-create-react-app/

## Router

- Explainer: https://bholmes.dev/blog/spas-clientside-routing/
- Pages Folder with slugs or route specific component
- NextJS Way or React Router way

## Protocol

- Service Worker PWA - https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Secure_connection
- .wellknown - https://www.ssldragon.com/blog/well-known-folder/
- Self Signed (mkcert)
- Lets Encrypt https://www.inmotionhosting.com/support/website/ssl/lets-encrypt-ssl-ubuntu-with-certbot/
- https://gist.github.com/Grawl/bd0096b49276934c807b4a74088b081c

https://www.geeksforgeeks.org/types-of-internet-protocols/#

## Micro Frontend

- Basics: https://martinfowler.com/articles/micro-frontends.html
- Plugin: https://webpack.js.org/concepts/module-federation/
- MFE Next: https://www.angulararchitects.io/en/blog/import-maps-the-next-evolution-step-for-micro-frontends-article/

## SEO

- robots.txt
- Index meta tags with Open Graph and twittter
- Schema.org
- Google Search Console

## API
- API Client Base Approach
- REST processes
- https://blog.postman.com/understanding-api-basics-beginners/

## Authentication
- https://zivukushingai.medium.com/everything-you-need-to-know-about-frontend-and-backend-authentication-ultimate-guide-7142a752249c
- https://webauthn.guide/

## Session
- https://auth0.com/blog/application-session-management-best-practices/

## Forms
- Basic form submit and form elements
- Native vs framework Validation and masking: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
- POST and GET mechanism: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
- autofill: https://cloudfour.com/thinks/autofill-what-web-devs-should-know-but-dont/
https://codepen.io/grigs/pen/NNVZPZ
- CSRF Basics: https://owasp.org/www-community/attacks/csrf

## Links

have a univeral Link Component with framework related functionality

- https://mattburgess.medium.com/framework-routers-and-linking-98398af89022

## Images
have a univeral Image Component with framework related functionality

- SSR Optimisation
- loading
- caching policy: https://web.dev/articles/preload-responsive-images
- Picture for Responsiveness?

## Localization

- Basic HTML option
- Learning: https://phrase.com/blog/posts/step-step-guide-javascript-localization/

## PWA
- Basic Service worker: https://googlechrome.github.io/samples/service-worker/basic/
- PRPL - https://web.dev/articles/apply-instant-loading-with-prpl
- Lighthous
## Fonts (UI)
- https://web.dev/articles/optimize-webfont-loading

## Rendering
- https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/

-----------------------------------------------------------

# State

## State Basics

- https://deadsimplechat.com/blog/react-state-management-modern-guide/

## Actions

- Atomic Events are linked with Actions in container
- A reducer has a single entity in CRUD action
- An Operation has three entities in CRUD action i.e. loading / loader / initial, success and error
   - loading / loader / initial work with trigger on page / organism load and can be linked with Skeleton
   - Success Entity is linked with Organism Data props
   - Error Entity is linked Alerts of page or organism
- Hydrate Action for SSR. Investigate??

## CRUD

- https://www.codecademy.com/article/what-is-crud
 - REST
   - CREATE: fetch('todo', { body, method: post })
   - READ: fetch('todo')
   - UPDATE: fetch('todo', { body, method: put })
   - DELETE: fetch('todo', { body, method: delete })
 - GraphQL
   - CREATE: mutation { createTodoItem }
   - READ: query { readTodoItems } 
   - EDIT: query { editTodoItem }
   - UPDATE: mutation { updateTodoItem }
   - DELETE: mutation { deleteTodoItem }

   ```jsx
   useEffect(() => {
    dispatch(readTodo());
  }, [dispatch])

   const events = {
    onTodoCreate: (payload) => dispatch(createTodo(payload)),
    onTodoEdit: (payload) => dispatch(editTodo(payload)),
    onTodoUpdate: (text) =>
      dispatch(updateTodo({ id: todoData.currentTodoItem.id, text })),
    onTodoToggleUpdate: (id) => dispatch(toggleTodo(id)),
    onTodoDelete: (payload) => dispatch(deleteTodo(payload)),
  };
  ```

## AJAX
- https://www.w3schools.com/js/js_ajax_intro.asp
- showcase
```js
const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    document.getElementById("demo").innerHTML = this.responseText;
    }
   xhr.timeout = 10000;
  xhttp.open("GET", "ajax_info.txt", true);
  xhttp.send();
  ```
- showcase 
```js
fetch('todo', { signal: AbortSignal.timeout(10000) })
   .then(r => r.json())
   .then(d => d);
```
- Timeout Strategy
- Single point of entry and exit

## Reducer
- https://www.geeksforgeeks.org/explain-reducers-in-redux/#
- Initial State Declation
```js
const intialTodoState = {
  isLoading: false,

  error: '',
  todoItems: [],
  currentTodoItem: {
    text: '',
    id: ''
  }
};
```
- Sync CRUD
   - CREATE - Spread Array
   - READ - Reducer Selector / view function
   - UPDATE - Array Map method
   - EDIT - Reducer Selector / view function for single item
   - DELETE - Array filter method
- Fixed types

## Operations

- CRUD Operation
- Initial State Declation
```js
const intialTodoState = {
  isLoading: false, // API and lozy loading reference
  isActionLoading: false, // All events are disabled
  isContentLoading: false, // Skeleton / Cicular Loader only
  error: '',
  todoItems: [],
  currentTodoItem: {
    text: '',
    id: ''
  }
};
```
- Sync CRUD
   - CREATE - Active Async Add 
   - READ - Active Async loading State
   - UPDATE - Passive Async form disabled State with Previous state on error
   - EDIT - Reducer Selector / view / detailed API function for single item
   - DELETE - Passive Async State with Previous state on error
- Fixed types

## Selectors

- https://redux.js.org/usage/deriving-data-selectors
- Caching / Rerender Performance