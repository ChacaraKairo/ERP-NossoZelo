import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { Public } from "../common/decorators/public.decorator";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
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
