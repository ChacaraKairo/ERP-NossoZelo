import { Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { apiGet } from "@/lib/api";
import { publicApiUrl } from "@/lib/api-url";
import { money } from "@/lib/format";

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

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
  const mes = currentMonth();
  const pdfs = [
    ["Fechamento mensal", "Resumo executivo do mês, pendências, notas, obrigações e decisões.", `/api/relatorios/fechamento-mensal/pdf?mes=${mes}`],
    ["Financeiro mensal", "Receitas, despesas, resultado, categorias e lançamentos do período.", `/api/relatorios/financeiro/pdf?mes=${mes}`],
    ["Contas a pagar", "Despesas do mês, vencimentos, fornecedores, serviços e status.", `/api/relatorios/contas-a-pagar/pdf?mes=${mes}`],
    ["Contas a receber", "Valores previstos, recebidos, taxas, origem e status.", `/api/relatorios/contas-a-receber/pdf?mes=${mes}`],
    ["Serviços contratados", "Serviços ativos, críticos, custos previstos e credenciais.", "/api/relatorios/servicos-contratados/pdf"],
    ["Fiscal/MEI", "DAS, obrigações fiscais, notas registradas e totais do mês.", `/api/relatorios/fiscal-mei/pdf?mes=${mes}`],
    ["Auditoria", "Eventos, logins, alterações, resultados, IP e usuário.", `/api/relatorios/auditoria/pdf?mes=${mes}`],
  ] as const;

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
      <div className="toolbar" style={{ marginTop: 22 }}>
        <div>
          <h2>PDFs disponíveis</h2>
          <p className="muted">Relatórios essenciais do mês atual com layout padronizado.</p>
        </div>
      </div>
      <div className="grid three">
        {pdfs.map(([title, description, href]) => (
          <a className="export-tile" href={`${publicApiUrl}${href}`} key={title}>
            <Download size={24} />
            <strong>{title}</strong>
            <span>{description}</span>
            <em><Download size={15} /> Baixar PDF</em>
          </a>
        ))}
      </div>
    </>
  );
}
