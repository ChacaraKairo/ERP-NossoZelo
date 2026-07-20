import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { serviceFields } from "@/lib/page-config";

export default function NovoServicoPage() {
  return (
    <>
      <PageHeader title="Novo serviço contratado" description="Registre fornecedor, custo, ambiente, criticidade e referências seguras." />
      <FormPage resource="servicos" redirectTo="/servicos-contratados" fields={[...serviceFields]} />
    </>
  );
}
