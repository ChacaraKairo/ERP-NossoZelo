import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { dateBR, money, statusLabel } from "@/lib/format";

export default async function ServicoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const servico = await apiGet<any>(`/erp/servicos/${id}`);
  if (!servico) return <PageHeader title="Serviço não encontrado" />;
  return (
    <>
      <PageHeader title={servico.nome} description={`${servico.fornecedor} · ${servico.categoria}`} action={<Link className="button" href={`/servicos-contratados/${servico.id}/cobrancas/nova`}>Registrar cobrança</Link>} />
      <div className="grid two">
        <div className="card">
          <h2>Dados do serviço</h2>
          <p><strong>Status:</strong> {statusLabel(servico.status)}</p>
          <p><strong>Ambiente:</strong> {servico.ambiente}</p>
          <p><strong>Criticidade:</strong> {statusLabel(servico.criticidade)}</p>
          <p><strong>Plano:</strong> {servico.plano ?? "-"}</p>
          <p><strong>Custo previsto:</strong> {money(servico.valorEstimado)}</p>
          <p><strong>Renovação:</strong> {dateBR(servico.dataRenovacao)}</p>
        </div>
        <div className="card">
          <h2>Controle seguro</h2>
          <p><strong>Responsável:</strong> {servico.responsavelInterno ?? "-"}</p>
          <p><strong>Possui credenciais:</strong> {servico.possuiCredenciais ? "sim" : "não"}</p>
          <p><strong>Local das credenciais:</strong> {servico.localCredenciais ?? "-"}</p>
          <p><strong>Última rotação:</strong> {dateBR(servico.ultimaRotacaoCredenciais)}</p>
          <p className="muted">O ERP registra apenas referência segura, nunca senha, token ou chave secreta.</p>
        </div>
      </div>
    </>
  );
}
