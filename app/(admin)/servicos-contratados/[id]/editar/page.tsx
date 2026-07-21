import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { serviceFieldsWithValues } from "@/lib/page-config";

export default async function EditarServicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const servico = await apiGet<any>(`/erp/servicos/${id}`);

  return (
    <>
      <PageHeader title="Editar serviço contratado" description={servico?.nome ?? "Atualize os dados do serviço."} />
      <FormPage
        resource="servicos"
        resourcePath={`servicos/${id}`}
        method="PATCH"
        redirectTo={`/servicos-contratados/${id}`}
        fields={serviceFieldsWithValues(servico)}
      />
    </>
  );
}
