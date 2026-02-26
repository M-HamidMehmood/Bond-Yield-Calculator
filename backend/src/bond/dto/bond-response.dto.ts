export type PremiumOrDiscount = 'premium' | 'discount' | 'par';

export interface CashFlowRow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondResponseDto {
  currentYieldPercent: number;
  ytmPercent: number;
  totalInterest: number;
  premiumOrDiscount: PremiumOrDiscount;
  cashFlowSchedule: CashFlowRow[];
}
