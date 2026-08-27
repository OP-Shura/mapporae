# Mapporae — Varanasi City Companion

> **"Your city, made simple."**
> A calm, mobile-first civic and travel companion for Varanasi (Kashi), Uttar Pradesh, India. Discover sacred ghats, ancient temples, authentic street chaat, live weather, air quality signals, emergency services, and cloud-synced itineraries.

---

## Features

- **Interactive Varanasi Map**: Built with Leaflet & OpenStreetMap tiles with custom SVG category pins (ghats, temples, food, emergency, transport).
- **Live Environmental Signals**: Real-time temperature, humidity, wind, sunrise/sunset, and AQI indices (PM2.5) via Open-Meteo with fallback resilience.
- **Civic & Emergency Desk**: 1-tap emergency dialers (`112`, `108`, `1363`, `1090`, River Safety) and categorized directory for hospitals, chemists, police, ATMs, and Sulabh public toilets.
- **Supabase Auth & Cloud Sync**: Passwordless email magic-link authentication with automatic cloud synchronization for saved places and custom lists.
- **Offline / LocalStorage Fallback**: If Supabase credentials are not provided or if the user is offline/anonymous, saved places persist locally with zero errors.
- **Precise Local Data Import**: Signed-in users can import locally stored bookmarks into their cloud account with custom lists created and mapped without data loss.
- **Policy-Compliant Server Geocoding**: Server-side rate-limited Nominatim proxy with 24-hour cache and Varanasi bounding box.
- **Next.js 16 Proxy Architecture**: Modern session management using Next.js 16 `proxy.ts` convention for seamless Supabase token refreshing.

---

## Local Setup & Quickstart

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file by copying `.env.example`:

```bash
cp .env.example .env.local
```

Populate the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Optional: Nominatim Geocoding User-Agent (Must be a monitored contact email/domain)
NOMINATIM_USER_AGENT=Mapporae/1.0 (contact: support@your-domain.example)
```

> **CRITICAL SECURITY NOTE**: Never add the Supabase `service_role` key to `.env.local` or client code. Only the public anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) is permitted.
> If left unset, Mapporae gracefully operates in full offline / `localStorage` mode.

---

## Supabase Dashboard Setup Guide

Follow these step-by-step instructions to link Mapporae with your Supabase cloud project:

### Step 1: Create a Supabase Project
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Choose your preferred region (e.g. `ap-south-1` Mumbai for India / South Asia low latency).

### Step 2: Run Database Migrations
1. In the Supabase Dashboard, open the **SQL Editor** from the left sidebar.
2. Click **New query**.
3. Open `supabase/migrations/001_saved_places.sql` from this repository, paste the entire SQL content, and click **Run**.
4. This will create:
   - `profiles` table with automatic user creation trigger on signup.
   - `place_lists` table with Row Level Security (RLS).
   - `saved_places` table with RLS and composite uniqueness.
   - User-scoped security policies (`auth.uid() = user_id`) and performance lookup indexes.

### Step 3: Configure Auth & Redirect URLs
1. Navigate to **Authentication** &rarr; **URL Configuration** in your Supabase Dashboard.
2. Set the **Site URL**:
   - Local: `http://localhost:3000`
   - Production: `https://your-deployed-domain.com`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - `https://your-deployed-domain.com/auth/callback`
4. Go to **Authentication** &rarr; **Providers** and ensure **Email** (Magic link enabled) is active.

### Step 4: Copy API Credentials
1. Navigate to **Project Settings** &rarr; **API**.
2. Copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the **anon / public** key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## Connection Validation & Storage Modes

Mapporae provides clear, continuous feedback on the Saved Places page:

| Scenario | Displayed Message | Storage Mode |
| :--- | :--- | :--- |
| **Missing Env Variables** | `Offline mode — saved places stay on this device.` | Local Browser Storage |
| **Unreachable / Invalid Keys** | `Cloud sync is unavailable. Your saved places remain safely stored on this device.` | Local Browser Storage (Safe Fallback) |
| **Connected & Signed In** | `Cloud sync active.` | Cloud Database (PostgreSQL) |

---

## Test Support & Verification

A lightweight status inspector is available at the bottom of the **Saved Places** page displaying:
- **Supabase Configured**: `Yes` / `No (Offline Mode)`
- **Auth Session**: `Signed In` / `Anonymous`
- **Storage Mode**: `Cloud (PostgreSQL)` / `Local (Browser)`

### Run Tests, Linting & Production Build:

```bash
# Execute Vitest test suite (17 tests)
npm test

# Verify TypeScript and ESLint standards
npm run lint

# Execute Next.js 16 Turbopack production build
npm run build

# Start local production preview
npm run start
```
