import { DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";

export default async function ClientesPage() {
  const rows = await apiGet<any[]>("/erp/clientes");
  return (
    <>
      <PageHeader title="Clientes" description="Visão operacional dos clientes do marketplace NossoZelo." />
      <div className="grid cards">
        <MetricCard label="Clientes cadastrados" value={String(rows.length)} />
        <MetricCard label="Clientes ativos" value={String(rows.filter((row) => row.status === "ativo").length)} />
      </div>
      <div style={{ marginTop: 22 }}>
        <DataTable columns={[
          { key: "nome", label: "Nome" },
          { key: "email", label: "E-mail" },
          { key: "telefone", label: "Telefone" },
          { key: "cidade", label: "Cidade" },
          { key: "estado", label: "UF" },
          { key: "status", label: "Status", type: "status" },
          { key: "criadoEm", label: "Cadastro", type: "date" },
        ]} rows={rows} />
      </div>
    </>
  );
}
