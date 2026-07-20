import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";

export default function NovaNotaPage() {
  return (
    <>
      <PageHeader title="Nova nota fiscal" description="Registre NFS-e emitida no portal oficial." />
      <FormPage resource="notas" redirectTo="/fiscal/notas-fiscais" fields={[
        { name: "numero", label: "Número", required: true },
        { name: "serie", label: "Série" },
        { name: "dataEmissao", label: "Data de emissão", type: "date", required: true },
        { name: "dataCompetencia", label: "Competência", type: "date", required: true },
        { name: "tomadorNome", label: "Tomador", required: true },
        { name: "tomadorDocumento", label: "Documento do tomador" },
        { name: "descricaoServico", label: "Descrição do serviço", type: "textarea", required: true, full: true },
        { name: "valorBruto", label: "Valor bruto", type: "number", required: true },
        { name: "status", label: "Status", defaultValue: "emitida", required: true },
        { name: "linkExterno", label: "Link externo" },
        { name: "observacoes", label: "Observações", type: "textarea", full: true },
      ]} />
    </>
  );
}
