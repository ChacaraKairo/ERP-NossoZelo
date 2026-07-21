import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

const dayMs = 24 * 60 * 60 * 1000;

@Injectable()
export class AlertasService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const now = new Date();
    const soon = new Date(now.getTime() + 7 * dayMs);
    const oldCredentialDate = new Date(now.getTime() - 180 * dayMs);

    const [contasPagar, contasReceber, servicosRenovacao, servicosCriticos, obrigacoes, tarefas, riscos, credenciais] =
      await Promise.all([
        this.prisma.erpContaPagar.findMany({ where: { excluidoEm: null, status: "PENDENTE", dataVencimento: { lte: soon } } }),
        this.prisma.erpContaReceber.findMany({ where: { excluidoEm: null, status: "PENDENTE", dataVencimento: { lte: now } } }),
        this.prisma.erpServicoContratado.findMany({ where: { excluidoEm: null, dataRenovacao: { lte: soon, gte: now } } }),
        this.prisma.erpServicoContratado.findMany({ where: { excluidoEm: null, criticidade: "CRITICA", status: { in: ["ativo", "pago", "trial"] } } }),
        this.prisma.erpObrigacaoFiscal.findMany({ where: { excluidoEm: null, status: "PENDENTE", dataVencimento: { lte: soon } } }),
        this.prisma.erpTarefa.findMany({ where: { excluidoEm: null, status: { notIn: ["CONCLUIDA", "CANCELADA"] }, dataLimite: { lt: now } } }),
        this.prisma.erpRisco.findMany({ where: { excluidoEm: null, severidade: { in: ["ALTA", "CRITICA"] }, status: { not: "fechado" } } }),
        this.prisma.erpServicoContratado.findMany({
          where: {
            excluidoEm: null,
            possuiCredenciais: true,
            OR: [{ ultimaRotacaoCredenciais: null }, { ultimaRotacaoCredenciais: { lt: oldCredentialDate } }],
          },
        }),
      ]);

    return [
      ...contasPagar.map((item) => ({
        tipo: item.dataVencimento < now ? "conta_pagar_vencida" : "conta_pagar_vencendo",
        titulo: item.descricao,
        prioridade: item.dataVencimento < now ? "ALTA" : "MEDIA",
        entidadeTipo: "contasPagar",
        entidadeId: item.id,
        dataLimite: item.dataVencimento,
      })),
      ...contasReceber.map((item) => ({
        tipo: "conta_receber_atrasada",
        titulo: item.descricao,
        prioridade: "ALTA",
        entidadeTipo: "contasReceber",
        entidadeId: item.id,
        dataLimite: item.dataVencimento,
      })),
      ...servicosRenovacao.map((item) => ({
        tipo: "servico_renovacao_proxima",
        titulo: item.nome,
        prioridade: item.criticidade,
        entidadeTipo: "servicos",
        entidadeId: item.id,
        dataLimite: item.dataRenovacao,
      })),
      ...servicosCriticos.map((item) => ({
        tipo: "servico_critico",
        titulo: item.nome,
        prioridade: "CRITICA",
        entidadeTipo: "servicos",
        entidadeId: item.id,
      })),
      ...obrigacoes.map((item) => ({
        tipo: "obrigacao_fiscal_vencendo",
        titulo: item.descricao ?? item.tipo,
        prioridade: item.dataVencimento < now ? "ALTA" : "MEDIA",
        entidadeTipo: "obrigacoes",
        entidadeId: item.id,
        dataLimite: item.dataVencimento,
      })),
      ...tarefas.map((item) => ({
        tipo: "tarefa_atrasada",
        titulo: item.titulo,
        prioridade: item.prioridade,
        entidadeTipo: "tarefas",
        entidadeId: item.id,
        dataLimite: item.dataLimite,
      })),
      ...riscos.map((item) => ({
        tipo: "risco_critico",
        titulo: item.titulo,
        prioridade: item.severidade,
        entidadeTipo: "riscos",
        entidadeId: item.id,
      })),
      ...credenciais.map((item) => ({
        tipo: "credencial_sem_rotacao_recente",
        titulo: item.nome,
        prioridade: item.criticidade,
        entidadeTipo: "servicos",
        entidadeId: item.id,
      })),
    ];
  }
}
