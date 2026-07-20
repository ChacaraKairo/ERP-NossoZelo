import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { columns } from "@/lib/page-config";

export default async function NotasPage() {
  const rows = await apiGet<any[]>("/erp/notas");
  return (
    <>
      <PageHeader title="Notas fiscais" description="NFS-e emitidas manualmente fora do ERP." action={<Link className="button" href="/fiscal/notas-fiscais/nova"><Plus size={17} /> Nova</Link>} />
      <DataTable columns={columns.notas} rows={rows} />
    </>
  );
}
