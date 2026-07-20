import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { priorityOptions } from "@/lib/page-config";

export default function NovoChamadoPage() {
  return (
    <>
      <PageHeader title="Novo chamado" description="Registre solicitação, problema, dúvida ou incidente." />
      <FormPage resource="chamados" redirectTo="/suporte/chamados" fields={[
        { name: "titulo", label: "Título", required: true },
        { name: "tipo", label: "Tipo", defaultValue: "suporte", required: true },
        { name: "prioridade", label: "Prioridade", type: "select", options: priorityOptions, defaultValue: "MEDIA", required: true },
        { name: "status", label: "Status", defaultValue: "aberto", required: true },
        { name: "modulo", label: "Módulo relacionado" },
        { name: "descricao", label: "Descrição", type: "textarea", full: true, required: true },
        { name: "solucao", label: "Solução", type: "textarea", full: true },
      ]} />
    </>
  );
}
