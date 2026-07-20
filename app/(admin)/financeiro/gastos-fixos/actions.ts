"use server";

import { revalidatePath } from "next/cache";
import { apiPost } from "@/lib/api";

export async function gerarContaGastoFixo(formData: FormData) {
  const id = Number(formData.get("id"));
  const mes = String(formData.get("mes") ?? new Date().toISOString().slice(0, 7));
  await apiPost(`/erp/gastosFixos/${id}/gerar?mes=${mes}`);
  revalidatePath("/financeiro/gastos-fixos");
  revalidatePath("/financeiro/contas-a-pagar");
}
