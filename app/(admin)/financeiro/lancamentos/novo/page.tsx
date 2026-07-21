import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { lancamentoFields } from "@/lib/page-config";

export default async function NovoLancamentoPage() {
  const categories = (await apiGet<any[]>("/erp/categorias")).filter((category) => category.ativo);
  return (
    <>
      <PageHeader title="Novo lançamento" description="Registre uma receita ou despesa manual." />
      <FormPage resource="lancamentos" redirectTo="/financeiro/lancamentos" fields={lancamentoFields(categories)} />
    </>
  );
}
