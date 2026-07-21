import { BadRequestException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { ResourceService } from "./resource.service";

describe("ResourceService", () => {
  it("rejects negative financial values", async () => {
    const service = new ResourceService({} as never);

    await expect(
      service.create("lancamentos", {
        tipo: "RECEITA",
        categoriaId: 1,
        descricao: "Receita inválida",
        valorBruto: -1,
        valorTaxas: 0,
        valorLiquido: -1,
        dataCompetencia: "2026-07-20",
        status: "PENDENTE",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("marks payable account as paid and creates financial entry", async () => {
    const prisma = {
      erpContaPagar: {
        findUnique: vi.fn().mockResolvedValue({
          id: 1,
          empresaId: 1,
          categoriaId: 2,
          descricao: "Servidor",
          valorPrevisto: 100,
          formaPagamento: "cartao",
        }),
        update: vi.fn().mockResolvedValue({ id: 1, status: "PAGO" }),
      },
      erpLancamentoFinanceiro: {
        create: vi.fn().mockResolvedValue({ id: 10 }),
      },
    };
    const service = new ResourceService(prisma as never);

    const result = await service.payContaPagar(1, { valorPago: 100 });

    expect(result.current).toEqual({ id: 1, status: "PAGO" });
    expect(prisma.erpLancamentoFinanceiro.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tipo: "DESPESA", referenciaTipo: "conta_a_pagar" }),
      }),
    );
  });

  it("generates one payable account from fixed monthly expense", async () => {
    const prisma = {
      erpGastoFixo: {
        findUnique: vi.fn().mockResolvedValue({
          id: 7,
          empresaId: 1,
          categoriaId: 2,
          descricao: "Contador",
          fornecedor: "Escritório",
          valorPrevisto: 250,
          moeda: "BRL",
          diaVencimento: 10,
          ativo: true,
          excluidoEm: null,
          formaPagamento: "pix",
          observacoes: "Obrigatório",
        }),
      },
      erpContaPagar: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: 20, gastoFixoId: 7, status: "PENDENTE" }),
      },
    };
    const service = new ResourceService(prisma as never);

    const result = await service.generateContaPagarFromGastoFixo(7, "2026-07");

    expect(result.created).toBe(true);
    expect(result.current).toEqual({ id: 20, gastoFixoId: 7, status: "PENDENTE" });
    expect(prisma.erpContaPagar.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ gastoFixoId: 7, recorrente: true, dataVencimento: new Date(2026, 6, 10) }),
      }),
    );
  });
});
