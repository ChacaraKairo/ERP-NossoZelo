import { Body, Controller, Get, NotFoundException, Param, Post, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AuditService } from "../services/audit.service";
import { AuthService, sessionCookie } from "../services/auth.service";
import { ResourceService } from "../services/resource.service";

const writable = ["lancamentos", "contasPagar", "contasReceber", "servicos", "obrigacoes", "notas", "chamados", "tarefas"] as const;

@Controller("erp")
export class ErpController {
  constructor(
    private readonly resources: ResourceService,
    private readonly auth: AuthService,
    private readonly audit: AuditService,
  ) {}

  @Get(":resource")
  async list(@Param("resource") resource: string, @Req() request: Request) {
    await this.requireUser(request);
    return this.resources.list(resource as never);
  }

  @Get(":resource/:id")
  async get(@Param("resource") resource: string, @Param("id") id: string, @Req() request: Request) {
    await this.requireUser(request);
    return this.resources.get(resource as never, Number(id));
  }

  @Post(":resource")
  async create(@Param("resource") resource: string, @Body() body: unknown, @Req() request: Request) {
    const user = await this.requireUser(request);
    if (!writable.includes(resource as never)) throw new NotFoundException("Recurso inexistente");

    const row = await this.resources.create(resource as (typeof writable)[number], body);
    await this.audit.create({
      usuarioId: user.id,
      acao: "criar",
      entidadeTipo: resource,
      entidadeId: (row as { id?: number }).id,
      dadosNovos: row,
      ip: request.ip,
      userAgent: request.get("user-agent"),
    });
    return row;
  }

  private async requireUser(request: Request) {
    const user = await this.auth.getUserFromCookie(request.cookies?.[sessionCookie]);
    if (!user) throw new UnauthorizedException("Não autenticado");
    return user;
  }
}
