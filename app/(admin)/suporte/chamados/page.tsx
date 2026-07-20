import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { columns } from "@/lib/page-config";

export default async function ChamadosPage() {
  const rows = await apiGet<any[]>("/erp/chamados");
  return (
    <>
      <PageHeader title="Chamados" description="Suporte, incidentes e solicitações administrativas." action={<Link className="button" href="/suporte/chamados/novo"><Plus size={17} /> Novo</Link>} />
      <DataTable columns={columns.chamados} rows={rows} />
    </>
  );
}
