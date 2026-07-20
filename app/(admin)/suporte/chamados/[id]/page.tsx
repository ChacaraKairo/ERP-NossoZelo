import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { dateBR, statusLabel } from "@/lib/format";

export default async function ChamadoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chamado = await apiGet<any>(`/erp/chamados/${id}`);
  if (!chamado) return <PageHeader title="Chamado não encontrado" />;
  return (
    <>
      <PageHeader title={`#${chamado.id} · ${chamado.titulo}`} description={`${statusLabel(chamado.status)} · ${statusLabel(chamado.prioridade)}`} />
      <div className="grid two">
        <div className="card">
          <h2>Descrição</h2>
          <p>{chamado.descricao}</p>
          <p><strong>Abertura:</strong> {dateBR(chamado.dataAbertura)}</p>
          <p><strong>Módulo:</strong> {chamado.modulo ?? "-"}</p>
        </div>
        <div className="card">
          <h2>Solução</h2>
          <p>{chamado.solucao ?? "Ainda sem solução registrada."}</p>
        </div>
      </div>
    </>
  );
}
