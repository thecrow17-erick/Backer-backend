import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const port = +process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(port, () => {
    console.log(`server on port ${port}`);
  });
}
bootstrap();
