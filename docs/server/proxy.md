---
title: Proxy
layout: doc
slug: proxy
---

# Proxy

## Key Insight

A proxy server acts as an intermediary between your frontend and backend, solving the fundamental CORS (Cross-Origin Resource Sharing) problem in development: when your React app runs on `localhost:3000` and API runs on `localhost:5000`, browsers block requests due to different origins (ports differ). The proxy makes the browser think API requests come from the same origin by forwarding `/api/*` requests to the backend server while serving frontend assets from the same domain. This isn't just a dev convenience—it's production architecture: reverse proxies (Nginx, Cloudflare) sit in front of applications to provide SSL termination, load balancing, caching, DDoS protection, and origin hiding. The critical distinction: **development proxy** (Webpack Dev Server, Vite) simplifies local CORS issues, **reverse proxy** (Nginx, HAProxy) handles production traffic routing, security, and performance at scale.

## Detailed Description

### 1. Understanding Proxy vs Reverse Proxy

**Forward Proxy** (client-side):
- Client knows it's using a proxy
- Hides client identity from server
- Common use: Corporate network proxy, VPN
- Client → Proxy → Internet → Server

**Reverse Proxy** (server-side):
- Client doesn't know proxy exists
- Hides server identity/infrastructure from client
- Common use: Nginx, Cloudflare, load balancers
- Client → Internet → Proxy → Backend Server(s)

**Frontend development uses reverse proxy pattern**: Browser thinks it's talking to one server (`localhost:3000`), but proxy routes API requests to backend (`localhost:5000`) while serving frontend assets directly.

### 2. The CORS Problem and Proxy Solution

**CORS Restriction**:
Browsers enforce Same-Origin Policy: JavaScript can only make requests to the same origin (protocol + domain + port). Different origins require CORS headers from server.

**Without Proxy**:
```javascript
// Frontend: http://localhost:3000
fetch('http://localhost:5000/api/users')
  .then(r => r.json())
  .catch(err => console.error(err));

// Browser console:
// ❌ CORS error: No 'Access-Control-Allow-Origin' header
// Request blocked by browser before reaching server
```

**With Proxy**:
```javascript
// Frontend: http://localhost:3000
fetch('/api/users')  // Same origin! (localhost:3000)
  .then(r => r.json());

// Proxy configuration:
// localhost:3000/api/* → localhost:5000/api/*

// Browser sees: http://localhost:3000/api/users (same origin ✓)
// Proxy forwards to: http://localhost:5000/api/users
// Response comes back through proxy
// No CORS error!
```

The proxy acts as a middleman, making cross-origin requests on behalf of the browser (servers aren't subject to CORS), then returning results as same-origin responses.

### 3. Development Proxy Configurations

**Create React App (package.json)**:
Simplest setup—all unrecognized requests forwarded to backend:

```json
{
  "proxy": "http://localhost:5000"
}
```

- `/api/users` → `http://localhost:5000/api/users`
- `/static/logo.png` → Served from React build (if exists locally)
- Automatic fallback to proxy for 404s

**Vite (vite.config.js)**:
```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};
```

- `changeOrigin: true` - Changes `Host` header to match target
- `rewrite` - Removes `/api` prefix before forwarding

**Webpack Dev Server (webpack.config.js)**:
```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false  // Allow self-signed certs
      }
    }
  }
};
```

**http-proxy-middleware (setupProxy.js)**:
Most flexible—programmatic control:

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: { '^/api': '/v1' },  // /api/users → /v1/users
      
      // WebSocket support
      ws: true,
      
      // Add custom headers
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('X-Forwarded-For', req.ip);
      },
      
      // Modify response
      onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['X-Proxy-By'] = 'Dev Server';
      },
      
      // Error handling
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(502).send('Bad Gateway');
      }
    })
  );
};
```

### 4. Reverse Proxy in Production (Nginx)

Production apps typically run behind Nginx reverse proxy:

```nginx
# nginx.conf
server {
  listen 80;
  server_name example.com;
  
  # Frontend static files
  location / {
    root /var/www/frontend/build;
    try_files $uri $uri/ /index.html;  # SPA fallback
  }
  
  # Proxy API requests to backend
  location /api/ {
    proxy_pass http://localhost:5000/;
    proxy_http_version 1.1;
    
    # Forward headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # WebSocket support
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }
  
  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
    root /var/www/frontend/build;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**Benefits**:
1. **SSL Termination**: Nginx handles HTTPS, backends use HTTP internally
2. **Load Balancing**: Distribute requests across multiple backend servers
3. **Caching**: Cache API responses, reduce backend load
4. **Security**: Hide backend server details, filter malicious requests
5. **Compression**: gzip/brotli compression before sending to client

### 5. Advanced Proxy Features

**Load Balancing** (Nginx):
```nginx
upstream backend {
  least_conn;  # Route to server with fewest connections
  server backend1.example.com:5000;
  server backend2.example.com:5000;
  server backend3.example.com:5000;
}

location /api/ {
  proxy_pass http://backend/;
}
```

**Caching** (Nginx):
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api/ {
  proxy_cache api_cache;
  proxy_cache_valid 200 10m;  # Cache 200 responses for 10 minutes
  proxy_cache_key "$scheme$request_method$host$request_uri";
  add_header X-Cache-Status $upstream_cache_status;
  
  proxy_pass http://localhost:5000/;
}
```

**Rate Limiting** (Nginx):
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
  limit_req zone=api_limit burst=20 nodelay;
  proxy_pass http://localhost:5000/;
}
```

**Circuit Breaker Pattern**:
```javascript
// http-proxy-middleware with retry logic
const proxy = createProxyMiddleware({
  target: 'http://localhost:5000',
  
  // Retry failed requests
  retry: {
    limit: 3,
    delay: 1000,
    shouldRetry: (err, req) => {
      // Retry on network errors, not on 4xx errors
      return err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT';
    }
  }
});
```

### 6. API Gateway vs Reverse Proxy

**Reverse Proxy** (Nginx, HAProxy):
- Routes requests to backend servers
- SSL termination, load balancing, caching
- Infrastructure-level concerns
- Simple request forwarding

**API Gateway** (Kong, AWS API Gateway, Apigee):
- All reverse proxy features +
- Authentication/authorization
- Rate limiting per API key
- Request/response transformation
- API versioning
- Analytics and monitoring
- Microservices orchestration

API Gateway is "smart proxy" with business logic. Reverse proxy is "dumb pipe" focused on performance and routing.

### 7. Proxy Authentication Patterns

**Cookie Forwarding**:
```javascript
// setupProxy.js
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  
  // Forward cookies from browser to backend
  onProxyReq: (proxyReq, req) => {
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
    }
  },
  
  // Forward Set-Cookie from backend to browser
  onProxyRes: (proxyRes, req, res) => {
    const setCookie = proxyRes.headers['set-cookie'];
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }
  }
}));
```

**Token Injection**:
```javascript
// Add auth token to proxied requests
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  onProxyReq: (proxyReq, req) => {
    const token = process.env.API_TOKEN;
    proxyReq.setHeader('Authorization', `Bearer ${token}`);
  }
}));
```

### 8. Debugging Proxied Requests

**Enable Logging**:
```javascript
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  logLevel: 'debug',
  
  onProxyReq: (proxyReq, req) => {
    console.log('→ Proxy Request:', req.method, req.url);
    console.log('  Target:', 'http://localhost:5000' + req.url);
  },
  
  onProxyRes: (proxyRes, req) => {
    console.log('← Proxy Response:', proxyRes.statusCode, req.url);
  },
  
  onError: (err, req, res) => {
    console.error('✗ Proxy Error:', err.code, err.message);
  }
}));
```

**Browser DevTools**:
- Network tab shows request to `/api/users` (same origin)
- Check "Initiator" column to see which code made request
- Response headers show if proxy added headers (`X-Proxy-By`)

**Nginx Access Logs**:
```nginx
log_format proxy '$remote_addr - $remote_user [$time_local] '
                 '"$request" $status $body_bytes_sent '
                 '"$http_referer" "$http_user_agent" '
                 'upstream: $upstream_addr';

access_log /var/log/nginx/proxy.log proxy;
```

### 9. Security Considerations

**Header Sanitization**:
```nginx
# Remove internal headers before sending to client
proxy_hide_header X-Powered-By;
proxy_hide_header Server;

# Add security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

**IP Whitelisting**:
```nginx
location /admin/ {
  allow 192.168.1.0/24;  # Office network
  deny all;
  proxy_pass http://localhost:5000/admin/;
}
```

**SSL/TLS Best Practices**:
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
```

## Code Examples

### Example 1: Development Proxy with Multiple Backends

```javascript
// src/setupProxy.js (Create React App)
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // API v1 (legacy backend)
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: { '^/api/v1': '' },
      
      // Add API version header
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('X-API-Version', '1');
      }
    })
  );
  
  // API v2 (new backend)
  app.use(
    '/api/v2',
    createProxyMiddleware({
      target: 'http://localhost:6000',
      changeOrigin: true,
      pathRewrite: { '^/api/v2': '' },
      
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('X-API-Version', '2');
      }
    })
  );
  
  // GraphQL endpoint
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      ws: true,  // WebSocket support for subscriptions
      
      // Add auth token from environment
      onProxyReq: (proxyReq) => {
        const token = process.env.REACT_APP_GRAPHQL_TOKEN;
        if (token) {
          proxyReq.setHeader('Authorization', `Bearer ${token}`);
        }
      }
    })
  );
  
  // External API (with API key)
  app.use(
    '/external',
    createProxyMiddleware({
      target: 'https://api.external-service.com',
      changeOrigin: true,
      pathRewrite: { '^/external': '' },
      
      // Add API key
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('X-API-Key', process.env.EXTERNAL_API_KEY);
      },
      
      // Handle rate limiting
      onProxyRes: (proxyRes, req, res) => {
        if (proxyRes.statusCode === 429) {
          console.warn('Rate limited by external API');
          res.status(429).json({
            error: 'Too many requests. Please try again later.'
          });
        }
      }
    })
  );
  
  // Mock API (local JSON server)
  app.use(
    '/mock',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^/mock': '' }
    })
  );
};

// Usage in React:
// fetch('/api/v1/users')      → http://localhost:5000/users
// fetch('/api/v2/posts')      → http://localhost:6000/posts
// fetch('/graphql')           → http://localhost:4000/graphql
// fetch('/external/weather')  → https://api.external-service.com/weather
// fetch('/mock/todos')        → http://localhost:3001/todos
```

### Example 2: Production Nginx Configuration with SSL and Load Balancing

```nginx
# /etc/nginx/nginx.conf

# Backend server pool
upstream api_backend {
  least_conn;  # Route to server with fewest active connections
  
  server api1.internal:5000 max_fails=3 fail_timeout=30s;
  server api2.internal:5000 max_fails=3 fail_timeout=30s;
  server api3.internal:5000 max_fails=3 fail_timeout=30s;
  
  # Health check
  keepalive 32;
}

# Cache configuration
proxy_cache_path /var/cache/nginx/api 
  levels=1:2 
  keys_zone=api_cache:10m 
  max_size=500m 
  inactive=60m 
  use_temp_path=off;

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

# HTTP → HTTPS redirect
server {
  listen 80;
  server_name example.com www.example.com;
  
  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }
  
  location / {
    return 301 https://$server_name$request_uri;
  }
}

# HTTPS server
server {
  listen 443 ssl http2;
  server_name example.com www.example.com;
  
  # SSL configuration
  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;
  
  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
  
  # Frontend static files
  root /var/www/frontend/build;
  index index.html;
  
  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
    
    # Cache control for HTML
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }
  
  # Static assets (aggressive caching)
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
  }
  
  # API proxy (no caching for dynamic content)
  location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    
    proxy_pass http://api_backend/;
    proxy_http_version 1.1;
    
    # Headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Request-ID $request_id;
    
    # WebSocket support
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # Buffering
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;
    
    # Error handling
    proxy_intercept_errors on;
    error_page 502 503 504 /50x.html;
  }
  
  # Auth endpoints (stricter rate limiting)
  location ~ ^/api/(login|register|reset-password) {
    limit_req zone=auth_limit burst=5 nodelay;
    
    proxy_pass http://api_backend;
    proxy_http_version 1.1;
    
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  
  # Public API (cached)
  location /api/public/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    proxy_cache_bypass $http_cache_control;
    add_header X-Cache-Status $upstream_cache_status;
    
    proxy_pass http://api_backend/public/;
    proxy_http_version 1.1;
    
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  
  # Admin panel (IP whitelisting)
  location /admin/ {
    allow 192.168.1.0/24;  # Office network
    allow 10.0.0.0/8;       # VPN
    deny all;
    
    proxy_pass http://api_backend/admin/;
    proxy_http_version 1.1;
    
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  
  # Error pages
  location = /50x.html {
    root /var/www/errors;
    internal;
  }
  
  # Health check endpoint
  location /health {
    access_log off;
    return 200 "OK\n";
    add_header Content-Type text/plain;
  }
}

# Logging
log_format main '$remote_addr - $remote_user [$time_local] '
                '"$request" $status $body_bytes_sent '
                '"$http_referer" "$http_user_agent" '
                'rt=$request_time uct="$upstream_connect_time" '
                'uht="$upstream_header_time" urt="$upstream_response_time"';

access_log /var/log/nginx/access.log main;
error_log /var/log/nginx/error.log warn;
```

### Example 3: Vite Proxy with WebSocket and Environment-Specific Backends

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    server: {
      port: 3000,
      
      proxy: {
        // REST API
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          
          configure: (proxy, options) => {
            // Add custom headers
            proxy.on('proxyReq', (proxyReq, req, res) => {
              proxyReq.setHeader('X-Frontend-Version', env.VITE_APP_VERSION);
              
              // Forward cookies
              if (req.headers.cookie) {
                proxyReq.setHeader('Cookie', req.headers.cookie);
              }
              
              console.log('[Proxy]', req.method, req.url, '→', options.target + proxyReq.path);
            });
            
            // Handle errors
            proxy.on('error', (err, req, res) => {
              console.error('[Proxy Error]', err.message);
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                error: 'Bad Gateway',
                message: 'Unable to reach backend server'
              }));
            });
            
            // Log responses
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('[Proxy]', proxyRes.statusCode, req.url);
            });
          }
        },
        
        // WebSocket (Socket.io)
        '/socket.io': {
          target: env.VITE_WS_URL || 'ws://localhost:5000',
          changeOrigin: true,
          ws: true,
          
          configure: (proxy) => {
            proxy.on('upgrade', (req, socket, head) => {
              console.log('[WebSocket] Upgrade:', req.url);
            });
            
            proxy.on('error', (err) => {
              console.error('[WebSocket Error]', err.message);
            });
          }
        },
        
        // GraphQL
        '/graphql': {
          target: env.VITE_GRAPHQL_URL || 'http://localhost:4000',
          changeOrigin: true,
          
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              // Add auth token
              const token = env.VITE_GRAPHQL_TOKEN;
              if (token) {
                proxyReq.setHeader('Authorization', `Bearer ${token}`);
              }
            });
          }
        },
        
        // External service (with retry logic)
        '/external': {
          target: 'https://api.external-service.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/external/, ''),
          
          configure: (proxy) => {
            let retryCount = 0;
            const maxRetries = 3;
            
            proxy.on('error', (err, req, res) => {
              if (retryCount < maxRetries) {
                retryCount++;
                console.log(`[Retry] Attempt ${retryCount}/${maxRetries}`);
                // Retry logic would go here
              } else {
                console.error('[External API] Max retries exceeded');
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  error: 'Service Unavailable',
                  message: 'External service is temporarily unavailable'
                }));
              }
            });
          }
        }
      }
    },
    
    // Environment-specific builds
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
      __API_URL__: JSON.stringify(env.VITE_API_URL)
    }
  };
});

// .env.development
/*
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_GRAPHQL_URL=http://localhost:4000
VITE_GRAPHQL_TOKEN=dev_token_123
VITE_APP_VERSION=1.0.0-dev
*/

// .env.production
/*
VITE_API_URL=https://api.example.com
VITE_WS_URL=wss://api.example.com
VITE_GRAPHQL_URL=https://graphql.example.com
VITE_GRAPHQL_TOKEN=prod_token_xyz
VITE_APP_VERSION=1.0.0
*/

// Usage in React:
// fetch('/api/users')      → http://localhost:5000/users (dev)
//                          → https://api.example.com/users (prod)
// 
// io('/socket.io')         → ws://localhost:5000 (dev)
//                          → wss://api.example.com (prod)
```

## Common Mistakes

### 1. Not Configuring changeOrigin

❌ **Wrong**: Missing `changeOrigin: true` causes backend to reject requests.

```javascript
// setupProxy.js (BAD)
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000'
  // Missing: changeOrigin: true
}));

// Backend receives request with Host: localhost:3000
// If backend validates Host header, request fails
// Error: Invalid Host header
```

✅ **Correct**: Set `changeOrigin: true` to rewrite Host header.

```javascript
// setupProxy.js (GOOD)
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true  // Changes Host header to localhost:5000
}));

// Backend receives request with Host: localhost:5000
// Backend accepts request ✓
```

**Why it matters**: Some backends (especially those behind load balancers or virtual hosts) validate the `Host` header. Without `changeOrigin`, proxy sends `Host: localhost:3000` but backend expects `Host: localhost:5000`, causing 400 Bad Request or 403 Forbidden.

### 2. Proxy in Production Build

❌ **Wrong**: Development proxy config shipped to production.

```json
{
  "proxy": "http://localhost:5000"
}
```

```bash
npm run build
# Build creates static files
# Deployed to Nginx/Apache

# Production:
# Frontend: https://example.com
# fetch('/api/users') → https://example.com/api/users
# No proxy! Static files can't proxy requests
# 404 Not Found (no /api/users file exists)
```

✅ **Correct**: Use environment variables for API URLs in production.

```javascript
// config.js
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://api.example.com'
    : '/api');  // Use proxy in development

export { API_URL };

// App.js
import { API_URL } from './config';

fetch(`${API_URL}/users`)
  .then(r => r.json());

// Development: /api/users (proxied to localhost:5000)
// Production: https://api.example.com/users (direct request)
```

Or configure Nginx as reverse proxy in production (see Example 2).

**Why it matters**: Development proxy only works with dev server (Webpack Dev Server, Vite). Production static files can't proxy—they're just HTML/CSS/JS served by Nginx/Apache. Need either client-side API URL configuration or server-side reverse proxy.

### 3. Not Handling Proxy Errors

❌ **Wrong**: No error handling for backend downtime.

```javascript
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true
  // No onError handler
}));

// Backend crashes:
// fetch('/api/users') → Proxy error ECONNREFUSED
// Browser sees: ERR_EMPTY_RESPONSE
// No useful error message for debugging
```

✅ **Correct**: Handle proxy errors gracefully.

```javascript
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  
  onError: (err, req, res) => {
    console.error('Proxy error:', err.code, err.message);
    
    // Send meaningful error response
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Unable to reach backend server',
      code: err.code,
      target: 'http://localhost:5000'
    });
  },
  
  // Log successful proxies too
  onProxyReq: (proxyReq, req) => {
    console.log('[Proxy]', req.method, req.url);
  },
  
  onProxyRes: (proxyRes, req) => {
    if (proxyRes.statusCode >= 400) {
      console.error('[Proxy Error]', proxyRes.statusCode, req.url);
    }
  }
}));

// Backend crashes:
// fetch('/api/users')
// → Browser receives 502 with JSON error
// → Console shows: "Proxy error: ECONNREFUSED Connection refused"
// → Easier debugging ✓
```

**Why it matters**: Default proxy errors are cryptic (`ERR_EMPTY_RESPONSE`, `ERR_CONNECTION_REFUSED`). Without error handlers, developers waste time debugging. Proper error handling provides context (which backend failed, why) and graceful fallbacks (show cached data, retry button).

## Quiz

### Question 1: Development Proxy vs Production Reverse Proxy

**Q**: What's the difference between a development proxy (Webpack Dev Server, Vite) and a production reverse proxy (Nginx)? Why can't you use development proxy in production?

**A**:

**Development Proxy**:
- **Runtime**: Runs as part of dev server (Node.js process)
- **Purpose**: Solve CORS during local development
- **Lifetime**: Only active while `npm start` running
- **Configuration**: package.json or setupProxy.js
- **Example**: `fetch('/api/users')` → Dev server proxies to `localhost:5000`

**Production Reverse Proxy**:
- **Runtime**: Separate server (Nginx, Apache, HAProxy)
- **Purpose**: Security, load balancing, caching, SSL termination
- **Lifetime**: Always running (systemd/service)
- **Configuration**: nginx.conf or httpd.conf
- **Example**: `fetch('/api/users')` → Nginx proxies to `backend1.internal:5000`

**Why dev proxy doesn't work in production**:

When you run `npm run build`, React/Vite creates **static files** (HTML, JS, CSS):
```
build/
├── index.html
├── static/
│   ├── js/
│   │   └── main.abc123.js
│   └── css/
│       └── main.def456.css
```

These files are served by Nginx/Apache as-is. There's **no Node.js process** running to handle proxy logic. When browser requests `/api/users`:
- Dev server: Node.js intercepts, proxies to backend ✓
- Nginx (no proxy config): Looks for `build/api/users` file → 404 ✗

**Solution**: Configure Nginx as reverse proxy:
```nginx
location /api/ {
  proxy_pass http://backend:5000/;
}
```

Now Nginx intercepts `/api/*` requests and forwards to backend, similar to dev proxy.

**Why it matters**: Common mistake: Developers test with `npm start` (proxy works), deploy to production (proxy config ignored), API requests return 404. Need explicit reverse proxy configuration in production.

### Question 2: CORS and Proxy

**Q**: Why does a proxy solve CORS errors? What happens behind the scenes?

**A**:

**CORS Problem**:

Browsers enforce **Same-Origin Policy**—JavaScript can only fetch from same origin (protocol + domain + port):
```
Frontend: http://localhost:3000
Backend:  http://localhost:5000

Different ports = different origins!
```

Without CORS headers from backend:
```javascript
// Frontend code
fetch('http://localhost:5000/api/users')

// Browser blocks request BEFORE sending:
// ❌ CORS error: No 'Access-Control-Allow-Origin' header
```

**Why Proxy Solves This**:

Proxy makes browser think request is **same-origin**:

```javascript
// Frontend code
fetch('/api/users')  // Relative URL = same origin

// Browser sees:
// Request: http://localhost:3000/api/users
// Origin: http://localhost:3000
// Same origin! ✓ Request allowed
```

**Behind the Scenes**:
1. Browser sends request to `http://localhost:3000/api/users` (dev server)
2. Dev server's proxy middleware intercepts `/api/*` requests
3. Proxy makes **server-to-server** request to `http://localhost:5000/api/users`
   - Servers aren't subject to CORS!
4. Backend responds to proxy (no CORS headers needed)
5. Proxy forwards response to browser
6. Browser receives response from `http://localhost:3000` (same origin)

**Diagram**:
```
Without Proxy:
Browser → [CORS block] → Backend
(localhost:3000)       (localhost:5000)

With Proxy:
Browser → Dev Server → Backend
(localhost:3000)  ↓   (localhost:5000)
                Proxy
                
All browser requests go to localhost:3000 (same origin)
Proxy handles cross-origin communication server-side
```

**Why it matters**: CORS is a **browser security feature**, not a server limitation. Servers can make cross-origin requests freely. Proxy leverages this by acting as middleman—browser makes same-origin request to proxy, proxy makes cross-origin request to backend.

### Question 3: Nginx Proxy Headers

**Q**: Why are `proxy_set_header` directives important in Nginx? What happens if you omit them?

**A**:

**Problem Without Headers**:

When Nginx proxies request to backend, it **rewrites request headers**:

```nginx
# Minimal proxy config (BAD)
location /api/ {
  proxy_pass http://backend:5000/;
}

# Client request:
# GET /api/users HTTP/1.1
# Host: example.com
# X-Forwarded-For: (not set)
# X-Real-IP: (not set)

# Backend receives:
# GET /users HTTP/1.1
# Host: backend:5000  ← Changed!
# X-Forwarded-For: (empty)
# X-Real-IP: (empty)
```

**Consequences**:
1. **Host header wrong**: Backend receives `Host: backend:5000` instead of `example.com`
   - Virtual hosting breaks (backend serves wrong site)
   - Absolute URL generation wrong (`http://backend:5000/images/logo.png`)

2. **Client IP lost**: Backend sees Nginx's IP, not real client IP
   - Rate limiting broken (all requests from 1 IP)
   - Geolocation wrong
   - Access logs show Nginx IP, not user IP
   - Security logs useless for attack tracking

3. **HTTPS detection lost**: Backend can't tell if original request was HTTPS
   - Redirects break (backend redirects to HTTP instead of HTTPS)
   - Mixed content warnings
   - Cookie `Secure` flag mishandled

**Solution: Proper Headers**:

```nginx
location /api/ {
  proxy_pass http://backend:5000/;
  
  # Original Host header
  proxy_set_header Host $host;
  # Host: example.com ✓
  
  # Client's real IP
  proxy_set_header X-Real-IP $remote_addr;
  # X-Real-IP: 203.0.113.45 ✓
  
  # Chain of proxies (if multiple)
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  # X-Forwarded-For: 203.0.113.45, 198.51.100.10 ✓
  
  # Original protocol (http or https)
  proxy_set_header X-Forwarded-Proto $scheme;
  # X-Forwarded-Proto: https ✓
  
  # Original port
  proxy_set_header X-Forwarded-Port $server_port;
  # X-Forwarded-Port: 443 ✓
}
```

**Backend Usage**:
```javascript
// Express.js
app.set('trust proxy', true);  // Trust X-Forwarded-* headers

app.get('/api/test', (req, res) => {
  console.log('Client IP:', req.ip);  // 203.0.113.45 (real client)
  console.log('Protocol:', req.protocol);  // https (original)
  console.log('Host:', req.hostname);  // example.com (original)
  
  res.json({
    yourIP: req.ip,
    secure: req.secure  // true if X-Forwarded-Proto: https
  });
});
```

**Why it matters**: Without proper headers, backends operate blind—can't rate-limit by IP, log attacks, generate correct URLs, or detect HTTPS. Production apps **must** set these headers or functionality breaks.

## References

- [Nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Create React App Proxying](https://create-react-app.dev/docs/proxying-api-requests-in-development/)
- [Vite Server Proxy](https://vitejs.dev/config/server-options.html#server-proxy)
- [http-proxy-middleware Documentation](https://github.com/chimurai/http-proxy-middleware)
- [Understanding CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Nginx HTTP Proxying Module](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [36] https://www.strongdm.com/blog/difference-between-proxy-and-reverse-proxy