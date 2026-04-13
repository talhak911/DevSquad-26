import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3000', // Update this based on the frontend URL in production
    credentials: true, // Crucial for receiving cookies
  });

  app.use(cookieParser());
  
  // Required by Passport to track state during OAuth redirects and prevent CSRF
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'ecommerce-social-login-secret-replace-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hour
      },
    }),
  );

  await app.listen(process.env.PORT ?? 4000); // Port 4000 to avoid conflict with Next.js
}
bootstrap();
