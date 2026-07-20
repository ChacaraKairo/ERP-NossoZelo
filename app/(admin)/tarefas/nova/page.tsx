import { FormPage } from "@/components/FormPage";
import { PageHeader } from "@/components/PageHeader";
import { priorityOptions, taskStatusOptions } from "@/lib/page-config";

export default function NovaTarefaPage() {
  return (
    <>
      <PageHeader title="Nova tarefa" description="Crie uma demanda interna com prioridade, prazo e módulo relacionado." />
      <FormPage resource="tarefas" redirectTo="/tarefas" fields={[
        { name: "titulo", label: "Título", required: true },
        { name: "tipo", label: "Tipo", defaultValue: "administrativo", required: true },
        { name: "prioridade", label: "Prioridade", type: "select", options: priorityOptions, defaultValue: "MEDIA", required: true },
        { name: "status", label: "Status", type: "select", options: taskStatusOptions, defaultValue: "PENDENTE", required: true },
        { name: "modulo", label: "Módulo relacionado" },
        { name: "dataLimite", label: "Prazo", type: "date" },
        { name: "origem", label: "Origem" },
        { name: "descricao", label: "Descrição", type: "textarea", full: true },
      ]} />
    </>
  );
}
