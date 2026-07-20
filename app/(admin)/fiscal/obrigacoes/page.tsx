import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { columns } from "@/lib/page-config";

export default async function ObrigacoesPage() {
  const rows = await apiGet<any[]>("/erp/obrigacoes");
  return (
    <>
      <PageHeader title="Obrigações MEI" description="DAS mensal, declaração anual e demais pendências." action={<Link className="button" href="/fiscal/obrigacoes/nova"><Plus size={17} /> Nova</Link>} />
      <DataTable columns={columns.obrigacoes} rows={rows} />
    </>
  );
}
