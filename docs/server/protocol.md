---
title: Protocol
layout: doc
slug: protocol
---

# Protocol and Security

> - Protocols are the rules clients and servers use to talk—and they decide what your app can even do
> - HTTPS is no longer optional: Service Workers, Geolocation, and Camera APIs refuse to load without it
> - HTTP/2 multiplexing, HTTP/3 over QUIC, and WebSocket upgrades unlock real-time and streaming features that HTTP/1.1 simply cannot deliver

## Glossary

> - **HTTPS**: HTTP wrapped in a TLS-encrypted tunnel. Provides confidentiality (no eavesdropping), integrity (no tampering), and authentication (server proves its identity via a CA-signed certificate). Required by every powerful browser API: Service Workers, Geolocation, Camera, Push.
> - **TLS (Transport Layer Security)**: The cryptographic protocol that powers the "S" in HTTPS. Modern versions are TLS 1.2 and TLS 1.3; TLS 1.0 / 1.1 are deprecated. TLS 1.3 dropped legacy ciphers, made forward secrecy mandatory, and cut handshake round-trips from 2 to 1 (or 0 with session resumption).
> - **HTTP/2 and HTTP/3**: The two modern HTTP transports. HTTP/2 (over TCP+TLS) introduced binary framing, header compression (HPACK), and stream multiplexing on a single connection. HTTP/3 swaps TCP for QUIC over UDP, removing transport-layer head-of-line blocking and supporting connection migration across networks (Wi-Fi to LTE without dropping the session).

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

## Key Insight

Protocols define the rules of conversation between clients and servers, and the single most important shift in the modern web is **HTTP to HTTPS**. This is no longer just a security upgrade — it is a **functional gate**. Service Workers, Geolocation, Camera, Push Notifications, and most powerful browser APIs simply refuse to initialize on `http://`. The browser treats unencrypted origins as untrusted, and it does so deliberately: a Service Worker can intercept every request your page makes, so giving an unauthenticated origin that power would hand attackers a persistent foothold inside the user's browser.

Once you accept HTTPS as the floor, the question becomes **which transport sits on top of TLS**. HTTP/1.1 forces one in-flight request per connection, which is why the era of domain-sharding and CSS sprites was so painful. HTTP/2 fixes that with multiplexed streams over a single connection, header compression, and prioritization — all of which "just work" once your server enables it. HTTP/3 moves the whole stack to QUIC over UDP, eliminating TCP head-of-line blocking and surviving network changes (Wi-Fi to cellular) without dropping the session. None of these upgrades require code changes; they are pure transport wins triggered by server config.

The deeper insight is that **the protocol layer determines what your application can even attempt**. HTTPS unlocks PWA features. HTTP/2 makes asset-heavy SPAs feasible without bundler gymnastics. WebSockets (`wss://`) unlock bidirectional, low-latency channels for chat, presence, and collaborative editing. gRPC over HTTP/2 unlocks streaming RPC between services. Choosing your protocol architecture is choosing the shape of features you can ship.

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

## Common Mistakes

### 1. Serving Production Traffic Over HTTP
**Mistake:** Skipping TLS in production because "it's just a marketing site" — every modern browser API and ranking signal is gated on HTTPS.

```nginx
# BAD: HTTP-only server block, no redirect
server {
    listen 80;
    server_name example.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
# Result:
# - Chrome marks the site "Not Secure" in the address bar
# - Service Worker registration throws SecurityError
# - navigator.geolocation, getUserMedia, Push API all refuse
# - Google penalizes the page in search rankings
# - Any cafe Wi-Fi can MITM and inject ads or malware


# GOOD: HTTP block redirects, HTTPS block serves traffic
server {
    listen 80;
    server_name example.com www.example.com;

    # Allow ACME challenge for Let's Encrypt renewals
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Everything else: 301 to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    root /var/www/html;
    index index.html;
}
```

**Why it matters:** HTTPS is no longer optional — it is the minimum bar for credible production traffic and a hard requirement for Service Workers, Geolocation, Camera, and Push.

### 2. Forgetting (or Misconfiguring) HSTS
**Mistake:** Relying on the 301 redirect alone. The first request still goes over HTTP, which is exactly when SSL-stripping attacks happen.

```nginx
# BAD: No HSTS, every fresh visit starts as plaintext
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    # Missing: Strict-Transport-Security header
}
# A user typing "example.com" in the address bar:
# 1. Browser issues http://example.com (plaintext)
# 2. Attacker on the same Wi-Fi intercepts, never forwards the 301
# 3. Attacker proxies the site over HTTPS to your server but plaintext to the user
# 4. User sees a working site; attacker reads every keystroke


# GOOD: HSTS instructs the browser to use HTTPS for future visits
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Tell the browser: for the next year, never speak HTTP to this host
    add_header Strict-Transport-Security
        "max-age=31536000; includeSubDomains; preload" always;
}
# After the first successful HTTPS visit:
# - Browser refuses to send any HTTP request to example.com or *.example.com
# - The 301 redirect step is skipped client-side, killing SSL-stripping
# - With "preload" submitted to hstspreload.org, even the FIRST visit is protected
```

**Why it matters:** Without HSTS, your TLS only protects users who already typed `https://`. With it, the browser becomes an active participant in keeping the connection encrypted.

### 3. Mixed Content on an HTTPS Page
**Mistake:** Loading scripts, stylesheets, fonts, or images from `http://` URLs on an HTTPS page. Browsers either block the resource (active content) or flag the page as not-fully-secure (passive content).

```html
<!-- BAD: Hard-coded http:// resources poison an HTTPS page -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="http://cdn.example.com/style.css" />
  <script src="http://analytics.example.com/track.js"></script>
</head>
<body>
  <img src="http://images.example.com/hero.jpg" alt="Hero" />
</body>
</html>
<!-- Browser behaviour on https://yoursite.com:
     - style.css and track.js are BLOCKED (active mixed content)
     - hero.jpg loads but the address bar shows a broken padlock
     - Console fills with "Mixed Content" warnings
     - Page looks broken, users lose trust -->


<!-- GOOD: Use protocol-relative or explicit https:// URLs everywhere -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.example.com/style.css" />
  <script src="https://analytics.example.com/track.js"></script>

  <!-- Belt-and-braces: instruct the browser to upgrade any stragglers -->
  <meta http-equiv="Content-Security-Policy"
        content="upgrade-insecure-requests" />
</head>
<body>
  <img src="https://images.example.com/hero.jpg" alt="Hero" />
</body>
</html>
<!-- upgrade-insecure-requests rewrites any leftover http:// to https://
     before the request goes out, catching third-party widgets you don't
     control. -->
```

**Why it matters:** A single mixed-content asset is enough to break the padlock and undermine every other security guarantee on the page.

### 4. Hard-Coding Deprecated TLS Versions and Ciphers
**Mistake:** Copy-pasting an old `nginx.conf` snippet that still enables TLS 1.0 / 1.1 or weak ciphers. Modern auditors (and Qualys SSL Labs) downgrade your grade immediately.

```nginx
# BAD: Allows TLS 1.0/1.1 and weak ciphers
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;          # TLS 1.0 / 1.1 deprecated
    ssl_ciphers   ALL:!aNULL:!eNULL;              # "ALL" includes RC4, 3DES
}
# Consequences:
# - PCI-DSS compliance failure (TLS 1.0 banned since 2018)
# - SSL Labs grade drops to B or C
# - Vulnerable to BEAST, POODLE, Sweet32 attacks
# - Modern browsers will eventually refuse to connect at all


# GOOD: Modern protocols only, curated cipher list, OCSP stapling on
server {
    listen 443 ssl http2;
    listen 443 quic reuseport;                    # HTTP/3 alongside HTTP/2
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5:!3DES:!RC4;
    ssl_prefer_server_ciphers on;

    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    # OCSP stapling: server fetches revocation status, client doesn't have to
    ssl_stapling        on;
    ssl_stapling_verify on;
    resolver            1.1.1.1 8.8.8.8 valid=300s;

    add_header Strict-Transport-Security
        "max-age=31536000; includeSubDomains; preload" always;
    add_header Alt-Svc 'h3=":443"; ma=86400' always;
}
```

**Why it matters:** TLS configuration is the kind of thing you set once and forget — which is exactly why a stale config silently turns into a compliance and security liability years later. Test with `https://www.ssllabs.com/ssltest/` after every change.

## Quick Quiz

{% include quiz.html id="protocol-1"
   question="Why do Service Workers require HTTPS (with localhost as the only exception)?"
   options="A: HTTPS is faster than HTTP, so it makes Service Workers respond more quickly;;B: Service Workers can intercept every network request the page makes, so over HTTP a man-in-the-middle could inject a malicious worker that persists in the cache and silently exfiltrates data on future visits — TLS authentication is what proves the worker came from the real origin;;C: Service Workers are written in TypeScript and TypeScript only compiles over HTTPS;;D: It is a Chrome-only restriction; Firefox and Safari permit Service Workers over plain HTTP"
   correct="B"
   explanation="A Service Worker is a powerful, persistent network proxy living inside the browser. Allowing it on HTTP would let any coffee-shop attacker install one that survives indefinitely. HTTPS proves the worker really came from the origin you trust — and localhost is whitelisted purely for developer ergonomics."
%}

{% include quiz.html id="protocol-2"
   question="What is the main performance benefit of HTTP/2 multiplexing over HTTP/1.1?"
   options="A: HTTP/2 compresses the response body using Brotli, which HTTP/1.1 cannot do;;B: HTTP/2 forces every asset to be inlined into the HTML, eliminating extra requests entirely;;C: HTTP/2 carries many concurrent request/response streams over a single TCP+TLS connection, eliminating HTTP/1.1's one-request-at-a-time head-of-line blocking and making domain sharding, sprite sheets, and aggressive bundling unnecessary;;D: HTTP/2 uses UDP instead of TCP, so it avoids TCP retransmits"
   correct="C"
   explanation="HTTP/1.1 limits you to one in-flight request per connection (browsers compensate by opening 6 connections per origin). HTTP/2 multiplexes many streams on one connection with binary framing and header compression, so 100 small requests cost roughly the same as one. Note: HTTP/3 is the one that switches to UDP — that's a different question."
%}

{% include quiz.html id="protocol-3"
   question="What does mutual TLS (mTLS) add on top of normal HTTPS?"
   options="A: Nothing — mTLS is just a marketing rename of TLS 1.3;;B: It encrypts the URL path (which normal HTTPS leaves in the clear);;C: It replaces TCP with QUIC for lower latency;;D: In addition to the server presenting a certificate, the client also presents a certificate that the server validates, so both sides are cryptographically authenticated. Used heavily for service-to-service traffic, zero-trust networks, and high-security APIs"
   correct="D"
   explanation="Standard HTTPS authenticates the server only; the client is anonymous at the TLS layer (auth happens later via cookies/tokens). mTLS makes authentication symmetric — the client must present a cert the server's CA trusts. It is the backbone of modern zero-trust architectures and service meshes."
%}

{% include quiz.html id="protocol-4"
   question="What problem does OCSP stapling solve?"
   options="A: It lets the server proactively attach a recent, signed proof of certificate validity to the TLS handshake, so the browser does not have to make its own blocking call to the CA's OCSP responder — improving handshake latency and protecting user privacy;;B: It staples multiple certificates into one bundle so the browser only downloads a single file;;C: It is an alternative name for HSTS preload;;D: It compresses the certificate chain to reduce handshake size"
   correct="A"
   explanation="Without stapling, the browser has to call the CA's OCSP responder on every fresh handshake to check whether a certificate has been revoked — slow, and it leaks the user's browsing history to the CA. With stapling, the server fetches that signed status periodically and includes it in the handshake itself."
%}

{% include quiz.html id="protocol-5"
   question="Why does Let's Encrypt issue certificates that expire after only 90 days?"
   options="A: To force website owners to pay for renewals;;B: Because longer validity periods are technically impossible with ECDSA keys;;C: Short lifetimes force automation (you cannot realistically renew 90-day certs by hand), limit the blast radius if a private key is compromised, and reduce reliance on revocation infrastructure (which is slow and unreliable in practice);;D: Browsers refuse to trust certificates valid for more than 90 days"
   correct="C"
   explanation="The 90-day window is a deliberate forcing function. You must automate renewal (certbot, cron, systemd timer), and if a key leaks, the window of abuse is bounded. Industry direction is shorter still — the CA/Browser Forum is moving toward 47-day max-validity by 2029."
%}

## References

- [MDN: Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Let's Encrypt](https://letsencrypt.org/)
- [mkcert](https://github.com/FiloSottile/mkcert)
