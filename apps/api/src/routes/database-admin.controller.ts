import { Body, Controller, HttpCode, Post, Req, Res } from "@nestjs/common";
import type { Response } from "express";
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

  @Post("sql/pdf")
  @HttpCode(200)
  @RequirePermission("database:write")
  async exportSqlPdf(@Body() body: { sql?: string }, @Req() request: RequestWithContext, @Res() response: Response) {
    const buffer = await this.database.pdf(String(body.sql ?? ""), request.user);
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "exportar_sql_pdf",
      modulo: "database",
      entidadeTipo: "database",
      metodoHttp: request.method,
      rota: request.path,
      dadosNovos: { sqlPreview: String(body.sql ?? "").slice(0, 500) },
      requestId: request.requestId,
      sessionId: request.session?.id,
      deviceId: request.session?.deviceId,
      ip: request.ip,
      userAgent: request.get("user-agent"),
    });
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `attachment; filename="resultado-sql-${new Date().toISOString().slice(0, 10)}.pdf"`);
    response.send(buffer);
  }
}
