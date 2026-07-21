"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiUrl } from "@/lib/api-url";

const sessionCookie = "erp_session";

export async function login(formData: FormData) {
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email: String(formData.get("email") ?? ""),
      senha: String(formData.get("senha") ?? ""),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/login?erro=1");
  }

  const setCookie = response.headers.get("set-cookie");
  const token = setCookie?.match(/erp_session=([^;]+)/)?.[1];
  if (!token) {
    redirect("/login?erro=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(sessionCookie, decodeURIComponent(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
  });

  redirect("/dashboard");
}
