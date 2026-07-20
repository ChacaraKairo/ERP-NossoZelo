import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { publicApiUrl } from "@/lib/api-url";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  const params = await searchParams;

  return (
    <main className="login-page">
      <form className="login-card" action={`${publicApiUrl}/api/auth/login`} method="post">
        <div className="brand" style={{ color: "#17202a", padding: 0, marginBottom: 22 }}>
          <span className="brand-mark">
            <ShieldCheck size={19} />
          </span>
          <span>ERP NossoZelo</span>
        </div>
        <h1 style={{ margin: "0 0 8px" }}>Acesso administrativo</h1>
        <p className="muted" style={{ marginTop: 0 }}>Entre para gerenciar financeiro, fiscal e operação.</p>
        {params.erro ? <p className="badge danger">Credenciais inválidas</p> : null}
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" defaultValue="admin@nossozelo.com.br" required />
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" defaultValue="admin123" required />
        </div>
        <button className="button" style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
          Entrar
        </button>
      </form>
    </main>
  );
}
