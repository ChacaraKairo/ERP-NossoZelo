import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { categoriesForTipo, categoryOptions } from "@/lib/page-config";

export default async function NovoGastoFixoPage() {
  const categories = await apiGet<any[]>("/erp/categorias");
  const expenseCategories = categoriesForTipo(categories.filter((category) => category.ativo), "DESPESA");

  return (
    <>
      <PageHeader title="Novo gasto fixo" description="Cadastre despesas mensais obrigatórias, como aluguel, internet, contador, sistemas e impostos recorrentes." />
      <FormPage resource="gastosFixos" redirectTo="/financeiro/gastos-fixos" fields={[
        { name: "descricao", label: "Descrição", required: true },
        { name: "fornecedor", label: "Fornecedor" },
        { name: "categoriaId", label: "Categoria de despesa", type: "select", options: categoryOptions(expenseCategories), required: true },
        { name: "valorPrevisto", label: "Valor mensal previsto", type: "number", required: true },
        { name: "moeda", label: "Moeda", defaultValue: "BRL" },
        { name: "diaVencimento", label: "Dia de vencimento", type: "number", required: true },
        { name: "obrigatorio", label: "Obrigatório", type: "checkbox", defaultValue: true },
        { name: "ativo", label: "Ativo", type: "checkbox", defaultValue: true },
        { name: "formaPagamento", label: "Forma de pagamento" },
        { name: "observacoes", label: "Observações", type: "textarea", full: true },
      ]} />
    </>
  );
}
