import { describe, expect, it } from "vitest";
import { sanitizeForAudit } from "./sanitize-for-audit";

describe("sanitizeForAudit", () => {
  it("redacts sensitive fields recursively", () => {
    const result = sanitizeForAudit({
      email: "admin@nossozelo.com.br",
      senha: "secret",
      nested: { apiKey: "abc", token: "def", ok: true },
    });

    expect(result).toEqual({
      email: "admin@nossozelo.com.br",
      senha: "[REDACTED]",
      nested: { apiKey: "[REDACTED]", token: "[REDACTED]", ok: true },
    });
  });
});
