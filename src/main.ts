import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // O filtro que pega tudo vem primeiro; o específico, por último
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpErrorFilter());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();