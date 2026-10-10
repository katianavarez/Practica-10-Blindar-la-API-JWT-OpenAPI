import 'dotenv/config'
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DominioExceptionFilter } from './comun/filtros/dominio.filter';
import { LoggingInterceptor } from './comun/interceptores/logging.interceptor';
import { SobreInterceptor } from './comun/interceptores/sobre.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )

  app.useGlobalFilters(new DominioExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor(), new SobreInterceptor());

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    exposedHeaders: ['Location', 'X-Request-Id'],
  });

  const config = new DocumentBuilder()
    .setTitle('API del Gimnasio')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documento);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
