# Bank Ads API

Ads serving API built with `Bun` + `Hono`, using `MongoDB` for persistence and `Redis` for caching.

## Requirements

- Bun
- MongoDB
- Redis (default: `127.0.0.1:6379`)

## Setup

1. Install dependencies:

```sh
bun install
```

2. Create your environment file:

```sh
cp .env.example .env
```

3. Fill required variables in `.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_jwt_secret
INTERSWITCH_MODE=TEST
INTERSWITCH_MERCHANT_CODE=your_merchant_code
INTERSWITCH_PAY_ITEM_ID=your_pay_item_id
INTERSWITCH_SITE_REDIRECT_URL=https://your-frontend.example.com/payment-response
INTERSWITCH_TRANSACTION_BASE_URL=https://qa.interswitchng.com
```

`JWT_SECRET` is validated with a minimum length requirement.

4. Run the app:

```sh
bun run dev
```

Server starts on `http://127.0.0.1:3000` (or your configured `PORT`).

## API Docs (Swagger)

- Swagger UI: `GET /api/v1/docs`
- OpenAPI JSON: `GET /api/v1/openapi.json`

Example:

- `http://127.0.0.1:3000/api/v1/docs`

## Endpoints

- `GET /api/v1/health` - Health check
- `GET /api/v1/billing/plans` - Subscription plans for frontend pricing UI
- `POST /api/v1/billing/checkout/initiate` - Create Interswitch checkout payload for a plan
- `GET /api/v1/billing/checkout/verify` - Requery and activate a paid subscription
- `POST /api/v1/ads/serve` - Serve ad for a customer segment
- `POST /api/v1/ads/create` - Create ad (requires Bearer token)
- `POST /api/v1/ads/impression` - Track ad impression

## Subscription Plans

- `Basic`: monthly and annual billing, starter rate limit tier
- `Pro`: monthly and annual billing, premium rate limit tier
- `Enterprise`: monthly and annual billing, enterprise rate limit tier

The frontend can call `GET /api/v1/billing/plans` to render pricing cards, then use the `checkout` payload from `POST /api/v1/billing/checkout/initiate` with Interswitch inline checkout or redirect checkout.

## Team Contributions

- `wizzyboypondec` handled the frontend experience and pricing/payment UI integration.
- `kingdavid uchenna munachimso` handled the backend architecture, ad-serving API, subscription billing logic, Interswitch integration, database work, authentication, and deployment support.

## Quick Request Examples

Serve ad:

```sh
curl -X POST http://127.0.0.1:3000/api/v1/ads/serve \
  -H "Content-Type: application/json" \
  -d '{"balance":120000,"channel":"ATM"}'
```

Create ad (authenticated):

```sh
curl -X POST http://127.0.0.1:3000/api/v1/ads/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "title":"Premium Loan Offer",
    "imageUrl":"https://cdn.example.com/ad.jpg",
    "segments":["mass","affluent"],
    "channels":["ATM","mobile"],
    "startDate":"2026-02-14T00:00:00.000Z",
    "endDate":"2026-03-14T00:00:00.000Z"
  }'
```
