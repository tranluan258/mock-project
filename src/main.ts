import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.EMAIL_SERVICE_HOST);

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const config = new DocumentBuilder()
    .setTitle('HospitalManagement')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document);
  await app.listen(3000);
}
bootstrap();
