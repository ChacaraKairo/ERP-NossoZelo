import { CheckCircle2, Download, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { DataTable } from "@/components/DataTable";
import { apiGet } from "@/lib/api";
import { publicApiUrl } from "@/lib/api-url";
import { dateBR, money } from "@/lib/format";
import { fecharMes } from "./actions";

type SearchParams = Promise<{ mes?: string }>;

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default async function FechamentoPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = await searchParams;
  const mes = params?.mes ?? currentMonth();
  const resumo = await apiGet<any>(`/fechamento/resumo?mes=${mes}`);
  const fechamento = resumo.fechamento;

  return (
    <>
      <PageHeader title="Fechamento mensal" description="Resumo do mês, pendências e registro formal de fechamento." />

      <form className="toolbar" action="/fechamento" method="get">
        <label className="inline-field">
          <span>Mês</span>
          <input type="month" name="mes" defaultValue={mes} />
        </label>
        <button className="button secondary" type="submit">
          <Search size={17} /> Filtrar
        </button>
      </form>

      <div className="grid cards">
        <MetricCard label="Receita do mês" value={money(resumo.metrics.receitaTotal)} tone="ok" />
        <MetricCard label="Despesas do mês" value={money(resumo.metrics.despesaTotal)} tone="warn" />
        <MetricCard label="Resultado" value={money(resumo.metrics.resultado)} tone={resumo.metrics.resultado >= 0 ? "ok" : "danger"} />
        <MetricCard label="DAS/obrigações pendentes" value={String(resumo.metrics.obrigacoesPendentes)} />
      </div>

      <div className="grid cards" style={{ marginTop: 16 }}>
        <MetricCard label="Contas a pagar abertas" value={String(resumo.metrics.contasPagarAbertas)} />
        <MetricCard label="Contas a receber abertas" value={String(resumo.metrics.contasReceberAbertas)} />
        <MetricCard label="Notas emitidas" value={String(resumo.metrics.notasEmitidas)} />
        <MetricCard label="Problemas abertos" value={String(resumo.metrics.problemasAbertos)} tone={resumo.metrics.problemasAbertos ? "warn" : undefined} />
      </div>

      <div className="toolbar" style={{ marginTop: 22 }}>
        <div>
          <h2>Status do mês</h2>
          <p className="muted">
            {fechamento?.status === "FECHADO" ? `Fechado em ${dateBR(fechamento.fechadoEm)}` : "Aberto para revisão"}
          </p>
        </div>
        <div className="actions-row">
          <a className="button secondary" href={`${publicApiUrl}/api/exportacoes/financeiro.csv?mes=${mes}`}>
            <Download size={17} /> CSV
          </a>
          <form action={fecharMes}>
            <input type="hidden" name="mes" value={mes} />
            <button className="button" type="submit">
              <CheckCircle2 size={17} /> Fechar mês
            </button>
          </form>
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 16 }}>
        <section>
          <div className="toolbar"><h2>Pagar no mês</h2></div>
          <DataTable
            columns={[
              { key: "descricao", label: "Descrição" },
              { key: "valorPrevisto", label: "Valor", type: "money" as const },
              { key: "dataVencimento", label: "Vencimento", type: "date" as const },
              { key: "status", label: "Status", type: "status" as const },
            ]}
            rows={resumo.listas.contasPagar}
          />
        </section>
        <section>
          <div className="toolbar"><h2>Receber no mês</h2></div>
          <DataTable
            columns={[
              { key: "descricao", label: "Descrição" },
              { key: "valorPrevisto", label: "Valor", type: "money" as const },
              { key: "dataVencimento", label: "Vencimento", type: "date" as const },
              { key: "status", label: "Status", type: "status" as const },
            ]}
            rows={resumo.listas.contasReceber}
          />
        </section>
      </div>
    </>
  );
}
