import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { money } from "@/lib/format";
import { columns } from "@/lib/page-config";
import { apiGet } from "@/lib/api";

export default async function FinanceiroPage() {
  const [lancamentos, pagar, receber, gastosFixos] = await Promise.all([
    apiGet<any[]>("/erp/lancamentos"),
    apiGet<any[]>("/erp/contasPagar"),
    apiGet<any[]>("/erp/contasReceber"),
    apiGet<any[]>("/erp/gastosFixos"),
  ]);
  const receitas = lancamentos.filter((item) => item.tipo === "RECEITA").reduce((sum, item) => sum + Number(item.valorLiquido), 0);
  const despesas = lancamentos.filter((item) => item.tipo === "DESPESA").reduce((sum, item) => sum + Number(item.valorLiquido), 0);

  return (
    <>
      <PageHeader title="Financeiro" description="Entradas, saídas, contas a pagar e contas a receber." />
      <div className="grid cards">
        <MetricCard label="Receitas registradas" value={money(receitas)} tone="ok" />
        <MetricCard label="Despesas registradas" value={money(despesas)} tone="warn" />
        <MetricCard label="Contas a pagar abertas" value={String(pagar.filter((item) => item.status === "PENDENTE").length)} />
        <MetricCard label="Contas a receber abertas" value={String(receber.filter((item) => item.status === "PENDENTE").length)} />
        <MetricCard label="Gastos fixos ativos" value={String(gastosFixos.filter((item) => item.ativo).length)} />
      </div>
      <div className="toolbar" style={{ marginTop: 22 }}>
        <h2>Lançamentos financeiros</h2>
        <div className="actions-row">
          <Link className="button secondary" href="/financeiro/gastos-fixos">Gastos fixos</Link>
          <Link className="button" href="/financeiro/lancamentos/novo"><Plus size={17} /> Novo</Link>
        </div>
      </div>
      <DataTable columns={columns.lancamentos} rows={lancamentos} />
    </>
  );
}
