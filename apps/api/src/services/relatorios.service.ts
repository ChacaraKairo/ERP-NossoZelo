import { Injectable } from "@nestjs/common";
import PDFDocument from "pdfkit";
import { PrismaService } from "./prisma.service";
import { FechamentoService } from "./fechamento.service";
import type { RequestUser } from "../common/types/request-user";

type Metric = { label: string; value: string };
type PdfTable = { title: string; columns: string[]; rows: unknown[][] };
type PdfInput = {
  title: string;
  period?: string;
  user?: RequestUser;
  filters?: Record<string, unknown>;
  metrics: Metric[];
  tables: PdfTable[];
  notes?: string[];
};

const page = {
  margin: 42,
  width: 595.28,
  height: 841.89,
  contentWidth: 511.28,
};

@Injectable()
export class RelatoriosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fechamento: FechamentoService,
  ) {}

  async fechamentoMensalPdf(mes?: string, user?: RequestUser) {
    const resumo = await this.fechamento.resumo(mes);
    return this.buildPdf({
      title: "Relatório de Fechamento Mensal",
      period: resumo.periodo.chave,
      user,
      filters: { mes: resumo.periodo.chave },
      metrics: [
        { label: "Receita total", value: money(resumo.metrics.receitaTotal) },
        { label: "Despesas totais", value: money(resumo.metrics.despesaTotal) },
        { label: "Resultado", value: money(resumo.metrics.resultado) },
        { label: "Obrigações pendentes", value: String(resumo.metrics.obrigacoesPendentes) },
        { label: "Notas emitidas", value: String(resumo.metrics.notasEmitidas) },
        { label: "Problemas abertos", value: String(resumo.metrics.problemasAbertos) },
      ],
      tables: [
        this.table("Contas a pagar do mês", ["Descrição", "Fornecedor", "Valor", "Vencimento", "Status"], resumo.listas.contasPagar, (row: any) => [
          row.descricao,
          row.fornecedor,
          money(row.valorPrevisto),
          dateBR(row.dataVencimento),
          row.status,
        ]),
        this.table("Contas a receber do mês", ["Descrição", "Origem", "Valor", "Vencimento", "Status"], resumo.listas.contasReceber, (row: any) => [
          row.descricao,
          row.origem,
          money(row.valorPrevisto),
          dateBR(row.dataVencimento),
          row.status,
        ]),
        this.table("Pendências para o próximo mês", ["Tipo", "Descrição", "Status"], [
          ...resumo.pendenciasProximoMes.contasPagar.map((item: any) => ({ tipo: "Conta a pagar", descricao: item.descricao, status: item.status })),
          ...resumo.pendenciasProximoMes.contasReceber.map((item: any) => ({ tipo: "Conta a receber", descricao: item.descricao, status: item.status })),
          ...resumo.pendenciasProximoMes.obrigacoes.map((item: any) => ({ tipo: "Fiscal", descricao: item.tipo, status: item.status })),
          ...resumo.pendenciasProximoMes.tarefas.map((item: any) => ({ tipo: "Tarefa", descricao: item.titulo, status: item.status })),
        ], (row) => [row.tipo, row.descricao, row.status]),
      ],
    });
  }

  async financeiroPdf(query: Record<string, string | undefined>, user?: RequestUser) {
    const range = dateRange(query);
    const lancamentos = await this.prisma.erpLancamentoFinanceiro.findMany({
      where: {
        excluidoEm: null,
        dataCompetencia: { gte: range.start, lt: range.end },
        ...(query.tipo ? { tipo: query.tipo } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.categoriaId ? { categoriaId: Number(query.categoriaId) } : {}),
      },
      include: { categoria: true },
      orderBy: { dataCompetencia: "asc" },
    });
    const receitas = lancamentos.filter((item) => item.tipo === "RECEITA").reduce((sum, item) => sum + Number(item.valorLiquido), 0);
    const despesas = lancamentos.filter((item) => item.tipo === "DESPESA").reduce((sum, item) => sum + Number(item.valorLiquido), 0);
    const pendente = lancamentos.filter((item) => item.status === "PENDENTE").reduce((sum, item) => sum + Number(item.valorLiquido), 0);
    const porCategoria = groupSum(lancamentos, (item) => `${item.tipo} · ${item.categoria?.nome ?? "Sem categoria"}`, "valorLiquido");

    return this.buildPdf({
      title: "Relatório Financeiro Mensal",
      period: range.label,
      user,
      filters: query,
      metrics: [
        { label: "Total recebido", value: money(receitas) },
        { label: "Total pago", value: money(despesas) },
        { label: "Total pendente", value: money(pendente) },
        { label: "Lucro/prejuízo", value: money(receitas - despesas) },
      ],
      tables: [
        { title: "Resumo por categoria", columns: ["Categoria", "Total"], rows: porCategoria.map((item) => [item.label, money(item.total)]) },
        this.table("Lançamentos do período", ["Data", "Tipo", "Categoria", "Descrição", "Valor líquido", "Status"], lancamentos, (row) => [
          dateBR(row.dataCompetencia),
          row.tipo,
          row.categoria?.nome,
          row.descricao,
          money(row.valorLiquido),
          row.status,
        ]),
      ],
    });
  }

  async contasPagarPdf(query: Record<string, string | undefined>, user?: RequestUser) {
    const range = dateRange(query);
    const rows = await this.prisma.erpContaPagar.findMany({
      where: { excluidoEm: null, dataVencimento: { gte: range.start, lt: range.end }, ...(query.status ? { status: query.status } : {}) },
      include: { categoria: true, servicoContratado: true, gastoFixo: true },
      orderBy: { dataVencimento: "asc" },
    });
    return this.buildPdf({
      title: "Relatório de Contas a Pagar",
      period: range.label,
      user,
      filters: query,
      metrics: [
        { label: "Total previsto", value: money(rows.reduce((sum, row) => sum + Number(row.valorPrevisto), 0)) },
        { label: "Total pago", value: money(rows.reduce((sum, row) => sum + Number(row.valorPago ?? 0), 0)) },
        { label: "Pendentes", value: String(rows.filter((row) => row.status === "PENDENTE").length) },
        { label: "Recorrentes", value: String(rows.filter((row) => row.recorrente).length) },
      ],
      tables: [
        this.table("Contas a pagar", ["Descrição", "Fornecedor", "Categoria", "Valor", "Vencimento", "Status", "Serviço"], rows, (row) => [
          row.descricao,
          row.fornecedor,
          row.categoria?.nome,
          money(row.valorPrevisto),
          dateBR(row.dataVencimento),
          row.status,
          row.servicoContratado?.nome ?? row.gastoFixo?.descricao ?? "-",
        ]),
      ],
    });
  }

  async contasReceberPdf(query: Record<string, string | undefined>, user?: RequestUser) {
    const range = dateRange(query);
    const rows = await this.prisma.erpContaReceber.findMany({
      where: { excluidoEm: null, dataVencimento: { gte: range.start, lt: range.end }, ...(query.status ? { status: query.status } : {}) },
      include: { categoria: true, cliente: true, prestador: true, assinatura: true },
      orderBy: { dataVencimento: "asc" },
    });
    return this.buildPdf({
      title: "Relatório de Contas a Receber",
      period: range.label,
      user,
      filters: query,
      metrics: [
        { label: "Total previsto", value: money(rows.reduce((sum, row) => sum + Number(row.valorPrevisto), 0)) },
        { label: "Total recebido", value: money(rows.reduce((sum, row) => sum + Number(row.valorRecebido ?? 0), 0)) },
        { label: "Taxas", value: money(rows.reduce((sum, row) => sum + Number(row.valorTaxas ?? 0), 0)) },
        { label: "Pendentes", value: String(rows.filter((row) => row.status === "PENDENTE").length) },
      ],
      tables: [
        this.table("Contas a receber", ["Descrição", "Origem", "Cliente/prestador", "Valor", "Vencimento", "Status"], rows, (row) => [
          row.descricao,
          row.origem,
          row.cliente?.nome ?? row.prestador?.nome ?? row.assinatura?.plano ?? "-",
          money(row.valorPrevisto),
          dateBR(row.dataVencimento),
          row.status,
        ]),
      ],
    });
  }

  async servicosContratadosPdf(user?: RequestUser) {
    const rows = await this.prisma.erpServicoContratado.findMany({ where: { excluidoEm: null }, orderBy: [{ criticidade: "desc" }, { nome: "asc" }] });
    return this.buildPdf({
      title: "Relatório de Serviços Contratados",
      period: "Todos os serviços ativos",
      user,
      metrics: [
        { label: "Serviços ativos", value: String(rows.filter((row) => row.status === "ativo").length) },
        { label: "Críticos", value: String(rows.filter((row) => row.criticidade === "CRITICA").length) },
        { label: "Custo mensal previsto", value: money(rows.reduce((sum, row) => sum + Number(row.valorEstimado ?? 0), 0)) },
        { label: "Com credenciais", value: String(rows.filter((row) => row.possuiCredenciais).length) },
      ],
      tables: [
        this.table("Serviços", ["Nome", "Fornecedor", "Categoria", "Criticidade", "Valor", "Renovação", "Responsável"], rows, (row) => [
          row.nome,
          row.fornecedor,
          row.categoria,
          row.criticidade,
          money(row.valorEstimado ?? 0),
          dateBR(row.dataRenovacao),
          row.responsavelInterno,
        ]),
      ],
    });
  }

  async fiscalMeiPdf(query: Record<string, string | undefined>, user?: RequestUser) {
    const range = dateRange(query);
    const [obrigacoes, notas] = await Promise.all([
      this.prisma.erpObrigacaoFiscal.findMany({ where: { excluidoEm: null, dataVencimento: { gte: range.start, lt: range.end } }, orderBy: { dataVencimento: "asc" } }),
      this.prisma.erpNotaFiscal.findMany({ where: { excluidoEm: null, dataCompetencia: { gte: range.start, lt: range.end } }, orderBy: { dataEmissao: "asc" } }),
    ]);
    return this.buildPdf({
      title: "Relatório Fiscal/MEI",
      period: range.label,
      user,
      filters: query,
      metrics: [
        { label: "Obrigações", value: String(obrigacoes.length) },
        { label: "Obrigações pendentes", value: String(obrigacoes.filter((row) => row.status === "PENDENTE").length) },
        { label: "Notas fiscais", value: String(notas.length) },
        { label: "Valor total das notas", value: money(notas.reduce((sum, row) => sum + Number(row.valorBruto), 0)) },
      ],
      tables: [
        this.table("Obrigações fiscais", ["Tipo", "Valor", "Vencimento", "Pagamento", "Status"], obrigacoes, (row) => [
          row.tipo,
          money(row.valor ?? 0),
          dateBR(row.dataVencimento),
          dateBR(row.dataPagamento),
          row.status,
        ]),
        this.table("Notas fiscais", ["Número", "Tomador", "Emissão", "Competência", "Valor", "Status"], notas, (row) => [
          row.numero,
          row.tomadorNome,
          dateBR(row.dataEmissao),
          dateBR(row.dataCompetencia),
          money(row.valorBruto),
          row.status,
        ]),
      ],
    });
  }

  async auditoriaPdf(query: Record<string, string | undefined>, user?: RequestUser) {
    const range = dateRange(query);
    const rows = await this.prisma.erpAuditoria.findMany({
      where: { criadoEm: { gte: range.start, lt: range.end }, ...(query.modulo ? { modulo: query.modulo } : {}) },
      include: { usuario: true },
      orderBy: { criadoEm: "desc" },
      take: 300,
    });
    return this.buildPdf({
      title: "Relatório de Auditoria",
      period: range.label,
      user,
      filters: query,
      metrics: [
        { label: "Eventos", value: String(rows.length) },
        { label: "Falhas", value: String(rows.filter((row) => row.resultado === "erro").length) },
        { label: "Avisos", value: String(rows.filter((row) => row.severidade === "WARN").length) },
        { label: "Usuários", value: String(new Set(rows.map((row) => row.usuarioId).filter(Boolean)).size) },
      ],
      tables: [
        this.table("Eventos auditados", ["Data/hora", "Usuário", "Ação", "Módulo", "Entidade", "Resultado", "IP"], rows, (row) => [
          dateTimeBR(row.criadoEm),
          row.usuario?.nome ?? "-",
          row.acao,
          row.modulo,
          `${row.entidadeTipo} #${row.entidadeId ?? "-"}`,
          row.resultado,
          row.ip,
        ]),
      ],
      notes: ["Dados anteriores e novos ficam preservados na auditoria do ERP e podem ser consultados na tela própria."],
    });
  }

  private table<T>(title: string, columns: string[], rows: T[], mapper: (row: T) => unknown[]): PdfTable {
    return { title, columns, rows: rows.map(mapper) };
  }

  private buildPdf(input: PdfInput) {
    return new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ size: "A4", margin: page.margin, bufferPages: true });
      const chunks: Buffer[] = [];
      const generatedAt = new Date();
      const reportId = createReportId(input.title, generatedAt);
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      this.header(doc, input, generatedAt, reportId);
      this.metrics(doc, input.metrics);
      this.filters(doc, input.filters);
      for (const table of input.tables) this.renderTable(doc, table);
      if (input.notes?.length) this.notes(doc, input.notes);
      this.footer(doc, generatedAt, reportId);
      doc.end();
    });
  }

  private header(doc: PDFKit.PDFDocument, input: PdfInput, generatedAt: Date, reportId: string) {
    doc.rect(0, 0, page.width, 108).fill("#10231f");
    doc.circle(66, 48, 20).fill("#d9f2df");
    doc.fillColor("#10231f").fontSize(14).font("Helvetica-Bold").text("NZ", 55, 41);
    doc.fillColor("#f7faf9").fontSize(22).font("Helvetica-Bold").text(input.title, 96, 34, { width: 390 });
    doc.fontSize(10).font("Helvetica").fillColor("#c9d9d3").text(`ERP NossoZelo · ${input.period ?? "Sem período"}`, 96, 64);
    doc.text(`Gerado em ${dateTimeBR(generatedAt)} por ${input.user?.nome ?? "usuário autenticado"}`, 96, 80);
    doc.fillColor("#17202a").font("Helvetica").fontSize(10);
    doc.y = 132;
    doc.text(`ID do relatório: ${reportId}`, page.margin, 116);
  }

  private metrics(doc: PDFKit.PDFDocument, metrics: Metric[]) {
    if (!metrics.length) return;
    const cardWidth = 162;
    const cardHeight = 58;
    let x = page.margin;
    let y = doc.y + 8;
    metrics.forEach((metric, index) => {
      if (index > 0 && index % 3 === 0) {
        x = page.margin;
        y += cardHeight + 10;
      }
      doc.roundedRect(x, y, cardWidth, cardHeight, 6).fillAndStroke("#eef4f1", "#c9d9d3");
      doc.fillColor("#64748b").fontSize(8).font("Helvetica-Bold").text(metric.label.toUpperCase(), x + 10, y + 10, { width: cardWidth - 20 });
      doc.fillColor("#0f4c43").fontSize(15).font("Helvetica-Bold").text(metric.value, x + 10, y + 29, { width: cardWidth - 20 });
      x += cardWidth + 12;
    });
    doc.y = y + cardHeight + 18;
  }

  private filters(doc: PDFKit.PDFDocument, filters?: Record<string, unknown>) {
    if (!filters || !Object.keys(filters).length) return;
    const text = Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => `${key}: ${value}`)
      .join(" · ");
    if (!text) return;
    doc.fillColor("#405165").fontSize(9).font("Helvetica").text(`Filtros usados: ${text}`, page.margin, doc.y, { width: page.contentWidth });
    doc.moveDown(1);
  }

  private renderTable(doc: PDFKit.PDFDocument, table: PdfTable) {
    this.ensureSpace(doc, 70);
    doc.fillColor("#17202a").fontSize(14).font("Helvetica-Bold").text(table.title, page.margin, doc.y);
    doc.moveDown(0.6);
    if (!table.rows.length) {
      doc.fillColor("#64748b").fontSize(10).font("Helvetica").text("Nenhum registro encontrado.", page.margin, doc.y);
      doc.moveDown(1.4);
      return;
    }
    const widths = widthsFor(table.columns.length);
    this.tableRow(doc, table.columns, widths, true);
    table.rows.slice(0, 80).forEach((row, index) => this.tableRow(doc, row.map(cell), widths, false, index % 2 === 0));
    if (table.rows.length > 80) {
      doc.fillColor("#64748b").fontSize(9).font("Helvetica").text(`Exibindo 80 de ${table.rows.length} registros.`, page.margin, doc.y + 4);
      doc.moveDown(1);
    }
    doc.moveDown(1.3);
  }

  private tableRow(doc: PDFKit.PDFDocument, values: unknown[], widths: number[], header = false, shaded = false) {
    const x = page.margin;
    const rowHeight = header ? 26 : 32;
    this.ensureSpace(doc, rowHeight + 12);
    const y = doc.y;
    doc.rect(x, y, page.contentWidth, rowHeight).fill(header ? "#166b5b" : shaded ? "#f6f7f9" : "#ffffff");
    doc.strokeColor("#d9e0e8").rect(x, y, page.contentWidth, rowHeight).stroke();
    let cursor = x;
    values.forEach((value, index) => {
      doc.fillColor(header ? "#ffffff" : "#17202a").fontSize(header ? 8 : 7.5).font(header ? "Helvetica-Bold" : "Helvetica");
      doc.text(String(value ?? "-"), cursor + 5, y + 7, { width: widths[index] - 10, height: rowHeight - 10, ellipsis: true });
      cursor += widths[index];
    });
    doc.y = y + rowHeight;
  }

  private notes(doc: PDFKit.PDFDocument, notes: string[]) {
    this.ensureSpace(doc, 70);
    doc.fillColor("#17202a").fontSize(13).font("Helvetica-Bold").text("Observações");
    doc.moveDown(0.4);
    notes.forEach((note) => doc.fillColor("#405165").fontSize(9).font("Helvetica").text(`• ${note}`, { width: page.contentWidth }));
  }

  private ensureSpace(doc: PDFKit.PDFDocument, height: number) {
    if (doc.y + height <= page.height - 70) return;
    this.footer(doc, new Date(), "");
    doc.addPage();
  }

  private footer(doc: PDFKit.PDFDocument, generatedAt: Date, reportId: string) {
    const pageNumber = doc.bufferedPageRange().count;
    doc.fillColor("#64748b").fontSize(8).font("Helvetica");
    doc.text("Documento gerado pelo ERP NossoZelo", page.margin, page.height - 44, { width: 220, lineBreak: false });
    doc.text(`Página ${pageNumber} · ${dateTimeBR(generatedAt)} ${reportId ? `· ${reportId}` : ""}`, page.width - page.margin - 260, page.height - 44, {
      width: 260,
      align: "right",
      lineBreak: false,
    });
  }
}

function dateRange(query: Record<string, string | undefined>) {
  if (query.inicio && query.fim) {
    const start = new Date(query.inicio);
    const end = new Date(query.fim);
    end.setDate(end.getDate() + 1);
    return { start, end, label: `${dateBR(start)} a ${dateBR(new Date(query.fim))}` };
  }
  const month = query.mes?.includes("-")
    ? query.mes
    : `${query.ano ?? new Date().getFullYear()}-${String(query.mes ?? query.mesNumero ?? new Date().getMonth() + 1).padStart(2, "0")}`;
  const [year, monthNumber] = month.split("-").map(Number);
  const start = new Date(year, monthNumber - 1, 1);
  const end = new Date(year, monthNumber, 1);
  return { start, end, label: month };
}

function widthsFor(columns: number) {
  const base = Math.floor(page.contentWidth / columns);
  return Array.from({ length: columns }, (_, index) => index === columns - 1 ? page.contentWidth - base * (columns - 1) : base);
}

function money(value: unknown) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value ?? 0));
}

function dateBR(value: Date | string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}

function dateTimeBR(value: Date | string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(value));
}

function cell(value: unknown) {
  const text = value instanceof Date ? dateBR(value) : String(value ?? "-");
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
}

function groupSum<T>(items: T[], label: (item: T) => string, field: keyof T) {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(label(item), (map.get(label(item)) ?? 0) + Number(item[field] ?? 0));
  }
  return [...map.entries()].map(([itemLabel, total]) => ({ label: itemLabel, total }));
}

function createReportId(title: string, date: Date) {
  return `${title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${date.getTime().toString(36)}`;
}
