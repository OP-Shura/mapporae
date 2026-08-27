# Mapporae Production Deployment & Security Certification Guide

This document specifies the end-to-end production deployment configuration for **Mapporae** using **Cloudflare Edge Security & SSL Certification** and **Supabase Database & Authentication**.

---

## 1. Cloudflare Edge Security & SSL/TLS Certification

### A. SSL/TLS Encryption Mode
1. In the Cloudflare Dashboard for your domain (e.g. `mapporae.com`), navigate to **SSL/TLS &rarr; Overview**.
2. Select **Full (Strict)** encryption mode.
   - **Full (Strict)** ensures end-to-end encryption with valid CA-signed certificates on the origin server and prevents Man-in-the-Middle (MitM) eavesdropping.
3. Under **SSL/TLS &rarr; Edge Certificates**:
   - Enable **Always Use HTTPS** (automatically redirects HTTP &rarr; HTTPS with HTTP 301).
   - Enable **Automatic HTTPS Rewrites** (prevents mixed-content warnings).
   - Set **Minimum TLS Version** to **TLS 1.3** (or TLS 1.2).
   - Enable **Opportunistic Encryption** and **HTTP/3 (with QUIC)**.

### B. Security & WAF Headers (Configured in `next.config.ts`)
The application automatically emits production-grade HTTP response headers:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS)
- `X-Content-Type-Options: nosniff` (MIME sniffing defense)
- `X-Frame-Options: DENY` (Clickjacking defense)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(self), microphone=(), camera=()`
- `Content-Security-Policy`: Restricts scripts, styles, fonts, images, and WebSocket connections strictly to self, OpenStreetMap, CartoDB, Open-Meteo, and Supabase.

### C. Cloudflare Page & Caching Rules
Set the following Cache Rules in Cloudflare:
| URL Pattern | Cache Level | Edge TTL | Browser TTL |
| :--- | :--- | :--- | :--- |
| `*.mapporae.com/_next/static/*` | Cache Everything | 1 Month | 1 Month |
| `*.mapporae.com/images/*` | Cache Everything | 1 Month | 1 Month |
| `*.mapporae.com/sw.js` | Bypass Cache (or 0s) | 0s | 0s |
| `*.mapporae.com/api/*` | Bypass Cache | 0s | 0s |

---

## 2. Supabase Backend Production Setup

### A. Live Project Credentials
- **Supabase Project Reference**: `mlygjubknrchsnfewdjx`
- **Region**: `ap-south-1` (Mumbai, India — optimal low-latency for Varanasi users)
- **Database Tables & RLS**:
  - `public.profiles` (Row Level Security: Enabled)
  - `public.place_lists` (Row Level Security: Enabled)
  - `public.saved_places` (Row Level Security: Enabled, Foreign Key indexed)
  - `public.place_reviews` (Row Level Security: Enabled, Multi-column indexed)

### B. Production Environment Variables
Set the following environment variables in your deployment hosting platform:

```ini
# Supabase Public Keys
NEXT_PUBLIC_SUPABASE_URL=https://mlygjubknrchsnfewdjx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>

# Gemini AI Key (For Kashi Mitra AI Guide)
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>

# App Environment
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://mapporae.com
```

### C. Supabase Auth Configuration
1. In Supabase Dashboard &rarr; **Authentication &rarr; URL Configuration**:
   - **Site URL**: `https://mapporae.com`
   - **Redirect URLs**:
     - `https://mapporae.com/auth/callback`
     - `https://mapporae.com/saved`
2. Enable **Leaked Password Protection** under **Authentication &rarr; Password Protection** (checks against HaveIBeenPwned API).

---

## 3. Deployment Commands

### Deploy with Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

### Deploy with Cloudflare Pages / Next-on-Pages:
```bash
npm run build
```

---

## 4. Verification & Health Check Checklist

- [x] Rate limiting active (Auth: max 5 / 15m; API: max 60 / 1m).
- [x] Input sanitization & 100KB payload enforcement.
- [x] Supabase Row Level Security on all 4 tables.
- [x] Service Worker caching map tiles and offline shell.
- [x] 60+ Vitest unit tests passing.
- [x] 0 TypeScript compiler errors.
- [x] 0 ESLint warnings.
- [x] Turbopack production bundle compiled.
