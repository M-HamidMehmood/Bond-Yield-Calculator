export type CouponFrequency = 'annual' | 'semi-annual';

export interface CalculateBondRequest {
  faceValue: number;
  annualCouponRatePercent: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: CouponFrequency;
}

export type PremiumOrDiscount = 'premium' | 'discount' | 'par';

export interface CashFlowRow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondResponse {
  currentYieldPercent: number;
  ytmPercent: number;
  totalInterest: number;
  premiumOrDiscount: PremiumOrDiscount;
  cashFlowSchedule: CashFlowRow[];
}
