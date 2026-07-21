import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import type { Response } from "express";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import type { RequestWithContext } from "../common/types/request-user";
import { AuditService } from "../services/audit.service";
import { ExportacoesService } from "../services/exportacoes.service";

@Controller("exportacoes")
export class ExportacoesController {
  constructor(
    private readonly exportacoes: ExportacoesService,
    private readonly audit: AuditService,
  ) {}

  @Get("ultimo-backup")
  @RequirePermission("backup:read")
  ultimoBackup() {
    return this.exportacoes.ultimoBackup();
  }

  @Post("backup/manual")
  @RequirePermission("backup:create")
  async registrarBackup(@Req() request: RequestWithContext) {
    const row = await this.exportacoes.registrarBackup(request.user?.id);
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "registrar_backup_manual",
      modulo: "backup",
      entidadeTipo: "backupRegistro",
      entidadeId: row.id,
      metodoHttp: request.method,
      rota: request.path,
      dadosNovos: row,
      requestId: request.requestId,
      sessionId: request.session?.id,
      deviceId: request.session?.deviceId,
      ip: request.ip,
      userAgent: request.get("user-agent"),
    });
    return row;
  }

  @Get("backup/destinos")
  @RequirePermission("backup:read")
  destinosBackup() {
    return this.exportacoes.destinosBackup();
  }

  @Get("backup/pastas")
  @RequirePermission("backup:read")
  navegarPastas(@Query("path") path?: string) {
    return this.exportacoes.navegarPastas(path);
  }

  @Post("backup/local")
  @RequirePermission("backup:create")
  async backupLocal(@Body() body: { destino?: string }, @Req() request: RequestWithContext) {
    const row = await this.exportacoes.backupLocal(body.destino, request.user?.id);
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "gerar_backup_local",
      modulo: "backup",
      entidadeTipo: "backupRegistro",
      entidadeId: row.id,
      metodoHttp: request.method,
      rota: request.path,
      dadosNovos: row,
      requestId: request.requestId,
      sessionId: request.session?.id,
      deviceId: request.session?.deviceId,
      ip: request.ip,
      userAgent: request.get("user-agent"),
    });
    return row;
  }

  @Get("dados.json")
  @RequirePermission("backup:read")
  async dadosJson(@Res() response: Response) {
    const data = await this.exportacoes.dadosJson();
    const body = JSON.stringify(data, null, 2);
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Disposition", `attachment; filename="erp-nossozelo-backup-${new Date().toISOString().slice(0, 10)}.json"`);
    response.send(body);
  }

  @Get("financeiro.csv")
  @RequirePermission("backup:read")
  async financeiroCsv(@Query("mes") mes: string | undefined, @Res() response: Response) {
    const csv = await this.exportacoes.financeiroCsv(mes);
    response.setHeader("Content-Type", "text/csv; charset=utf-8");
    response.setHeader("Content-Disposition", `attachment; filename="erp-nossozelo-financeiro${mes ? `-${mes}` : ""}.csv"`);
    response.send(csv);
  }

  @Get("contas-a-pagar.csv")
  @RequirePermission("backup:read")
  async contasPagarCsv(@Res() response: Response) {
    const csv = await this.exportacoes.contasPagarCsv();
    response.setHeader("Content-Type", "text/csv; charset=utf-8");
    response.setHeader("Content-Disposition", `attachment; filename="erp-nossozelo-contas-a-pagar.csv"`);
    response.send(csv);
  }
}
