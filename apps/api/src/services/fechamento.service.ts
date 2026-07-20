import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

type Periodo = {
  ano: number;
  mes: number;
  inicio: Date;
  fim: Date;
  chave: string;
};

@Injectable()
export class FechamentoService {
  constructor(private readonly prisma: PrismaService) {}

  async resumo(mes?: string) {
    const periodo = this.periodo(mes);
    const empresaId = await this.getDefaultEmpresaId();

    const [lancamentos, contasPagar, contasReceber, obrigacoes, notas, servicos, chamados, tarefas, decisoes, fechamento] =
      await Promise.all([
        this.prisma.erpLancamentoFinanceiro.findMany({
          where: { empresaId, excluidoEm: null, dataCompetencia: { gte: periodo.inicio, lt: periodo.fim } },
          include: { categoria: true },
          orderBy: { dataCompetencia: "asc" },
        }),
        this.prisma.erpContaPagar.findMany({
          where: { empresaId, excluidoEm: null, dataVencimento: { gte: periodo.inicio, lt: periodo.fim } },
          include: { categoria: true, servicoContratado: true },
          orderBy: { dataVencimento: "asc" },
        }),
        this.prisma.erpContaReceber.findMany({
          where: { empresaId, excluidoEm: null, dataVencimento: { gte: periodo.inicio, lt: periodo.fim } },
          include: { categoria: true },
          orderBy: { dataVencimento: "asc" },
        }),
        this.prisma.erpObrigacaoFiscal.findMany({
          where: { empresaId, excluidoEm: null, dataVencimento: { gte: periodo.inicio, lt: periodo.fim } },
          orderBy: { dataVencimento: "asc" },
        }),
        this.prisma.erpNotaFiscal.findMany({
          where: { empresaId, excluidoEm: null, dataCompetencia: { gte: periodo.inicio, lt: periodo.fim } },
          orderBy: { dataEmissao: "asc" },
        }),
        this.prisma.erpServicoContratado.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { nome: "asc" } }),
        this.prisma.erpChamado.findMany({
          where: { excluidoEm: null, criadoEm: { lt: periodo.fim }, status: { notIn: ["resolvido", "cancelado"] } },
          orderBy: { prioridade: "desc" },
        }),
        this.prisma.erpTarefa.findMany({
          where: { excluidoEm: null, status: { notIn: ["CONCLUIDA", "CANCELADA"] }, OR: [{ dataLimite: null }, { dataLimite: { lt: periodo.fim } }] },
          orderBy: { dataLimite: "asc" },
        }),
        this.prisma.erpDecisao.findMany({
          where: { excluidoEm: null, dataDecisao: { gte: periodo.inicio, lt: periodo.fim } },
          orderBy: { dataDecisao: "asc" },
        }),
        this.prisma.erpFechamentoMensal.findUnique({ where: { empresaId_ano_mes: { empresaId, ano: periodo.ano, mes: periodo.mes } } }),
      ]);

    return this.montarResumo(periodo, empresaId, {
      lancamentos,
      contasPagar,
      contasReceber,
      obrigacoes,
      notas,
      servicos,
      chamados,
      tarefas,
      decisoes,
      fechamento,
    });
  }

  async fechar(mes: string, usuarioId?: number) {
    const resumo = await this.resumo(mes);
    if (resumo.fechamento?.status === "FECHADO") return resumo.fechamento;

    return this.prisma.erpFechamentoMensal.upsert({
      where: { empresaId_ano_mes: { empresaId: resumo.empresaId, ano: resumo.periodo.ano, mes: resumo.periodo.mes } },
      update: {
        ...this.fechamentoData(resumo),
        status: "FECHADO",
        fechadoPorId: usuarioId,
        fechadoEm: new Date(),
      },
      create: {
        empresaId: resumo.empresaId,
        ano: resumo.periodo.ano,
        mes: resumo.periodo.mes,
        ...this.fechamentoData(resumo),
        status: "FECHADO",
        fechadoPorId: usuarioId,
        fechadoEm: new Date(),
      },
    });
  }

  periodo(mes?: string): Periodo {
    const value = mes ?? new Date().toISOString().slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(value)) throw new BadRequestException("Mês inválido. Use YYYY-MM.");
    const [ano, month] = value.split("-").map(Number);
    if (month < 1 || month > 12) throw new BadRequestException("Mês inválido. Use YYYY-MM.");
    return {
      ano,
      mes: month,
      inicio: new Date(ano, month - 1, 1),
      fim: new Date(ano, month, 1),
      chave: value,
    };
  }

  private montarResumo(periodo: Periodo, empresaId: number, data: Record<string, any>) {
    const receitaTotal = data.lancamentos
      .filter((item: any) => item.tipo === "RECEITA")
      .reduce((sum: number, item: any) => sum + Number(item.valorLiquido), 0);
    const despesaTotal = data.lancamentos
      .filter((item: any) => item.tipo === "DESPESA")
      .reduce((sum: number, item: any) => sum + Number(item.valorLiquido), 0);
    const contasPagarAbertas = data.contasPagar.filter((item: any) => item.status === "PENDENTE" || item.status === "VENCIDO");
    const contasReceberAbertas = data.contasReceber.filter((item: any) => item.status === "PENDENTE" || item.status === "VENCIDO");
    const obrigacoesPendentes = data.obrigacoes.filter((item: any) => item.status === "PENDENTE" || item.status === "VENCIDO");
    const servicosPagos = data.contasPagar.filter((item: any) => item.servicoContratadoId && item.status === "PAGO");
    const servicosSemResponsavel = data.servicos.filter((item: any) => !item.responsavelInterno);
    const servicosCriticos = data.servicos.filter((item: any) => item.criticidade === "CRITICA");
    const tarefasPendentes = data.tarefas.slice(0, 10);

    return {
      empresaId,
      periodo,
      metrics: {
        receitaTotal,
        despesaTotal,
        resultado: receitaTotal - despesaTotal,
        contasPagarAbertas: contasPagarAbertas.length,
        contasReceberAbertas: contasReceberAbertas.length,
        obrigacoesPendentes: obrigacoesPendentes.length,
        notasEmitidas: data.notas.length,
        servicosPagos: servicosPagos.length,
        problemasAbertos: data.chamados.length,
        decisoesRegistradas: data.decisoes.length,
      },
      pendenciasProximoMes: {
        contasPagar: contasPagarAbertas,
        contasReceber: contasReceberAbertas,
        obrigacoes: obrigacoesPendentes,
        tarefas: tarefasPendentes,
        servicosSemResponsavel,
        servicosCriticos,
      },
      listas: data,
      fechamento: data.fechamento,
    };
  }

  private fechamentoData(resumo: any) {
    const jsonResumo = JSON.parse(JSON.stringify(resumo));
    return {
      receitaTotal: resumo.metrics.receitaTotal,
      despesaTotal: resumo.metrics.despesaTotal,
      resultado: resumo.metrics.resultado,
      contasPagarAbertas: resumo.metrics.contasPagarAbertas,
      contasReceberAbertas: resumo.metrics.contasReceberAbertas,
      obrigacoesPendentes: resumo.metrics.obrigacoesPendentes,
      notasEmitidas: resumo.metrics.notasEmitidas,
      servicosPagos: resumo.metrics.servicosPagos,
      problemasAbertos: resumo.metrics.problemasAbertos,
      decisoesRegistradas: resumo.metrics.decisoesRegistradas,
      pendenciasProximoMes: jsonResumo.pendenciasProximoMes,
      resumo: jsonResumo,
    };
  }

  private async getDefaultEmpresaId() {
    const empresa = await this.prisma.erpEmpresa.findFirst({ select: { id: true } });
    if (empresa) return empresa.id;
    const created = await this.prisma.erpEmpresa.create({
      data: { razaoSocial: "NossoZelo", nomeFantasia: "NossoZelo", tipoEmpresa: "MEI", regimeTributario: "SIMEI", status: "ativa" },
      select: { id: true },
    });
    return created.id;
  }
}
