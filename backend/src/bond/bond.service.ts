import { Injectable, BadRequestException } from '@nestjs/common';
import {
  PAR_TOLERANCE,
  YTM_MAX_ITERATIONS,
  YTM_PRICE_TOLERANCE,
  YTM_YIELD_MAX,
  YTM_YIELD_MIN,
} from './bond.constants';
import { CalculateBondDto, CouponFrequency } from './dto/calculate-bond.dto';
import {
  BondResponseDto,
  CashFlowRow,
  PremiumOrDiscount,
} from './dto/bond-response.dto';

@Injectable()
export class BondService {
  computeCurrentYield(
    faceValue: number,
    annualCouponRatePercent: number,
    marketPrice: number,
  ): number {
    if (marketPrice <= 0) {
      throw new BadRequestException('Market price must be positive');
    }
    const annualCoupon = (faceValue * annualCouponRatePercent) / 100;
    const currentYield = (annualCoupon / marketPrice) * 100;
    return currentYield;
  }

  private priceAtYield(
    faceValue: number,
    annualCouponRatePercent: number,
    yearsToMaturity: number,
    couponFrequency: CouponFrequency,
    yieldPercent: number,
  ): number {
    const periodsPerYear = couponFrequency === CouponFrequency.ANNUAL ? 1 : 2;
    const numPeriods = Math.round(yearsToMaturity * periodsPerYear);
    const couponPerPeriod =
      (faceValue * (annualCouponRatePercent / 100)) / periodsPerYear;

    const periodicYield = yieldPercent / 100 / periodsPerYear;
    let price = 0;

    for (let t = 1; t <= numPeriods; t++) {
      price += couponPerPeriod / Math.pow(1 + periodicYield, t);
    }

    price += faceValue / Math.pow(1 + periodicYield, numPeriods);

    return price;
  }

  /**
   * dP/dy (dollar change in price per 1% change in annual yield).
   * Uses dP/dr = -sum_{t=1..T} t*C/(1+r)^{t+1} - T*F/(1+r)^{T+1} and dP/dy = (dP/dr)/(100*periodsPerYear).
   */
  private priceDerivativeAtYield(
    faceValue: number,
    annualCouponRatePercent: number,
    yearsToMaturity: number,
    couponFrequency: CouponFrequency,
    yieldPercent: number,
  ): number {
    const periodsPerYear = couponFrequency === CouponFrequency.ANNUAL ? 1 : 2;
    const numPeriods = Math.round(yearsToMaturity * periodsPerYear);
    const couponPerPeriod =
      (faceValue * (annualCouponRatePercent / 100)) / periodsPerYear;
    const periodicYield = yieldPercent / 100 / periodsPerYear;

    let dPdr = 0;
    for (let t = 1; t <= numPeriods; t++) {
      dPdr -= (t * couponPerPeriod) / Math.pow(1 + periodicYield, t + 1);
    }
    dPdr -= (numPeriods * faceValue) / Math.pow(1 + periodicYield, numPeriods + 1);

    const drdy = 1 / (100 * periodsPerYear);
    return dPdr * drdy;
  }

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

    let y = annualCouponRatePercent;
    const DERIV_EPS = 1e-10;

    for (let i = 0; i < YTM_MAX_ITERATIONS; i++) {
      const price = this.priceAtYield(
        faceValue,
        annualCouponRatePercent,
        yearsToMaturity,
        couponFrequency,
        y,
      );
      const diff = price - marketPrice;

      if (Math.abs(diff) < YTM_PRICE_TOLERANCE) {
        return y;
      }

      const deriv = this.priceDerivativeAtYield(
        faceValue,
        annualCouponRatePercent,
        yearsToMaturity,
        couponFrequency,
        y,
      );
      if (Math.abs(deriv) < DERIV_EPS) {
        throw new BadRequestException(
          'YTM did not converge; check inputs (e.g. market price and maturity).',
        );
      }

      y = y - diff / deriv;
      y = Math.max(YTM_YIELD_MIN, Math.min(YTM_YIELD_MAX, y));
    }

    throw new BadRequestException(
      'YTM did not converge; check inputs (e.g. market price and maturity).',
    );
  }

  computeTotalInterest(
    couponPerPeriod: number,
    numPeriods: number,
  ): number {
    return couponPerPeriod * numPeriods;
  }

  getPremiumOrDiscount(
    marketPrice: number,
    faceValue: number,
  ): PremiumOrDiscount {
    if (Math.abs(marketPrice - faceValue) < PAR_TOLERANCE) {
      return 'par';
    }
    return marketPrice > faceValue ? 'premium' : 'discount';
  }

  buildCashFlowSchedule(
    faceValue: number,
    annualCouponRatePercent: number,
    yearsToMaturity: number,
    couponFrequency: CouponFrequency,
    startDate: Date = new Date(),
  ): { schedule: CashFlowRow[]; totalInterest: number } {
    const periodsPerYear = couponFrequency === CouponFrequency.ANNUAL ? 1 : 2;
    const numPeriods = Math.round(yearsToMaturity * periodsPerYear);
    const couponPerPeriod =
      (faceValue * (annualCouponRatePercent / 100)) / periodsPerYear;

    const schedule: CashFlowRow[] = [];
    let cumulativeInterest = 0;

    for (let period = 1; period <= numPeriods; period++) {
      cumulativeInterest += couponPerPeriod;

      const paymentDate = new Date(startDate.getTime());
      const monthsToAdd = (12 / periodsPerYear) * period;
      paymentDate.setMonth(paymentDate.getMonth() + monthsToAdd);

      const row: CashFlowRow = {
        period,
        paymentDate: paymentDate.toISOString().split('T')[0],
        couponPayment: parseFloat(couponPerPeriod.toFixed(2)),
        cumulativeInterest: parseFloat(cumulativeInterest.toFixed(2)),
        remainingPrincipal: period === numPeriods ? 0 : faceValue,
      };

      schedule.push(row);
    }

    const totalInterest = this.computeTotalInterest(
      couponPerPeriod,
      numPeriods,
    );

    return {
      schedule,
      totalInterest,
    };
  }

  calculateBond(dto: CalculateBondDto): BondResponseDto {
    const {
      faceValue,
      annualCouponRatePercent,
      marketPrice,
      yearsToMaturity,
      couponFrequency,
    } = dto;

    const currentYieldPercent = this.computeCurrentYield(
      faceValue,
      annualCouponRatePercent,
      marketPrice,
    );

    const ytmPercent = this.computeYTM(dto);

    const { schedule, totalInterest } = this.buildCashFlowSchedule(
      faceValue,
      annualCouponRatePercent,
      yearsToMaturity,
      couponFrequency,
    );

    const premiumOrDiscount = this.getPremiumOrDiscount(
      marketPrice,
      faceValue,
    );

    return {
      currentYieldPercent: parseFloat(currentYieldPercent.toFixed(4)),
      ytmPercent: parseFloat(ytmPercent.toFixed(4)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      premiumOrDiscount,
      cashFlowSchedule: schedule,
    };
  }
}

