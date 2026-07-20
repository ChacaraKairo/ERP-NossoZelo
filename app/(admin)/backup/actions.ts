"use server";

import { revalidatePath } from "next/cache";
import { apiPost } from "@/lib/api";

export async function registrarBackupManual() {
  await apiPost("/exportacoes/backup/manual");
  revalidatePath("/backup");
}
