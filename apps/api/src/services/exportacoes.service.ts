import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class ExportacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async ultimoBackup() {
    return this.prisma.erpBackupRegistro.findFirst({ orderBy: { criadoEm: "desc" } });
  }

  async registrarBackup(geradoPorId?: number) {
    const empresaId = await this.getDefaultEmpresaId();
    return this.prisma.erpBackupRegistro.create({
      data: {
        empresaId,
        tipo: "manual",
        formato: "json_csv",
        descricao: "Backup manual registrado pelo ERP NossoZelo",
        geradoPorId,
      },
    });
  }

  async dadosJson() {
    const empresaId = await this.getDefaultEmpresaId();
    const [
      empresa,
      categorias,
      lancamentos,
      contasPagar,
      contasReceber,
      servicos,
      obrigacoes,
      notas,
      fornecedores,
      gastosFixos,
      chamados,
      tarefas,
      riscos,
      decisoes,
      fechamentos,
    ] = await Promise.all([
      this.prisma.erpEmpresa.findUnique({ where: { id: empresaId } }),
      this.prisma.erpCategoriaFinanceira.findMany({ orderBy: { nome: "asc" } }),
      this.prisma.erpLancamentoFinanceiro.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataCompetencia: "desc" } }),
      this.prisma.erpContaPagar.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataVencimento: "asc" } }),
      this.prisma.erpContaReceber.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataVencimento: "asc" } }),
      this.prisma.erpServicoContratado.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { nome: "asc" } }),
      this.prisma.erpObrigacaoFiscal.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataVencimento: "asc" } }),
      this.prisma.erpNotaFiscal.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataCompetencia: "desc" } }),
      this.prisma.erpFornecedor.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { nome: "asc" } }),
      this.prisma.erpGastoFixo.findMany({ where: { empresaId, excluidoEm: null }, orderBy: [{ ativo: "desc" }, { diaVencimento: "asc" }] }),
      this.prisma.erpChamado.findMany({ where: { excluidoEm: null }, orderBy: { dataAbertura: "desc" } }),
      this.prisma.erpTarefa.findMany({ where: { excluidoEm: null }, orderBy: { criadoEm: "desc" } }),
      this.prisma.erpRisco.findMany({ where: { excluidoEm: null }, orderBy: { atualizadoEm: "desc" } }),
      this.prisma.erpDecisao.findMany({ where: { excluidoEm: null }, orderBy: { dataDecisao: "desc" } }),
      this.prisma.erpFechamentoMensal.findMany({ where: { empresaId }, orderBy: [{ ano: "desc" }, { mes: "desc" }] }),
    ]);

    return {
      metadata: {
        sistema: "ERP NossoZelo",
        formato: "json",
        geradoEm: new Date().toISOString(),
      },
      empresa,
      categorias,
      lancamentos,
      contasPagar,
      contasReceber,
      servicos,
      obrigacoes,
      notas,
      fornecedores,
      gastosFixos,
      chamados,
      tarefas,
      riscos,
      decisoes,
      fechamentos,
    };
  }

  async financeiroCsv(mes?: string) {
    const empresaId = await this.getDefaultEmpresaId();
    const dateFilter = this.dateFilter(mes);
    const lancamentos = await this.prisma.erpLancamentoFinanceiro.findMany({
      where: { empresaId, excluidoEm: null, ...(dateFilter ? { dataCompetencia: dateFilter } : {}) },
      include: { categoria: true },
      orderBy: { dataCompetencia: "asc" },
    });

    return this.toCsv(
      ["id", "tipo", "categoria", "descricao", "valorBruto", "valorTaxas", "valorLiquido", "dataCompetencia", "status", "origem"],
      lancamentos.map((item: any) => [
        item.id,
        item.tipo,
        item.categoria?.nome,
        item.descricao,
        item.valorBruto,
        item.valorTaxas,
        item.valorLiquido,
        item.dataCompetencia,
        item.status,
        item.origem,
      ]),
    );
  }

  async contasPagarCsv() {
    const empresaId = await this.getDefaultEmpresaId();
    const contas = await this.prisma.erpContaPagar.findMany({
      where: { empresaId, excluidoEm: null },
      include: { categoria: true, servicoContratado: true },
      orderBy: { dataVencimento: "asc" },
    });

    return this.toCsv(
      ["id", "descricao", "fornecedor", "categoria", "servico", "valorPrevisto", "valorPago", "dataVencimento", "dataPagamento", "status"],
      contas.map((item: any) => [
        item.id,
        item.descricao,
        item.fornecedor,
        item.categoria?.nome,
        item.servicoContratado?.nome,
        item.valorPrevisto,
        item.valorPago,
        item.dataVencimento,
        item.dataPagamento,
        item.status,
      ]),
    );
  }

  private toCsv(headers: string[], rows: unknown[][]) {
    const lines = [headers, ...rows].map((row) => row.map((value) => this.csvCell(value)).join(","));
    return `${lines.join("\n")}\n`;
  }

  private csvCell(value: unknown) {
    if (value === null || value === undefined) return "";
    const normalized = value instanceof Date ? value.toISOString() : String(value);
    return `"${normalized.replaceAll('"', '""')}"`;
  }

  private dateFilter(mes?: string) {
    if (!mes) return null;
    const [year, month] = mes.split("-").map(Number);
    if (!year || !month) return null;
    return { gte: new Date(year, month - 1, 1), lt: new Date(year, month, 1) };
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
