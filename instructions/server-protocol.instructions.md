---
description: Guidance for Protocol - HTTPS, security, and communication rules
name: Protocol - Server
applyTo: |
  **/server/**/*.{js,ts}
  **/*ssl*.{js,ts}
  **/*https*.{js,ts}
---

# Protocol Instructions

## What is Protocol?

Protocols define communication rules between clients and servers. HTTPS (HTTP + TLS) is mandatory for modern web—it encrypts data, enables PWA features (Service Workers), and is required for many browser APIs.

## Key Principles

1. **HTTPS is Mandatory**: Service Workers, Geolocation, Camera access all require HTTPS. HTTP sites show "Not Secure" warning.

2. **TLS Encrypts Everything**: All data encrypted in transit. Man-in-the-middle attacks prevented. Server identity verified via certificate.

3. **Certificate Management**: Use Let's Encrypt for free DV certificates. Auto-renew before 90-day expiration.

## Best Practices

✅ **DO**:
- Use HTTPS everywhere (production AND development)
- Redirect HTTP to HTTPS (301 redirect)
- Use HSTS headers to prevent downgrade attacks
- Set up auto-renewal for certificates
- Use secure cipher suites (TLS 1.2+)

❌ **DON'T**:
- Serve any content over HTTP in production
- Ignore certificate expiration
- Use self-signed certs in production
- Mix HTTP and HTTPS content (mixed content)
- Forget to update certificate on domain changes

## Code Patterns

### HTTPS Redirect (Express)

```javascript
// Force HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### HSTS Header

```javascript
// Strict Transport Security
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  next();
});

// Or with helmet
const helmet = require('helmet');
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
```

### Development HTTPS (mkcert)

```bash
# Install mkcert
brew install mkcert  # macOS
mkcert -install

# Create local certificate
mkcert localhost 127.0.0.1

# Use in Node.js
const https = require('https');
const fs = require('fs');

https.createServer({
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
}, app).listen(3000);
```

### Vite HTTPS Dev Server

```javascript
// vite.config.js
import fs from 'fs';

export default {
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    }
  }
};
```

### Security Headers

```javascript
// Comprehensive security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'");
  
  next();
});
```

## Certificate Types

| Type | Validation | Use Case | Cost |
|------|------------|----------|------|
| DV (Domain) | Domain ownership | Most sites | Free (Let's Encrypt) |
| OV (Organization) | Business verification | E-commerce | $50-200/yr |
| EV (Extended) | Legal entity check | Banks | $200-500/yr |

## Related Terminologies

- **API** (Server) - APIs require HTTPS
- **Authentication** (Server) - Tokens must travel over HTTPS
- **PWA** - Service Workers require HTTPS
- **Proxy** (Server) - SSL termination at proxy

## Quality Gates

- [ ] HTTPS in production
- [ ] HTTP → HTTPS redirect
- [ ] HSTS header set
- [ ] Certificate auto-renewal
- [ ] No mixed content
- [ ] Security headers configured

**Source**: `/docs/server/protocol.md`
