import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteResourceButton } from "@/components/DeleteResourceButton";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { dateBR, money, statusLabel } from "@/lib/format";

export default async function LancamentoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lancamento = await apiGet<any>(`/erp/lancamentos/${id}`);
  if (!lancamento) return <PageHeader title="Lançamento não encontrado" />;

  return (
    <>
      <PageHeader
        title={lancamento.descricao}
        description={`${statusLabel(lancamento.tipo)} · ${statusLabel(lancamento.status)}`}
        action={
          <div className="actions-row">
            <Link className="button secondary" href={`/financeiro/lancamentos/${lancamento.id}/editar`}><Pencil size={16} /> Editar</Link>
            <DeleteResourceButton resource="lancamentos" id={lancamento.id} redirectTo="/financeiro/lancamentos" />
          </div>
        }
      />
      <div className="grid two">
        <div className="card">
          <h2>Valores</h2>
          <p><strong>Categoria:</strong> {lancamento.categoria?.nome ?? "-"}</p>
          <p><strong>Valor bruto:</strong> {money(lancamento.valorBruto)}</p>
          <p><strong>Taxas:</strong> {money(lancamento.valorTaxas)}</p>
          <p><strong>Valor líquido:</strong> {money(lancamento.valorLiquido)}</p>
        </div>
        <div className="card">
          <h2>Datas e origem</h2>
          <p><strong>Competência:</strong> {dateBR(lancamento.dataCompetencia)}</p>
          <p><strong>Vencimento:</strong> {dateBR(lancamento.dataVencimento)}</p>
          <p><strong>Pagamento:</strong> {dateBR(lancamento.dataPagamento)}</p>
          <p><strong>Origem:</strong> {lancamento.origem ?? "-"}</p>
          <p><strong>Forma:</strong> {lancamento.formaPagamento ?? "-"}</p>
        </div>
      </div>
      {lancamento.observacoes ? <div className="card" style={{ marginTop: 16 }}><h2>Observações</h2><p>{lancamento.observacoes}</p></div> : null}
    </>
  );
}
