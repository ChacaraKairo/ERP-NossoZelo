import type { Column } from "@/components/DataTable";
import type { Field } from "@/components/FormPage";

export const priorityOptions = [
  { label: "Baixa", value: "BAIXA" },
  { label: "Média", value: "MEDIA" },
  { label: "Alta", value: "ALTA" },
  { label: "Crítica", value: "CRITICA" },
];

export const financialStatusOptions = [
  { label: "Pendente", value: "PENDENTE" },
  { label: "Pago", value: "PAGO" },
  { label: "Recebido", value: "RECEBIDO" },
  { label: "Vencido", value: "VENCIDO" },
  { label: "Cancelado", value: "CANCELADO" },
];

export const taskStatusOptions = [
  { label: "Pendente", value: "PENDENTE" },
  { label: "Em andamento", value: "EM_ANDAMENTO" },
  { label: "Aguardando", value: "AGUARDANDO" },
  { label: "Concluída", value: "CONCLUIDA" },
  { label: "Cancelada", value: "CANCELADA" },
];

export const financialTypeOptions = [
  { label: "Receita", value: "RECEITA" },
  { label: "Despesa", value: "DESPESA" },
];

export function categoryOptions(categories: { id: number; nome: string; tipo: string }[]) {
  return categories.map((category) => ({
    label: `${category.nome} · ${category.tipo.toLowerCase()}`,
    value: category.id,
    tipo: category.tipo,
  }));
}

export function categoriesForTipo(categories: { id: number; nome: string; tipo: string }[], tipo: "RECEITA" | "DESPESA") {
  return categories.filter((category) => category.tipo === tipo || category.tipo === "AMBOS");
}

export const columns = {
  lancamentos: [
    { key: "dataCompetencia", label: "Data", type: "date" },
    { key: "tipo", label: "Tipo", type: "status" },
    { key: "descricao", label: "Descrição" },
    { key: "categoria", label: "Categoria", render: (row: any) => row.categoria?.nome ?? "-" },
    { key: "valorBruto", label: "Bruto", type: "money" },
    { key: "valorLiquido", label: "Líquido", type: "money" },
    { key: "status", label: "Status", type: "status" },
    { key: "origem", label: "Origem" },
  ],
  contasPagar: [
    { key: "descricao", label: "Descrição" },
    { key: "fornecedor", label: "Fornecedor" },
    { key: "categoria", label: "Categoria", render: (row: any) => row.categoria?.nome ?? "-" },
    { key: "valorPrevisto", label: "Valor", type: "money" },
    { key: "dataVencimento", label: "Vencimento", type: "date" },
    { key: "periodicidade", label: "Recorrência" },
    { key: "status", label: "Status", type: "status" },
    { key: "servicoContratado", label: "Serviço", render: (row: any) => row.servicoContratado?.nome ?? "-" },
  ],
  gastosFixos: [
    { key: "descricao", label: "Descrição" },
    { key: "fornecedor", label: "Fornecedor" },
    { key: "categoria", label: "Categoria", render: (row: any) => row.categoria?.nome ?? "-" },
    { key: "valorPrevisto", label: "Valor mensal", type: "money" },
    { key: "diaVencimento", label: "Dia venc." },
    { key: "obrigatorio", label: "Obrigatório", render: (row: any) => (row.obrigatorio ? "Sim" : "Não") },
    { key: "ativo", label: "Status", render: (row: any) => (row.ativo ? "ativo" : "inativo") },
  ],
  contasReceber: [
    { key: "descricao", label: "Descrição" },
    { key: "origem", label: "Origem" },
    { key: "valorPrevisto", label: "Valor", type: "money" },
    { key: "valorLiquido", label: "Líquido", type: "money" },
    { key: "dataVencimento", label: "Vencimento", type: "date" },
    { key: "status", label: "Status", type: "status" },
    { key: "formaPagamento", label: "Forma" },
  ],
  servicos: [
    { key: "nome", label: "Nome" },
    { key: "fornecedor", label: "Fornecedor" },
    { key: "categoria", label: "Categoria" },
    { key: "ambiente", label: "Ambiente" },
    { key: "criticidade", label: "Criticidade", type: "status" },
    { key: "status", label: "Status", type: "status" },
    { key: "valorEstimado", label: "Custo previsto", type: "money" },
    { key: "dataRenovacao", label: "Renovação", type: "date" },
    { key: "responsavelInterno", label: "Responsável" },
  ],
  obrigacoes: [
    { key: "tipo", label: "Tipo" },
    { key: "ano", label: "Ano" },
    { key: "mes", label: "Mês" },
    { key: "valor", label: "Valor", type: "money" },
    { key: "dataVencimento", label: "Vencimento", type: "date" },
    { key: "status", label: "Status", type: "status" },
    { key: "dataPagamento", label: "Pagamento", type: "date" },
  ],
  notas: [
    { key: "numero", label: "Número" },
    { key: "tomadorNome", label: "Tomador" },
    { key: "tomadorDocumento", label: "Documento" },
    { key: "valorBruto", label: "Valor", type: "money" },
    { key: "dataEmissao", label: "Emissão", type: "date" },
    { key: "status", label: "Status", type: "status" },
  ],
  chamados: [
    { key: "id", label: "Código", render: (row: any) => `#${row.id}` },
    { key: "titulo", label: "Título" },
    { key: "tipo", label: "Tipo" },
    { key: "prioridade", label: "Prioridade", type: "status" },
    { key: "status", label: "Status", type: "status" },
    { key: "modulo", label: "Módulo" },
    { key: "dataAbertura", label: "Abertura", type: "date" },
  ],
  tarefas: [
    { key: "titulo", label: "Título" },
    { key: "tipo", label: "Tipo" },
    { key: "prioridade", label: "Prioridade", type: "status" },
    { key: "status", label: "Status", type: "status" },
    { key: "modulo", label: "Módulo" },
    { key: "dataLimite", label: "Prazo", type: "date" },
  ],
} satisfies Record<string, Column<any>[]>;

export const serviceFields = [
  { name: "nome", label: "Nome", required: true },
  { name: "fornecedor", label: "Fornecedor", required: true },
  { name: "categoria", label: "Categoria", required: true },
  { name: "ambiente", label: "Ambiente", defaultValue: "producao" },
  { name: "criticidade", label: "Criticidade", type: "select", options: priorityOptions, defaultValue: "MEDIA", required: true },
  { name: "status", label: "Status", defaultValue: "ativo", required: true },
  { name: "plano", label: "Plano" },
  { name: "moeda", label: "Moeda", defaultValue: "BRL" },
  { name: "valorEstimado", label: "Valor estimado", type: "number" },
  { name: "valorUltimaCobranca", label: "Última cobrança", type: "number" },
  { name: "periodicidade", label: "Periodicidade" },
  { name: "dataInicio", label: "Data de início", type: "date" },
  { name: "dataRenovacao", label: "Data de renovação", type: "date" },
  { name: "metodoPagamento", label: "Método de pagamento" },
  { name: "responsavelInterno", label: "Responsável interno" },
  { name: "possuiCredenciais", label: "Possui credenciais", type: "checkbox" },
  { name: "localCredenciais", label: "Local seguro das credenciais" },
  { name: "ultimaRotacaoCredenciais", label: "Última rotação", type: "date" },
  { name: "urlPainel", label: "URL do painel" },
  { name: "urlSuporte", label: "URL de suporte" },
  { name: "descricao", label: "Descrição", type: "textarea", full: true },
  { name: "observacoes", label: "Observações", type: "textarea", full: true },
] as const;

export function lancamentoFields(categories: { id: number; nome: string; tipo: string }[], values: Record<string, any> = {}) {
  return [
    { name: "tipo", label: "Tipo", type: "select", options: financialTypeOptions, defaultValue: values.tipo ?? "RECEITA", required: true },
    { name: "categoriaId", label: "Categoria", type: "select", options: categoryOptions(categories), defaultValue: values.categoriaId, required: true },
    { name: "descricao", label: "Descrição", defaultValue: values.descricao, required: true },
    { name: "valorBruto", label: "Valor bruto", type: "number", defaultValue: values.valorBruto, required: true },
    { name: "valorTaxas", label: "Taxas", type: "number", defaultValue: values.valorTaxas ?? 0 },
    { name: "valorLiquido", label: "Valor líquido", type: "number", defaultValue: values.valorLiquido, required: true },
    { name: "moeda", label: "Moeda", defaultValue: values.moeda ?? "BRL" },
    { name: "dataCompetencia", label: "Competência", type: "date", defaultValue: inputDate(values.dataCompetencia), required: true },
    { name: "dataVencimento", label: "Vencimento", type: "date", defaultValue: inputDate(values.dataVencimento) },
    { name: "dataPagamento", label: "Pagamento", type: "date", defaultValue: inputDate(values.dataPagamento) },
    { name: "status", label: "Status", type: "select", options: financialStatusOptions, defaultValue: values.status ?? "PENDENTE", required: true },
    { name: "formaPagamento", label: "Forma de pagamento", defaultValue: values.formaPagamento },
    { name: "origem", label: "Origem", defaultValue: values.origem ?? "manual" },
    { name: "observacoes", label: "Observações", type: "textarea", defaultValue: values.observacoes, full: true },
  ] satisfies Field[];
}

export function serviceFieldsWithValues(values: Record<string, any> = {}) {
  return serviceFields.map((field) => {
    const typedField = field as Field;
    return {
      ...typedField,
      defaultValue: typedField.type === "date" ? inputDate(values[typedField.name]) : values[typedField.name] ?? typedField.defaultValue,
    };
  }) satisfies Field[];
}

function inputDate(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}
