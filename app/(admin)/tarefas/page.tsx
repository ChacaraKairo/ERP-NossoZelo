import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { columns } from "@/lib/page-config";

export default async function TarefasPage() {
  const rows = await apiGet<any[]>("/erp/tarefas");
  return (
    <>
      <PageHeader title="Tarefas internas" description="Bugs, melhorias, rotinas fiscais, financeiras e operacionais." action={<Link className="button" href="/tarefas/nova"><Plus size={17} /> Nova</Link>} />
      <DataTable columns={columns.tarefas} rows={rows} />
    </>
  );
}
