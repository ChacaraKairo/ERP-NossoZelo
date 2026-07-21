import { describe, expect, it, vi } from "vitest";
import { ExportacoesService } from "./exportacoes.service";

describe("ExportacoesService", () => {
  it("exports financial entries as CSV", async () => {
    const prisma = {
      erpEmpresa: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      erpLancamentoFinanceiro: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 1,
            tipo: "RECEITA",
            categoria: { nome: "Assinaturas" },
            descricao: 'Plano "Profissional"',
            valorBruto: 100,
            valorTaxas: 5,
            valorLiquido: 95,
            dataCompetencia: new Date("2026-07-01T00:00:00.000Z"),
            status: "RECEBIDO",
            origem: "manual",
          },
        ]),
      },
    };
    const service = new ExportacoesService(prisma as never);

    const csv = await service.financeiroCsv("2026-07");

    expect(csv).toContain('"Plano ""Profissional"""');
    expect(csv).toContain('"2026-07-01T00:00:00.000Z"');
  });

  it("records manual backup metadata", async () => {
    const prisma = {
      erpEmpresa: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      erpBackupRegistro: { create: vi.fn().mockResolvedValue({ id: 10, tipo: "manual" }) },
    };
    const service = new ExportacoesService(prisma as never);

    const backup = await service.registrarBackup(1);

    expect(backup).toEqual({ id: 10, tipo: "manual" });
    expect(prisma.erpBackupRegistro.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ empresaId: 1, formato: "json_csv", geradoPorId: 1 }),
      }),
    );
  });
});
