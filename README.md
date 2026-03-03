# Bond Yield Calculator

A friendly full-stack web app to **calculate bond yields and cash flows**. Enter face value, coupon rate, market price, and maturity — get current yield, yield to maturity (YTM), total interest, premium/discount, and a full cash flow schedule in a clean, responsive UI.

---

## What you get

- **Current yield** — Annual coupon income as a percentage of market price  
- **Yield to maturity (YTM)** — Internal rate of return (computed accurately via binary search)  
- **Total interest** — Sum of all coupon payments over the life of the bond  
- **Premium / discount / par** — Whether the bond trades above, below, or at face value  
- **Cash flow schedule** — Period-by-period payment dates, coupon amounts, cumulative interest, and remaining principal  

The website is simple and focused: one form, clear results, and an optional detailed table. Built with **NestJS** (API) and **React + Vite + TypeScript** (frontend).

---

## Project structure

```
interview/
├── backend/              # NestJS API (port 3000)
│   ├── package.json
│   └── src/
│       ├── bond/         # BondController, BondService, DTOs
│       └── main.ts
├── frontend/             # React + Vite app (port 5173)
│   ├── package.json
│   └── src/
│       ├── api/          # bondApi.ts
│       ├── components/   # BondForm, BondResults, CashFlowTable
│       ├── constants/    # form defaults, CSS classes
│       ├── hooks/        # useBondCalculation
│       ├── types/        # bond types
│       └── App.tsx
└── README.md
```

Each app has its own `package.json`; install and run from `backend/` and `frontend/` directly.

---

## How to run

**1. Start the backend**

```bash
cd backend
npm install
npm run start:dev
```

API runs at **http://localhost:3000**. You can override the port with the `PORT` env variable.

**2. Start the frontend**

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser. The dev server proxies `/bond` to the backend. For production or a custom API URL, set `VITE_API_URL` in `.env`.

**Tip:** Start the backend first, then the frontend. You only need `npm install` when dependencies change.

---

## Tests (backend)

From the `backend/` folder:

```bash
npm test           # unit tests (BondService)
npm run test:e2e   # e2e test for POST /bond/calculate
```

---

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

- `couponFrequency`: `"annual"` or `"semi-annual"`.

**Response:** `currentYieldPercent`, `ytmPercent`, `totalInterest`, `premiumOrDiscount` (`"premium"` | `"discount"` | `"par"`), and `cashFlowSchedule` (array of period, paymentDate, couponPayment, cumulativeInterest, remainingPrincipal).

---

## Bond math (short)

- **Current yield:** (Annual coupon ÷ Market price) × 100  
- **YTM:** Rate that makes the present value of coupons + face value equal to market price (binary search).  
- **Total interest:** Coupon per period × number of periods.  
- **Premium/discount:** Compare market price to face value.

---

## Tech stack

- **Backend:** NestJS, class-validator (DTO validation), CORS enabled for local dev.  
- **Frontend:** React 18, Vite, TypeScript, date-fns (dates); minimal custom styling, no UI library.

---

Enjoy using the Bond Yield Calculator. If you run into issues, check that both backend and frontend are running and that the frontend can reach the API (proxy or `VITE_API_URL`).
