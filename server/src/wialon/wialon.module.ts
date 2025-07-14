import { Module } from '@nestjs/common';
import { WialonController } from './wialon.controller';
import { WialonService } from './wialon.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [WialonController],
  providers: [WialonService],
})
export class WialonModule {}
