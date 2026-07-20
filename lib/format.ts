export function money(value: unknown) {
  const numeric = Number(value ?? 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
}

export function dateBR(value: Date | string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}

export function statusLabel(value: string | null | undefined) {
  return String(value ?? "-").replaceAll("_", " ").toLowerCase();
}
