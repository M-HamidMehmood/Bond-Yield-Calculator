import type { CalculateBondRequest } from '../types/bond';

export const initialBondForm: CalculateBondRequest = {
  faceValue: 1000,
  annualCouponRatePercent: 5,
  marketPrice: 1050,
  yearsToMaturity: 10,
  couponFrequency: 'semi-annual',
};
