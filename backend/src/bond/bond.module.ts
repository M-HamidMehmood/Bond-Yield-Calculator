import { Module } from '@nestjs/common';
import { BondService } from './bond.service';
import { BondController } from './bond.controller';

@Module({
  providers: [BondService],
  controllers: [BondController],
})
export class BondModule {}

