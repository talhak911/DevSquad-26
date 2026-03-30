import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get configuration from environment variables
  const port = configService.get<number>('PORT') || 3001;
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';

  // Enable CORS with configured origin
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📝 CORS Origin: ${corsOrigin}`);
}
bootstrap();
