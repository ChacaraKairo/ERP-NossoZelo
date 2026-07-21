import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { lancamentoFields } from "@/lib/page-config";

export default async function EditarLancamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lancamento, categories] = await Promise.all([
    apiGet<any>(`/erp/lancamentos/${id}`),
    apiGet<any[]>("/erp/categorias"),
  ]);
  const activeCategories = categories.filter((category) => category.ativo);

  return (
    <>
      <PageHeader title="Editar lançamento" description={lancamento?.descricao ?? "Atualize os dados do lançamento."} />
      <FormPage
        resource="lancamentos"
        resourcePath={`lancamentos/${id}`}
        method="PATCH"
        redirectTo={`/financeiro/lancamentos/${id}`}
        fields={lancamentoFields(activeCategories, lancamento)}
      />
    </>
  );
}
