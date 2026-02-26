import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BondService } from './bond.service';
import { YTM_PRICE_TOLERANCE } from './bond.constants';
import { CouponFrequency } from './dto/calculate-bond.dto';

describe('BondService', () => {
  let service: BondService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BondService],
    }).compile();
    service = module.get<BondService>(BondService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeCurrentYield', () => {
    it('returns current yield as (annual coupon / market price) * 100', () => {
      // Face 1000, 5% coupon = 50/year. Price 1000 => 5%
      expect(
        service.computeCurrentYield(1000, 5, 1000),
      ).toBeCloseTo(5, 4);
      // Price 1050 => 50/1050 * 100 ≈ 4.7619
      expect(
        service.computeCurrentYield(1000, 5, 1050),
      ).toBeCloseTo(50 / 1050 * 100, 4);
    });

    it('throws when market price is zero or negative', () => {
      expect(() => service.computeCurrentYield(1000, 5, 0)).toThrow(
        BadRequestException,
      );
      expect(() => service.computeCurrentYield(1000, 5, -100)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('computeTotalInterest', () => {
    it('returns couponPerPeriod * numPeriods', () => {
      expect(service.computeTotalInterest(25, 20)).toBe(500);
      expect(service.computeTotalInterest(50, 10)).toBe(500);
    });
  });

  describe('getPremiumOrDiscount', () => {
    it('returns premium when market price > face', () => {
      expect(service.getPremiumOrDiscount(1050, 1000)).toBe('premium');
    });
    it('returns discount when market price < face', () => {
      expect(service.getPremiumOrDiscount(950, 1000)).toBe('discount');
    });
    it('returns par when market price equals face', () => {
      expect(service.getPremiumOrDiscount(1000, 1000)).toBe('par');
    });
    it('returns par when difference is within tolerance', () => {
      expect(service.getPremiumOrDiscount(1000.0000001, 1000)).toBe('par');
    });
  });

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

    it('returns YTM for semi-annual coupon frequency (par bond)', () => {
      const dto = {
        faceValue: 1000,
        annualCouponRatePercent: 6,
        marketPrice: 1000,
        yearsToMaturity: 2,
        couponFrequency: CouponFrequency.SEMI_ANNUAL,
      };
      const ytm = service.computeYTM(dto);
      expect(ytm).toBeCloseTo(6, 1);
    });

    it('recomputed price at solved YTM is within tolerance of market price', () => {
      const dto = {
        faceValue: 1000,
        annualCouponRatePercent: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const ytm = service.computeYTM(dto);
      const recomputedPrice = (service as any).priceAtYield(
        dto.faceValue,
        dto.annualCouponRatePercent,
        dto.yearsToMaturity,
        dto.couponFrequency,
        ytm,
      );
      expect(Math.abs(recomputedPrice - dto.marketPrice)).toBeLessThanOrEqual(
        YTM_PRICE_TOLERANCE,
      );
    });

    it('recomputed price at solved YTM for discount bond is within tolerance', () => {
      const dto = {
        faceValue: 1000,
        annualCouponRatePercent: 5,
        marketPrice: 900,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const ytm = service.computeYTM(dto);
      const recomputedPrice = (service as any).priceAtYield(
        dto.faceValue,
        dto.annualCouponRatePercent,
        dto.yearsToMaturity,
        dto.couponFrequency,
        ytm,
      );
      expect(Math.abs(recomputedPrice - dto.marketPrice)).toBeLessThanOrEqual(
        YTM_PRICE_TOLERANCE,
      );
    });

    it('converges for par bond without throwing', () => {
      const dto = {
        faceValue: 1000,
        annualCouponRatePercent: 5,
        marketPrice: 1000,
        yearsToMaturity: 2,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const ytm = service.computeYTM(dto);
      expect(ytm).toBeCloseTo(5, 1);
    });
  });

  describe('buildCashFlowSchedule', () => {
    it('returns numPeriods rows for annual frequency', () => {
      const start = new Date('2025-01-15');
      const { schedule, totalInterest } = service.buildCashFlowSchedule(
        1000,
        5,
        3,
        CouponFrequency.ANNUAL,
        start,
      );
      expect(schedule).toHaveLength(3);
      expect(schedule[0].period).toBe(1);
      expect(schedule[0].couponPayment).toBe(50);
      expect(schedule[0].remainingPrincipal).toBe(1000);
      expect(schedule[2].remainingPrincipal).toBe(0);
      expect(totalInterest).toBe(150);
    });

    it('returns 2* years rows for semi-annual frequency', () => {
      const start = new Date('2025-01-15');
      const { schedule, totalInterest } = service.buildCashFlowSchedule(
        1000,
        6,
        2,
        CouponFrequency.SEMI_ANNUAL,
        start,
      );
      expect(schedule).toHaveLength(4);
      expect(schedule[0].couponPayment).toBe(30); // 6% / 2 * 1000
      expect(totalInterest).toBe(120);
    });
  });

  describe('calculateBond', () => {
    it('returns full response with all fields', () => {
      const dto = {
        faceValue: 1000,
        annualCouponRatePercent: 5,
        marketPrice: 1000,
        yearsToMaturity: 2,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = service.calculateBond(dto);
      expect(result).toHaveProperty('currentYieldPercent');
      expect(result).toHaveProperty('ytmPercent');
      expect(result).toHaveProperty('totalInterest');
      expect(result).toHaveProperty('premiumOrDiscount', 'par');
      expect(result).toHaveProperty('cashFlowSchedule');
      expect(result.cashFlowSchedule).toHaveLength(2);
    });
  });
});
