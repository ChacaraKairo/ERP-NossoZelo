import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { columns } from "@/lib/page-config";

export default async function ContasPagarPage() {
  const rows = await apiGet<any[]>("/erp/contasPagar");
  return (
    <>
      <PageHeader title="Contas a pagar" description="Despesas futuras, recorrentes e vencimentos." action={<Link className="button" href="/financeiro/contas-a-pagar/nova"><Plus size={17} /> Nova</Link>} />
      <DataTable columns={columns.contasPagar} rows={rows} />
    </>
  );
}
