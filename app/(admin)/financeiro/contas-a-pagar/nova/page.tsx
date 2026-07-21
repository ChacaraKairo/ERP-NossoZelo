import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { categoriesForTipo, categoryOptions, financialStatusOptions } from "@/lib/page-config";

export default async function NovaContaPagarPage() {
  const [categories, services] = await Promise.all([
    apiGet<any[]>("/erp/categorias"),
    apiGet<any[]>("/erp/servicos"),
  ]);
  const activeCategories = categoriesForTipo(categories.filter((category) => category.ativo), "DESPESA");
  return (
    <>
      <PageHeader title="Nova conta a pagar" description="Cadastre despesa futura ou recorrente." />
      <FormPage resource="contasPagar" redirectTo="/financeiro/contas-a-pagar" fields={[
        { name: "descricao", label: "Descrição", required: true },
        { name: "fornecedor", label: "Fornecedor" },
        { name: "categoriaId", label: "Categoria", type: "select", options: categoryOptions(activeCategories), required: true },
        { name: "valorPrevisto", label: "Valor previsto", type: "number", required: true },
        { name: "valorPago", label: "Valor pago", type: "number" },
        { name: "moeda", label: "Moeda", defaultValue: "BRL" },
        { name: "dataVencimento", label: "Vencimento", type: "date", required: true },
        { name: "dataPagamento", label: "Pagamento", type: "date" },
        { name: "recorrente", label: "Recorrente", type: "checkbox" },
        { name: "periodicidade", label: "Periodicidade" },
        { name: "status", label: "Status", type: "select", options: financialStatusOptions, defaultValue: "PENDENTE", required: true },
        { name: "formaPagamento", label: "Forma de pagamento" },
        { name: "servicoContratadoId", label: "Serviço vinculado", type: "select", options: services.map((s) => ({ label: s.nome, value: s.id })) },
        { name: "observacoes", label: "Observações", type: "textarea", full: true },
      ]} />
    </>
  );
}
