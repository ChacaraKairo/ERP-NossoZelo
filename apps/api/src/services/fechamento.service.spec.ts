import { describe, expect, it, vi } from "vitest";
import { FechamentoService } from "./fechamento.service";

describe("FechamentoService", () => {
  it("calculates monthly result and pending items", async () => {
    const prisma = {
      erpEmpresa: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      erpLancamentoFinanceiro: {
        findMany: vi.fn().mockResolvedValue([
          { tipo: "RECEITA", valorLiquido: 500 },
          { tipo: "DESPESA", valorLiquido: 120 },
        ]),
      },
      erpContaPagar: { findMany: vi.fn().mockResolvedValue([{ id: 1, status: "PENDENTE", servicoContratadoId: 1 }]) },
      erpContaReceber: { findMany: vi.fn().mockResolvedValue([{ id: 2, status: "RECEBIDO" }]) },
      erpObrigacaoFiscal: { findMany: vi.fn().mockResolvedValue([{ id: 3, status: "PENDENTE" }]) },
      erpNotaFiscal: { findMany: vi.fn().mockResolvedValue([{ id: 4 }]) },
      erpServicoContratado: { findMany: vi.fn().mockResolvedValue([{ id: 5, criticidade: "CRITICA", responsavelInterno: null }]) },
      erpChamado: { findMany: vi.fn().mockResolvedValue([{ id: 6 }]) },
      erpTarefa: { findMany: vi.fn().mockResolvedValue([{ id: 7 }]) },
      erpDecisao: { findMany: vi.fn().mockResolvedValue([{ id: 8 }]) },
      erpFechamentoMensal: { findUnique: vi.fn().mockResolvedValue(null) },
    };
    const service = new FechamentoService(prisma as never);

    const resumo = await service.resumo("2026-07");

    expect(resumo.metrics.receitaTotal).toBe(500);
    expect(resumo.metrics.despesaTotal).toBe(120);
    expect(resumo.metrics.resultado).toBe(380);
    expect(resumo.metrics.contasPagarAbertas).toBe(1);
    expect(resumo.metrics.obrigacoesPendentes).toBe(1);
    expect(resumo.pendenciasProximoMes.servicosSemResponsavel).toHaveLength(1);
  });
});
