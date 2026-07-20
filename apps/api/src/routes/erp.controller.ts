import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { AuditService } from "../services/audit.service";
import { ResourceService } from "../services/resource.service";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import type { RequestWithContext } from "../common/types/request-user";

const writable = ["lancamentos", "contasPagar", "contasReceber", "servicos", "obrigacoes", "notas", "chamados", "tarefas", "fornecedores", "riscos", "decisoes", "baseConhecimento", "categorias"] as const;
const permissionByResource: Record<string, string> = {
  lancamentos: "financeiro",
  categorias: "financeiro",
  contasPagar: "contas_pagar",
  contasReceber: "contas_receber",
  servicos: "servicos",
  fornecedores: "fornecedores",
  obrigacoes: "fiscal",
  notas: "fiscal",
  chamados: "suporte",
  tarefas: "tarefas",
  riscos: "riscos",
  decisoes: "configuracoes",
  baseConhecimento: "configuracoes",
  auditoria: "auditoria",
  usuarios: "usuarios",
  empresas: "configuracoes",
  clientes: "marketplace",
  prestadores: "marketplace",
  assinaturas: "marketplace",
};

@Controller("erp")
export class ErpController {
  constructor(
    private readonly resources: ResourceService,
    private readonly audit: AuditService,
  ) {}

  @Get(":resource")
  async list(@Param("resource") resource: string, @Query() query: Record<string, string | undefined>, @Req() request: RequestWithContext) {
    this.ensurePermission(request, resource, "read");
    return this.resources.list(resource as never, query);
  }

  @Get(":resource/:id")
  async get(@Param("resource") resource: string, @Param("id") id: string, @Req() request: RequestWithContext) {
    this.ensurePermission(request, resource, "read");
    return this.resources.get(resource as never, Number(id));
  }

  @Post(":resource")
  async create(@Param("resource") resource: string, @Body() body: unknown, @Req() request: RequestWithContext) {
    if (!writable.includes(resource as never)) throw new NotFoundException("Recurso inexistente");
    this.ensurePermission(request, resource, "create");

    const row = await this.resources.create(resource as (typeof writable)[number], body);
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "criar",
      modulo: this.moduleFor(resource),
      entidadeTipo: resource,
      entidadeId: (row as { id?: number }).id,
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

  @Patch(":resource/:id")
  async update(@Param("resource") resource: string, @Param("id") id: string, @Body() body: unknown, @Req() request: RequestWithContext) {
    if (!writable.includes(resource as never)) throw new NotFoundException("Recurso inexistente");
    this.ensurePermission(request, resource, "update");
    const result = await this.resources.update(resource as (typeof writable)[number], Number(id), body);
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "editar",
      modulo: this.moduleFor(resource),
      entidadeTipo: resource,
      entidadeId: Number(id),
      metodoHttp: request.method,
      rota: request.path,
      dadosAnteriores: result.previous,
      dadosNovos: result.current,
      requestId: request.requestId,
      sessionId: request.session?.id,
      deviceId: request.session?.deviceId,
      severidade: resource === "servicos" && (result.previous as { criticidade?: string }).criticidade === "CRITICA" ? "HIGH" : "INFO",
      ip: request.ip,
      userAgent: request.get("user-agent"),
    });
    return result.current;
  }

  @Delete(":resource/:id")
  async remove(@Param("resource") resource: string, @Param("id") id: string, @Req() request: RequestWithContext) {
    if (!writable.includes(resource as never)) throw new NotFoundException("Recurso inexistente");
    this.ensurePermission(request, resource, "delete");
    const result = await this.resources.softDelete(resource as (typeof writable)[number], Number(id));
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "excluir_logicamente",
      modulo: this.moduleFor(resource),
      entidadeTipo: resource,
      entidadeId: Number(id),
      metodoHttp: request.method,
      rota: request.path,
      dadosAnteriores: result.previous,
      dadosNovos: result.current,
      requestId: request.requestId,
      sessionId: request.session?.id,
      deviceId: request.session?.deviceId,
      severidade: "WARN",
      ip: request.ip,
      userAgent: request.get("user-agent"),
    });
    return result.current;
  }

  @Post("contasPagar/:id/pay")
  @RequirePermission("contas_pagar:pay")
  async payContaPagar(@Param("id") id: string, @Body() body: { valorPago?: number; formaPagamento?: string }, @Req() request: RequestWithContext) {
    const result = await this.resources.payContaPagar(Number(id), body);
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "marcar_conta_paga",
      modulo: "contas_pagar",
      entidadeTipo: "contasPagar",
      entidadeId: Number(id),
      metodoHttp: request.method,
      rota: request.path,
      dadosAnteriores: result.previous,
      dadosNovos: result.current,
      requestId: request.requestId,
      sessionId: request.session?.id,
      ip: request.ip,
      userAgent: request.get("user-agent"),
    });
    return result.current;
  }

  @Post("contasReceber/:id/receive")
  @RequirePermission("contas_receber:receive")
  async receiveContaReceber(@Param("id") id: string, @Body() body: { valorRecebido?: number; valorTaxas?: number; formaPagamento?: string }, @Req() request: RequestWithContext) {
    const result = await this.resources.receiveContaReceber(Number(id), body);
    await this.audit.create({
      usuarioId: request.user?.id,
      acao: "marcar_conta_recebida",
      modulo: "contas_receber",
      entidadeTipo: "contasReceber",
      entidadeId: Number(id),
      metodoHttp: request.method,
      rota: request.path,
      dadosAnteriores: result.previous,
      dadosNovos: result.current,
      requestId: request.requestId,
      sessionId: request.session?.id,
      ip: request.ip,
      userAgent: request.get("user-agent"),
    });
    return result.current;
  }

  private ensurePermission(request: RequestWithContext, resource: string, action: string) {
    const moduleName = this.moduleFor(resource);
    const permission = `${moduleName}:${action}`;
    const role = request.user?.perfil;
    const allowed = role === "FUNDADOR" || role === "ADMIN";
    if (allowed) return;
    const rolePermissions = {
      FINANCEIRO: ["financeiro", "contas_pagar", "contas_receber", "fiscal"],
      OPERACAO: ["marketplace", "suporte", "tarefas", "riscos"],
      SUPORTE: ["suporte", "tarefas"],
      LEITURA: [],
    } as Record<string, string[]>;
    if (role && rolePermissions[role]?.includes(moduleName) && action === "read") return;
    if (role && rolePermissions[role]?.includes(moduleName) && ["create", "update"].includes(action)) return;
    throw new ForbiddenException(`Sem permissão para ${permission}`);
  }

  private moduleFor(resource: string) {
    return permissionByResource[resource] ?? resource;
  }
}
