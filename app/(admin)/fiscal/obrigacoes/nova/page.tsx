import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { financialStatusOptions } from "@/lib/page-config";

export default function NovaObrigacaoPage() {
  return (
    <>
      <PageHeader title="Nova obrigação MEI" description="Registre DAS, DASN-SIMEI ou outra obrigação fiscal." />
      <FormPage resource="obrigacoes" redirectTo="/fiscal/obrigacoes" fields={[
        { name: "tipo", label: "Tipo", defaultValue: "DAS", required: true },
        { name: "ano", label: "Ano", type: "number", defaultValue: new Date().getFullYear(), required: true },
        { name: "mes", label: "Mês", type: "number" },
        { name: "descricao", label: "Descrição" },
        { name: "valor", label: "Valor", type: "number" },
        { name: "dataVencimento", label: "Vencimento", type: "date", required: true },
        { name: "dataPagamento", label: "Pagamento", type: "date" },
        { name: "status", label: "Status", type: "select", options: financialStatusOptions, defaultValue: "PENDENTE", required: true },
        { name: "observacoes", label: "Observações", type: "textarea", full: true },
      ]} />
    </>
  );
}
