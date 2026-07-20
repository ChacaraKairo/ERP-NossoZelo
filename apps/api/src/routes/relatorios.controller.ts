import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import type { Response } from "express";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import type { RequestWithContext } from "../common/types/request-user";
import { RelatoriosService } from "../services/relatorios.service";

@Controller("relatorios")
@RequirePermission("relatorios:read")
export class RelatoriosController {
  constructor(private readonly relatorios: RelatoriosService) {}

  @Get("fechamento-mensal/pdf")
  async fechamentoMensal(@Query("mes") mes: string | undefined, @Req() request: RequestWithContext, @Res() response: Response) {
    return this.sendPdf(response, await this.relatorios.fechamentoMensalPdf(mes, request.user), `fechamento-mensal-${mes ?? "atual"}.pdf`);
  }

  @Get("financeiro/pdf")
  async financeiro(@Query() query: Record<string, string | undefined>, @Req() request: RequestWithContext, @Res() response: Response) {
    return this.sendPdf(response, await this.relatorios.financeiroPdf(query, request.user), "financeiro-mensal.pdf");
  }

  @Get("contas-a-pagar/pdf")
  async contasPagar(@Query() query: Record<string, string | undefined>, @Req() request: RequestWithContext, @Res() response: Response) {
    return this.sendPdf(response, await this.relatorios.contasPagarPdf(query, request.user), "contas-a-pagar.pdf");
  }

  @Get("contas-a-receber/pdf")
  async contasReceber(@Query() query: Record<string, string | undefined>, @Req() request: RequestWithContext, @Res() response: Response) {
    return this.sendPdf(response, await this.relatorios.contasReceberPdf(query, request.user), "contas-a-receber.pdf");
  }

  @Get("servicos-contratados/pdf")
  async servicosContratados(@Req() request: RequestWithContext, @Res() response: Response) {
    return this.sendPdf(response, await this.relatorios.servicosContratadosPdf(request.user), "servicos-contratados.pdf");
  }

  @Get("fiscal-mei/pdf")
  async fiscalMei(@Query() query: Record<string, string | undefined>, @Req() request: RequestWithContext, @Res() response: Response) {
    return this.sendPdf(response, await this.relatorios.fiscalMeiPdf(query, request.user), "fiscal-mei.pdf");
  }

  @Get("auditoria/pdf")
  async auditoria(@Query() query: Record<string, string | undefined>, @Req() request: RequestWithContext, @Res() response: Response) {
    return this.sendPdf(response, await this.relatorios.auditoriaPdf(query, request.user), "auditoria.pdf");
  }

  private sendPdf(response: Response, buffer: Buffer, filename: string) {
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    response.send(buffer);
  }
}
