import { Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import type { RequestWithContext } from "../common/types/request-user";
import { AuditService } from "../services/audit.service";
import { FechamentoService } from "../services/fechamento.service";

@Controller("fechamento")
export class FechamentoController {
  constructor(
    private readonly fechamento: FechamentoService,
    private readonly audit: AuditService,
  ) {}

  @Get("resumo")
  @RequirePermission("fechamento:read")
  resumo(@Query("mes") mes?: string) {
    return this.fechamento.resumo(mes);
  }

  @Post(":mes/fechar")
  @RequirePermission("fechamento:close")
  async fechar(@Param("mes") mes: string, @Req() request: RequestWithContext) {
    const row = await this.fechamento.fechar(mes, request.user?.id);
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "fechar_mes",
      modulo: "fechamento",
      entidadeTipo: "fechamentoMensal",
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
}
