import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Next.js frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global API Prefix
  app.setGlobalPrefix('api/v1');

  // Request Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('BharatBN™ Core REST API')
    .setDescription(
      'AI-Powered Business Discovery & Enterprise Visibility Platform - Engine 7 API Specification',
    )
    .setVersion('1.0')
    .addTag('businesses', 'Directory Listings & Search')
    .addTag('claims', 'Business Claim & Verification Workflows')
    .addTag('franchise', 'Enterprise Franchise Brand & Branches')
    .addTag('leads', 'Inquiries Capture & WhatsApp Attribution')
    .addTag('pay-as-you-rank', 'SEO Campaigns & Milestone Verifications')
    .addTag('url-registry', 'Hybrid WordPress/Next.js URL Ownership Registry')
    .addTag('taxonomy', 'Locations & Category Hierarchy')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`[BharatBN API] Server running on http://localhost:${port}/api/v1`);
  console.log(`[BharatBN API] Swagger documentation on http://localhost:${port}/api/docs`);
}

bootstrap();

