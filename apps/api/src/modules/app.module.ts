import { Module } from "@nestjs/common";
import { AuthController } from "../routes/auth.controller";
import { DashboardController } from "../routes/dashboard.controller";
import { ErpController } from "../routes/erp.controller";
import { HealthController } from "../routes/health.controller";
import { PrismaService } from "../services/prisma.service";
import { AuditService } from "../services/audit.service";
import { ResourceService } from "../services/resource.service";
import { AuthService } from "../services/auth.service";

@Module({
  controllers: [AuthController, DashboardController, ErpController, HealthController],
  providers: [PrismaService, AuditService, ResourceService, AuthService],
})
export class AppModule {}
