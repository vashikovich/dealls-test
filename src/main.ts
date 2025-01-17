import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);

  app.use(helmet());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(configService.get('app.port', 3000));
}
bootstrap();
