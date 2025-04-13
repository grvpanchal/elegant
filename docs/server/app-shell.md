---
title: App Shell
layout: doc
slug: app-shell
---
# App Shell

An App Shell is the minimal HTML, CSS, and JavaScript required to power the user interface of a web application. It serves as a static frame that loads immediately, providing a fast initial render and improved perceived performance.

## Providers
Providers in a frontend Application Shell are components or functions that supply essential data, services, or functionality to other parts of the application. They play a crucial role in managing and distributing shared resources across the app's various components and micro-frontends.

### Key Aspects of Providers in App Shell

**Data Distribution**: Providers often handle the distribution of global state or configuration data to child components[1][4].

**Service Injection**: They can inject services or utilities that are used across multiple parts of the application[11].

**Context Creation**: Providers frequently create and manage context, allowing data to be passed down the component tree without explicit prop drilling[10].

**Shared Functionality**: They offer a way to share common functionality, such as authentication or API access, across different parts of the application[9].

## Common Types of Providers

1. **Authentication Providers**: Handle user authentication state and methods across the application[11].

2. **API Providers**: Manage API connections and data fetching, often using technologies like GraphQL or REST[10].

3. **Configuration Providers**: Supply application-wide settings or environment variables[4].

4. **State Management Providers**: Distribute global state using libraries like Redux, NGRX, or custom solutions[11].

5. **UI Theme Providers**: Manage and distribute theming information throughout the application[4].

### Implementation Examples
{::nomarkdown}<div class="code-tabs">{:/}

React

```jsx
const MyProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};
```

Angular

```typescript
@Injectable({
  providedIn: 'root'
})
export class MyService {
  // Service implementation
}
```

{::nomarkdown}</div>{:/}
### Benefits of Using Providers

1. **Modularity**: Providers help in creating a modular architecture, making it easier to manage and scale the application[1].

2. **Reusability**: Common functionality can be encapsulated in providers and reused across different parts of the application[9].

3. **Separation of Concerns**: Providers allow for a clear separation between data management and UI components[10].

4. **Flexibility**: They provide a flexible way to inject dependencies and manage application-wide resources[4].

By utilizing providers effectively in an App Shell architecture, developers can create more maintainable, scalable, and efficient frontend applications, especially in the context of micro-frontends and complex web applications.

## Hydration

Hydration in an App Shell architecture plays a crucial role in making the server-rendered content interactive on the client-side. Here's how hydration works in the context of an App Shell:

### Initial Rendering

1. The server sends the initial HTML for the App Shell, which typically includes the basic layout and structure of the application.
2. This initial HTML is static and non-interactive.

### Client-Side Processing

Once the initial HTML reaches the browser, the hydration process begins:

1. **JavaScript Loading**: The browser downloads and executes the JavaScript bundle associated with the App Shell[1].

2. **Component Matching**: The JavaScript framework (e.g., React, Vue, Angular) examines the existing DOM nodes and matches them with their corresponding components[12].

3. **Event Listener Attachment**: The framework attaches necessary event listeners to the DOM elements, making them interactive[1][12].

4. **State Reconstruction**: The application state is reconstructed on the client-side, often using data that was serialized and embedded in the initial HTML[2].

### Progressive Hydration

In an App Shell model, progressive hydration can be particularly beneficial:

1. **Prioritized Hydration**: Critical parts of the App Shell, such as navigation components, can be hydrated first[24].

2. **Deferred Hydration**: Less important or off-screen components can have their hydration deferred until they're needed[24].

3. **On-Demand Hydration**: Some components may only be hydrated when they enter the viewport or based on user interaction[24].

## Performance Considerations

1. **Minimized JavaScript**: The App Shell approach allows for sending only the minimal JavaScript required for the shell's interactivity[6].

2. **Faster Interactivity**: By prioritizing the hydration of critical components, the App Shell becomes interactive more quickly[6].

3. **Reduced Initial Load**: Non-essential components can be lazy-loaded and hydrated on-demand, reducing the initial JavaScript payload[16].

Hydration in an App Shell architecture enables a seamless transition from a server-rendered static shell to a fully interactive application, balancing performance and functionality.

## Service worker
Service worker is a part of PWA implementation and covered in great extent in PWA.

## Polyfills
The main purpose of using polyfills in an App Shell is to enable modern JavaScript features and APIs across different browsers, especially older ones that may not natively support these features. This is crucial for maintaining a consistent user experience and functionality across various platforms.

## References
- [1] https://blog.bitsrc.io/application-shell-for-react-micro-frontends-daa944caa8f3?gi=a1834ddc423a
- [2] https://engineering.zoominfo.com/the-micro-frontend-chaos-and-how-to-solve-it
- [3] https://www.trendmicro.com/en_us/research/21/h/micro-frontend-guide-technical-integrations.html
- [4] https://docs.commercetools.com/merchant-center-customizations/tooling-and-configuration/commercetools-frontend-application-shell
- [5] https://teamtreehouse.com/library/introducing-progressive-web-apps/application-shell-architecture
- [6] https://www.goeleven.com/blog/app-shell/
- [7] https://blog.bitsrc.io/micro-frontends-shell-vs-micro-apps-5ad809a9b85a?gi=6aec00c86205
- [8] https://www.educative.io/answers/what-is-app-shell
- [9] https://github.com/DockYard/ember-app-shell/issues/2
- [10] https://www.trulia.com/blog/tech/islands-and-the-application-shell/
- [11] https://www.reddit.com/r/Angular2/comments/192g4ru/how_would_you_share_state_from_the_shell_app_to/
- [12] https://www.npmjs.com/package/@commercetools-frontend/application-shell-connectors
- [1] https://www.youtube.com/watch?v=kZG3izJu7qE
- [2] https://microfrontend.dev/frameworks/javascript-hydration/
- [3] https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3
- [4] https://themobilereality.com/blog/hydration-ssr-with-react-18
- [5] https://en.wikipedia.org/wiki/Hydration_(web_development)
- [6] https://www.workingsoftware.dev/understanding-ssr-with-hydration-for-software-architects/
- [7] https://vuejs.org/guide/scaling-up/ssr.html
- [8] https://www.linkedin.com/pulse/react-hydration-process-challenges-best-practices-nonstop-io-63dxf
- [9] https://www.builder.io/blog/hydration-is-pure-overhead
- [10] https://github.com/angular/angular/issues/59033
- [11] https://ronlevygroup.cst.temple.edu/media/pdf/publications/1994.JourPhysChem.98.10640-49.pdf
- [12] https://www.gatsbyjs.com/docs/conceptual/react-hydration/
- [13] https://frontendmasters.com/blog/what-does-hydration-mean/
- [14] https://framesurge.sh/perseus/en-US/docs/0.3.4/reference/hydration/
- [15] https://maritech.org/what-are-solvatation-shells/
- [16] https://www.builder.io/blog/hydration-sabotages-lazy-loading
- [17] https://en.wikipedia.org/wiki/Solvation_shell
- [18] https://www.builder.io/blog/hydration-is-pure-overhead
- [19] https://pmc.ncbi.nlm.nih.gov/articles/PMC5398927/
- [20] https://www.workingsoftware.dev/understanding-ssr-with-hydration-for-software-architects/
- [21] https://www.babbel.com/en/magazine/exploring-web-rendering-isomorphic-javascript-hydration
- [22] https://pubs.acs.org/doi/abs/10.1021/jacs.9b02742
- [23] https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3
- [24] https://www.patterns.dev/react/progressive-hydration/
- [25] https://stackoverflow.com/questions/66845811/next-js-before-hydration-next-js-hydration-and-fcp
- [26] https://bobaekang.com/blog/on-hydration-a-non-technical-perspective/
- [27] https://www.linkedin.com/pulse/understanding-hydration-nextjs-fixing-errors-nonstop-io-tqcmf
- [28] https://www.builder.io/blog/resumability-vs-hydration
