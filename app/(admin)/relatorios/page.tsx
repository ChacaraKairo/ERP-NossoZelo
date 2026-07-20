import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { apiGet } from "@/lib/api";
import { money } from "@/lib/format";

export default async function RelatoriosPage() {
  const [lancamentos, servicos, obrigacoes, chamados] = await Promise.all([
    apiGet<any[]>("/erp/lancamentos"),
    apiGet<any[]>("/erp/servicos"),
    apiGet<any[]>("/erp/obrigacoes"),
    apiGet<any[]>("/erp/chamados"),
  ]);
  const receitas = lancamentos.filter((item) => item.tipo === "RECEITA").reduce((sum, item) => sum + Number(item.valorLiquido), 0);
  const despesas = lancamentos.filter((item) => item.tipo === "DESPESA").reduce((sum, item) => sum + Number(item.valorLiquido), 0);
  const custoServicos = servicos.reduce((sum, item) => sum + Number(item.valorEstimado ?? 0), 0);
  return (
    <>
      <PageHeader title="Relatórios" description="Consolidação financeira, fiscal, serviços e suporte." />
      <div className="grid cards">
        <MetricCard label="Receitas" value={money(receitas)} tone="ok" />
        <MetricCard label="Despesas" value={money(despesas)} tone="warn" />
        <MetricCard label="Custo previsto de serviços" value={money(custoServicos)} />
        <MetricCard label="Obrigações pendentes" value={String(obrigacoes.filter((item) => item.status === "PENDENTE").length)} />
        <MetricCard label="Chamados críticos" value={String(chamados.filter((item) => item.prioridade === "CRITICA").length)} tone="danger" />
      </div>
    </>
  );
}
