import { describe, expect, it, vi } from "vitest";
import { hash } from "bcryptjs";
import { AuthService, sessionCookie } from "./auth.service";

describe("AuthService", () => {
  it("creates a random session token instead of exposing user id", async () => {
    const prisma = {
      erpUsuarioInterno: {
        findUnique: vi.fn().mockResolvedValue({
          id: 1,
          nome: "Admin",
          email: "admin@nossozelo.com.br",
          senhaHash: await hash("admin123", 4),
          perfil: "FUNDADOR",
          status: "ATIVO",
          deveTrocarSenha: true,
        }),
        update: vi.fn().mockResolvedValue({}),
      },
      erpSessao: {
        create: vi.fn().mockResolvedValue({ id: "session-id", deviceId: null }),
      },
    };
    const audit = { create: vi.fn().mockResolvedValue({}) };
    const service = new AuthService(prisma as never, audit as never);

    const result = await service.login({ email: "admin@nossozelo.com.br", password: "admin123" });

    expect(result.token).not.toBe("1");
    expect(result.token.length).toBeGreaterThan(40);
    expect(prisma.erpSessao.create).toHaveBeenCalled();
    expect(sessionCookie).toBe("erp_session");
  });
});
