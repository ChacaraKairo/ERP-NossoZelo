import { DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";

export default async function PrestadoresPage() {
  const rows = await apiGet<any[]>("/erp/prestadores");
  return (
    <>
      <PageHeader title="Prestadores" description="Cadastro, assinatura, documentos, avaliações e pendências." />
      <div className="grid cards">
        <MetricCard label="Prestadores" value={String(rows.length)} />
        <MetricCard label="Aprovados" value={String(rows.filter((row) => row.statusCadastro === "aprovado").length)} tone="ok" />
        <MetricCard label="Pendentes" value={String(rows.filter((row) => row.statusCadastro === "pendente").length)} tone="warn" />
      </div>
      <div style={{ marginTop: 22 }}>
        <DataTable columns={[
          { key: "nome", label: "Nome" },
          { key: "tipoPrestador", label: "Tipo" },
          { key: "email", label: "E-mail" },
          { key: "cidade", label: "Cidade" },
          { key: "statusCadastro", label: "Cadastro", type: "status" },
          { key: "statusAssinatura", label: "Assinatura", type: "status" },
          { key: "documentosStatus", label: "Documentos", type: "status" },
          { key: "avaliacaoMedia", label: "Avaliação" },
        ]} rows={rows} />
      </div>
    </>
  );
}
