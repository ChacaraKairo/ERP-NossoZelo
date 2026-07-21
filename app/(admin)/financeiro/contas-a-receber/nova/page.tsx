import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { apiGet } from "@/lib/api";
import { categoriesForTipo, categoryOptions, financialStatusOptions } from "@/lib/page-config";

export default async function NovaContaReceberPage() {
  const [categories, clientes, prestadores, assinaturas] = await Promise.all([
    apiGet<any[]>("/erp/categorias"),
    apiGet<any[]>("/erp/clientes"),
    apiGet<any[]>("/erp/prestadores"),
    apiGet<any[]>("/erp/assinaturas"),
  ]);
  const activeCategories = categoriesForTipo(categories.filter((category) => category.ativo), "RECEITA");
  return (
    <>
      <PageHeader title="Nova conta a receber" description="Cadastre um valor esperado de cliente, prestador ou assinatura." />
      <FormPage resource="contasReceber" redirectTo="/financeiro/contas-a-receber" fields={[
        { name: "descricao", label: "Descrição", required: true },
        { name: "origem", label: "Origem", defaultValue: "manual" },
        { name: "categoriaId", label: "Categoria", type: "select", options: categoryOptions(activeCategories), required: true },
        { name: "clienteId", label: "Cliente", type: "select", options: clientes.map((c) => ({ label: c.nome, value: c.id })) },
        { name: "prestadorId", label: "Prestador", type: "select", options: prestadores.map((p) => ({ label: p.nome, value: p.id })) },
        { name: "assinaturaId", label: "Assinatura", type: "select", options: assinaturas.map((a) => ({ label: `${a.prestador.nome} · ${a.plano}`, value: a.id })) },
        { name: "valorPrevisto", label: "Valor previsto", type: "number", required: true },
        { name: "valorRecebido", label: "Valor recebido", type: "number" },
        { name: "valorTaxas", label: "Taxas", type: "number", defaultValue: 0 },
        { name: "valorLiquido", label: "Valor líquido", type: "number" },
        { name: "dataVencimento", label: "Vencimento", type: "date", required: true },
        { name: "dataRecebimento", label: "Recebimento", type: "date" },
        { name: "status", label: "Status", type: "select", options: financialStatusOptions, defaultValue: "PENDENTE", required: true },
        { name: "formaPagamento", label: "Forma de pagamento" },
        { name: "gateway", label: "Gateway" },
        { name: "gatewayReferencia", label: "Referência gateway" },
        { name: "observacoes", label: "Observações", type: "textarea", full: true },
      ]} />
    </>
  );
}
