import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";

export default async function AuditoriaPage() {
  const rows = await apiGet<any[]>("/erp/auditoria");
  return (
    <>
      <PageHeader title="Auditoria" description="Ações administrativas sensíveis registradas pelo ERP." />
      <DataTable columns={[
        { key: "criadoEm", label: "Data", type: "date" },
        { key: "usuario", label: "Usuário", render: (row: any) => row.usuario?.nome ?? "-" },
        { key: "acao", label: "Ação" },
        { key: "entidadeTipo", label: "Entidade" },
        { key: "entidadeId", label: "ID" },
        { key: "resultado", label: "Resultado", type: "status" },
        { key: "motivo", label: "Motivo" },
      ]} rows={rows} />
    </>
  );
}
