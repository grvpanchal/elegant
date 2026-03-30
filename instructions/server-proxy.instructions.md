---
description: Guidance for Proxy - intermediary servers solving CORS and routing
name: Proxy - Server
applyTo: |
  **/proxy/**/*.{js,ts}
  **/vite.config*.{js,ts}
  **/webpack.config*.{js,ts}
---

# Proxy Instructions

## What is a Proxy?

A proxy acts as intermediary between frontend and backend. Development proxies solve CORS (browser blocks cross-origin requests). Reverse proxies (Nginx) handle production traffic routing, SSL termination, and load balancing.

## Key Principles

1. **CORS Solution**: Browser blocks `localhost:3000` → `localhost:5000`. Proxy makes requests appear same-origin by forwarding `/api/*` to backend.

2. **Development vs Production**: Dev proxy (Vite, Webpack) = local CORS fix. Reverse proxy (Nginx) = production routing, security, caching.

3. **Single Origin Illusion**: Frontend at `:3000/api/users` → Proxy → Backend at `:5000/api/users`. Browser sees same origin.

## Best Practices

✅ **DO**:
- Configure dev proxy for API requests
- Use relative URLs (`/api/users` not `http://localhost:5000/api/users`)
- Set up reverse proxy in production (Nginx, Cloudflare)
- Handle WebSocket proxying for real-time features
- Configure proper timeout for slow endpoints

❌ **DON'T**:
- Hardcode backend URLs in frontend code
- Forget to proxy WebSocket connections
- Use CORS headers in dev when proxy is simpler
- Skip proxy logging in development
- Ignore proxy timeouts for long requests

## Code Patterns

### Vite Dev Proxy

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Optional: rewrite path
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      // WebSocket proxy
      '/ws': {
        target: 'ws://localhost:5000',
        ws: true
      }
    }
  }
};
```

### Create React App Proxy

```json
// package.json (simple)
{
  "proxy": "http://localhost:5000"
}
```

```javascript
// src/setupProxy.js (advanced)
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  }));
};
```

### Webpack Dev Server Proxy

```javascript
// webpack.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
      }
    }
  }
};
```

### Nginx Reverse Proxy (Production)

```nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # Frontend static files
    location / {
        root /var/www/myapp/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket proxy
    location /ws/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Development vs Production

| Aspect | Dev Proxy | Reverse Proxy |
|--------|-----------|---------------|
| Purpose | CORS workaround | Traffic routing |
| Tool | Vite, Webpack | Nginx, Cloudflare |
| SSL | Optional | Required |
| Caching | None | Yes |
| Load Balancing | No | Yes |

## Related Terminologies

- **API** (Server) - Proxied to backend
- **Protocol** (Server) - SSL termination at proxy
- **Authentication** (Server) - Cookies work with same-origin proxy
- **SSR** (Server) - Proxy to SSR server

## Quality Gates

- [ ] Dev proxy configured for API
- [ ] Relative URLs in frontend code
- [ ] WebSocket proxy if needed
- [ ] Production reverse proxy set up
- [ ] SSL termination at proxy
- [ ] Proper headers forwarded

**Source**: `/docs/server/proxy.md`
