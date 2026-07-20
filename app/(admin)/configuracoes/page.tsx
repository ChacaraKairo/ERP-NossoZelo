import Link from "next/link";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";

export default async function ConfiguracoesPage() {
  const [empresas, usuarios, categorias] = await Promise.all([
    apiGet<any[]>("/erp/empresas"),
    apiGet<any[]>("/erp/usuarios"),
    apiGet<any[]>("/erp/categorias"),
  ]);
  const empresa = empresas[0];
  return (
    <>
      <PageHeader title="Configurações" description="Empresa, usuários internos, perfis e categorias financeiras." />
      <div className="grid two">
        <div className="card">
          <h2>Empresa</h2>
          <p><strong>Razão social:</strong> {empresa?.razaoSocial ?? "-"}</p>
          <p><strong>Nome fantasia:</strong> {empresa?.nomeFantasia ?? "-"}</p>
          <p><strong>Tipo:</strong> {empresa?.tipoEmpresa ?? "-"}</p>
          <p><strong>Regime:</strong> {empresa?.regimeTributario ?? "-"}</p>
        </div>
        <div className="card">
          <h2>Segurança</h2>
          <p>Perfis previstos: fundador, financeiro, operação, suporte e leitura.</p>
          <p className="muted">Segredos devem ficar em variáveis de ambiente ou gerenciador de senhas.</p>
          <Link className="button secondary" href="/configuracoes/banco">Banco de dados</Link>
        </div>
      </div>
      <h2>Usuários internos</h2>
      <DataTable columns={[
        { key: "nome", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "perfil", label: "Perfil", type: "status" },
        { key: "status", label: "Status", type: "status" },
        { key: "ultimoAcesso", label: "Último acesso", type: "date" },
      ]} rows={usuarios} />
      <h2>Categorias financeiras</h2>
      <DataTable columns={[
        { key: "nome", label: "Nome" },
        { key: "tipo", label: "Tipo", type: "status" },
        { key: "ativo", label: "Ativo", render: (row: any) => row.ativo ? "sim" : "não" },
      ]} rows={categorias} />
    </>
  );
}
