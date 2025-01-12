import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './common/errors/exception_filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Momentum API')
    .setDescription('API for Momentum Application')
    .setVersion('1.0')
    .addTag('momentum')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  patchNestJsSwagger();
  app.useGlobalFilters(new GlobalExceptionsFilter(app.get(HttpAdapterHost)));
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
