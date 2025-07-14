// src/wialon/dto/mileage.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MileageResponseDto {
  @ApiProperty({
    description: 'Kilometraje del vehículo (km)',
    example: 483883,
    type: Number,
  })
  mileage: number;
}
