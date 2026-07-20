import { Controller, Get, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AuthService, sessionCookie } from "../services/auth.service";
import { PrismaService } from "../services/prisma.service";

@Controller("dashboard")
export class DashboardController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  @Get()
  async dashboard(@Req() request: Request) {
    const user = await this.auth.getUserFromCookie(request.cookies?.[sessionCookie]);
    if (!user) throw new UnauthorizedException("Não autenticado");

    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const [lancamentos, contasPagar, contasReceber, servicos, obrigacoes, chamados, tarefas, assinaturas, notas] =
      await Promise.all([
        this.prisma.erpLancamentoFinanceiro.findMany({ where: { excluidoEm: null, dataCompetencia: { gte: start } }, include: { categoria: true } }),
        this.prisma.erpContaPagar.findMany({ include: { categoria: true, servicoContratado: true }, orderBy: { dataVencimento: "asc" }, take: 5 }),
        this.prisma.erpContaReceber.findMany({ include: { categoria: true }, orderBy: { dataVencimento: "asc" }, take: 5 }),
        this.prisma.erpServicoContratado.findMany({ where: { excluidoEm: null }, orderBy: { id: "desc" } }),
        this.prisma.erpObrigacaoFiscal.findMany({ orderBy: { dataVencimento: "asc" }, take: 5 }),
        this.prisma.erpChamado.findMany({ where: { status: { notIn: ["resolvido", "cancelado"] } }, orderBy: { dataAbertura: "desc" }, take: 5 }),
        this.prisma.erpTarefa.findMany({ where: { status: { notIn: ["CONCLUIDA", "CANCELADA"] } }, orderBy: { dataLimite: "asc" }, take: 5 }),
        this.prisma.marketplaceAssinatura.findMany(),
        this.prisma.erpNotaFiscal.findMany(),
      ]);

    const receita = lancamentos.filter((item) => item.tipo === "RECEITA").reduce((sum, item) => sum + Number(item.valorLiquido), 0);
    const despesas = lancamentos.filter((item) => item.tipo === "DESPESA").reduce((sum, item) => sum + Number(item.valorLiquido), 0);

    return {
      metrics: {
        receita,
        despesas,
        resultado: receita - despesas,
        assinaturasAtivas: assinaturas.filter((item) => item.status === "ativa").length,
        servicosCriticos: servicos.filter((item) => item.criticidade === "CRITICA").length,
        obrigacoesPendentes: obrigacoes.filter((item) => item.status === "PENDENTE").length,
        chamadosAbertos: chamados.length,
        tarefasAbertas: tarefas.length,
        faturamentoNotas: notas.reduce((sum, nota) => sum + Number(nota.valorBruto), 0),
      },
      lists: { contasPagar, contasReceber, servicos, obrigacoes, chamados, tarefas, assinaturas },
    };
  }
}
