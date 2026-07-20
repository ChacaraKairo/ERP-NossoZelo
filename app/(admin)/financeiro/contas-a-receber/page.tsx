import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { columns } from "@/lib/page-config";

export default async function ContasReceberPage() {
  const rows = await apiGet<any[]>("/erp/contasReceber");
  return (
    <>
      <PageHeader title="Contas a receber" description="Receitas previstas, taxas e recebimentos." action={<Link className="button" href="/financeiro/contas-a-receber/nova"><Plus size={17} /> Nova</Link>} />
      <DataTable columns={columns.contasReceber} rows={rows} />
    </>
  );
}
