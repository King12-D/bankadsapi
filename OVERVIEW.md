# Bank Ads Engine — Project Overview

> **Product**: Customer-Aware Advertising Platform (Bank Ads Engine)
> **Company**: Konined (KO9D) & WID Ltd
> **Owner**: King David Uchenna & Ike Wisdom
> **Version**: 2.0.0 | **API Spec**: OAS 3.0

---

## Table of Contents

1. [Core Objectives](#1-core-objectives)
2. [Business Model](#2-business-model)
3. [System Architecture](#3-system-architecture)
4. [Technical Stack](#4-technical-stack)
5. [Module Breakdown](#5-module-breakdown)
6. [The Targeting Algorithm](#6-the-targeting-algorithm)
7. [API Reference](#7-api-reference)
8. [Security Model](#8-security-model)
9. [Caching Strategy](#9-caching-strategy)
10. [Deployment & Infrastructure](#10-deployment--infrastructure)
11. [Data Models](#11-data-models)
12. [Future Roadmap](#12-future-roadmap)

---

## 1. Core Objectives

The Bank Ads Engine is an intelligent ad delivery platform designed for the Nigerian banking sector. It enables banks to display personalized, contextually relevant advertisements across multiple customer touchpoints — ATM screens, mobile banking apps, web portals, and USSD sessions — using a proprietary real-time targeting engine.

### Primary Goals

| # | Goal | Description |
|---|------|-------------|
| 1 | **Real-Time Personalization** | Serve the single most relevant ad to each customer at the moment they interact with a banking channel. |
| 2 | **Engagement & Conversion** | Improve ad engagement rates through intelligent segment-based matching and frequency management. |
| 3 | **Analytics & Insights** | Provide bank administrators with impression, click, and CTR analytics per campaign. |
| 4 | **Campaign Management** | Enable advertisers and bank admins to create, schedule, and manage ad campaigns with granular targeting controls. |
| 5 | **API-First Distribution** | Expose all functionality via a versioned REST API, allowing banks to integrate ad delivery natively into their existing platforms. |

### Target Users

- **Bank Admins** — create campaigns, manage subscriptions, view analytics dashboards.
- **End Users (ATM/Mobile Customers)** — passively receive targeted ads during their banking sessions.
- **Advertisers (Future)** — a planned self-serve tier for third-party advertisers to run campaigns within the bank's ecosystem.

---

## 2. Business Model

The platform operates on a **Subscription-Based API Access** model, monetized through **Interswitch Payment APIs**. Banks pay for API access based on their feature tier and request volume.

### Subscription Tiers

| Plan | Monthly (NGN) | Annual (NGN) | Active Campaigns | Channels | Rate Limit Tier |
|------|---------------|--------------|-----------------|----------|-----------------|
| **Basic** | 2,500 | 25,000 | 1 at a time | ATM, Web | Standard |
| **Pro** | 7,500 | 75,000 | Unlimited | ATM, Mobile, Web, USSD | Premium |
| **Enterprise** | 15,000 | 150,000 | Unlimited | All channels | Enterprise |

> All amounts are in lowest denomination (kobo). `250000` = NGN 2,500.

### Checkout & Payment Flow

1. **Initiation**: Bank admin selects a plan and billing cycle → `POST /api/v1/billing/checkout/initiate` → Platform calls Interswitch to create a payment request and returns a redirect URL.
2. **Payment**: The user completes payment on the Interswitch-hosted checkout page.
3. **Verification**: The platform re-queries Interswitch with the `txn_ref` → `GET /api/v1/billing/checkout/verify` → On success, a subscription and API key are activated for the bank.
4. **Renewal**: Automated subscription renewal is managed by the billing controller, with subscription `endDate` tracking in the database.

### Supplementary Monetization (Roadmap)
- **Pay-Per-Impression** model for high-volume clients — billed based on metered API usage.

---

## 3. System Architecture

The platform follows a **monorepo architecture** with clear separation between the frontend dashboard and the backend API.

```
bankadsapi/
│
├── backend/                     # Core API server (TypeScript / Hono)
│   └── src/
│       ├── modules/
│       │   ├── ads/             # Ad serving, creation, impression & click tracking
│       │   │   ├── ads-controllers.ts
│       │   │   ├── ads-models.ts
│       │   │   ├── ads-routes.ts
│       │   │   └── targeting-engine.ts   ← Core intelligence
│       │   ├── billing/         # Subscription plans, Interswitch integration
│       │   │   ├── billing-controllers.ts
│       │   │   ├── billing-routes.ts
│       │   │   ├── interswitch.ts
│       │   │   └── subscription-plans.ts
│       │   ├── auth/            # Registration, login, JWT
│       │   │   ├── auth-controllers.ts
│       │   │   └── auth-routes.ts
│       │   ├── apikeys/         # API key management
│       │   │   ├── apikey-controllers.ts
│       │   │   └── apikey-routes.ts
│       │   └── models/          # MongoDB/Mongoose schemas
│       │       ├── user-model.ts
│       │       ├── apikey-model.ts
│       │       └── campaign-model.ts
│       ├── config/
│       │   ├── targeting-config.ts      ← All algorithm parameters
│       │   ├── redis.ts
│       │   └── config.ts
│       ├── utils/
│       │   └── db.ts            # MongoDB connection & migration
│       ├── docs/
│       │   └── swagger-routes.ts
│       ├── index.ts             # Entry point (Bun/Node)
│       └── app-setup.ts         # App builder, CORS, route wiring
│
├── frontend/                    # Static dashboard UI
│   ├── index.html               # Landing / home page
│   ├── login.html               # Authentication page
│   ├── register.html            # Registration page
│   ├── dashboard.html           # Admin analytics dashboard
│   ├── pricing.html             # Subscription pricing page
│   └── style.css                # Glassmorphism theme (black & gold)
│
├── start.js                     # Monorepo orchestrator
├── docker-compose.yml           # Container orchestration
├── Dockerfile                   # Backend image definition
└── package.json                 # Root scripts (dev, install:all, etc.)
```

### High-Level Data Flow

```
Bank Platform (ATM/Mobile/Web)
        │
        │  POST /api/v1/ads/serve
        │  { customerId, balance, channel }
        ▼
┌─────────────────────────────────────────────────────┐
│                  Backend API (Hono)                  │
│                                                     │
│  1. Validate API Key (middleware)                   │
│  2. Derive Customer Segment from balance            │
│  3. Check Redis cache for pre-scored ad list        │
│  4. If cache miss → Query MongoDB for active ads    │
│  5. Run Targeting Engine Pipeline:                  │
│     a. Filter by Segment & Channel                  │
│     b. Filter by Time Slot                          │
│     c. Filter by Frequency Cap (Redis profile)      │
│     d. Score remaining ads (composite algorithm)    │
│     e. Sort descending, select top ad               │
│  6. Cache result in Redis with smart TTL            │
│  7. Return ad payload                               │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────┐    ┌────────────────────────┐
│    MongoDB Atlas      │    │    Redis (Upstash)      │
│  - Ad campaigns       │    │  - Ad list cache        │
│  - Users              │    │  - User profiles        │
│  - API Keys           │    │  - Frequency cap data   │
│  - Campaigns          │    │  - Rate limiting        │
└──────────────────────┘    └────────────────────────┘
```

---

## 4. Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend Runtime** | Bun / Node.js | JavaScript runtime for the server |
| **API Framework** | Hono | Ultra-fast, lightweight TypeScript web framework |
| **Language** | TypeScript | Type-safe backend development |
| **Database** | MongoDB (via Mongoose) | Primary persistence for ads, users, keys |
| **Caching / State** | Redis (Upstash/IORedis) | Ad list caching, user profiles, rate limiting |
| **Payment Gateway** | Interswitch | Nigerian payment processor for subscriptions |
| **Frontend Serving** | `serve` (npm) | Static file server for the dashboard |
| **Frontend Styling** | Tailwind CSS + Custom CSS | Glassmorphism aesthetic, black & gold theme |
| **API Documentation** | Swagger / OpenAPI 3.0 | Self-hosted interactive API reference at `/api/v1/docs` |
| **Containerization** | Docker + Docker Compose | Multi-service container deployment |

### Ports
- **Backend API**: `http://localhost:3030`
- **Frontend Dashboard**: `http://localhost:3000`
- **API Docs**: `http://localhost:3030/api/v1/docs`

---

## 5. Module Breakdown

### `ads` — Core Ad Intelligence

The most critical module. Handles:
- **Ad Serving** (`POST /api/v1/ads/serve`): Full targeting pipeline from segment derivation to final ad selection.
- **Ad Creation** (`POST /api/v1/ads/create`): Validates and persists new ad campaigns; invalidates Redis cache.
- **Impression Tracking** (`POST /api/v1/ads/impression`): Increments impression counter on ad document; updates customer's Redis frequency profile.
- **Click Tracking** (`POST /api/v1/ads/click`): Increments click counter, used to recalculate CTR for scoring.
- **Targeting Engine** (`targeting-engine.ts`): The brain of the system. Contains user profile management, CTR calculation, frequency cap filtering, time-slot filtering, and composite ad scoring.

### `billing` — Subscription & Payments

- **`subscription-plans.ts`**: Single source of truth for all plan definitions (features, pricing, rate-limit tier).
- **`interswitch.ts`**: Encapsulates communication with the Interswitch API (payment initiation and re-query for verification).
- **`billing-controllers.ts`**: Orchestrates the checkout flow — initiate, store pending payment, verify, activate subscription, and generate API key.

### `auth` — Authentication

- JWT-based authentication.
- Handles user registration and login.
- Passwords are hashed before storage (industry standard).

### `apikeys` — API Key Management

- Generates secure, unique API keys upon subscription activation.
- API keys are the primary auth mechanism for bank integrations calling the `/ads/serve` endpoint.

### `models` — Data Schemas

Three core Mongoose schemas:
- **User**: Base entity for bank admins.
- **API Key**: Links a key to a user, plan, and expiry.
- **Campaign**: The ad unit — targeting metadata, creative URLs, budget, and analytics counters.

---

## 6. The Targeting Algorithm

This is the intellectual core of the platform. When a request arrives at `/api/v1/ads/serve`, the targeting engine executes a multi-stage pipeline.

### Stage 0: Segment Derivation

Before the engine runs, the customer's **financial segment** is derived directly from their account balance:

```
Balance < 50,000 NGN      →  "low"
50,000 ≤ Balance < 200,000 →  "mass"
200,000 ≤ Balance < 1,000,000 → "affluent"
Balance ≥ 1,000,000 NGN   →  "hnw" (High Net Worth)
```

This segment label is then matched against the `segments[]` array on each ad document.

### Stage 1: Hard Filters

Active ads are first filtered through **hard exclusion rules** — an ad that fails any filter is completely excluded regardless of its score.

#### 1a. Segment & Channel Filter
- Ad's `segments` array must include the derived customer segment.
- Ad's `channels` array must include the request's `channel` (e.g., `"ATM"`, `"mobile"`).
- Filters are applied in a single MongoDB query for efficiency.

#### 1b. Time-Slot Filter

Running ads are matched against the current server time. Four named slots exist:

| Slot | Hours (24h) |
|------|------------|
| `morning` | 06:00 – 11:59 |
| `afternoon` | 12:00 – 16:59 |
| `evening` | 17:00 – 20:59 |
| `night` | 21:00 – 05:59 (wraps midnight) |

An ad without `timeSlots` defined is treated as **all-day eligible**.

#### 1c. Frequency Cap Filter

Each customer has a **User Profile** stored in Redis keyed as `userprofile:{customerId}`. The profile stores a rolling list of up to 500 impressions from the last 24 hours.

The frequency cap enforces two rules:
1. **Daily Cap**: An ad shown ≥ **3 times** in the last 24 hours is excluded.
2. **Cooldown**: An ad shown within the last **2 hours** is excluded, even if the daily cap hasn't been reached.

The implementation uses an `O(n)` pre-build impression map to evaluate all ads in a single pass, avoiding per-ad lookups.

### Stage 2: Composite Scoring

After filtering, remaining eligible ads are scored on a **0.0–1.0 scale** using four normalized components. All scores are weighted and summed into a final composite score:

```
Score = (Priority × 0.35) + (CTR × 0.25) + (Recency × 0.20) + (Freshness × 0.20)
```

> **Note**: Weights are validated at startup to ensure they sum to exactly `1.0`. An invalid config will crash the application on boot with an explicit error message.

| Component | Weight | Description | Formula |
|-----------|--------|-------------|---------|
| **Priority** | 35% | Explicitly set priority on the ad by the admin. Higher = more likely to serve. | `ad.priority / maxPriority` |
| **CTR (Click-Through Rate)** | 25% | Historical engagement rate. Ads with minimum 10 impressions use real CTR; below that, a default 2% CTR is used to avoid cold-start bias. | `min(clicks/impressions / 0.1, 1)` |
| **Recency** | 20% | Newer campaigns are favored over stale ones. Score decays linearly to 0 over 30 days from the campaign start date. | `max(0, 1 - ageMs / 30days)` |
| **Freshness** | 20% | Ads with fewer total impressions are boosted, ensuring new ads get visibility even with low historical data. | `1 - impressions / maxImpressions` |

### Stage 3: Selection & Caching

1. Scored ads are sorted **descending** by composite score.
2. The top-ranked ad is selected and returned.
3. The **ad list result** (filtered, pre-sorted) is stored in Redis with a **smart TTL**:
   - If ≤ 3 active ads exist → **120s TTL** (low availability, cautious caching).
   - Otherwise → **60s TTL** (standard).
4. **User profile** TTL in Redis is **24 hours** (86400 seconds), refreshed on every impression.

### Fallback Logic

If no ad matches all hard filters, the engine returns a `fallback: true` response — allowing the calling bank platform to display a generic or default ad rather than returning an error.

---

## 7. API Reference

**Base URL**: `/api/v1`
**Authentication**: `x-api-key` header (for protected routes)
**Rate Limiting**: 100 requests/minute per IP on `/ads/serve`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/health` | No | Service health check (DB status + timestamp) |
| `POST` | `/auth/register` | No | Register a new bank admin account |
| `POST` | `/auth/login` | No | Log in and receive a JWT |
| `GET` | `/apikeys` | JWT | List API keys for authenticated user |
| `POST` | `/ads/serve` | API Key | Serve a targeted ad for a customer |
| `POST` | `/ads/create` | API Key | Create a new ad campaign |
| `POST` | `/ads/impression` | No | Track an ad impression event |
| `POST` | `/ads/click` | No | Track an ad click event |
| `GET` | `/billing/plans` | No | Retrieve all subscription plan details |
| `POST` | `/billing/checkout/initiate` | JWT | Start Interswitch checkout for a plan |
| `GET` | `/billing/checkout/verify` | No | Verify Interswitch payment & activate subscription |
| `GET` | `/docs` | No | Interactive Swagger UI documentation |
| `GET` | `/openapi.json` | No | Raw OpenAPI 3.0 specification |

### Key Request/Response Examples

#### Serving an Ad
```json
// POST /api/v1/ads/serve
// Request:
{ "customerId": "CUST-98765", "balance": 120000, "channel": "ATM" }

// Response (200 OK):
{
  "adId": "67c0f4d8e3db53a6d8e8b9f1",
  "title": "Premium Loan Offer",
  "imageUrl": "https://cdn.site/ad.jpg",
  "videoUrl": "https://cdn.site/ad.mp4",
  "cta": "Apply Now",
  "segment": "mass",
  "channel": "ATM",
  "fallback": false
}
```

#### Creating an Ad
```json
// POST /api/v1/ads/create (x-api-key: <key>)
{
  "title": "Premium Loan Offer",
  "imageUrl": "https://cdn.site/ad.jpg",
  "segments": ["mass", "affluent"],
  "channels": ["ATM", "mobile"],
  "timeSlots": ["morning", "afternoon"],
  "startDate": "2026-04-01T00:00:00.000Z",
  "endDate": "2026-05-01T00:00:00.000Z",
  "priority": 10,
  "locations": ["Lagos", "Port Harcourt"]
}
```

---

## 8. Security Model

| Control | Implementation |
|---------|---------------|
| **API Key Auth** | All campaign management and ad-serving endpoints require a valid `x-api-key` header. Keys are tied to subscriptions and expire at plan end date. |
| **JWT Auth** | Admin dashboard and billing initiation require a valid JWT obtained via `/auth/login`. |
| **CORS** | Wildcard CORS is enabled on the backend to allow cross-origin requests from the frontend and bank integrations. |
| **Rate Limiting** | `/api/v1/ads/serve` is rate-limited to **100 requests/minute per IP** via Redis counters. Exceeding this returns `HTTP 429` with a `Retry-After` header. |
| **HTTPS** | All production traffic is served over HTTPS (enforced at the infrastructure/CDN layer, e.g., Render). |
| **Data Privacy** | No sensitive banking data (account numbers, PINs, transaction history) is stored. Only `customerId` (a bank-issued reference) and `balance` (used transiently for segment derivation) are consumed. |

---

## 9. Caching Strategy

Redis is used as a two-tier cache to minimize MongoDB load and ensure low-latency ad serving.

### Tier 1 — Ad List Cache

After fetching and filtering ads from MongoDB, the resulting list is serialized and cached in Redis.

| Scenario | TTL | Key Pattern |
|----------|-----|-------------|
| ≤ 3 active ads (low supply) | 120s | `ads:{segment}:{channel}` |
| > 3 active ads (normal) | 60s | `ads:{segment}:{channel}` |
| Campaign created/updated | Immediate invalidation | Cache keys are deleted on write |

### Tier 2 — User Profile Cache

Each customer's impression history is stored in Redis to power frequency capping without a database query on every serve.

| Property | Value |
|----------|-------|
| TTL | 86,400 seconds (24 hours) |
| Key Pattern | `userprofile:{customerId}` |
| Max Impressions Stored | 500 (hard cap to prevent memory leaks) |
| Pruning: | Impressions older than 24h are pruned on every write |
| Write Strategy | Redis pipeline (atomic `SET` + `EXPIRE`) |
| Failure Mode | Non-blocking — if Redis is unavailable, a fresh empty profile is used and ad serving continues |

---

## 10. Deployment & Infrastructure

### Docker
The project includes a `Dockerfile` for the backend and a `docker-compose.yml` for multi-service orchestration.

```yaml
# docker-compose.yml defines:
# - backend service (Hono API)
# - frontend service (static file server)
```

### Development Mode
```bash
# Install all dependencies
npm run install:all

# Start both services concurrently
npm run dev

# Backend only (port 3030)
npm run start:backend

# Frontend only (port 3000)
npm run start:frontend
```

### Production Deployment
The backend API is hosted on **Render** (as referenced in the PRD). Environment variables are managed via `.env` files.

### Required Environment Variables

```env
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://...
JWT_SECRET=...
INTERSWITCH_CLIENT_ID=...
INTERSWITCH_CLIENT_SECRET=...
INTERSWITCH_BASE_URL=...
PORT=3030
```

---

## 11. Data Models

### User
```typescript
{
  email: String,     // unique
  password: String,  // bcrypt hashed
  name: String,
  createdAt: Date
}
```

### API Key
```typescript
{
  key: String,           // unique, generated UUID/hash
  userId: ObjectId,      // ref: User
  plan: String,          // "basic" | "pro" | "enterprise"
  status: String,        // "active" | "revoked"
  expiresAt: Date,
  createdAt: Date
}
```

### Ad / Campaign
```typescript
{
  userId: ObjectId,       // ref: User (owner)
  title: String,
  imageUrl: String,
  videoUrl: String,
  cta: String,            // Call-to-action label
  segments: [String],     // ["low", "mass", "affluent", "hnw"]
  channels: [String],     // ["ATM", "mobile", "web", "USSD"]
  timeSlots: [String],    // ["morning", "afternoon", "evening", "night"]
  locations: [String],    // ["Lagos", "Abuja", ...]
  startDate: Date,
  endDate: Date,
  status: String,         // "active" | "paused" | "completed"
  priority: Number,       // 1–10 (higher = more likely to serve)
  impressions: Number,    // auto-incremented
  clicks: Number,         // auto-incremented
  budget: Number,
  spent: Number,
  advertiser: {
    name: String,
    contactEmail: String
  }
}
```

---

## 12. Future Roadmap

| Feature | Description | Status |
|---------|-------------|--------|
| **Pay-Per-Impression Billing** | Meter API calls and bill high-volume clients based on actual ad deliveries rather than subscriptions. | Planned |
| **Advertiser Self-Serve Portal** | A separate portal for third-party advertisers to submit ad campaigns for bank distribution. | Planned |
| **Advanced Analytics Dashboard** | Heatmaps, funnel analysis, time-series reporting, and exportable CSV reports. | Planned |
| **Geographic Targeting** | Filter ad delivery based on ATM location or IP geolocation, mapped to `locations[]` field that already exists on ad documents. | In Progress |
| **USSD Channel Support** | Text-only ad format for the USSD banking channel, already supported in the `channels` enum. | Planned |
| **A/B Testing Framework** | Serve multiple ad variants to cohorts and compare CTR performance to determine the best creative. | Planned |
| **PostgreSQL Migration** | PRD specifies Postgres as the primary database. Current implementation uses MongoDB. A migration path using an ORM (e.g., Prisma) may be evaluated. | Under Review |

---

*Last Updated: April 2026 | Bank Ads Engine v2.0.0*
