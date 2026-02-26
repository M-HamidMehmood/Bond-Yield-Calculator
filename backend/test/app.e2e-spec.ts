import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'superagent';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Bond API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /bond/calculate returns 200 and bond metrics', () => {
    return request(app.getHttpServer())
      .post('/bond/calculate')
      .send({
        faceValue: 1000,
        annualCouponRatePercent: 5,
        marketPrice: 1000,
        yearsToMaturity: 2,
        couponFrequency: 'annual',
      })
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.currentYieldPercent).toBeCloseTo(5, 2);
        expect(typeof res.body.ytmPercent).toBe('number');
        expect(res.body.totalInterest).toBeCloseTo(100, 2);
        expect(res.body.premiumOrDiscount).toBe('par');
        expect(Array.isArray(res.body.cashFlowSchedule)).toBe(true);
        expect(res.body.cashFlowSchedule).toHaveLength(2);
      });
  });

  it('POST /bond/calculate returns 400 for invalid body', () => {
    return request(app.getHttpServer())
      .post('/bond/calculate')
      .send({
        faceValue: -1,
        annualCouponRatePercent: 5,
        marketPrice: 1000,
        yearsToMaturity: 2,
        couponFrequency: 'annual',
      })
      .expect(400);
  });
});
