import { Body, Controller, Post, Req } from "@nestjs/common";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import type { RequestWithContext } from "../common/types/request-user";
import { AuditService } from "../services/audit.service";
import { DatabaseAdminService } from "../services/database-admin.service";

@Controller("database")
export class DatabaseAdminController {
  constructor(
    private readonly database: DatabaseAdminService,
    private readonly audit: AuditService,
  ) {}

  @Post("sql")
  @RequirePermission("database:write")
  async executeSql(@Body() body: { sql?: string; confirmation?: string }, @Req() request: RequestWithContext) {
    const result = await this.database.execute(String(body.sql ?? ""), body.confirmation);
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "executar_sql",
      modulo: "database",
      entidadeTipo: "database",
      metodoHttp: request.method,
      rota: request.path,
      dadosNovos: {
        mode: result.mode,
        rowCount: "rowCount" in result ? result.rowCount : undefined,
        affectedRows: "affectedRows" in result ? result.affectedRows : undefined,
        sqlPreview: String(body.sql ?? "").slice(0, 500),
      },
      requestId: request.requestId,
      sessionId: request.session?.id,
      deviceId: request.session?.deviceId,
      ip: request.ip,
      userAgent: request.get("user-agent"),
      severidade: result.mode === "write" ? "WARN" : "INFO",
    });
    return result;
  }
}
