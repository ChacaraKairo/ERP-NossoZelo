import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { money } from "@/lib/format";
import { columns } from "@/lib/page-config";

export default async function FiscalPage() {
  const [obrigacoes, notas] = await Promise.all([
    apiGet<any[]>("/erp/obrigacoes"),
    apiGet<any[]>("/erp/notas"),
  ]);
  const faturamento = notas.reduce((sum, nota) => sum + Number(nota.valorBruto), 0);
  return (
    <>
      <PageHeader title="Fiscal/MEI" description="DAS, declaração anual, notas fiscais manuais e faturamento acumulado." />
      <div className="grid cards">
        <MetricCard label="Obrigações pendentes" value={String(obrigacoes.filter((item) => item.status === "PENDENTE").length)} tone="warn" />
        <MetricCard label="Notas emitidas" value={String(notas.filter((item) => item.status === "emitida").length)} />
        <MetricCard label="Faturamento registrado" value={money(faturamento)} />
        <MetricCard label="Alerta limite MEI" value={faturamento > 64800 ? "atenção" : "ok"} tone={faturamento > 64800 ? "danger" : "ok"} />
      </div>
      <div className="toolbar" style={{ marginTop: 22 }}>
        <h2>Obrigações fiscais</h2>
        <Link className="button" href="/fiscal/obrigacoes/nova"><Plus size={17} /> Nova obrigação</Link>
      </div>
      <DataTable columns={columns.obrigacoes} rows={obrigacoes} />
    </>
  );
}
