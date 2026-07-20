import { DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { money } from "@/lib/format";

export default async function AssinaturasPage() {
  const rows = await apiGet<any[]>("/erp/assinaturas");
  const mrr = rows.filter((row) => row.status === "ativa").reduce((sum, row) => sum + Number(row.valor), 0);
  return (
    <>
      <PageHeader title="Assinaturas" description="Monetização recorrente, vencimentos e inadimplência." />
      <div className="grid cards">
        <MetricCard label="Assinaturas ativas" value={String(rows.filter((row) => row.status === "ativa").length)} tone="ok" />
        <MetricCard label="Atrasadas" value={String(rows.filter((row) => row.status === "atrasada").length)} tone="danger" />
        <MetricCard label="Receita recorrente estimada" value={money(mrr)} />
      </div>
      <div style={{ marginTop: 22 }}>
        <DataTable columns={[
          { key: "prestador", label: "Prestador", render: (row: any) => row.prestador?.nome ?? "-" },
          { key: "plano", label: "Plano" },
          { key: "status", label: "Status", type: "status" },
          { key: "valor", label: "Valor", type: "money" },
          { key: "gateway", label: "Gateway" },
          { key: "vencimento", label: "Vencimento", type: "date" },
          { key: "ultimoPagamento", label: "Último pagamento", type: "date" },
          { key: "proximaCobranca", label: "Próxima cobrança", type: "date" },
        ]} rows={rows} />
      </div>
    </>
  );
}
