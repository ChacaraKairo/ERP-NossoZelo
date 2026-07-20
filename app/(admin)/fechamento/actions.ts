"use server";

import { redirect } from "next/navigation";
import { apiPost } from "@/lib/api";

export async function fecharMes(formData: FormData) {
  const mes = String(formData.get("mes") ?? "");
  await apiPost(`/fechamento/${mes}/fechar`);
  redirect(`/fechamento?mes=${mes}`);
}
