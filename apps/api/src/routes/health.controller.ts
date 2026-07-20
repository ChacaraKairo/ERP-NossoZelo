import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async health() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ok",
        app: "ERP NossoZelo API",
        version: process.env.npm_package_version ?? "1.0.0",
        environment: process.env.NODE_ENV ?? "development",
        database: "ok",
      };
    } catch {
      throw new ServiceUnavailableException({ status: "error", database: "unavailable" });
    }
  }
}
