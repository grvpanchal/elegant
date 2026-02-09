---
title: Protocol
layout: doc
slug: protocol
---

# Protocol and Security

## Key Insight

Protocols define the rules for communication between clients and servers in web applications. The most critical protocol shift in modern web development is **HTTP to HTTPS**—not just for security, but as a **functional requirement**: Service Workers (enabling PWAs, offline caching, background sync) **only work over HTTPS** because they can intercept network requests. SSL/TLS certificates ensure encrypted communication, verified through domain validation (Let's Encrypt uses ACME protocol with `.well-known/acme-challenge/` directory). In development, self-signed certificates (mkcert) bypass browser security warnings on localhost. Beyond HTTPS, protocols govern data transfer (HTTP/2 multiplexing, HTTP/3 QUIC), real-time communication (WebSocket over TLS), and API design (REST over HTTP, GraphQL over HTTP/HTTPS). The protocol layer determines **what's possible**: HTTPS unlocks PWA features, HTTP/2 enables server push, WebSocket enables bidirectional streaming—choosing the right protocol architecture is choosing your application's capabilities.

## Detailed Description

### 1. HTTPS: The Foundation of Modern Web Security

**Why HTTPS Matters**:

HTTP (Hypertext Transfer Protocol) transmits data in plain text—anyone between client and server can intercept and read requests/responses (man-in-the-middle attacks). HTTPS adds TLS/SSL encryption, ensuring:

1. **Confidentiality**: Data encrypted in transit (passwords, personal info protected)
2. **Integrity**: Data cannot be modified without detection (prevents tampering)
3. **Authentication**: Server proves its identity via SSL certificate (prevents impersonation)

**HTTPS is now mandatory** for:
- Service Workers (PWA requirement)
- Geolocation API (`navigator.geolocation`)
- Camera/microphone access (`getUserMedia`)
- HTTP/2 and HTTP/3 (most browsers require HTTPS)
- Chrome marks HTTP sites as "Not Secure" in address bar
- SEO ranking factor (Google penalizes HTTP-only sites)

**TLS Handshake Process**:
1. Client connects to server (e.g., `https://example.com`)
2. Server sends SSL certificate (contains public key, domain name, issuer CA)
3. Client verifies certificate with Certificate Authority (CA) trust chain
4. Client generates session key, encrypts with server's public key, sends to server
5. Server decrypts session key with private key
6. Both use session key for symmetric encryption (faster than asymmetric)
7. Encrypted communication begins

### 2. SSL/TLS Certificates

**Certificate Types**:

1. **Domain Validated (DV)**: Verifies domain ownership only
   - Example: Let's Encrypt (free, automated)
   - Validation: Responds to HTTP challenge at `.well-known/acme-challenge/`
   - Use case: Most websites, blogs, small businesses

2. **Organization Validated (OV)**: Verifies domain + organization identity
   - Example: DigiCert, GlobalSign
   - Validation: Manual verification of business registration
   - Use case: E-commerce, corporate sites

3. **Extended Validation (EV)**: Strictest validation (green address bar in old browsers)
   - Example: Comodo EV, Sectigo EV
   - Validation: Legal entity verification, physical address confirmation
   - Use case: Banks, financial institutions (though less relevant now—browsers removed green bar)

**Certificate Structure**:
```
Certificate:
  Version: 3
  Serial Number: 04:a4:f9:...
  Signature Algorithm: sha256WithRSAEncryption
  Issuer: Let's Encrypt Authority X3
  Validity:
    Not Before: Jan 1 00:00:00 2024 GMT
    Not After: Apr 1 23:59:59 2024 GMT  (90 days)
  Subject: CN=example.com
  Subject Public Key Info:
    Public Key Algorithm: rsaEncryption
    RSA Public Key: (2048 bit)
  X509v3 Extensions:
    X509v3 Subject Alternative Name:
      DNS:example.com, DNS:www.example.com
```

**Certificate Chain**:
- **Root CA** (trusted by browsers): Let's Encrypt Root CA
- **Intermediate CA**: Let's Encrypt Authority X3
- **End-entity Certificate**: example.com

Browsers verify chain: example.com cert signed by Intermediate CA → Intermediate CA cert signed by Root CA → Root CA in browser's trust store.

### 3. Let's Encrypt and ACME Protocol

**ACME (Automatic Certificate Management Environment)** automates certificate issuance/renewal. Let's Encrypt uses ACME to provide free SSL certificates.

**Domain Validation Methods**:

1. **HTTP-01 Challenge**:
   - CA requests file at `http://example.com/.well-known/acme-challenge/<token>`
   - Server must respond with specific content to prove domain ownership
   - Limitation: Requires port 80 open, doesn't work for wildcard certs

2. **DNS-01 Challenge**:
   - CA requests DNS TXT record at `_acme-challenge.example.com`
   - Server creates TXT record with challenge value
   - Benefit: Works for wildcard certificates (`*.example.com`)

3. **TLS-ALPN-01 Challenge**:
   - Uses TLS handshake on port 443
   - Less common, useful when port 80 blocked

**Certbot Workflow**:
```bash
# 1. Request certificate
sudo certbot certonly --webroot -w /var/www/html -d example.com

# Certbot writes challenge file to /var/www/html/.well-known/acme-challenge/
# Let's Encrypt verifies http://example.com/.well-known/acme-challenge/<token>
# Certificate issued, saved to /etc/letsencrypt/live/example.com/

# 2. Configure web server
# Nginx: ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem
# Nginx: ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem

# 3. Auto-renewal (certificates valid 90 days)
sudo certbot renew --dry-run  # Test renewal
# Add to cron: 0 0 * * * certbot renew --quiet
```

### 4. Self-Signed Certificates for Development

**Problem**: Localhost development needs HTTPS for Service Workers, but browsers don't trust self-signed certificates (show security warning).

**Solution: mkcert**:

mkcert creates locally-trusted certificates by installing a local Certificate Authority in your system's trust store.

**Installation**:
```bash
# macOS
brew install mkcert
brew install nss  # For Firefox support

# Windows
choco install mkcert

# Linux
sudo apt install libnss3-tools
wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert-v1.4.4-linux-amd64
sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
```

**Usage**:
```bash
# 1. Install local CA
mkcert -install
# Creates rootCA.pem in system trust store
# Chrome/Edge/Safari now trust certificates signed by this CA

# 2. Generate certificate
mkcert localhost 127.0.0.1 ::1
# Creates: localhost+2.pem (certificate)
#          localhost+2-key.pem (private key)

# 3. Use with Node.js
# See Code Example 1 below

# 4. Wildcard certificates
mkcert "*.myapp.local" myapp.local

# 5. Uninstall CA (when done)
mkcert -uninstall
```

**Why Not Use in Production**:
- Root CA only trusted on your machine
- Other users see security warnings
- No certificate revocation mechanism
- Let's Encrypt is free and automated—no reason not to use real certs in production

### 5. Service Workers and HTTPS Requirement

**Service Worker Capabilities**:
1. **Offline Caching**: Cache assets for offline access
2. **Background Sync**: Defer actions until connectivity restored
3. **Push Notifications**: Receive notifications when app closed
4. **Request Interception**: Modify/mock network requests

**Why HTTPS Required**:

Service Workers can intercept **all network requests** from your application. Over HTTP, a man-in-the-middle attacker could:
1. Inject malicious Service Worker
2. Intercept all user data (passwords, credit cards)
3. Persist indefinitely (Service Worker caches itself)

HTTPS prevents this attack vector—only legitimate servers can register Service Workers.

**Exception**: `localhost` allowed over HTTP for development convenience.

**Registration Check**:
```javascript
if ('serviceWorker' in navigator) {
  if (location.protocol === 'https:' || location.hostname === 'localhost') {
    navigator.serviceWorker.register('/sw.js');
  } else {
    console.warn('Service Workers require HTTPS');
  }
}
```

### 6. HTTP/2 and HTTP/3 Protocols

**HTTP/1.1 Limitations**:
- **Head-of-line blocking**: One request at a time per TCP connection
- **No prioritization**: Can't prioritize critical resources
- **Verbose headers**: Same headers repeated in every request
- **Workarounds**: Domain sharding, concatenating files, image sprites (all anti-patterns now)

**HTTP/2 Improvements** (2015):
1. **Multiplexing**: Multiple requests over single TCP connection
2. **Header Compression**: HPACK algorithm reduces header overhead
3. **Server Push**: Server sends resources before client requests (e.g., push CSS when HTML requested)
4. **Stream Prioritization**: Critical resources loaded first
5. **Binary Protocol**: More efficient parsing than text-based HTTP/1.1

**HTTP/2 Adoption**:
- Requires HTTPS (most browsers)
- Nginx: `listen 443 ssl http2;`
- Node.js: `http2.createSecureServer()`
- No code changes needed—transport layer upgrade

**HTTP/3 (QUIC)** (2022):
- Uses UDP instead of TCP (no head-of-line blocking at transport layer)
- Faster connection establishment (0-RTT handshake)
- Better mobile performance (connection migration when switching networks)
- Built-in encryption (TLS 1.3 integrated)

**Enabling HTTP/3** (Nginx 1.25+):
```nginx
server {
  listen 443 ssl http2;
  listen 443 quic reuseport;  # HTTP/3
  
  ssl_protocols TLSv1.3;
  
  add_header Alt-Svc 'h3=":443"; ma=86400';  # Advertise HTTP/3
}
```

### 7. WebSocket Protocol

**HTTP Limitations for Real-Time Apps**:
- HTTP is request-response (client initiates)
- Polling inefficient (constant requests checking for updates)
- Long-polling keeps connection open but still client-initiated

**WebSocket Protocol**:
- Full-duplex bidirectional communication
- Single TCP connection, persistent
- Low latency (no HTTP overhead after handshake)
- Server can push messages to client

**WebSocket Handshake** (over HTTP):
```
Client Request:
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

Server Response:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

After handshake, connection switches from HTTP to WebSocket protocol (`ws://` or `wss://` for secure).

**Security**: Always use `wss://` (WebSocket Secure over TLS). Unencrypted `ws://` vulnerable to interception like HTTP.

### 8. API Protocol Choices: REST, GraphQL, gRPC

**REST over HTTP/HTTPS**:
- Standard HTTP verbs (GET, POST, PUT, DELETE)
- Stateless, cacheable
- Resource-based URLs (`/api/users/123`)
- JSON/XML response format
- Use case: Public APIs, CRUD operations

**GraphQL over HTTP/HTTPS**:
- Single endpoint (`/graphql`)
- Client specifies exact data needed (no over-fetching)
- Strongly typed schema
- Subscriptions over WebSocket for real-time
- Use case: Complex data requirements, mobile apps (bandwidth savings)

**gRPC over HTTP/2**:
- Binary protocol (Protocol Buffers)
- Bidirectional streaming
- Code generation from `.proto` files
- High performance, low latency
- Use case: Microservices communication, backend-to-backend

**Protocol Comparison**:
| Feature | REST | GraphQL | gRPC |
|---------|------|---------|------|
| Transport | HTTP/1.1+ | HTTP/1.1+ | HTTP/2 |
| Format | JSON | JSON | Protobuf (binary) |
| Performance | Moderate | Moderate | High |
| Browser Support | ✓ | ✓ | Limited (requires grpc-web) |
| Caching | Built-in (HTTP) | Complex | Custom |
| Learning Curve | Low | Medium | High |

### 9. Security Headers and Protocol Configuration

**Critical Security Headers**:

```nginx
# Force HTTPS (HTTP Strict Transport Security)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Prevent MIME sniffing
add_header X-Content-Type-Options "nosniff" always;

# XSS protection (legacy, use CSP instead)
add_header X-XSS-Protection "1; mode=block" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.example.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;

# Referrer policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions policy (formerly Feature Policy)
add_header Permissions-Policy "geolocation=(self), microphone=(), camera=()" always;
```

**TLS Configuration Best Practices**:
```nginx
ssl_protocols TLSv1.2 TLSv1.3;  # Disable TLS 1.0, 1.1 (deprecated)
ssl_ciphers HIGH:!aNULL:!MD5;   # Strong ciphers only
ssl_prefer_server_ciphers on;   # Server chooses cipher
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;                # OCSP stapling (faster cert validation)
ssl_stapling_verify on;
```

## Code Examples

### Example 1: HTTPS Development Server with mkcert and Express

```javascript
// server.js - Local HTTPS development server with mkcert certificates
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API routes
app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'Secure API response',
    protocol: req.protocol,
    secure: req.secure 
  });
});

// Service Worker route (must be HTTPS)
app.get('/sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});

// Check if mkcert certificates exist
const certPath = path.join(__dirname, 'localhost+2.pem');
const keyPath = path.join(__dirname, 'localhost+2-key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  // HTTPS server with mkcert certificates
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  
  const httpsServer = https.createServer(httpsOptions, app);
  
  httpsServer.listen(3000, () => {
    console.log('✓ HTTPS Server running on https://localhost:3000');
    console.log('✓ Service Workers enabled');
    console.log('✓ Geolocation API available');
  });
  
  // Redirect HTTP to HTTPS
  const httpApp = express();
  httpApp.use((req, res) => {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
  http.createServer(httpApp).listen(8080, () => {
    console.log('→ HTTP redirect server on http://localhost:8080 → https://localhost:3000');
  });
  
} else {
  // Fallback to HTTP (warn about limitations)
  console.warn('⚠ mkcert certificates not found!');
  console.warn('⚠ Running HTTP server (Service Workers disabled)');
  console.warn('');
  console.warn('To enable HTTPS:');
  console.warn('1. Install mkcert: brew install mkcert');
  console.warn('2. Run: mkcert -install');
  console.warn('3. Generate certs: mkcert localhost 127.0.0.1 ::1');
  console.warn('4. Move localhost+2.pem and localhost+2-key.pem to project root');
  console.warn('');
  
  app.listen(3000, () => {
    console.log('HTTP Server running on http://localhost:3000');
  });
}

// public/index.html
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HTTPS Development</title>
</head>
<body>
  <h1>HTTPS Development Server</h1>
  <p id="status">Checking protocol...</p>
  <button id="registerSW">Register Service Worker</button>
  <button id="getLocation">Get Location</button>
  
  <script>
    // Check protocol
    const status = document.getElementById('status');
    if (location.protocol === 'https:') {
      status.textContent = '✓ Running over HTTPS - All features enabled';
      status.style.color = 'green';
    } else {
      status.textContent = '✗ Running over HTTP - Service Workers disabled';
      status.style.color = 'red';
    }
    
    // Service Worker registration
    document.getElementById('registerSW').addEventListener('click', async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration.scope);
          alert('Service Worker registered successfully!');
        } catch (error) {
          console.error('Service Worker registration failed:', error);
          alert('Service Worker registration failed: ' + error.message);
        }
      } else {
        alert('Service Workers not supported (HTTPS required)');
      }
    });
    
    // Geolocation (requires HTTPS)
    document.getElementById('getLocation').addEventListener('click', () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Location:', position.coords);
            alert(`Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`);
          },
          (error) => {
            alert('Geolocation error: ' + error.message);
          }
        );
      } else {
        alert('Geolocation not supported (HTTPS required)');
      }
    });
  </script>
</body>
</html>
*/

// public/sw.js - Basic Service Worker
/*
const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request);
      })
  );
});
*/
```

### Example 2: Let's Encrypt with Certbot and Nginx Auto-Renewal

```bash
#!/bin/bash
# setup-ssl.sh - Complete Let's Encrypt setup script for Ubuntu + Nginx

set -e  # Exit on error

DOMAIN="example.com"
WEBROOT="/var/www/html"
EMAIL="admin@example.com"

echo "=== Let's Encrypt SSL Setup for $DOMAIN ==="

# 1. Install Certbot
echo "→ Installing Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. Configure Nginx for HTTP (ACME challenge requires port 80)
echo "→ Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root $WEBROOT;
    index index.html;
    
    # ACME challenge location
    location /.well-known/acme-challenge/ {
        root $WEBROOT;
    }
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx

# 3. Obtain SSL certificate
echo "→ Requesting SSL certificate from Let's Encrypt..."
sudo certbot certonly \
  --webroot \
  -w $WEBROOT \
  -d $DOMAIN \
  -d www.$DOMAIN \
  --email $EMAIL \
  --agree-tos \
  --non-interactive

# Certificates saved to:
# /etc/letsencrypt/live/$DOMAIN/fullchain.pem
# /etc/letsencrypt/live/$DOMAIN/privkey.pem

# 4. Configure Nginx with HTTPS
echo "→ Configuring Nginx with SSL..."
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
# HTTP redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root $WEBROOT;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    root $WEBROOT;
    index index.html;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/$DOMAIN/chain.pem;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Application
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx

# 5. Set up auto-renewal
echo "→ Configuring auto-renewal..."

# Test renewal
sudo certbot renew --dry-run

# Create renewal script
cat > /etc/cron.daily/certbot-renewal <<'EOF'
#!/bin/bash
# Daily certificate renewal check

certbot renew --quiet --deploy-hook "systemctl reload nginx"

# Log renewal attempts
echo "[$(date)] Certificate renewal check completed" >> /var/log/certbot-renewal.log
EOF

chmod +x /etc/cron.daily/certbot-renewal

# Alternative: systemd timer (more modern)
cat > /etc/systemd/system/certbot-renewal.service <<EOF
[Unit]
Description=Certbot Renewal

[Service]
Type=oneshot
ExecStart=/usr/bin/certbot renew --quiet --deploy-hook "systemctl reload nginx"
EOF

cat > /etc/systemd/system/certbot-renewal.timer <<EOF
[Unit]
Description=Certbot Renewal Timer

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl enable certbot-renewal.timer
sudo systemctl start certbot-renewal.timer

echo ""
echo "=== SSL Setup Complete ==="
echo "Certificate: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "Private Key: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
echo "Valid Until: $(sudo certbot certificates | grep 'Expiry Date')"
echo ""
echo "Auto-renewal configured:"
echo "  - Cron: /etc/cron.daily/certbot-renewal"
echo "  - Systemd Timer: certbot-renewal.timer"
echo ""
echo "Test your SSL: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
```

### Example 3: Complete Protocol Implementation

```javascript
// Complete implementation coming soon
```

## Common Mistakes

### 1. Using HTTP in Production

❌ **Wrong**: Service Workers fail silently over HTTP

✅ **Correct**: Use HTTPS (Let's Encrypt is free)

### 2. Missing HSTS Header

❌ **Wrong**: Vulnerable to SSL stripping attacks

✅ **Correct**: Add `Strict-Transport-Security` header

### 3. Mixed Content

❌ **Wrong**: HTTPS page loading HTTP resources

✅ **Correct**: Use HTTPS for all resources

## Quiz

### Question 1: Why HTTPS for Service Workers?

**A**: Service Workers can intercept all network requests. Over HTTP, attackers could inject malicious Service Workers that persist indefinitely and steal data.

### Question 2: Let's Encrypt 90-Day Expiration

**A**: Forces automation, limits damage from compromised keys, simplifies revocation.

### Question 3: Mixed Content

**A**: HTTPS page loading HTTP resources defeats HTTPS purpose. Browsers block it to prevent attackers from injecting malicious content.

## References

- [MDN: Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Let's Encrypt](https://letsencrypt.org/)
- [mkcert](https://github.com/FiloSottile/mkcert)
