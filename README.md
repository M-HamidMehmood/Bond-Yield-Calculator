# Bond Yield Calculator

A small full-stack app: **NestJS** backend and **React (Vite + TypeScript)** frontend. It computes current yield, YTM (yield to maturity), total interest, premium/discount, and a cash flow schedule for a bullet bond.

## Project structure

```
interview/
├── package.json      # root scripts: dev:backend, dev:frontend, install:all
├── backend/          # NestJS API (port 3000)
│   └── src/
│       ├── bond/     # BondController, BondService, DTOs
│       └── main.ts
├── frontend/         # React + Vite (port 5173)
│   └── src/
│       ├── api/      # bondApi.ts
│       ├── components/  # BondForm, BondResults, CashFlowTable
│       ├── constants/   # classes, formDefaults
│       ├── hooks/       # useBondCalculation
│       ├── types/       # bond.ts
│       └── App.tsx
└── README.md
```

## How to run

### Backend

```bash
cd backend
npm install
npm run start:dev
```

API base: `http://localhost:3000` (or set `PORT` to override the default).  
Endpoint: `POST /bond/calculate` with JSON body (see below).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/bond` to the backend by default. For production or a custom API URL, set `VITE_API_URL` (e.g. in `.env`) to the backend base URL; if unset, requests use the current origin (dev proxy or same host).

### One command per app (from repo root)

- Backend: `npm run dev:backend` (or `cd backend && npm run start:dev`)
- Frontend: `npm run dev:frontend` (or `cd frontend && npm run dev`)

Start the backend first, then the frontend. To install all dependencies: `npm run install:all`.

### Faster install & build (if things are slow)

- **Install once** – You only need `npm install` when you add/change dependencies. For daily dev, just run `npm run dev` (no need to reinstall).
- **Faster frontend build** – Use `npm run build:fast` in `frontend/` to skip TypeScript check and only run Vite (much quicker). Use `npm run build` when you want full type-check + build (e.g. for production). Run `npm run typecheck` separately when you want to check types.
- **Faster install** – From the project folder, try:
  - `npm install --no-optional` to skip optional dependencies (can reduce time).
  - If you have a lockfile: `npm ci` is often faster and more reliable than `npm install`.
- **Network** – Slow installs are often due to registry latency. You can try a different registry (e.g. a mirror) or run install when you have a stable connection and reuse `node_modules`.

### Tests (backend)

After `npm install` in `backend/`:

```bash
cd backend
npm test          # unit tests (BondService)
npm run test:e2e  # e2e test (POST /bond/calculate)
```

## API

**POST** `/bond/calculate`

**Request body:**

```json
{
  "faceValue": 1000,
  "annualCouponRatePercent": 5,
  "marketPrice": 1050,
  "yearsToMaturity": 10,
  "couponFrequency": "annual"
}
```

`couponFrequency`: `"annual"` or `"semi-annual"`.

**Response:** `currentYieldPercent`, `ytmPercent`, `totalInterest`, `premiumOrDiscount` (`"premium"` | `"discount"` | `"par"`), `cashFlowSchedule` (array of `{ period, paymentDate, couponPayment, cumulativeInterest, remainingPrincipal }`).

## Bond math (summary)

- **Current yield:** (Annual coupon ÷ Market price) × 100.
- **YTM:** Rate that makes PV of coupons + face equal to market price (computed by binary search).
- **Total interest:** Coupon per period × number of periods.
- **Premium/discount:** Compare market price to face value.

## Tech stack

- **Backend:** NestJS, class-validator (DTO validation), CORS enabled for local dev.
- **Frontend:** React 18, Vite, TypeScript, date-fns (payment date formatting); no UI library.
