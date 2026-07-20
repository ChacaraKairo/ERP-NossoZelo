import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "../routes/auth.controller";
import { DashboardController } from "../routes/dashboard.controller";
import { ErpController } from "../routes/erp.controller";
import { HealthController } from "../routes/health.controller";
import { AlertasController } from "../routes/alertas.controller";
import { ExportacoesController } from "../routes/exportacoes.controller";
import { FechamentoController } from "../routes/fechamento.controller";
import { PrismaService } from "../services/prisma.service";
import { AuditService } from "../services/audit.service";
import { ResourceService } from "../services/resource.service";
import { AuthService } from "../services/auth.service";
import { AuthGuard } from "../common/guards/auth.guard";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { AlertasService } from "../services/alertas.service";
import { ExportacoesService } from "../services/exportacoes.service";
import { FechamentoService } from "../services/fechamento.service";

@Module({
  controllers: [AuthController, DashboardController, ErpController, HealthController, AlertasController, FechamentoController, ExportacoesController],
  providers: [
    PrismaService,
    AuditService,
    ResourceService,
    AuthService,
    AlertasService,
    FechamentoService,
    ExportacoesService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
