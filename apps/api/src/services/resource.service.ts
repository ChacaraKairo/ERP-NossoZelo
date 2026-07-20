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
const optionalDecimalField = z
  .union([z.coerce.number(), z.literal("")])
  .optional()
  .transform((value) => (value === "" || value === undefined ? undefined : value));

const schemas = {
  lancamentos: z.object({
    tipo: z.enum(["RECEITA", "DESPESA"]),
    categoriaId: z.coerce.number(),
    descricao: z.string().min(3),
    valorBruto: decimalField,
    valorTaxas: decimalField,
    valorLiquido: decimalField,
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
    descricao: z.string().min(3),
    fornecedor: z.string().optional(),
    valorPrevisto: decimalField,
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
  contasReceber: z.object({
    categoriaId: z.coerce.number(),
    clienteId: z.coerce.number().optional(),
    prestadorId: z.coerce.number().optional(),
    assinaturaId: z.coerce.number().optional(),
    descricao: z.string().min(3),
    origem: z.string().default("manual"),
    valorPrevisto: decimalField,
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
    valorBruto: decimalField,
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
} as const;

type ResourceName = keyof typeof schemas | "categorias" | "clientes" | "prestadores" | "assinaturas" | "auditoria" | "usuarios" | "empresas";

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService) {}

  async list(resource: ResourceName) {
    switch (resource) {
      case "lancamentos":
        return this.prisma.erpLancamentoFinanceiro.findMany({ where: { excluidoEm: null }, include: { categoria: true }, orderBy: { dataCompetencia: "desc" } });
      case "contasPagar":
        return this.prisma.erpContaPagar.findMany({ include: { categoria: true, servicoContratado: true }, orderBy: { dataVencimento: "asc" } });
      case "contasReceber":
        return this.prisma.erpContaReceber.findMany({ include: { categoria: true, cliente: true, prestador: true, assinatura: true }, orderBy: { dataVencimento: "asc" } });
      case "servicos":
        return this.prisma.erpServicoContratado.findMany({ where: { excluidoEm: null }, orderBy: { nome: "asc" } });
      case "obrigacoes":
        return this.prisma.erpObrigacaoFiscal.findMany({ orderBy: { dataVencimento: "asc" } });
      case "notas":
        return this.prisma.erpNotaFiscal.findMany({ orderBy: { dataEmissao: "desc" } });
      case "chamados":
        return this.prisma.erpChamado.findMany({ orderBy: { dataAbertura: "desc" } });
      case "tarefas":
        return this.prisma.erpTarefa.findMany({ orderBy: { dataLimite: "asc" } });
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
      default:
        throw new NotFoundException("Recurso inexistente");
    }
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
}
