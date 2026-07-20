import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { categoriesForTipo, categoryOptions, financialStatusOptions } from "@/lib/page-config";

export default async function NovaCobrancaServicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [servico, categories] = await Promise.all([
    apiGet<any>(`/erp/servicos/${id}`),
    apiGet<any[]>("/erp/categorias"),
  ]);
  const activeCategories = categoriesForTipo(categories.filter((category) => category.ativo), "DESPESA");
  return (
    <>
      <PageHeader title="Registrar cobrança" description={servico ? `Gerar conta a pagar para ${servico.nome}.` : "Gerar conta a pagar."} />
      <FormPage resource="contasPagar" redirectTo="/financeiro/contas-a-pagar" fields={[
        { name: "descricao", label: "Descrição", defaultValue: servico ? `Cobrança ${servico.nome}` : "", required: true },
        { name: "fornecedor", label: "Fornecedor", defaultValue: servico?.fornecedor ?? "" },
        { name: "categoriaId", label: "Categoria", type: "select", options: categoryOptions(activeCategories), required: true },
        { name: "servicoContratadoId", label: "Serviço", defaultValue: Number(id) },
        { name: "valorPrevisto", label: "Valor cobrado", type: "number", defaultValue: Number(servico?.valorEstimado ?? 0), required: true },
        { name: "moeda", label: "Moeda", defaultValue: servico?.moeda ?? "BRL" },
        { name: "dataVencimento", label: "Data de cobrança/vencimento", type: "date", required: true },
        { name: "status", label: "Status", type: "select", options: financialStatusOptions, defaultValue: "PENDENTE", required: true },
        { name: "formaPagamento", label: "Forma de pagamento", defaultValue: servico?.metodoPagamento ?? "" },
        { name: "observacoes", label: "Observações", type: "textarea", full: true },
      ]} />
    </>
  );
}
