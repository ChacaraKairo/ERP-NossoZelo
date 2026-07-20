import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { categoryOptions, financialStatusOptions, financialTypeOptions } from "@/lib/page-config";

export default async function NovoLancamentoPage() {
  const categories = (await apiGet<any[]>("/erp/categorias")).filter((category) => category.ativo);
  return (
    <>
      <PageHeader title="Novo lançamento" description="Registre uma receita ou despesa manual." />
      <FormPage resource="lancamentos" redirectTo="/financeiro/lancamentos" fields={[
        { name: "tipo", label: "Tipo", type: "select", options: financialTypeOptions, defaultValue: "RECEITA", required: true },
        { name: "categoriaId", label: "Categoria", type: "select", options: categoryOptions(categories), required: true },
        { name: "descricao", label: "Descrição", required: true },
        { name: "valorBruto", label: "Valor bruto", type: "number", required: true },
        { name: "valorTaxas", label: "Taxas", type: "number", defaultValue: 0 },
        { name: "valorLiquido", label: "Valor líquido", type: "number", required: true },
        { name: "moeda", label: "Moeda", defaultValue: "BRL" },
        { name: "dataCompetencia", label: "Competência", type: "date", required: true },
        { name: "dataVencimento", label: "Vencimento", type: "date" },
        { name: "dataPagamento", label: "Pagamento", type: "date" },
        { name: "status", label: "Status", type: "select", options: financialStatusOptions, defaultValue: "PENDENTE", required: true },
        { name: "formaPagamento", label: "Forma de pagamento" },
        { name: "origem", label: "Origem", defaultValue: "manual" },
        { name: "observacoes", label: "Observações", type: "textarea", full: true },
      ]} />
    </>
  );
}
