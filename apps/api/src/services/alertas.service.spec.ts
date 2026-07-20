import { describe, expect, it, vi } from "vitest";
import { AlertasService } from "./alertas.service";

describe("AlertasService", () => {
  it("returns calculated alerts from multiple modules", async () => {
    const prisma = {
      erpContaPagar: { findMany: vi.fn().mockResolvedValue([{ id: 1, descricao: "DAS", dataVencimento: new Date(0) }]) },
      erpContaReceber: { findMany: vi.fn().mockResolvedValue([]) },
      erpServicoContratado: { findMany: vi.fn().mockResolvedValue([]) },
      erpObrigacaoFiscal: { findMany: vi.fn().mockResolvedValue([]) },
      erpTarefa: { findMany: vi.fn().mockResolvedValue([]) },
      erpRisco: { findMany: vi.fn().mockResolvedValue([{ id: 2, titulo: "Gateway fora", severidade: "CRITICA" }]) },
    };
    const service = new AlertasService(prisma as never);

    const alerts = await service.list();

    expect(alerts.some((alert) => alert.tipo === "conta_pagar_vencida")).toBe(true);
    expect(alerts.some((alert) => alert.tipo === "risco_critico")).toBe(true);
  });
});
