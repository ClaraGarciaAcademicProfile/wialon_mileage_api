import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Permitir todos los orígenes
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Wialon API')
    .setDescription(
      'API para consultar el kilometraje de vehículos usando Wialon'
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Servidor Local')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger UI available at: http://localhost:3000/api');
}
bootstrap();
