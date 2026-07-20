import Link from "next/link";
import { CalendarPlus, Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { money } from "@/lib/format";
import { gerarContaGastoFixo } from "./actions";

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default async function GastosFixosPage() {
  const rows = await apiGet<any[]>("/erp/gastosFixos");
  const ativos = rows.filter((row) => row.ativo);
  const obrigatorios = ativos.filter((row) => row.obrigatorio);
  const totalMensal = ativos.reduce((sum, row) => sum + Number(row.valorPrevisto), 0);
  const mes = currentMonth();

  return (
    <>
      <PageHeader
        title="Gastos fixos"
        description="Despesas mensais fixas e obrigatórias que precisam virar contas a pagar."
        action={<Link className="button" href="/financeiro/gastos-fixos/novo"><Plus size={17} /> Novo</Link>}
      />
      <div className="grid cards">
        <MetricCard label="Total mensal previsto" value={money(totalMensal)} tone="warn" />
        <MetricCard label="Gastos ativos" value={String(ativos.length)} />
        <MetricCard label="Obrigatórios" value={String(obrigatorios.length)} />
        <MetricCard label="Mês de geração" value={mes} />
      </div>
      <div className="toolbar" style={{ marginTop: 22 }}>
        <h2>Cadastros mensais</h2>
      </div>
      <DataTable
        columns={[
          { key: "descricao", label: "Descrição" },
          { key: "fornecedor", label: "Fornecedor" },
          { key: "categoria", label: "Categoria", render: (row: any) => row.categoria?.nome ?? "-" },
          { key: "valorPrevisto", label: "Valor mensal", type: "money" as const },
          { key: "diaVencimento", label: "Dia venc." },
          { key: "obrigatorio", label: "Obrigatório", render: (row: any) => (row.obrigatorio ? "Sim" : "Não") },
          { key: "ativo", label: "Status", render: (row: any) => (row.ativo ? "ativo" : "inativo") },
          {
            key: "acoes",
            label: "Ação",
            render: (row: any) => (
              <form action={gerarContaGastoFixo}>
                <input type="hidden" name="id" value={row.id} />
                <input type="hidden" name="mes" value={mes} />
                <button className="button secondary" type="submit" disabled={!row.ativo}>
                  <CalendarPlus size={16} /> Gerar mês
                </button>
              </form>
            ),
          },
        ]}
        rows={rows}
      />
    </>
  );
}
