import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { z } from "zod";
import { PrismaService } from "./prisma.service";

const dateField = z.string().min(1).transform((value) => new Date(value));
const optionalDateField = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? new Date(value) : undefined));
const decimalField = z.coerce.number().default(0);
const positiveDecimalField = z.coerce.number().positive("Valor deve ser maior que zero");
const optionalDecimalField = z
  .union([z.coerce.number(), z.literal("")])
  .optional()
  .transform((value) => (value === "" || value === undefined ? undefined : value));

const schemas = {
  lancamentos: z.object({
    tipo: z.enum(["RECEITA", "DESPESA"]),
    categoriaId: z.coerce.number(),
    descricao: z.string().min(3),
    valorBruto: positiveDecimalField,
    valorTaxas: decimalField,
    valorLiquido: positiveDecimalField,
    moeda: z.string().default("BRL"),
    dataCompetencia: dateField,
    dataVencimento: optionalDateField,
    dataPagamento: optionalDateField,
    status: z.enum(["PENDENTE", "PAGO", "RECEBIDO", "VENCIDO", "CANCELADO"]),
    formaPagamento: z.string().optional(),
    origem: z.string().default("manual"),
    observacoes: z.string().optional(),
  }),
  contasPagar: z.object({
    categoriaId: z.coerce.number(),
    servicoContratadoId: z.coerce.number().optional(),
    gastoFixoId: z.coerce.number().optional(),
    descricao: z.string().min(3),
    fornecedor: z.string().optional(),
    valorPrevisto: positiveDecimalField,
    valorPago: optionalDecimalField,
    moeda: z.string().default("BRL"),
    dataVencimento: dateField,
    dataPagamento: optionalDateField,
    recorrente: z.coerce.boolean().default(false),
    periodicidade: z.string().optional(),
    status: z.enum(["PENDENTE", "PAGO", "RECEBIDO", "VENCIDO", "CANCELADO"]),
    formaPagamento: z.string().optional(),
    observacoes: z.string().optional(),
  }),
  gastosFixos: z.object({
    categoriaId: z.coerce.number(),
    descricao: z.string().min(3),
    fornecedor: z.string().optional(),
    valorPrevisto: positiveDecimalField,
    moeda: z.string().default("BRL"),
    diaVencimento: z.coerce.number().int().min(1).max(31),
    obrigatorio: z.coerce.boolean().default(true),
    ativo: z.coerce.boolean().default(true),
    formaPagamento: z.string().optional(),
    observacoes: z.string().optional(),
  }),
  contasReceber: z.object({
    categoriaId: z.coerce.number(),
    clienteId: z.coerce.number().optional(),
    prestadorId: z.coerce.number().optional(),
    assinaturaId: z.coerce.number().optional(),
    descricao: z.string().min(3),
    origem: z.string().default("manual"),
    valorPrevisto: positiveDecimalField,
    valorRecebido: optionalDecimalField,
    valorTaxas: decimalField,
    valorLiquido: optionalDecimalField,
    dataVencimento: dateField,
    dataRecebimento: optionalDateField,
    status: z.enum(["PENDENTE", "PAGO", "RECEBIDO", "VENCIDO", "CANCELADO"]),
    formaPagamento: z.string().optional(),
    gateway: z.string().optional(),
    gatewayReferencia: z.string().optional(),
    observacoes: z.string().optional(),
  }),
  servicos: z.object({
    nome: z.string().min(2),
    fornecedor: z.string().min(2),
    categoria: z.string().min(2),
    descricao: z.string().optional(),
    ambiente: z.string().default("producao"),
    criticidade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]),
    status: z.string().default("ativo"),
    urlPainel: z.string().optional(),
    urlSuporte: z.string().optional(),
    plano: z.string().optional(),
    moeda: z.string().default("BRL"),
    valorEstimado: optionalDecimalField,
    valorUltimaCobranca: optionalDecimalField,
    periodicidade: z.string().optional(),
    dataInicio: optionalDateField,
    dataRenovacao: optionalDateField,
    metodoPagamento: z.string().optional(),
    responsavelInterno: z.string().optional(),
    possuiCredenciais: z.coerce.boolean().default(false),
    localCredenciais: z.string().optional(),
    ultimaRotacaoCredenciais: optionalDateField,
    observacoes: z.string().optional(),
  }),
  obrigacoes: z.object({
    tipo: z.string().min(2),
    ano: z.coerce.number(),
    mes: z.coerce.number().optional(),
    descricao: z.string().optional(),
    valor: optionalDecimalField,
    dataVencimento: dateField,
    dataPagamento: optionalDateField,
    status: z.enum(["PENDENTE", "PAGO", "RECEBIDO", "VENCIDO", "CANCELADO"]),
    observacoes: z.string().optional(),
  }),
  notas: z.object({
    numero: z.string().min(1),
    serie: z.string().optional(),
    dataEmissao: dateField,
    dataCompetencia: dateField,
    tomadorNome: z.string().min(2),
    tomadorDocumento: z.string().optional(),
    descricaoServico: z.string().min(3),
    valorBruto: positiveDecimalField,
    status: z.string().default("emitida"),
    linkExterno: z.string().optional(),
    observacoes: z.string().optional(),
  }),
  chamados: z.object({
    titulo: z.string().min(3),
    descricao: z.string().min(3),
    tipo: z.string().min(2),
    prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]),
    status: z.string().default("aberto"),
    modulo: z.string().optional(),
    solucao: z.string().optional(),
  }),
  tarefas: z.object({
    titulo: z.string().min(3),
    descricao: z.string().optional(),
    tipo: z.string().min(2),
    prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]),
    status: z.enum(["PENDENTE", "EM_ANDAMENTO", "AGUARDANDO", "CONCLUIDA", "CANCELADA"]),
    modulo: z.string().optional(),
    dataLimite: optionalDateField,
    origem: z.string().optional(),
  }),
  fornecedores: z.object({
    nome: z.string().min(2),
    documento: z.string().optional(),
    email: z.string().email().optional(),
    telefone: z.string().optional(),
    categoria: z.string().optional(),
    status: z.string().default("ativo"),
    observacoes: z.string().optional(),
  }),
  riscos: z.object({
    titulo: z.string().min(3),
    descricao: z.string().optional(),
    modulo: z.string().optional(),
    probabilidade: z.string().default("MEDIA"),
    impacto: z.string().default("MEDIA"),
    severidade: z.string().default("MEDIA"),
    status: z.string().default("aberto"),
    responsavel: z.string().optional(),
    mitigacao: z.string().optional(),
    dataLimite: optionalDateField,
  }),
  decisoes: z.object({
    titulo: z.string().min(3),
    contexto: z.string().optional(),
    decisao: z.string().min(3),
    modulo: z.string().optional(),
    responsavel: z.string().optional(),
    dataDecisao: optionalDateField,
    consequencias: z.string().optional(),
  }),
  baseConhecimento: z.object({
    titulo: z.string().min(3),
    conteudo: z.string().min(3),
    categoria: z.string().optional(),
    tags: z.string().optional(),
    status: z.string().default("publicado"),
    criadoPor: z.coerce.number().optional(),
  }),
  categorias: z.object({
    nome: z.string().min(2),
    tipo: z.enum(["RECEITA", "DESPESA", "AMBOS"]),
    descricao: z.string().optional(),
    ativo: z.coerce.boolean().default(true),
  }),
} as const;

type ResourceName = keyof typeof schemas | "clientes" | "prestadores" | "assinaturas" | "auditoria" | "usuarios" | "empresas";
type QueryFilters = Record<string, string | undefined>;

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService) {}

  async list(resource: ResourceName, filters: QueryFilters = {}) {
    const dateFilter = this.dateFilter(filters);
    switch (resource) {
      case "lancamentos":
        return this.prisma.erpLancamentoFinanceiro.findMany({
          where: {
            excluidoEm: null,
            ...(filters.status ? { status: filters.status } : {}),
            ...(filters.tipo ? { tipo: filters.tipo } : {}),
            ...(filters.categoriaId ? { categoriaId: Number(filters.categoriaId) } : {}),
            ...(dateFilter ? { dataCompetencia: dateFilter } : {}),
          },
          include: { categoria: true },
          orderBy: { dataCompetencia: "desc" },
        });
      case "contasPagar":
        return this.prisma.erpContaPagar.findMany({
          where: { excluidoEm: null, ...(filters.status ? { status: filters.status } : {}), ...(filters.categoriaId ? { categoriaId: Number(filters.categoriaId) } : {}) },
          include: { categoria: true, servicoContratado: true, gastoFixo: true },
          orderBy: { dataVencimento: "asc" },
        });
      case "gastosFixos":
        return this.prisma.erpGastoFixo.findMany({
          where: { excluidoEm: null, ...(filters.ativo ? { ativo: filters.ativo === "true" } : {}) },
          include: { categoria: true },
          orderBy: [{ ativo: "desc" }, { diaVencimento: "asc" }, { descricao: "asc" }],
        });
      case "contasReceber":
        return this.prisma.erpContaReceber.findMany({
          where: { excluidoEm: null, ...(filters.status ? { status: filters.status } : {}), ...(filters.categoriaId ? { categoriaId: Number(filters.categoriaId) } : {}) },
          include: { categoria: true, cliente: true, prestador: true, assinatura: true },
          orderBy: { dataVencimento: "asc" },
        });
      case "servicos":
        return this.prisma.erpServicoContratado.findMany({ where: { excluidoEm: null }, orderBy: { nome: "asc" } });
      case "obrigacoes":
        return this.prisma.erpObrigacaoFiscal.findMany({ where: { excluidoEm: null }, orderBy: { dataVencimento: "asc" } });
      case "notas":
        return this.prisma.erpNotaFiscal.findMany({ where: { excluidoEm: null }, orderBy: { dataEmissao: "desc" } });
      case "chamados":
        return this.prisma.erpChamado.findMany({ where: { excluidoEm: null }, orderBy: { dataAbertura: "desc" } });
      case "tarefas":
        return this.prisma.erpTarefa.findMany({ where: { excluidoEm: null }, orderBy: { dataLimite: "asc" } });
      case "fornecedores":
        return this.prisma.erpFornecedor.findMany({ where: { excluidoEm: null }, orderBy: { nome: "asc" } });
      case "riscos":
        return this.prisma.erpRisco.findMany({ where: { excluidoEm: null }, orderBy: { atualizadoEm: "desc" } });
      case "decisoes":
        return this.prisma.erpDecisao.findMany({ where: { excluidoEm: null }, orderBy: { dataDecisao: "desc" } });
      case "baseConhecimento":
        return this.prisma.erpBaseConhecimento.findMany({ where: { excluidoEm: null }, orderBy: { atualizadoEm: "desc" } });
      case "categorias":
        return this.prisma.erpCategoriaFinanceira.findMany({ orderBy: { nome: "asc" } });
      case "clientes":
        return this.prisma.marketplaceCliente.findMany({ orderBy: { nome: "asc" } });
      case "prestadores":
        return this.prisma.marketplacePrestador.findMany({ orderBy: { nome: "asc" } });
      case "assinaturas":
        return this.prisma.marketplaceAssinatura.findMany({ include: { prestador: true }, orderBy: { vencimento: "asc" } });
      case "auditoria":
        return this.prisma.erpAuditoria.findMany({ include: { usuario: true }, orderBy: { criadoEm: "desc" }, take: 200 });
      case "usuarios":
        return this.prisma.erpUsuarioInterno.findMany({ orderBy: { nome: "asc" } });
      case "empresas":
        return this.prisma.erpEmpresa.findMany({ orderBy: { id: "asc" } });
      default:
        throw new NotFoundException("Recurso inexistente");
    }
  }

  async get(resource: ResourceName, id: number) {
    switch (resource) {
      case "servicos":
        return this.prisma.erpServicoContratado.findUnique({ where: { id }, include: { contasPagar: true } });
      case "chamados":
        return this.prisma.erpChamado.findUnique({ where: { id }, include: { interacoes: true } });
      case "lancamentos":
        return this.prisma.erpLancamentoFinanceiro.findUnique({ where: { id }, include: { categoria: true } });
      case "contasPagar":
        return this.prisma.erpContaPagar.findUnique({ where: { id }, include: { categoria: true, servicoContratado: true, gastoFixo: true } });
      case "gastosFixos":
        return this.prisma.erpGastoFixo.findUnique({ where: { id }, include: { categoria: true } });
      case "contasReceber":
        return this.prisma.erpContaReceber.findUnique({ where: { id }, include: { categoria: true, cliente: true, prestador: true, assinatura: true } });
      case "obrigacoes":
        return this.prisma.erpObrigacaoFiscal.findUnique({ where: { id } });
      case "notas":
        return this.prisma.erpNotaFiscal.findUnique({ where: { id } });
      case "tarefas":
        return this.prisma.erpTarefa.findUnique({ where: { id } });
      case "fornecedores":
        return this.prisma.erpFornecedor.findUnique({ where: { id } });
      case "riscos":
        return this.prisma.erpRisco.findUnique({ where: { id } });
      case "decisoes":
        return this.prisma.erpDecisao.findUnique({ where: { id } });
      case "baseConhecimento":
        return this.prisma.erpBaseConhecimento.findUnique({ where: { id } });
      case "categorias":
        return this.prisma.erpCategoriaFinanceira.findUnique({ where: { id } });
      default:
        throw new NotFoundException("Detalhe não implementado para este recurso");
    }
  }

  async create(resource: keyof typeof schemas, body: unknown) {
    const parsed = schemas[resource].safeParse(this.normalize(body));
    if (!parsed.success) {
      throw new BadRequestException({ message: "Dados inválidos", issues: parsed.error.flatten() });
    }

    const empresaId = await this.getDefaultEmpresaId();
    const data = parsed.data as Record<string, unknown>;
    switch (resource) {
      case "lancamentos":
        return this.prisma.erpLancamentoFinanceiro.create({ data: { empresaId, ...data } as never });
      case "contasPagar":
        return this.prisma.erpContaPagar.create({ data: { empresaId, ...data } as never });
      case "gastosFixos":
        return this.prisma.erpGastoFixo.create({ data: { empresaId, ...data } as never });
      case "contasReceber":
        return this.prisma.erpContaReceber.create({ data: { empresaId, ...data } as never });
      case "servicos":
        return this.prisma.erpServicoContratado.create({ data: { empresaId, ...data } as never });
      case "obrigacoes":
        return this.prisma.erpObrigacaoFiscal.create({ data: { empresaId, ...data } as never });
      case "notas":
        return this.prisma.erpNotaFiscal.create({ data: { empresaId, ...data } as never });
      case "chamados":
        return this.prisma.erpChamado.create({ data: data as never });
      case "tarefas":
        return this.prisma.erpTarefa.create({ data: data as never });
      case "fornecedores":
        return this.prisma.erpFornecedor.create({ data: { empresaId, ...data } as never });
      case "riscos":
        return this.prisma.erpRisco.create({ data: data as never });
      case "decisoes":
        return this.prisma.erpDecisao.create({ data: data as never });
      case "baseConhecimento":
        return this.prisma.erpBaseConhecimento.create({ data: data as never });
      case "categorias":
        return this.prisma.erpCategoriaFinanceira.create({ data: data as never });
      default:
        throw new NotFoundException("Recurso inexistente");
    }
  }

  async update(resource: keyof typeof schemas, id: number, body: unknown) {
    const previous = await this.get(resource, id);
    if (!previous) throw new NotFoundException("Registro inexistente");
    const parsed = schemas[resource].partial().safeParse(this.normalize(body));
    if (!parsed.success) throw new BadRequestException({ message: "Dados inválidos", issues: parsed.error.flatten() });
    const data = parsed.data as Record<string, unknown>;

    switch (resource) {
      case "lancamentos":
        return { previous, current: await this.prisma.erpLancamentoFinanceiro.update({ where: { id }, data: data as never }) };
      case "contasPagar":
        return { previous, current: await this.prisma.erpContaPagar.update({ where: { id }, data: data as never }) };
      case "gastosFixos":
        return { previous, current: await this.prisma.erpGastoFixo.update({ where: { id }, data: data as never }) };
      case "contasReceber":
        return { previous, current: await this.prisma.erpContaReceber.update({ where: { id }, data: data as never }) };
      case "servicos":
        return { previous, current: await this.prisma.erpServicoContratado.update({ where: { id }, data: data as never }) };
      case "obrigacoes":
        return { previous, current: await this.prisma.erpObrigacaoFiscal.update({ where: { id }, data: data as never }) };
      case "notas":
        return { previous, current: await this.prisma.erpNotaFiscal.update({ where: { id }, data: data as never }) };
      case "chamados":
        return { previous, current: await this.prisma.erpChamado.update({ where: { id }, data: data as never }) };
      case "tarefas":
        return { previous, current: await this.prisma.erpTarefa.update({ where: { id }, data: data as never }) };
      case "fornecedores":
        return { previous, current: await this.prisma.erpFornecedor.update({ where: { id }, data: data as never }) };
      case "riscos":
        return { previous, current: await this.prisma.erpRisco.update({ where: { id }, data: data as never }) };
      case "decisoes":
        return { previous, current: await this.prisma.erpDecisao.update({ where: { id }, data: data as never }) };
      case "baseConhecimento":
        return { previous, current: await this.prisma.erpBaseConhecimento.update({ where: { id }, data: data as never }) };
      case "categorias":
        return { previous, current: await this.prisma.erpCategoriaFinanceira.update({ where: { id }, data: data as never }) };
      default:
        throw new NotFoundException("Recurso inexistente");
    }
  }

  async softDelete(resource: keyof typeof schemas, id: number) {
    const previous = await this.get(resource, id);
    if (!previous) throw new NotFoundException("Registro inexistente");
    const data = { excluidoEm: new Date() };
    switch (resource) {
      case "lancamentos":
        return { previous, current: await this.prisma.erpLancamentoFinanceiro.update({ where: { id }, data }) };
      case "contasPagar":
        return { previous, current: await this.prisma.erpContaPagar.update({ where: { id }, data }) };
      case "gastosFixos":
        return { previous, current: await this.prisma.erpGastoFixo.update({ where: { id }, data }) };
      case "contasReceber":
        return { previous, current: await this.prisma.erpContaReceber.update({ where: { id }, data }) };
      case "servicos":
        return { previous, current: await this.prisma.erpServicoContratado.update({ where: { id }, data }) };
      case "obrigacoes":
        return { previous, current: await this.prisma.erpObrigacaoFiscal.update({ where: { id }, data }) };
      case "notas":
        return { previous, current: await this.prisma.erpNotaFiscal.update({ where: { id }, data }) };
      case "chamados":
        return { previous, current: await this.prisma.erpChamado.update({ where: { id }, data }) };
      case "tarefas":
        return { previous, current: await this.prisma.erpTarefa.update({ where: { id }, data }) };
      case "fornecedores":
        return { previous, current: await this.prisma.erpFornecedor.update({ where: { id }, data }) };
      case "riscos":
        return { previous, current: await this.prisma.erpRisco.update({ where: { id }, data }) };
      case "decisoes":
        return { previous, current: await this.prisma.erpDecisao.update({ where: { id }, data }) };
      case "baseConhecimento":
        return { previous, current: await this.prisma.erpBaseConhecimento.update({ where: { id }, data }) };
      default:
        throw new BadRequestException("Este recurso não suporta exclusão lógica");
    }
  }

  async payContaPagar(id: number, body: { valorPago?: number; formaPagamento?: string }) {
    const previous = await this.prisma.erpContaPagar.findUnique({ where: { id }, include: { categoria: true } });
    if (!previous) throw new NotFoundException("Conta a pagar inexistente");
    const valorPago = Number(body.valorPago ?? previous.valorPrevisto);
    if (valorPago <= 0) throw new BadRequestException("Valor pago deve ser maior que zero");
    const current = await this.prisma.erpContaPagar.update({
      where: { id },
      data: { valorPago, dataPagamento: new Date(), status: "PAGO", formaPagamento: body.formaPagamento ?? previous.formaPagamento },
    });
    await this.prisma.erpLancamentoFinanceiro.create({
      data: {
        empresaId: previous.empresaId,
        tipo: "DESPESA",
        categoriaId: previous.categoriaId,
        descricao: `Pagamento: ${previous.descricao}`,
        valorBruto: valorPago,
        valorTaxas: 0,
        valorLiquido: valorPago,
        dataCompetencia: new Date(),
        dataPagamento: new Date(),
        status: "PAGO",
        formaPagamento: body.formaPagamento ?? previous.formaPagamento,
        origem: "conta_a_pagar",
        referenciaTipo: "conta_a_pagar",
        referenciaId: id,
      },
    });
    return { previous, current };
  }

  async receiveContaReceber(id: number, body: { valorRecebido?: number; valorTaxas?: number; formaPagamento?: string }) {
    const previous = await this.prisma.erpContaReceber.findUnique({ where: { id }, include: { categoria: true } });
    if (!previous) throw new NotFoundException("Conta a receber inexistente");
    const valorRecebido = Number(body.valorRecebido ?? previous.valorPrevisto);
    const valorTaxas = Number(body.valorTaxas ?? previous.valorTaxas ?? 0);
    if (valorRecebido <= 0) throw new BadRequestException("Valor recebido deve ser maior que zero");
    const valorLiquido = valorRecebido - valorTaxas;
    const current = await this.prisma.erpContaReceber.update({
      where: { id },
      data: { valorRecebido, valorTaxas, valorLiquido, dataRecebimento: new Date(), status: "RECEBIDO", formaPagamento: body.formaPagamento ?? previous.formaPagamento },
    });
    await this.prisma.erpLancamentoFinanceiro.create({
      data: {
        empresaId: previous.empresaId,
        tipo: "RECEITA",
        categoriaId: previous.categoriaId,
        descricao: `Recebimento: ${previous.descricao}`,
        valorBruto: valorRecebido,
        valorTaxas,
        valorLiquido,
        dataCompetencia: new Date(),
        dataPagamento: new Date(),
        status: "RECEBIDO",
        formaPagamento: body.formaPagamento ?? previous.formaPagamento,
        origem: "conta_a_receber",
        referenciaTipo: "conta_a_receber",
        referenciaId: id,
      },
    });
    return { previous, current };
  }

  async generateContaPagarFromGastoFixo(id: number, mes?: string) {
    const gasto = await this.prisma.erpGastoFixo.findUnique({ where: { id }, include: { categoria: true } });
    if (!gasto || gasto.excluidoEm) throw new NotFoundException("Gasto fixo inexistente");
    if (!gasto.ativo) throw new BadRequestException("Gasto fixo inativo não pode gerar conta");

    const periodo = this.monthPeriod(mes);
    const vencimento = new Date(periodo.year, periodo.month - 1, Math.min(gasto.diaVencimento, this.daysInMonth(periodo.year, periodo.month)));
    const existing = await this.prisma.erpContaPagar.findFirst({
      where: {
        gastoFixoId: id,
        excluidoEm: null,
        dataVencimento: { gte: periodo.start, lt: periodo.end },
      },
      include: { categoria: true, servicoContratado: true, gastoFixo: true },
    });
    if (existing) return { previous: gasto, current: existing, created: false };

    const current = await this.prisma.erpContaPagar.create({
      data: {
        empresaId: gasto.empresaId,
        categoriaId: gasto.categoriaId,
        gastoFixoId: gasto.id,
        descricao: gasto.descricao,
        fornecedor: gasto.fornecedor,
        valorPrevisto: gasto.valorPrevisto,
        moeda: gasto.moeda,
        dataVencimento: vencimento,
        recorrente: true,
        periodicidade: "mensal",
        status: "PENDENTE",
        formaPagamento: gasto.formaPagamento,
        observacoes: gasto.observacoes,
      },
      include: { categoria: true, servicoContratado: true, gastoFixo: true },
    });

    return { previous: gasto, current, created: true };
  }

  private normalize(body: unknown) {
    if (!body || typeof body !== "object") return body;
    return Object.fromEntries(
      Object.entries(body as Record<string, unknown>).map(([key, value]) => [key, value === "" ? undefined : value]),
    );
  }

  private async getDefaultEmpresaId() {
    const empresa = await this.prisma.erpEmpresa.findFirst({ select: { id: true } });
    if (empresa) return empresa.id;
    const created = await this.prisma.erpEmpresa.create({
      data: {
        razaoSocial: "NossoZelo",
        nomeFantasia: "NossoZelo",
        tipoEmpresa: "MEI",
        regimeTributario: "SIMEI",
        status: "ativa",
      },
      select: { id: true },
    });
    return created.id;
  }

  private dateFilter(filters: QueryFilters) {
    if (!filters.mes) return null;
    const [year, month] = filters.mes.split("-").map(Number);
    if (!year || !month) return null;
    return {
      gte: new Date(year, month - 1, 1),
      lt: new Date(year, month, 1),
    };
  }

  private monthPeriod(mes?: string) {
    const value = mes ?? new Date().toISOString().slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(value)) throw new BadRequestException("Mês inválido. Use YYYY-MM.");
    const [year, month] = value.split("-").map(Number);
    if (!year || month < 1 || month > 12) throw new BadRequestException("Mês inválido. Use YYYY-MM.");
    return {
      year,
      month,
      start: new Date(year, month - 1, 1),
      end: new Date(year, month, 1),
    };
  }

  private daysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }
}
