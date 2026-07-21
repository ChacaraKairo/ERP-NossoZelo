import { describe, expect, it } from "vitest";
import { hasPermission } from "./permissions";

describe("hasPermission", () => {
  it("allows founders to do everything", () => {
    expect(hasPermission("FUNDADOR", "auditoria:read")).toBe(true);
    expect(hasPermission("FUNDADOR", "usuarios:disable")).toBe(true);
  });

  it("blocks read-only users from writes", () => {
    expect(hasPermission("LEITURA", "financeiro:read")).toBe(true);
    expect(hasPermission("LEITURA", "financeiro:create")).toBe(false);
  });
});
