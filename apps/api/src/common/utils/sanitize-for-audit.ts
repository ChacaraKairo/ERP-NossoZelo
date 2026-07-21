const sensitivePatterns = [
  /senha/i,
  /password/i,
  /token/i,
  /cookie/i,
  /secret/i,
  /segredo/i,
  /access[_-]?key/i,
  /secret[_-]?key/i,
  /api[_-]?key/i,
  /jwt/i,
  /recovery/i,
  /private[_-]?key/i,
];

export function sanitizeForAudit(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map((item) => sanitizeForAudit(item));
  if (typeof data !== "object") return data;
  if ("toJSON" in data && typeof data.toJSON === "function") return data.toJSON();

  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([key, value]) => {
      if (sensitivePatterns.some((pattern) => pattern.test(key))) {
        return [key, "[REDACTED]"];
      }
      return [key, sanitizeForAudit(value)];
    }),
  );
}
