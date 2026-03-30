---
title: Widget
layout: doc
slug: widget
---
# Widget

A **Widget** is a self-contained, embeddable UI component that can be integrated into third-party websites or applications without requiring the host to adopt your tech stack. Unlike traditional components that exist within your application's ecosystem, widgets operate independently, managing their own rendering, state, and communication while sandboxed from the host page's environment.

## Key Insight

Widgets solve the distribution problem by packaging functionality into an embeddable snippet that loads asynchronously, renders in an isolated context (iframe or Shadow DOM), and communicates bidirectionally with both your backend services and the host page. This requires careful attention to bundle size optimization (keeping initial payload under 50KB gzipped), cross-origin communication (using postMessage), security isolation (CSP compliance, XSS prevention), responsive rendering (adapting to host styles), and versioning strategies (maintaining backward compatibility while allowing updates).

## Detailed Description

### 1. Widget Architecture Fundamentals

Widgets differ from standard components by operating in hostile environments where you don't control the DOM, CSS, or JavaScript runtime. The host page may use jQuery, Angular, or vanilla JS—your widget must work regardless. This necessitates a self-contained architecture where your widget loads its dependencies, establishes an isolated rendering context, and communicates via well-defined APIs.

The typical widget lifecycle: (1) **Initialization** – Host page includes a tiny loader script (`<script src="widget.js" data-widget-id="123"></script>`) that bootstraps asynchronously; (2) **Rendering** – Widget creates an iframe or Shadow DOM, loads styles/scripts, and renders UI; (3) **Communication** – Widget uses postMessage to exchange data with the host page, and fetch/WebSocket to communicate with your backend; (4) **Updates** – Widget can hot-reload content or configuration without full page refresh; (5) **Cleanup** – Widget properly tears down event listeners, timers, and network connections when removed.

### 2. Isolation Strategies

**Shadow DOM Approach**: Modern browsers support Shadow DOM (part of Web Components), which provides style encapsulation and DOM isolation without the performance overhead of iframes. Your widget attaches a shadow root to a host element (`element.attachShadow({mode: 'open'})`), then renders inside this isolated tree. Styles defined within the shadow root don't leak to the host page, and host styles don't interfere with your widget. However, Shadow DOM isn't fully supported in older browsers (IE11), and some third-party libraries struggle with shadow roots.

**Iframe Approach**: The most robust isolation uses an iframe, creating a completely separate browsing context with its own global scope, CSS cascade, and event loop. The widget loader creates an iframe (`<iframe src="https://yourapp.com/widget.html?id=123">`), and your widget application runs inside. Communication happens via `window.postMessage()` across origins. This provides maximum security (malicious host pages can't access your widget's internals) and compatibility (works everywhere), but introduces challenges: iframe height must be calculated and communicated to parent (since content dictates height), performance overhead of separate page load, restrictions on fullscreen/modals/popups, and SEO invisibility (search engines don't index iframe content).

**Hybrid Approach**: Some widgets use an initial Shadow DOM render for performance, then fall back to iframe if conflicts detected. Or use Shadow DOM for simple read-only widgets, iframe for complex interactive ones requiring authentication.

### 3. Loader Script Pattern

The entry point is a minimal loader script (ideally <5KB) that the host page includes. This script must:

- **Load asynchronously** to avoid blocking page render
- **Handle multiple instances** (e.g., 10 widgets on one page)
- **Version the widget** (allowing updates without breaking old embeds)
- **Configure via data attributes** (`data-widget-id`, `data-theme`, `data-locale`)
- **Queue early API calls** (if host page calls widget API before it loads, queue those calls)

Example loader pattern: The script immediately creates a global queue (`window.MyWidgetAPI = window.MyWidgetAPI || []`), where API calls are pushed as arrays (`MyWidgetAPI.push(['login', {userId: 123}])`). When the main widget bundle loads, it processes this queue. This allows host pages to call widget APIs synchronously without waiting for async load completion.

### 4. Bundle Size Optimization

Widgets must load fast on arbitrary third-party sites with varying network conditions. A 500KB widget that takes 10 seconds on 3G is unusable. Optimization strategies:

- **Code splitting**: Load core widget immediately (<50KB), lazy-load features on demand (chat history, settings panel, file upload)
- **Tree shaking**: Remove unused code (if widget doesn't use forms, don't include form validation)
- **External dependency strategies**: If widget uses React, host pages using React can share that dependency (via externals config), but must also include standalone bundle for non-React hosts
- **Critical CSS**: Inline critical styles (above-fold rendering), lazy-load theme/icons
- **Compression**: Gzip (87% reduction), Brotli (better but less supported), or modern formats
- **CDN caching**: Serve from CDN with aggressive cache headers (1 year), use content hashes for versioning (`widget.a3f2e1.js`)

A typical widget might have: `loader.js` (3KB – minimal bootstrap), `widget.core.js` (45KB – React, core UI), `widget.features.js` (lazy – 100KB additional features), `widget.css` (8KB – styles).

### 5. Cross-Origin Communication

Widgets communicate across boundaries using `postMessage` API, which allows safe cross-origin messaging. Security requires validating message origins:

```javascript
// Widget (inside iframe) sends message to host
window.parent.postMessage({type: 'resize', height: 500}, 'https://trusted-host.com');

// Host receives message from widget
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://yourwidget.com') return; // CRITICAL: validate origin
  if (event.data.type === 'resize') {
    iframe.style.height = event.data.height + 'px';
  }
});
```

Bidirectional communication: Host can also send messages to widget (configuration updates, user state changes), and widget responds. Design a JSON-based protocol with message types (`{type: 'config', data: {...}}`), versioning, and error handling.

### 6. Authentication & Security

Widgets accessing authenticated data must handle auth securely:

- **JWT in URL**: Pass short-lived JWT in iframe src (`?token=xyz`), widget validates and exchanges for session cookie
- **OAuth popup flow**: Widget opens popup for OAuth login, receives token via postMessage when popup closes
- **Host-mediated auth**: Host page provides user token via postMessage, widget validates with your backend

Security considerations: (1) **CSP compliance** – Your widget must work under Content Security Policy restrictions (no inline scripts/styles, specify allowed sources); (2) **XSS prevention** – Sanitize any host-provided data, escape output; (3) **CSRF tokens** – Include tokens in state-modifying requests; (4) **Rate limiting** – Prevent abuse by malicious host pages making thousands of API calls.

### 7. Responsive Rendering & Theming

Widgets must adapt to host page constraints. The host might embed your widget in a 300px sidebar or 1200px main content area. Strategies:

- **Container queries** (modern): Widget detects its container width and adjusts layout
- **ResizeObserver**: Widget observes container size changes, re-renders accordingly
- **Breakpoints**: Define widget breakpoints (small <400px, medium 400-700px, large >700px)
- **Theming**: Allow host to customize colors via data attributes (`data-theme="dark"`) or CSS custom properties
- **RTL support**: Detect host page direction (`<html dir="rtl">`), mirror layout

### 8. Versioning & Updates

Widgets need careful versioning since you can't force hosts to update embed code. Strategies:

- **Semantic versioning**: `widget@1.2.3` where major changes break compatibility
- **Evergreen loading**: `<script src="widget.js">` always loads latest minor/patch version (1.x), major versions require explicit upgrade (`widget-v2.js`)
- **Deprecation lifecycle**: Announce breaking changes 6 months ahead, provide migration guide, maintain old versions for 1+ years
- **Feature flags**: Enable new features via backend config, allowing gradual rollout and A/B testing
- **Backward compatibility**: New widget versions must handle old initialization patterns

### 8. Versioning & Updates

Widgets need careful versioning since you can't force hosts to update embed code. Strategies:

- **Semantic versioning**: `widget@1.2.3` where major changes break compatibility
- **Evergreen loading**: `<script src="widget.js">` always loads latest minor/patch version (1.x), major versions require explicit upgrade (`widget-v2.js`)
- **Deprecation lifecycle**: Announce breaking changes 6 months ahead, provide migration guide, maintain old versions for 1+ years
- **Feature flags**: Enable new features via backend config, allowing gradual rollout and A/B testing
- **Backward compatibility**: New widget versions must handle old initialization patterns

## Code Examples

### Example 1: Basic Shadow DOM Widget with Loader

This example demonstrates a minimal widget using Shadow DOM for isolation and a compact loader pattern.

```javascript
// widget-loader.js (3KB - Host page includes this)
(function() {
  'use strict';
  
  // Create global API queue for early calls
  window.MyWidget = window.MyWidget || [];
  window.MyWidget.push = window.MyWidget.push || Array.prototype.push;
  
  // Find all widget containers
  const containers = document.querySelectorAll('[data-my-widget]');
  
  containers.forEach(container => {
    const widgetId = container.getAttribute('data-my-widget');
    const theme = container.getAttribute('data-theme') || 'light';
    const locale = container.getAttribute('data-locale') || 'en';
    
    // Create shadow root for isolation
    const shadowRoot = container.attachShadow({ mode: 'open' });
    
    // Load widget stylesheet
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = 'https://cdn.mywidget.com/v1/widget.css';
    shadowRoot.appendChild(styleLink);
    
    // Create mount point
    const mountPoint = document.createElement('div');
    mountPoint.id = 'widget-root';
    shadowRoot.appendChild(mountPoint);
    
    // Load main widget bundle asynchronously
    const script = document.createElement('script');
    script.src = 'https://cdn.mywidget.com/v1/widget.js';
    script.async = true;
    script.onload = () => {
      // Initialize widget when loaded
      if (window.MyWidgetApp) {
        window.MyWidgetApp.init({
          container: mountPoint,
          widgetId,
          theme,
          locale
        });
      }
    };
    document.head.appendChild(script);
  });
})();

// widget.js (Main bundle - 45KB gzipped)
window.MyWidgetApp = {
  init: function(config) {
    const { container, widgetId, theme, locale } = config;
    
    // Simple widget UI
    container.innerHTML = `
      <div class="widget widget--${theme}">
        <div class="widget__header">
          <h3 class="widget__title">${this.i18n[locale].title}</h3>
          <button class="widget__close" aria-label="Close">×</button>
        </div>
        <div class="widget__content">
          <p>${this.i18n[locale].loading}</p>
        </div>
      </div>
    `;
    
    // Fetch widget data
    this.loadData(widgetId, locale)
      .then(data => this.render(container, data, locale))
      .catch(err => this.renderError(container, err, locale));
    
    // Setup event listeners
    container.querySelector('.widget__close').addEventListener('click', () => {
      container.style.display = 'none';
    });
  },
  
  loadData: async function(widgetId, locale) {
    const response = await fetch(`https://api.mywidget.com/v1/widgets/${widgetId}?locale=${locale}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to load widget data');
    return response.json();
  },
  
  render: function(container, data, locale) {
    const contentEl = container.querySelector('.widget__content');
    contentEl.innerHTML = `
      <div class="widget__item">
        <strong>${data.title}</strong>
        <p>${data.description}</p>
        <button class="widget__cta">${this.i18n[locale].cta}</button>
      </div>
    `;
  },
  
  renderError: function(container, error, locale) {
    const contentEl = container.querySelector('.widget__content');
    contentEl.innerHTML = `<p class="widget__error">${this.i18n[locale].error}</p>`;
  },
  
  i18n: {
    en: { title: 'My Widget', loading: 'Loading...', cta: 'Learn More', error: 'Failed to load' },
    es: { title: 'Mi Widget', loading: 'Cargando...', cta: 'Saber Más', error: 'Error al cargar' }
  }
};
```

**Usage on host page:**
```html
<!-- Host page embeds widget with single line -->
<div data-my-widget="widget-123" data-theme="dark" data-locale="es"></div>
<script src="https://cdn.mywidget.com/v1/widget-loader.js" async></script>
```

### Example 2: Iframe Widget with postMessage Communication

This example shows an iframe-based widget with bidirectional communication and dynamic resizing.

```javascript
// widget-iframe-loader.js (Host page)
(function() {
  'use strict';
  
  class WidgetIframe {
    constructor(container, config) {
      this.container = container;
      this.config = config;
      this.iframe = null;
      this.messageQueue = [];
      this.ready = false;
      
      this.init();
    }
    
    init() {
      // Create iframe
      this.iframe = document.createElement('iframe');
      this.iframe.src = this.buildIframeSrc();
      this.iframe.style.cssText = 'width: 100%; border: none; display: block;';
      this.iframe.setAttribute('scrolling', 'no');
      this.iframe.setAttribute('title', 'Widget');
      
      // Setup message listener
      window.addEventListener('message', this.handleMessage.bind(this));
      
      this.container.appendChild(this.iframe);
    }
    
    buildIframeSrc() {
      const params = new URLSearchParams({
        widgetId: this.config.widgetId,
        theme: this.config.theme || 'light',
        locale: this.config.locale || 'en',
        version: '1'
      });
      return `https://widget.myapp.com/embed?${params}`;
    }
    
    handleMessage(event) {
      // CRITICAL: Validate origin
      if (event.origin !== 'https://widget.myapp.com') return;
      
      const message = event.data;
      
      switch(message.type) {
        case 'ready':
          this.ready = true;
          this.processQueue();
          break;
          
        case 'resize':
          // Update iframe height based on content
          this.iframe.style.height = message.height + 'px';
          break;
          
        case 'navigate':
          // Widget requests host navigation
          if (this.config.onNavigate) {
            this.config.onNavigate(message.url);
          }
          break;
          
        case 'event':
          // Custom event from widget
          if (this.config.onEvent) {
            this.config.onEvent(message.eventName, message.data);
          }
          break;
      }
    }
    
    sendMessage(type, data) {
      const message = { type, data, timestamp: Date.now() };
      
      if (!this.ready) {
        this.messageQueue.push(message);
        return;
      }
      
      this.iframe.contentWindow.postMessage(message, 'https://widget.myapp.com');
    }
    
    processQueue() {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        this.iframe.contentWindow.postMessage(message, 'https://widget.myapp.com');
      }
    }
    
    // Public API
    updateConfig(config) {
      this.sendMessage('config', config);
    }
    
    destroy() {
      window.removeEventListener('message', this.handleMessage);
      this.iframe.remove();
    }
  }
  
  // Initialize all widgets
  document.querySelectorAll('[data-iframe-widget]').forEach(container => {
    const widgetId = container.getAttribute('data-iframe-widget');
    const theme = container.getAttribute('data-theme');
    const locale = container.getAttribute('data-locale');
    
    new WidgetIframe(container, {
      widgetId,
      theme,
      locale,
      onNavigate: (url) => console.log('Navigate to:', url),
      onEvent: (name, data) => console.log('Widget event:', name, data)
    });
  });
})();

// widget-app.js (Inside iframe)
class WidgetApp {
  constructor() {
    this.config = this.parseConfig();
    this.init();
  }
  
  parseConfig() {
    const params = new URLSearchParams(window.location.search);
    return {
      widgetId: params.get('widgetId'),
      theme: params.get('theme') || 'light',
      locale: params.get('locale') || 'en',
      version: params.get('version') || '1'
    };
  }
  
  init() {
    // Setup message listener from parent
    window.addEventListener('message', this.handleMessage.bind(this));
    
    // Render widget
    this.render();
    
    // Notify parent we're ready
    this.sendToParent('ready', {});
    
    // Setup resize observer to notify parent of height changes
    this.observeResize();
  }
  
  handleMessage(event) {
    // Validate origin (parent domain)
    const allowedOrigins = ['https://customer-site.com', 'http://localhost:3000'];
    if (!allowedOrigins.includes(event.origin)) return;
    
    const { type, data } = event.data;
    
    switch(type) {
      case 'config':
        this.updateConfig(data);
        break;
      case 'theme':
        this.updateTheme(data.theme);
        break;
    }
  }
  
  sendToParent(type, data) {
    window.parent.postMessage({ type, ...data }, '*'); // '*' or specific origin
  }
  
  observeResize() {
    const resizeObserver = new ResizeObserver(entries => {
      const height = document.body.scrollHeight;
      this.sendToParent('resize', { height });
    });
    
    resizeObserver.observe(document.body);
  }
  
  render() {
    document.body.className = `widget-theme-${this.config.theme}`;
    document.body.innerHTML = `
      <div class="widget">
        <h2>Widget ${this.config.widgetId}</h2>
        <button id="ctaBtn">Click Me</button>
      </div>
    `;
    
    // Setup interactions
    document.getElementById('ctaBtn').addEventListener('click', () => {
      this.sendToParent('event', {
        eventName: 'cta_click',
        data: { widgetId: this.config.widgetId }
      });
      
      this.sendToParent('navigate', {
        url: 'https://myapp.com/landing'
      });
    });
  }
  
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.render();
  }
  
  updateTheme(theme) {
    this.config.theme = theme;
    document.body.className = `widget-theme-${theme}`;
  }
}

// Initialize widget app
new WidgetApp();
```

**Usage on host page:**
```html
<div data-iframe-widget="widget-456" data-theme="light" data-locale="en"></div>
<script src="https://cdn.mywidget.com/v1/widget-iframe-loader.js" async></script>
```

### Example 3: Advanced Widget with Authentication and Code Splitting

This example demonstrates a production-ready widget with JWT authentication, lazy loading, and error boundaries.

```javascript
// widget-advanced.js
class AdvancedWidget {
  constructor(config) {
    this.config = config;
    this.container = config.container;
    this.shadowRoot = this.container.attachShadow({ mode: 'open' });
    this.authToken = null;
    this.user = null;
    this.features = new Map();
    
    this.init();
  }
  
  async init() {
    try {
      // Load critical CSS inline
      this.injectStyles();
      
      // Show loading state
      this.renderLoading();
      
      // Authenticate
      await this.authenticate();
      
      // Load user data
      await this.loadUser();
      
      // Render main UI
      this.render();
      
      // Setup analytics
      this.trackEvent('widget_loaded', { widgetId: this.config.widgetId });
      
    } catch (error) {
      this.renderError(error);
      this.trackEvent('widget_error', { error: error.message });
    }
  }
  
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        padding: 16px;
      }
      .widget--loading { text-align: center; padding: 40px; }
      .widget--error { color: #d32f2f; }
      .widget__spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    this.shadowRoot.appendChild(style);
  }
  
  async authenticate() {
    // Exchange widget token for session token
    const widgetToken = this.config.token;
    
    if (!widgetToken) {
      throw new Error('Authentication token required');
    }
    
    const response = await fetch('https://api.mywidget.com/v1/auth/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${widgetToken}`
      },
      body: JSON.stringify({
        widgetId: this.config.widgetId,
        origin: window.location.origin
      })
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    const data = await response.json();
    this.authToken = data.token;
    
    // Setup token refresh before expiry (15min token, refresh at 14min)
    const expiresIn = data.expiresIn || 900; // seconds
    setTimeout(() => this.refreshToken(), (expiresIn - 60) * 1000);
  }
  
  async refreshToken() {
    try {
      const response = await fetch('https://api.mywidget.com/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.authToken = data.token;
        
        // Schedule next refresh
        setTimeout(() => this.refreshToken(), (data.expiresIn - 60) * 1000);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.renderError(new Error('Session expired. Please refresh the page.'));
    }
  }
  
  async loadUser() {
    const response = await fetch(`https://api.mywidget.com/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load user data');
    }
    
    this.user = await response.json();
  }
  
  renderLoading() {
    const container = document.createElement('div');
    container.className = 'widget widget--loading';
    container.innerHTML = `
      <div class="widget__spinner"></div>
      <p>Loading widget...</p>
    `;
    this.shadowRoot.appendChild(container);
  }
  
  render() {
    // Clear loading state
    this.shadowRoot.innerHTML = '';
    this.injectStyles();
    
    const container = document.createElement('div');
    container.className = 'widget';
    container.innerHTML = `
      <div class="widget__header">
        <h3>Welcome, ${this.escapeHtml(this.user.name)}</h3>
      </div>
      <div class="widget__content">
        <p>Widget ID: ${this.config.widgetId}</p>
        <button id="loadFeature" class="widget__btn">Load Advanced Feature</button>
      </div>
      <div id="featureContainer"></div>
    `;
    
    this.shadowRoot.appendChild(container);
    
    // Setup event listeners
    this.shadowRoot.getElementById('loadFeature').addEventListener('click', () => {
      this.loadFeature('advancedChart');
    });
  }
  
  async loadFeature(featureName) {
    if (this.features.has(featureName)) {
      this.features.get(featureName).show();
      return;
    }
    
    try {
      // Dynamic import for code splitting (lazy load feature modules)
      const featureModule = await import(`https://cdn.mywidget.com/v1/features/${featureName}.js`);
      
      const featureContainer = this.shadowRoot.getElementById('featureContainer');
      const feature = new featureModule.default({
        container: featureContainer,
        authToken: this.authToken,
        config: this.config
      });
      
      this.features.set(featureName, feature);
      
      this.trackEvent('feature_loaded', { feature: featureName });
      
    } catch (error) {
      console.error('Failed to load feature:', error);
      this.showNotification('Failed to load feature', 'error');
    }
  }
  
  renderError(error) {
    this.shadowRoot.innerHTML = '';
    this.injectStyles();
    
    const container = document.createElement('div');
    container.className = 'widget widget--error';
    container.innerHTML = `
      <h3>Error</h3>
      <p>${this.escapeHtml(error.message)}</p>
      <button id="retry" class="widget__btn">Retry</button>
    `;
    
    this.shadowRoot.appendChild(container);
    
    this.shadowRoot.getElementById('retry').addEventListener('click', () => {
      this.init();
    });
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `widget__notification widget__notification--${type}`;
    notification.textContent = message;
    
    this.shadowRoot.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }
  
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  trackEvent(eventName, data) {
    // Send analytics to backend
    fetch('https://api.mywidget.com/v1/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify({
        event: eventName,
        data,
        widgetId: this.config.widgetId,
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.error('Analytics error:', err));
  }
  
  destroy() {
    // Cleanup
    this.features.forEach(feature => feature.destroy && feature.destroy());
    this.shadowRoot.innerHTML = '';
  }
}

// Global API
window.MyAdvancedWidget = {
  instances: new Map(),
  
  init: function(config) {
    const widget = new AdvancedWidget(config);
    this.instances.set(config.widgetId, widget);
    return widget;
  },
  
  getInstance: function(widgetId) {
    return this.instances.get(widgetId);
  },
  
  destroy: function(widgetId) {
    const widget = this.instances.get(widgetId);
    if (widget) {
      widget.destroy();
      this.instances.delete(widgetId);
    }
  }
};
```

**Usage with authentication:**
```html
<div id="widget-container"></div>
<script src="https://cdn.mywidget.com/v1/widget-advanced.js" async onload="initWidget()"></script>
<script>
function initWidget() {
  window.MyAdvancedWidget.init({
    container: document.getElementById('widget-container'),
    widgetId: 'widget-789',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    theme: 'light',
    locale: 'en'
  });
}
</script>
```

## Common Mistakes

### 1. **Polluting Global Scope**

❌ **Wrong**: Widget creates global variables that conflict with host page.

```javascript
// widget.js
var data = fetchData(); // Overwrites host's 'data' variable
function render() {} // Conflicts with host's render()
```

✅ **Correct**: Use IIFE or modules to encapsulate widget code.

```javascript
// widget.js (IIFE pattern)
(function() {
  'use strict';
  var data = fetchData();
  function render() {}
  
  // Only expose necessary API
  window.MyWidget = {
    init: function(config) { /* ... */ }
  };
})();

// Or use ES modules with unique namespace
export class MyWidget {
  // All code scoped to module
}
```

**Why it matters**: Third-party sites may use the same variable names, causing hard-to-debug conflicts. A chat widget that overwrites the host's `$` jQuery reference breaks the entire site.

### 2. **Not Validating postMessage Origin**

❌ **Wrong**: Widget accepts messages from any origin without validation.

```javascript
window.addEventListener('message', (event) => {
  // DANGEROUS: No origin check
  if (event.data.type === 'setToken') {
    this.authToken = event.data.token; // Malicious site can inject tokens
  }
});
```

✅ **Correct**: Always validate message origin before processing.

```javascript
window.addEventListener('message', (event) => {
  // CRITICAL: Validate origin
  const allowedOrigins = ['https://trusted-host.com', 'https://widget.myapp.com'];
  if (!allowedOrigins.includes(event.origin)) {
    console.warn('Rejected message from unauthorized origin:', event.origin);
    return;
  }
  
  if (event.data.type === 'setToken') {
    this.authToken = event.data.token;
  }
});
```

**Why it matters**: Without origin validation, malicious pages can send fake messages to your widget, potentially stealing auth tokens, triggering unauthorized actions, or injecting XSS payloads. This is a critical security vulnerability.

### 3. **Blocking Page Load with Synchronous Scripts**

❌ **Wrong**: Widget loader blocks HTML parsing and page rendering.

```html
<!-- Host page -->
<script src="https://cdn.mywidget.com/widget.js"></script>
<!-- Page rendering blocked until widget.js downloads and executes -->
```

✅ **Correct**: Load widget asynchronously with async or defer attributes.

```html
<!-- Host page -->
<script src="https://cdn.mywidget.com/widget.js" async></script>
<!-- Or use defer for scripts that need DOM ready -->
<script src="https://cdn.mywidget.com/widget.js" defer></script>

<!-- Or programmatic async loading -->
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://cdn.mywidget.com/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>
```

**Why it matters**: A slow widget (500ms to download) blocks the entire page from rendering, creating a terrible user experience. Async loading ensures the widget loads in parallel without blocking the host page. Google Analytics, Facebook Pixel, and other third-party embeds all use async loading for this reason.

## Quiz

### Question 1: Shadow DOM vs Iframe Isolation

**Q**: What are the key differences between Shadow DOM and iframe isolation for widgets, and when would you choose each approach?

**A**: 
- **Shadow DOM**: Provides style and DOM encapsulation within the same browsing context. Advantages: (1) Better performance (no separate page load), (2) Can access parent DOM selectively, (3) Seamless integration (appears as part of page). Disadvantages: (1) Limited browser support (no IE11), (2) Some libraries struggle with shadow roots, (3) Weaker security isolation (shares same origin, can be accessed via JavaScript if mode: 'open').

- **Iframe**: Creates completely separate browsing context with its own global scope. Advantages: (1) Maximum security isolation (malicious host can't access widget internals), (2) Universal compatibility (works everywhere), (3) Complete style isolation (host CSS can't interfere). Disadvantages: (1) Performance overhead (separate page load, HTTP request), (2) Height calculation complexity (need postMessage to communicate content height), (3) Restrictions on fullscreen/modals, (4) SEO invisibility.

**When to choose**: Use **Shadow DOM** for simple read-only widgets on trusted sites where performance matters (news feed, product recommendations, social sharing buttons). Use **iframe** for complex interactive widgets requiring authentication on untrusted third-party sites where security is critical (payment forms, chat widgets, embedded dashboards).

**Example scenario**: A payment widget processing credit cards should always use iframe isolation to prevent malicious host pages from accessing payment data via JavaScript. A simple "Share on Twitter" button can use Shadow DOM for faster rendering.

### Question 2: Widget Bundle Optimization

**Q**: A widget's initial bundle is 800KB, causing slow load times on customer sites. What optimization strategies would you apply to reduce it below 50KB while maintaining functionality?

**A**:

1. **Code Splitting**: Identify features loaded on-demand vs immediately required. Core widget (authentication, basic UI) loads first (~40KB), advanced features (charts, file upload, settings panel) lazy-load when user interacts. Use dynamic `import()` to split bundles:
   ```javascript
   // Load chart module only when needed
   const chartModule = await import('./features/chart.js');
   ```

2. **Tree Shaking**: Remove unused code by ensuring ES modules and analyzing bundle with webpack-bundle-analyzer. If widget includes date library (moment.js 72KB) but only uses formatting, switch to lightweight alternative (date-fns 12KB) and import only needed functions.

3. **External Dependencies**: If widget uses React (130KB), provide two bundle versions: (1) Standalone bundle including React for non-React hosts, (2) External bundle assuming host provides React as shared dependency (configured via webpack externals). Host pages already using React share that dependency, saving 130KB.

4. **Compression**: Enable Gzip (87% reduction) or Brotli (better compression) on CDN. An 800KB bundle becomes ~100KB gzipped, but still too large. After code splitting and tree shaking to 200KB uncompressed, Gzip reduces to ~25KB.

5. **Critical CSS Inline**: Embed critical above-fold styles (~3KB) inline in JavaScript, lazy-load theme and icon fonts. Eliminate separate CSS HTTP request.

6. **Minification**: Use Terser to minify JavaScript (remove whitespace, shorten variable names, remove comments). Typically 40-50% size reduction.

**Result**: Original 800KB → Code split to 200KB core → Tree shake to 150KB → Gzip to ~20KB initial load, with additional ~180KB lazy-loaded features as needed.

### Question 3: Cross-Origin Authentication

**Q**: How should a widget securely authenticate users when embedded on third-party sites? Compare JWT-in-URL vs OAuth popup flow approaches.

**A**:

**JWT-in-URL Approach**:
```javascript
// Host page generates short-lived JWT (backend)
const widgetToken = generateWidgetToken(userId, widgetId, {expiresIn: '5m'});

// Embed widget with token in iframe src
<iframe src="https://widget.myapp.com/embed?token=eyJhbG..."></iframe>

// Widget (inside iframe) validates token and exchanges for session
const urlToken = new URLSearchParams(window.location.search).get('token');
const sessionToken = await exchangeToken(urlToken);
// Set HTTP-only cookie for session
```

**Advantages**: (1) Simple implementation, (2) Works without popups (no popup blockers), (3) Token never exposed to host page JavaScript. **Disadvantages**: (1) Token visible in URL (avoid sensitive data), (2) Requires host backend to generate JWT, (3) Short expiry needed (5min) to limit URL exposure risk.

**OAuth Popup Flow**:
```javascript
// Widget triggers OAuth flow
function loginWithOAuth() {
  const popup = window.open(
    'https://widget.myapp.com/oauth/authorize?redirect_uri=...',
    'oauth',
    'width=600,height=700'
  );
  
  // Listen for OAuth callback
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://widget.myapp.com') return;
    if (event.data.type === 'oauth_success') {
      this.authToken = event.data.token;
      popup.close();
    }
  });
}
```

**Advantages**: (1) Standard OAuth flow (works with any OAuth provider), (2) User sees familiar login UI, (3) No host backend required, (4) Supports social login (Google, Facebook). **Disadvantages**: (1) Popup blockers may interfere (user must allow popups), (2) Poor mobile UX (popups problematic on mobile), (3) More complex implementation.

**Recommendation**: Use **JWT-in-URL** for widgets where host page authenticates users (logged-in dashboard embedding widget), ensuring host backend validates user and generates short-lived JWT. Use **OAuth popup** for widgets on unauthenticated third-party sites (comment widget on blog) where users login directly to your service. For best UX, detect if user already authenticated (check for existing session cookie) before showing login UI.

### Question 4: Responsive Widget Rendering

**Q**: A widget is embedded in containers ranging from 250px (mobile sidebar) to 1200px (desktop main content). How do you implement responsive rendering without media queries (which target viewport, not container)?

**A**:

**Container Queries (Modern)**:
```css
/* Widget styles using container queries */
.widget-container {
  container-type: inline-size;
  container-name: widget;
}

@container widget (max-width: 400px) {
  .widget { 
    flex-direction: column; /* Stack vertically */
  }
  .widget__image {
    width: 100%;
  }
}

@container widget (min-width: 700px) {
  .widget {
    flex-direction: row; /* Side-by-side */
    gap: 24px;
  }
}
```

**Advantages**: Native CSS solution, declarative, browser-optimized. **Disadvantages**: Limited browser support (Chrome 105+, Firefox 110+, Safari 16+), need fallback for older browsers.

**ResizeObserver (Fallback)**:
```javascript
class ResponsiveWidget {
  constructor(container) {
    this.container = container;
    this.currentBreakpoint = null;
    this.observeResize();
  }
  
  observeResize() {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        this.updateBreakpoint(width);
      }
    });
    
    resizeObserver.observe(this.container);
  }
  
  updateBreakpoint(width) {
    let breakpoint;
    if (width < 400) breakpoint = 'small';
    else if (width < 700) breakpoint = 'medium';
    else breakpoint = 'large';
    
    if (breakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = breakpoint;
      this.container.setAttribute('data-breakpoint', breakpoint);
      this.render();
    }
  }
  
  render() {
    // Render different layouts based on breakpoint
    if (this.currentBreakpoint === 'small') {
      // Minimal UI for narrow containers
    } else if (this.currentBreakpoint === 'large') {
      // Full-featured UI for wide containers
    }
  }
}
```

**CSS targeting breakpoint attribute**:
```css
.widget[data-breakpoint="small"] .widget__header {
  font-size: 14px;
  padding: 8px;
}

.widget[data-breakpoint="large"] .widget__header {
  font-size: 18px;
  padding: 16px;
}
```

**Advantages**: Works in all modern browsers, JavaScript control allows conditional feature loading (don't render complex chart in small container). **Disadvantages**: Requires JavaScript, slight performance overhead.

**Hybrid Approach**: Use Container Queries with ResizeObserver fallback for older browsers, detected via feature detection:
```javascript
if ('container' in document.documentElement.style) {
  // Use pure CSS container queries
} else {
  // Fallback to ResizeObserver
  this.observeResize();
}
```

### Question 5: Widget Versioning Strategy

**Q**: Your widget is embedded on 10,000 customer sites. You need to release a breaking change (new API). How do you implement versioning to allow gradual migration without breaking existing embeds?

**A**:

**Semantic Versioning with Separate Bundles**:

1. **Version in URL**: Customers embed specific major version.
   ```html
   <!-- Old embeds continue using v1 -->
   <script src="https://cdn.mywidget.com/v1/widget.js"></script>
   
   <!-- New embeds use v2 -->
   <script src="https://cdn.mywidget.com/v2/widget.js"></script>
   ```

2. **Evergreen Minor/Patch Updates**: Within major version, auto-update.
   ```
   v1/widget.js → Always latest v1.x (currently v1.5.3)
   v2/widget.js → Always latest v2.x (currently v2.1.0)
   ```
   
   Customers automatically get bug fixes and non-breaking features (v1.5.2 → v1.5.3) without code changes, but must explicitly upgrade for breaking changes (v1 → v2).

3. **Deprecation Timeline**:
   - **T+0 months**: Announce v2 with migration guide, v1 enters maintenance mode
   - **T+3 months**: Feature freeze on v1 (only critical security fixes)
   - **T+6 months**: Deprecation warnings in v1 console ("v1 will be EOL in 6 months")
   - **T+12 months**: End-of-life for v1, redirect v1/widget.js to v2 with compatibility shim
   - **T+18 months**: Remove v1 completely

4. **Backward Compatibility Shim**:
   ```javascript
   // v2/widget.js
   window.MyWidget = {
     // New v2 API
     init: function(config) { /* v2 implementation */ },
     
     // Deprecated v1 API (compatibility layer)
     initialize: function(options) {
       console.warn('MyWidget.initialize() is deprecated. Use MyWidget.init() instead.');
       // Transform v1 options to v2 config
       const config = {
         widgetId: options.id,
         theme: options.color === 'blue' ? 'light' : 'dark',
         // ... map all v1 options to v2
       };
       return this.init(config);
     }
   };
   ```

5. **Feature Flags for Gradual Rollout**:
   ```javascript
   // Backend controls feature availability per customer
   const features = await fetch(`/api/features?widgetId=${id}`).then(r => r.json());
   
   if (features.newChatUI) {
     renderV2ChatUI();
   } else {
     renderV1ChatUI(); // Old customers see old UI even on v2 bundle
   }
   ```

**Migration Communication**:
- Email campaigns to customers explaining benefits, timeline
- In-widget notifications ("New version available! Upgrade for better performance")
- Migration dashboard showing which sites use old version
- Dedicated support for high-value customers

**Result**: Gradual migration over 12-18 months without breaking any existing embeds, with clear communication and automated warnings ensuring customers have time to upgrade.

## References

- [Micro Frontends - Martin Fowler](https://martinfowler.com/articles/micro-frontends.html)
- [Web Components Documentation - MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Shadow DOM v1: Self-Contained Web Components](https://developers.google.com/web/fundamentals/web-components/shadowdom)
- [postMessage API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [ResizeObserver API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [Container Queries - CSS-Tricks](https://css-tricks.com/container-queries/)
- [Third-Party JavaScript - Ben Vinegar & Anton Kovalyov](https://www.manning.com/books/third-party-javascript)
- [Iframe Best Practices - OWASP](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)