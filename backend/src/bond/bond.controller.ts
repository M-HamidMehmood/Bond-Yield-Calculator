import { Body, Controller, Post } from '@nestjs/common';
import { BondService } from './bond.service';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondResponseDto } from './dto/bond-response.dto';

@Controller('bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateBondDto): BondResponseDto {
    return this.bondService.calculateBond(dto);
  }
}

