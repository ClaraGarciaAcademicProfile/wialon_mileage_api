import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WialonModule } from './wialon/wialon.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), WialonModule],
})
export class AppModule {}
