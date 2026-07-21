import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { money } from "@/lib/format";
import { columns } from "@/lib/page-config";
import { apiGet } from "@/lib/api";

export default async function DashboardPage() {
  const dashboard = await apiGet<any>("/dashboard");
  const { receita, despesas, resultado, assinaturasAtivas, servicosCriticos, obrigacoesPendentes, chamadosAbertos, tarefasAbertas, riscosCriticos } = dashboard.metrics;
  const { contasPagar, contasReceber } = dashboard.lists;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Saúde financeira, fiscal e operacional da empresa."
        action={<Link className="button" href="/financeiro/lancamentos/novo"><Plus size={17} /> Lançamento</Link>}
        showBack={false}
      />
      <div className="grid cards">
        <MetricCard label="Receita do mês" value={money(receita)} tone="ok" />
        <MetricCard label="Despesas do mês" value={money(despesas)} tone={despesas > 0 ? "warn" : undefined} />
        <MetricCard label="Resultado" value={money(resultado)} tone={resultado >= 0 ? "ok" : "danger"} />
        <MetricCard label="Assinaturas ativas" value={String(assinaturasAtivas)} />
        <MetricCard label="Serviços críticos" value={String(servicosCriticos)} />
        <MetricCard label="Obrigações pendentes" value={String(obrigacoesPendentes)} />
        <MetricCard label="Chamados abertos" value={String(chamadosAbertos)} />
        <MetricCard label="Tarefas em aberto" value={String(tarefasAbertas)} />
        <MetricCard label="Riscos críticos" value={String(riscosCriticos)} tone={riscosCriticos > 0 ? "danger" : undefined} />
      </div>
      <div className="grid two" style={{ marginTop: 20 }}>
        <section>
          <h2>Próximas contas a pagar</h2>
          <DataTable columns={columns.contasPagar.slice(0, 5)} rows={contasPagar} />
        </section>
        <section>
          <h2>Contas a receber</h2>
          <DataTable columns={columns.contasReceber.slice(0, 5)} rows={contasReceber} />
        </section>
      </div>
    </>
  );
}
