import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { columns } from "@/lib/page-config";

export default async function LancamentosPage() {
  const rows = await apiGet<any[]>("/erp/lancamentos");
  return (
    <>
      <PageHeader title="Lançamentos" description="Receitas e despesas registradas." action={<Link className="button" href="/financeiro/lancamentos/novo"><Plus size={17} /> Novo</Link>} />
      <DataTable columns={columns.lancamentos} rows={rows} />
    </>
  );
}
