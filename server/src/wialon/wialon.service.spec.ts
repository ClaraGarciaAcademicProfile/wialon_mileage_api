import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { WialonModule } from '../src/wialon/wialon.module';
import { ConfigModule } from '@nestjs/config';

describe('WialonController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }), // Usa un .env aparte para testing
        WialonModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/wialon/vehicle-info (POST) - Success', () => {
    return request(app.getHttpServer())
      .post('/wialon/vehicle-info')
      .send({ unitId: 734455 })
      .expect(200)
      .expect(res => {
        expect(res.body.data.name).toBeDefined();
        expect(res.body.data.mileage).toBeGreaterThanOrEqual(0);
      });
  });

  it('/wialon/vehicle-info (POST) - Invalid ID', () => {
    return request(app.getHttpServer())
      .post('/wialon/vehicle-info')
      .send({ unitId: 999999 })
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
