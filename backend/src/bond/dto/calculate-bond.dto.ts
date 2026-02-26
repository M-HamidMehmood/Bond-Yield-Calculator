import { IsEnum, IsNumber, IsPositive, Max, Min } from 'class-validator';

export enum CouponFrequency {
  ANNUAL = 'annual',
  SEMI_ANNUAL = 'semi-annual',
}

export class CalculateBondDto {
  @IsNumber()
  @IsPositive({ message: 'Face value must be positive' })
  faceValue!: number;

  @IsNumber()
  @Min(0, { message: 'Coupon rate must be at least 0' })
  @Max(100, { message: 'Coupon rate must be at most 100' })
  annualCouponRatePercent!: number;

  @IsNumber()
  @IsPositive({ message: 'Market price must be positive' })
  marketPrice!: number;

  @IsNumber()
  @IsPositive({ message: 'Years to maturity must be positive' })
  yearsToMaturity!: number;

  @IsEnum(CouponFrequency, {
    message: 'couponFrequency must be \"annual\" or \"semi-annual\"',
  })
  couponFrequency!: CouponFrequency;
}
