import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { DeleteResourceButton } from "@/components/DeleteResourceButton";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { money } from "@/lib/format";
import { columns } from "@/lib/page-config";

export default async function ServicosPage() {
  const rows = await apiGet<any[]>("/erp/servicos");
  const custo = rows.reduce((sum, row) => sum + Number(row.valorEstimado ?? 0), 0);
  return (
    <>
      <PageHeader title="Serviços contratados" description="Fornecedores, custos, criticidade, credenciais e renovações." action={<Link className="button" href="/servicos-contratados/novo"><Plus size={17} /> Novo</Link>} />
      <div className="grid cards">
        <MetricCard label="Serviços ativos" value={String(rows.filter((row) => row.status === "ativo").length)} />
        <MetricCard label="Serviços críticos" value={String(rows.filter((row) => row.criticidade === "CRITICA").length)} tone="danger" />
        <MetricCard label="Custo mensal previsto" value={money(custo)} />
        <MetricCard label="Com credenciais" value={String(rows.filter((row) => row.possuiCredenciais).length)} />
      </div>
      <div style={{ marginTop: 22 }}>
        <DataTable columns={[
          ...columns.servicos,
          {
            key: "acoes",
            label: "Ações",
            render: (row: any) => (
              <div className="actions-row">
                <Link className="icon-button secondary" title="Ver" aria-label="Ver" href={`/servicos-contratados/${row.id}`}><Eye size={16} /></Link>
                <Link className="icon-button secondary" title="Editar" aria-label="Editar" href={`/servicos-contratados/${row.id}/editar`}><Pencil size={16} /></Link>
                <DeleteResourceButton resource="servicos" id={row.id} compact />
              </div>
            ),
          },
        ]} rows={rows} />
      </div>
    </>
  );
}
