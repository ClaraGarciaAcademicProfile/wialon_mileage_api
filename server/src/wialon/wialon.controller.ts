import {
  Controller,
  Get,
  Post,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WialonService } from './wialon.service';
import { MileageResponseDto } from './dto/mileage.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('Wialon')
@Controller('wialon')
export class WialonController {
  constructor(private readonly wialonService: WialonService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticarse en la API de Wialon' })
  @ApiResponse({
    status: 200,
    description: 'Autenticación exitosa, devuelve el identificador de sesión',
    schema: {
      example: { eid: '02c87....' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Fallo en la autenticación',
    schema: { example: { statusCode: 401, message: 'Login failed: ...' } },
  })
  async login() {
    try {
      const { eid } = await this.wialonService.login();
      return { eid };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('mileage')
  @ApiOperation({ summary: 'Obtener el kilometraje de un vehículo' })
  @ApiQuery({
    name: 'vehicleName',
    description: 'Nombre del vehículo (ej. Buick Skylark Convertible)',
    required: true,
    type: String,
    example: 'Buick Skylark Convertible',
  })
  @ApiResponse({
    status: 200,
    description: 'Kilometraje obtenido exitosamente',
    type: MileageResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Falta el parámetro vehicleName',
    schema: {
      example: {
        statusCode: 400,
        message: 'vehicleName query parameter is required',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error al obtener el kilometraje',
    schema: {
      example: { statusCode: 500, message: 'Failed to fetch mileage for ...' },
    },
  })
  async getMileage(@Query('vehicleName') vehicleName: string) {
    if (!vehicleName) {
      throw new HttpException(
        'vehicleName query parameter is required',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const mileage = await this.wialonService.getMileage(vehicleName);
      return { mileage };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
