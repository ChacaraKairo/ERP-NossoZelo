import { cookies } from "next/headers";
import { apiUrl } from "@/lib/api-url";

async function cookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}/api${path}`, {
    headers: {
      Cookie: await cookieHeader(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API GET ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}
