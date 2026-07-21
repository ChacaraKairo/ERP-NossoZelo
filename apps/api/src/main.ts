import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./modules/app.module";
import { requestIdMiddleware } from "./common/middleware/request-id.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  app.setGlobalPrefix("api");
  app.use(requestIdMiddleware);
  app.use(cookieParser());
  app.enableCors({
    origin: [appUrl, "http://localhost:3000"],
    credentials: true,
  });

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
  console.log(`API Nest ERP NossoZelo rodando em http://localhost:${port}/api`);
}

bootstrap();
