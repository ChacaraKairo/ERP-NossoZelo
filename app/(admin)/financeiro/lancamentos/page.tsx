import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { DeleteResourceButton } from "@/components/DeleteResourceButton";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { columns } from "@/lib/page-config";

export default async function LancamentosPage() {
  const rows = await apiGet<any[]>("/erp/lancamentos");
  return (
    <>
      <PageHeader title="Lançamentos" description="Receitas e despesas registradas." action={<Link className="button" href="/financeiro/lancamentos/novo"><Plus size={17} /> Novo</Link>} />
      <DataTable columns={[
        ...columns.lancamentos,
        {
          key: "acoes",
          label: "Ações",
          render: (row: any) => (
            <div className="actions-row">
              <Link className="icon-button secondary" title="Ver" aria-label="Ver" href={`/financeiro/lancamentos/${row.id}`}><Eye size={16} /></Link>
              <Link className="icon-button secondary" title="Editar" aria-label="Editar" href={`/financeiro/lancamentos/${row.id}/editar`}><Pencil size={16} /></Link>
              <DeleteResourceButton resource="lancamentos" id={row.id} compact />
            </div>
          ),
        },
      ]} rows={rows} />
    </>
  );
}
