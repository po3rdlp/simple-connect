import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('dev/v1')

  await app.listen(3500);
}
bootstrap();
