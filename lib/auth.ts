import { redirect } from "next/navigation";
import { apiGet } from "@/lib/api";

export async function getCurrentUser() {
  try {
    return await apiGet<{ id: number; nome: string; email: string; perfil: string }>("/auth/me");
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
