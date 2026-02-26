# YTM Binary Search – Reference (for rollback / comparison)

To restore binary search: copy the implementation below into `backend/src/bond/bond.service.ts` (`computeYTM`) and optionally copy the test block into `backend/src/bond/bond.service.spec.ts`.

## Constants (bond.constants.ts)

```ts
export const YTM_YIELD_MIN = 0;
export const YTM_YIELD_MAX = 100;
export const YTM_PRICE_TOLERANCE = 0.01; // $0.01 of market price
export const YTM_MAX_ITERATIONS = 100;
```

## Binary search `computeYTM` implementation

```ts
computeYTM(dto: CalculateBondDto): number {
  const {
    faceValue,
    annualCouponRatePercent,
    yearsToMaturity,
    couponFrequency,
    marketPrice,
  } = dto;

  if (marketPrice <= 0) {
    throw new BadRequestException('Market price must be positive');
  }

  let low = YTM_YIELD_MIN;
  let high = YTM_YIELD_MAX;
  let mid = 0;
  for (let i = 0; i < YTM_MAX_ITERATIONS; i++) {
    mid = (low + high) / 2;
    const price = this.priceAtYield(
      faceValue,
      annualCouponRatePercent,
      yearsToMaturity,
      couponFrequency,
      mid,
    );

    const diff = price - marketPrice;

    if (Math.abs(diff) < YTM_PRICE_TOLERANCE) {
      return mid;
    }

    // If price is too high, yield is too low -> move low up
    if (price > marketPrice) {
      low = mid;
    } else {
      high = mid;
    }
  }

  throw new BadRequestException(
    'YTM did not converge; check inputs (e.g. market price and maturity).',
  );
}
```

## Full `describe('computeYTM', ...)` test block

```ts
describe('computeYTM', () => {
  it('returns YTM that prices bond at market price (par bond)', () => {
    const dto = {
      faceValue: 1000,
      annualCouponRatePercent: 5,
      marketPrice: 1000,
      yearsToMaturity: 10,
      couponFrequency: CouponFrequency.ANNUAL,
    };
    const ytm = service.computeYTM(dto);
    expect(ytm).toBeCloseTo(5, 1); // par bond => YTM ≈ coupon rate
  });

  it('returns higher YTM for discount bond', () => {
    const dto = {
      faceValue: 1000,
      annualCouponRatePercent: 5,
      marketPrice: 900,
      yearsToMaturity: 10,
      couponFrequency: CouponFrequency.ANNUAL,
    };
    const ytm = service.computeYTM(dto);
    expect(ytm).toBeGreaterThan(5);
  });

  it('returns lower YTM for premium bond', () => {
    const dto = {
      faceValue: 1000,
      annualCouponRatePercent: 5,
      marketPrice: 1100,
      yearsToMaturity: 10,
      couponFrequency: CouponFrequency.ANNUAL,
    };
    const ytm = service.computeYTM(dto);
    expect(ytm).toBeLessThan(5);
  });

  it('throws when market price is zero', () => {
    const dto = {
      faceValue: 1000,
      annualCouponRatePercent: 5,
      marketPrice: 0,
      yearsToMaturity: 10,
      couponFrequency: CouponFrequency.ANNUAL,
    };
    expect(() => service.computeYTM(dto)).toThrow(BadRequestException);
  });
});
```
