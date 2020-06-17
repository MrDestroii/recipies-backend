import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT);

  app.enableCors({
    origin: '*'
  })
}
bootstrap();
